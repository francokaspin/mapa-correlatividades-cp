import { useState, useEffect, useRef } from "react";

/* ============================================================
   MAPA DE CORRELATIVIDADES · CIENCIA POLÍTICA · UBA
   Datos: caja curricular de la Res. (CS) N° 8558/17
   (verificada página por página del expediente EXP-UBA 85.775/2016)

   - `req` = lista COMPLETA oficial de correlativas.
   - Para mostrar "pide / te falta / abre" se usa la reducción
     transitiva (las flechas directas, como en el mapa).
   - Ciclo Orientado: 12 aprobadas del ciclo general, incluida
     la asignatura CABECERA de la orientación elegida.
   - Idioma: Nivel I con 6 materias aprobadas (régimen de la
     facultad); II y III encadenados.
   ============================================================ */

const MATERIAS = [
  // —— orden visual del mapa (fila por fila) ——
  { id: "eco",  n: "Economía", s: "Economía", req: [] },
  { id: "tps1", n: "Teoría Política y Social I", s: "Teo I", req: [] },
  { id: "fcp1", n: "Fundamentos de Ciencia Política I", s: "Fundamentos I", req: [] },
  { id: "fym",  n: "Filosofía y Métodos de las Ciencias Sociales", s: "Filo y Métodos", req: [] },
  { id: "tdc",  n: "Teoría y Derecho Constitucional", s: "Derecho Const.", req: [] },
  { id: "hc",   n: "Historia Contemporánea", s: "H. Contemporánea", req: [] },

  { id: "tps2", n: "Teoría Política y Social II", s: "Teo II", req: ["tps1"] },
  { id: "tsoc", n: "Teoría Sociológica", s: "T. Sociológica", req: ["tps1"] },
  { id: "fcp2", n: "Fundamentos de Ciencia Política II", s: "Fundamentos II", req: ["fcp1"] },
  { id: "met1", n: "Metodología de la Investigación en Ciencia Política I", s: "Metodología I", req: ["fym"] },
  { id: "filo", n: "Filosofía", s: "Filosofía", req: ["fym"] },
  { id: "ha",   n: "Historia Argentina", s: "H. Argentina", req: [] },
  { id: "pa",   n: "Política Argentina", s: "Pol. Argentina", req: ["hc", "ha", "fcp1", "fcp2", "spol", "spc"] },

  { id: "tpc",  n: "Teoría Política Contemporánea", s: "Teo. Contemporánea", req: ["hc", "tps1", "tps2", "tsoc"] },
  { id: "spol", n: "Sociología Política", s: "Socio. Política", req: ["hc", "fcp1", "fcp2"] },
  { id: "met2", n: "Metodología de la Investigación en Ciencia Política II", s: "Metodología II", req: ["fym", "met1"] },
  { id: "hl",   n: "Historia Latinoamericana", s: "H. Latinoamericana", req: [] },
  { id: "pl",   n: "Política Latinoamericana", s: "Pol. Latinoamericana", req: ["fym", "met1", "met2", "hc", "hl", "fcp1", "fcp2", "spol"] },

  { id: "app",  n: "Administración y Políticas Públicas", s: "Admin. y Pol. Públicas", req: ["fym", "met1", "met2", "eco", "hc", "tps1", "tps2", "tsoc", "tpc", "fcp2", "spol"] },
  { id: "rrii", n: "Teoría de las Relaciones Internacionales", s: "RRII", req: ["fym", "met1", "met2", "hc", "tps1", "tps2", "tsoc", "tpc", "fcp1"] },
  { id: "op",   n: "Opinión Pública", s: "Opinión Pública", req: ["fym", "met1", "met2", "hc", "tps1", "tps2", "tsoc", "fcp1", "spol"] },
  { id: "spc",  n: "Sistemas Políticos Comparados", s: "Sist. Pol. Comparados", req: ["fym", "met1", "met2", "hc", "fcp1", "fcp2", "spol"] },
];

const IDIOMA = [
  { id: "id1", n: "Idioma · Nivel I", s: "Idioma I", req: [], min: 6 },
  { id: "id2", n: "Idioma · Nivel II", s: "Idioma II", req: ["id1"] },
  { id: "id3", n: "Idioma · Nivel III", s: "Idioma III", req: ["id2"] },
];

