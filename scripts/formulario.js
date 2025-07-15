// --- VARIABLES GENERALES ---
const restriccion = document.getElementById('restriccion');
const tipoRestriccionContainer = document.getElementById('tipoRestriccionContainer');
const detalleAlergiaContainer = document.getElementById('detalleAlergiaContainer');
const tipoRestriccion = document.getElementById('tipoRestriccion');
const detalleAlergia = document.getElementById('detalleAlergia');

const acompanantesContainer = document.getElementById('acompanantesContainer');
const acompanantesDiv = document.getElementById('acompanantes');
let index = 0;

// Asistencia: Mostrar formulario según "¿Vas a asistir?"
const selectAsistiras = document.getElementById("asistiras");
const formCompleto = document.getElementById("formAsistenciaCompleta");
const formNoAsiste = document.getElementById("formNoAsiste");

selectAsistiras.addEventListener("change", () => {
  const valor = selectAsistiras.value;

  const nombre = document.querySelector('input[name="nombre"]');
  const apellido = document.querySelector('input[name="apellido"]');
  const nombreNo = document.getElementById("nombreNo");
  const apellidoNo = document.getElementById("apellidoNo");

  if (valor === "Sí") {
    formCompleto.classList.remove("hidden");
    formNoAsiste.classList.add("hidden");

    nombre.required = true;
    apellido.required = true;
    nombreNo.required = false;
    apellidoNo.required = false;
  } else if (valor === "No") {
    formCompleto.classList.add("hidden");
    formNoAsiste.classList.remove("hidden");

    nombre.required = false;
    apellido.required = false;
    nombreNo.required = true;
    apellidoNo.required = true;
  } else {
    // Si no seleccionó nada
    formCompleto.classList.add("hidden");
    formNoAsiste.classList.add("hidden");

    nombre.required = false;
    apellido.required = false;
    nombreNo.required = false;
    apellidoNo.required = false;
  }
});

// --- RESTRICCIONES ALIMENTARIAS ---
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

// --- ACOMPAÑANTES ---
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

// --- ENVÍO FORMULARIO ASISTENCIA ---
document.getElementById('asistenciaForm')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const form = this;
  const submitBtn = form.querySelector('.btn-submit');
  const asistiras = form.asistiras.value;

  let data = {
    asistira: asistiras,
    nombre: "",
    apellido: "",
    restriccion: "",
    tipoRestriccion: "",
    detalleAlergia: "",
    acompanantes: []
  };

  if (asistiras === "Sí") {
    if (!form.nombre.value.trim() || !form.apellido.value.trim()) {
      mostrarPopup("Por favor completá tu nombre y apellido.");
      return;
    }

    if (form.restriccion.value === "Sí" && !form.tipoRestriccion.value) {
      mostrarPopup("Por favor especificá el tipo de restricción alimentaria.");
      return;
    }

    if (form.tipoRestriccion.value === "Alergia" && !form.detalleAlergia.value.trim()) {
      mostrarPopup("Por favor especificá a qué eres alérgico/a.");
      return;
    }

    data.nombre = form.nombre.value.trim();
    data.apellido = form.apellido.value.trim();
    data.restriccion = form.restriccion.value;
    data.tipoRestriccion = form.tipoRestriccion?.value || "";
    data.detalleAlergia = form.detalleAlergia?.value || "";

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
        mostrarPopup("Completá todos los campos de cada acompañante.");
        return;
      }

      if (restriccion === "Sí" && !tipoRestriccion) {
        mostrarPopup("Completá el tipo de restricción del acompañante.");
        return;
      }

      if (tipoRestriccion === "Alergia" && !detalleAlergia.trim()) {
        mostrarPopup("Por favor especificá a qué es alérgico/a el acompañante.");
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

    } else if (asistiras === "No") {
    const nombreNo = document.getElementById("nombreNo")?.value.trim();
    const apellidoNo = document.getElementById("apellidoNo")?.value.trim();

    if (!nombreNo || !apellidoNo) {
      mostrarPopup("Por favor completá tu nombre y apellido.");
      return;
    }

    data.nombre = nombreNo;
    data.apellido = apellidoNo;

  } else {
    mostrarPopup("Por favor indicá si vas a asistir.");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';

  fetch('https://script.google.com/macros/s/AKfycbwe4spe5mbZEU14kp9PFtTPYe11wbHJdLGq9RNQNpo4Ir3mJ6YviYCdaQvzipg1rGD_Fw/exec', {
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
      index = 0;
      acompanantesDiv.innerHTML = "";
      acompanantesContainer.classList.add('hidden');
      formCompleto.classList.add('hidden');
      formNoAsiste.classList.add('hidden');
      tipoRestriccionContainer.classList.add('hidden');
      detalleAlergiaContainer.classList.add('hidden');
    });
});

// --- FORMULARIO DE MÚSICA ---
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

  fetch('https://script.google.com/macros/s/AKfycbwe4spe5mbZEU14kp9PFtTPYe11wbHJdLGq9RNQNpo4Ir3mJ6YviYCdaQvzipg1rGD_Fw/exec', {
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

// --- POPUP GLOBAL ---
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
