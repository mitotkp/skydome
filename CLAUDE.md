# Skydome: contexto para Claude

Atlas del cielo nocturno de escritorio. Proyecto de portafolio personal del usuario (GitHub `mitotkp`), licencia MIT.
Stack: **Electron + TypeScript** (Electron Forge, plantilla `vite-typescript`), pruebas con **Vitest**, scripts con **tsx**.
No es una app web: se distribuye como ejecutable de escritorio. No subir a GitHub sin que el usuario lo pida.

## Cómo trabajar con el usuario (IMPORTANTE)
- Responder en **español neutral**, sin voseo.
- **El usuario programa; Claude enseña.** No escribir el código del proyecto por él salvo que lo pida explícitamente.
- Su base de TypeScript es básica (usa Vue/Node en el trabajo, pero se abrumó con instrucciones largas). Por eso:
  - **Un paso pequeño por mensaje.** Nada de listas de 6 tareas.
  - Dar el código de ejemplo **completo y explicado línea por línea**, y probarlo antes de dárselo.
  - Cerrar cada paso con **un mini ejercicio** (modificar algo pequeño) y esperar a que lo termine.
  - Ante un error suyo, dar pistas primero y la solución después.
- La teoría completa del proyecto está en [docs/TEORIA.md](docs/TEORIA.md).

## Estado actual (26-oct-2026)
- ✅ Paso 1: proyecto creado con Electron Forge; la ventana abre y dice "Skydome".
- ✅ Descargados en `datos-fuente/`: `catalog.gz` (BSC5, catálogo V/50 del CDS: https://cdsarc.cds.unistra.fr/ftp/V/50/) y su `ReadMe` (guardado como `ReadMe.md`). Verificado: 9110 líneas, 14 sin coordenadas, Sirio en la línea 2491.
- ✅ Paso 2: `src/tools/convertir-bsc5.ts` (ya renombrado) lee `catalog.gz` con `readFileSync` + `gunzipSync`, lo pasa a texto `latin1`, lo separa en líneas y las cuenta (9110). Se ejecuta con `npx tsx src/tools/convertir-bsc5.ts`. Mini ejercicio resuelto por él: mostró la línea de Sirio con `lineas[2490]`.
- Puede quedar una carpeta vacía `catalogo/` en la raíz; se puede borrar.

## Próximos pasos (hito 1, uno por mensaje). **Siguiente: paso 3**
3. Extraer columnas de una línea con `substring` (el ReadMe cuenta desde 1 y `substring` desde 0, con el final excluido). Columnas verificadas con Sirio: HR `(0,4)`, nombre `(4,14)`, AR h/m/s `(75,77)(77,79)(79,83)`, signo Dec `(83,84)`, Dec g/m/s `(84,86)(86,88)(88,90)`, Vmag `(102,107)`, B−V `(109,114)`, movimiento propio `(148,154)(154,160)`.
4. Convertir a grados: `AR = 15·(h + m/60 + s/3600)` y `Dec = signo·(d + m/60 + s/3600)`, con el signo aplicado al total. Saltar las 14 líneas sin coordenadas (deben quedar 9096 estrellas) y tratar B−V vacío.
5. Escribir `public/data/stars.bin` con `DataView`: cabecera `"SKY1"` + `Uint32` con la cantidad, y luego por estrella 6×`Float32` little-endian (ra, dec, mag, bv, pmRa, pmDec). Hay que decidir cómo guardar el número HR. Tamaño esperado sin HR: 8 + 9096×24 = 218 312 bytes.
6. `src/datos/catalogo.ts`: `fetch('/data/stars.bin')` → `arrayBuffer()` → estructura de arreglos (`Float32Array` por campo).
7. Prueba con Vitest usando `toBeCloseTo`: Sirio AR ≈ 101,287°, Dec ≈ −16,716°, mag −1,46, B−V 0,00; Vega (HR 7001) mag ≈ 0,03; Polaris (HR 424) Dec ≈ +89,26°.
8. Mostrar "9096 estrellas cargadas" en la ventana.
9. Constelaciones: `constellations.lines.json` y `constellations.bounds.json` de d3-celestial (GeoJSON; la AR viene de −180 a 180, hay que sumar 360 a los negativos). Escribir una tabla propia con los nombres de las 88 constelaciones.

## Hitos de la v0.1
1. Esqueleto y datos ← **aquí**
2. Astronomía: día juliano, GMST, alt/az, precesión, refracción. Pruebas con los ejemplos de Meeus (12.a, 13.b, 21.b, 47.a) y comparación con Stellarium (Sirio, Polaris, Vega, para un lugar y fecha fijos).
3. Vista: proyección estereográfica centrada en el cenit en un `<canvas>`, con tamaño por magnitud y color por B−V.
4. Constelaciones, Sol, Luna con su fase y planetas (elementos de Paul Schlyter).
5. Interacción: arrastrar, zoom, clic para ver datos, búsqueda, control del tiempo y ciudades (GeoNames cities15000).
6. Pulido: modo nocturno rojo, interfaz ES/EN, icono, capturas y README bilingüe.

## Licencias de los datos
- **BSC5:** dominio público según NASA/HEASARC ("U.S. government works"). Citar a Hoffleit & Warren (1991) en el README.
- **d3-celestial** (líneas y límites): BSD-3-Clause; copiar su aviso en `THIRD_PARTY_LICENSES.md`. **No** usar sus archivos de nombres en varios idiomas (vienen de Wikipedia, CC BY-SA).
- **GeoNames:** CC BY 4.0; citarlo.
