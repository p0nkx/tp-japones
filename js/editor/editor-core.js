/**
 * editor-core.js
 * =============================================
 * CORAZÓN DEL EDITOR - Gestiona el estado global y la navegación
 * 
 * Este archivo controla:
 * - Estado global del editor (E.state)
 * - Entrada/salida del modo editor
 * - Scroll entre pasos y escenas en modo editor
 * - Resaltado del paso activo en el timeline
 * 
 * Estado global (E.state):
 * - editMode: boolean - Modo actual (editor/preview)
 * - currentProject: objeto - Proyecto completo cargado
 * - currentSceneIndex: number - Índice de escena visible (0-based)
 * - currentVisibleSteps: number - Paso actual en scroll (-1 = inicio)
 * - selectedElement: elemento - Elemento seleccionado en pantalla
 * - hasUnsavedChanges: boolean - Hay cambios sin guardar
 * - previewState: objeto - Estado cuando está en modo preview
 */

(function() {
  'use strict';

  var E = window.__editor || {};

  E.state = {
    editMode: false,
    currentProject: null,
    currentSceneIndex: 0,
    currentVisibleSteps: -1,
    selectedElement: null,
    dragState: null,
    resizeState: null,
    hasUnsavedChanges: false,
    previewState: null
  };

  function init() {
    console.log('Iniciando editor...');
    VNStorage.fetchTemplate().then(function(template) {
      console.log('Plantilla cargada:', template ? 'OK' : 'FAIL');
      loadProject();
    }).catch(function(err) {
      console.error('Error al cargar plantilla:', err);
      loadProject();
    });
  }

  function loadProject() {
    var saved = VNStorage.loadProject();
    var isNewLoad = false;
    if (saved && saved.resources && saved.resources.characters && saved.resources.characters.length > 0) {
      console.log('Proyecto cargado desde localStorage, recursos:', saved.resources.characters.length);
      E.state.currentProject = saved;
    } else {
      console.log('Cargando plantilla base...');
      E.state.currentProject = VNStorage.loadTemplateSync();
      isNewLoad = true;
      console.log('Proyecto base:', E.state.currentProject ? 'OK' : 'FAIL', 'recursos:', E.state.currentProject ? E.state.currentProject.resources : 'N/A');
    }
    if (E.state.currentProject) {
      preloadImages();
      setTimeout(function() {
        // Don't call applyProjectToEngine after this - it will be called separately
        window.__skipApplyEngineData = true;
        forceApplyProject();
        setTimeout(function() { window.__skipApplyEngineData = false; }, 100);
      }, isNewLoad ? 200 : 100);
    }
  }

  function forceApplyProject() {
    var S = E.state;
    if (!S.currentProject) return;
    var engineData = VNStorage.projectToEngine(S.currentProject);
    if (!engineData) return;
    
    console.log('=== forceApplyProject ===');
    console.log('Escenas:', engineData.length);
    
    // Buscar una escena que no sea short (welcome/closing)
    var sceneIdx = -1;
    for (var i = 0; i < engineData.length; i++) {
      if (engineData[i].id !== 'welcome' && engineData[i].id !== 'closing') {
        sceneIdx = i;
        break;
      }
    }
    if (sceneIdx === -1) sceneIdx = 0;
    
    console.log('Usando escena:', sceneIdx, '- id:', engineData[sceneIdx].id);
    if (engineData[sceneIdx].sequence) {
      console.log('Secuencia tiene', engineData[sceneIdx].sequence.length, 'elementos');
      // Mostrar primeros 5 elementos con disappearAfter
      engineData[sceneIdx].sequence.slice(0, 5).forEach(function(item, idx) {
        if (item.disappearAfter !== undefined || item.showAfter !== undefined || item.hidden) {
          console.log('  Elemento', idx, '- tipo:', item.type, 'hidden:', item.hidden, 'disappearAfter:', item.disappearAfter, 'showAfter:', item.showAfter);
        }
      });
    }
    
    if (window.__applyEngineData) {
      window.__applyEngineData(engineData, sceneIdx);
      console.log('Proyecto aplicado al motor');
    }
  }

  function preloadImages() {
    var p = E.state.currentProject;
    if (!p || !p.resources) return;
    var chars = p.resources.characters || [];
    var objs = p.resources.objects || [];
    var bgs = p.resources.backgrounds || [];
    var allFiles = [];
    chars.forEach(function(c) { allFiles.push(c.image); });
    objs.forEach(function(o) { allFiles.push(o.file); });
    bgs.forEach(function(b) { allFiles.push(b.file); });
    allFiles.forEach(function(f) {
      if (f) { var img = new Image(); img.src = 'images/' + f; }
    });
  }

  function createEditorToggle() {
    var btn = document.createElement('button');
    btn.id = 'editor-toggle';
    btn.textContent = '\u270E Editor';
    btn.addEventListener('click', toggleEditMode);
    document.body.appendChild(btn);
  }

  function createImportButton() {
    var btn = document.createElement('button');
    btn.id = 'import-toggle';
    btn.textContent = '\uD83D\uDCE6 Importar';
    btn.addEventListener('click', triggerImport);
    document.body.appendChild(btn);
  }

  function triggerImport() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.zip';
    input.addEventListener('change', function(e) {
      var file = e.target.files[0];
      if (!file) return;
      VNStorage.importProject(file).then(function(project) {
        var S = E.state;
        S.currentProject = project;
        S.currentSceneIndex = 0;
        S.currentVisibleSteps = 0;
        S.hasUnsavedChanges = false;
        console.log('Proyecto cargado:', JSON.stringify(project, null, 2));
        if (S.editMode) {
          E.renderer.renderSceneUpToStep(0);
          E.explorer.refreshExplorer();
          E.scenes.refreshSceneNav();
          E.timeline.refreshStepsTimeline();
        } else {
          applyProjectToEngine();
        }
        showToast('Proyecto importado correctamente');
      }).catch(function(err) {
        showToast('Error al importar: ' + err.message, 'error');
      });
    });
    input.click();
  }

  // ========================================
  // NAVEGACIÓN Y ESTADO
  // ========================================
  
  /**
   * Alterna entre modo editor y modo preview
   * Llama a enterEditMode() o exitEditMode() según el estado actual
   */
  function toggleEditMode() {
    var S = E.state;
    S.editMode = !S.editMode;
    if (S.editMode) enterEditMode(); else exitEditMode();
  }

  /**
   * Activa el modo editor:
   * - Muestra el panel de editor
   * - Inicializa el timeline de pasos
   * - Configura el handler de scroll para navegar pasos
   * - Configura función para restaurar scroll al salir de preview
   */
  function enterEditMode() {
    var S = E.state;
    S.editMode = true;
    window.__editorEnabled = true;
    document.body.classList.add('editor-mode');

    if (!S.currentProject) S.currentProject = VNStorage.loadTemplateSync();
    S.currentVisibleSteps = 0;

    E.panel.createEditorPanel();
    E.explorer.refreshExplorer();
    E.scenes.refreshSceneNav();
    E.timeline.refreshStepsTimeline();

    setupEditorScroll();

    E.renderer.renderSceneUpToStep(0);

    var btn = document.getElementById('editor-toggle');
    if (btn) { btn.textContent = '\u2716 Salir'; btn.classList.add('active'); }
  }

  function setupEditorScroll() {
    var S = E.state;
    window.__onEditorScroll = function(direction) {
      var scene = S.currentProject.scenes[S.currentSceneIndex];
      if (!scene || !scene.sequence) return;
      var totalSteps = scene.sequence.length;
      if (totalSteps === 0) return;
      
      var newVisible = S.currentVisibleSteps + direction;
      
      // Si nos pasamos de la escena actual, cambiar de escena
      if (newVisible >= totalSteps && direction > 0) {
        // Siguiente escena
        if (S.currentSceneIndex < S.currentProject.scenes.length - 1) {
          S.currentSceneIndex++;
          S.currentVisibleSteps = 0;
          E.scenes.refreshSceneNav();
          E.timeline.refreshStepsTimeline();
          E.renderer.renderSceneUpToStep(0);
          E.timeline.highlightActiveStep(0);
        }
        return;
      }
      
      // Si retrocedemos antes del paso 0, ir a escena anterior
      if (newVisible < 0 && direction < 0) {
        if (S.currentSceneIndex > 0) {
          S.currentSceneIndex--;
          var prevScene = S.currentProject.scenes[S.currentSceneIndex];
          S.currentVisibleSteps = prevScene.sequence.length - 1;
          E.scenes.refreshSceneNav();
          E.timeline.refreshStepsTimeline();
          E.renderer.renderSceneUpToStep(S.currentVisibleSteps);
          E.timeline.highlightActiveStep(S.currentVisibleSteps);
        }
        return;
      }
      
      // Dentro de la misma escena
      if (newVisible >= 0 && newVisible < totalSteps) {
        S.currentVisibleSteps = newVisible;
        E.renderer.renderSceneUpToStep(S.currentVisibleSteps);
        E.timeline.refreshStepsTimeline();
        E.timeline.highlightActiveStep(S.currentVisibleSteps);
      }
    };
  }

  E.restoreEditorScroll = setupEditorScroll;

  function exitEditMode() {
    var S = E.state;
    if (S.hasUnsavedChanges) {
      E.modal.showConfirmModal(
        'Cambios sin guardar',
        '\u00BFQuer\u00E9s guardar los cambios antes de salir?',
        function() { saveProject(); doExit(); },
        function() { doExit(); }
      );
    } else {
      doExit();
    }
  }

  function doExit() {
    var S = E.state;
    S.editMode = false;
    window.__editorEnabled = false;
    window.__onEditorScroll = null;
    document.body.classList.remove('editor-mode');
    E.panel.removeEditorPanel();
    applyProjectToEngine();

    var btn = document.getElementById('editor-toggle');
    if (btn) { btn.textContent = '\u270E Editor'; btn.classList.remove('active'); }
    S.selectedElement = null;
  }

  function applyProjectToEngine() {
    if (window.__skipApplyEngineData) {
      console.log('applyProjectToEngine - SKIPPED (flag enabled)');
      return;
    }
    var S = E.state;
    if (!S.currentProject) return;
    var engineData = VNStorage.projectToEngine(S.currentProject);
    if (!engineData) return;
    
    console.log('=== applyProjectToEngine ===');
    console.log('Scenes:', engineData.length);
    
    // Mostrar los primeros 3 elementos de la primera escena
    if (engineData[0] && engineData[0].sequence) {
      console.log('Primer escena tiene', engineData[0].sequence.length, 'elementos');
      engineData[0].sequence.slice(0, 5).forEach(function(item, idx) {
        console.log('  Elemento', idx, '- tipo:', item.type, 'disappearAfter:', item.disappearAfter, 'showAfter:', item.showAfter);
      });
    }
    
    // Always use __applyEngineData to rebuild the steps
    if (window.__applyEngineData) {
      window.__applyEngineData(engineData, S.currentSceneIndex || 0);
      console.log('Datos aplicados al motor');
    }
  }

  function saveProject() {
    var S = E.state;
    if (!S.currentProject) return;
    VNStorage.saveProject(S.currentProject);
    S.hasUnsavedChanges = false;
    showToast('Proyecto guardado');
  }

  function exportProject() {
    var S = E.state;
    if (!S.currentProject) return;
    VNStorage.saveProject(S.currentProject);
    console.log('Proyecto a exportar:', JSON.stringify(S.currentProject, null, 2));
    VNStorage.exportProject(S.currentProject).then(function() {
      showToast('Proyecto exportado');
    }).catch(function(err) {
      showToast('Error al exportar: ' + err.message, 'error');
    });
  }

  function createNewProject() {
    E.modal.showConfirmModal(
      'Nuevo Proyecto',
      '\u00BFCrear un proyecto nuevo? Se perder\u00E1n los cambios no guardados.',
      function() {
        var S = E.state;
        S.currentProject = VNStorage.createNewProject('Nuevo Proyecto');
        S.currentSceneIndex = 0;
        S.currentVisibleSteps = 0;
        S.hasUnsavedChanges = false;
        if (S.editMode) {
          E.renderer.renderSceneUpToStep(0);
        } else {
          applyProjectToEngine();
        }
        E.explorer.refreshExplorer();
        E.scenes.refreshSceneNav();
        E.timeline.refreshStepsTimeline();
        showToast('Nuevo proyecto creado');
      }
    );
  }

  function resetToTemplate() {
    E.modal.showConfirmModal(
      'Resetear Plantilla',
      '\u00BFVolver a la plantilla original del demo? Se perder\u00E1n todos los cambios no guardados.',
      function() {
        var S = E.state;
S.currentProject = VNStorage.resetToTemplateSync();
        S.currentSceneIndex = 0;
        S.currentVisibleSteps = 0;
        S.hasUnsavedChanges = false;
        VNStorage.saveProject(S.currentProject);
        if (S.editMode) {
          E.renderer.renderSceneUpToStep(0);
        } else {
          applyProjectToEngine();
        }
        E.explorer.refreshExplorer();
        E.scenes.refreshSceneNav();
        E.timeline.refreshStepsTimeline();
        showToast('Plantilla original restaurada');
      }
    );
  }

  function highlightActiveStep(idx) {
    document.querySelectorAll('.step-item').forEach(function(el) { el.classList.remove('active'); });
    var activeEl = document.querySelector('.step-item[data-step="' + idx + '"]');
    if (activeEl) activeEl.classList.add('active');
  }

  function truncate(str, len) {
    if (!str) return '';
    return str.length > len ? str.substring(0, len) + '\u2026' : str;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function showToast(message, type) {
    var existing = document.getElementById('toast-notification');
    if (existing) existing.remove();
    var toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'toast ' + (type || 'success');
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(function() { toast.classList.add('show'); }, 10);
    setTimeout(function() {
      toast.classList.remove('show');
      setTimeout(function() { toast.remove(); }, 300);
    }, 2500);
  }

  window.__editorEnabled = false;
  window.__getProjectData = function() { return E.state.currentProject; };
  window.__setProjectData = function(data) {
    if (typeof window.__applyEngineData === 'function') window.__applyEngineData(data);
  };

  function boot() {
    createEditorToggle();
    createImportButton();
    init();
    E.drag.initSceneDragDrop();
    E.bubble.initBubbleEdit();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  E.init = init;
  E.enterEditMode = enterEditMode;
  E.exitEditMode = exitEditMode;
  E.saveProject = saveProject;
  E.exportProject = exportProject;
  E.createNewProject = createNewProject;
  E.resetToTemplate = resetToTemplate;
  E.applyProjectToEngine = applyProjectToEngine;
  E.highlightActiveStep = function(idx) {
    if (E.timeline && E.timeline.highlightActiveStep) {
      E.timeline.highlightActiveStep(idx);
    }
  };
  E.truncate = truncate;
  E.escapeHtml = escapeHtml;
  E.showToast = showToast;

  // Tutorial functionality
  function showTutorial() {
    var existing = document.getElementById('tutorial-modal');
    if (existing) existing.remove();

    var overlay = document.createElement('div');
    overlay.className = 'tutorial-modal-overlay';
    overlay.id = 'tutorial-modal';

    var modal = document.createElement('div');
    modal.className = 'tutorial-modal';

    var html = '<div class="tutorial-modal-header">';
    html += '<span class="tutorial-modal-title">Tutorial edición</span>';
    html += '<button class="tutorial-modal-close" onclick="document.getElementById(\'tutorial-modal\').remove()">✕</button>';
    html += '</div>';
    html += '<div class="tutorial-modal-body" id="tutorial-content">';
    html += '<p>Cargando tutorial...</p>';
    html += '</div>';
    html += '<div class="tutorial-modal-footer">';
    html += '<button class="editor-btn" onclick="document.getElementById(\'tutorial-modal\').remove()">Cerrar</button>';
    html += '</div>';

    modal.innerHTML = html;
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Load tutorial content
    fetch('TUTORIAL.md')
      .then(function(response) {
        if (!response.ok) throw new Error('No se pudo cargar el tutorial');
        return response.text();
      })
      .then(function(markdown) {
        var htmlContent = markdownToHtml(markdown);
        document.getElementById('tutorial-content').innerHTML = htmlContent;
      })
      .catch(function(err) {
        console.error('Error loading tutorial:', err);
        document.getElementById('tutorial-content').innerHTML = '<p>Error al cargar el tutorial. Verifica que TUTORIAL.md exista.</p>';
      });

    // Close on overlay click
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        overlay.remove();
      }
    });

    // Fix scroll: prevent body scroll when mouse is over modal
    var tutorialBody = modal.querySelector('.tutorial-modal-body');
    if (tutorialBody) {
      tutorialBody.addEventListener('wheel', function(e) {
        e.stopPropagation();
      }, { passive: true });
    }
  }

  // Simple markdown to HTML converter
  function markdownToHtml(md) {
    var html = md;
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Inline code
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');
    
    // Code blocks
    html = html.replace(/```javascript([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // Lists
    html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    // Paragraphs
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';
    
    // Fix for headers inside paragraphs
    html = html.replace(/<p><h/g, '<h');
    html = html.replace(/<\/h[1-6]><\/p>/g, function(match) {
      return match.replace('</p>', '');
    });
    
    return html;
  }

  // Add event listener for tutorial button
  document.addEventListener('click', function(e) {
    if (e.target.id === 'tutorial-btn') {
      showTutorial();
    }
  });

  window.__editor = E;
})();
