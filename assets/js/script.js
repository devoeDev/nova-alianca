* =========================================================
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
    document.querySelectorAll("[data-reveal], .motion-card").forEach((element) => {
        element.style.opacity = "1";
        element.style.transform = "none";
        element.style.filter = "none";
    });
};

const setupSmoothParallax = () => {
    const parallaxElements = [...document.querySelectorAll("[data-parallax]")];
    if (!parallaxElements.length || prefersReducedMotion) return;

    let frameRequested = false;

    const updateParallax = () => {
        const viewportCenter = window.innerHeight / 2;

        parallaxElements.forEach((element) => {
            const rect = element.getBoundingClientRect();
            const intensity = Number(element.dataset.parallax || 0.03);
            const elementCenter = rect.top + rect.height / 2;
            const offset = Math.max(-28, Math.min(28, (viewportCenter - elementCenter) * intensity));
            element.style.setProperty("--parallax-y", `${offset.toFixed(2)}px`);
        });

        frameRequested = false;
    };

    const requestParallaxUpdate = () => {
        if (frameRequested) return;
        frameRequested = true;
        window.requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
    window.addEventListener("resize", requestParallaxUpdate);
};

const initializeMotionAnimations = () => {
    if (!motionApi || prefersReducedMotion) {
        showAllRevealElements();
        setupSmoothParallax();
        return;
    }

    const { animate, inView, stagger } = motionApi;
    const fluidEase = [0.22, 1, 0.36, 1];
    document.documentElement.classList.add("motion-running");

    animate(
        ".site-header",
        { opacity: [0, 1], y: [-22, 0] },
        { duration: 0.78, ease: fluidEase }
    );

    const heroSequence = [
        [".hero .eyebrow", { opacity: [0, 1], x: [-28, 0], filter: ["blur(6px)", "blur(0px)"] }, { duration: 0.7 }],
        [".hero h1", { opacity: [0, 1], y: [48, 0], filter: ["blur(10px)", "blur(0px)"] }, { at: 0.08, duration: 1.02 }],
        [".hero-description", { opacity: [0, 1], y: [26, 0] }, { at: 0.24, duration: 0.82 }],
        [".hero-actions > *", { opacity: [0, 1], y: [22, 0] }, { at: 0.34, delay: stagger(0.1), duration: 0.7 }],
        [".hero-trust li", { opacity: [0, 1], x: [-16, 0] }, { at: 0.48, delay: stagger(0.08), duration: 0.56 }],
        [".industrial-panel", { opacity: [0, 1], scale: [0.925, 1], rotate: [-1.2, 0], filter: ["blur(7px)", "blur(0px)"] }, { at: 0.14, duration: 1.12 }],
        [".floating-badge", { opacity: [0, 1], scale: [0.76, 1] }, { at: 0.62, delay: stagger(0.13), duration: 0.68 }],
    ];

    animate(heroSequence, {
        defaultTransition: { ease: fluidEase },
    });

    const drawingPaths = document.querySelectorAll(".industrial-drawing g[stroke] path");
    if (drawingPaths.length) {
        animate(
            drawingPaths,
            { pathLength: [0, 1], opacity: [0.18, 1] },
            {
                delay: stagger(0.045, { startDelay: 0.38 }),
                duration: 1.28,
                ease: "easeInOut",
            }
        );
    }

    const drawingPoints = document.querySelectorAll(".industrial-drawing circle");
    if (drawingPoints.length) {
        animate(
            drawingPoints,
            { opacity: [0, 1], scale: [0, 1] },
            { delay: stagger(0.07, { startDelay: 1.12 }), duration: 0.5, ease: "backOut" }
        );
    }

    animate(
        ".badge-quality",
        { y: [0, -8, 0] },
        { duration: 5.4, repeat: Infinity, ease: "easeInOut" }
    );

    animate(
        ".badge-experience",
        { y: [0, 7, 0], rotate: [0, 0.8, 0] },
        { duration: 6.1, repeat: Infinity, ease: "easeInOut" }
    );

    animate(
        ".visual-glow",
        { opacity: [0.08, 0.16, 0.08], scale: [0.96, 1.08, 0.96] },
        { duration: 6.8, repeat: Infinity, ease: "easeInOut" }
    );

    // Grupos recebem um único stagger, evitando animações duplicadas nos cards.
    const animatedGroups = [
        [".services-grid", ".service-card"],
        [".advantages-list", ".advantage-card"],
        [".process-grid", ".process-card"],
        [".stats-strip", "article"],
        [".welding-features", "article"],
    ];

    const groupedItems = new Set();

    animatedGroups.forEach(([containerSelector, itemSelector]) => {
        const container = document.querySelector(containerSelector);
        const items = container ? [...container.querySelectorAll(itemSelector)] : [];
        if (!container || !items.length) return;

        items.forEach((item) => {
            groupedItems.add(item);
            item.classList.add("motion-card");
            item.style.opacity = "0";
            item.style.transform = "translateY(38px) scale(0.97)";
            item.style.filter = "blur(7px)";
        });

        inView(
            container,
            () => {
                animate(
                    items,
                    {
                        opacity: [0, 1],
                        y: [38, 0],
                        scale: [0.97, 1],
                        filter: ["blur(7px)", "blur(0px)"],
                    },
                    {
                        delay: stagger(0.105),
                        duration: 0.86,
                        ease: fluidEase,
                    }
                );
            },
            { amount: 0.1, margin: "0px 0px -35px 0px" }
        );
    });

    document.querySelectorAll("[data-reveal]").forEach((element) => {
        const isHeroElement = element.closest(".hero") && !element.classList.contains("stats-strip");
        if (isHeroElement || groupedItems.has(element)) return;

        const direction = element.dataset.revealDirection || "up";
        const initialState = {
            opacity: 0,
            x: direction === "left" ? -54 : direction === "right" ? 54 : 0,
            y: direction === "up" ? 44 : direction === "down" ? -44 : 0,
            scale: 0.985,
            filter: "blur(9px)",
        };

        element.style.opacity = "0";
        element.style.transform = `translate3d(${initialState.x}px, ${initialState.y}px, 0) scale(${initialState.scale})`;
        element.style.filter = initialState.filter;

        inView(
            element,
            () => {
                const delay = Number(element.dataset.delay || 0) / 1000;

                animate(
                    element,
                    {
                        opacity: [0, 1],
                        x: [initialState.x, 0],
                        y: [initialState.y, 0],
                        scale: [initialState.scale, 1],
                        filter: [initialState.filter, "blur(0px)"],
                    },
                    {
                        delay,
                        duration: 0.96,
                        ease: fluidEase,
                    }
                );
            },
            { amount: 0.14, margin: "0px 0px -48px 0px" }
        );
    });

    const weldingVisual = document.querySelector(".welding-visual");
    if (weldingVisual) {
        inView(
            weldingVisual,
            () => {
                animate(
                    ".welding-torch",
                    { x: [-8, 8, -8], y: [-3, 4, -3], rotate: [4, 6, 4] },
                    { duration: 5.8, repeat: Infinity, ease: "easeInOut" }
                );

                animate(
                    ".welding-core",
                    { scale: [0.82, 1.28, 0.9, 1.12, 0.82], opacity: [0.82, 1, 0.9, 1, 0.82] },
                    { duration: 1.05, repeat: Infinity, ease: "easeInOut" }
                );

                animate(
                    ".welding-flare",
                    { scale: [0.9, 1.12, 0.96, 1.08, 0.9], opacity: [0.48, 0.88, 0.56, 0.78, 0.48] },
                    { duration: 1.35, repeat: Infinity, ease: "easeInOut" }
                );

                animate(
                    ".welding-glow",
                    { opacity: [0.09, 0.18, 0.1], scale: [0.94, 1.08, 0.94] },
                    { duration: 4.8, repeat: Infinity, ease: "easeInOut" }
                );
            },
            { amount: 0.25 }
        );
    }

    const interactiveElements = document.querySelectorAll(
        ".button, .service-card, .advantage-card, .process-card, .welding-features article, .social-links a, .social-links button, .floating-whatsapp"
    );

    interactiveElements.forEach((element) => {
        element.addEventListener("pointerenter", () => {
            animate(element, { scale: 1.016 }, { duration: 0.32, ease: fluidEase });
        });

        element.addEventListener("pointerleave", () => {
            animate(element, { scale: 1 }, { duration: 0.42, ease: fluidEase });
        });

        element.addEventListener("pointerdown", () => {
            animate(element, { scale: 0.975 }, { duration: 0.12 });
        });

        element.addEventListener("pointerup", () => {
            animate(element, { scale: 1.016 }, { duration: 0.24, ease: fluidEase });
        });
    });

    setupSmoothParallax();
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
