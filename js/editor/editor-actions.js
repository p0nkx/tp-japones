(function() {
  'use strict';

  var E = window.__editor;
  var S = E.state;

  function addToScene(type, idx) {
    if (!S.currentProject) return;
    var scene = S.currentProject.scenes[S.currentSceneIndex];
    if (!scene) return;

    var item;
    if (type === 'characters') {
      var chars = S.currentProject.resources.characters || [];
      item = chars[idx];
      if (!item) return;
      scene.sequence.push({
        type: 'character', id: item.id, file: item.image,
        positionType: 'center',
        position: { left: '35%', top: '20%', width: '30%', height: '70%' },
        hidden: false
      });
    } else if (type === 'backgrounds') {
      var bgs = S.currentProject.resources.backgrounds || [];
      item = bgs[idx];
      if (!item) return;
      scene.background = { type: 'full', image: item.file };
      S.currentVisibleSteps = scene.sequence.length - 1;
      if (S.currentVisibleSteps < 0) S.currentVisibleSteps = 0;
      E.renderer.renderSceneUpToStep(S.currentVisibleSteps);
      E.renderer.resolveImageSrc();
      E.showToast('Fondo cambiado');
      return;
    } else if (type === 'objects') {
      var objs = S.currentProject.resources.objects || [];
      item = objs[idx];
      if (!item) return;
      scene.sequence.push({
        type: 'object', id: item.id, file: item.file,
        positionType: 'center',
        position: { left: '40%', top: '30%', width: '15%', height: 'auto' },
        hidden: false
      });
    }

    S.hasUnsavedChanges = true;
    S.currentVisibleSteps = scene.sequence.length - 1;
    E.renderer.renderSceneUpToStep(S.currentVisibleSteps);
    E.timeline.refreshStepsTimeline();
    E.renderer.resolveImageSrc();
    E.showToast((type === 'characters' ? 'Personaje' : 'Objeto') + ' agregado a la escena');
  }

  function addBubbleToScene() {
    if (!S.currentProject) return;
    var scene = S.currentProject.scenes[S.currentSceneIndex];
    if (!scene) return;
    var chars = S.currentProject.resources.characters || [];
    var charOptions = chars.map(function(c) {
      return '<option value="' + c.id + '">' + c.name + '</option>';
    }).join('');

    E.modal.showModal('Agregar Di\u00E1logo',
      '<div class="modal-field">' +
        '<label>Personaje</label>' +
        '<select id="bubble-target" class="editor-select">' +
          '<option value="">\u2014 Seleccionar \u2014</option>' + charOptions +
        '</select>' +
      '</div>' +
      '<div class="modal-field">' +
        '<label>\u65E5\u672C\u8A9E (Japanese)</label>' +
        '<textarea id="bubble-jp" rows="2" placeholder="\u30C6\u30AD\u30B9\u30C8"></textarea>' +
      '</div>' +
      '<div class="modal-field">' +
        '<label>English</label>' +
        '<textarea id="bubble-en" rows="2" placeholder="Text"></textarea>' +
      '</div>' +
      '<div class="modal-field">' +
        '<label>Espa\u00F1ol</label>' +
        '<textarea id="bubble-es" rows="2" placeholder="Texto"></textarea>' +
      '</div>',
      function() {
        var target = document.getElementById('bubble-target').value;
        if (!target) { E.showToast('Seleccion\u00E1 un personaje', 'error'); return; }
        scene.sequence.push({
          type: 'bubble', target: target,
          text: { jp: document.getElementById('bubble-jp').value, en: document.getElementById('bubble-en').value, es: document.getElementById('bubble-es').value },
          positionType: 'center', position: { left: '30%', top: '8%' }, hidden: false
        });
        S.hasUnsavedChanges = true;
        S.currentVisibleSteps = scene.sequence.length - 1;
        E.renderer.renderSceneUpToStep(S.currentVisibleSteps);
        E.timeline.refreshStepsTimeline();
        E.showToast('Di\u00E1logo agregado');
      }
    );
  }

  function addNarrationToScene() {
    if (!S.currentProject) return;
    var scene = S.currentProject.scenes[S.currentSceneIndex];
    if (!scene) return;

    E.modal.showModal('Agregar Narraci\u00F3n',
      '<div class="modal-field">' +
        '<label>\u65E5\u672C\u8A9E (Japanese)</label>' +
        '<textarea id="narration-jp" rows="2" placeholder="\u30C6\u30AD\u30B9\u30C8"></textarea>' +
      '</div>' +
      '<div class="modal-field">' +
        '<label>English</label>' +
        '<textarea id="narration-en" rows="2" placeholder="Text"></textarea>' +
      '</div>' +
      '<div class="modal-field">' +
        '<label>Espa\u00F1ol</label>' +
        '<textarea id="narration-es" rows="2" placeholder="Texto"></textarea>' +
      '</div>',
      function() {
        scene.sequence.push({
          type: 'narration',
          text: { jp: document.getElementById('narration-jp').value, en: document.getElementById('narration-en').value, es: document.getElementById('narration-es').value },
          position: { left: '20%', top: '40%', width: '60%', height: '20%' },
          hidden: false
        });
        S.hasUnsavedChanges = true;
        S.currentVisibleSteps = scene.sequence.length - 1;
        E.renderer.renderSceneUpToStep(S.currentVisibleSteps);
        E.timeline.refreshStepsTimeline();
        E.showToast('Narraci\u00F3n agregada');
      }
    );
  }

  function showAddStepModal(afterIdx) {
    if (!S.currentProject) return;
    var scene = S.currentProject.scenes[S.currentSceneIndex];
    if (!scene) return;
    var chars = S.currentProject.resources.characters || [];
    var charOptions = chars.map(function(c) {
      return '<option value="' + c.id + '">' + c.name + '</option>';
    }).join('');

    E.modal.showModal('Insertar Paso (despu\u00E9s del paso ' + (afterIdx + 1) + ')',
      '<div class="modal-field">' +
        '<label>Tipo</label>' +
        '<select id="insert-type" class="editor-select">' +
          '<option value="character">\uD83D\uDC64 Personaje</option>' +
          '<option value="bubble">\uD83D\uDCAC Di\u00E1logo</option>' +
          '<option value="narration">\uD83D\uDCD6 Narraci\u00F3n</option>' +
          '<option value="object">\uD83C\uDFAD Objeto</option>' +
        '</select>' +
      '</div>' +
      '<div class="modal-field" id="insert-char-select">' +
        '<label>Personaje</label>' +
        '<select id="insert-target" class="editor-select">' +
          '<option value="">\u2014 Seleccionar \u2014</option>' + charOptions +
        '</select>' +
      '</div>' +
      '<div class="modal-field" id="insert-text-jp" style="display:none;">' +
        '<label>\u65E5\u672C\u8A9E (Japanese)</label>' +
        '<textarea id="insert-jp" rows="2" placeholder="\u30C6\u30AD\u30B9\u30C8"></textarea>' +
      '</div>' +
      '<div class="modal-field" id="insert-text-en" style="display:none;">' +
        '<label>English</label>' +
        '<textarea id="insert-en" rows="2" placeholder="Text"></textarea>' +
      '</div>' +
      '<div class="modal-field" id="insert-text-es" style="display:none;">' +
        '<label>Espa\u00F1ol</label>' +
        '<textarea id="insert-es" rows="2" placeholder="Texto"></textarea>' +
      '</div>',
      function() {
        var type = document.getElementById('insert-type').value;
        var newItem = { hidden: false };

        if (type === 'character') {
          var target = document.getElementById('insert-target').value;
          if (!target) { E.showToast('Seleccion\u00E1 un personaje', 'error'); return; }
          var char = chars.find(function(c) { return c.id === target; });
          if (!char) return;
          newItem.type = 'character'; newItem.id = char.id; newItem.file = char.image;
          newItem.positionType = 'center';
          newItem.position = { left: '35%', top: '20%', width: '30%', height: '70%' };
        } else if (type === 'bubble') {
          var target2 = document.getElementById('insert-target').value;
          if (!target2) { E.showToast('Seleccion\u00E1 un personaje', 'error'); return; }
          newItem.type = 'bubble'; newItem.target = target2;
          newItem.text = { jp: document.getElementById('insert-jp').value, en: document.getElementById('insert-en').value, es: document.getElementById('insert-es').value };
          newItem.positionType = 'center'; newItem.position = { left: '30%', top: '8%' };
        } else if (type === 'narration') {
          newItem.type = 'narration';
          newItem.text = { jp: document.getElementById('insert-jp').value, en: document.getElementById('insert-en').value, es: document.getElementById('insert-es').value };
        } else if (type === 'object') {
          var objs = S.currentProject.resources.objects || [];
          if (objs.length === 0) { E.showToast('No hay objetos disponibles', 'error'); return; }
          newItem.type = 'object'; newItem.id = objs[0].id; newItem.file = objs[0].file;
          newItem.positionType = 'center';
          newItem.position = { left: '40%', top: '30%', width: '15%', height: 'auto' };
        }

        scene.sequence.splice(afterIdx + 1, 0, newItem);
        S.hasUnsavedChanges = true;
        S.currentVisibleSteps = afterIdx + 1;
        E.renderer.renderSceneUpToStep(S.currentVisibleSteps);
        E.timeline.refreshStepsTimeline();
        E.showToast('Paso insertado');
      }
    );

    var typeSelect = document.getElementById('insert-type');
    function updateFields() {
      var t = typeSelect.value;
      document.getElementById('insert-char-select').style.display = (t === 'character' || t === 'bubble') ? '' : 'none';
      document.getElementById('insert-text-jp').style.display = (t === 'bubble' || t === 'narration') ? '' : 'none';
      document.getElementById('insert-text-en').style.display = (t === 'bubble' || t === 'narration') ? '' : 'none';
      document.getElementById('insert-text-es').style.display = (t === 'bubble' || t === 'narration') ? '' : 'none';
    }
    typeSelect.addEventListener('change', updateFields);
  }

  E.actions = E.actions || {};
  E.actions.addToScene = addToScene;
  E.actions.addBubbleToScene = addBubbleToScene;
  E.actions.addNarrationToScene = addNarrationToScene;
  E.actions.showAddStepModal = showAddStepModal;
})();
