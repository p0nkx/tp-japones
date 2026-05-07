(function() {
  var app = document.getElementById('app');
  var IMG = 'images/';
  var allSteps = [];
  var currentStep = 0;
  var isTransitioning = false;
  var cooldown = false;

  var sceneFrame, screenEl, bgContainer, visualContainer;

  // ========================================
  // HELPERS
  // ========================================
  function createImg(file) {
    var img = document.createElement('img');
    img.src = IMG + file;
    img.className = 'char-img';
    img.onerror = function() { this.style.display = 'none'; };
    return img;
  }

  function buildBgPanel(src, cls) {
    var p = document.createElement('div');
    p.className = 'bg-panel ' + (cls || '');
    if (src) p.style.backgroundImage = "url('" + IMG + src + "')";
    return p;
  }

  function buildBgDom(scene) {
    var layer = document.createElement('div');
    layer.className = 'bg-layer';
    var bg = scene.background;
    switch (bg.type) {
      case 'full':
        if (bg.color) { layer.style.background = bg.color; }
        else { layer.appendChild(buildBgPanel(bg.image)); }
        break;
      case 'split-v':
        layer.classList.add('bg-split-v');
        layer.appendChild(buildBgPanel(bg.left));
        layer.appendChild(buildBgPanel(bg.right));
        break;
      case 'split-h':
        layer.classList.add('bg-split-h');
        layer.appendChild(buildBgPanel(bg.top));
        layer.appendChild(buildBgPanel(bg.bottom));
        break;
      case 'diagonal':
        layer.classList.add('bg-diagonal');
        layer.classList.add(bg.direction === 'tr-bl' ? 'diag-tr-bl' : 'diag-tl-br');
        layer.appendChild(buildBgPanel(bg.bottom, 'bg-second'));
        layer.appendChild(buildBgPanel(bg.top, 'bg-first'));
        break;
    }
    if (bg.nightmare) {
      layer.classList.add('bg-nightmare');
    }
    return layer;
  }

  function buildCharPositions(seq) {
    var map = {};
    seq.forEach(function(el) {
      if (el.type === 'character' && el.id) map[el.id] = el.position;
    });
    return map;
  }

  function resolveTargets(seq) {
    var charMap = buildCharPositions(seq);
    seq.forEach(function(el) {
      if (el.type.indexOf('bubble') === 0) {
        if (el.position && typeof el.position === 'object') {
          el.bubblePosCustom = el.position;
          el.bubblePos = 'center';
        } else if (el.position) {
          el.bubblePos = el.position;
        } else if (el.target) {
          el.bubblePos = charMap[el.target] || 'center';
        } else {
          el.bubblePos = 'narration';
        }
      }
    });
  }

  function buildBubbleContent(text) {
    if (!text) return '';
    var mode = window.__bubbleMode || 2;
    var jp = text.jp || '';
    var en = text.en || '';
    var es = text.es || '';
    var html = '<div class="bubble-jp">' + jp + '</div>';
    if (mode === 2 || mode === 4) {
      if (en) html += '<div class="bubble-en">' + en + '</div>';
    }
    if (mode === 3 || mode === 4) {
      if (es) html += '<div class="bubble-es">' + es + '</div>';
    }
    return html;
  }

  function rebuildAllBubbles() {
    var bubbles = document.querySelectorAll('.bubble[data-text-json]');
    bubbles.forEach(function(bubble) {
      var text = JSON.parse(bubble.dataset.textJson);
      if (bubble.classList.contains('bubble-tremble')) {
        bubble.innerHTML = '<div class="bubble-tremble-inner">' + buildBubbleContent(text) + '</div>';
      } else {
        bubble.innerHTML = buildBubbleContent(text);
      }
    });
  }

  function buildElement(item, isHidden) {
    var el = document.createElement('div');
    el.className = 'el';
    el.dataset.elType = item.type;

    // Use parameter isHidden if provided, otherwise check item.hidden
    var hidden = (isHidden !== undefined ? isHidden : item.hidden) || false;

    switch (item.type) {
      case 'title':
        el.classList.add('el-title');
        el.textContent = item.text;
        break;
      case 'subtitle':
        el.classList.add('el-subtitle');
        el.textContent = item.text;
        break;
      case 'names':
        el.classList.add('el-names');
        el.textContent = item.text;
        break;
      case 'logo':
        el.classList.add('el-logo');
        el.appendChild(createImg(item.file));
        break;
      case 'scroll-hint':
        el.classList.add('el-scroll-hint');
        el.textContent = item.text;
        break;
      case 'character':
        if (hidden) {
          el.classList.add('char-hidden');
          el.dataset.charId = item.id || '';
        } else {
          el.classList.add('char');
          el.dataset.charId = item.id || '';
          if (item.silhouette) {
            el.classList.add('char-silhouette');
          }
          if (item.position && typeof item.position === 'object' && item.position.left) {
            el.style.left = item.position.left;
            el.style.top = item.position.top;
            if (item.position.width) el.style.width = item.position.width;
            if (item.position.height) el.style.height = item.position.height;
          } else {
            el.classList.add('pos-' + item.position);
          }
          el.appendChild(createImg(item.file));
        }
        break;
      case 'object':
        if (hidden) {
          el.classList.add('char-hidden');
          el.dataset.objId = item.id || '';
        } else {
          el.classList.add('scene-object');
          el.dataset.objId = item.id || '';
          if (item.position && typeof item.position === 'object' && item.position.left) {
            el.style.left = item.position.left;
            el.style.top = item.position.top;
            if (item.position.width) el.style.width = item.position.width;
            if (item.position.height) el.style.height = item.position.height;
          } else {
            el.style.left = '40%';
            el.style.top = '30%';
            el.style.width = '15%';
          }
          var objImg = createImg(item.file);
          objImg.className = 'obj-img';
          el.appendChild(objImg);
        }
        break;
      case 'bubble':
        el.classList.add('bubble');
        if (item.bubblePosCustom && item.bubblePosCustom.left) {
          el.style.left = item.bubblePosCustom.left;
          el.style.top = item.bubblePosCustom.top;
        } else {
          el.classList.add('pos-' + (item.bubblePos || 'center'));
        }
        el.dataset.target = item.target || '';
        if (hidden) {
          el.classList.add('bubble-hidden');
          console.log('  BURBUJA OCULTA (no innerHTML) - target:', item.target);
        }
        if (item.tremble && !hidden) {
          el.classList.add('bubble-tremble');
        }
        el.dataset.textJson = JSON.stringify(item.text);
        if (!hidden) {
          if (item.tremble) {
            el.innerHTML = '<div class="bubble-tremble-inner">' + buildBubbleContent(item.text) + '</div>';
          } else {
            el.innerHTML = buildBubbleContent(item.text);
          }
          console.log('  BURBUJA VISIBLE - target:', item.target, '- text:', item.text ? item.text.jp : 'NO TEXT');
        }
        break;
      case 'narration':
        el.classList.add('bubble', 'pos-narration');
        el.dataset.target = '__narration__';
        if (hidden) {
          el.classList.add('bubble-hidden');
        } else {
          el.dataset.textJson = JSON.stringify(item.text);
          el.innerHTML = buildBubbleContent(item.text);
        }
        break;
      case 'closing-title':
        el.classList.add('el-ctitle');
        el.textContent = item.text;
        break;
      case 'closing-logo':
        el.classList.add('el-clogo');
        el.appendChild(createImg(item.file));
        break;
      case 'closing-sub':
        el.classList.add('el-csub');
        el.textContent = item.text;
        break;
      case 'closing-names':
        el.classList.add('el-cnames');
        el.textContent = item.text;
        break;
      case 'closing-footer':
        el.classList.add('el-cfooter');
        el.innerHTML = item.text + '<img class="footer-logo" src="' + IMG + item.logo + '" />';
        break;
    }
    return el;
  }

  function resolveElementVisibility() {
    // Esta función ahora solo maneja personajes
    var allChars = visualContainer.querySelectorAll('.char, .char-hidden');
    var charsById = {};
    for (var k = 0; k < allChars.length; k++) {
      var c = allChars[k].dataset.charId || '__none__';
      if (!charsById[c]) charsById[c] = [];
      charsById[c].push(allChars[k]);
    }
    for (var key2 in charsById) {
      var group2 = charsById[key2];
      for (var m = 0; m < group2.length; m++) {
        if (group2[m].classList.contains('char-hidden')) {
          group2[m].classList.remove('show');
          group2[m].classList.add('el-exit');
        } else if (m === group2.length - 1) {
          group2[m].classList.remove('el-exit');
          group2[m].classList.add('show');
        } else {
          group2[m].classList.remove('show');
          group2[m].classList.add('el-exit');
        }
      }
    }
  }

  // ========================================
  // BUILD STEP DEFINITIONS
  // ========================================
  storyContent.forEach(function(scene) {
    var seq = scene.sequence || scene.elements || [];
    resolveTargets(seq);

    var isShort = !!scene.isWelcome || scene.id === 'closing';

    if (isShort) {
      allSteps.push({
        scene: scene,
        elements: seq,
        isShort: true,
        stepStartIndex: allSteps.length
      });
    } else {
      var sceneStartIndex = allSteps.length;
      allSteps.push({
        scene: scene,
        elements: [],
        isShort: false,
        stepStartIndex: sceneStartIndex
      });
      var accumulated = [];
      seq.forEach(function(item, itemIdx) {
        accumulated.push(item);
        allSteps.push({
          scene: scene,
          elements: accumulated.slice(),
          isShort: false,
          stepStartIndex: sceneStartIndex
        });
      });
    }
  });

  // ========================================
  // TRANSITION OVERLAY
  // ========================================
  var overlay = document.createElement('div');
  overlay.id = 'transition-overlay';
  document.body.appendChild(overlay);

  // ========================================
  // INIT DOM
  // ========================================
  function initDOM() {
    app.innerHTML = '';

    sceneFrame = document.createElement('div');
    sceneFrame.id = 'scene-frame';

    screenEl = document.createElement('div');
    screenEl.className = 'screen';

    bgContainer = document.createElement('div');
    bgContainer.className = 'scene-frame';

    visualContainer = document.createElement('div');
    visualContainer.className = 'scene-visual';

    bgContainer.appendChild(visualContainer);
    screenEl.appendChild(bgContainer);
    sceneFrame.appendChild(screenEl);
    app.appendChild(sceneFrame);

    // Toggle button
    var btn = document.createElement('button');
    btn.id = 'lang-toggle';
    btn.textContent = 'JP+EN';
    btn.addEventListener('click', function() {
      window.__bubbleMode = (window.__bubbleMode || 2) % 4 + 1;
      updateToggleLabel();
      rebuildAllBubbles();
    });
    document.body.appendChild(btn);
    updateToggleLabel();
  }

  var modeLabels = ['', 'JP', 'JP+EN', 'JP+ES', 'JP+EN+ES'];

  function updateToggleLabel() {
    var btn = document.getElementById('lang-toggle');
    if (btn) btn.textContent = modeLabels[window.__bubbleMode || 2];
  }

  // ========================================
  // RENDER STEP
  // ========================================
  function renderStep(stepIndex, skipTransition) {
    var step = allSteps[stepIndex];
    if (!step) return;

    bgContainer.innerHTML = '';
    bgContainer.appendChild(buildBgDom(step.scene));
    bgContainer.appendChild(visualContainer);

    visualContainer.innerHTML = '';
    visualContainer.classList.remove('layout-center');
    if (step.isShort) {
      visualContainer.classList.add('layout-center');
    }

    step.elements.forEach(function(item, idx) {
      var isHidden = item.hidden || false;
      if (!step.isShort) {
        // Calculate stepsSinceAppeared matching editor-renderer.js EXACTLY
        // In editor: stepsSinceAppeared = stepIdx - idx
        // Here: stepIdx = last element index in accumulated array
        var stepIdx = step.elements.length - 1;
        var stepsSinceAppeared = stepIdx - idx;
        
        // Debug log (can be removed in production)
        if (item.disappearAfter || item.showAfter) {
          console.log('Step', stepIndex, 'item', idx, '- stepsSince:', stepsSinceAppeared, 'disappear:', item.disappearAfter, 'showAfter:', item.showAfter);
        }
        
        // DEFAULT BEHAVIOR: Bubbles without properties - only show most recent
        // This is standard VN behavior - bubbles replace each other
        if (item.type === 'bubble' && item.disappearAfter === undefined && item.showAfter === undefined) {
          // Hide all bubbles except the most recent one (idx === stepIdx)
          if (idx < stepIdx) {
            isHidden = true;
          }
        } else {
          // Apply explicit visibility rules (matching editor-renderer.js lines 62-68)
          if (item.disappearAfter && stepsSinceAppeared >= item.disappearAfter) {
            isHidden = true;
          }
          if (item.showAfter && stepsSinceAppeared >= item.showAfter) {
            isHidden = false;
          }
        }
      }

      var elDom = buildElement(item, isHidden);
      elDom.dataset.elIndex = idx;

      if (!isHidden) {
        elDom.classList.add('show');
        if (step.isShort) {
          elDom.classList.add('always-on');
        }
      }
      visualContainer.appendChild(elDom);
    });

    resolveElementVisibility();

    if (window.__editorEnabled) {
      setTimeout(markElementsEditable, 50);
    }

    if (!skipTransition && stepIndex > 0) {
      var prevStep = allSteps[stepIndex - 1];
      if (prevStep && prevStep.scene === step.scene) {
        var newItems = step.elements.slice(prevStep.elements.length);
        var prevTotal = prevStep.elements.length;
        var allEls = visualContainer.querySelectorAll('.el');
        for (var i = prevTotal; i < allEls.length; i++) {
          var el = allEls[i];
          void el.offsetWidth;
          el.classList.add('show');
        }
      }
    }
  }

  // ========================================
  // SCENE TRANSITION
  // ========================================
  function transitionToStep(newStepIndex, callback) {
    isTransitioning = true;
    overlay.classList.add('active');

    setTimeout(function() {
      renderStep(newStepIndex, true);
      currentStep = newStepIndex;

      setTimeout(function() {
        overlay.classList.remove('active');
        setTimeout(function() {
          isTransitioning = false;
          if (callback) callback();
        }, 300);
      }, 50);
    }, 300);
  }

  // ========================================
  // SAME SCENE FADE-IN
  // ========================================
  function fadeToStep(newStepIndex) {
    var oldStep = allSteps[currentStep];
    var newStep = allSteps[newStepIndex];

    if (!oldStep || !newStep) return;

    // Simply re-render the step - renderStep handles all visibility logic
    currentStep = newStepIndex;
    renderStep(newStepIndex, false);
  }

  // ========================================
  // SCROLL HANDLER
  // ========================================
  function handleScroll(direction) {
    if (window.__editorEnabled) {
      if (window.__onEditorScroll) {
        window.__onEditorScroll(direction);
      }
      return;
    }

    if (isTransitioning || cooldown) return;

    var nextStep = currentStep + (direction > 0 ? 1 : -1);
    
    // Si nos pasamos del total de pasos, cambiar de escena
    if (nextStep < 0 || nextStep >= allSteps.length) {
      // En modo preview, intentar cambiar de escena
      if (window.__previewChangeScene && !window.__previewLocked) {
        window.__previewChangeScene(direction);
      }
      return;
    }

    var currentSceneId = allSteps[currentStep].scene.id;
    var nextSceneId = allSteps[nextStep].scene.id;
    var isSceneChange = currentSceneId !== nextSceneId;

    if (isSceneChange) {
      cooldown = true;
      transitionToStep(nextStep, function() {
        setTimeout(function() { cooldown = false; }, 100);
      });
    } else {
      fadeToStep(nextStep);
      cooldown = true;
      setTimeout(function() { cooldown = false; }, 500);
    }
  }

  window.addEventListener('wheel', function(e) {
    var editorPanel = document.getElementById('editor-panel');
    if (editorPanel && editorPanel.contains(e.target)) {
      return;
    }
    e.preventDefault();
    handleScroll(e.deltaY > 0 ? 1 : -1);
  }, { passive: false });

  var touchStartY = 0;
  window.addEventListener('touchstart', function(e) {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', function(e) {
    var deltaY = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(deltaY) > 30) {
      handleScroll(deltaY > 0 ? 1 : -1);
    }
  }, { passive: true });

  window.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowDown' || e.key === ' ') {
      e.preventDefault();
      handleScroll(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleScroll(-1);
    }
  });

  // ========================================
  // INIT
  // ========================================
  initDOM();
  renderStep(0, true);

  // ========================================
  // EDITOR HOOKS
  // ========================================
  function renderSceneFull(sceneData) {
    if (!sceneData) return;

    bgContainer.innerHTML = '';
    bgContainer.appendChild(buildBgDom(sceneData));
    bgContainer.appendChild(visualContainer);

    visualContainer.innerHTML = '';
    visualContainer.classList.remove('layout-center');

    var seq = sceneData.sequence || sceneData.elements || [];
    resolveTargets(seq);

    seq.forEach(function(item, idx) {
      var elDom = buildElement(item);
      elDom.dataset.elIndex = idx;
      elDom.classList.add('show');
      visualContainer.appendChild(elDom);
    });

    resolveElementVisibility();

    if (window.__editorEnabled) {
      setTimeout(markElementsEditable, 50);
    }
  }

  function rebuildFromNewContent(newContent) {
    allSteps = [];
    currentStep = 0;
    isTransitioning = false;
    cooldown = false;

    newContent.forEach(function(scene) {
      var seq = scene.sequence || scene.elements || [];
      resolveTargets(seq);

      var isShort = !!scene.isWelcome || scene.id === 'closing';

      if (isShort) {
        allSteps.push({
          scene: scene,
          elements: seq,
          isShort: true,
          stepStartIndex: allSteps.length
        });
      } else {
        var sceneStartIndex = allSteps.length;
        allSteps.push({
          scene: scene,
          elements: [],
          isShort: false,
          stepStartIndex: sceneStartIndex
        });
        var accumulated = [];
        seq.forEach(function(item, itemIdx) {
          accumulated.push(item);
          allSteps.push({
            scene: scene,
            elements: accumulated.slice(),
            isShort: false,
            stepStartIndex: sceneStartIndex
          });
        });
      }
    });

    console.log('rebuildFromNewContent: Total steps:', allSteps.length);
    
    if (window.__editorEnabled && allSteps.length > 0) {
      renderSceneFull(allSteps[0].scene);
    } else {
      // Find first non-short step to render
      var firstNonShortStep = allSteps.findIndex(function(s) { return !s.isShort; });
      console.log('First non-short step index:', firstNonShortStep);
      if (firstNonShortStep === -1) firstNonShortStep = 0;
      renderStep(firstNonShortStep, true);
    }
  }

  window.__applyEngineData = function(data, sceneIdx, stepIdx) {
    console.log('__applyEngineData recibido, sceneIdx:', sceneIdx, 'stepIdx:', stepIdx);
    rebuildFromNewContent(data);
    
    // Find target scene
    var targetSceneId = data[sceneIdx || 0] ? data[sceneIdx || 0].id : data[0].id;
    console.log('Target scene ID:', targetSceneId);
    
    // Find the step to render
    var stepIndex = 0;
    if (stepIdx !== undefined) {
      // Use specific step index if provided
      stepIndex = stepIdx;
    } else {
      // Find first non-short step of target scene
      stepIndex = allSteps.findIndex(function(s) { return s.scene.id === targetSceneId && !s.isShort; });
      if (stepIndex === -1) stepIndex = 0;
    }
    
    console.log('Renderizando step:', stepIndex, 'isShort:', allSteps[stepIndex] ? allSteps[stepIndex].isShort : 'N/A');
    
    // Always use renderStep (not renderSceneFull) to apply visibility rules
    currentStep = stepIndex;
    renderStep(stepIndex, true);
    markElementsEditable();
  };

  window.__renderSceneFull = renderSceneFull;
  window.__getAllSteps = function() { return allSteps; };
  
  window.__goToStep = function(stepIndex) {
    if (stepIndex >= 0 && stepIndex < allSteps.length) {
      currentStep = stepIndex;
      renderStep(stepIndex, true);
    }
  };

  function markElementsEditable() {
    if (!window.__editorEnabled) return;
    var els = visualContainer.querySelectorAll('.char, .scene-object, .bubble, .pos-narration');
    els.forEach(function(el) {
      el.classList.add('editable');
    });
  }

  // ========================================
  // SAKURA
  // ========================================
  var sk = document.createElement('div');
  sk.className = 'sakura-container';
  for (var i = 0; i < 14; i++) {
    var p = document.createElement('div');
    p.className = 'sakura';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (8 + Math.random() * 6) + 's';
    p.style.animationDelay = Math.random() * 10 + 's';
    var sz = 7 + Math.random() * 5;
    p.style.width = sz + 'px';
    p.style.height = sz + 'px';
    p.style.opacity = 0.3 + Math.random() * 0.3;
    sk.appendChild(p);
  }
  document.body.appendChild(sk);

})();
