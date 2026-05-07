/**
 * editor-explorer.js
 * =============================================
 * EXPLORADOR DE RECURSOS - Panel de recursos disponibles del proyecto
 * 
 * Este archivo controla:
 * - refreshExplorer() - Actualiza las carpetas de recursos
 * - renderFolder() - Renderiza cada carpeta (characters, backgrounds, objects)
 * - addCharacter() - Agregar personaje al proyecto
 * - addBackground() - Agregar fondo al proyecto
 * - addObject() - Agregar objeto al proyecto
 * - deleteResource() - Eliminar recurso
 * - Mostrar miniaturas de imágenes disponibles
 * 
 * Recursos del proyecto (S.currentProject.resources):
 * - characters: Array de personajes {id, name, src, ...}
 * - backgrounds: Array de fondos {id, name, src, ...}
 * - objects: Array de objetos {id, name, src, ...}
 */

(function() {
  'use strict';

  var E = window.__editor;
  var S = E.state;

  /**
   * Actualiza todas las carpetas de recursos del explorador
   * Muestra los recursos disponibles en el proyecto actual
   */
  function refreshExplorer() {
    if (!S.currentProject || !S.currentProject.resources) return;
    renderFolder('characters', S.currentProject.resources.characters || [], buildCharItemHTML);
    renderFolder('backgrounds', S.currentProject.resources.backgrounds || [], buildBgItemHTML);
    renderFolder('objects', S.currentProject.resources.objects || [], buildObjItemHTML);
    setTimeout(E.renderer.resolveImageSrc, 100);
  }

  function renderFolder(type, items, buildItem) {
    var container = document.getElementById('folder-content-' + type);
    if (!container) return;
    var html = '';
    items.forEach(function(item, idx) {
      item._idx = idx;
      html += buildItem(item, idx);
    });
    container.innerHTML = html;

    container.querySelectorAll('.resource-item').forEach(function(el) {
      el.addEventListener('click', function(e) {
        if (e.target.closest('.item-delete') || e.target.closest('.item-rename')) return;
        E.actions.addToScene(el.dataset.type, parseInt(el.dataset.idx));
      });
    });
    container.querySelectorAll('.item-delete').forEach(function(el) {
      el.addEventListener('click', function() {
        deleteResource(el.dataset.type, parseInt(el.dataset.idx));
      });
    });
    container.querySelectorAll('.item-rename').forEach(function(el) {
      el.addEventListener('click', function() {
        showRenameModal(el.dataset.type, parseInt(el.dataset.idx));
      });
    });
  }

  function buildCharItemHTML(item) {
    return (
      '<div class="resource-item" data-type="characters" data-idx="' + item._idx + '">' +
        '<img class="resource-thumb" src="images/' + item.image + '" alt="' + item.name + '" onerror="this.src=\'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2232%22 height=%2232%22><rect fill=%22%23333%22 width=%2232%22 height=%2232%22/><text x=%2216%22 y=%2220%22 text-anchor=%22middle%22 fill=%22%23999%22 font-size=%2210%22>?</text></svg>\'">' +
        '<span class="resource-name" title="' + item.name + '">' + E.truncate(item.name, 16) + '</span>' +
        '<button class="item-rename" data-type="characters" data-idx="' + item._idx + '" title="Renombrar">\u270E</button>' +
        '<button class="item-delete" data-type="characters" data-idx="' + item._idx + '" title="Eliminar">\u2715</button>' +
      '</div>'
    );
  }

  function buildBgItemHTML(item) {
    return (
      '<div class="resource-item" data-type="backgrounds" data-idx="' + item._idx + '">' +
        '<img class="resource-thumb" src="images/' + item.file + '" alt="' + item.id + '" onerror="this.src=\'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2232%22 height=%2232%22><rect fill=%22%23333%22 width=%2232%22 height=%2232%22/><text x=%2216%22 y=%2220%22 text-anchor=%22middle%22 fill=%22%23999%22 font-size=%2210%22>?</text></svg>\'">' +
        '<span class="resource-name" title="' + item.id + '">' + E.truncate(item.id, 16) + '</span>' +
        '<button class="item-rename" data-type="backgrounds" data-idx="' + item._idx + '" title="Renombrar">\u270E</button>' +
        '<button class="item-delete" data-type="backgrounds" data-idx="' + item._idx + '" title="Eliminar">\u2715</button>' +
      '</div>'
    );
  }

  function buildObjItemHTML(item) {
    return (
      '<div class="resource-item" data-type="objects" data-idx="' + item._idx + '">' +
        '<img class="resource-thumb" src="images/' + item.file + '" alt="' + item.name + '" onerror="this.src=\'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2232%22 height=%2232%22><rect fill=%22%23333%22 width=%2232%22 height=%2232%22/><text x=%2216%22 y=%2220%22 text-anchor=%22middle%22 fill=%22%23999%22 font-size=%2210%22>?</text></svg>\'">' +
        '<span class="resource-name" title="' + item.name + '">' + E.truncate(item.name, 16) + '</span>' +
        '<button class="item-rename" data-type="objects" data-idx="' + item._idx + '" title="Renombrar">\u270E</button>' +
        '<button class="item-delete" data-type="objects" data-idx="' + item._idx + '" title="Eliminar">\u2715</button>' +
      '</div>'
    );
  }

  function deleteResource(type, idx) {
    if (!S.currentProject) return;
    var resources = S.currentProject.resources[type];
    if (!resources || !resources[idx]) return;
    E.modal.showConfirmModal(
      'Eliminar recurso',
      '\u00BFEst\u00E1s seguro de eliminar "' + resources[idx].name + '"?',
      function() {
        resources.splice(idx, 1);
        S.hasUnsavedChanges = true;
        refreshExplorer();
        E.showToast('Recurso eliminado');
      }
    );
  }

  function showRenameModal(type, idx) {
    var resources = S.currentProject.resources[type];
    var item = resources[idx];
    if (!item) return;
    var currentName = item.name || item.id;
    E.modal.showModal('Renombrar',
      '<div class="modal-field">' +
        '<label>Nombre actual: ' + currentName + '</label>' +
        '<input type="text" id="modal-rename-input" value="' + currentName + '">' +
      '</div>',
      function() {
        var newName = document.getElementById('modal-rename-input').value.trim();
        if (!newName) { E.showToast('Ingres\u00E1 un nombre', 'error'); return; }
        item.name = newName;
        if (type === 'characters') item.id = newName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
        S.hasUnsavedChanges = true;
        refreshExplorer();
        E.showToast('Recurso renombrado');
      }
    );
  }

  function showAddCharacterModal() {
    E.modal.showModal('Nuevo Personaje',
      '<div class="modal-field">' +
        '<label>Nombre</label>' +
        '<input type="text" id="modal-char-name" placeholder="\u4F8B: \u30E6\u30AD (Yuki)">' +
      '</div>' +
      '<div class="modal-field">' +
        '<label>Imagen</label>' +
        '<input type="file" id="modal-char-file" accept="image/*">' +
      '</div>',
      function() {
        var name = document.getElementById('modal-char-name').value.trim();
        if (!name) { E.showToast('Ingres\u00E1 un nombre', 'error'); return; }
        var fileInput = document.getElementById('modal-char-file');
        function finalize(filename) {
          var id = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
          if (!S.currentProject.resources.characters) S.currentProject.resources.characters = [];
          S.currentProject.resources.characters.push({ id: id, name: name, image: filename, custom: true });
          S.hasUnsavedChanges = true;
          refreshExplorer();
          E.showToast('Personaje "' + name + '" creado');
        }
        if (fileInput.files && fileInput.files[0]) {
          var file = fileInput.files[0];
          var filename = 'custom-' + Date.now() + '-' + file.name.replace(/[^a-zA-Z0-9._-]/g, '');
          VNStorage.saveImage(filename, file).then(function() { finalize(filename); });
        } else {
          finalize('placeholder.png');
        }
      }
    );
  }

  function showAddBackgroundModal() {
    E.modal.showModal('Nuevo Fondo',
      '<div class="modal-field">' +
        '<label>Nombre</label>' +
        '<input type="text" id="modal-bg-name" placeholder="Mi fondo">' +
      '</div>' +
      '<div class="modal-field">' +
        '<label>Imagen</label>' +
        '<input type="file" id="modal-bg-file" accept="image/*">' +
      '</div>',
      function() {
        var name = document.getElementById('modal-bg-name').value.trim();
        var fileInput = document.getElementById('modal-bg-file');
        if (!name) { E.showToast('Ingres\u00E1 un nombre', 'error'); return; }
        if (fileInput.files && fileInput.files[0]) {
          var file = fileInput.files[0];
          var filename = 'custom-bg-' + Date.now() + '-' + file.name.replace(/[^a-zA-Z0-9._-]/g, '');
          VNStorage.saveImage(filename, file).then(function() {
            var id = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
            if (!S.currentProject.resources.backgrounds) S.currentProject.resources.backgrounds = [];
            S.currentProject.resources.backgrounds.push({ id: id, file: filename, custom: true });
            S.hasUnsavedChanges = true;
            refreshExplorer();
            E.showToast('Fondo "' + name + '" creado');
          });
        } else {
          E.showToast('Seleccion\u00E1 una imagen', 'error');
        }
      }
    );
  }

  function showAddObjectModal() {
    E.modal.showModal('Nuevo Objeto',
      '<div class="modal-field">' +
        '<label>Nombre</label>' +
        '<input type="text" id="modal-obj-name" placeholder="Sombrero, etc.">' +
      '</div>' +
      '<div class="modal-field">' +
        '<label>Imagen</label>' +
        '<input type="file" id="modal-obj-file" accept="image/*">' +
      '</div>',
      function() {
        var name = document.getElementById('modal-obj-name').value.trim();
        var fileInput = document.getElementById('modal-obj-file');
        if (!name) { E.showToast('Ingres\u00E1 un nombre', 'error'); return; }
        if (fileInput.files && fileInput.files[0]) {
          var file = fileInput.files[0];
          var filename = 'custom-obj-' + Date.now() + '-' + file.name.replace(/[^a-zA-Z0-9._-]/g, '');
          VNStorage.saveImage(filename, file).then(function() {
            var id = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
            if (!S.currentProject.resources.objects) S.currentProject.resources.objects = [];
            S.currentProject.resources.objects.push({ id: id, name: name, file: filename, custom: true });
            S.hasUnsavedChanges = true;
            refreshExplorer();
            E.showToast('Objeto "' + name + '" creado');
          });
        } else {
          E.showToast('Seleccion\u00E1 una imagen', 'error');
        }
      }
    );
  }

  function buildFolderHTML(type, label, className, locked) {
    var lockedHTML = locked
      ? '<div class="folder-locked">\uD83D\uDD12 Pr\u00F3ximamente</div>'
      : '<button class="folder-add-btn" data-type="' + type + '" title="Agregar">+</button>';
    return (
      '<div class="folder ' + className + '" data-folder="' + type + '">' +
        '<div class="folder-header">' +
          '<span class="folder-toggle">' + label + '</span>' +
          lockedHTML +
        '</div>' +
        '<div class="folder-content" id="folder-content-' + type + '"></div>' +
      '</div>'
    );
  }

  E.explorer = E.explorer || {};
  E.explorer.refreshExplorer = refreshExplorer;
  E.explorer.showAddCharacterModal = showAddCharacterModal;
  E.explorer.showAddBackgroundModal = showAddBackgroundModal;
  E.explorer.showAddObjectModal = showAddObjectModal;
  E.explorer.showRenameModal = showRenameModal;
  E.explorer.buildFolderHTML = buildFolderHTML;
})();
