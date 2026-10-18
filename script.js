
"use strict";

// ==================================================
// CONFIGURACIÓN DE ELEVARTE
// ==================================================

const WHATSAPP_NUMBER = "542645696246";
const INSTAGRAM_URL = "https://www.instagram.com/elevarte.danzayarte/";

// ==================================================
// INICIALIZACIÓN
// ==================================================

document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;
  const body = document.body;
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

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
    body.classList.remove("menu-open");
  }

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      const isOpen = menuBtn.getAttribute("aria-expanded") !== "true";

      navLinks.classList.toggle("is-open", isOpen);
      navLinks.classList.toggle("open", isOpen);

      menuBtn.setAttribute("aria-expanded", String(isOpen));
      menuBtn.setAttribute(
        "aria-label",
        isOpen ? "Cerrar menú" : "Abrir menú"
      );

      body.classList.toggle("menu-open", isOpen);
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
      if (window.innerWidth > 760) {
        closeMenu();
      }
    });
  }

  // ------------------------------------------------
  // ENCABEZADO AL HACER SCROLL
  // ------------------------------------------------

  const header = document.getElementById("siteHeader");

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
      if (!formStatus) return;

      formStatus.replaceChildren();
      formStatus.classList.remove("is-visible");
    });

    enrollmentForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!enrollmentForm.reportValidity()) return;

      const privacyConsent =
        document.getElementById("privacyConsent");

      if (privacyConsent && !privacyConsent.checked) {
        showFormStatus(
          "Para continuar, tenés que aceptar la Política de Privacidad."
        );
        privacyConsent.focus();
        return;
      }

      const phoneIsConfigured =
        /^\d{10,15}$/.test(WHATSAPP_NUMBER) &&
        WHATSAPP_NUMBER !== "5490000000000";

      if (!phoneIsConfigured) {
        showFormStatus(
          "Falta configurar el número real de WhatsApp de ElevARTE en script.js."
        );
        return;
      }

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

      if (!nombre || !edad || !actividad || !turno) {
        showFormStatus(
          "Revisá los campos obligatorios antes de continuar."
        );
        return;
      }

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

      // Abrir WhatsApp como respuesta directa al envío del formulario.
      const whatsappWindow = window.open(whatsappURL, "_blank");

      if (whatsappWindow) {
        whatsappWindow.opener = null;
      }

      if (whatsappWindow) {
        showFormStatus(
          "WhatsApp se abrió con tu consulta preparada. Revisá el mensaje y confirmá el envío desde WhatsApp."
        );
      } else {
        showFormStatus(
          "El navegador bloqueó la ventana. Usá el enlace para continuar:"
        );

        const fallbackLink = document.createElement("a");
        fallbackLink.href = whatsappURL;
        fallbackLink.target = "_blank";
        fallbackLink.rel = "noopener noreferrer";
        fallbackLink.textContent = "Abrir WhatsApp";

        formStatus.append(document.createTextNode(" "), fallbackLink);
      }
    });
  }

  // ------------------------------------------------
  // ANIMACIONES AL HACER SCROLL
  // ------------------------------------------------

  const revealSelector = [
    ".reveal",
    ".hero-copy",
    ".hero-side-note",
    ".section-index",
    ".intro-heading",
    ".intro-copy",
    ".image-break-caption",
    ".section-heading",
    ".class-card",
    ".quote-inner",
    ".schedule-intro",
    ".schedule-list",
    ".schedule-item",
    ".location-copy",
    ".location-visual",
    ".contact-copy",
    ".contact-card",
    ".footer-main",
    ".footer-bottom"
  ].join(", ");

  const revealElements = [
    ...new Set(document.querySelectorAll(revealSelector))
  ];

  // Alternar direcciones según el tipo de sección.
  const directionalGroups = [
    {
      selector: ".intro-heading, .section-heading, .schedule-intro, .location-copy, .contact-copy",
      direction: "from-left"
    },
    {
      selector: ".intro-copy, .schedule-list, .location-visual, .contact-card",
      direction: "from-right"
    }
  ];

  directionalGroups.forEach(({ selector, direction }) => {
    document.querySelectorAll(selector).forEach((element) => {
      element.classList.add("reveal", direction);
    });
  });

  // Las tarjetas entran alternando izquierda y derecha.
  document.querySelectorAll(".class-card").forEach((card, index) => {
    card.classList.add("reveal");
    card.classList.add(index % 2 === 0 ? "from-left" : "from-right");
  });

  // Los elementos de horarios aparecen escalonadamente.
  document.querySelectorAll(".schedule-item").forEach((item, index) => {
    item.classList.add("reveal", "from-right");
    item.style.setProperty("--reveal-delay", `${index * 120}ms`);
  });

  // Actualizar la lista después de asignar clases.
  const allRevealElements = [
    ...new Set([
      ...revealElements,
      ...document.querySelectorAll(".reveal")
    ])
  ];

  if (reducedMotion || !("IntersectionObserver" in window)) {
    allRevealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  } else if (allRevealElements.length > 0) {
    // La clase activa las reglas que ocultan los elementos antes de revelarlos.
    html.classList.add("js-motion");

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
        rootMargin: "0px 0px -40px 0px"
      }
    );

    allRevealElements.forEach((element) => {
      observer.observe(element);
    });
  }

  // ------------------------------------------------
  // HERO CINEMATOGRÁFICO Y TÍTULOS
  // ------------------------------------------------

  const hero = document.querySelector(".hero");
  const heroCopy = document.querySelector(".hero-copy");
  const heroTitle = heroCopy?.querySelector("h1");

  if (hero) {
    hero.classList.add("hero-animated");
  }

  if (heroCopy) {
    heroCopy.classList.add("hero-copy-ready");
  }

  if (heroTitle) {
    heroTitle.classList.add("hero-title-mask");

    const emphasizedTitle = heroTitle.querySelector("em");

    if (emphasizedTitle) {
      emphasizedTitle.classList.add("hero-title-emphasis");
    }
  }

  // Animar elementos de la portada sin ocultar contenido si falla el observer.
  const heroElements = [
    heroCopy,
    document.querySelector(".hero-side-note"),
    document.querySelector(".hero-scroll"),
    document.querySelector(".hero-index")
  ].filter(Boolean);

  heroElements.forEach((element, index) => {
    element.style.setProperty(
      "--hero-delay",
      `${index * 180 + 100}ms`
    );
  });

  // ------------------------------------------------
  // FOTOGRAFÍAS INTERACTIVAS
  // ------------------------------------------------

  document.querySelectorAll(".class-card").forEach((card) => {
    card.classList.add("has-image-motion");
  });

  const imageBreak = document.querySelector(".image-break");

  if (imageBreak) {
    imageBreak.classList.add("has-image-motion");
  }

  // ------------------------------------------------
  // CURSOR PERSONALIZADO PARA ESCRITORIO
  // ------------------------------------------------

  const finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine) and (min-width: 761px)"
  ).matches;

  if (finePointer) {
    // Reutilizar los nodos existentes en el HTML.
    const dot = document.querySelector(".cursor-dot");
    const ring = document.querySelector(".cursor-ring");

    if (dot && ring) {
      body.classList.add("has-custom-cursor");

      let mouseX = -100;
      let mouseY = -100;
      let ringX = -100;
      let ringY = -100;
      let animationFrame = null;
      let pointerInside = false;

      function updateCursor() {
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;

        // Sin retraso animado si el usuario prefiere reducir el movimiento.
        const easing = reducedMotion ? 1 : 0.19;

        ringX += (mouseX - ringX) * easing;
        ringY += (mouseY - ringY) * easing;

        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;

        const distance =
          Math.abs(mouseX - ringX) + Math.abs(mouseY - ringY);

        if (distance > 0.4 && pointerInside) {
          animationFrame = requestAnimationFrame(updateCursor);
        } else {
          animationFrame = null;
        }
      }

      function startCursorAnimation() {
        if (animationFrame === null) {
          animationFrame = requestAnimationFrame(updateCursor);
        }
      }

      document.addEventListener("pointermove", (event) => {
        if (event.pointerType && event.pointerType !== "mouse") return;

        mouseX = event.clientX;
        mouseY = event.clientY;
        pointerInside = true;

        dot.classList.add("is-active");
        ring.classList.add("is-active");

        startCursorAnimation();
      });

      document.addEventListener("pointerleave", () => {
        pointerInside = false;
        dot.classList.remove("is-active");
        ring.classList.remove("is-active");

        if (animationFrame !== null) {
          cancelAnimationFrame(animationFrame);
          animationFrame = null;
        }
      });

      document.addEventListener("pointerenter", () => {
        pointerInside = true;
      });

      const interactiveSelector = [
        "a",
        "button",
        "input",
        "select",
        "textarea",
        "label",
        "[role='button']"
      ].join(", ");

      document.addEventListener("pointerover", (event) => {
        if (!(event.target instanceof Element)) return;

        if (event.target.closest(interactiveSelector)) {
          ring.classList.add("is-hovering");
        }
      });

      document.addEventListener("pointerout", (event) => {
        if (!(event.target instanceof Element)) return;

        const interactive = event.target.closest(interactiveSelector);
        const nextTarget = event.relatedTarget;

        if (
          interactive &&
          !(
            nextTarget instanceof Element &&
            interactive.contains(nextTarget)
          )
        ) {
          ring.classList.remove("is-hovering");
        }
      });

      document.addEventListener("pointerdown", () => {
        ring.classList.add("is-clicking");
      });

      document.addEventListener("pointerup", () => {
        ring.classList.remove("is-clicking");
      });

      window.addEventListener("blur", () => {
        pointerInside = false;
        dot.classList.remove("is-active");
        ring.classList.remove("is-active", "is-clicking");

        if (animationFrame !== null) {
          cancelAnimationFrame(animationFrame);
          animationFrame = null;
        }
      });
    }
  }

  // ------------------------------------------------
  // NAVEGACIÓN INTERNA
  // ------------------------------------------------

  window.addEventListener("hashchange", closeMenu);
});
