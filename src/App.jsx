import { useState, useEffect } from "react";
import { CARRERAS, GRUPOS, landingEntries } from "./data/carreras/index.js";
import MapaCarrera from "./MapaCarrera.jsx";
import { CSS } from "./styles.js";

const DEFAULT_TITLE = "Mapa de Correlatividades · UBA Sociales";

function routeFromHash() {
  const rawHash = window.location.hash.slice(1);
  return rawHash.startsWith("/") ? rawHash.slice(1) : rawHash;
}

function ensureMeta(name, content) {
  let element = document.head.querySelector(`meta[property='${name}']`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("property", name);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function setPageMeta(entidad) {
  const title = entidad
    ? `Mapa de Correlatividades · ${entidad.nombre} · UBA Sociales`
    : DEFAULT_TITLE;

  document.title = title;
  ensureMeta("og:title", title);
  ensureMeta(
    "og:description",
    entidad
      ? `Mapa de correlativas para ${entidad.nombre} en la Facultad de Ciencias Sociales (UBA).`
      : "Selector de carreras para el Mapa de Correlatividades · UBA Sociales."
  );
}

function Landing() {
  return (
    <div className="pagina landing">
      <style>{CSS}</style>
      <header className="cabecera">
        <p className="eyebrow">Mapa de Correlatividades · UBA Sociales</p>
        <h1>Elegí tu carrera</h1>
        <p className="intro">
          Seleccioná una de las cinco carreras de Ciencias Sociales. Las cinco están disponibles;
          Comunicación entra por una sola tarjeta y adentro elegís entre sus dos planes vigentes.
        </p>
      </header>

      <main className="panel selector-panel">
        <div className="carrera-grid">
          {landingEntries().map((e) => (
            <a
              key={e.id}
              className={`carrera-card ${
                e.tipo === "grupo" ? "activa grupo" : e.estado === "en-preparacion" ? "inactivo" : "activa"
              }`}
              href={e.href}
            >
              <strong>{e.nombre}</strong>
              <span className="estado">
                {e.tipo === "grupo"
                  ? "Dos planes vigentes"
                  : e.estado === "activa"
                  ? "Activa"
                  : "En preparación"}
              </span>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}

// Paso intermedio de un grupo (Comunicación): guía de transición + los planes.
function GrupoSelector({ grupo }) {
  return (
    <div className="pagina landing">
      <style>{CSS}</style>
      <header className="cabecera">
        <p className="eyebrow">{grupo.eyebrow}</p>
        <h1>{grupo.titulo}</h1>
        <p className="intro">{grupo.intro}</p>
      </header>

      <main className="panel selector-panel">
        <div className="carrera-grid">
          {grupo.opciones.map((op) => {
            const c = CARRERAS.find((x) => x.id === op.id);
            const activa = c.estado === "activa";
            return (
              <a
                key={op.id}
                className={`carrera-card plan-card ${activa ? "activa" : "inactivo"}`}
                href={`#/${op.id}`}
              >
                <strong>
                  {c.nombre}
                  {op.marca && <span className="marca-extinguir">{op.marca}</span>}
                </strong>
                <span className="quien">{op.quien}</span>
                <span className="estado">{activa ? "Abrir el mapa →" : "En preparación"}</span>
              </a>
            );
          })}
        </div>
        <a className="reset" href="#/">← Volver a las carreras</a>
      </main>
    </div>
  );
}

function EnPreparacion({ carrera }) {
  return (
    <div className="pagina landing">
      <style>{CSS}</style>
      <header className="cabecera">
        <p className="eyebrow">{carrera.nombre} · UBA Sociales</p>
        <h1>En preparación</h1>
        <p className="intro">
          Esta carrera está en preparación. Volvé cuando los datos estén cargados y verificados contra la
          resolución oficial.
        </p>
      </header>

      <main className="panel preparacion-panel">
        <div className="message">
          <p>La carrera <strong>{carrera.nombre}</strong> ya está en el mapa, pero no hay datos disponibles aún.</p>
          <p>Los datos se cargarán más adelante con la misma arquitectura multi-carrera.</p>
        </div>
        <a className="reset" href="#/">Volver al selector</a>
      </main>
    </div>
  );
}

export default function App() {
  const [route, setRoute] = useState(routeFromHash());

  useEffect(() => {
    const onHashChange = () => setRoute(routeFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const carrera = CARRERAS.find((item) => item.id === route);
  const grupo = GRUPOS[route];

  useEffect(() => {
    setPageMeta(carrera || grupo || null);
    document.documentElement.style.setProperty(
      "--accent",
      carrera?.color || grupo?.color || "#C8D62B"
    );
  }, [carrera, grupo]);

  if (grupo) {
    return <GrupoSelector grupo={grupo} />;
  }
  if (!carrera) {
    return <Landing />;
  }
  if (carrera.estado === "en-preparacion") {
    return <EnPreparacion carrera={carrera} />;
  }

  return <MapaCarrera carrera={carrera} />;
}
