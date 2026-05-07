/**
 * editor-panel.js
 * =============================================
 * PANEL DEL EDITOR - Interfaz flotante de control
 * 
 * Este archivo controla:
 * - createEditorPanel() - Crea el panel flotante con todas las secciones
 * - Secciones del panel:
 *   - Scenes: Lista de escenas (crear, seleccionar, eliminar)
 *   - Timeline: Lista de pasos de la escena actual
 *   - Explorer: Explorador de proyecto (ver estructura JSON)
 *   - Actions: Botones de guardar/cargar/exportar/importar
 * - makePanelDraggable() - Permite mover el panel por la pantalla
 * - removeEditorPanel() - Limpia el panel al salir del modo editor
 * 
 * El panel es flotante y se puede posicionar arrastrando su encabezado
 */

(function() {
  'use strict';

  var E = window.__editor;
  var S = E.state;

  /**
   * Crea el panel de editor removiendo cualquier versión anterior
   * Construye el HTML, conecta eventos y hace el panel arrastrable
   */
  function createEditorPanel() {
    removeEditorPanel();
    var panel = document.createElement('div');
    panel.id = 'editor-panel';
    panel.innerHTML = buildPanelHTML();
    document.body.appendChild(panel);
    bindPanelEvents();
    makePanelDraggable();
  }

  function buildPanelHTML() {
    return (
      '<div class="panel-header">' +
        '<span class="panel-title">\u270E Editor</span>' +
        '<button class="panel-minimize" id="panel-minimize">\u2500</button>' +
      '</div>' +
      '<div class="panel-body" id="panel-body">' +
        E.scenes.buildSceneNavHTML() +
        E.timeline.buildStepsTimelineHTML() +
        buildExplorerHTML() +
        buildActionsHTML() +
      '</div>'
    );
  }

  function buildExplorerHTML() {
    return (
      '<div class="editor-section">' +
        '<div class="section-label">Recursos</div>' +
        '<div class="explorer-tree" id="explorer-tree">' +
          E.explorer.buildFolderHTML('characters', '\uD83D\uDC64 Personajes', 'char-folder', false) +
          E.explorer.buildFolderHTML('backgrounds', '\uD83D\uDDBC Fondos', 'bg-folder', false) +
          E.explorer.buildFolderHTML('objects', '\uD83C\uDFAD Objetos', 'obj-folder', false) +
          E.explorer.buildFolderHTML('sounds', '\uD83D\uDD0A Sonidos', 'snd-folder', true) +
        '</div>' +
      '</div>' +
      '<div class="editor-section">' +
        '<div class="section-label">Agregar a escena</div>' +
        '<div class="scene-add-row">' +
          '<button class="editor-btn-small full-width" id="add-bubble">+ Di\u00E1logo</button>' +
          '<button class="editor-btn-small full-width" id="add-narration">+ Narraci\u00F3n</button>' +
        '</div>' +
      '</div>'
    );
  }

  function buildActionsHTML() {
    return (
      '<div class="editor-section editor-actions">' +
        '<button class="editor-btn primary" id="btn-save">\uD83D\uDCBE Guardar</button>' +
        '<button class="editor-btn" id="btn-export">\uD83D\uDCE5 Exportar</button>' +
        '<button class="editor-btn" id="btn-reset">\uD83D\uDD04 Resetear Plantilla</button>' +
        '<button class="editor-btn" id="btn-new">\uD83C\uDD95 Nuevo</button>' +
        '<button class="editor-btn danger" id="btn-exit">\u2716 Salir sin guardar</button>' +
      '</div>'
    );
  }

  function removeEditorPanel() {
    var existing = document.getElementById('editor-panel');
    if (existing) existing.remove();
  }

  function bindPanelEvents() {
    document.getElementById('panel-minimize').addEventListener('click', togglePanelBody);
    document.getElementById('scene-add').addEventListener('click', E.scenes.addNewScene);
    document.getElementById('scene-delete').addEventListener('click', function() {
      E.modal.showConfirmModal(
        'Eliminar escena',
        '\u00BFEliminar la escena actual? Esta acci\u00F3n no se puede deshacer.',
        function() { E.scenes.deleteScene(S.currentSceneIndex); }
      );
    });
    // Scene sort button - using event delegation
    document.addEventListener('click', function(e) {
      if (e.target.id === 'scene-sort') {
        console.log('scene-sort button clicked');
        if (E.scenes && E.scenes.showSortModal) {
          E.scenes.showSortModal();
        } else {
          console.error('showSortModal not found');
        }
      }
    });

    document.getElementById('add-bubble').addEventListener('click', E.actions.addBubbleToScene);
    document.getElementById('add-narration').addEventListener('click', E.actions.addNarrationToScene);

    document.getElementById('btn-save').addEventListener('click', E.saveProject);
    document.getElementById('btn-export').addEventListener('click', E.exportProject);
    document.getElementById('btn-reset').addEventListener('click', E.resetToTemplate);
    document.getElementById('btn-new').addEventListener('click', E.createNewProject);
    document.getElementById('btn-exit').addEventListener('click', function() {
      S.hasUnsavedChanges = false;
      E.exitEditMode();
    });

    document.querySelectorAll('.folder-toggle').forEach(function(el) {
      el.addEventListener('click', function() {
        el.closest('.folder').classList.toggle('open');
      });
    });

    document.querySelectorAll('.folder-add-btn').forEach(function(el) {
      el.addEventListener('click', function() {
        var type = el.dataset.type;
        if (type === 'characters') E.explorer.showAddCharacterModal();
        else if (type === 'backgrounds') E.explorer.showAddBackgroundModal();
        else if (type === 'objects') E.explorer.showAddObjectModal();
      });
    });

    // No longer needed: menu toggle is handled by step-menu-btn click
    // document.addEventListener('click', function(e) {
    //   var menu = document.getElementById('step-options-menu');
    //   if (menu && !e.target.closest('#step-options-menu') && !e.target.closest('.step-menu-btn')) {
    //     E.timeline.removeStepOptionsMenu();
    //   }
    // });
  }

  function togglePanelBody() {
    var panel = document.getElementById('editor-panel');
    var body = document.getElementById('panel-body');
    var btn = document.getElementById('panel-minimize');
    var header = panel ? panel.querySelector('.panel-header') : null;
    
    if (!panel || !body || !btn) return;
    
    if (panel.classList.contains('minimized')) {
      // Restore panel
      panel.classList.remove('minimized');
      body.style.display = '';
      if (header) header.style.display = '';
      btn.textContent = '\u2500';
      btn.title = 'Minimizar';
    } else {
      // Minimize panel - show only header with Editor text and expand button
      panel.classList.add('minimized');
      body.style.display = 'none';
      if (header) {
        header.style.display = 'flex';
        header.style.width = 'auto';
      }
      btn.textContent = '\u25BE';
      btn.title = 'Expandir';
    }
  }

  function makePanelDraggable() {
    var panel = document.getElementById('editor-panel');
    var header = panel.querySelector('.panel-header');
    var startX, startY, startLeft, startTop;

    header.addEventListener('mousedown', function(e) {
      if (e.target.closest('.panel-minimize')) return;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = panel.offsetLeft;
      startTop = panel.offsetTop;

      function onMove(e) {
        panel.style.left = (startLeft + e.clientX - startX) + 'px';
        panel.style.top = (startTop + e.clientY - startY) + 'px';
      }
      function onUp() {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  }

  E.panel = E.panel || {};
  E.panel.createEditorPanel = createEditorPanel;
  E.panel.removeEditorPanel = removeEditorPanel;
})();
