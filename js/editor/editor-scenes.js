/**
 * editor-scenes.js - Scene management with WORKING dropdown and arrows
 */
(function() {
  'use strict';

  var E = window.__editor;
  var S = E.state;
  var scrollInterval = null;
  var isDragging = false;

  function refreshSceneNav() {
    var select = document.getElementById('scene-select');
    if (!select || !S.currentProject) return;
    select.innerHTML = '';
    S.currentProject.scenes.forEach(function(scene, idx) {
      var opt = document.createElement('option');
      opt.value = String(idx);
      opt.textContent = scene.name || scene.id;
      if (idx === S.currentSceneIndex) opt.selected = true;
      select.appendChild(opt);
    });
  }

  function navigateScene(dir) {
    if (!S.currentProject) return;
    var newIndex = S.currentSceneIndex + dir;
    if (newIndex < 0 || newIndex >= S.currentProject.scenes.length) return;
    S.currentSceneIndex = newIndex;
    S.currentVisibleSteps = -1;
    E.renderer.renderSceneUpToStep(-1);
    refreshSceneNav();
    E.timeline.refreshStepsTimeline();
    E.showToast('Escena: ' + (S.currentProject.scenes[newIndex].name || S.currentProject.scenes[newIndex].id));
  }

  function goToScene(idx) {
    if (!S.currentProject) return;
    if (idx < 0 || idx >= S.currentProject.scenes.length) return;
    S.currentSceneIndex = idx;
    S.currentVisibleSteps = -1;
    E.renderer.renderSceneUpToStep(-1);
    refreshSceneNav();
    E.timeline.refreshStepsTimeline();
  }

  function addNewScene() {
    if (!S.currentProject) return;
    var idx = S.currentProject.scenes.length;
    var id = 'scene_' + (idx + 1);
    S.currentProject.scenes.push({
      id: id,
      name: 'Escena ' + (idx + 1),
      background: { type: 'full', color: 'linear-gradient(180deg, #652381, #3d1450, #1a1a2e)' },
      sequence: []
    });
    S.currentSceneIndex = idx;
    S.hasUnsavedChanges = true;
    S.currentVisibleSteps = -1;
    E.renderer.renderSceneUpToStep(-1);
    refreshSceneNav();
    E.timeline.refreshStepsTimeline();
    E.showToast('Escena agregada');
  }

  function deleteScene(idx) {
    if (!S.currentProject || S.currentProject.scenes.length <= 1) {
      E.showToast('Debe haber al menos una escena', 'error');
      return;
    }
    S.currentProject.scenes.splice(idx, 1);
    if (S.currentSceneIndex >= S.currentProject.scenes.length) {
      S.currentSceneIndex = S.currentProject.scenes.length - 1;
    }
    S.hasUnsavedChanges = true;
    S.currentVisibleSteps = -1;
    E.renderer.renderSceneUpToStep(-1);
    refreshSceneNav();
    E.timeline.refreshStepsTimeline();
    E.showToast('Escena eliminada');
  }

  function reorderScene(fromIdx, toIdx) {
    if (!S.currentProject) return;
    var scenes = S.currentProject.scenes;
    if (fromIdx < 0 || fromIdx >= scenes.length || toIdx < 0 || toIdx >= scenes.length) return;
    if (fromIdx === toIdx) return;
    
    var scene = scenes.splice(fromIdx, 1)[0];
    scenes.splice(toIdx, 0, scene);
    
    if (S.currentSceneIndex === fromIdx) {
      S.currentSceneIndex = toIdx;
    } else if (S.currentSceneIndex > fromIdx && S.currentSceneIndex <= toIdx) {
      S.currentSceneIndex--;
    } else if (S.currentSceneIndex < fromIdx && S.currentSceneIndex >= toIdx) {
      S.currentSceneIndex++;
    }
    
    S.hasUnsavedChanges = true;
    refreshSceneNav();
    E.timeline.refreshStepsTimeline();
  }

  function showSortModal() {
    if (!S.currentProject || S.currentProject.scenes.length < 2) {
      E.showToast('Necesitas al menos 2 escenas para ordenar', 'error');
      return;
    }
    
    var existing = document.getElementById('sort-modal');
    if (existing) existing.remove();
    
    var overlay = document.createElement('div');
    overlay.className = 'editor-modal-overlay';
    overlay.id = 'sort-modal';
    
    var modal = document.createElement('div');
    modal.className = 'editor-modal';
    
    var html = '<div class="modal-header">';
    html += '<span class="modal-title">Ordenar Escenas</span>';
    html += '<button class="modal-close" onclick="document.getElementById(\'sort-modal\').remove()">✕</button>';
    html += '</div>';
    html += '<div class="modal-body">';
    html += '<p>Arrastra las escenas para reordenarlas:</p>';
    html += '<div id="sort-scenes-list" class="sort-scenes-list">';
    
    S.currentProject.scenes.forEach(function(scene, idx) {
      html += '<div class="sort-scene-item" draggable="true" data-idx="' + idx + '">';
      html += '<span class="step-drag">⠿</span>';
      html += '<span class="sort-scene-name">' + (scene.name || scene.id) + '</span>';
      html += '</div>';
    });
    
    html += '</div>';
    html += '</div>';
    html += '<div class="modal-footer">';
    html += '<button class="editor-btn" onclick="document.getElementById(\'sort-modal\').remove()">Cerrar</button>';
    html += '</div>';
    
    modal.innerHTML = html;
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    setTimeout(function() {
      var list = document.getElementById('sort-scenes-list');
      if (!list) return;
      
      var items = list.querySelectorAll('.sort-scene-item');
      var dragSrcIdx = null;
      
      // Fix scroll: handle wheel events to allow scrolling within the modal
      function handleWheel(e) {
        var rect = list.getBoundingClientRect();
        
        if (e.clientX >= rect.left && e.clientX <= rect.right &&
            e.clientY >= rect.top && e.clientY <= rect.bottom) {
          
          var delta = e.deltaY || (e.detail ? e.detail * 40 : 0) || (e.wheelDelta ? -e.wheelDelta : 0);
          list.scrollTop += delta > 0 ? 30 : -30;
          
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }
      
      list.addEventListener('wheel', handleWheel, { passive: false, capture: true });
      list.addEventListener('mousewheel', handleWheel, { passive: false, capture: true });
      
      overlay.addEventListener('wheel', function(e) {
        e.preventDefault();
        e.stopPropagation();
      }, { passive: false });
      
      document.addEventListener('dragover', function(e) {
        if (isDragging) {
          e.preventDefault();
        }
      });
      
      items.forEach(function(item) {
        item.addEventListener('dragstart', function(e) {
          dragSrcIdx = parseInt(item.dataset.idx);
          isDragging = true;
          e.dataTransfer.setData('text/plain', dragSrcIdx);
          e.dataTransfer.effectAllowed = 'move';
          item.classList.add('dragging-scene');
          startScrollHandler(list);
        });
        
        item.addEventListener('dragend', function(e) {
          isDragging = false;
          dragSrcIdx = null;
          item.classList.remove('dragging-scene');
          clearDropIndicators(list);
          stopScrollHandler();
        });
        
        item.addEventListener('dragover', function(e) {
          if (!isDragging) return;
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          
          var rect = item.getBoundingClientRect();
          var midY = rect.top + rect.height / 2;
          var isTopHalf = e.clientY < midY;
          
          clearDropIndicators(list);
          if (isTopHalf) {
            item.classList.add('drop-above');
          } else {
            item.classList.add('drop-below');
          }
        });
        
        item.addEventListener('dragleave', function(e) {
          item.classList.remove('drop-above', 'drop-below');
        });
        
        item.addEventListener('drop', function(e) {
          e.preventDefault();
          e.stopPropagation();
          clearDropIndicators(list);
          stopScrollHandler();
          
          var fromIdx = dragSrcIdx;
          var toIdx = parseInt(item.dataset.idx);
          
          if (fromIdx === null || fromIdx === toIdx || isNaN(fromIdx) || isNaN(toIdx)) return;
          
          var rect = item.getBoundingClientRect();
          var midY = rect.top + rect.height / 2;
          var isTopHalf = e.clientY < midY;
          
          var finalIdx;
          if (isTopHalf) {
            finalIdx = toIdx;
          } else {
            finalIdx = toIdx + 1;
          }
          
          if (fromIdx < finalIdx) {
            finalIdx = finalIdx - 1;
          }
          
          if (fromIdx !== finalIdx) {
            reorderScene(fromIdx, finalIdx);
            document.getElementById('sort-modal').remove();
            showSortModal();
          }
        });
      });
    }, 200);
  }
  
  function clearDropIndicators(list) {
    list.querySelectorAll('.sort-scene-item').forEach(function(item) {
      item.classList.remove('drop-above', 'drop-below');
    });
  }
  
  function startScrollHandler(list) {
    stopScrollHandler();
    
    scrollInterval = setInterval(function() {
      if (!isDragging || !list) return;
      
      var rect = list.getBoundingClientRect();
      var mouseY = window.__dragMouseY;
      
      if (mouseY === undefined) return;
      
      var scrollSpeed = 8;
      var edgeZone = 50;
      
      var mouseX = window.__dragMouseX;
      if (mouseX < rect.left || mouseX > rect.right) return;
      
      if (mouseY < rect.top + edgeZone) {
        list.scrollTop = Math.max(0, list.scrollTop - scrollSpeed);
      } else if (mouseY > rect.bottom - edgeZone) {
        list.scrollTop = Math.min(list.scrollHeight - list.clientHeight, list.scrollTop + scrollSpeed);
      }
    }, 50);
    
    document.addEventListener('dragover', function(e) {
      if (isDragging) {
        window.__dragMouseY = e.clientY;
        window.__dragMouseX = e.clientX;
      }
    });
  }
  
  function stopScrollHandler() {
    if (scrollInterval) {
      clearInterval(scrollInterval);
      scrollInterval = null;
    }
  }

  function buildSceneNavHTML() {
    return (
      '<div class="editor-section">' +
        '<div class="section-label">Escena</div>' +
        '<div class="scene-nav-row">' +
          '<button class="editor-btn-small" id="scene-prev">◀</button>' +
          '<select id="scene-select" class="editor-select"></select>' +
          '<button class="editor-btn-small" id="scene-next">▶</button>' +
        '</div>' +
        '<div class="scene-nav-row">' +
          '<button class="editor-btn-small full-width" id="scene-add">+ Nueva escena</button>' +
          '<button class="editor-btn-small" id="scene-delete" title="Eliminar escena">✕</button>' +
          '<button class="editor-btn-small" id="scene-sort" title="Ordenar escenas">⇅</button>' +
        '</div>' +
      '</div>'
    );
  }

  // Event delegation for scene navigation
  document.addEventListener('click', function(e) {
    if (e.target.id === 'scene-prev') {
      navigateScene(-1);
    } else if (e.target.id === 'scene-next') {
      navigateScene(1);
    } else if (e.target.id === 'scene-sort') {
      showSortModal();
    }
  });

  // Handle dropdown change
  document.addEventListener('change', function(e) {
    if (e.target.id === 'scene-select') {
      var idx = parseInt(e.target.value);
      goToScene(idx);
    }
  });

  E.scenes = E.scenes || {};
  E.scenes.refreshSceneNav = refreshSceneNav;
  E.scenes.navigateScene = navigateScene;
  E.scenes.goToScene = goToScene;
  E.scenes.addNewScene = addNewScene;
  E.scenes.deleteScene = deleteScene;
  E.scenes.reorderScene = reorderScene;
  E.scenes.showSortModal = showSortModal;
  E.scenes.buildSceneNavHTML = buildSceneNavHTML;
})();
