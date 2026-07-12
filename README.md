# Mapa de Correlatividades · Ciencia Política · UBA Sociales

Tracker interactivo de correlatividades de **Ciencia Política** (UBA Sociales, Plan 8558/17): marcás las materias que aprobaste y el mapa te dice, materia por materia, qué correlativas te pide, cuáles te faltan y qué materias se te abren.

![Mapa de Correlatividades · Ciencia Política · UBA Sociales](docs/screenshot.png)

Además de las correlativas directas, calcula los hitos del **idioma** (6 aprobadas) y del **ciclo orientado** (12 aprobadas + la cabecera de tu orientación). El progreso se guarda automáticamente en el navegador (`localStorage`), así que se conserva al recargar la página.

> Correlativas según la caja curricular de la Res. (CS) N° 8558/17.

## Stack

- [Vite](https://vite.dev/) + [React](https://react.dev/) (JavaScript)
- Un único componente autocontenido (`src/MapaCorrelatividades.jsx`), con estilos
  inline en un `<style>`. Sin dependencias de UI ni estado externo.
- Deploy estático en [Vercel](https://vercel.com/).

## Correr localmente

Requiere Node 18+.

```bash
npm install     # instalar dependencias
npm run dev     # servidor de desarrollo (http://localhost:5173)
```

Otros scripts:

```bash
npm run build   # build de producción en dist/
npm run preview # sirve el build de dist/ para verificar
```

## Assets

La imagen de previsualización para redes (`public/og-image.png`, 1200×630) se genera
con [`scripts/gen-og.mjs`](scripts/gen-og.mjs) (requiere `@napi-rs/canvas`).
