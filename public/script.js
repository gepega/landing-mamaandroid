const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector("#menu");
const leadForm = document.querySelector("#leadForm");
const coverageForm = document.querySelector("#coverageForm");
const coverageSection = document.querySelector("#cobertura");
const coverageTriggers = document.querySelectorAll("[data-open-coverage]");
const cookieBanner = document.querySelector("#cookieBanner");
const cookieOptions = document.querySelector("#cookieOptions");
const analyticsConsent = document.querySelector("#analyticsConsent");
const cookieSave = document.querySelector('[data-cookie-action="save"]');
const COOKIE_KEY = "mamaandroid_cookie_consent";
const WHATSAPP_NUMBER = "34641954160";

if (analyticsConsent) {
  analyticsConsent.checked = false;
}

menuToggle?.addEventListener("click", () => {
  const open = !menu.classList.contains("open");
  menu.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
});

const trackEvent = (name, params = {}) => {
  if (window.gtag) {
    window.gtag("event", name, params);
  }
};

const getClickLabel = (element) => {
  const text = element.textContent?.replace(/\s+/g, " ").trim();
  return text || element.getAttribute("aria-label") || element.getAttribute("href") || "sin_etiqueta";
};

const openWhatsApp = (message) => {
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
};

const scrollToSection = (target, extraOffset = 0) => {
  if (!target) return;
  const headerHeight = document.querySelector(".site-header")?.offsetHeight || 0;
  const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 18 + extraOffset;
  window.scrollTo({ top, behavior: "smooth" });
};

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    if (link.matches("[data-open-coverage]")) return;
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    scrollToSection(target);
    menu.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

coverageTriggers.forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    coverageSection.hidden = false;
    trackEvent("coverage_form_open", { source: "hero_coverage_button" });
    const mobileOffset = window.matchMedia("(max-width: 620px)").matches ? 36 : 0;
    requestAnimationFrame(() => {
      scrollToSection(coverageSection, mobileOffset);
      setTimeout(() => scrollToSection(coverageSection, mobileOffset), 120);
      coverageForm?.querySelector('[name="nombre"]')?.focus({ preventScroll: true });
    });
  });
});

leadForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!leadForm.reportValidity()) {
    return;
  }
  const formData = new FormData(leadForm);
  const nombre = String(formData.get("nombre") || "").trim();
  const telefono = String(formData.get("telefono") || "").trim();
  const necesidad = String(formData.get("necesidad") || "").trim();
  const message = `Hola, os contacto desde la web de Mamaandroid. Me llamo ${nombre}, mi número es ${telefono} y necesitaba esto: ${necesidad}`;
  trackEvent("lead_form_submit", { source: "te_llamamos" });
  openWhatsApp(message);
});

const coverageNumberInput = coverageForm?.querySelector('[name="numero"]');
const coverageWithoutNumber = coverageForm?.querySelector('[name="sinNumero"]');

coverageWithoutNumber?.addEventListener("change", () => {
  const withoutNumber = Boolean(coverageWithoutNumber.checked);
  coverageNumberInput.required = !withoutNumber;
  coverageNumberInput.disabled = withoutNumber;
  if (withoutNumber) {
    coverageNumberInput.value = "";
  }
});

coverageForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!coverageForm.reportValidity()) {
    return;
  }
  const formData = new FormData(coverageForm);
  const nombre = String(formData.get("nombre") || "").trim();
  const telefono = String(formData.get("telefono") || "").trim();
  const codigoPostal = String(formData.get("codigoPostal") || "").trim();
  const calle = String(formData.get("calle") || "").trim();
  const sinNumero = Boolean(formData.get("sinNumero"));
  const numero = sinNumero ? "S/N" : String(formData.get("numero") || "").trim();
  const observaciones = String(formData.get("observaciones") || "").trim();
  const message = [
    "Hola, le escribo desde la web tiendasmamaandroid.com.",
    "Le dejo mis datos para consultar cobertura DIGI:",
    "",
    `Nombre: ${nombre}`,
    `Teléfono: ${telefono}`,
    `Código postal: ${codigoPostal}`,
    `Calle: ${calle}`,
    `Número: ${numero}`,
    observaciones ? `Observaciones: ${observaciones}` : ""
  ].filter(Boolean).join("\n");
  trackEvent("coverage_form_submit", { source: "consulta_cobertura" });
  openWhatsApp(message);
});

document.addEventListener("click", (event) => {
  const element = event.target.closest("a, button");
  if (!element) return;

  const href = element.getAttribute("href") || "";
  const label = getClickLabel(element);
  const cookieAction = element.dataset.cookieAction;

  if (element.matches("[data-open-coverage]")) return;
  if (element.closest("#leadForm") || element.closest("#coverageForm")) return;

  if (cookieAction) {
    trackEvent("cookie_action", { action: cookieAction });
    return;
  }

  if (href.startsWith("tel:")) {
    trackEvent("phone_click", { label });
    return;
  }

  if (href.includes("wa.me/")) {
    let destination = "general";
    if (href.includes("614386289")) destination = "rivero";
    if (href.includes("641954160")) destination = "atrio";
    trackEvent("whatsapp_click", { destination, label });
    return;
  }

  if (href.includes("google.com/maps")) {
    trackEvent("directions_click", { label });
    return;
  }

  if (href.includes("share.google")) {
    trackEvent("google_profile_click", { label });
    return;
  }

  if (href.startsWith("#")) {
    trackEvent("section_nav_click", { section: href, label });
    return;
  }

  if (href.endsWith(".html")) {
    trackEvent("legal_link_click", { page: href, label });
  }
});

const loadGoogleAnalytics = () => {
  const measurementId = window.MAMAANDROID_GA_ID;
  if (!measurementId || measurementId === "G-XXXXXXXXXX" || window.gtag) {
    return;
  }
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(){ window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", measurementId, { anonymize_ip: true });
};

const saveCookieConsent = (analytics) => {
  localStorage.setItem(COOKIE_KEY, JSON.stringify({ analytics, date: new Date().toISOString() }));
  cookieBanner.hidden = true;
  if (analytics) {
    loadGoogleAnalytics();
    trackEvent("cookie_analytics_accept");
  }
};

const existingConsent = localStorage.getItem(COOKIE_KEY);
if (existingConsent) {
  try {
    const consent = JSON.parse(existingConsent);
    if (consent.analytics) loadGoogleAnalytics();
  } catch {
    localStorage.removeItem(COOKIE_KEY);
    cookieBanner.hidden = false;
  }
} else if (cookieBanner) {
  cookieBanner.hidden = false;
}

cookieBanner?.addEventListener("click", (event) => {
  const action = event.target.closest("[data-cookie-action]")?.dataset.cookieAction;
  if (!action) return;
  if (action === "accept") saveCookieConsent(true);
  if (action === "reject") saveCookieConsent(false);
  if (action === "settings") {
    cookieOptions.hidden = false;
    cookieSave.hidden = false;
    if (analyticsConsent) analyticsConsent.checked = false;
  }
  if (action === "save") saveCookieConsent(Boolean(analyticsConsent?.checked));
});
