# Japanese Role Play - Editor Visual de Novelas Visuales

Crea novelas visuales interactivas con control por scroll usando una interfaz web visual. No necesitas saber programar.

---

## 🚀 Inicio Rápido

1. **Abrir el editor**: Agrega `?edit` al final de la URL
   ```
   index.html?edit
   ```

2. **Crear una escena**: Haz clic en "+ Nueva escena"

3. **Agregar personajes**: Usa el botón "+" en el panel izquierdo

4. **Agregar diálogos**: Selecciona "Burbuja" y escribe los textos

5. **Guardar**: Usa "💾 Guardar" para guardar localmente o "Exportar" para crear un archivo ZIP

---

## 📖 ¿Cómo usar el Editor?

Para un tutorial completo, haz clic en el botón **"Tutorial"** (esquina superior izquierda) cuando estés en el editor.

El tutorial cubre:
- Cómo navegar por la interfaz
- Cómo agregar y mover personajes
- Cómo crear diálogos en 3 idiomas
- Cómo cambiar fondos
- Cómo guardar y exportar tu proyecto

---

## ✨ Características Principales

### Interfaz Visual Completa
- **Editor de propiedades**: Cambia cualquier elemento desde el panel derecho
- **Arrastrar y soltar**: Mueve personajes y burbujas libremente
- **Redimensionar**: Cambia el tamaño arrastrando las esquinas
- **3 idiomas**: Japonés, inglés y español

### Gestión de Escenas
- **Navegación**: Usa las flechas ◀ ▶ o el selector desplegable
- **Reordenar**: Arrátstralas en el botón "⇅" para cambiar el orden
- **Múltiples fondos**: Completo, dividido (vertical/horizontal), diagonal

### Guardado y Exportación
- **Local**: Guarda en tu navegador (no borres el caché)
- **ZIP**: Exporta todo el proyecto con imágenes incluídas
- **Importar**: Carga proyectos desde un archivo ZIP

---

## 🎮 Controles de Navegación (Modo Vista Previa)

### Con el Mouse
- **Scroll hacia abajo**: Avanza un paso
- **Scroll hacia arriba**: Retrocede un paso

### Con el Teclado
- **Flecha ↓ o Espacio**: Avanza
- **Flecha ↑**: Retrocede

### En Móvil/Tablet
- **Deslizar arriba**: Avanza
- **Deslizar abajo**: Retrocede

---

## 📱 Compatibilidad

- **Desktop**: Chrome, Firefox, Edge, Safari
- **Móvil**: Android e iOS (cualquier navegador moderno)
- **Tablet**: Funciona perfectamente en pantallas táctiles

---

## ⚠️ Notas Importantes

1. **Imágenes**: Deben estar en la carpeta `images/` del proyecto
2. **IDs únicos**: Cada personaje necesita un nombre único en su escena
3. **Guardar frecuentemente**: Exporta tu proyecto como ZIP regularmente
4. **Caché del navegador**: Si guardas localmente, no borres el caché

---

## 🛠 Estructura del Proyecto (Para Desarrolladores)

```
japanese-roleplay/
├── index.html          ← Archivo principal
├── config.js           ← Configuración del proyecto (generado por el editor)
├── js/
│   ├── engine.js       ← Motor de renderizado
│   ├── storage.js      ← Gestión de almacenamiento
│   └── editor/         ← Archivos del editor visual
├── css/
│   └── style.css       ← Estilos visuales
├── images/             ← Personajes y fondos
│   └── ...
└── README.md           ← Este archivo
```

---

## 🚀 Cómo Abrir el Proyecto

- **Modo Editor**: `index.html?edit`
- **Modo Normal**: Solo abre `index.html`
- **Recomendado**: Live Server en VS Code para desarrollo

---

## 📚 Documentación Adicional

- **Tutorial completo**: Botón "Tutorial" en el editor
- **Documentación técnica**: Ver `DOCUMENTATION.md`
- **Changelog**: Ver `CHANGELOG.md`
