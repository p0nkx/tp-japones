# 🎌 Editor Visual de Novelas Visuales — Guía de Uso

## ¿Qué es esto?

Esta web te permite **crear y editar escenas de novelas visuales** sin necesidad de tocar código. Podés:

- Mover personajes y burbujas de diálogo arrastrándolos
- Editar textos en japonés, inglés y español
- Agregar personajes nuevos con tus propias imágenes
- Subir fondos y objetos (como sombreros, accesorios, etc.)
- Navegar entre escenas y editar cada una
- Guardar tu proyecto y retomarlo después
- Exportar todo como un archivo ZIP para compartir o hacer backup

---

## Interfaz Principal

Cuando abrís la web, ves la novela visual funcionando normalmente (el demo). En la esquina superior derecha tenés:

| Botón | Función |
|-------|---------|
| `📦 Importar` | Cargá un proyecto exportado previamente (.zip) |
| `✎ Editor` | Entrá al modo edición |

---

## Modo Edición

### Activar / Desactivar

Hacé click en **`✎ Editor`** para entrar al modo edición. El botón cambia a **`✖ Salir`**.

### Panel del Editor

Al entrar, aparece un panel lateral izquierdo con:

```
┌───────────────────────────────┐
│ ✎ Editor              [─]     │
├───────────────────────────────┤
│ Escena                        │
│ ◀ [Escena 1 ▼] ▶              │
│ [+ Nueva escena] [✕]          │
├───────────────────────────────┤
│ Recursos                      │
│ 📂 👤 Personajes              │
│ 📂 🖼 Fondos                   │
│ 📂 🎭 Objetos                 │
│ 📂 🔊 Sonidos (🔒 Próximamente)│
├───────────────────────────────┤
│ Agregar a escena              │
│ [+ Diálogo] [+ Narración]     │
├───────────────────────────────┤
│ 💾 Guardar                    │
│ 📥 Exportar                   │
│ 🆕 Nuevo                      │
│ ✖ Salir sin guardar           │
└───────────────────────────────┘
```

---

## Navegación entre Escenas

| Control | Acción |
|---------|--------|
| `◀` `▶` | Ir a la escena anterior/siguiente |
| Dropdown | Seleccionar una escena directamente |
| `+ Nueva escena` | Crear una escena en blanco |
| `✕` | Eliminar la escena actual |

---

## Explorador de Recursos

### 👤 Personajes

Mostrá todos los personajes disponibles. Cada uno tiene:

- **Thumbnail** — vista previa de la imagen
- **Nombre** — nombre del personaje
- **✎** — renombrar el personaje
- **✕** — eliminar el personaje

**Agregar personaje a la escena:** Hacé click en un personaje del explorador → aparece en el centro de la escena → arrastralo a donde quieras.

**Agregar personaje nuevo:** Hacé click en el botón **`+`** al lado de "Personajes" → se abre un modal donde podés poner nombre y subir una imagen.

### 🖼 Fondos

Mostrá todos los fondos disponibles.

**Cambiar fondo:** Hacé click en un fondo → se aplica inmediatamente a la escena actual.

**Agregar fondo nuevo:** Botón **`+`** al lado de "Fondos" → poné nombre y subí la imagen.

### 🎭 Objetos

Elementos decorativos que podés colocar en la escena (sombreros, accesorios, etc.). Se comportan igual que los personajes: click para agregar, arrastrar para mover.

### 🔊 Sonidos

🔒 Próximamente — permitirá agregar música y efectos de sonido en momentos específicos del scroll.

---

## Editar Elementos en la Escena

### Mover (Drag & Drop)

1. Hacé click y mantené presionado sobre un personaje, objeto o burbuja
2. Arrastralo a la posición deseada
3. Soltá para fijar la posición

### Redimensionar

1. Seleccioná un personaje u objeto (click simple)
2. Aparece un **tirador rosa** `◢` en la esquina inferior derecha
3. Arrastrá el tirador para agrandar o achicar
   - **Shift + arrastrar** = redimensionar libremente (sin mantener proporción)

