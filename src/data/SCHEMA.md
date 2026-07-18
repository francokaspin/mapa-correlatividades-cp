# Schema de datos para carreras

Este documento describe la estructura usada para cargar planes de estudio en `src/data/carreras/`.

## Estructura principal

Cada carrera exporta un objeto con esta forma:

```js
export default {
  id: "cp",
  nombre: "Ciencia Política",
  plan: {
    general: [ /* materias del ciclo general */ ],
    idioma: [ /* materias de idioma */ ],
    orientado: [ /* materias del ciclo orientado */ ],
    orientaciones: [ /* definiciones de cabeceras orientadas */ ],
  },
};
```

El registro `src/data/carreras/index.js` expone un arreglo `CARRERAS` con:

- `id`: identificador corto usado en el hash de la url.
- `nombre`: nombre de la carrera.
- `color`: color de acento para la UI.
- `estado`: `activa` o `en-preparacion`.
- `data`: referencia al archivo de datos cuando la carrera está disponible.

Las carreras en preparación se deben publicar sin archivo de datos y con `estado: "en-preparacion"`.

## Materias

Cada materia admite estas propiedades:

- `id`: clave única.
- `n`: nombre completo.
- `s`: nombre corto mostrado en el mapa.
- `req`: arreglo de requisitos.
- `min`: número mínimo de materias aprobadas de un grupo.
- `countdown`: habilita cuando faltan N materias para el título.
- `orientado`: verdadero para las materias del ciclo orientado.

- `cantidad`: la tarjeta es una **tarjeta-grupo** y representa N materias (ver abajo).

Campos de **solo presentación** (el evaluador los ignora; sirven para el mapa):

- `cod` / `nro`: código o número oficial de la materia en el plan (p. ej. RT usa `cod`, TS usa `nro`).
- `anual`: `true` marca las materias anuales (los talleres de Trabajo Social); la tarjeta muestra un badge "Anual".
- `reqAprobadas`: `true` cuando el plan pide las correlativas **aprobadas** (con final), no solo
  cursadas. La tarjeta muestra un badge "Aprobadas"; el detalle va en el `footer`. El evaluador
  **no** distingue cursada de aprobada (cada materia es un booleano), así que este campo es copy.

## Tarjetas-grupo (`cantidad`)

Un tramo optativo que se elige "N materias de un conjunto" se modela como **una tarjeta por grupo**
con `cantidad: N`, en vez de N tarjetas sueltas. La tarjeta:

- pide sus `req` **fijos** (no es un umbral: para eso está `min`);
- muestra un badge `×N`;
- es un solo tick, y **pesa N** en la barra de progreso y en el conteo del bloque.

```js
// Sociología: 6 Sociologías Especiales que piden HCS II + Metodología I
{ id: "espec", n: "Sociologías Especiales", s: "Soc. Especiales",
  cantidad: 6, req: ["hcs2", "met1"] }
```

Una tarjeta sin `cantidad` pesa 1, así que las carreras que no usan grupos no cambian.

## Requisitos

Los requisitos pueden expresarse como:

- `"otroId"`: requiere una materia específica.
- `{ or: ["A", "B"] }`: requiere al menos uno de varios elementos.
- `{ and: ["A", "B"] }`: requiere todos los elementos del grupo.
- `{ min: N, of: "general", includes: [ ... ] }`: requiere al menos `N` materias aprobadas de un conjunto, incluyendo requisitos adicionales.
- `{ countdown: N }`: habilita cuando faltan `N` materias para el título.
- `{ orientation: true }`: requiere que se haya aprobado la cabecera de la orientación activa, o cualquier cabecera si no hay orientación elegida.

### Ejemplo: umbral con inclusión

```js
{
  req: [
    {
      min: 6,
      of: "general",
      includes: ["eco", { or: ["tps1", "fcp1"] }],
    },
  ],
}
```

Este requisito exige:

- al menos 6 materias aprobadas del ciclo general;
- entre ellas debe estar `eco`;
- además debe estar `tps1` o `fcp1`.

### Ejemplo: cuenta regresiva

```js
{
  req: [
    { countdown: 3 }
  ]
}
```

Significa que la materia se habilita cuando quedan 3 o menos materias pendientes para completar el plan.

## Ejemplo de CP (plan 8558/17)

El archivo `src/data/carreras/cp.js` contiene la definición de la carrera de Ciencia Política.

- El ciclo general es un arreglo de materias.
- El bloque `idioma` usa `min: 6` en Nivel I.
- El bloque `orientado` usa requisitos genéricos con `min: 12` e inclusión de cabeceras de orientación.

## Presentación (`ui.js`)

Cada carrera tiene un objeto de UI (en `src/data/carreras/ui.js`) que separa el
*cómo se muestra* del *qué pide cada materia*:

- `countBase`: el bloque que resuelve los requisitos `{ min, of: "general" }`.
- `countKeys`: los bloques que **suman a la barra**. Por defecto `[countBase]`. Sociología usa
  `["general", "optativas"]` para llegar a 25 (16 obligatorias + 6 especiales + 3 teorías);
  su idioma y sus 200 hs corren por fuera del conteo.
- `milestones`: hitos con umbral numérico. Cada uno (`{ at, tick, pillOn, pillOff }`)
  dibuja una marca en la barra de progreso y una pill que se enciende al llegar a `at`.
  Una carrera sin umbrales (Sociología: todos los req son fijos) va con `milestones: []`.
- `infoPills`: pills **informativas sin tick ni conteo** (`{ label }`). No dependen de un
  umbral; se usan para hitos sin condición numérica (p. ej. la Tesina/TIF de Trabajo Social).
  Opcionalmente toman `{ req, labelOn }`: con `req` cumplido la pill se enciende y muestra
  `labelOn` (p. ej. las 200 hs de investigación de Sociología, que piden Metodología I +
  Sociología Sistemática). Sigue sin tick y sin sumar al conteo.
- `blocks`: bloques del plan a renderizar (`planKey`, `title`, `subtitle`).
- `footer`: nota al pie, **configurable por carrera** (p. ej. TS aclara que la correlativa
  se pide CURSADA/regularizada, no aprobada con final). Cuando el texto es data verificada,
  conviene importarlo del archivo de la carrera en vez de repetirlo (Sociología importa su
  `NOTA_PIE`), así no deriva.

## Agregar una carrera nueva

1. Crear un archivo en `src/data/carreras/` con el objeto de la carrera.
2. Añadir la carrera al registro `src/data/carreras/index.js`.
3. No incluir datos hasta que estén verificados contra la resolución oficial.
4. Verificar que la nueva carrera tiene una `id` única y que `estado` es `en-preparacion` si no hay datos.
