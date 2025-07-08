const restriccion = document.getElementById('restriccion');
const tipoRestriccionContainer = document.getElementById('tipoRestriccionContainer');
const detalleAlergiaContainer = document.getElementById('detalleAlergiaContainer');
const tipoRestriccion = document.getElementById('tipoRestriccion');
const detalleAlergia = document.getElementById('detalleAlergia');

const acompanantesContainer = document.getElementById('acompanantesContainer');
const acompanantesDiv = document.getElementById('acompanantes');
let index = 0;

restriccion.addEventListener('change', () => {
  const show = restriccion.value === 'Sí';
  tipoRestriccionContainer.classList.toggle('hidden', !show);
  if (!show) {
    tipoRestriccion.value = "";
    detalleAlergiaContainer.classList.add('hidden');
    detalleAlergia.value = "";
  }
});

tipoRestriccion.addEventListener('change', () => {
  const showDetalle = tipoRestriccion.value === 'Alergia';
  detalleAlergiaContainer.classList.toggle('hidden', !showDetalle);
  if (!showDetalle) {
    detalleAlergia.value = "";
  }
});

function mostrarSeccionAcompanantes() {
  acompanantesContainer.classList.remove('hidden');
  agregarAcompanante();
}

function agregarAcompanante() {
  const div = document.createElement('div');
  div.classList.add('acompanante');
  div.innerHTML = `
    <label>Nombre del acompañante</label>
    <input type="text" name="acompanantes[${index}][nombre]" required />
    <label>Apellido del acompañante</label>
    <input type="text" name="acompanantes[${index}][apellido]" required />
    <label>¿El acompañante tiene restricción alimentaria?</label>
    <select name="acompanantes[${index}][restriccion]" onchange="toggleTipoAcompanante(this, ${index})">
      <option value="No">No</option>
      <option value="Sí">Sí</option>
    </select>
    <div id="tipoAcompanante-${index}" class="hidden">
      <label>Tipo de restricción</label>
      <select name="acompanantes[${index}][tipoRestriccion]" onchange="toggleDetalleAlergiaAcompanante(this, ${index})">
        <option value="">Seleccionar</option>
        <option value="Vegetariano">Vegetariano</option>
        <option value="Vegano">Vegano</option>
        <option value="Diabetes">Diabetes</option>
        <option value="Celíaco">Celíaco</option>
        <option value="Alergia">Alergia alimenticia</option>
      </select>
    </div>
    <div id="detalleAlergiaAcompanante-${index}" class="hidden">
      <label>¿A qué es alérgico/a el acompañante?</label>
      <input type="text" name="acompanantes[${index}][detalleAlergia]" placeholder="Ej: Maní, gluten, etc." />
    </div>
    <button type="button" class="btn-small" onclick="this.parentElement.remove()">Eliminar</button>
  `;
  acompanantesDiv.appendChild(div);
  index++;
}

function toggleTipoAcompanante(select, i) {
  const contenedor = document.getElementById(`tipoAcompanante-${i}`);
  const detalleContenedor = document.getElementById(`detalleAlergiaAcompanante-${i}`);
  const show = select.value === "Sí";
  contenedor.classList.toggle('hidden', !show);
  if (!show) {
    contenedor.querySelector('select').value = "";
    detalleContenedor.classList.add('hidden');
    detalleContenedor.querySelector('input').value = "";
  }
}

function toggleDetalleAlergiaAcompanante(select, i) {
  const detalleContenedor = document.getElementById(`detalleAlergiaAcompanante-${i}`);
  const showDetalle = select.value === "Alergia";
  detalleContenedor.classList.toggle('hidden', !showDetalle);
  if (!showDetalle) {
    detalleContenedor.querySelector('input').value = "";
  }
}

