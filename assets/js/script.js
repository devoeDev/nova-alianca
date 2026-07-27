/* =========================================================
   CONFIGURAÇÕES GERAIS
========================================================= */

// IMPORTANTE: substitua pelo número real da empresa, apenas com dígitos.
// Formato: código do país + DDD + número. Exemplo: 5579999999999.
const WHATSAPP_NUMBER = "5579999999999";

const siteHeader = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
const currentYearElement = document.querySelector("#current-year");
const quoteForm = document.querySelector("#quote-form");
const phoneInput = document.querySelector("#phone");

/* =========================================================
   ÍCONES LUCIDE
========================================================= */
window.addEventListener("DOMContentLoaded", () => {
    if (window.lucide) {
        window.lucide.createIcons();
    }
});

/* =========================================================
   ANO AUTOMÁTICO DO FOOTER
========================================================= */
if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
}

/* =========================================================
   HEADER COM FUNDO AO ROLAR
========================================================= */
const updateHeaderState = () => {
    siteHeader?.classList.toggle("is-scrolled", window.scrollY > 16);
};

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

/* =========================================================
   MENU MOBILE
========================================================= */
const closeMobileMenu = () => {
    menuToggle?.classList.remove("is-active");
    mainNav?.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Abrir menu");
};

menuToggle?.addEventListener("click", () => {
    const willOpen = !mainNav?.classList.contains("is-open");

    menuToggle.classList.toggle("is-active", willOpen);
    mainNav?.classList.toggle("is-open", willOpen);
    document.body.classList.toggle("menu-open", willOpen);
    menuToggle.setAttribute("aria-expanded", String(willOpen));
    menuToggle.setAttribute("aria-label", willOpen ? "Fechar menu" : "Abrir menu");
});

navLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
        closeMobileMenu();
    }
});

/* =========================================================
   LINK ATIVO DA NAVEGAÇÃO
========================================================= */
const observedSections = [...document.querySelectorAll("main section[id]")];

const navigationObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            navLinks.forEach((link) => {
                const targetId = link.getAttribute("href")?.replace("#", "");
                link.classList.toggle("active", targetId === entry.target.id);
            });
        });
    },
    {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0,
    }
);

observedSections.forEach((section) => navigationObserver.observe(section));

/* =========================================================
   ANIMAÇÕES COM MOTION
========================================================= */
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const motionApi = window.Motion;

const showAllRevealElements = () => {
    document.querySelectorAll("[data-reveal]").forEach((element) => {
        element.style.opacity = "1";
        element.style.transform = "none";
    });
};

