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

## Agregar una carrera nueva

1. Crear un archivo en `src/data/carreras/` con el objeto de la carrera.
2. Añadir la carrera al registro `src/data/carreras/index.js`.
3. No incluir datos hasta que estén verificados contra la resolución oficial.
4. Verificar que la nueva carrera tiene una `id` única y que `estado` es `en-preparacion` si no hay datos.
