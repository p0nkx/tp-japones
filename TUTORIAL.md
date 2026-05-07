# Tutorial edición

## Bienvenido al Editor Visual

Esta herramienta te permite crear novelas visuales interactivas usando solo la interfaz web. No necesitas saber programar.

## Cómo Acceder al Editor

Agrega `?edit` al final de la dirección en tu navegador:
```
index.html?edit
```

## Conoce la Interfaz

### Barra Superior Izquierda
- **Botón Tutorial**: Haz clic aquí para abrir este tutorial en cualquier momento
- **Botón de Idioma (JP)**: Cambia entre japonés, inglés y español

### Panel Izquierdo - Explorador de Escenas
Muestra la estructura de tu historia:
- **Escenas**: Haz clic en una escena para verla y editarla
- **Pasos**: Cada paso es una acción (aparece un personaje, una burbuja, etc.)
- **Botón +**: Agrega nuevos elementos a la escena

### Centro - Vista Previa
Aquí ves tu escena en tiempo real:
- Usa la **rueda del mouse** para avanzar o retroceder pasos
- Arrastra los elementos para moverlos de lugar
- Cambia el tamaño arrastrando las esquinas

### Panel Derecho - Editor de Propiedades
Aquí cambias las características del elemento seleccionado:
- **Personajes**: Cambia su imagen, posición o conviértelo en silueta
- **Burbujas**: Edita los textos en 3 idiomas, cámbiales posición
- **Fondos**: Elige el tipo de fondo, imágenes o colores

## Cómo Cambiar de Escena

### Usando los Botones
- **◀** : Ir a la escena anterior
- **▶** : Ir a la siguiente escena

### Usando el Menú Desplegable
- Haz clic en el **selector de escenas** (dice "Escena 1", "Escena 2", etc.)
- Elige la escena que quieres editar

### Crear una Nueva Escena
1. Haz clic en el botón **"+ Nueva escena"**
2. Se creará automáticamente con un fondo degradado
3. Edita su nombre y fondo en el panel derecho

### Reordenar Escenas
1. Haz clic en el botón **"⇅"** (Ordenar escenas)
2. Se abrirá una ventana con la lista de escenas
3. **Arrastra y suelta** las escenas para ponerlas en el orden que quieras
4. Usa la **rueda del mouse** para desplazarte si hay muchas escenas
5. Los cambios se guardan automáticamente

### Eliminar una Escena
- Haz clic en **"✕"** (siempre debe quedar al menos una escena)

## Agregar Personajes

### Paso a Paso
1. En el panel izquierdo, asegúrate de estar en la escena correcta
2. Haz clic en el **botón "+"** verde
3. Selecciona **"Personaje"** del menú
4. En el panel derecho verás las opciones:
   - **ID**: Pon un nombre único (ej: "protagonista")
   - **Imagen**: Escribe el nombre del archivo PNG que está en la carpeta `images/`
   - **Posición**: Elige dónde aparece (izquierda, derecha, centro, etc.)
   - **Tamaño**: Arrastra las esquinas del personaje en la vista previa
   - **Silueta**: Marca esta casilla para convertirlo en una sombra negra

### Mover y Redimensionar
- **Mover**: Haz clic sobre el personaje en la vista previa y arrástralo
- **Cambiar tamaño**: Arrastra cualquiera de las esquinas del personaje

## Agregar Diálogos (Burbujas)

### Paso a Paso
1. Haz clic en el **botón "+"** y selecciona **"Burbuja"**
2. En el panel derecho configura:
   - **Target**: Escribe el ID del personaje que habla (el mismo que pusiste arriba)
   - **Textos**: 
     - **JP**: Texto en japonés (obligatorio)
     - **EN**: Texto en inglés (opcional)
     - **ES**: Texto en español (opcional)
   - **Posición**: Arrastra la burbuja libremente en la vista previa
   - **Efecto tembloroso**: Márcalo para que la burbuja tiemble (efecto de miedo)

### Cambiar entre Idiomas
Haz clic en el botón **"JP"** en la esquina superior derecha para cambiar qué idiomas se muestran:
- Solo japonés
- Japonés + inglés  
- Japonés + español
- Los tres idiomas

