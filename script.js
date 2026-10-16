// ============================================
// CONFIGURACIÓN DE ELEV ARTE
// ============================================

// Reemplazá este valor por el WhatsApp real del instituto.
// Formato: código de país + área + número, sin +, espacios ni guiones.
// Ejemplo ficticio: "5492641234567".
const WHATSAPP_NUMBER = "5490000000000";

// Reemplazá por el enlace real del Instagram de ElevARTE.
const INSTAGRAM_URL = "https://instagram.com/";


// ============================================
// MENÚ PARA CELULARES
// ============================================

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuBtn.setAttribute("aria-expanded", String(isOpen));
    menuBtn.setAttribute(
      "aria-label",
      isOpen ? "Cerrar menú" : "Abrir menú"
    );

    menuBtn.textContent = isOpen ? "×" : "☰";
  });

  // Cierra el menú cuando se selecciona una sección.
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");

      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.setAttribute("aria-label", "Abrir menú");

      menuBtn.textContent = "☰";
    });
  });
}


// ============================================
// AÑO AUTOMÁTICO EN EL PIE DE PÁGINA
// ============================================

const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}


// ============================================
// ENLACE DE INSTAGRAM
// ============================================

const instagramLink = document.getElementById("instagramLink");

if (instagramLink) {
  instagramLink.href = INSTAGRAM_URL;
}


// ============================================
// FORMULARIO DE CONSULTAS E INSCRIPCIÓN
// ============================================

const enrollmentForm = document.getElementById("enrollmentForm");

if (enrollmentForm) {
  enrollmentForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const form = event.currentTarget;

    // Verifica los campos obligatorios.
    if (!form.reportValidity()) {
      return;
    }

    // Evita intentar enviar a un número de ejemplo.
    if (
      !/^\d{10,15}$/.test(WHATSAPP_NUMBER) ||
      WHATSAPP_NUMBER === "5490000000000"
    ) {
      alert(
        "Primero configurá el número real de WhatsApp de ElevARTE " +
        "en la constante WHATSAPP_NUMBER del archivo script.js."
      );

      return;
    }

    // Recupera los datos ingresados.
    const nombre = document.getElementById("nombre").value.trim();
    const edad = document.getElementById("edad").value;
    const actividad = document.getElementById("actividad").value;
    const turno = document.getElementById("turno").value;
    const consulta = document.getElementById("consulta").value.trim();

    // Construye el mensaje.
    const mensaje = [
      "Hola, ElevARTE. Quiero consultar por clases e inscripción.",
      `Nombre: ${nombre}`,
      `Edad del alumno/a: ${edad}`,
      `Actividad de interés: ${actividad}`,
      `Horario preferido: ${turno}`,
      consulta ? `Mensaje adicional: ${consulta}` : ""
    ]
      .filter(Boolean)
      .join("\n");

    // Abre WhatsApp con el mensaje preparado.
    const url =
      `https://wa.me/${WHATSAPP_NUMBER}?text=` +
      encodeURIComponent(mensaje);

    window.open(url, "_blank", "noopener,noreferrer");
  });
}

// ============================================
// ANIMACIONES AL DESPLAZARSE (SCROLL REVEAL)
// ============================================

(() => {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const revealSelectors = [
    ".hero-copy",
    ".hero-art",
    ".intro-panel",
    ".intro-copy",
    ".section-head",
    ".class-card",
    ".schedule-card",
    ".quote .container",
    ".step",
    ".contact-copy",
    ".contact-card",
    ".info-panel"
  ];

  const elements = document.querySelectorAll(
    revealSelectors.join(", ")
  );

  // Si el usuario prefiere menos movimiento,
  // el contenido permanece visible sin animaciones.
  if (reducedMotion || !("IntersectionObserver" in window)) {
    return;
  }

  // Activamos las animaciones solo si están soportadas.
  document.documentElement.classList.add("js-motion");

  elements.forEach((element, index) => {
    element.classList.add("reveal");

    // Escalonamiento suave en tarjetas consecutivas.
    const isCard =
      element.matches(".class-card, .schedule-card, .step");

    if (isCard) {
      const siblings = Array.from(element.parentElement.children);
      const position = siblings.indexOf(element);

      element.style.setProperty(
        "--reveal-delay",
        `${position * 100}ms`
      );
    }
  });

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -45px 0px"
    }
  );

  elements.forEach((element) => {
    observer.observe(element);
  });
})();


// ============================================
// CURSOR PERSONALIZADO PARA COMPUTADORAS
// ============================================

(() => {
  const finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine) and (min-width: 801px)"
  ).matches;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // No reemplazamos el cursor en celulares,
  // tablets táctiles ni usuarios que reducen movimiento.
  if (!finePointer || reducedMotion) {
    return;
  }

  const dot = document.createElement("div");
  dot.className = "cursor-dot";
  dot.setAttribute("aria-hidden", "true");

  const ring = document.createElement("div");
  ring.className = "cursor-ring";
  ring.setAttribute("aria-hidden", "true");

  document.body.append(dot, ring);
  document.body.classList.add("custom-cursor");

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let animationFrame = null;

  function updateCursor() {
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;

    // El anillo sigue al cursor con un pequeño retraso.
    ringX += (mouseX - ringX) * 0.22;
    ringY += (mouseY - ringY) * 0.22;

    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;

    const distance =
      Math.abs(mouseX - ringX) + Math.abs(mouseY - ringY);

    if (distance > 0.5) {
      animationFrame = requestAnimationFrame(updateCursor);
    } else {
      animationFrame = null;
    }
  }

  document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    dot.style.opacity = "1";
    ring.style.opacity = "1";

    if (animationFrame === null) {
      animationFrame = requestAnimationFrame(updateCursor);
    }
  });

  document.addEventListener("mouseleave", () => {
    dot.style.opacity = "0";
    ring.style.opacity = "0";
  });

  document.addEventListener("mouseenter", () => {
    dot.style.opacity = "1";
    ring.style.opacity = "1";
  });

  // El anillo cambia de tamaño sobre elementos interactivos.
  const interactiveSelector = [
    "a",
    "button",
    "input",
    "select",
    "textarea",
    "[role='button']"
  ].join(", ");

  document.addEventListener("pointerover", (event) => {
    if (event.target.closest(interactiveSelector)) {
      ring.classList.add("is-active");
    }
  });

  document.addEventListener("pointerout", (event) => {
    if (event.target.closest(interactiveSelector)) {
      ring.classList.remove("is-active");
    }
  });
})();