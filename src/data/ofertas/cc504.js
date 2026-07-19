/* ============================================================
   CIENCIAS DE LA COMUNICACIÓN · Plan 504/23 — OFERTA CONCRETA
   Capa 2 (volátil): oferta nominada de Seminarios Ad Hoc /
   Optativos por cuatrimestre. Separada de la regla del plan
   (capa 1, intocable) que vive en src/data/carreras/cc504.js.
   Estado: VERIFICADA contra fuentes oficiales · pendiente de
   auditoría de Franco antes de publicar.

   QUÉ LLENA: el slot `sem` (tarjeta-grupo "Seminarios Ad Hoc /
   Optativos", cantidad 2) de cc504.js. La regla del plan (gate,
   peso 2, conteo) NO se toca: esta capa solo nomina la oferta
   entre la que el estudiante elige sus 2 seminarios.

   FUENTES (consultadas 2026-07-19):
   1. Página oficial de Seminarios Optativos de la Carrera
      (oferta viva por período: Verano / 1.ºC / 2.ºC 2026):
      https://comunicacion.sociales.uba.ar/seminarios/
   2. Reglamento Interno para los Seminarios Ad Hoc (Junta de la
      Carrera, 22/06/2012; enmarcado en Res. CD Nº 5400/09):
      https://comunicacion.sociales.uba.ar/wp-content/uploads/sites/16/2022/08/Reglamento_Seminarios_Aprobado_Junta22Jun12.pdf
   3. Res. CD Nº 5400/09 (reglamento interno de optativas/seminarios):
      https://comunicacion.sociales.uba.ar/wp-content/uploads/sites/16/2013/05/RES-CD-N%C2%BA-5400-09-REGL-INTERNO-OPT-SEM.pdf
   Cada seminario cita su PDF oficial en el campo `pdf`.

   VERIFICACIÓN (multi-método, coincidencia exacta):
   · Método 1 — lectura de la página (render): coincide en los 6
     seminarios optativos "regulares" del 2.ºC 2026.
   · Método 2 — extracción programática del HTML crudo (parseo
     determinístico de <h3 headline> + <a *.pdf>): 23 seminarios
     del 2.ºC 2026 con título/docente/modalidad/PDF exactos.
   · Método 3 — cotejo contra el Reglamento (fuente 2, texto
     descomprimido del PDF): confirma que TODOS los listados son
     "seminarios ad hoc / optativos"; el prefijo "Seminario TIF"
     NO es una categoría de plan aparte, sino un seminario
     optativo cuyo objetivo prioritario es dar herramientas para
     la tesina (art. 8.a del reglamento). Máx. 30 / mín. 7
     alumnos por seminario (art. 12). El reglamento NO fija ni la
     cantidad exigida ni las correlativas: eso vive en el plan
     504 (ya modelado en cc504.js: `REQ_SEMINARIOS` = 3 aprobadas
     del Recorrido Aplicado).

   NOTAS DE INTERPRETACIÓN:
   [a] `tif: true` marca los seminarios rotulados "Seminario TIF"
       en la página. Es metadata de display (badge opcional): a
       efectos del plan, TODOS estos seminarios llenan el mismo
       slot `sem` (2 Seminarios Ad Hoc / Optativos). No altera
       gate, peso ni conteo.
   [b] `id` deriva del nombre del PDF oficial (clave estable para
       el storage del estudiante entre cuatrimestres). Las
       diferencias de acento entre `id` (sin tilde, como el
       archivo) y `docente` (con tilde, como la página) son
       normalización de nombre de archivo, no errores.

   PUNTOS ABIERTOS (no cargados / a confirmar):
   1. HORARIOS, DÍAS y CÓDIGOS de materia: la página NO los
      publica ("El cuatrimestre de dictado y el horario de cada
      seminario puede confirmarse en la Oferta Académica que
      publica la Facultad" · SIU Guaraní). Quedan AFUERA.
   2. [★] Seminario de Gesualdi: la página escribe el apellido
      "Gesuladi"; el PDF oficial se llama `Gesualdi.pdf` (PDF
      escaneado, no verificable por texto). Se conserva el
      apellido como aparece en la página (`docente`) y se marca
      para confirmar.
   3. Relación de los "Seminario TIF" con el Taller de TIF (`ttif`)
      del plan 504: ninguna fuente mapea explícitamente que un
      "Seminario TIF" satisfaga el Taller de TIF. NO se mapea a
      `ttif`; solo a `sem` (donde todos son optativos válidos).
   ============================================================ */