const initializeMotionAnimations = () => {
    if (!motionApi || prefersReducedMotion) {
        showAllRevealElements();
        return;
    }

    const { animate, inView, stagger } = motionApi;
    document.documentElement.classList.add("motion-running");

    // Entrada inicial do cabeçalho e conteúdo principal.
    animate(
        ".site-header",
        { opacity: [0, 1], y: [-18, 0] },
        { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
    );

    const heroSequence = [
        [".hero .eyebrow", { opacity: [0, 1], x: [-24, 0] }, { duration: 0.55 }],
        [".hero h1", { opacity: [0, 1], y: [38, 0] }, { at: 0.08, duration: 0.8 }],
        [".hero-description", { opacity: [0, 1], y: [22, 0] }, { at: 0.2, duration: 0.65 }],
        [".hero-actions > *", { opacity: [0, 1], y: [18, 0] }, { at: 0.28, delay: stagger(0.09), duration: 0.55 }],
        [".hero-trust li", { opacity: [0, 1], x: [-14, 0] }, { at: 0.38, delay: stagger(0.08), duration: 0.45 }],
        [".industrial-panel", { opacity: [0, 1], scale: [0.94, 1], rotate: [-1.5, 0] }, { at: 0.1, duration: 0.9 }],
        [".floating-badge", { opacity: [0, 1], scale: [0.78, 1] }, { at: 0.48, delay: stagger(0.12), duration: 0.55 }],
    ];

    animate(heroSequence, {
        defaultTransition: { ease: [0.22, 1, 0.36, 1] },
    });

    // Desenho progressivo da estrutura metálica em SVG.
    const drawingPaths = document.querySelectorAll(".industrial-drawing g[stroke] path");
    if (drawingPaths.length) {
        animate(
            drawingPaths,
            { pathLength: [0, 1], opacity: [0.2, 1] },
            {
                delay: stagger(0.035, { startDelay: 0.3 }),
                duration: 1.05,
                ease: "easeInOut",
            }
        );
    }

    const drawingPoints = document.querySelectorAll(".industrial-drawing circle");
    if (drawingPoints.length) {
        animate(
            drawingPoints,
            { opacity: [0, 1], scale: [0, 1] },
            { delay: stagger(0.06, { startDelay: 1 }), duration: 0.4, ease: "backOut" }
        );
    }

    // Movimento contínuo e discreto dos selos do hero.
    animate(
        ".badge-quality",
        { y: [0, -9, 0] },
        { duration: 4.6, repeat: Infinity, ease: "easeInOut" }
    );

    animate(
        ".badge-experience",
        { y: [0, 8, 0], rotate: [0, 1.2, 0] },
        { duration: 5.2, repeat: Infinity, ease: "easeInOut" }
    );

    animate(
        ".visual-glow",
        { opacity: [0.08, 0.17, 0.08], scale: [0.94, 1.08, 0.94] },
        { duration: 5.8, repeat: Infinity, ease: "easeInOut" }
    );

    // Animações acionadas quando cada bloco entra na tela.
    document.querySelectorAll("[data-reveal]").forEach((element) => {
        const isHeroElement = element.closest(".hero") && !element.classList.contains("stats-strip");
        if (isHeroElement) return;

        element.style.opacity = "0";
        element.style.transform = "translateY(34px)";

        inView(
            element,
            () => {
                const delay = Number(element.dataset.delay || 0) / 1000;
                animate(
                    element,
                    { opacity: [0, 1], y: [34, 0] },
                    {
                        delay,
                        duration: 0.72,
                        ease: [0.22, 1, 0.36, 1],
                    }
                );
            },
            { amount: 0.16, margin: "0px 0px -45px 0px" }
        );
    });

    // Stagger interno dos grupos de cards.
    const animatedGroups = [
        [".services-grid", ".service-card"],
        [".advantages-list", ".advantage-card"],
        [".process-grid", ".process-card"],
        [".stats-strip", "article"],
    ];

    animatedGroups.forEach(([containerSelector, itemSelector]) => {
        const container = document.querySelector(containerSelector);
        const items = container?.querySelectorAll(itemSelector);
        if (!container || !items?.length) return;

        items.forEach((item) => {
            item.classList.add("motion-card");
            item.style.opacity = "0";
            item.style.transform = "translateY(28px) scale(0.98)";
        });

        inView(
            container,
            () => {
                animate(
                    items,
                    { opacity: [0, 1], y: [28, 0], scale: [0.98, 1] },
                    {
                        delay: stagger(0.09),
                        duration: 0.62,
                        ease: [0.22, 1, 0.36, 1],
                    }
                );
            },
            { amount: 0.12 }
        );
    });

    // Microinterações em botões e cards.
    const interactiveElements = document.querySelectorAll(
        ".button, .service-card, .advantage-card, .process-card, .social-links a, .social-links button, .floating-whatsapp"
    );

    interactiveElements.forEach((element) => {
        element.addEventListener("pointerenter", () => {
            animate(element, { scale: 1.018 }, { duration: 0.2, ease: "easeOut" });
        });

        element.addEventListener("pointerleave", () => {
            animate(element, { scale: 1 }, { duration: 0.24, ease: "easeOut" });
        });

        element.addEventListener("pointerdown", () => {
            animate(element, { scale: 0.975 }, { duration: 0.1 });
        });

        element.addEventListener("pointerup", () => {
            animate(element, { scale: 1.018 }, { duration: 0.16, ease: "easeOut" });
        });
    });
};

window.addEventListener("DOMContentLoaded", initializeMotionAnimations);

/* =========================================================
   FUNÇÕES DO WHATSAPP
========================================================= */
const buildWhatsAppUrl = (message) => {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
};

const openWhatsApp = (message) => {
    window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
};

document.querySelectorAll(".whatsapp-action").forEach((button) => {
    button.addEventListener("click", () => {
        const message =
            button.dataset.message ||
            "Olá! Vim pelo site da Nova Aliança e gostaria de solicitar um orçamento.";

        openWhatsApp(message);
    });
});

/* =========================================================
   MÁSCARA SIMPLES DE TELEFONE
========================================================= */
const formatPhone = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);

    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }

    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

