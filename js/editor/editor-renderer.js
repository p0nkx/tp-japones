/**
 * editor-renderer.js
 * =============================================
 * RENDERIZADO DE ESCENA - Dibuja los elementos en pantalla
 * 
 * Este archivo controla:
 * - renderSceneUpToStep() - Renderiza la escena hasta un paso específico
 * - buildEditorElement() - Crea el elemento DOM para cada tipo (char, bubble, etc.)
 * - updateBackground() - Actualiza el fondo de la escena
 * - showAfter/disappearAfter - Lógica para mostrar/ocultar elementos tras X scrolls
 * 
 * Tipos de elementos disponibles:
 * - character: Personaje con imagen
 * - bubble: Burbuja de diálogo con cola posicionable
 * - narration: Narración (burbuja especial)
 * - object: Objeto decorativo
 * - title, subtitle, names: Elementos de texto
 * - logo, closing-title, closing-logo: Elementos de portada/final
 * 
 * Propiedades disponibles (para usar en el código):
 * - position: {left, top, width, height} - Posición y tamaño
 * - hidden: boolean - Ocultar manualmente
 * - tremble: boolean - Animación de temblor
 * - disappearAfter: number - Ocultar tras X pasos
 * - showAfter: number - Mostrar tras X pasos
 * - tailPosition: {left, top, at} - Posición de la colita de burbuja
 */

