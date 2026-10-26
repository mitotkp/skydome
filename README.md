# Skydome

**Español** · [English](#english)

Atlas del cielo nocturno de escritorio, hecho con **Electron + TypeScript**. A partir de un lugar y una hora, dibujará el cielo que se ve desde ahí: estrellas, constelaciones, Sol, Luna y planetas.

> 🚧 **En desarrollo.** Es un proyecto de aprendizaje que se construye paso a paso. Por ahora existe la ventana de la app y un conversor que lee el catálogo de estrellas.

## Estado
| Hito | Contenido | Estado |
|---|---|---|
| 1 | Esqueleto del proyecto y datos (catálogo de estrellas, constelaciones) | 🔄 En curso |
| 2 | Astronomía: tiempo sidéreo, altura/acimut, precesión, refracción | ⏳ |
| 3 | Vista de la cúpula (proyección estereográfica), estrellas por brillo y color | ⏳ |
| 4 | Constelaciones, Sol, Luna con su fase y planetas | ⏳ |
| 5 | Interacción: arrastrar, zoom, búsqueda, control del tiempo, ciudades | ⏳ |
| 6 | Modo nocturno rojo, interfaz ES/EN, icono | ⏳ |

La teoría detrás de cada parte está en [docs/TEORIA.md](docs/TEORIA.md).

## Requisitos
- Node.js 22 o superior

## Cómo ejecutarlo
```bash
npm install
npm start
```

## Datos de estrellas
El catálogo no se incluye en el repositorio. Para generarlo:
1. Descarga `catalog.gz` y `ReadMe` de https://cdsarc.cds.unistra.fr/ftp/V/50/ y guárdalos en la carpeta `datos-fuente/`.
2. Ejecuta el conversor:
   ```bash
   npx tsx src/tools/convertir-bsc5.ts
   ```

## Créditos de los datos
- **Yale Bright Star Catalogue, 5.ª edición revisada** — Hoffleit, D. & Warren Jr., W. H. (1991), catálogo V/50 del CDS. Dominio público.

## Licencia
[MIT](LICENSE)

---

## English

Desktop night-sky atlas built with **Electron + TypeScript**. Given a place and a time, it will draw the sky as seen from there: stars, constellations, the Sun, the Moon and the planets.

> 🚧 **Work in progress.** This is a learning project built step by step. So far there is the app window and a converter that reads the star catalogue.

### Run
```bash
npm install
npm start
```

### Star data
The catalogue is not included in the repository. Download `catalog.gz` and `ReadMe` from https://cdsarc.cds.unistra.fr/ftp/V/50/ into `datos-fuente/`, then run `npx tsx src/tools/convertir-bsc5.ts`.

### Data credits
- **Yale Bright Star Catalogue, 5th Revised Ed.** — Hoffleit, D. & Warren Jr., W. H. (1991), CDS catalogue V/50. Public domain.

### License
[MIT](LICENSE)
