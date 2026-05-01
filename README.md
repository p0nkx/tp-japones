# Japanese Role Play - Visual Novel Engine

Novela visual interactiva con control por scroll. Cada scroll revela un nuevo elemento en secuencia, con transiciones suaves entre escenas.

---

## Estructura del Proyecto

```
japanese-roleplay/
├── index.html          ← Solo abrir en navegador, no editar
├── config.js           ← ARCHIVO PRINCIPAL: aquí defines toda tu historia
├── js/
│   └── engine.js       ← Motor de renderizado (no tocar)
├── css/
│   └── style.css       ← Estilos visuales (opcional)
├── images/             ← Aquí van personajes y fondos
│   ├── komori.png
│   ├── asahi.png
│   ├── fondo-entrada.jpg
│   └── clase.jpg
└── README.md
```

---

## Cómo Funciona el Motor

### Navegación
- **Scroll del mouse**: avanza/retrocede paso a paso
- **Teclas**: ↑ (retroceder) ↓ o Espacio (avanzar)
- **Touch**: deslizar arriba/abajo en móvil
- El scroll nativo está desactivado — solo el motor controla la navegación

### Pasos y Escenas
- Cada escena tiene una **secuencia de elementos** (personajes, burbujas, etc.)
- **Cada scroll = un paso**: aparece un nuevo elemento con fade-in
- Al cambiar de escena: overlay negro → se carga todo el contenido → fade-out del negro
- **Welcome y Closing**: muestran todos sus elementos de una vez (no tienen pasos secuenciales)

### Burbujas de Diálogo
- Al definir una **nueva burbuja** para un personaje que ya tiene una visible, la anterior se oculta con fade-out
- Al retroceder con scroll, la burbuja anterior reaparece con fade-in
- La burbuja **hereda la posición del personaje** por defecto, pero puedes forzar una posición distinta

---

# 📖 Guía Completa de Edición

Solo necesitas editar `config.js`. La variable `storyContent` es un array donde cada objeto es una escena.

---

## 🎨 Tipos de Fondo

### 1. Full (una sola imagen)

```javascript
background: { type: 'full', image: 'fondo-entrada.jpg' }
```

Con color degradado (sin imagen):
```javascript
background: { type: 'full', color: 'linear-gradient(180deg, #1a1a2e, #0f3460)' }
```

### 2. Split Vertical (izquierda / derecha)

Divide el fondo con una línea vertical central:
```javascript
background: { type: 'split-v', left: 'clase.jpg', right: 'fondo.jpg' }
```

### 3. Split Horizontal (arriba / abajo)

Divide el fondo con una línea horizontal central:
```javascript
background: { type: 'split-h', top: 'clase.jpg', bottom: 'fondo.jpg' }
```

### 4. Diagonal ↘ (esquina superior-izq → inferior-der)

Corte diagonal de (0,0) a (100%,100%):
```javascript
background: {
  type: 'diagonal',
  direction: 'tl-br',   // tl-br = esquina ↘
  top: 'clase.jpg',     // triángulo superior-derecho
  bottom: 'fondo.jpg',  // triángulo inferior-izquierdo
}
```

### 5. Diagonal ↙ (esquina superior-der → inferior-izq)

Corte diagonal de (100%,0) a (0,100%):
```javascript
background: {
  type: 'diagonal',
  direction: 'tr-bl',   // tr-bl = esquina ↙
  top: 'clase.jpg',     // triángulo superior-izquierdo
  bottom: 'fondo.jpg',  // triángulo inferior-derecho
}
```

> **Nota**: Las imágenes se ponen en la carpeta `images/` y se referencian solo por nombre: `'mifondo.jpg'`

---

## 👤 Personajes

```javascript
{ type: 'character', id: 'komori', file: 'komori.png', position: 'right' }
```

| Campo | Descripción |
|-------|-------------|
| `type` | Siempre `'character'` |
| `id` | Identificador único. Se usa en las burbujas con `target` |
| `file` | Archivo PNG en `images/` |
| `position` | Posición en la escena (ver tabla abajo) |

### Posiciones Disponibles

