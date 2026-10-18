
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
  // AÑO AUTOMÁTICO
  // ------------------------------------------------

  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }

  // ------------------------------------------------
  // INSTAGRAM
  // ------------------------------------------------

  const instagramLink = document.getElementById("instagramLink");

  if (instagramLink) {
    instagramLink.href = INSTAGRAM_URL;
    instagramLink.target = "_blank";
    instagramLink.rel = "noopener noreferrer";
  }

  // ------------------------------------------------
  // MENÚ RESPONSIVE
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

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 800) {
        closeMenu();
      }
    });
  }

  // ------------------------------------------------
  // ENCABEZADO AL HACER SCROLL
  // ------------------------------------------------

  const header = document.querySelector("header");

  function updateHeader() {
    if (!header) return;

    header.classList.toggle("is-scrolled", window.scrollY > 20);
  }

  updateHeader();

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });

  // ------------------------------------------------
  // FORMULARIO DE CONSULTAS E INSCRIPCIÓN
  // ------------------------------------------------

  const enrollmentForm = document.getElementById("enrollmentForm");

  if (enrollmentForm) {
    let formStatus = document.getElementById("formStatus");

    // Crear un mensaje accesible si no existe en el HTML.
    if (!formStatus) {
      formStatus = document.createElement("p");
      formStatus.id = "formStatus";
      formStatus.className = "form-status";
      formStatus.setAttribute("role", "status");
      formStatus.setAttribute("aria-live", "polite");
      enrollmentForm.appendChild(formStatus);
    }

    function showFormStatus(message) {
      if (!formStatus) return;

      formStatus.replaceChildren();
      formStatus.textContent = message;
      formStatus.classList.add("is-visible");
    }

    enrollmentForm.addEventListener("input", () => {
      if (formStatus) {
        formStatus.replaceChildren();
        formStatus.textContent = "";
        formStatus.classList.remove("is-visible");
      }
    });

    enrollmentForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!enrollmentForm.reportValidity()) {
        return;
      }

      // Verificar el consentimiento de privacidad.
      const privacyConsent = document.getElementById("privacyConsent");

      if (privacyConsent && !privacyConsent.checked) {
        showFormStatus(
          "Para continuar, tenés que aceptar la Política de Privacidad."
        );

        privacyConsent.focus();
        return;
      }

      // No abrir WhatsApp con un número ficticio.
      const phoneIsConfigured =
        /^\d{10,15}$/.test(WHATSAPP_NUMBER) &&
        WHATSAPP_NUMBER !== "5490000000000";

      if (!phoneIsConfigured) {
        showFormStatus(
          "Falta configurar el número real de WhatsApp de ElevARTE en script.js."
        );

        return;
      }

      // Leer los campos.
      function getFieldValue(id) {
        const field = document.getElementById(id);

        return field && "value" in field
          ? String(field.value).trim()
          : "";
      }

      const nombre = getFieldValue("nombre");
      const edad = getFieldValue("edad");
      const actividad = getFieldValue("actividad");
      const turno = getFieldValue("turno");
      const consulta = getFieldValue("consulta");

      // Comprobar que los datos esenciales estén presentes.
      if (!nombre || !edad || !actividad || !turno) {
        showFormStatus(
          "Revisá los campos obligatorios antes de continuar."
        );

        return;
      }

      // Preparar el mensaje de WhatsApp.
      const mensaje = [
        "Hola, ElevARTE Danza & Arte. Quiero consultar por clases e inscripción.",
        "",
        `Nombre y apellido: ${nombre}`,
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

      // Abrir WhatsApp desde la acción del usuario.
      const whatsappWindow = window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
      );

      if (whatsappWindow) {
        showFormStatus(
          "WhatsApp se abrió con tu consulta preparada. Revisá el mensaje y confirmá el envío desde WhatsApp."
        );
      } else {
        // Alternativa si el navegador bloquea la nueva pestaña.
        showFormStatus(
          "El navegador bloqueó la ventana. Usá el siguiente enlace para continuar:"
        );

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
  // ANIMACIONES AL HACER SCROLL
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
    ".local-info-content article"
  ];

  const revealElements = document.querySelectorAll(
    revealSelectors.join(", ")
  );

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  } else if (revealElements.length > 0) {
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
  // CURSOR PERSONALIZADO PARA ESCRITORIO
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

    function updateCursor() {
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;

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

      if (!(target instanceof Element)) return;

      const interactiveElement = target.closest(interactiveSelector);

      if (
        interactiveElement &&
        !(
          relatedTarget instanceof Element &&
          interactiveElement.contains(relatedTarget)
        )
      ) {
        ring.classList.remove("is-active");
      }
    });
  }

  // ------------------------------------------------
  // NAVEGACIÓN INTERNA
  // ------------------------------------------------

  window.addEventListener("hashchange", closeMenu);
});
