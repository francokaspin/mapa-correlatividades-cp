import { useState, useEffect, useRef } from "react";
import {
  getProgressKey,
  migrateProgress,
  getSubjectStatus,
  parseProgress,
  averageOf,
  normalizeNota,
  formatAR,
} from "./data/evaluator.js";

// Gate de tipeo del input de nota (permisivo, NO valida rango): hasta 2 dígitos
// enteros y hasta 2 decimales tras coma o punto. El vacío entra. El rango [4,10]
// se valida recién en el blur (ver onBlur). Ver normalizeNota / formatAR.
const NOTA_TIPEO = /^\d{0,2}([.,]\d{0,2})?$/;

/* ============================================================
   MAPA DE CORRELATIVIDADES · componente genérico (data-driven)
   Renderiza cualquier carrera a partir de:
     carrera.data.plan  → bloques de materias ({ general, idioma, ... })
     carrera.data.ui    → presentación (eyebrow, bloques, milestones, footer)
     carrera.color      → color de acento (--accent)
   El estado de cada materia se resuelve con el evaluador genérico
   (src/data/evaluator.js). Para CP el resultado es idéntico a hoy.
   ============================================================ */

// Ancestros + reducción transitiva sobre las flechas DIRECTAS (req por id).
// Los requisitos-objeto (min, orientation, or, …) no son flechas y se
// muestran como copy especial, igual que en el mapa original.
function buildGraph(items) {
  const byId = Object.fromEntries(items.map((m) => [m.id, m]));
  const stringReqs = (m) => (Array.isArray(m?.req) ? m.req : []).filter((r) => typeof r === "string");
  const ANC = {};
  const anc = (id) => {
    if (ANC[id]) return ANC[id];
    const s = new Set();
    stringReqs(byId[id]).forEach((r) => {
      s.add(r);
      anc(r).forEach((x) => s.add(x));
    });
    return (ANC[id] = s);
  };
  const RED = {};
  items.forEach((m) => {
    const req = stringReqs(m);
    RED[m.id] = req.filter((r) => !req.some((r2) => r2 !== r && anc(r2).has(r)));
  });
  const ABRE = {};
  items.forEach((m) => (RED[m.id] || []).forEach((r) => (ABRE[r] = [...(ABRE[r] || []), m.id])));
  return { byId, RED, ABRE };
}

// Mínimo "de la base" que pide una materia (it.min o un req { min, of:'general' }).
function baseMinOf(it, countBase) {
  if (typeof it.min === "number") return it.min;
  const reqs = Array.isArray(it.req) ? it.req : [];
  for (const r of reqs) {
    if (r && typeof r === "object" && typeof r.min === "number" && (r.of == null || r.of === "general" || r.of === countBase)) {
      return r.min;
    }
  }
  return null;
}

// Cuánto pesa una tarjeta en el conteo. Una tarjeta-grupo declara `cantidad`
// (las 6 Sociologías Especiales de Sociología pesan 6); el resto pesa 1.
function pesoDe(it) {
  // Requisito de cursada (las PPP del 504): se marca y gatea, pero pesa 0 en
  // la barra y en el conteo del bloque.
  if (it.requisito) return 0;
  return typeof it.cantidad === "number" ? it.cantidad : 1;
}

const sumaPesos = (items, okSet) =>
  items.reduce((acc, it) => acc + (okSet.has(it.id) ? pesoDe(it) : 0), 0);

const totalPesos = (items) => items.reduce((acc, it) => acc + pesoDe(it), 0);

function hasOrientationReq(it) {
  const scan = (r) =>
    !!r &&
    typeof r === "object" &&
    (r.orientation === true ||
      (Array.isArray(r.includes) && r.includes.some(scan)) ||
      (Array.isArray(r.or) && r.or.some(scan)) ||
      (Array.isArray(r.and) && r.and.some(scan)));
  return (Array.isArray(it.req) ? it.req : []).some(scan);
}