| Valor | Visual | Cuándo usar |
|-------|--------|-------------|
| `left` | Abajo-izquierda | Fondo full, split-v |
| `right` | Abajo-derecha | Fondo full, split-v |
| `center` | Abajo-centro | Fondo full |
| `top` | Arriba-centro | Split-h, diagonal |
| `bottom` | Abajo-centro | Split-h, diagonal |
| `top-right` | Mitad superior, lado derecho | Split-h, split-v |
| `top-left` | Mitad superior, lado izquierdo | Split-h, split-v |
| `bottom-right` | Mitad inferior, lado derecho | Split-h, split-v |
| `bottom-left` | Mitad inferior, lado izquierdo | Split-h, split-v |
| `tl` | Dentro del triángulo superior-izq | Diagonal |
| `tr` | Dentro del triángulo superior-der | Diagonal |
| `bl` | Dentro del triángulo inferior-izq | Diagonal |
| `br` | Dentro del triángulo inferior-der | Diagonal |

> **Importante**: El `id` debe ser único por personaje dentro de una escena. Es la referencia para posicionar las burbujas.

---

## 💬 Burbujas de Diálogo

### Burbuja Básica (hereda posición del personaje)

```javascript
{ type: 'bubble', target: 'komori', text: { jp: 'こんにちは！', en: '¡Hola!' } }
```

| Campo | Descripción |
|-------|-------------|
| `type` | Siempre `'bubble'` |
| `target` | El `id` del personaje al que pertenece |
| `text.jp` | Texto en japonés |
| `text.en` | Texto en español (u otro idioma) |
| `position` | **Opcional**: fuerza una posición diferente |

### Burbuja con Posición Forzada

```javascript
// Aunque komori está en 'left', la burbuja aparece centrada arriba
{ type: 'bubble', target: 'komori', position: 'center', text: { jp: 'こんにちは！', en: '¡Hola!' } }
```

### Posiciones Disponibles para Burbujas

| Valor | Posición | Descripción |
|-------|----------|-------------|
| `left` | 6% izq, 8% arriba | Junto al personaje izq → centro |
| `right` | 6% der, 8% arriba | Junto al personaje der → centro |
| `center` | Centrado arriba | Centro de la escena |
| `top-right` | 10% der, 6% arriba | Arriba-derecha |
| `top-left` | 10% izq, 6% arriba | Arriba-izquierda |
| `bottom-right` | 10% der, 6% abajo | Abajo-derecha |
| `bottom-left` | 10% izq, 6% abajo | Abajo-izquierda |
| `tl` | 8% izq, 5% arriba | Esquina superior-izquierda |
| `tr` | 8% der, 5% arriba | Esquina superior-derecha |
| `bl` | 8% izq, 5% abajo | Esquina inferior-izquierda |
| `br` | 8% der, 5% abajo | Esquina inferior-derecha |

### Cómo Funciona el Reemplazo de Burbujas

```javascript
// Paso 1: Aparece la primera burbuja de komori
{ type: 'bubble', target: 'komori', text: { jp: 'こんにちは！', en: '¡Hola!' } },

// Paso 2: Aparece segunda burbuja → la primera desaparece con fade-out
{ type: 'bubble', target: 'komori', text: { jp: 'はじめまして！', en: '¡Mucho gusto!' } },

// Paso 3: Tercera burbuja con posición distinta → la segunda desaparece
{ type: 'bubble', target: 'komori', position: 'top-left', text: { jp: 'よろしく！', en: '¡Encantado!' } },
```

Si retrocedes con scroll, las burbujas anteriores reaparecen en orden inverso.

---

## 📝 Estructura Completa de una Escena

