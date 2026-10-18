
"use strict";

// ==================================================
// CONFIGURACIÓN DE ELEV ARTE
// ==================================================

const WHATSAPP_NUMBER = "5490000000000";
const INSTAGRAM_URL = "https://www.instagram.com/elevarte.danzayarte/";

// ==================================================
// INICIALIZACIÓN
// ==================================================

document.addEventListener("DOMContentLoaded", () => {
  // ------------------------------------------------
  // AÑO AUTOMÁTICO EN EL PIE DE PÁGINA
  // ------------------------------------------------

  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // ------------------------------------------------
  // ENLACE DE INSTAGRAM
  // ------------------------------------------------

  const instagramLink = document.getElementById("instagramLink");

  if (instagramLink) {
    instagramLink.href = INSTAGRAM_URL;
    instagramLink.target = "_blank";
    instagramLink.rel = "noopener noreferrer";
  }

  // ------------------------------------------------
  // MENÚ PARA CELULARES
  // ------------------------------------------------

  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");

  function closeMenu() {
    if (!menuBtn || !navLinks) return;

    navLinks.classList.remove("open", "is-open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Abrir menú");
    menuBtn.textContent = "☰";
    document.body.classList.remove("menu-open");
  }

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      const isOpen = !(
        navLinks.classList.contains("open") ||
        navLinks.classList.contains("is-open")
      );

      navLinks.classList.toggle("open", isOpen);
      navLinks.classList.toggle("is-open", isOpen);

      menuBtn.setAttribute("aria-expanded", String(isOpen));
      menuBtn.setAttribute(
        "aria-label",
        isOpen ? "Cerrar menú" : "Abrir menú"
      );

      menuBtn.textContent = isOpen ? "×" : "☰";
      document.body.classList.toggle("menu-open", isOpen);
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Cerrar el menú con Escape.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    // Cerrar el menú si se cambia a una pantalla grande.
    window.addEventListener("resize", () => {
      if (window.innerWidth > 800) {
        closeMenu();
      }
    });
  }

  // ------------------------------------------------
  // EFECTO DEL ENCABEZADO AL DESPLAZARSE
  // ------------------------------------------------

  const header = document.querySelector("header");

  function updateHeader() {
    if (!header) return;

    header.classList.toggle("is-scrolled", window.scrollY > 20);
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  // ------------------------------------------------
  // FORMULARIO DE CONSULTAS E INSCRIPCIÓN
  // ------------------------------------------------

  const enrollmentForm = document.getElementById("enrollmentForm");

  if (enrollmentForm) {
    let formStatus = document.getElementById("formStatus");

    // Crear un área de estado accesible si no existe en el HTML.
    if (!formStatus) {
      formStatus = document.createElement("p");
      formStatus.id = "formStatus";
      formStatus.className = "form-status";
      formStatus.setAttribute("role", "status");
      formStatus.setAttribute("aria-live", "polite");
      enrollmentForm.appendChild(formStatus);
    }

    enrollmentForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!enrollmentForm.reportValidity()) {
        return;
      }

      // Verificar el consentimiento de privacidad, si existe.
      const privacyConsent = document.getElementById("privacyConsent");

      if (privacyConsent && !privacyConsent.checked) {
        formStatus.textContent =
          "Para continuar, tenés que aceptar la política de privacidad.";

        privacyConsent.focus();
        return;
      }

      // No enviar a un número de ejemplo.
      if (
        !/^\d{10,15}$/.test(WHATSAPP_NUMBER) ||
        WHATSAPP_NUMBER === "5490000000000"
      ) {
        formStatus.textContent =
          "Falta configurar el número real de WhatsApp de ElevARTE.";

        alert(
          "Configurá el número real de WhatsApp en la constante " +
          "WHATSAPP_NUMBER del archivo script.js."
        );

        return;
      }

      // Obtener campos de forma segura.
      const getFieldValue = (id) => {
        const field = document.getElementById(id);
        return field && "value" in field ? field.value.trim() : "";
      };

      const nombre = getFieldValue("nombre");
      const edad = getFieldValue("edad");
      const actividad = getFieldValue("actividad");
      const turno = getFieldValue("turno");
      const consulta = getFieldValue("consulta");

      // Construir el mensaje de inscripción.
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

      const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}?text=` +
        encodeURIComponent(mensaje);

      formStatus.textContent =
        "Abriendo WhatsApp para enviar tu consulta...";

      // Abrir WhatsApp sin depender del valor devuelto por window.open.
      const whatsappWindow = window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
      );

      // Alternativa si el navegador bloquea la nueva pestaña.
      if (!whatsappWindow) {
        formStatus.textContent =
          "Si WhatsApp no se abrió, usá este enlace para continuar.";

        const fallbackLink = document.createElement("a");
        fallbackLink.href = whatsappURL;
        fallbackLink.target = "_blank";
        fallbackLink.rel = "noopener noreferrer";
        fallbackLink.textContent = "Abrir WhatsApp";

        formStatus.appendChild(document.createTextNode(" "));
        formStatus.appendChild(fallbackLink);
      }
    });
  }

  // ------------------------------------------------
  // ANIMACIONES AL DESPLAZARSE (SCROLL REVEAL)
  // ------------------------------------------------

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

  const revealElements = document.querySelectorAll(
    revealSelectors.join(", ")
  );

  if (
    !reducedMotion &&
    "IntersectionObserver" in window &&
    revealElements.length > 0
  ) {
    // El CSS puede utilizar esta clase para activar los estados iniciales.
    document.documentElement.classList.add("js-motion");

    revealElements.forEach((element) => {
      element.classList.add("reveal");

      const isCard = element.matches(
        ".class-card, .schedule-card, .step"
      );

      if (isCard && element.parentElement) {
        const siblings = Array.from(element.parentElement.children);
        const position = siblings.indexOf(element);

        element.style.setProperty(
          "--reveal-delay",
          `${Math.max(position, 0) * 100}ms`
        );
      }
    });

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -45px 0px"
      }
    );

    revealElements.forEach((element) => {
      observer.observe(element);
    });
  }

  // ------------------------------------------------
  // CURSOR PERSONALIZADO PARA COMPUTADORAS
  // ------------------------------------------------

  const finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine) and (min-width: 801px)"
  ).matches;

  if (finePointer && !reducedMotion) {
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
    let pointerInside = false;

    function updateCursor() {
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;

      // El anillo sigue al cursor con un retraso suave.
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
      pointerInside = true;

      dot.style.opacity = "1";
      ring.style.opacity = "1";

      if (animationFrame === null) {
        animationFrame = requestAnimationFrame(updateCursor);
      }
    });

    document.addEventListener("mouseleave", () => {
      pointerInside = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    });

    document.addEventListener("mouseenter", () => {
      pointerInside = true;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    });

    // Aumentar el anillo sobre enlaces y controles.
    const interactiveSelector = [
      "a",
      "button",
      "input",
      "select",
      "textarea",
      "[role='button']"
    ].join(", ");

    document.addEventListener("pointerover", (event) => {
      const target = event.target;

      if (
        target instanceof Element &&
        target.closest(interactiveSelector)
      ) {
        ring.classList.add("is-active");
      }
    });

    document.addEventListener("pointerout", (event) => {
      const target = event.target;
      const relatedTarget = event.relatedTarget;

      if (
        target instanceof Element &&
        target.closest(interactiveSelector) &&
        !(
          relatedTarget instanceof Element &&
          target.closest(interactiveSelector).contains(relatedTarget)
        )
      ) {
        ring.classList.remove("is-active");
      }
    });
  }

  // ------------------------------------------------
  // ENLACES INTERNOS Y NAVEGACIÓN
  // ------------------------------------------------

  window.addEventListener("hashchange", closeMenu);
});