const ORIENTADO = [
  { id: "ele1", n: "Materia electiva 1", s: "Electiva 1", orientado: true },
  { id: "ele2", n: "Materia electiva 2", s: "Electiva 2", orientado: true },
  { id: "sem1", n: "Seminario 1", s: "Seminario 1", orientado: true },
  { id: "sem2", n: "Seminario 2", s: "Seminario 2", orientado: true },
  { id: "tao",  n: "Taller de orientación", s: "Taller", orientado: true },
];

const ORIENTACIONES = [
  { id: "app",  label: "Estado, Admin. y Pol. Públicas" },
  { id: "spc",  label: "Política Comparada" },
  { id: "pl",   label: "Política Latinoamericana" },
  { id: "rrii", label: "Relaciones Internacionales" },
  { id: "op",   label: "Opinión Pública y Análisis Político" },
  { id: "tpc",  label: "Teoría Política" },
];

const TODAS = [...MATERIAS, ...IDIOMA, ...ORIENTADO];
const byId = Object.fromEntries(TODAS.map((m) => [m.id, m]));

// ---- Ancestros y reducción transitiva (flechas directas, como el mapa) ----
const ANC = {};
function anc(id) {
  if (ANC[id]) return ANC[id];
  const s = new Set();
  (byId[id]?.req || []).forEach((r) => {
    s.add(r);
    anc(r).forEach((x) => s.add(x));
  });
  return (ANC[id] = s);
}
const RED = {};
TODAS.forEach((m) => {
  const req = m.req || [];
  RED[m.id] = req.filter((r) => !req.some((r2) => r2 !== r && anc(r2).has(r)));
});

// Qué abre cada materia (según flechas directas)
const ABRE = {};
TODAS.forEach((m) => (RED[m.id] || []).forEach((r) => (ABRE[r] = [...(ABRE[r] || []), m.id])));

const KEY = "cp8558_progreso_v1";

function contarGeneral(okSet) {
  return MATERIAS.reduce((a, m) => a + (okSet.has(m.id) ? 1 : 0), 0);
}

function estadoDe(it, okSet, nGen, ori) {
  if (okSet.has(it.id)) return "ok";
  if (it.orientado) {
    if (nGen < 12) return "no";
    const cabOk = ori ? okSet.has(ori) : ORIENTACIONES.some((o) => okSet.has(o.id));
    return cabOk ? "go" : "no";
  }
  if (it.min && nGen < it.min) return "no";
  if ((it.req || []).some((r) => !okSet.has(r))) return "no";
  return "go";
}

function disponibles(okSet, ori) {
  const n = contarGeneral(okSet);
  return new Set(TODAS.filter((it) => estadoDe(it, okSet, n, ori) === "go").map((it) => it.id));
}

