# Documentación del Editor Visual

## Resumen

El editor visual permite crear visual novels interactivas sin escribir código. Gestiona escenas, personajes, diálogos y narraciones mediante una interfaz gráfica.

---

## Archivos y su Propósito

| Archivo | Propósito |
|---------|-----------|
| `js/editor/editor-core.js` | Estado global y navegación principal |
| `js/editor/editor-renderer.js` | Renderizado de elementos en pantalla |
| `js/editor/editor-drag.js` | Arrastrar, seleccionar, redimensionar |
| `js/editor/editor-timeline.js` | Lista de pasos y menú de configuración |
| `js/editor/editor-panel.js` | Panel flotante de control |
| `js/editor/editor-scenes.js` | Gestión de escenas |
| `js/editor/editor-preview.js` | Modo vista previa |
| `js/editor/editor-explorer.js` | Explorador de recursos |

---

## Glosario de Propiedades

### Propiedades de Elementos (character, bubble, narration, object)

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `type` | string | Tipo de elemento: "character", "bubble", "narration", "object" |
| `id` | string | Identificador único del elemento |
| `src` | string | Ruta de la imagen (para characters y objects) |
| `position` | object | Posición y tamaño: `{left, top, width, height}` |
| `hidden` | boolean | Ocultar manualmente el elemento |
| `tremble` | boolean | Animación de temblor |
| `disappearAfter` | number | Ocultar tras X pasos (0=desactivado) |
| `showAfter` | number | Mostrar tras X pasos (0=desactivado) |

### Propiedades de Burbujas (type: "bubble")

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `text` | string | Contenido del diálogo |
| `tailPosition` | object | Posición de la colita: `{left, top, at}` |
| `charId` | string | ID del personaje que habla |
| `charName` | string | Nombre del personaje |

### Propiedades de Narración (type: "narration")

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `text` | string | Contenido de la narración |
| `style` | string | Estilo: "default" o personalizado |

### Propiedades de Escena

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `id` | string | Identificador único |
| `title` | string | Título de la escena |
| `background` | string | Ruta de imagen de fondo |
| `sequence` | array | Array de elementos en orden de aparición |

---

## Estructura del Proyecto (JSON)

```json
{
  "title": "Nombre del Proyecto",
  "author": "Autor",
  "resources": {
    "characters": [
      { "id": "char1", "name": "Personaje 1", "src": "img/char1.png" }
    ],
    "backgrounds": [
      { "id": "bg1", "name": "Fondo 1", "src": "img/bg1.jpg" }
    ],
    "objects": [
      { "id": "obj1", "name": "Objeto 1", "src": "img/obj1.png" }
    ]
  },
  "scenes": [
    {
      "id": "scene1",
      "title": "Escena 1",
      "background": "img/bg1.jpg",
      "sequence": [
        {
          "type": "character",
          "id": "char1",
          "src": "img/char1.png",
          "position": { "left": 20, "top": 50, "width": 200, "height": 400 }
        },
        {
          "type": "bubble",
          "text": "¡Hola!",
          "charId": "char1",
          "charName": "Personaje 1",
          "position": { "left": 50, "top": 100, "width": 150, "height": 80 },
          "tailPosition": { "left": 20, "top": 60, "at": "bottom-left" }
        }
      ]
    }
  ]
}
```

---

## CSS → Visual (css/style.css)

### Elementos en Pantalla

| Clase CSS | Elemento Visual |
|-----------|------------------|
| `.scene-visual` | Contenedor principal de la escena |
| `.scene-visual .character` | Imagen de personaje |
| `.scene-visual .bubble` | Burbuja de diálogo |
| `.scene-visual .bubble.pos-custom::after` | Cola de la burbuja (triángulo) |
| `.scene-visual .narration` | Bloque de narración |
| `.scene-visual .object` | Objeto decorativo |
| `.bg-layer` | Capa de fondo |
| `.step-item` | Item en el timeline |
| `.step-badge` | Badge "+X" para showAfter |

### Controles del Editor

| Clase CSS | Elemento Visual |
|-----------|------------------|
| `#editor-panel` | Panel flotante principal |
| `.resize-handle` | Handles de redimensión |
| `.resize-handle.right` | Handle horizontal (ancho) |
| `.resize-handle.bottom` | Handle vertical (alto) |
| `.resize-handle.br` | Handle de escala (esquina) |
| `.tail-handle` | Handle para mover colita |
| `.selected` | Elemento seleccionado |
| `.editor-mode` | Body cuando está en modo editor |

---

## Cómo Usar el Editor

### 1. Activar el Editor

Presiona `Ctrl+E` o haz clic en el botón del editor.

### 2. Agregar Elementos

- **Personajes**: Usa el explorador para agregar personajes
- **Fondos**: Assigna un fondo a cada escena
- **Burbujas**: Agrega diálogos arrastrando del explorador

### 3. Configurar Pasos

Cada elemento en el timeline tiene un menú de configuración:
- **hidden**: Ocultar manualmente
- **disappearAfter**: Ocultar tras X scrolls
- **showAfter**: Mostrar tras X scrolls

### 4. Previsualizar

Haz clic en "Preview" para ver cómo queda el proyecto.

### 5. Guardar/Cargar

Usa los botones del panel para guardar tu proyecto como JSON.