## Cambiar el Fondo de la Escena

En el panel derecho, busca la sección **"Fondo"**:

### Fondo Completo (Full)
- **Tipo**: Selecciona "Full"
- **Imagen**: Escribe el nombre del archivo JPG en `images/`
- O usa un **color degradado** en lugar de imagen

### Fondo Dividido Vertical (Izquierda/Derecha)
- **Tipo**: Selecciona "Split Vertical"
- **Imagen izquierda**: Escribe el nombre del archivo
- **Imagen derecha**: Escribe el nombre del archivo

### Fondo Dividido Horizontal (Arriba/Abajo)
- **Tipo**: Selecciona "Split Horizontal"
- **Imagen superior**: Escribe el nombre del archivo
- **Imagen inferior**: Escribe el nombre del archivo

### Fondo Diagonal
- **Tipo**: Selecciona "Diagonal"
- **Dirección**: Elige la diagonal (↘ o ↙)
- **Imágenes**: Configura las dos partes

*Nota: Las imágenes deben estar en la carpeta `images/` de tu proyecto antes de usarlas.*

## Guardar tu Trabajo

### Guardar Cambios Localmente
Haz clic en el botón **"💾 Guardar"** en la parte inferior del editor:
- Guarda los cambios en tu navegador (localStorage)
- Útil para continuar editando más tarde en la misma computadora
- No borres el caché de tu navegador o perderás los cambios

### Exportar Proyecto (Recomendado)
1. Haz clic en **"⋮"** (más opciones)
2. Selecciona **"Exportar proyecto"**
3. Se descargará un archivo ZIP con:
   - Todas las configuraciones
   - Todas las imágenes que usaste
4. Guarda este archivo en un lugar seguro

### Importar Proyecto
Si tienes un archivo ZIP exportado anteriormente:
1. Haz clic en **"Importar"**
2. Selecciona tu archivo ZIP
3. Se cargará todo tu proyecto automáticamente

## Cómo Navegar en la Vista Previa

### Con el Mouse
- **Scroll hacia abajo**: Avanza un paso (aparece algo nuevo)
- **Scroll hacia arriba**: Retrocede un paso (desaparece lo último)

### Con el Teclado
- **Flecha ↓ o Barra Espaciadora**: Avanza
- **Flecha ↑**: Retrocede

### En Celular o Tablet
- **Deslizar arriba**: Avanza
- **Deslizar abajo**: Retrocede

## Consejos Útiles

1. **IDs únicos**: Cada personaje debe tener un nombre único en su escena (no repetir)
2. **Imágenes**: Deben estar en la carpeta `images/` antes de usarlas
3. **Guardado automático**: Los cambios en las escenas se guardan solos
4. **Arrastrar y soltar**: Puedes mover elementos libremente en la vista previa
5. **Exportar frecuentemente**: Haz copias de seguridad de tu proyecto en un ZIP

## Solución de Problemas

### El personaje no aparece
- Verifica que la imagen esté en la carpeta correcta
- Revisa que el nombre del archivo esté bien escrito (mayúsculas/minúsculas cuentan)
- Asegúrate de haber exportado/importado las imágenes correctamente

### La burbuja no se muestra
- Verifica que el campo **Target** tenga exactamente el mismo nombre que el ID del personaje
- Asegúrate de que el personaje esté visible en ese paso

### No puedo hacer scroll
- Haz clic dentro del área de la novela (el recuadro central)
- Verifica que no haya errores en la consola del navegador (presiona F12)

### Perdí mis cambios
- Revisa si guardaste localmente (se guarda en el navegador)
- Si exportaste el proyecto, importa el archivo ZIP que guardaste

## Próximas Actualizaciones

Estas funciones estarán disponibles en futuras versiones:
- ✨ Modo pesadilla (fondo oscuro y borroso para escenas de terror)
- ✨ Carga de plantillas prediseñadas
- ✨ Música y efectos de sonido
- ✨ Más tipos de elementos (objetos, efectos especiales)
- ✨ Transiciones personalizadas entre escenas

## ¿Necesitas Ayuda?

- Contacta al desarrollador para reportar problemas o sugerencias
- **Email**: lunafabianemmanuel@gmail.com