```javascript
{
  id: 'mi_escena',                              // ID único (sin espacios)
  background: {
    type: 'full',                               // 'full' | 'split-v' | 'split-h' | 'diagonal'
    image: 'fondo-entrada.jpg',                 // Para 'full'
    // Para split-v: left: 'izq.jpg', right: 'der.jpg'
    // Para split-h: top: 'arriba.jpg', bottom: 'abajo.jpg'
    // Para diagonal: type: 'diagonal', direction: 'tl-br', top: 'arriba.jpg', bottom: 'abajo.jpg'
  },
  sequence: [
    // Paso 1: Aparece personaje
    { type: 'character', id: 'komori', file: 'komori.png', position: 'right' },

    // Paso 2: Aparece su burbuja
    { type: 'bubble', target: 'komori', text: { jp: 'こんにちは！', en: '¡Hola!' } },

    // Paso 3: Aparece segundo personaje
    { type: 'character', id: 'asahi', file: 'asahi.png', position: 'left' },

    // Paso 4: Aparece su burbuja (hereda 'left' de asahi)
    { type: 'bubble', target: 'asahi', text: { jp: 'やあ！', en: '¡Hey!' } },

    // Paso 5: Primera burbuja de komori desaparece, aparece esta nueva
    { type: 'bubble', target: 'komori', text: { jp: '元気？', en: '¿Cómo estás?' } },
  ],
}
```

> **Regla**: Cada elemento en `sequence` = un paso de scroll.

---

## 🎬 Escena de Portada (Welcome)

```javascript
{
  id: 'welcome',
  isWelcome: true,                              // Marca como portada (muestra todo de una vez)
  background: { type: 'full', color: 'linear-gradient(180deg, #1a1a2e, #16213e, #0f3460)' },
  elements: [
    { type: 'title', text: '会話 - Role Play' },
    { type: 'subtitle', text: 'Trabajo Práctico Final' },
    { type: 'names', text: 'Tu Nombre & Tu Compañero' },
    { type: 'scroll-hint', text: 'SCROLL ↓' },
  ],
}
```

---

## 🔚 Escena de Cierre (Closing)

```javascript
{
  id: 'closing',
  background: { type: 'full', color: 'linear-gradient(180deg, #FF6B6B, #4A0E4E, #1a1a2e)' },
  elements: [
    { type: 'closing-title', text: '終わり' },
    { type: 'closing-sub', text: 'Fin' },
    { type: 'closing-names', text: 'Tu Nombre & Tu Compañero' },
    { type: 'closing-class', text: 'Clase de Japonés - 2025' },
  ],
}
```

---

## 🚀 Cómo Agregar una Nueva Escena

1. **Agrega las imágenes** a la carpeta `images/` (PNGs para personajes, JPGs para fondos)
2. **Edita `config.js`** — copia un bloque de escena existente y pégalo antes del `closing`
3. **Cambia** el `id`, el `background` y la `sequence` con tus datos

```javascript
// Copia este bloque y pégalo antes del closing:
{
  id: 'mi_nueva_escena',
  background: { type: 'full', image: 'mi-fondo.jpg' },
  sequence: [
    { type: 'character', id: 'personaje1', file: 'mi-personaje.png', position: 'left' },
    { type: 'bubble', target: 'personaje1', text: { jp: 'こんにちは！', en: '¡Hola!' } },
  ],
},
```

---

## 🎮 Control de Scroll

- **Avanzar**: scroll hacia abajo, flecha ↓, o barra espaciadora
- **Retroceder**: scroll hacia arriba o flecha ↑
- Cada paso tiene un cooldown de 500ms para evitar saltos accidentales
- Entre escenas hay un overlay negro de 300ms como transición

---

## 📱 Responsive

- **Desktop**: ancho del frame al 88%
- **Tablet (≤768px)**: 93% de ancho, burbujas más grandes
- **Móvil (≤480px)**: 95% de ancho, burbujas al 70% del ancho

---

## ⚠️ Reglas Importantes

1. **No modifiques `engine.js`** a menos que sepas lo que haces
2. **Cada `id` de personaje** debe ser único dentro de una escena
3. **El `target` de una burbuja** debe coincidir con un `id` de personaje existente
4. **El `id` de escena** debe ser único (no repetir)
5. **La portada** usa `isWelcome: true` y `elements` (no `sequence`)
6. **El cierre** usa `id: 'closing'` (no cambiar)
7. **Las imágenes** van en `images/` y se referencian solo por nombre

---

## 🛠 Abrir el Proyecto

- **Simple**: doble click en `index.html`
- **Recomendado**: Live Server en VS Code (recarga automática al editar `config.js`)
