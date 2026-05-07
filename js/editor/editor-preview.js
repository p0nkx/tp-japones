/**
 * editor-preview.js
 * =============================================
 * MODO PREVIEW - Vista previa del proyecto como si fuera el lector final
 * 
 * Este archivo controla:
 * - enterPreviewMode() - Entra al modo preview guardando estado actual
 * - exitPreviewMode() - Sale del modo preview restaurando estado
 * - setupPreviewScroll() - Configura navegación por scroll en preview
 * - restoreEditorScroll() - Restaura el handler de scroll del editor
 * - applyProjectToEngine() - Aplica el proyecto al motor visual
 * 
 * En modo preview:
 * - Se usa el motor completo del lector (no el renderer del editor)
 * - La navegación es por scroll (como el lector final)
 * - Los elementos aparecen/desaparecen según showAfter/disappearAfter
 * - Al salir se restaura la posición y estado del editor
 */

(function() {
  'use strict';

  var E = window.__editor;
  var S = E.state;

  /**
   * Entra al modo preview:
   * - Guarda estado actual (escena, paso visible)
   * - Oculta panel del editor
   * - Configura navegación por scroll
   * - Llama al motor de renderizado completo
   */
  function enterPreviewMode() {
    if (!S.currentProject) return;
    E.saveProject();

    S.previewState = {
      sceneIndex: S.currentSceneIndex,
      visibleSteps: S.currentVisibleSteps,
      locked: false
    };

    document.body.classList.remove('editor-mode');
    document.body.classList.add('preview-mode');

    var panel = document.getElementById('editor-panel');
    if (panel) panel.style.display = 'none';

    window.__editorEnabled = false;
    
    // Setup preview scroll handler
    window.__onEditorScroll = function(direction) {
      if (!S.previewState || S.previewState.locked) return;
      
      var scene = S.currentProject.scenes[S.previewState.sceneIndex];
      if (!scene || !scene.sequence) return;
      var totalSteps = scene.sequence.length;
      if (totalSteps === 0) return;
      
      var newVisible = S.previewState.visibleSteps + direction;
      
      // Si nos pasamos de la escena actual, cambiar de escena
      if (newVisible >= totalSteps && direction > 0) {
        if (S.previewState.sceneIndex < S.currentProject.scenes.length - 1) {
          S.previewState.sceneIndex++;
          S.previewState.visibleSteps = 0;
          previewRenderScene(S.previewState.sceneIndex);
        }
        return;
      }
      
      // Si retrocedemos antes del paso 0, ir a escena anterior
      if (newVisible < 0 && direction < 0) {
        if (S.previewState.sceneIndex > 0) {
          S.previewState.sceneIndex--;
          var prevScene = S.currentProject.scenes[S.previewState.sceneIndex];
          S.previewState.visibleSteps = prevScene.sequence.length - 1;
          previewRenderScene(S.previewState.sceneIndex);
        }
        return;
      }
      
      // Dentro de la misma escena - render up to step
      if (newVisible >= 0 && newVisible < totalSteps) {
        S.previewState.visibleSteps = newVisible;
        previewRenderScene(S.previewState.sceneIndex);
      }
    };

    createPreviewBar();
    previewRenderScene(S.previewState.sceneIndex);
  }

  function previewRenderScene(sceneIdx) {
    if (!S.currentProject || !S.currentProject.scenes[sceneIdx]) return;
    var scene = S.currentProject.scenes[sceneIdx];

    var engineData = VNStorage.projectToEngine(S.currentProject);
    if (!engineData) return;

    // Calculate the target step index based on visibleSteps
    var visibleSteps = S.previewState ? S.previewState.visibleSteps : scene.sequence.length - 1;
    
    // Find the correct step index in allSteps that corresponds to visibleSteps
    var targetStepIndex = -1;
    var allSteps = window.__getAllSteps ? window.__getAllSteps() : [];
    
    // For non-short scenes, steps are accumulated
    // stepStartIndex + N = step with N+1 elements
    var sceneId = engineData[sceneIdx] ? engineData[sceneIdx].id : null;
    if (sceneId) {
      for (var i = 0; i < allSteps.length; i++) {
        if (allSteps[i].scene.id === sceneId && !allSteps[i].isShort) {
          // This is a step of our target scene
          // The elements.length - 1 gives us the visibleSteps equivalent
          if (allSteps[i].elements.length - 1 === visibleSteps) {
            targetStepIndex = i;
            break;
          }
        }
      }
    }
    
    // Fallback: use first step of scene
    if (targetStepIndex === -1) {
      targetStepIndex = allSteps.findIndex(function(s) { return s.scene.id === sceneId && !s.isShort; });
      if (targetStepIndex === -1) targetStepIndex = 0;
    }

    // Apply engine data with the calculated step index
    if (window.__applyEngineData) {
      window.__applyEngineData(engineData, sceneIdx, targetStepIndex);
    } else if (window.__renderSceneFull) {
      var engineScene = engineData[sceneIdx] || engineData[0];
      window.__renderSceneFull(engineScene);
    }
    setTimeout(E.renderer.resolveImageSrc, 50);

    S.previewState.sceneIndex = sceneIdx;
    S.currentSceneIndex = sceneIdx;
    updatePreviewNav();
    updatePreviewDropdown();
  }

  function exitPreviewMode() {
    document.body.classList.remove('preview-mode');
    window.__previewLocked = false;

    var bar = document.getElementById('preview-bar');
    if (bar) bar.remove();

    var panel = document.getElementById('editor-panel');
    if (panel) panel.style.display = '';

    window.__editorEnabled = true;

    if (S.previewState) {
      S.currentSceneIndex = S.previewState.sceneIndex;
      S.currentVisibleSteps = S.previewState.visibleSteps;
      S.previewState = null;
    }

    // Restore editor scroll handler
    if (E.restoreEditorScroll) {
      E.restoreEditorScroll();
    }
    
    E.renderer.renderSceneUpToStep(S.currentVisibleSteps);
    E.scenes.refreshSceneNav();
    E.timeline.refreshStepsTimeline();
    E.timeline.highlightActiveStep(S.currentVisibleSteps);
  }

  function createPreviewBar() {
    var existing = document.getElementById('preview-bar');
    if (existing) existing.remove();

    var bar = document.createElement('div');
    bar.id = 'preview-bar';

    var btnBack = document.createElement('button');
    btnBack.className = 'preview-btn';
    btnBack.textContent = '\u2190 Editor';
    btnBack.addEventListener('click', exitPreviewMode);

    var btnPrev = document.createElement('button');
    btnPrev.className = 'preview-btn';
    btnPrev.id = 'preview-prev';
    btnPrev.textContent = '\u25C0';
    btnPrev.addEventListener('click', function() {
      if (S.previewState && !S.previewState.locked && S.previewState.sceneIndex > 0) {
        previewRenderScene(S.previewState.sceneIndex - 1);
      }
    });

    var sceneSelector = document.createElement('div');
    sceneSelector.className = 'preview-select-wrapper';

    var selectBtn = document.createElement('button');
    selectBtn.className = 'preview-select-btn';
    selectBtn.id = 'preview-select-btn';
    selectBtn.textContent = '\u2014';
    selectBtn.addEventListener('click', function() {
      var dropdown = document.getElementById('preview-scene-dropdown');
      if (dropdown) {
        var isOpen = dropdown.classList.contains('open');
        removeSceneDropdown();
        if (!isOpen) buildSceneDropdown();
      } else {
        buildSceneDropdown();
      }
    });

    sceneSelector.appendChild(selectBtn);

    var btnNext = document.createElement('button');
    btnNext.className = 'preview-btn';
    btnNext.id = 'preview-next';
    btnNext.textContent = '\u25B6';
    btnNext.addEventListener('click', function() {
      if (S.previewState && !S.previewState.locked && S.currentProject && S.previewState.sceneIndex < S.currentProject.scenes.length - 1) {
        previewRenderScene(S.previewState.sceneIndex + 1);
      }
    });

    function buildSceneDropdown() {
      removeSceneDropdown();
      var dropdown = document.createElement('div');
      dropdown.id = 'preview-scene-dropdown';
      dropdown.className = 'open';
      if (!S.currentProject) return;
      S.currentProject.scenes.forEach(function(scene, idx) {
        var opt = document.createElement('div');
        opt.className = 'preview-dropdown-item';
        opt.textContent = (idx + 1) + '. ' + (scene.name || scene.id);
        if (idx === S.previewState.sceneIndex) opt.classList.add('selected');
        opt.addEventListener('click', function(e) {
          e.stopPropagation();
          if (!S.previewState.locked) {
            removeSceneDropdown();
            previewRenderScene(idx);
          }
        });
        dropdown.appendChild(opt);
      });
      sceneSelector.appendChild(dropdown);
    }

    function removeSceneDropdown() {
      var existing = document.getElementById('preview-scene-dropdown');
      if (existing) existing.remove();
    }

    document.addEventListener('click', function(e) {
      if (!e.target.closest('#preview-scene-dropdown') && !e.target.closest('#preview-select-btn')) {
        removeSceneDropdown();
      }
    });

    var btnLock = document.createElement('button');
    btnLock.className = 'preview-btn';
    btnLock.id = 'preview-lock';
    btnLock.textContent = '\uD83D\uDD13';
    btnLock.title = 'Bloquear escena';
    btnLock.addEventListener('click', function() {
      if (!S.previewState) return;
      S.previewState.locked = !S.previewState.locked;
      window.__previewLocked = S.previewState.locked;
      btnLock.textContent = S.previewState.locked ? '\uD83D\uDD12' : '\uD83D\uDD13';
      btnLock.classList.toggle('locked', S.previewState.locked);
      btnPrev.style.opacity = S.previewState.locked ? '0.3' : '';
      btnNext.style.opacity = S.previewState.locked ? '0.3' : '';
      selectBtn.style.opacity = S.previewState.locked ? '0.4' : '1';
      E.showToast(S.previewState.locked ? 'Escena bloqueada' : 'Escena desbloqueada');
    });

    var btnReplay = document.createElement('button');
    btnReplay.className = 'preview-btn';
    btnReplay.id = 'preview-replay';
    btnReplay.textContent = '\u27F3 Replay';
    btnReplay.title = 'Reiniciar escena actual';
    btnReplay.addEventListener('click', function() {
      if (!S.previewState) return;
      previewRenderScene(S.previewState.sceneIndex);
    });

    var info = document.createElement('span');
    info.className = 'preview-info';
    info.id = 'preview-info';

    var hint = document.createElement('span');
    hint.className = 'preview-hint';
    hint.textContent = 'Scroll para ver elementos paso a paso';

    bar.appendChild(btnBack);
    bar.appendChild(btnPrev);
    bar.appendChild(sceneSelector);
    bar.appendChild(btnNext);
    bar.appendChild(btnLock);
    bar.appendChild(btnReplay);
    bar.appendChild(info);
    bar.appendChild(hint);
    document.body.appendChild(bar);
  }

  function updatePreviewDropdown() {
    var btn = document.getElementById('preview-select-btn');
    if (!btn || !S.currentProject) return;
    var scene = S.currentProject.scenes[S.previewState.sceneIndex];
    if (scene) {
      btn.textContent = (S.previewState.sceneIndex + 1) + '. ' + (scene.name || scene.id);
    }
    removeSceneDropdown();
  }

  function removeSceneDropdown() {
    var existing = document.getElementById('preview-scene-dropdown');
    if (existing) existing.remove();
  }

  function updatePreviewNav() {
    var info = document.getElementById('preview-info');
    if (info && S.currentProject && S.previewState) {
      var scene = S.currentProject.scenes[S.previewState.sceneIndex];
      info.textContent = (S.previewState.sceneIndex + 1) + ' / ' + S.currentProject.scenes.length + ' \u2014 ' + (scene.name || scene.id);
    }
    var prevBtn = document.getElementById('preview-prev');
    var nextBtn = document.getElementById('preview-next');
    if (prevBtn && !S.previewState.locked) prevBtn.style.opacity = (S.previewState.sceneIndex > 0) ? '1' : '0.3';
    if (nextBtn && !S.previewState.locked) nextBtn.style.opacity = (S.previewState.sceneIndex < S.currentProject.scenes.length - 1) ? '1' : '0.3';
  }

  function changeScene(direction) {
    if (!S.previewState || S.previewState.locked) return;
    var nextIdx = S.previewState.sceneIndex + (direction > 0 ? 1 : -1);
    if (nextIdx < 0 || nextIdx >= S.currentProject.scenes.length) return;
    previewRenderScene(nextIdx);
  }

  window.__previewChangeScene = changeScene;

  E.preview = E.preview || {};
  E.preview.enterPreviewMode = enterPreviewMode;
  E.preview.exitPreviewMode = exitPreviewMode;
  E.preview.previewRenderScene = previewRenderScene;
})();
