document.addEventListener('DOMContentLoaded', () => {
  const abrirBtn = document.getElementById('abrirDonacion');
  const modal = document.getElementById('popupDonacion');
  const cerrarBtn = modal.querySelector('.cerrar2');
  const modalContent = modal.querySelector('.modal-content');

  const abrirModal = () => {
    modal.style.display = 'flex';
    modalContent.classList.remove('cerrar-animacion');
    document.body.classList.add('modal-abierto');
  };

  const cerrarModal = () => {
    modalContent.classList.add('cerrar-animacion');
    modalContent.addEventListener('animationend', () => {
      modal.style.display = 'none';
      modalContent.classList.remove('cerrar-animacion');
      document.body.classList.remove('modal-abierto');
    }, { once: true });
  };

  abrirBtn.addEventListener('click', abrirModal);
  cerrarBtn.addEventListener('click', cerrarModal);

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      cerrarModal();
    }
  });

  // Cerrar con la tecla ESC
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      cerrarModal();
    }
  });
});
