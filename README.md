# Japanese Role Play - Visual Novel Engine

Novela visual estilo Apple scrollytelling. El scroll controla la aparicion secuencial de elementos sobre un fondo sticky.

---

## Estructura

```
japanese-roleplay/
├── index.html          ← Entry point
├── config.js           ← SOLO ESTE ARCHIVO EDITAS
├── js/
│   └── engine.js       ← Motor (no tocar)
├── css/
│   └── style.css       ← Estilos
├── images/             ← Personajes y fondos
└── README.md
```

---

## Como Funciona

### Arquitectura Static-Scroll

Cada escena con dialogo es un contenedor de **400vh de altura**. Dentro, el contenido visual es **sticky** (100vh) — no se mueve mientras scrolleas.

El scroll dentro de esos 400vh controla la **opacidad** de cada elemento secuencialmente:

```
Scroll 0-25%   → Elemento 1: opacity 0 → 1 (fade-in)
Scroll 25-50%  → Elemento 2: opacity 0 → 1
Scroll 50-75%  → Elemento 3: opacity 0 → 1
Scroll 75-100% → Elemento 4: opacity 0 → 1
Scroll 100%    → Snap a la siguiente escena
```

Los elementos aparecen **solo con opacity** — sin translateY, sin movimiento.

### Welcome y Closing

Estas dos escenas son **cortas** (100vh). Todos sus elementos son visibles inmediatamente (`always-on`). No tienen secuencia de scroll.

### Hard Reset

Cuando una escena con un fondo diferente entra en vista, todos los elementos de la escena anterior se ocultan instantaneamente (sin transicion).

### Scroll-Snap

El contenedor tiene `scroll-snap-type: y mandatory`. Cada escena snappea al inicio, no puedes quedar a mitad de camino.

---

## Como Editar

Solo editas `config.js`.

---

## Estructura de Escena

```javascript
{
  id: 'esc_1',
  background: {
    type: 'full',         // 'full' | 'split-v' | 'split-h' | 'diagonal'
    image: 'fondo.jpg',   // Para 'full'
    color: 'gradient...', // Para 'full' sin imagen
    left: 'fondo.jpg',    // Para 'split-v'
    right: 'fondo.jpg',   // Para 'split-v'
    top: 'fondo.jpg',     // Para 'split-h' o 'diagonal'
    bottom: 'fondo.jpg',  // Para 'split-h' o 'diagonal'
    direction: 'tl-br',   // Para 'diagonal': 'tl-br' (↘) | 'tr-bl' (↙)
  },
  sequence: [
    { type: 'character', id: 'komori', file: 'komori.png', position: 'right' },
    { type: 'bubble', target: 'komori', text: { jp: '...', en: '...' } },
  ],
}
```

---

## Element Types

### Personaje
```javascript
{ type: 'character', id: 'komori', file: 'komori.png', position: 'right' }
```
Posiciones: `'left'` `'right'` `'center'` `'top'` `'bottom'` `'first'` `'second'`

El `id` es la referencia para las burbujas.

### Burbuja (personaje solo)
```javascript
{ type: 'bubble', target: 'komori', text: { jp: 'こんにちは', en: 'Hola' } }
```

### Burbuja en split
```javascript
{ type: 'bubble-split', target: 'komori', text: { jp: '...', en: '...' } }
```

### Burbuja en diagonal
```javascript
{ type: 'bubble-diag', target: 'komori', text: { jp: '...', en: '...' } }
```

### Portada
```javascript
{
  id: 'welcome',
  isWelcome: true,
  background: { type: 'full', color: 'linear-gradient(...)' },
  elements: [
    { type: 'title', text: '...' },
    { type: 'subtitle', text: '...' },
    { type: 'names', text: '...' },
    { type: 'scroll-hint', text: 'SCROLL ↓' },
  ],
}
```

### Cierre
```javascript
{
  id: 'closing',
  background: { type: 'full', color: 'linear-gradient(...)' },
  elements: [
    { type: 'closing-title', text: '終わり' },
    { type: 'closing-sub', text: 'Fin' },
    { type: 'closing-names', text: '...' },
    { type: 'closing-class', text: '...' },
  ],
}
```

---

## Agregar nueva escena

Copia un bloque y pegalo en el array `storyContent`:

```javascript
{
  id: 'mi_escena',
  background: { type: 'full', image: 'fondo-entrada.jpg' },
  sequence: [
    { type: 'character', id: 'komori', file: 'komori.png', position: 'right' },
    { type: 'bubble', target: 'komori', text: { jp: '...', en: '...' } },
  ],
},
```

Cada elemento en la secuencia agrega un "paso" al scroll de la escena.

---

## Agregar fondo nuevo

1. Pon la imagen en `images/mi-fondo.jpg`
2. En `config.js`:
```javascript
background: { type: 'full', image: 'mi-fondo.jpg' }
```

---

## Abrir

Doble click en `index.html` o Live Server en VS Code.
