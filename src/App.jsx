import { useState, useEffect } from "react";
import { CARRERAS } from "./data/carreras/index.js";
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

function setPageMeta(carrera) {
  const title = carrera
    ? `Mapa de Correlatividades · ${carrera.nombre} · UBA Sociales`
    : DEFAULT_TITLE;

  document.title = title;
  ensureMeta("og:title", title);
  ensureMeta(
    "og:description",
    carrera
      ? `Mapa de correlativas para ${carrera.nombre} en la Facultad de Ciencias Sociales (UBA).`
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
          Seleccioná una de las cinco carreras de Ciencias Sociales. Las carreras en preparación
          están visibles, pero todavía no tienen datos cargados.
        </p>
      </header>

      <main className="panel selector-panel">
        <div className="carrera-grid">
          {CARRERAS.map((carrera) => (
            <a
              key={carrera.id}
              className={`carrera-card ${carrera.estado === "en-preparacion" ? "inactivo" : "activa"}`}
              href={`#/${carrera.id}`}
            >
              <strong>{carrera.nombre}</strong>
              <span className="estado">{carrera.estado === "activa" ? "Activa" : "En preparación"}</span>
            </a>
          ))}
        </div>
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

  useEffect(() => {
    setPageMeta(carrera);
    document.documentElement.style.setProperty("--accent", carrera?.color || "#C8D62B");
  }, [carrera]);

  if (!carrera) {
    return <Landing />;
  }
  if (carrera.estado === "en-preparacion") {
    return <EnPreparacion carrera={carrera} />;
  }

  return <MapaCarrera carrera={carrera} />;
}