export default function MapaCorrelatividades() {
  const [ok, setOk] = useState(() => new Set());
  const [ori, setOri] = useState(null);
  const [listo, setListo] = useState(false);
  const [nuevas, setNuevas] = useState(() => new Set());
  const [tiembla, setTiembla] = useState(null);
  const [confirma, setConfirma] = useState(false);
  const tNuevas = useRef(null);
  const tTiembla = useRef(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const p = JSON.parse(raw);
        if (Array.isArray(p)) setOk(new Set(p));
        else {
          setOk(new Set(p.a || []));
          setOri(p.o || null);
        }
      }
    } catch (e) {
      /* sin avance guardado todavía */
    }
    setListo(true);
    return () => {
      clearTimeout(tNuevas.current);
      clearTimeout(tTiembla.current);
    };
  }, []);

  const persistir = (s, o) => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ a: [...s], o: o ?? null }));
    } catch (e) {}
  };

  const nGen = contarGeneral(ok);

  const toggle = (it) => {
    const est = estadoDe(it, ok, nGen, ori);
    if (est === "no") {
      setTiembla(it.id);
      clearTimeout(tTiembla.current);
      tTiembla.current = setTimeout(() => setTiembla(null), 450);
      return;
    }
    const next = new Set(ok);
    next.has(it.id) ? next.delete(it.id) : next.add(it.id);
    const antes = disponibles(ok, ori);
    const despues = disponibles(next, ori);
    const recien = new Set([...despues].filter((x) => !antes.has(x)));
    setOk(next);
    persistir(next, ori);
    if (recien.size) {
      setNuevas(recien);
      clearTimeout(tNuevas.current);
      tNuevas.current = setTimeout(() => setNuevas(new Set()), 3200);
    }
  };

  const elegirOri = (id) => {
    const nueva = ori === id ? null : id;
    setOri(nueva);
    persistir(ok, nueva);
  };

  const reset = () => {
    if (!confirma) {
      setConfirma(true);
      setTimeout(() => setConfirma(false), 2600);
      return;
    }
    const vacio = new Set();
    setOk(vacio);
    setOri(null);
    persistir(vacio, null);
    setConfirma(false);
    setNuevas(new Set());
  };

  const Card = ({ it }) => {
    const est = estadoDe(it, ok, nGen, ori);
    const pide = RED[it.id] || [];
    const faltan = pide.filter((r) => !ok.has(r));
    const abre = (ABRE[it.id] || []).map((x) => byId[x].s);
    const esNueva = nuevas.has(it.id);
    return (
      <button
        className={`card ${est} ${esNueva ? "nueva" : ""} ${tiembla === it.id ? "tiembla" : ""}`}
        onClick={() => toggle(it)}
        aria-pressed={est === "ok"}
        aria-label={`${it.n}: ${est === "ok" ? "aprobada" : est === "go" ? "disponible" : "bloqueada"}`}
      >
        <span className="tick" aria-hidden="true">{est === "ok" ? "✓" : ""}</span>
        <span className="cuerpo">
          <span className="nom">{it.n}</span>

          {it.orientado && est === "no" && nGen < 12 && (
            <span className="meta falta">Pide 12 aprobadas del ciclo general · llevás {nGen}</span>
          )}
          {it.orientado && est === "no" && nGen >= 12 && (
            <span className="meta falta">
              {ori ? `Te falta la cabecera: ${byId[ori].s}` : "Te falta aprobar la cabecera de una orientación"}
            </span>
          )}

          {!it.orientado && est === "no" && it.min && nGen < it.min && (
            <span className="meta falta">Pide {it.min} aprobadas del ciclo general · llevás {nGen}</span>
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
        </span>
        {est === "ok" && <span className="sello" aria-hidden="true">APROBADA</span>}
        {esNueva && est === "go" && <span className="flash" aria-hidden="true">¡SE ABRIÓ!</span>}
      </button>
    );
  };

  if (!listo) {
    return (
      <div className="pagina cargando">
        <style>{CSS}</style>
        <p>Cargando tu avance…</p>
      </div>
    );
  }

  const pct = Math.round((nGen / MATERIAS.length) * 100);
  const idiomaListo = nGen >= 6;
  const orientadoListo = nGen >= 12;
  const hechasIdioma = IDIOMA.filter((m) => ok.has(m.id)).length;
  const hechasOri = ORIENTADO.filter((m) => ok.has(m.id)).length;

  return (
    <div className="pagina">
      <style>{CSS}</style>

      <header className="cabecera">
        <p className="eyebrow">Ciencia Política · UBA Sociales · Plan 8558/17</p>
        <h1>Mapa de correlatividades</h1>

        <div className="tablero">
          <div className="contador">
            <span className="num">{nGen}</span>
            <span className="de">/{MATERIAS.length} del ciclo general</span>
          </div>

          <div className="progreso" role="img" aria-label={`${nGen} de ${MATERIAS.length} materias aprobadas`}>
            <div className="barra">
              <div className="lleno" style={{ width: `${pct}%` }} />
              <span className="tickbar" style={{ left: `${(6 / 22) * 100}%` }} />
              <span className="tickbar" style={{ left: `${(12 / 22) * 100}%` }} />
            </div>
            <div className="marcas">
              <span style={{ left: `${(6 / 22) * 100}%` }}>6 · idioma</span>
              <span style={{ left: `${(12 / 22) * 100}%` }}>12 · c. orientado</span>
            </div>
          </div>

          <div className="hitos">
            <span className={`pill ${idiomaListo ? "on" : ""}`}>
              {idiomaListo ? "Idioma habilitado" : `Idioma: faltan ${6 - nGen}`}
            </span>
            <span className={`pill ${orientadoListo ? "on" : ""}`}>
              {orientadoListo ? "12 para el orientado ✓" : `C. orientado: faltan ${12 - nGen}`}
            </span>
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

        <section className="bloque">
          <div className="bloque-head">
            <div>
              <h2>Ciclo general</h2>
              <p>En el orden del mapa. Cada tarjeta te dice qué pide (las flechas directas) y qué abre.</p>
            </div>
            <span className="conteo">{nGen}/22</span>
          </div>
          <div className="grilla">
            {MATERIAS.map((m) => (
              <Card key={m.id} it={m} />
            ))}
          </div>
        </section>

        <section className="bloque">
          <div className="bloque-head">
            <div>
              <h2>Idioma</h2>
              <p>Tres niveles de un idioma a elección (inglés, francés, portugués, italiano o alemán).</p>
            </div>
            <span className="conteo">{hechasIdioma}/3</span>
          </div>
          <div className="grilla">
            {IDIOMA.map((m) => (
              <Card key={m.id} it={m} />
            ))}
          </div>
        </section>

        <section className="bloque">
          <div className="bloque-head">
            <div>
              <h2>Ciclo orientado</h2>
              <p>
                2 electivas + 2 seminarios + 1 taller. Pide 12 aprobadas del ciclo general y que entre ellas
                esté la materia cabecera de tu orientación.
              </p>
            </div>
            <span className="conteo">{hechasOri}/5</span>
          </div>

          <div className="orientaciones">
            <span className="ori-label">Tu orientación:</span>
            {ORIENTACIONES.map((o) => (
              <button
                key={o.id}
                className={`ori ${ori === o.id ? "activa" : ""}`}
                onClick={() => elegirOri(o.id)}
              >
                {o.label}
                <em>{ok.has(o.id) ? " · cabecera ✓" : ` · cabecera: ${byId[o.id].s}`}</em>
              </button>
            ))}
          </div>

          <div className="grilla">
            {ORIENTADO.map((m) => (
              <Card key={m.id} it={m} />
            ))}
          </div>
        </section>

        <footer className="pie">
          <p className="pie-nota">
            Correlativas según la caja curricular de la Res. (CS) N° 8558/17. Para cursar alcanza con tener la
            correlativa cursada (regularizada); el ciclo orientado exige 12 finales aprobados. Tu progreso queda
            guardado en este navegador.
          </p>
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
    --disp: 'Anton', 'Impact', 'Haettenschweiler', 'Arial Narrow Bold', sans-serif;
    --body: 'Archivo', 'Trebuchet MS', 'Segoe UI', system-ui, sans-serif;
    --mono: 'Courier New', monospace;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .pagina {
    min-height: 100vh;
    background: var(--lima);
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
  .contador { display: flex; align-items: baseline; gap: 8px; }
  .contador .num { font-family: var(--disp); font-size: clamp(38px, 5vw, 52px); line-height: 1; }
  .contador .de { font-weight: 800; text-transform: uppercase; letter-spacing: .08em; font-size: 12px; }

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
  .pill.on { background: var(--negro); color: var(--lima); }
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
    color: var(--lima); font-size: clamp(18px, 2.4vw, 24px); letter-spacing: .04em;
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
  .ori.activa { background: var(--lima); border-color: var(--lima); color: var(--negro); }
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
  .meta { font-size: 11px; line-height: 1.35; font-weight: 600; }
  .meta.abre { opacity: .72; }
  .meta.pide { opacity: .78; }
  .meta.falta { color: #FF9C8D; font-weight: 700; }

  .sello {
    position: absolute; top: -8px; right: 8px;
    transform: rotate(-7deg);
    font-family: var(--disp); font-size: 10px; letter-spacing: .12em;
    color: #0c1c0e; background: var(--lima);
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
    color: var(--lima); text-decoration: none;
    border-bottom: 1px solid rgba(200,214,43,.4);
    transition: border-color .12s ease, opacity .12s ease;
  }
  .pie-creditos a:hover { border-bottom-color: var(--lima); }
  .pie-creditos a:focus-visible { outline: 2px solid var(--lima); outline-offset: 2px; border-radius: 2px; }
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
