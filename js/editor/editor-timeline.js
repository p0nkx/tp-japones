/**
 * editor-timeline.js
 * =============================================
 * TIMELINE DE PASOS - Panel lateral con lista de elementos por escena
 * 
 * Este archivo controla:
 * - refreshStepsTimeline() - Dibuja la lista de pasos en el panel lateral
 * - buildStepItem() - Crea cada item de la lista con sus controles
 * - Step menu (al hacer click) - Configuración individual de cada paso:
 *   - hidden: Ocultar/mostrar manualmente
 *   - disappearAfter: Ocultar tras X pasos
 *   - showAfter: Mostrar tras X pasos
 * - Badge visual "+X" en verde cuando showAfter está activo
 * - Botón "Reiniciar" para resetear todos los valores de un paso
 * 
 * Interacción:
 * - Click en item →Seleccionar elemento en la escena
 * - Step menu → Panel flotante con controles del paso
 * - Botón "+" al final → Agregar nuevo paso vacío
 */

(function() {
  'use strict';

  var E = window.__editor;
  var S = E.state;

  /**
   * Recrea la lista de pasos en el panel lateral
   * Muestra cada elemento de la secuencia con su tipo y controles
   */
  function refreshStepsTimeline() {
    if (!S.currentProject) return;
    var scene = S.currentProject.scenes[S.currentSceneIndex];
    if (!scene) return;

    var container = document.getElementById('steps-timeline');
    if (!container) return;

    var seq = scene.sequence || [];
    if (seq.length === 0) {
      container.innerHTML = '<div class="steps-empty">Sin pasos. Agreg\u00E1 elementos desde "Recursos".</div>';
      return;
    }

    var html = '';
    for (var i = 0; i < seq.length; i++) {
      var item = seq[i];
      var icon = '\u25C6';
      var label = '';
      if (item.type === 'character') { icon = '\uD83D\uDC64'; label = item.id || ''; }
      else if (item.type === 'bubble') { icon = '\uD83D\uDCAC'; label = item.target ? item.target : 'Di\u00E1logo'; }
      else if (item.type === 'narration') { icon = '\uD83D\uDCD6'; label = 'Narraci\u00F3n'; }
      else if (item.type === 'object') { icon = '\uD83C\uDFAD'; label = item.name || item.id || 'Objeto'; }

      var hiddenBadge = item.hidden ? '<span class="step-badge-hidden">Oculto</span>' : '';
      var disappearBadge = item.disappearAfter ? '<span class="step-badge-disappear">\u00D7' + item.disappearAfter + '</span>' : '';
      var showBadge = item.showAfter ? '<span class="step-badge-show">+' + item.showAfter + '</span>' : '';

      html += (
        '<div class="step-item' + (item.hidden ? ' step-hidden' : '') + '" draggable="true" data-step="' + i + '">' +
          '<span class="step-drag">\u283F</span>' +
          '<span class="step-number">' + (i + 1) + '</span>' +
          '<span class="step-icon">' + icon + '</span>' +
          '<span class="step-label">' + E.truncate(label, 16) + '</span>' +
          hiddenBadge + disappearBadge + showBadge +
          '<button class="step-menu-btn" data-step="' + i + '" title="Opciones">\u22EE</button>' +
          '<button class="step-delete" data-step="' + i + '" title="Eliminar paso">\u2715</button>' +
        '</div>'
      );
    }
    html += '<div class="step-add-btn" id="step-add-btn">+ Agregar paso al final</div>';

    container.innerHTML = html;

    container.querySelectorAll('.step-item').forEach(function(el) {
      el.addEventListener('click', function(e) {
        if (e.target.closest('.step-delete') || e.target.closest('.step-menu-btn')) return;
        var stepIdx = parseInt(el.dataset.step);
        E.renderer.renderSceneUpToStep(stepIdx);
        E.timeline.highlightActiveStep(stepIdx);
        // Also select the element in the visual area
        var scene = S.currentProject.scenes[S.currentSceneIndex];
        if (scene && scene.sequence && scene.sequence[stepIdx]) {
          var elInVisual = document.querySelector('.scene-visual .el[data-el-index="' + stepIdx + '"]');
          if (elInVisual && E.drag && E.drag.selectElement) {
            E.drag.selectElement(elInVisual);
          }
        }
      });
    });

    container.querySelectorAll('.step-delete').forEach(function(el) {
      el.addEventListener('click', function(e) {
        e.stopPropagation();
        deleteStep(parseInt(el.dataset.step));
      });
    });

    container.querySelectorAll('.step-menu-btn').forEach(function(el) {
      el.addEventListener('click', function(e) {
        e.stopPropagation();
        var stepIdx = parseInt(el.dataset.step);
        var existingMenu = document.getElementById('step-options-menu');
        // If menu exists for this step, remove it (toggle off)
        if (existingMenu && parseInt(existingMenu.dataset.step) === stepIdx) {
          existingMenu.remove();
        } else {
          showStepOptionsMenu(stepIdx, el);
        }
      });
    });

    container.querySelectorAll('.step-item').forEach(function(el) {
      el.addEventListener('dragstart', function(e) {
        e.dataTransfer.setData('text/plain', el.dataset.step);
        el.classList.add('dragging-step');
      });
      el.addEventListener('dragend', function(e) { el.classList.remove('dragging-step'); });
      el.addEventListener('dragover', function(e) { e.preventDefault(); el.classList.add('drag-over'); });
      el.addEventListener('dragleave', function(e) { el.classList.remove('drag-over'); });
      el.addEventListener('drop', function(e) {
        e.preventDefault();
        el.classList.remove('drag-over');
        var fromIdx = parseInt(e.dataTransfer.getData('text/plain'));
        var toIdx = parseInt(el.dataset.step);
        if (fromIdx !== toIdx) reorderStep(fromIdx, toIdx);
      });
    });

    var addBtn = document.getElementById('step-add-btn');
    if (addBtn) {
      addBtn.addEventListener('click', function() {
        var lastIdx = seq.length - 1;
        E.actions.showAddStepModal(lastIdx >= 0 ? lastIdx : -1);
      });
    }
  }

  function showStepOptionsMenu(idx, btnEl) {
    // Close any existing menu first
    removeStepOptionsMenu();
    
    if (!S.currentProject) return;
    var scene = S.currentProject.scenes[S.currentSceneIndex];
    if (!scene || !scene.sequence || !scene.sequence[idx]) return;
    var item = scene.sequence[idx];
    var itemType = item.type === 'character' ? 'Personaje' : 
                  item.type === 'bubble' ? 'Burbuja' :
                  item.type === 'narration' ? 'Narración' : 'Objeto';

    var menu = document.createElement('div');
    menu.id = 'step-options-menu';
    menu.dataset.step = idx;

    var toggleLabel = item.hidden ? 
      '<span class="step-opt-icon">\u25C9</span> Mostrar' :
      '<span class="step-opt-icon">\u29B8</span> Ocultar';

    var disappearVal = item.disappearAfter || '';
    var showAfterVal = item.showAfter || '';
    
    menu.innerHTML = (
      '<div class="step-menu-header">' +
        '<span class="step-menu-type">Paso ' + (idx + 1) + '</span>' +
        '<span class="step-menu-close">✕</span>' +
      '</div>' +
      '<div class="step-option-row-centered">' +
        '<label class="step-option-label">Auto-ocultar tras</label>' +
        '<button class="step-spinner-btn" data-target="step-disappear-input" data-dir="-1">-</button>' +
        '<input type="number" id="step-disappear-input" min="0" max="20" value="' + disappearVal + '" placeholder="0" />' +
        '<button class="step-spinner-btn" data-target="step-disappear-input" data-dir="1">+</button>' +
        '<span class="step-option-unit">scrolls</span>' +
      '</div>' +
      '<div class="step-option-row-centered">' +
        '<label class="step-option-label">Mostrar tras</label>' +
        '<button class="step-spinner-btn" data-target="step-show-input" data-dir="-1">-</button>' +
        '<input type="number" id="step-show-input" min="0" max="20" value="' + showAfterVal + '" placeholder="0" />' +
        '<button class="step-spinner-btn" data-target="step-show-input" data-dir="1">+</button>' +
        '<span class="step-option-unit">scrolls</span>' +
      '</div>' +
      '<div class="step-option-divider"></div>' +
      '<div class="step-option-buttons">' +
        '<button class="step-option-apply" data-action="reset-all">Reiniciar</button>' +
        '<button class="step-option-apply" data-action="toggle-hidden">' + toggleLabel + '</button>' +
        '<button class="step-option-apply" data-action="apply-disappear">Aplicar</button>' +
      '</div>'
    );

    document.body.appendChild(menu);
    // Position menu above the button
    var btnRect = btnEl.getBoundingClientRect();
    menu.style.position = 'fixed';
    menu.style.top = (btnRect.top - menu.offsetHeight - 5) + 'px';
    menu.style.left = (btnRect.left + btnRect.width/2) + 'px';
    menu.style.transform = 'translateX(-50%)';

    // Close button X
    menu.querySelector('.step-menu-close').addEventListener('click', function(e) {
      e.stopPropagation();
      menu.remove();
      if (menu._closeHandler) {
        document.removeEventListener('click', menu._closeHandler);
      }
    });

    // Close on click outside - only one menu at a time
    setTimeout(function() {
      function closeMenu(ev) {
        if (!menu.contains(ev.target) && !ev.target.closest('.step-menu-btn')) {
          menu.remove();
          document.removeEventListener('click', closeMenu);
        }
      }
      document.addEventListener('click', closeMenu);
      // Store reference to remove later
      menu._closeHandler = closeMenu;
    }, 10);

    // Toggle hidden - only toggle, don't apply other settings
    menu.querySelector('[data-action="toggle-hidden"]').addEventListener('click', function(e) {
      e.stopPropagation();
      item.hidden = !item.hidden;
      S.hasUnsavedChanges = true;
      VNStorage.saveProject(S.currentProject);
      refreshStepsTimeline();
      E.renderer.renderSceneUpToStep(S.currentVisibleSteps);
      // Close menu after toggle
      menu.remove();
      if (menu._closeHandler) {
        document.removeEventListener('click', menu._closeHandler);
      }
    });

    // Apply disappear
    menu.querySelector('[data-action="apply-disappear"]').addEventListener('click', function(e) {
      e.stopPropagation();
      var disappearInput = document.getElementById('step-disappear-input');
      var showInput = document.getElementById('step-show-input');
      var disappearVal = parseInt(disappearInput.value);
      var showVal = parseInt(showInput.value);
      
      // Handle disappearAfter (0 = off)
      if (isNaN(disappearVal) || disappearVal <= 0) { 
        delete item.disappearAfter; 
      } else {
        item.disappearAfter = disappearVal;
      }
      
      // Handle showAfter (0 = off, absolute step number)
      if (isNaN(showVal) || showVal <= 0) { 
        delete item.showAfter; 
      } else {
        item.showAfter = showVal;
      }
      
      S.hasUnsavedChanges = true;
      VNStorage.saveProject(S.currentProject);
      refreshStepsTimeline();
    });

    // Spinner buttons
    menu.querySelectorAll('.step-spinner-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var targetId = btn.dataset.target;
        var dir = parseInt(btn.dataset.dir);
        var input = document.getElementById(targetId);
        if (input) {
          var currentVal = parseInt(input.value) || 0;
          var newVal = currentVal + dir;
          if (newVal < 0) newVal = 0;
          input.value = newVal;
        }
      });
    });

    // Reset All button
    menu.querySelector('[data-action="reset-all"]').addEventListener('click', function(e) {
      e.stopPropagation();
      item.hidden = false;
      delete item.disappearAfter;
      delete item.showAfter;
      S.hasUnsavedChanges = true;
      refreshStepsTimeline();
      E.renderer.renderSceneUpToStep(S.currentVisibleSteps);
      menu.remove();
      if (menu._closeHandler) {
        document.removeEventListener('click', menu._closeHandler);
      }
    });

    menu.querySelector('#step-disappear-input').addEventListener('click', function(e) { e.stopPropagation(); });
    menu.querySelector('[data-action="apply-disappear"]').addEventListener('click', function(e) { e.stopPropagation(); });
  }

  function removeStepOptionsMenu() {
    var existing = document.getElementById('step-options-menu');
    if (existing) existing.remove();
  }

  function reorderStep(fromIdx, toIdx) {
    if (!S.currentProject) return;
    var scene = S.currentProject.scenes[S.currentSceneIndex];
    if (!scene || !scene.sequence) return;
    if (fromIdx < 0 || fromIdx >= scene.sequence.length) return;
    if (toIdx < 0 || toIdx >= scene.sequence.length) return;
    var item = scene.sequence.splice(fromIdx, 1)[0];
    scene.sequence.splice(toIdx, 0, item);
    S.hasUnsavedChanges = true;
    refreshStepsTimeline();
    S.currentVisibleSteps = Math.min(toIdx, scene.sequence.length - 1);
    E.renderer.renderSceneUpToStep(S.currentVisibleSteps);
    E.showToast('Paso reordenado');
  }

  function deleteStep(idx) {
    if (!S.currentProject) return;
    var scene = S.currentProject.scenes[S.currentSceneIndex];
    if (!scene || !scene.sequence) return;
    scene.sequence.splice(idx, 1);
    if (S.currentVisibleSteps >= scene.sequence.length) {
      S.currentVisibleSteps = Math.max(0, scene.sequence.length - 1);
    }
    S.hasUnsavedChanges = true;
    refreshStepsTimeline();
    E.renderer.renderSceneUpToStep(S.currentVisibleSteps);
    E.showToast('Paso eliminado');
  }

  function buildStepsTimelineHTML() {
    return (
      '<div class="editor-section">' +
        '<div class="section-label">Pasos de Scroll</div>' +
        '<div class="steps-timeline" id="steps-timeline"></div>' +
      '</div>'
    );
  }

  E.timeline = E.timeline || {};
  E.timeline.refreshStepsTimeline = refreshStepsTimeline;
  E.timeline.showStepOptionsMenu = showStepOptionsMenu;
  E.timeline.removeStepOptionsMenu = removeStepOptionsMenu;
  E.timeline.reorderStep = reorderStep;
  E.timeline.deleteStep = deleteStep;
  E.timeline.buildStepsTimelineHTML = buildStepsTimelineHTML;
  
  // highlightActiveStep moved here from editor-core.js (needs E.timeline to exist)
  E.timeline.highlightActiveStep = function(idx) {
    document.querySelectorAll('.step-item').forEach(function(el) { el.classList.remove('active'); });
    var activeEl = document.querySelector('.step-item[data-step="' + idx + '"]');
    if (activeEl) activeEl.classList.add('active');
  };
})();
