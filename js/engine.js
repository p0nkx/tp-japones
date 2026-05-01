(function() {
  var app = document.getElementById('app');
  var IMG = 'images/';
  var allSteps = [];
  var currentStep = 0;
  var isTransitioning = false;
  var cooldown = false;

  var screenEl, bgContainer, visualContainer;

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
        // bg-second = capa inferior (se renderiza primero)
        layer.appendChild(buildBgPanel(bg.bottom, 'bg-second'));
        // bg-first = capa superior recortada (se renderiza encima)
        layer.appendChild(buildBgPanel(bg.top, 'bg-first'));
        break;
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
      // Bubble types: bubble, bubble-split, bubble-diag → all map to 'bubble'
      // Position comes from the target character's position
      if (el.type.indexOf('bubble') === 0 && el.target) {
        el.bubblePos = charMap[el.target] || 'center';
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
      case 'scroll-hint':
        el.classList.add('el-scroll-hint');
        el.textContent = item.text;
        break;
      case 'character':
        el.classList.add('char', 'pos-' + item.position);
        el.dataset.charId = item.id || '';
        el.appendChild(createImg(item.file));
        break;
      // All bubble types → unified 'bubble' class
      case 'bubble':
      case 'bubble-split':
      case 'bubble-diag':
        el.classList.add('bubble');
        el.classList.add('pos-' + (item.bubblePos || 'center'));
        el.innerHTML = '<div class="bubble-jp">' + item.text.jp + '</div><div class="bubble-en">' + item.text.en + '</div>';
        break;
      case 'closing-title':
        el.classList.add('el-ctitle');
        el.textContent = item.text;
        break;
      case 'closing-sub':
        el.classList.add('el-csub');
        el.textContent = item.text;
        break;
      case 'closing-names':
        el.classList.add('el-cnames');
        el.textContent = item.text;
        break;
      case 'closing-class':
        el.classList.add('el-cclass');
        el.textContent = item.text;
        break;
    }
    return el;
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

    screenEl = document.createElement('div');
    screenEl.className = 'screen';

    bgContainer = document.createElement('div');
    bgContainer.className = 'scene-frame';

    visualContainer = document.createElement('div');
    visualContainer.className = 'scene-visual';

    bgContainer.appendChild(visualContainer);
    screenEl.appendChild(bgContainer);
    app.appendChild(screenEl);
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

    step.elements.forEach(function(item) {
      var elDom = buildElement(item);
      if (skipTransition) {
        elDom.classList.add('show');
      }
      visualContainer.appendChild(elDom);
    });

    if (!skipTransition && stepIndex > 0) {
      var prevStep = allSteps[stepIndex - 1];
      if (prevStep && prevStep.scene === step.scene) {
        var newElCount = step.elements.length - prevStep.elements.length;
        if (newElCount > 0) {
          var allEls = visualContainer.querySelectorAll('.el');
          for (var i = allEls.length - newElCount; i < allEls.length; i++) {
            var el = allEls[i];
            void el.offsetWidth;
            el.classList.add('show');
          }
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

    if (newStepIndex < currentStep) {
      var allEls = visualContainer.querySelectorAll('.el');
      var keepCount = newStep.elements.length;
      for (var i = allEls.length - 1; i >= keepCount; i--) {
        allEls[i].remove();
      }
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