phoneInput?.addEventListener("input", (event) => {
    event.target.value = formatPhone(event.target.value);
});

/* =========================================================
   VALIDAÇÃO DO FORMULÁRIO E ENVIO PARA WHATSAPP
========================================================= */
const setFieldError = (field, message) => {
    const formField = field.closest(".form-field");
    const errorElement = formField?.querySelector(".field-error");

    formField?.classList.toggle("has-error", Boolean(message));

    if (errorElement) {
        errorElement.textContent = message;
    }
};

const clearFormErrors = () => {
    quoteForm?.querySelectorAll(".form-field").forEach((field) => {
        field.classList.remove("has-error");
        const errorElement = field.querySelector(".field-error");
        if (errorElement) errorElement.textContent = "";
    });

    const privacyError = quoteForm?.querySelector(".privacy-error");
    if (privacyError) privacyError.textContent = "";
};

const validateQuoteForm = (formData) => {
    let isValid = true;

    const nameField = quoteForm.querySelector("#name");
    const phoneField = quoteForm.querySelector("#phone");
    const serviceField = quoteForm.querySelector("#service");
    const messageField = quoteForm.querySelector("#message");
    const privacyField = quoteForm.querySelector("#privacy");
    const privacyError = quoteForm.querySelector(".privacy-error");

    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").replace(/\D/g, "");
    const service = String(formData.get("service") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (name.length < 3) {
        setFieldError(nameField, "Informe seu nome completo.");
        isValid = false;
    }

    if (phone.length < 10) {
        setFieldError(phoneField, "Informe um telefone válido com DDD.");
        isValid = false;
    }

    if (!service) {
        setFieldError(serviceField, "Selecione o serviço desejado.");
        isValid = false;
    }

    if (message.length < 15) {
        setFieldError(messageField, "Descreva o projeto com pelo menos 15 caracteres.");
        isValid = false;
    }

    if (!privacyField.checked) {
        privacyError.textContent = "Você precisa autorizar o contato para continuar.";
        isValid = false;
    }

    return isValid;
};

quoteForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    clearFormErrors();

    const formData = new FormData(quoteForm);

    if (!validateQuoteForm(formData)) {
        const firstInvalidField = quoteForm.querySelector(".has-error input, .has-error select, .has-error textarea");
        firstInvalidField?.focus();
        return;
    }

    const name = String(formData.get("name") || "").trim();
    const company = String(formData.get("company") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const service = String(formData.get("service") || "").trim();
    const projectMessage = String(formData.get("message") || "").trim();

    const whatsappMessage = [
        "Olá! Gostaria de solicitar um orçamento com a Nova Aliança.",
        "",
        `*Nome:* ${name}`,
        `*Empresa:* ${company || "Não informada"}`,
        `*Telefone:* ${phone}`,
        `*Serviço de interesse:* ${service}`,
        `*Detalhes do projeto:* ${projectMessage}`,
    ].join("\n");

    openWhatsApp(whatsappMessage);
});