### Editar Texto de Diálogo

1. Hacé **doble-click** en una burbuja de diálogo
2. Se abre un modal con los 3 campos: JP, EN, ES
3. Editá el texto que necesités
4. Click en **Confirmar** para guardar

### Eliminar Elementos

Actualmente los elementos se eliminan desde la secuencia del proyecto. En una futura actualización habrá botón de eliminar en escena.

---

## Agregar a Escena

### + Diálogo

1. Click en **`+ Diálogo`**
2. Seleccioná el personaje que habla
3. Escribí el texto en JP, EN y ES (los que necesites)
4. **Confirmar** → aparece la burbuja en la escena → podés moverla

### + Narración

1. Click en **`+ Narración`**
2. Escribí el texto en los 3 idiomas
3. **Confirmar** → aparece un cuadro de narración centrado

---

## Guardar y Exportar

### 💾 Guardar

Guarda el proyecto en el **almacenamiento local del navegador**. Los cambios persisten entre sesiones pero solo en ese navegador.

**Importante:** Si borrás los datos del navegador, perdés el proyecto. Siempre exportá como backup.

### 📥 Exportar

Descarga un archivo `.zip` que contiene:

```
mi-proyecto.zip
├── project.json    (todas las escenas, recursos, posiciones, textos)
└── images/         (todas las imágenes que subiste)
```

Este archivo es tu **backup completo**. Podés compartirlo con otros o guardarlo.

### 📤 Importar

1. Click en **`📦 Importar`** (botón superior)
2. Seleccioná el archivo `.zip` de un proyecto exportado
3. Todo se restaura exactamente como estaba

### 🆕 Nuevo

Crea un proyecto vacío con una escena en blanco. **Los cambios no guardados se pierden** — te pedirá confirmación antes.

---

## Salir del Editor

### ✖ Salir sin guardar

Sale del modo edición y vuelve a la vista normal. Si hay cambios sin guardar, te pregunta si querés guardar primero.

---

## Flujo Recomendado

1. Abrí la web → explorá el demo haciendo scroll
2. Hacé click en **`✎ Editor`**
3. Navegá entre escenas con `◀` `▶`
4. Arrastrá personajes y burbujas para ajustar posiciones
5. Hacé doble-click en burbujas para editar textos
6. Agregá personajes nuevos desde el explorador
7. Hacé **`💾 Guardar`** frecuentemente
8. Cuando termines, **`📥 Exportar`** para tener tu backup
9. Hacé click en **`✖ Salir`** para ver el resultado

---

## Tips

- **Minimizar el panel:** Click en el botón `─` del panel para ocultarlo y ver la escena completa. Click de nuevo para mostrarlo.
- **Arrastrar el panel:** Podés mover el panel arrastrándolo desde su header.
- **Imágenes custom:** Las imágenes que subís se guardan en el navegador y se incluyen en el export ZIP.
- **Reutilizar personajes:** Una vez que creás un personaje, aparece en el explorador y podés usarlo en cualquier escena.
- **Fondos:** Los fondos se aplican inmediatamente al hacer click en ellos.

---

## Limitaciones

| Función | Estado |
|---------|--------|
| Mover personajes/objetos | ✅ Funcional |
| Editar textos de diálogos | ✅ Funcional |
| Agregar personajes nuevos | ✅ Funcional |
| Subir imágenes/fondos | ✅ Funcional |
| Exportar/Importar proyectos | ✅ Funcional |
| Redimensionar elementos | ✅ Funcional |
| Navegación entre escenas | ✅ Funcional |
| Timeline de audio/sonidos | 🔒 Próximamente |
| Publicar cambios en Vercel | ⚠️ Requiere re-deploy manual |

---

## Soporte

Si encontrás un bug o tenés una sugerencia, reportalo en el repositorio del proyecto.
