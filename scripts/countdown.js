function actualizarCampo(id, nuevoValor) {
  const elemento = document.getElementById(id);
  const valorActual = elemento.textContent;

  if (valorActual !== nuevoValor) {
    elemento.textContent = nuevoValor;

    // Reiniciar la animación solo al número
    elemento.classList.remove("animar-cambio");
    void elemento.offsetWidth;
    elemento.classList.add("animar-cambio");
  }
}

function actualizarCountdown() {
  const fechaBoda = new Date("2025-09-13T00:00:00");
  const ahora = new Date();
  const diferencia = fechaBoda - ahora;

  if (diferencia <= 0) {
    document.getElementById("cuenta-regresiva").style.display = "none";
    document.getElementById("faltan").style.display = "none";
    document.getElementById("mensaje").style.display = "block";
    document.getElementById("mensaje").textContent = "¡Llegó el gran día!";
    clearInterval(intervalo);
    return;
  }

  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

  actualizarCampo("dias", dias.toString().padStart(2, '0'));
  actualizarCampo("horas", horas.toString().padStart(2, '0'));
  actualizarCampo("minutos", minutos.toString().padStart(2, '0'));
  actualizarCampo("segundos", segundos.toString().padStart(2, '0'));
}

const intervalo = setInterval(actualizarCountdown, 1000);
actualizarCountdown();
