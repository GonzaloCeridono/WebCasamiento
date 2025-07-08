document.addEventListener("DOMContentLoaded", () => {
  document.body.style.overflow = "hidden";

  const btn = document.getElementById("btnIngresar");
  const pantalla = document.getElementById("pantalla-ingreso");
  const contenido = document.getElementById("contenido-principal");

  btn.addEventListener("click", () => {
    pantalla.classList.add("ocultar");

    pantalla.addEventListener("transitionend", () => {
      pantalla.style.display = "none";
      contenido.style.display = "block";
      contenido.classList.add("animar-entrada-stagger");
      document.body.style.overflow = "";
    }, { once: true });
  });
});
