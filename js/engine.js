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
        if (el.position) {
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

  function buildElement(item) {
    var el = document.createElement('div');
    el.className = 'el';
    el.dataset.elType = item.type;

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
        if (item.hidden) {
          el.classList.add('char-hidden');
          el.dataset.charId = item.id || '';
        } else {
          el.classList.add('char', 'pos-' + item.position);
          el.dataset.charId = item.id || '';
          if (item.silhouette) {
            el.classList.add('char-silhouette');
          }
          el.appendChild(createImg(item.file));
        }
        break;
      case 'bubble':
        el.classList.add('bubble');
        el.classList.add('pos-' + (item.bubblePos || 'center'));
        el.dataset.target = item.target || '';
        if (item.hidden) {
          el.classList.add('bubble-hidden');
        }
        if (item.tremble && !item.hidden) {
          el.classList.add('bubble-tremble');
        }
        el.dataset.textJson = JSON.stringify(item.text);
        if (item.tremble && !item.hidden) {
          el.innerHTML = '<div class="bubble-tremble-inner">' + buildBubbleContent(item.text) + '</div>';
        } else if (!item.hidden) {
          el.innerHTML = buildBubbleContent(item.text);
        }
        break;
      case 'narration':
        el.classList.add('bubble', 'pos-narration');
        el.dataset.target = '__narration__';
        if (item.hidden) {
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
    var allBubbles = visualContainer.querySelectorAll('.bubble');
    var bubblesByTarget = {};
    for (var i = 0; i < allBubbles.length; i++) {
      var t = allBubbles[i].dataset.target || '__none__';
      if (!bubblesByTarget[t]) bubblesByTarget[t] = [];
      bubblesByTarget[t].push(allBubbles[i]);
    }
    for (var key in bubblesByTarget) {
      var group = bubblesByTarget[key];
      for (var j = 0; j < group.length; j++) {
        if (group[j].classList.contains('bubble-hidden')) {
          group[j].classList.remove('show');
          group[j].classList.add('el-exit');
        } else if (j === group.length - 1) {
          group[j].classList.remove('el-exit');
          group[j].classList.add('show');
        } else {
          group[j].classList.remove('show');
          group[j].classList.add('el-exit');
        }
      }
    }

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
      });
    } else {
      allSteps.push({
        scene: scene,
        elements: [],
        isShort: false,
      });
      var accumulated = [];
      seq.forEach(function(item) {
        accumulated.push(item);
        allSteps.push({
          scene: scene,
          elements: accumulated.slice(),
          isShort: false,
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

    step.elements.forEach(function(item) {
      var elDom = buildElement(item);
      if (step.isShort) {
        elDom.classList.add('show');
        elDom.classList.add('always-on');
      } else if (skipTransition) {
        elDom.classList.add('show');
      }
      visualContainer.appendChild(elDom);
    });

    resolveElementVisibility();

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

    var newItems = newStep.elements.slice(oldStep.elements.length);
    newItems.forEach(function(item) {
      var elDom = buildElement(item);
      visualContainer.appendChild(elDom);
      void elDom.offsetWidth;
      elDom.classList.add('show');
    });

    resolveElementVisibility();

    if (newStepIndex < currentStep) {
      var allEls = visualContainer.querySelectorAll('.el');
      var keepCount = newStep.elements.length;
      for (var i = allEls.length - 1; i >= keepCount; i--) {
        allEls[i].remove();
      }
      resolveElementVisibility();
    }

    currentStep = newStepIndex;
  }

  // ========================================
  // SCROLL HANDLER
  // ========================================
  function handleScroll(direction) {
    if (isTransitioning || cooldown) return;

    var nextStep = currentStep + (direction > 0 ? 1 : -1);
    if (nextStep < 0 || nextStep >= allSteps.length) return;

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