export default function MapaCarrera({ carrera }) {
  const { plan, ui } = carrera.data;
  const accent = carrera.color || "#C8D62B";

  const blocks = ui.blocks;
  // `countBase` = la pila que resuelve los req { min, of: 'general' }.
  const baseArr = plan[ui.countBase] || [];
  const baseIds = baseArr.map((m) => m.id);
  // `countKeys` = los bloques que suman a la barra. Por defecto solo countBase
  // (CP/RT/TS); Sociología además cuenta el tramo optativo (16 + 6 + 3 = 25).
  const countKeys = ui.countKeys || [ui.countBase];
  // Grupos que suman a la barra. `countGroups` (504) declara topes por bloque;
  // si no está, se derivan de countKeys (CP/RT/TS/socio/440), un grupo por clave.
  // Cada grupo aporta min(aprobadas, tope):
  //   - tope explícito `cap` (504: Cs. Sociales 3/5, Introductorias 3, …)
  //   - bloque con `ori` (440/504): cuenta solo la orientación/ciclo elegido, y
  //     el tope es el tamaño de una orientación (todas iguales → total estable)
  //   - sin tope: el peso total del bloque (comportamiento de siempre)
  const countGroups = ui.countGroups || countKeys.map((k) => ({ key: k }));
  const orientaciones = plan.orientaciones || [];
  const orientationIds = orientaciones.map((o) => o.id);

  // Todas las materias (en el orden de los bloques) y grafo de flechas.
  const TODAS = blocks.flatMap((b) => plan[b.planKey] || []);
  const { byId, RED, ABRE } = buildGraph(TODAS);
  const KEY = getProgressKey(carrera.id);

  const [ok, setOk] = useState(() => new Set());
  const [ori, setOri] = useState(null);
  // Notas cargadas: { [id]: nota } para materias comunes, { [id]: (nota|null)[] }
  // para tarjetas-grupo (una por cupo). Ver evaluator.collectNotas/averageOf.
  const [notas, setNotas] = useState(() => ({}));
  const [listo, setListo] = useState(false);
  const [nuevas, setNuevas] = useState(() => new Set());
  const [tiembla, setTiembla] = useState(null);
  const [confirma, setConfirma] = useState(false);
  const tNuevas = useRef(null);
  const tTiembla = useRef(null);

  useEffect(() => {
    try {
      const saved = carrera.data.legacyKey
        ? migrateProgress(carrera.id, carrera.data.legacyKey)
        : parseProgress(localStorage.getItem(KEY));
      if (saved) {
        setOk(new Set(saved.a || []));
        setOri(saved.o || null);
        setNotas(saved.n && typeof saved.n === "object" ? saved.n : {});
      }
    } catch (e) {
      /* sin avance guardado todavía */
    }
    setListo(true);
    return () => {
      clearTimeout(tNuevas.current);
      clearTimeout(tTiembla.current);
    };
  }, [carrera.id]);

  const persistir = (s, o, n) => {
    try {
      localStorage.setItem(
        KEY,
        JSON.stringify({ a: [...s], o: o ?? null, n: n ?? notas }),
      );
    } catch (e) {}
  };

  const contextFor = (okSet, oriVal) => ({
    generalIds: baseIds,
    orientation: oriVal,
    orientationIds,
    remainingCount: TODAS.filter((t) => !okSet.has(t.id)).length,
  });

  const statusOf = (it, okSet, oriVal) => getSubjectStatus(it, okSet, contextFor(okSet, oriVal));

  const disponibles = (okSet, oriVal) =>
    new Set(TODAS.filter((it) => statusOf(it, okSet, oriVal) === "go").map((it) => it.id));

  // Peso (tope) que una orientación aporta al título: todas las orientaciones/
  // ciclos son del mismo tamaño, así que el total de la barra no cambia con la
  // elección. Devuelve 0 si el bloque no usa `ori`.
  const tamanioOrientacion = (arr) => {
    const sizes = {};
    arr.forEach((it) => {
      if (it.ori) sizes[it.ori] = (sizes[it.ori] || 0) + pesoDe(it);
    });
    return Object.keys(sizes).length ? Math.max(...Object.values(sizes)) : 0;
  };
  // Aprobadas efectivas y tope de un bloque de conteo, respetando `ori` y `cap`.
  const statsBloque = (arr, cap, oriFlag) => {
    const esOri = oriFlag || arr.some((it) => it.ori);
    const items = esOri ? arr.filter((it) => it.ori === ori) : arr;
    const raw = sumaPesos(items, ok);
    const tope = cap != null ? cap : esOri ? tamanioOrientacion(arr) : totalPesos(arr);
    return { hechas: Math.min(raw, tope), tope };
  };
  const groupStats = countGroups.map((g) => statsBloque(plan[g.key] || [], g.cap, g.ori));
  const nGen = groupStats.reduce((a, s) => a + s.hechas, 0);
  const total = groupStats.reduce((a, s) => a + s.tope, 0);

  const toggle = (it) => {
    const est = statusOf(it, ok, ori);
    if (est === "no") {
      setTiembla(it.id);
      clearTimeout(tTiembla.current);
      tTiembla.current = setTimeout(() => setTiembla(null), 450);
      return;
    }
    const next = new Set(ok);
    const desmarca = next.has(it.id);
    desmarca ? next.delete(it.id) : next.add(it.id);
    // Regla: desmarcar la materia descarta su nota (todas las del grupo).
    let nextN = notas;
    if (desmarca && it.id in notas) {
      nextN = { ...notas };
      delete nextN[it.id];
      setNotas(nextN);
    }
    const antes = disponibles(ok, ori);
    const despues = disponibles(next, ori);
    const recien = new Set([...despues].filter((x) => !antes.has(x)));
    setOk(next);
    persistir(next, ori, nextN);
    if (recien.size) {
      setNuevas(recien);
      clearTimeout(tNuevas.current);
      tNuevas.current = setTimeout(() => setNuevas(new Set()), 3200);
    }
  };

  const elegirOri = (id) => {
    const nueva = ori === id ? null : id;
    setOri(nueva);
    persistir(ok, nueva, notas);
  };

  // Carga/edita/borra una nota. `it` es la tarjeta; `index` el cupo dentro de
  // una tarjeta-grupo (0 para materias comunes). `valor` ya viene normalizado
  // (número 4–10 o null). Regla: borrar la nota la saca del promedio.
  const setNota = (it, index, valor) => {
    const esGrupo = typeof it.cantidad === "number" && it.cantidad > 1;
    const nextN = { ...notas };
    if (esGrupo) {
      const arr = Array.isArray(notas[it.id]) ? [...notas[it.id]] : [];
      arr[index] = valor;
      if (arr.every((x) => x == null)) delete nextN[it.id];
      else nextN[it.id] = arr;
    } else {
      if (valor == null) delete nextN[it.id];
      else nextN[it.id] = valor;
    }
    setNotas(nextN);
    persistir(ok, ori, nextN);
  };

  const reset = () => {
    if (!confirma) {
      setConfirma(true);
      setTimeout(() => setConfirma(false), 2600);
      return;
    }
    const vacio = new Set();
    const sinNotas = {};
    setOk(vacio);
    setOri(null);
    setNotas(sinNotas);
    persistir(vacio, null, sinNotas);
    setConfirma(false);
    setNuevas(new Set());
  };

  // Render inline (NO un componente aparte): si fuera `const Card = () => …`
  // definido acá adentro, React lo trataría como un tipo nuevo en cada render
  // y remontaría la tarjeta en cada tecla — perdiendo foco y el texto a medio
  // escribir del input de nota (no se podía tipear "10"). Como función que
  // devuelve JSX, React reconcilia los <input> en su lugar y conserva su valor.
  const renderCard = (it) => {
    const est = statusOf(it, ok, ori);
    const pide = RED[it.id] || [];
    const faltan = pide.filter((r) => !ok.has(r));
    const abre = (ABRE[it.id] || []).map((x) => byId[x].s);
    const esNueva = nuevas.has(it.id);
    const bmin = baseMinOf(it, ui.countBase);
    const hasOri = hasOrientationReq(it);
    // Input de nota: solo en aprobadas, y no en los requisitos peso-0 (PPP).
    // El idioma sí lleva nota. Invisible en cualquier otro estado.
    const llevaNota = est === "ok" && !it.requisito;
    const boton = (
      <button
        key={it.id}
        className={`card ${est} ${esNueva ? "nueva" : ""} ${tiembla === it.id ? "tiembla" : ""}`}
        onClick={() => toggle(it)}
        aria-pressed={est === "ok"}
        aria-label={`${it.n}${it.cantidad ? ` (${it.cantidad} materias)` : ""}: ${
          est === "ok" ? "aprobada" : est === "go" ? "disponible" : "bloqueada"
        }`}
      >
        <span className="tick" aria-hidden="true">{est === "ok" ? "✓" : ""}</span>
        <span className="cuerpo">
          <span className="nom">
            {it.n}
            {it.anual && <span className="badge-anual">Anual</span>}
            {typeof it.cantidad === "number" && it.cantidad > 1 && (
              <span className="badge-cupos">×{it.cantidad}</span>
            )}
            {it.requisito && <span className="badge-req">Requisito</span>}
            {it.compartida && <span className="badge-comp">Compartida</span>}
            {it.reqAprobadas && <span className="badge-aprob">Aprobadas</span>}
          </span>

          {bmin != null && est === "no" && nGen < bmin && (
            <span className="meta falta">Pide {bmin} aprobadas {ui.countLabel} · llevás {nGen}</span>
          )}
          {hasOri && est === "no" && nGen >= bmin && (
            <span className="meta falta">
              {ori ? `Te falta la cabecera: ${byId[ori].s}` : "Te falta aprobar la cabecera de una orientación"}
            </span>
          )}
          {est === "no" && faltan.length > 0 && (
            <span className="meta falta">Te falta: {faltan.map((r) => byId[r].s).join(" · ")}</span>
          )}

          {est === "go" && pide.length > 0 && (
            <span className="meta pide">Pedía: {pide.map((r) => byId[r].s).join(" · ")}</span>
          )}
          {est !== "no" && abre.length > 0 && (
            <span className="meta abre">Abre: {abre.join(" · ")}</span>
          )}
          {/* Comentario del archivo (cupos "Optativa o seminario" del 440). */}
          {it.nota && <span className="meta nota">{it.nota}</span>}
        </span>
        {est === "ok" && <span className="sello" aria-hidden="true">APROBADA</span>}
        {esNueva && est === "go" && <span className="flash" aria-hidden="true">¡SE ABRIÓ!</span>}
      </button>
    );

    // Estado vacío = sin aprobadas → siempre devuelve el botón bare, idéntico a
    // hoy (así el oráculo da 0 px). El input solo aparece envuelto en aprobadas.
    if (!llevaNota) return boton;

    const cupos = typeof it.cantidad === "number" && it.cantidad > 1 ? it.cantidad : 1;
    const valorDe = (i) => {
      const v = notas[it.id];
      if (cupos > 1) return Array.isArray(v) && typeof v[i] === "number" ? v[i] : null;
      return typeof v === "number" ? v : null;
    };
    return (
      <div className="card-slot" key={it.id}>
        {boton}
        <div className="notas">
          <span className="notas-lbl">{cupos > 1 ? `Notas · ${cupos} materias` : "Nota"}</span>
          {Array.from({ length: cupos }, (_, i) => {
            const txt = formatAR(valorDe(i));
            return (
              <input
                key={i}
                className="nota-input"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                placeholder="—"
                defaultValue={txt}
                data-prev={txt}
                aria-label={cupos > 1 ? `Nota ${i + 1} de ${it.n}` : `Nota de ${it.n}`}
                onChange={(e) => {
                  // Gate de tipeo permisivo: aceptar o revertir a lo último válido.
                  const v = e.currentTarget.value;
                  if (NOTA_TIPEO.test(v)) e.currentTarget.dataset.prev = v;
                  else e.currentTarget.value = e.currentTarget.dataset.prev ?? "";
                }}
                onBlur={(e) => {
                  // Commit: coma→punto y parseo. Válido en [4,10] → guarda; si no,
                  // limpia y no guarda (no clampear: un 3 no se convierte en 4).
                  const num = normalizeNota(e.currentTarget.value);
                  const out = num == null ? "" : formatAR(num);
                  e.currentTarget.value = out;
                  e.currentTarget.dataset.prev = out;
                  setNota(it, i, num);
                }}
              />
            );
          })}
        </div>
      </div>
    );
  };

  if (!listo) {
    return (
      <div className="pagina cargando" style={{ "--accent": accent }}>
        <style>{CSS}</style>
        <p>Cargando tu avance…</p>
      </div>
    );
  }

  const pct = Math.round((nGen / total) * 100);
  const avg = averageOf(notas);
  // Promedio con 2 decimales, salvo entero exacto; display es-AR (coma).
  const avgTxt =
    avg == null ? null : (Number.isInteger(avg) ? String(avg) : avg.toFixed(2)).replace(".", ",");

  return (
    <div className="pagina" style={{ "--accent": accent }}>
      <style>{CSS}</style>

      <header className="cabecera">
        <p className="eyebrow">{ui.eyebrow}</p>
        <h1>Mapa de correlatividades</h1>

        <div className="tablero">
          <div className="contador">
            <span className="num">{nGen}</span>
            <span className="de">/{total} {ui.countLabel}</span>
            {avgTxt != null && (
              <span className="promedio" aria-label={`Promedio ${avgTxt}`}>
                <span className="prom-num">{avgTxt}</span>
                <span className="prom-lbl">promedio</span>
              </span>
            )}
          </div>
          {avg != null && (
            <p className="prom-aclara">
              Promedio simple de las notas que cargaste; el oficial puede diferir
              (aplazos, equivalencias). Solo cuentan las materias con nota — un
              grupo con 2 de 6 notas aporta 2, igual que una materia común.
            </p>
          )}

          <div className="progreso" role="img" aria-label={`${nGen} de ${total} materias aprobadas`}>
            <div className="barra">
              <div className="lleno" style={{ width: `${pct}%` }} />
              {ui.milestones.map((m) => (
                <span key={`t${m.at}`} className="tickbar" style={{ left: `${(m.at / total) * 100}%` }} />
              ))}
            </div>
            <div className="marcas">
              {ui.milestones.map((m) => (
                <span key={`m${m.at}`} style={{ left: `${(m.at / total) * 100}%` }}>{m.tick}</span>
              ))}
            </div>
          </div>

          <div className="hitos">
            {ui.milestones.map((m) => (
              <span key={`p${m.at}`} className={`pill ${nGen >= m.at ? "on" : ""}`}>
                {nGen >= m.at ? m.pillOn : m.pillOff(nGen)}
              </span>
            ))}
            {/* Pills informativas: sin tick ni conteo. Si el hito declara `req`
                (las 200 hs de Sociología), la pill se enciende al cumplirlo.
                `whenComplete` (el TIF del 504) además exige la barra completa. */}
            {(ui.infoPills || []).map((p, i) => {
              const reqOk =
                Array.isArray(p.req) && p.req.length > 0 && p.req.every((r) => ok.has(r));
              const cumplido =
                p.whenComplete ? nGen >= total && reqOk : reqOk;
              return (
                <span key={`info${i}`} className={`pill info${cumplido ? " on" : ""}`}>
                  {cumplido && p.labelOn ? p.labelOn : p.label}
                </span>
              );
            })}
            <button className={`reset ${confirma ? "seguro" : ""}`} onClick={reset}>
              {confirma ? "¿Seguro? Tocá de nuevo" : "Reiniciar todo"}
            </button>
          </div>
        </div>
      </header>

      <main className="panel">
        <div className="leyenda">
          <span><i className="dot ok" /> Aprobada</span>
          <span><i className="dot go" /> Podés cursarla</span>
          <span><i className="dot no" /> Bloqueada</span>
          <span className="guardado">Tocá una materia para marcarla · se guarda solo</span>
        </div>

        {blocks.map((b) => {
          const rawItems = plan[b.planKey] || [];
          // Bloque con materias `ori` (440/504): mostrá solo la orientación/ciclo
          // elegido. Sin `ori` (CP/RT/TS/socio) se muestran todas, como siempre.
          const oriBlock = rawItems.some((it) => it.ori);
          const items = oriBlock ? rawItems.filter((it) => it.ori === ori) : rawItems;
          // Conteo del bloque: respeta el tope (Cs. Sociales 3/5) y el filtro por
          // orientación, con la misma regla que la barra. El tramo optativo de
          // Sociología cuenta cupos (0/9), no tarjetas (0/2); las PPP (peso 0)
          // dan tope 0 → se les oculta el contador.
          const { hechas, tope: totalBloque } = statsBloque(rawItems, b.cap, oriBlock);
          return (
            <section className="bloque" key={b.planKey}>
              <div className="bloque-head">
                <div>
                  <h2>{b.title}</h2>
                  <p>{b.subtitle}</p>
                </div>
                {totalBloque > 0 && <span className="conteo">{hechas}/{totalBloque}</span>}
              </div>

              {b.orientaciones && (
                <div className="orientaciones">
                  <span className="ori-label">Tu orientación:</span>
                  {orientaciones.map((o) => {
                    const cab = byId[o.id]; // el 440 no tiene cabecera-materia
                    return (
                      <button
                        key={o.id}
                        className={`ori ${ori === o.id ? "activa" : ""}`}
                        onClick={() => elegirOri(o.id)}
                      >
                        {o.label}
                        {cab ? (
                          <em>{ok.has(o.id) ? " · cabecera ✓" : ` · cabecera: ${cab.s}`}</em>
                        ) : o.nota ? (
                          <em> · {o.nota}</em>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              )}

              {oriBlock && !ori && (
                <p className="ori-vacio">Elegí una orientación para ver sus materias.</p>
              )}

              <div className="grilla">
                {items.map((m) => renderCard(m))}
              </div>
            </section>
          );
        })}

        <footer className="pie">
          <p className="pie-nota">{ui.footer}</p>
          <p className="pie-creditos">
            Hecho por{" "}
            <a
              href="https://github.com/francokaspin"
              target="_blank"
              rel="noopener noreferrer"
            >
              Franco Kaspin
            </a>{" "}
            · estudiante de Ciencia Política
            <span className="pie-sep" aria-hidden="true">·</span>
            <a
              href="https://github.com/francokaspin/mapa-correlatividades-cp/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              ¿Encontraste un error? Avisame
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@400;600;800&display=swap');

  :root {
    --lima: #C8D62B;
    --negro: #121210;
    --panel: #17170f;
    --crema: #F5F1E0;
    --ok: #46AB4F;
    --go: #F3C51D;
    --no: #E14B3B;
    --no-bg: #3B1512;
    --accent: #C8D62B;
    --disp: 'Anton', 'Impact', 'Haettenschweiler', 'Arial Narrow Bold', sans-serif;
    --body: 'Archivo', 'Trebuchet MS', 'Segoe UI', system-ui, sans-serif;
    --mono: 'Courier New', monospace;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .pagina {
    min-height: 100vh;
    background: var(--accent);
    font-family: var(--body);
    color: var(--negro);
    padding: clamp(14px, 3vw, 36px);
  }
  .pagina.cargando { display: grid; place-items: center; font-weight: 800; letter-spacing: .5px; }

  /* ---------- Cabecera ---------- */
  .cabecera { max-width: 1120px; margin: 0 auto 18px; }
  .eyebrow {
    font-weight: 800; text-transform: uppercase;
    letter-spacing: .22em; font-size: 12px; margin-bottom: 6px;
  }
  h1 {
    font-family: var(--disp);
    text-transform: uppercase;
    font-size: clamp(34px, 6.5vw, 64px);
    line-height: .92; letter-spacing: .01em; font-weight: 400;
  }
  .tablero { margin-top: 16px; display: grid; gap: 12px; }
  .contador { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
  .contador .num { font-family: var(--disp); font-size: clamp(38px, 5vw, 52px); line-height: 1; }
  .contador .de { font-weight: 800; text-transform: uppercase; letter-spacing: .08em; font-size: 12px; }

  /* Promedio: junto al contador, solo cuando hay ≥1 nota cargada. */
  .promedio {
    display: inline-flex; align-items: baseline; gap: 7px;
    margin-left: 6px; padding-left: 16px;
    border-left: 2px solid rgba(18,18,16,.35);
  }
  .promedio .prom-num { font-family: var(--disp); font-size: clamp(30px, 4vw, 42px); line-height: 1; }
  .promedio .prom-lbl { font-weight: 800; text-transform: uppercase; letter-spacing: .08em; font-size: 12px; }
  .prom-aclara { font-size: 11.5px; font-weight: 600; opacity: .72; max-width: 640px; line-height: 1.4; margin-top: -2px; }

  .progreso { max-width: 680px; }
  .barra {
    position: relative; height: 16px; background: var(--negro);
    border: 2px solid var(--negro); border-radius: 999px; overflow: hidden;
  }
  .lleno { height: 100%; background: var(--ok); transition: width .35s ease; }
  .tickbar { position: absolute; top: 0; bottom: 0; width: 2px; background: var(--crema); opacity: .85; }
  .marcas { position: relative; height: 16px; margin-top: 3px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; }
  .marcas span { position: absolute; transform: translateX(-50%); white-space: nowrap; }

  .hitos { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
  .pill {
    border: 2px solid var(--negro); border-radius: 999px;
    padding: 5px 12px; font-size: 12px; font-weight: 800;
    text-transform: uppercase; letter-spacing: .04em;
  }
  .pill.on { background: var(--negro); color: var(--accent); }
  .pill.info { background: transparent; border-style: dashed; opacity: .82; letter-spacing: .02em; }
  /* Hito informativo con req cumplido: se enciende, pero nunca lleva tick ni conteo. */
  .pill.info.on { background: var(--negro); color: var(--accent); border-style: solid; opacity: 1; }
  .reset {
    margin-left: auto; border: 2px solid var(--negro); background: var(--crema);
    border-radius: 999px; padding: 6px 14px; font-family: var(--body);
    font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .04em;
    cursor: pointer; box-shadow: 3px 3px 0 var(--negro); transition: transform .08s ease;
  }
  .reset:active { transform: translate(2px, 2px); box-shadow: 1px 1px 0 var(--negro); }
  .reset.seguro { background: var(--no); color: #fff; }

  /* ---------- Panel ---------- */
  .panel {
    max-width: 1120px; margin: 0 auto;
    background: var(--panel);
    border: 3px solid var(--negro); border-radius: 18px;
    box-shadow: 9px 9px 0 rgba(18,18,16,.55);
    padding: clamp(14px, 2.5vw, 28px);
    color: var(--crema);
  }
  .leyenda {
    display: flex; flex-wrap: wrap; gap: 14px; align-items: center;
    font-size: 12px; font-weight: 700; letter-spacing: .02em;
    padding-bottom: 14px; border-bottom: 1px dashed rgba(245,241,224,.25); margin-bottom: 6px;
  }
  .dot { display: inline-block; width: 11px; height: 11px; border-radius: 3px; margin-right: 5px; border: 1.5px solid rgba(0,0,0,.5); vertical-align: -1px; }
  .dot.ok { background: var(--ok); } .dot.go { background: var(--go); } .dot.no { background: var(--no); }
  .guardado { margin-left: auto; opacity: .65; font-weight: 600; }

  .bloque { margin-top: 22px; }
  .bloque-head { display: flex; align-items: end; justify-content: space-between; gap: 10px; margin-bottom: 10px; }
  .bloque-head h2 {
    font-family: var(--disp); font-weight: 400; text-transform: uppercase;
    color: var(--accent); font-size: clamp(18px, 2.4vw, 24px); letter-spacing: .04em;
  }
  .bloque-head p { font-size: 12px; opacity: .7; margin-top: 2px; max-width: 640px; }
  .conteo { font-family: var(--mono); font-weight: 700; font-size: 15px; opacity: .85; white-space: nowrap; }

  .grilla {
    display: grid; gap: 12px;
    grid-template-columns: repeat(auto-fill, minmax(235px, 1fr));
  }

  /* ---------- Orientaciones ---------- */
  .orientaciones {
    display: flex; flex-wrap: wrap; gap: 8px; align-items: center;
    margin: 4px 0 14px;
  }
  .ori-label { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; opacity: .75; }
  .ori {
    border: 2px solid rgba(245,241,224,.45); background: transparent; color: var(--crema);
    border-radius: 999px; padding: 5px 11px; font-family: var(--body);
    font-size: 11.5px; font-weight: 700; cursor: pointer;
  }
  .ori em { font-style: normal; opacity: .6; font-weight: 600; }
  .ori.activa { background: var(--accent); border-color: var(--accent); color: var(--negro); }
  .ori.activa em { opacity: .75; }
  .ori:focus-visible { outline: 3px solid var(--crema); outline-offset: 2px; }

  /* ---------- Tarjetas ---------- */
  .card {
    position: relative; display: flex; gap: 10px; align-items: flex-start;
    text-align: left; border-radius: 12px; padding: 11px 12px;
    border: 2px solid var(--negro);
    box-shadow: 4px 4px 0 rgba(0,0,0,.5);
    font-family: var(--body); cursor: pointer;
    transition: transform .08s ease, box-shadow .08s ease;
  }
  .card:hover { transform: translate(-1px, -1px); box-shadow: 5px 5px 0 rgba(0,0,0,.5); }
  .card:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0 rgba(0,0,0,.5); }
  .card:focus-visible { outline: 3px solid var(--crema); outline-offset: 2px; }

  .card.ok { background: var(--ok); color: #0c1c0e; }
  .card.go { background: var(--go); color: #1b1500; }
  .card.no {
    background: var(--no-bg); color: #F2B7AE;
    border-color: var(--no); cursor: not-allowed;
  }
  .card.no:hover { transform: none; box-shadow: 4px 4px 0 rgba(0,0,0,.5); }

  .tick {
    flex: none; width: 22px; height: 22px; margin-top: 1px;
    border: 2.5px solid currentColor; border-radius: 6px;
    display: grid; place-items: center;
    font-weight: 900; font-size: 15px; line-height: 1;
    background: rgba(255,255,255,.25);
  }
  .card.no .tick {
    background: repeating-linear-gradient(45deg, transparent 0 4px, rgba(225,75,59,.55) 4px 8px);
    border-color: var(--no);
  }

  .cuerpo { display: grid; gap: 3px; min-width: 0; }
  .nom { font-weight: 800; font-size: 13.5px; line-height: 1.25; }
  .badge-anual, .badge-cupos, .badge-aprob {
    display: inline-block; margin-left: 6px; vertical-align: 1px;
    font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: .07em;
    padding: 1px 6px; border-radius: 999px; border: 1.5px solid currentColor;
    opacity: .85;
  }
  /* Tarjeta-grupo: cuántas materias representa (Sociologías Especiales ×6). */
  .badge-cupos { font-family: var(--mono); letter-spacing: .02em; opacity: 1; }
  /* Excepción [c] del plan: este grupo pide las correlativas con final aprobado. */
  .badge-aprob { border-style: dashed; opacity: .75; }
  /* PPP del 504: requisito de cursada, peso 0. */
  .badge-req { border-style: dashed; opacity: .8; }
  /* Materias (*) del 504: se cursan desde cualquier ciclo orientado (copy, sin lógica en v1). */
  .badge-comp { border-style: dashed; opacity: .75; }
  .meta { font-size: 11px; line-height: 1.35; font-weight: 600; }
  .meta.abre { opacity: .72; }
  .meta.pide { opacity: .78; }
  .meta.falta { color: #FF9C8D; font-weight: 700; }
  /* Comentario de los cupos "Optativa o seminario" (plan 440). */
  .meta.nota { opacity: .72; font-weight: 600; }
  /* Aviso cuando todavía no se eligió orientación (plan 440). */
  .ori-vacio { font-size: 12px; opacity: .6; font-style: italic; margin: 2px 0 12px; }

  /* ---------- Nota de la tarjeta (solo en aprobadas) ---------- */
  .card-slot { display: flex; flex-direction: column; }
  .notas {
    display: flex; flex-wrap: wrap; align-items: center; gap: 7px;
    margin-top: -4px; padding: 9px 12px 10px;
    background: rgba(18,18,16,.14);
    border: 2px solid var(--negro); border-top: none;
    border-radius: 0 0 12px 12px;
  }
  .notas-lbl {
    font-size: 10px; font-weight: 800; text-transform: uppercase;
    letter-spacing: .07em; color: #0c1c0e; opacity: .8;
  }
  .nota-input {
    width: 52px; padding: 4px 6px; font-family: var(--body);
    font-size: 13px; font-weight: 800; text-align: center;
    color: #0c1c0e; background: var(--crema);
    border: 2px solid var(--negro); border-radius: 7px;
    -moz-appearance: textfield;
  }
  .nota-input::-webkit-outer-spin-button,
  .nota-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
  .nota-input::placeholder { color: #0c1c0e; opacity: .35; font-weight: 700; }
  .nota-input:focus-visible { outline: 3px solid var(--negro); outline-offset: 1px; }
  .nota-input:not(:placeholder-shown):invalid { border-color: var(--no); background: #f7d9d3; }

  .sello {
    position: absolute; top: -8px; right: 8px;
    transform: rotate(-7deg);
    font-family: var(--disp); font-size: 10px; letter-spacing: .12em;
    color: #0c1c0e; background: var(--accent);
    border: 2px solid #0c1c0e; border-radius: 4px; padding: 1px 7px;
  }
  .flash {
    position: absolute; top: -9px; right: 8px;
    transform: rotate(-7deg);
    font-family: var(--disp); font-size: 10px; letter-spacing: .12em;
    color: var(--go); background: var(--negro);
    border: 2px solid var(--go); border-radius: 4px; padding: 1px 7px;
  }

  .card.nueva { animation: pulso 1s ease-in-out 3; }
  @keyframes pulso {
    0%, 100% { box-shadow: 4px 4px 0 rgba(0,0,0,.5); }
    50% { box-shadow: 0 0 0 5px rgba(243,197,29,.55), 4px 4px 0 rgba(0,0,0,.5); }
  }
  .card.tiembla { animation: sacudida .4s ease; }
  @keyframes sacudida {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    50% { transform: translateX(5px); }
    75% { transform: translateX(-3px); }
  }

  .pie {
    margin-top: 26px; padding-top: 12px;
    border-top: 1px dashed rgba(245,241,224,.25);
    font-size: 11px; line-height: 1.5;
    display: grid; gap: 8px;
  }
  .pie-nota { opacity: .6; }
  .pie-creditos { opacity: .85; font-weight: 600; }
  .pie-creditos a {
    color: var(--accent); text-decoration: none;
    border-bottom: 1px solid rgba(200,214,43,.4);
    transition: border-color .12s ease, opacity .12s ease;
  }
  .pie-creditos a:hover { border-bottom-color: var(--accent); }
  .pie-creditos a:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 2px; }
  .pie-sep { margin: 0 8px; opacity: .45; }
  @media (max-width: 520px) {
    .pie-sep { display: block; height: 0; margin: 4px 0; overflow: hidden; }
  }

  @media (prefers-reduced-motion: reduce) {
    .card.nueva, .card.tiembla { animation: none; }
    .lleno { transition: none; }
  }
  @media (max-width: 520px) {
    .grilla { grid-template-columns: 1fr; }
    .reset { margin-left: 0; }
  }
`;
