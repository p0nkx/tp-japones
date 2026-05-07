(function() {
  'use strict';

  var E = window.__editor;
  var S = E.state;

  function initBubbleEdit() {
    document.addEventListener('dblclick', function(e) {
      if (!S.editMode) return;
      var bubble = e.target.closest('.bubble.editable');
      if (!bubble) return;
      e.preventDefault();
      editBubbleText(bubble);
    });
  }

  function editBubbleText(bubble) {
    var textData = bubble.dataset.textJson;
    if (!textData) return;
    try {
      var text = JSON.parse(textData);
    } catch(e) { return; }

    var elIdx = parseInt(bubble.dataset.elIndex);
    var currentTextRef = null;
    if (S.currentProject && !isNaN(elIdx)) {
      var scene = S.currentProject.scenes[S.currentSceneIndex];
      if (scene && scene.sequence[elIdx]) currentTextRef = scene.sequence[elIdx].text;
    }

    E.modal.showModal('Editar Di\u00E1logo',
      '<div class="modal-field">' +
        '<label>\u65E5\u672C\u8A9E (Japanese)</label>' +
        '<textarea id="edit-bubble-jp" rows="2">' + E.escapeHtml(text.jp || '') + '</textarea>' +
      '</div>' +
      '<div class="modal-field">' +
        '<label>English</label>' +
        '<textarea id="edit-bubble-en" rows="2">' + E.escapeHtml(text.en || '') + '</textarea>' +
      '</div>' +
      '<div class="modal-field">' +
        '<label>Espa\u00F1ol</label>' +
        '<textarea id="edit-bubble-es" rows="2">' + E.escapeHtml(text.es || '') + '</textarea>' +
      '</div>',
      function() {
        var newJp = document.getElementById('edit-bubble-jp').value;
        var newEn = document.getElementById('edit-bubble-en').value;
        var newEs = document.getElementById('edit-bubble-es').value;
        var newText = { jp: newJp, en: newEn, es: newEs };

        if (currentTextRef) {
          currentTextRef.jp = newJp;
          currentTextRef.en = newEn;
          currentTextRef.es = newEs;
        }

        bubble.dataset.textJson = JSON.stringify(newText);
        if (bubble.classList.contains('bubble-tremble')) {
          bubble.innerHTML = '<div class="bubble-tremble-inner">' + buildBubbleContentFromText(newText) + '</div>';
        } else {
          bubble.innerHTML = buildBubbleContentFromText(newText);
        }
        S.hasUnsavedChanges = true;
        E.showToast('Di\u00E1logo actualizado');
      }
    );
  }

  function buildBubbleContentFromText(text) {
    var mode = window.__bubbleMode || 2;
    var html = '<div class="bubble-jp">' + (text.jp || '') + '</div>';
    if (mode === 2 || mode === 4) { if (text.en) html += '<div class="bubble-en">' + text.en + '</div>'; }
    if (mode === 3 || mode === 4) { if (text.es) html += '<div class="bubble-es">' + text.es + '</div>'; }
    return html;
  }

  E.bubble = E.bubble || {};
  E.bubble.initBubbleEdit = initBubbleEdit;
})();
