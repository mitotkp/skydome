# Skydome: teoría del proyecto

Lo que hace el programa, en una línea: a partir de **un lugar** (latitud y longitud) y **un instante** (fecha y hora UTC), dibujar el cielo que se ve desde ahí.

Todo el cálculo es una cadena de pasos:

```
catálogo (AR/Dec J2000) → precesión a la fecha → ángulo horario (con tiempo sidéreo)
→ altura/acimut → refracción → proyección a 2D → píxeles
```

## 1. Sistemas de coordenadas
- **Ecuatoriales (α, δ):** ascensión recta (AR) y declinación. Están fijas al cielo y son las que traen los catálogos. La AR va de 0 a 24 h (= 0–360°) y la declinación de −90° a +90°.
- **Horizontales (h, A):** altura sobre el horizonte y acimut (0° = norte, 90° = este). Dependen del observador y de la hora, y son las que se dibujan.
- **Eclípticas (λ, β):** referidas a la órbita de la Tierra. Se usan para el Sol, la Luna y los planetas. Se pasan a ecuatoriales con la oblicuidad ε ≈ 23,4393°.

## 2. El tiempo
- **Día juliano (JD):** un contador continuo de días. Época de referencia: J2000.0 = JD 2451545,0.
- **UT y TT:** las órbitas usan TT = UT + ΔT, con ΔT ≈ 69 s. Importa un poco para la Luna y casi nada para las estrellas.
- **Tiempo sidéreo de Greenwich (GMST)**, Meeus cap. 12: `θ₀ = 280,46061837° + 360,98564736629·(JD − 2451545) + …`. La Tierra da una vuelta respecto a las estrellas cada 23 h 56 min 4 s.
- **Tiempo sidéreo local:** LST = GMST + longitud (este positiva).
- **Ángulo horario:** H = LST − α.

## 3. De ecuatoriales a altura y acimut
Con la latitud φ:
```
sin h = sin φ · sin δ + cos φ · cos δ · cos H
A = atan2( sin H , cos H · sin φ − tan δ · cos φ ) + 180°
```
Prueba rápida de que está bien: Polaris queda siempre a una altura ≈ φ.

## 4. Correcciones
| Efecto | Tamaño | ¿En la v0.1? |
|---|---|---|
| Precesión (Meeus cap. 21, ángulos ζ, z, θ) | ~0,35° desde 2000 | Sí |
| Movimiento propio (lo trae el BSC5) | ″ por siglo | Sí |
| Refracción, Saemundsson: `R = 1,02′ / tan(h + 10,3/(h+5,11))` | ~0,5° en el horizonte | Sí, opcional |
| Paralaje de la Luna | hasta ~1° | Sí, imprescindible |
| Nutación y aberración | ~20″ | No |

## 5. Proyección en pantalla (estereográfica centrada en el cenit)
```
z = 90° − h
r = 2 · tan(z / 2)
x = −r · sin A ,  y = r · cos A
```
- El signo menos en x se debe a que miramos hacia arriba: con el norte arriba, el este queda a la izquierda.
- Esta proyección conserva los ángulos y convierte círculos en círculos, así que las constelaciones no se deforman.
- El horizonte queda como un círculo de radio 2 y el zoom es un factor de escala.

## 6. Cómo se ve cada estrella
- **Brillo:** flujo ∝ 10^(−0,4·m) (escala de Pogson). El radio se toma proporcional a la raíz del flujo, con un mínimo y un máximo.
- **Color:** de B−V a temperatura con la fórmula de Ballesteros, `T = 4600·(1/(0,92·BV+1,7) + 1/(0,92·BV+0,62))`, y de la temperatura a RGB con una tabla de cuerpo negro.

## 7. Sol, Luna y planetas (Paul Schlyter)
1. Anomalía media M → ecuación de Kepler `E − e·sin E = M`, resuelta con Newton.
2. Posición en la órbita → heliocéntricas → se resta la Tierra → geocéntricas.
3. Eclípticas → ecuatoriales → el mismo camino que una estrella.
4. La Luna necesita unas 12 perturbaciones y la corrección de paralaje.
5. Fase: ángulo de fase i a partir de la elongación; fracción iluminada `k = (1 + cos i)/2`.

## 8. Electron (cómo está armada la app)
| Pieza | Qué es | Qué hace en Skydome |
|---|---|---|
| Proceso principal (`main.ts`) | Node, sin pantalla | Crear la ventana |
| Renderer (`renderer.ts` + `index.html`) | Chromium | Cálculos, dibujo en `<canvas>` e interfaz |
| Preload (`preload.ts`) | Puente seguro entre los dos | Por ahora nada |

El renderer no tiene acceso a Node, así que los datos se cargan con `fetch('/data/stars.bin')`.

## 9. Datos en binario
- Comparado con JSON: ~220 KB en lugar de ~1 MB, y se lee sin interpretar nada.
- Herramientas: `ArrayBuffer` (los bytes), `DataView` (leer o escribir un número en una posición; usar siempre little-endian) y `Float32Array` (vista rápida para recorrer los datos).
- `Float32` da un error de ~0,1″, suficiente.
- Usar una **estructura de arreglos** (`ra: Float32Array`, `dec: Float32Array`, …) en lugar de un arreglo de objetos: es más rápido de recorrer y no genera trabajo al recolector de basura.

## 10. Verificación
- Ejemplos resueltos de Meeus: 12.a (GMST del 10-abr-1987 = 13h10m46,3668s), 13.b (Venus alt/az), 21.b (precesión de θ Persei), 47.a (Luna).
- Stellarium: un lugar y una hora fijos, anotando la altura y el acimut de Sirio, Polaris y Vega. Tolerancia: menos de 0,1° para las estrellas y unos minutos de arco para los planetas.