(function() {
  'use strict';

  var E = window.__editor;
  var S = E.state;

  /**
   * Renderiza la escena mostrando elementos hasta el paso especificado
   * stepIdx: número de paso hasta el cual renderizar (0-based)
   * Aplica lógica de showAfter/disappearAfter para mostrar/ocultar elementos
   */
  function renderSceneUpToStep(stepIdx) {
    if (!S.currentProject) return;
    var scene = S.currentProject.scenes[S.currentSceneIndex];
    if (!scene || !scene.sequence) return;

    var visual = document.querySelector('.scene-visual');
    if (!visual) return;

    visual.innerHTML = '';
    visual.classList.remove('layout-center');

    var bgEl = document.querySelector('.bg-layer');
    if (bgEl && scene.background) updateBackground(bgEl, scene.background);

    var seq = scene.sequence.slice(0, stepIdx + 1);
    resolvePositionsForSceneWithSeq(seq);

    seq.forEach(function(item, idx) {
      var stepsSinceAppeared = stepIdx - idx;
      
      var isHidden = item.hidden || false;
      
      if (item.disappearAfter && stepsSinceAppeared >= item.disappearAfter) {
        isHidden = true;
      }
      
      if (item.showAfter && stepsSinceAppeared >= item.showAfter) {
        isHidden = false;
      }
      
      var el = buildEditorElement(item, idx, isHidden);
      if (el) {
        if (isHidden) {
          el.classList.add('char-hidden');
          console.log('  -> Renderizado como oculto (editor):', item.type, idx);
        } else {
          el.classList.add('show', 'editable');
        }
        el.dataset.elIndex = idx;
        visual.appendChild(el);
      }
    });

    applyBubbleVisibility(visual, seq);
    setTimeout(resolveImageSrc, 50);
  }

  function updateBackground(bgEl, bg) {
    bgEl.innerHTML = '';
    if (bg.type === 'full') {
      if (bg.color) bgEl.style.background = bg.color;
      else if (bg.image) bgEl.style.background = 'url("images/' + bg.image + '") center/cover no-repeat';
    }
    if (bg.nightmare) bgEl.classList.add('bg-nightmare');
    else bgEl.classList.remove('bg-nightmare');
  }

  function buildEditorElement(item, idx, isHidden) {
    var el = document.createElement('div');
    el.className = 'el';
    el.dataset.elType = item.type;
    el.dataset.elIndex = idx;

    // Use parameter isHidden if provided, otherwise check item.hidden
    var hidden = (isHidden !== undefined ? isHidden : item.hidden) || false;

    switch (item.type) {
      case 'character':
        if (hidden) {
          el.classList.add('char-hidden');
          el.dataset.charId = item.id || '';
        } else {
          el.classList.add('char');
          el.dataset.charId = item.id || '';
          if (item.silhouette) el.classList.add('char-silhouette');
          if (item.position && item.position.left) {
            el.style.left = item.position.left;
            el.style.top = item.position.top;
            if (item.position.width) el.style.width = item.position.width;
            if (item.position.height) el.style.height = item.position.height;
          }
        }
        var cImg = document.createElement('img');
        cImg.className = 'char-img';
        cImg.src = 'images/' + item.file;
        cImg.onerror = function() { this.style.display = 'none'; };
        el.appendChild(cImg);
        break;

      case 'object':
        if (hidden) {
          el.classList.add('char-hidden');
          el.dataset.objId = item.id || '';
        } else {
          el.classList.add('scene-object');
          el.dataset.objId = item.id || '';
          if (item.position && item.position.left) {
            el.style.left = item.position.left;
            el.style.top = item.position.top;
            if (item.position.width) el.style.width = item.position.width;
            if (item.position.height) el.style.height = item.position.height;
          }
        }
        var oImg = document.createElement('img');
        oImg.className = 'obj-img';
        oImg.src = 'images/' + item.file;
        oImg.onerror = function() { this.style.display = 'none'; };
        el.appendChild(oImg);
        break;

      case 'bubble':
        el.classList.add('bubble');
        el.dataset.target = item.target || '';
        if (hidden) {
          el.classList.add('bubble-hidden');
        }
        if (item.tremble && !hidden) el.classList.add('bubble-tremble');
        if (item.position && item.position.left) {
          el.style.left = item.position.left;
          el.style.top = item.position.top;
          if (item.position.width) el.style.width = item.position.width;
          if (item.position.height) el.style.height = item.position.height;
        } else if (!hidden) {
          el.style.left = '30%';
          el.style.top = '8%';
        }
        // Apply custom tail position if exists
        if (item.tailPosition) {
          el.style.setProperty('--tail-left', item.tailPosition.left + '%');
          el.style.setProperty('--tail-top', item.tailPosition.top + '%');
          el.classList.add('pos-custom');
          // Apply tail direction
          if (item.tailPosition.at) {
            el.dataset.tailAt = item.tailPosition.at;
          }
        }
        el.dataset.textJson = JSON.stringify(item.text || {});
        if (item.tremble && !hidden) {
          el.innerHTML = '<div class="bubble-tremble-inner">' + buildBubbleHTML(item.text) + '</div>';
        } else if (!hidden) {
          el.innerHTML = buildBubbleHTML(item.text);
        }
        break;

      case 'narration':
        el.classList.add('bubble', 'pos-narration');
        el.dataset.target = '__narration__';
        if (hidden) {
          el.classList.add('bubble-hidden');
        }
        el.dataset.textJson = JSON.stringify(item.text || {});
        if (!hidden) {
          el.innerHTML = buildBubbleHTML(item.text);
        }
        if (item.position && item.position.left) {
          el.style.left = item.position.left;
          el.style.top = item.position.top;
          if (item.position.width) el.style.width = item.position.width;
          if (item.position.height) el.style.height = item.position.height;
        }
        break;

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
        var lImg = document.createElement('img');
        lImg.src = 'images/' + item.file;
        el.appendChild(lImg);
        break;
      case 'scroll-hint':
        el.classList.add('el-scroll-hint');
        el.textContent = item.text;
        break;
      case 'closing-title':
        el.classList.add('el-ctitle');
        el.textContent = item.text;
        break;
      case 'closing-logo':
        el.classList.add('el-clogo');
        var clImg = document.createElement('img');
        clImg.src = 'images/' + item.file;
        el.appendChild(clImg);
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
        el.innerHTML = item.text + '<img class="footer-logo" src="images/' + item.logo + '" />';
        break;
    }

    return el;
  }

  function buildBubbleHTML(text) {
    if (!text) return '';
    var mode = window.__bubbleMode || 2;
    var html = '<div class="bubble-jp">' + (text.jp || '') + '</div>';
    if ((mode === 2 || mode === 4) && text.en) html += '<div class="bubble-en">' + text.en + '</div>';
    if ((mode === 3 || mode === 4) && text.es) html += '<div class="bubble-es">' + text.es + '</div>';
    return html;
  }

  function applyBubbleVisibility(container, seq) {
    var bubblesByTarget = {};
    var allBubbles = container.querySelectorAll('.bubble:not(.bubble-hidden)');
    for (var i = 0; i < allBubbles.length; i++) {
      var t = allBubbles[i].dataset.target || '__none__';
      if (!bubblesByTarget[t]) bubblesByTarget[t] = [];
      bubblesByTarget[t].push(allBubbles[i]);
    }
    for (var key in bubblesByTarget) {
      var group = bubblesByTarget[key];
      for (var j = 0; j < group.length; j++) {
        if (j === group.length - 1) group[j].classList.add('show');
        else group[j].classList.remove('show');
      }
    }

    var charsById = {};
    var allChars = container.querySelectorAll('.char:not(.char-hidden)');
    for (var k = 0; k < allChars.length; k++) {
      var c = allChars[k].dataset.charId || '__none__';
      if (!charsById[c]) charsById[c] = [];
      charsById[c].push(allChars[k]);
    }
    for (var key2 in charsById) {
      var group2 = charsById[key2];
      for (var m = 0; m < group2.length; m++) {
        if (m === group2.length - 1) group2[m].classList.add('show');
        else group2[m].classList.remove('show');
      }
    }
  }

  function resolvePositionsForSceneWithSeq(seq) {
    seq.forEach(function(item) {
      if (item.positionType && !item.position) {
        var isBubble = item.type === 'bubble' || item.type === 'narration';
        var resolved = VNStorage.resolvePosition(item.positionType, isBubble ? 'bubble' : 'character');
        if (resolved && resolved.left) item.position = resolved;
      }
    });
  }

  function clearScene() {
    var container = document.querySelector('.scene-visual');
    if (container) container.innerHTML = '';
  }

  function resolveImageSrc() {
    var chars = document.querySelectorAll('.char');
    var objs = document.querySelectorAll('.scene-object');
    var allImgs = [];
    chars.forEach(function(c) { var img = c.querySelector('img'); if (img) allImgs.push(img); });
    objs.forEach(function(o) { var img = o.querySelector('img'); if (img) allImgs.push(img); });

    allImgs.forEach(function(img) {
      var src = img.src;
      var filename = src.replace(/.*\//, '');
      if (filename.indexOf('custom-') === 0 || filename.indexOf('placeholder') === 0) {
        VNStorage.getImage(filename).then(function(blob) {
          if (blob) { var url = URL.createObjectURL(blob); img.src = url; }
        });
      }
    });

    var thumbs = document.querySelectorAll('.resource-thumb');
    thumbs.forEach(function(img) {
      var src = img.getAttribute('src');
      if (!src) return;
      var filename = src.replace('images/', '');
      if (filename.indexOf('custom-') === 0) {
        VNStorage.getImage(filename).then(function(blob) {
          if (blob) { img.src = URL.createObjectURL(blob); }
        });
      }
    });
  }

  E.renderer = E.renderer || {};
  E.renderer.renderSceneUpToStep = renderSceneUpToStep;
  E.renderer.updateBackground = updateBackground;
  E.renderer.buildEditorElement = buildEditorElement;
  E.renderer.buildBubbleHTML = buildBubbleHTML;
  E.renderer.applyBubbleVisibility = applyBubbleVisibility;
  E.renderer.resolvePositionsForSceneWithSeq = resolvePositionsForSceneWithSeq;
  E.renderer.clearScene = clearScene;
  E.renderer.resolveImageSrc = resolveImageSrc;
})();
