(function() {
  'use strict';

  var E = window.__editor;

  function showModal(title, bodyHTML, onConfirm) {
    removeModals();

    var overlay = document.createElement('div');
    overlay.className = 'editor-modal-overlay';
    overlay.id = 'active-modal';

    var modal = document.createElement('div');
    modal.className = 'editor-modal';
    modal.innerHTML = (
      '<div class="modal-header">' +
        '<span class="modal-title">' + title + '</span>' +
        '<button class="modal-close" id="modal-close">\u2715</button>' +
      '</div>' +
      '<div class="modal-body">' + bodyHTML + '</div>' +
      '<div class="modal-footer">' +
        '<button class="editor-btn" id="modal-cancel">Cancelar</button>' +
        '<button class="editor-btn primary" id="modal-confirm">Confirmar</button>' +
      '</div>'
    );

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    document.getElementById('modal-close').addEventListener('click', removeModals);
    document.getElementById('modal-cancel').addEventListener('click', removeModals);
    document.getElementById('modal-confirm').addEventListener('click', function() {
      if (onConfirm) onConfirm();
      removeModals();
    });
  }

  function showConfirmModal(title, message, onConfirm, onCancel) {
    showModal(title, '<p class="modal-message">' + message + '</p>', onConfirm);
    if (onCancel) {
      document.getElementById('modal-cancel').addEventListener('click', onCancel);
    }
  }

  function removeModals() {
    var existing = document.getElementById('active-modal');
    if (existing) existing.remove();
  }

  E.modal = E.modal || {};
  E.modal.showModal = showModal;
  E.modal.showConfirmModal = showConfirmModal;
  E.modal.removeModals = removeModals;
})();