document.getElementById('asistenciaForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const form = this;
  const submitBtn = form.querySelector('.btn-submit');

  if (!form.nombre.value.trim() || !form.apellido.value.trim()) {
    alert("Por favor completá tu nombre y apellido.");
    return;
  }

  if (form.restriccion.value === "Sí" && !form.tipoRestriccion.value) {
    alert("Por favor especificá el tipo de restricción alimentaria.");
    return;
  }

  if (form.tipoRestriccion.value === "Alergia" && !form.detalleAlergia.value.trim()) {
    alert("Por favor especificá a qué eres alérgico/a.");
    return;
  }

  const data = {
    nombre: form.nombre.value.trim(),
    apellido: form.apellido.value.trim(),
    restriccion: form.restriccion.value,
    tipoRestriccion: form.tipoRestriccion?.value || "",
    detalleAlergia: form.detalleAlergia?.value || "",
    acompanantes: []
  };

  const acompañanteInputs = document.querySelectorAll('.acompanante');
  for (const div of acompañanteInputs) {
    const nombre = div.querySelector('input[name*="[nombre]"]').value.trim();
    const apellido = div.querySelector('input[name*="[apellido]"]').value.trim();
    const restriccion = div.querySelector('select[name*="[restriccion]"]').value;
    const tipoSelect = div.querySelector('select[name*="[tipoRestriccion]"]');
    const tipoRestriccion = tipoSelect ? tipoSelect.value : "";
    const detalleInput = div.querySelector('input[name*="[detalleAlergia]"]');
    const detalleAlergia = detalleInput ? detalleInput.value : "";

    if (!nombre || !apellido) {
      alert("Completá todos los campos de cada acompañante.");
      return;
    }

    if (restriccion === "Sí" && !tipoRestriccion) {
      alert("Completá el tipo de restricción del acompañante.");
      return;
    }

    if (tipoRestriccion === "Alergia" && !detalleAlergia.trim()) {
      alert("Por favor especificá a qué es alérgico/a el acompañante.");
      return;
    }

    data.acompanantes.push({
      nombre,
      apellido,
      restriccion,
      tipoRestriccion,
      detalleAlergia
    });
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';

  fetch('https://script.google.com/macros/s/AKfycbxYieJu3ihlp-Kb8R4vnMcmLEi5-fo5z_B91vXkxAAfXPAhgdKr3KjFfPxsGaJWlypYyQ/exec', {
    method: 'POST',
    body: JSON.stringify(data)
  })
  .then(res => {
  if (res.ok) {
    mostrarPopup("¡Confirmación enviada con éxito!", "success");
  } else {
    mostrarPopup("Hubo un error al enviar la confirmación.", "error");
  }
})
.catch(() => {
  mostrarPopup("Error de red al enviar el formulario.", "error");
})
  .finally(() => {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Enviar';
    form.reset();
    acompanantesDiv.innerHTML = "";
    index = 0;
    acompanantesContainer.classList.add('hidden');
    tipoRestriccionContainer.classList.add('hidden');
    detalleAlergiaContainer.classList.add('hidden');
  });
});

// FORMULARIO DE MÚSICA

document.getElementById('formMusica')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const form = this;
  const submitBtn = form.querySelector('.btn-submit');

  const cancion = form.cancion.value.trim();

  if (!cancion) {
    mostrarPopup("Por favor completá el nombre de la canción.", "error");
    return;
  }

  const data = {
    tipo: "musica",
    cancion
  };

  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';

  fetch('https://script.google.com/macros/s/AKfycbzq2EGfPqUA0zZoej3nIMqu35Jqu0R1xTRVcsDU9OM-Mg3BuLV2vh1FaHJLinhND0c9fQ/exec', {
    method: 'POST',
    body: JSON.stringify(data)
  })
    .then(res => {
      if (res.ok) {
        mostrarPopup("¡Gracias por tu recomendación!", "success");
        form.reset();
      } else {
        mostrarPopup("Hubo un error al enviar tu recomendación.", "error");
      }
    })
    .catch(() => {
      mostrarPopup("Error de conexión al enviar la recomendación.", "error");
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar';
    });
});

// POPUP GLOBAL
function mostrarPopup(mensaje, tipo = "success", tiempo = 4000) {
  const popup = document.getElementById("popupMensaje");
  const texto = document.getElementById("popupTexto");

  texto.textContent = mensaje;
  popup.classList.remove("hidden", "success", "error");
  popup.classList.add(tipo);

  setTimeout(() => cerrarPopup(), tiempo);
}

function cerrarPopup() {
  const popup = document.getElementById("popupMensaje");
  popup.classList.add("hidden");
  popup.classList.remove("success", "error");
}

