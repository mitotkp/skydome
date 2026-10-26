import { readFileSync } from 'node:fs'
import { gunzipSync } from 'node:zlib'

const comprimido =  readFileSync('datos-fuente/catalog.gz')
const texto = gunzipSync(comprimido).toString('latin1')
const lineas = texto.split('\n').filter((linea) => linea.length > 0)

console.log('Líneas del catálogo:', lineas.length)
console.log(lineas[2490])

