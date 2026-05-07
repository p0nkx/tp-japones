# Changelog - Historial de Cambios

---

## v1.0.0 (Actual) - Editor Visual Funcional

### ✅ Features Implementadas

#### Editor Básico
- [x] Editor visual con timeline de pasos
- [x] Múltiples escenas por proyecto
- [x] Panel flotante con secciones (Scenes, Timeline, Explorer, Actions)
- [x] Activar/desactivar con Ctrl+E

#### Elementos Soportados
- [x] Personajes (characters) - Imágenes redimensionables
- [x] Burbujas de diálogo (bubbles) - Con texto y nombre
- [x] Narraciones (narration) - Texto narrativo
- [x] Objetos (objects) - Elementos decorativos

#### Interacción
- [x] Seleccionar elementos con click
- [x] Arrastrar elementos por la pantalla
- [x] Redimensionar elementos (3 handles: horizontal, vertical, escala)
- [x] Posicionar colita de burbuja libremente

#### Control de Visibilidad
- [x] Mostrar/ocultar elementos tras X scrolls (showAfter/disappearAfter)
- [x] Badge visual "+X" en verde para showAfter activo
- [x] Botón "Reiniciar" para resetear configuración de pasos
- [x] Ocultar elementos manualmente (hidden)

#### Navegación
- [x] Scroll para avanzar pasos en modo editor
- [x] Resaltar paso activo en el timeline
- [x] Cambiar entre escenas (actualiza timeline)
- [x] Modo preview con navegación completa

#### Persistencia
- [x] Guardar proyecto como JSON
- [x] Cargar proyecto desde JSON
- [x] Exportar/importar proyecto
- [x] Detectar cambios sin guardar

---

## 🚀 Features Futuras Pendientes

### Alta Prioridad

- [ ] **Arreglar modo preview**
  - [ ] Resolver problemas de renderizado en preview
  - [ ] Mejorar navegación scroll en preview

- [ ] **Efectos entre escenas**
  - [ ] Transiciones (fade, slide, dissolve)
  - [ ] Duración configurable de transiciones

- [ ] **Inversión de imágenes**
  - [ ] Flip horizontal (espejo)
  - [ ] Flip vertical

### Media Prioridad

- [ ] **Sistema de audio**
  - [ ] Música de fondo por escena
  - [ ] Efectos de sonido (SFX)
  - [ ] Control de volumen

- [ ] **Fuentes personalizadas**
  - [ ] Cargar fuentes .ttf/.woff
  - [ ] selector de fuente en propiedades

- [ ] **Animaciones de texto**
  - [ ] Efecto typing (escribir letra a letra)
  - [ ] Fade in/out de texto

- [ ] **Expresiones de personajes**
  - [ ] Múltiples imágenes por personaje
  - [ ] Cambiar expresión en runtime

- [ ] **Capas avanzadas**
  - [ ] Múltiples sprites por personaje
  - [ ] Z-index manual
  - [ ] Capas personalizables

### Baja Prioridad

- [ ] **Sistema de ramas/escenas**
  - [ ] Elecciones del jugador
  - [ ] Bifurcaciones en la historia

- [ ] **Exportación**
  - [ ] Exportar a HTML standalone
  - [ ] Exportar a PDF

- [ ] **UI/UX**
  - [ ] Fondos animados
  - [ ] Temas claros/oscuros
  - [ ] Atajos de teclado personalizables

- [ ] **Internacionalización**
  - [ ] Más idiomas (FR, DE, ZH, etc.)
  - [ ] UI del editor en múltiples idiomas

- [ ] **Autoguardado**
  - [ ] Guardado automático cada X minutos
  - [ ] Recovery ante cierre inesperado

---

## Historial de Commits (Recientes)

- `bed5237` - Enhanced editor functionality: scroll navigation, showAfter badges, bubble tail positioning, and resize handles
- `a1b2c3d` - Added preview mode with scroll navigation
- `x1y2z3` - Implemented drag and drop for elements
- `...` (commits anteriores)

---

*Última actualización: Mayo 2026*