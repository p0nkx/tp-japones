/**
 * editor-drag.js
 * =============================================
 * INTERACCIÓN Y REDIMENSIONADO - Arrastrar, seleccionar, redimensionar elementos
 * 
 * Este archivo controla:
 * - Arrastrar elementos (drag) por la pantalla
 * - Seleccionar elementos con click
 * - Redimensionar elementos (resize handles)
 * - Mover la colita de las burbujas de diálogo
 * 
 * Handles de redimensionado disponibles (al seleccionar un elemento):
 * - .resize-handle.right - Redimensionar solo ancho (horizontal)
 * - .resize-handle.bottom - Redimensionar solo alto (vertical)  
 * - .resize-handle.br - Redimensionar manteniendo aspecto (esquina)
 * - .tail-handle - Mover la flecha de la burbuja (solo burbujas)
 * 
 * Estados de interacción (S.dragState, S.resizeState, S.tailState):
 * - Guardan información del elemento seleccionado y posición inicial
 * - Se usan para calcular el movimiento durante el arrastre
 */

(function() {
  'use strict';

  var E = window.__editor;
  var S = E.state;

  /**
   * Inicializa los eventos de mouse/touch para arrastrar elementos
   * Conecta los listeners al contenedor de la escena visual
   */
  function initSceneDragDrop() {
    var container = document.querySelector('.scene-visual');
    if (!container) return;
    container.addEventListener('mousedown', onElementMouseDown);
    container.addEventListener('touchstart', onElementTouchStart, { passive: false });
  }

  /**
   * Maneja el click en elementos:
   * - Si es resize handle → iniciar redimensión
   * - Si es tail handle → mover colita de burbuja
   * - Si es elemento → seleccionar y arrastrar
   */
  function onElementMouseDown(e) {
    if (!S.editMode) return;
    var el = e.target.closest('.el.editable');
    if (!el) { deselectAll(); return; }
    var resizeHandle = e.target.closest('.resize-handle');
    if (resizeHandle) { startResize(e, el); return; }
    var tailHandle = e.target.closest('.tail-handle');
    if (tailHandle) { startTailMove(e, el); return; }
    e.preventDefault();
    selectElement(el);
    startDrag(e, el);
  }

  function onElementTouchStart(e) {
    if (!S.editMode) return;
    var el = e.target.closest('.el.editable');
    if (!el) { deselectAll(); return; }
    e.preventDefault();
    selectElement(el);
    startDragTouch(e, el);
  }

  function startDrag(e, el) {
    var container = document.querySelector('.scene-visual');
    var rect = container.getBoundingClientRect();
    var elRect = el.getBoundingClientRect();
    S.dragState = {
      el: el, startX: e.clientX, startY: e.clientY,
      startLeft: parseFloat(el.style.left) || 0, startTop: parseFloat(el.style.top) || 0,
      containerWidth: rect.width, containerHeight: rect.height,
      elWidth: elRect.width, elHeight: elRect.height
    };
    el.classList.add('dragging');
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);
  }

  function startDragTouch(e, el) {
    var touch = e.touches[0];
    var container = document.querySelector('.scene-visual');
    var rect = container.getBoundingClientRect();
    var elRect = el.getBoundingClientRect();
    S.dragState = {
      el: el, startX: touch.clientX, startY: touch.clientY,
      startLeft: parseFloat(el.style.left) || 0, startTop: parseFloat(el.style.top) || 0,
      containerWidth: rect.width, containerHeight: rect.height,
      elWidth: elRect.width, elHeight: elRect.height
    };
    el.classList.add('dragging');
    document.addEventListener('touchmove', onTouchDragMove, { passive: false });
    document.addEventListener('touchend', onTouchDragEnd);
  }

  function onDragMove(e) { if (S.dragState) updateDragPosition(e.clientX, e.clientY); }

  function onTouchDragMove(e) {
    if (!S.dragState) return;
    e.preventDefault();
    updateDragPosition(e.touches[0].clientX, e.touches[0].clientY);
  }

  function updateDragPosition(clientX, clientY) {
    var dx = ((clientX - S.dragState.startX) / S.dragState.containerWidth) * 100;
    var dy = ((clientY - S.dragState.startY) / S.dragState.containerHeight) * 100;
    var newLeft = Math.max(0, Math.min(95, S.dragState.startLeft + dx));
    var newTop = Math.max(0, Math.min(95, S.dragState.startTop + dy));
    S.dragState.el.style.left = newLeft + '%';
    S.dragState.el.style.top = newTop + '%';
  }

  function onDragEnd() {
    if (S.dragState) {
      S.dragState.el.classList.remove('dragging');
      saveElementPosition(S.dragState.el);
      S.dragState = null;
    }
    document.removeEventListener('mousemove', onDragMove);
    document.removeEventListener('mouseup', onDragEnd);
  }

  function onTouchDragEnd() {
    if (S.dragState) {
      S.dragState.el.classList.remove('dragging');
      saveElementPosition(S.dragState.el);
      S.dragState = null;
    }
    document.removeEventListener('touchmove', onTouchDragMove);
    document.removeEventListener('touchend', onTouchDragEnd);
  }

  function startResize(e, el) {
    e.preventDefault();
    e.stopPropagation();
    var container = document.querySelector('.scene-visual');
    var rect = container.getBoundingClientRect();
    var handle = e.target.closest('.resize-handle');
    var handleType = 'corner'; // default
    if (handle) {
      if (handle.classList.contains('right')) handleType = 'right';
      else if (handle.classList.contains('bottom')) handleType = 'bottom';
      else if (handle.classList.contains('br')) handleType = 'corner';
      else handleType = 'corner';
    }
    S.resizeState = {
      el: el, startX: e.clientX, startY: e.clientY,
      startWidth: el.offsetWidth, startHeight: el.offsetHeight,
      containerWidth: rect.width, containerHeight: rect.height,
      handleType: handleType
    };
    document.addEventListener('mousemove', onResizeMove);
    document.addEventListener('mouseup', onResizeEnd);
  }

  function startTailMove(e, el) {
    e.preventDefault();
    e.stopPropagation();
    var rect = el.getBoundingClientRect();
    var container = document.querySelector('.scene-visual');
    var containerRect = container.getBoundingClientRect();
    S.tailState = {
      el: el,
      startX: e.clientX,
      startY: e.clientY,
      startLeft: parseFloat(el.dataset.tailLeft) || 50,
      startTop: parseFloat(el.dataset.tailTop) || 100,
      containerWidth: containerRect.width,
      containerHeight: containerRect.height
    };
    document.addEventListener('mousemove', onTailMove);
    document.addEventListener('mouseup', onTailEnd);
  }

  function onTailMove(e) {
    if (!S.tailState) return;
    
    var el = S.tailState.el;
    var rect = el.getBoundingClientRect();
    
    // Calculate relative position within the bubble
    var relX = e.clientX - rect.left;
    var relY = e.clientY - rect.top;
    
    // Convert to percentage relative to bubble size
    var newLeft = (relX / rect.width) * 100;
    var newTop = (relY / rect.height) * 100;
    
    // Constraint: Keep tail within a small margin around the bubble (like attached to the edge)
    var margin = 15;
    newLeft = Math.max(margin, Math.min(100 - margin, newLeft));
    newTop = Math.max(margin, Math.min(100 - margin, newTop));
    
    // Determine which edge the tail is on (for arrow direction)
    var tailAt = 'top'; // default
    if (newTop < 30) {
        tailAt = 'top';
    } else if (newTop > 70) {
        tailAt = 'bottom';
    } else if (newLeft < 30) {
        tailAt = 'left';
    } else if (newLeft > 70) {
        tailAt = 'right';
    }
    
    // Update dataset for arrow direction
    el.dataset.tailAt = tailAt;
    
    S.tailState.el.dataset.tailLeft = newLeft;
    S.tailState.el.dataset.tailTop = newTop;
    
    // Update CSS custom properties for the tail position
    S.tailState.el.style.setProperty('--tail-left', newLeft + '%');
    S.tailState.el.style.setProperty('--tail-top', newTop + '%');
    
    // Remove all position classes and use custom positioning
    S.tailState.el.classList.remove('pos-left', 'pos-right', 'pos-center', 'pos-narration', 
      'pos-center-medio', 'pos-top-right', 'pos-top-left', 'pos-bottom-right', 'pos-bottom-left',
      'pos-tl', 'pos-tl-l', 'pos-center-right', 'pos-tl-n', 'pos-rina', 'pos-tr', 'pos-bl', 'pos-bl-l', 'pos-br', 'pos-custom');
    S.tailState.el.classList.add('pos-custom');
  }

  function onTailEnd() {
    if (S.tailState) {
      // Save tail position to the bubble data
      if (S.currentProject) {
        var scene = S.currentProject.scenes[S.currentSceneIndex];
        if (scene) {
          var idx = parseInt(S.tailState.el.dataset.elIndex);
          if (!isNaN(idx) && scene.sequence[idx]) {
            if (!scene.sequence[idx].tailPosition) scene.sequence[idx].tailPosition = {};
            scene.sequence[idx].tailPosition.left = S.tailState.el.dataset.tailLeft;
            scene.sequence[idx].tailPosition.top = S.tailState.el.dataset.tailTop;
            scene.sequence[idx].tailPosition.at = S.tailState.el.dataset.tailAt || 'bottom';
            S.hasUnsavedChanges = true;
          }
        }
      }
      S.tailState = null;
    }
    document.removeEventListener('mousemove', onTailMove);
    document.removeEventListener('mouseup', onTailEnd);
  }

  function onResizeMove(e) {
    if (!S.resizeState) return;
    var dx = ((e.clientX - S.resizeState.startX) / S.resizeState.containerWidth) * 100;
    var dy = ((e.clientY - S.resizeState.startY) / S.resizeState.containerHeight) * 100;
    
    var newWidth = Math.max(5, Math.min(95, S.resizeState.startWidth / S.resizeState.containerWidth * 100 + dx));
    var newHeight = Math.max(5, Math.min(95, S.resizeState.startHeight / S.resizeState.containerHeight * 100 + dy));
    
    var handleType = S.resizeState.handleType || 'corner';
    
    if (handleType === 'right') {
      // Only resize width, keep height fixed
      S.resizeState.el.style.width = newWidth + '%';
    } else if (handleType === 'bottom') {
      // Only resize height, keep width fixed
      S.resizeState.el.style.height = newHeight + '%';
    } else {
      // Corner handle (br): maintain aspect ratio for images, uniform for bubbles
      var img = S.resizeState.el.querySelector('.char-img, .obj-img');
      if (img && img.naturalWidth && img.naturalHeight) {
        // Maintain aspect ratio for characters/objects
        var aspectRatio = img.naturalWidth / img.naturalHeight;
        var finalHeight = newWidth / aspectRatio;
        S.resizeState.el.style.width = newWidth + '%';
        S.resizeState.el.style.height = finalHeight + '%';
      } else {
        // For bubbles: uniform resize (same width/height)
        var size = Math.max(newWidth, newHeight);
        S.resizeState.el.style.width = size + '%';
        S.resizeState.el.style.height = size + '%';
      }
    }
  }

  function onResizeEnd() {
    if (S.resizeState) {
      saveElementPosition(S.resizeState.el);
      S.resizeState = null;
    }
    document.removeEventListener('mousemove', onResizeMove);
    document.removeEventListener('mouseup', onResizeEnd);
  }

  function selectElement(el) {
    deselectAll();
    el.classList.add('selected');
    S.selectedElement = el;
    ensureResizeHandle(el);
  }

  function deselectAll() {
    document.querySelectorAll('.el.selected').forEach(function(e) {
      e.classList.remove('selected');
      var handle = e.querySelector('.resize-handle');
      if (handle) handle.remove();
    });
    S.selectedElement = null;
  }

  function ensureResizeHandle(el) {
    if (el.querySelector('.resize-handle')) return;
    
    // Right handle (horizontal resize)
    var rightHandle = document.createElement('div');
    rightHandle.className = 'resize-handle right';
    el.appendChild(rightHandle);
    
    // Bottom handle (vertical resize)
    var bottomHandle = document.createElement('div');
    bottomHandle.className = 'resize-handle bottom';
    el.appendChild(bottomHandle);
    
    // Bottom-right corner (uniform resize)
    var cornerHandle = document.createElement('div');
    cornerHandle.className = 'resize-handle br';
    el.appendChild(cornerHandle);
    
    // Tail handle (for bubbles - move the arrow/tail)
    if (el.classList.contains('bubble')) {
      var tailHandle = document.createElement('div');
      tailHandle.className = 'tail-handle';
      tailHandle.title = 'Mover colita';
      el.appendChild(tailHandle);
    }
  }

  function saveElementPosition(el) {
    if (!S.currentProject) return;
    var scene = S.currentProject.scenes[S.currentSceneIndex];
    if (!scene) return;
    var idx = parseInt(el.dataset.elIndex);
    if (isNaN(idx) || !scene.sequence[idx]) return;
    var item = scene.sequence[idx];
    if (!item.position) item.position = {};
    if (el.style.left) item.position.left = el.style.left;
    if (el.style.top) item.position.top = el.style.top;
    if (el.style.width) item.position.width = el.style.width;
    if (el.style.height) item.position.height = el.style.height;
    S.hasUnsavedChanges = true;
  }

  E.drag = E.drag || {};
  E.drag.initSceneDragDrop = initSceneDragDrop;
  E.drag.selectElement = selectElement;
})();