export const OFERTA_CC504 = {
  carreraId: "cc504",
  // Período cuya oferta se muestra por defecto en la app.
  vigente: "2026-2C",
  periodos: {
    "2026-2C": {
      etiqueta: "2.º Cuatrimestre 2026",
      fuente: "https://comunicacion.sociales.uba.ar/seminarios/",
      consulta: "2026-07-19",
      reglamento:
        "https://comunicacion.sociales.uba.ar/wp-content/uploads/sites/16/2022/08/Reglamento_Seminarios_Aprobado_Junta22Jun12.pdf",
      // Llena la tarjeta-grupo `sem` de cc504.js (2 Seminarios Ad Hoc / Optativos).
      slots: {
        sem: [
          { id: "PortoLopez", titulo: "Argumentación y análisis de discursos mediatizados", docente: "Porto López", modalidad: "VIRTUAL", pdf: "https://comunicacion.sociales.uba.ar/wp-content/uploads/sites/16/2026/06/PortoLopez.pdf" },
          { id: "Cardoso", titulo: "Comunicación y Grupos: caja de herramientas", docente: "Cardoso", modalidad: "VIRTUAL", pdf: "https://comunicacion.sociales.uba.ar/wp-content/uploads/sites/16/2025/10/Cardoso.pdf" },
          { id: "Henkel", titulo: "Comunicación, Estado y Revolución. Experiencias latinoamericanas de comunicación estatal contrahegemónicas", docente: "Henkel", modalidad: "PRESENCIAL", pdf: "https://comunicacion.sociales.uba.ar/wp-content/uploads/sites/16/2025/10/Henkel.pdf" },
          { id: "Montells", titulo: "El podcast después del podcast. Radio y narraciones transmediales en los proyectos de la nueva normalidad", docente: "Montells", modalidad: "PRESENCIAL", pdf: "https://comunicacion.sociales.uba.ar/wp-content/uploads/sites/16/2025/10/Montells.pdf" },
          { id: "Palma", titulo: "Fútbol y (medios de) Comunicación", docente: "Palma", modalidad: "PRESENCIAL", pdf: "https://comunicacion.sociales.uba.ar/wp-content/uploads/sites/16/2025/10/Palma.pdf" },
          { id: "Gesualdi", titulo: "Fotoperiodismo: intervención social y producción", docente: "Gesuladi", modalidad: "PRESENCIAL", pdf: "https://comunicacion.sociales.uba.ar/wp-content/uploads/sites/16/2025/10/Gesualdi.pdf" }, // [★] página: "Gesuladi" · PDF: Gesualdi.pdf (escaneado). Confirmar.
          { id: "Manguia", titulo: "Algo más que la comunicación de los Procesos de Memoria, Verdad y Justicia", docente: "Manguía", modalidad: "VIRTUAL", tif: true, pdf: "https://comunicacion.sociales.uba.ar/wp-content/uploads/sites/16/2025/10/Manguia.pdf" },
          { id: "Zanarini", titulo: "Comunicación política y las fake news", docente: "Zanarini", modalidad: "PRESENCIAL", tif: true, pdf: "https://comunicacion.sociales.uba.ar/wp-content/uploads/sites/16/2025/10/Zanarini.pdf" },
          { id: "Borquez", titulo: "Comunicación pública de epidemias: herramientas teórico-prácticas para la intervención profesional", docente: "Bórquez", modalidad: "PRESENCIAL", tif: true, pdf: "https://comunicacion.sociales.uba.ar/wp-content/uploads/sites/16/2025/10/Borquez.pdf" },
          { id: "MartinezCanto", titulo: "Contenidos audiovisuales digitales para la intervención en territorios", docente: "Martínez Cantó", modalidad: "PRESENCIAL", tif: true, pdf: "https://comunicacion.sociales.uba.ar/wp-content/uploads/sites/16/2025/10/MartinezCanto.pdf" },
          { id: "Videla", titulo: "Plataformas musicales. Modos de construcción y tipos de usuarios propuestos", docente: "Videla", modalidad: "VIRTUAL", tif: true, pdf: "https://comunicacion.sociales.uba.ar/wp-content/uploads/sites/16/2025/10/Videla.pdf" },
          { id: "Beker", titulo: "Reescrituras y transposiciones: literatura y cine argentino del siglo XXI", docente: "Beker", modalidad: "VIRTUAL", tif: true, pdf: "https://comunicacion.sociales.uba.ar/wp-content/uploads/sites/16/2025/10/Beker.pdf" },
          { id: "Babio", titulo: "Abordaje de la inteligencia artificial: guía para una apropiación consciente de la herramienta", docente: "Babio", modalidad: "VIRTUAL", tif: true, pdf: "https://comunicacion.sociales.uba.ar/wp-content/uploads/sites/16/2025/10/Babio.pdf" },
          { id: "Rohatsch", titulo: "Aportes de la teoría feminista para pensar la práctica en Comunicación", docente: "Rohatsch", modalidad: "PRESENCIAL", tif: true, pdf: "https://comunicacion.sociales.uba.ar/wp-content/uploads/sites/16/2026/06/Rohatsch.pdf" },
          { id: "Gomez", titulo: "Comunicación Política y Opinión Pública", docente: "Gómez", modalidad: "VIRTUAL", tif: true, pdf: "https://comunicacion.sociales.uba.ar/wp-content/uploads/sites/16/2025/10/Gomez.pdf" },
          { id: "Benyo", titulo: "Comunidad, comunicación y formas extremas de la violencia política. Herramientas su abordaje en la imagen y el discurso", docente: "Benyo", modalidad: "VIRTUAL", tif: true, pdf: "https://comunicacion.sociales.uba.ar/wp-content/uploads/sites/16/2025/10/Benyo.pdf" },
          { id: "Villalba", titulo: "Culturas afectivas, subjetividades y comunicación", docente: "Villalba", modalidad: "VIRTUAL", tif: true, pdf: "https://comunicacion.sociales.uba.ar/wp-content/uploads/sites/16/2025/10/Villalba.pdf" },
          { id: "Besada", titulo: "Desafíos de la televisión en tiempos de Streamers y youtubers. El Periodismo audiovisual frente a un escenario en transformación. El nuevo espectáculo de la información y sus audiencias", docente: "Besada", modalidad: "VIRTUAL", tif: true, pdf: "https://comunicacion.sociales.uba.ar/wp-content/uploads/sites/16/2025/10/Besada.pdf" },
          { id: "Vazquez", titulo: "Fronteras, límites y alteridades. Investigar sobre la otredad en la Argentina", docente: "Vázquez", modalidad: "PRESENCIAL", tif: true, pdf: "https://comunicacion.sociales.uba.ar/wp-content/uploads/sites/16/2025/10/Vazquez.pdf" },
          { id: "Mazzuchini", titulo: "Memes e imágenes de la opinión pública", docente: "Mazzuchini", modalidad: "VIRTUAL", tif: true, pdf: "https://comunicacion.sociales.uba.ar/wp-content/uploads/sites/16/2025/10/Mazzuchini.pdf" },
          { id: "Gallego", titulo: "Música y construcción de identidades sociales en América Latina", docente: "Gallego", modalidad: "VIRTUAL", tif: true, pdf: "https://comunicacion.sociales.uba.ar/wp-content/uploads/sites/16/2025/10/Gallego.pdf" },
          { id: "Schtivelband", titulo: "Neoliberalismo y resistencias político-culturales en Argentina. Explorando estrategias a través del cine, la literatura, el humor gráfico y otras materialidades contemporáneas", docente: "Schtivelband", modalidad: "VIRTUAL", tif: true, pdf: "https://comunicacion.sociales.uba.ar/wp-content/uploads/sites/16/2025/10/Schtivelband.pdf" },
          { id: "Leis", titulo: "Sexualidad Integral y entorno digital. La producción de sentido en los nuevos espacios de interacción subjetiva", docente: "Leis", modalidad: "PRESENCIAL", tif: true, pdf: "https://comunicacion.sociales.uba.ar/wp-content/uploads/sites/16/2025/10/Leis.pdf" },
        ],
      },
    },
  },
};

// Devuelve la oferta nominada del período vigente para un slot dado, o [] si
// no hay oferta cargada (degradación limpia: la tarjeta se comporta como hoy).
export function ofertaDeSlot(oferta, slotId) {
  const periodo = oferta?.periodos?.[oferta?.vigente];
  const lista = periodo?.slots?.[slotId];
  return Array.isArray(lista) ? lista : [];
}

export default OFERTA_CC504;
