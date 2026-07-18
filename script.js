const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector("#menu");
const leadForm = document.querySelector("#leadForm");
const cookieBanner = document.querySelector("#cookieBanner");
const cookieOptions = document.querySelector("#cookieOptions");
const analyticsConsent = document.querySelector("#analyticsConsent");
const cookieSave = document.querySelector('[data-cookie-action="save"]');
const COOKIE_KEY = "mamaandroid_cookie_consent";

menuToggle?.addEventListener("click", () => {
  const open = !menu.classList.contains("open");
  menu.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    const headerHeight = document.querySelector(".site-header")?.offsetHeight || 0;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 18;
    window.scrollTo({ top, behavior: "smooth" });
    menu.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
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
  const message = `Hola, os contacto desde la web de Tiendas Mamaandroid. Me llamo ${nombre}, mi número es ${telefono} y necesitaba esto: ${necesidad}`;
  window.open(`https://wa.me/34641954160?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
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
  if (analytics) loadGoogleAnalytics();
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
  }
  if (action === "save") saveCookieConsent(Boolean(analyticsConsent?.checked));
});
