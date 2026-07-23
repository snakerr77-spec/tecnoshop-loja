"use strict";

(() => {
  const THEME_KEY = "tecnoshop-color-theme";

  const icons = {
    dark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 15.2A8.5 8.5 0 0 1 8.8 3.8 8.7 8.7 0 1 0 20.2 15.2Z"></path></svg>',
    light: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path></svg>'
  };

  function currentTheme() {
    return document.documentElement.dataset.theme === "light" ? "light" : "dark";
  }

  function updateControls(theme) {
    const nextTheme = theme === "dark" ? "light" : "dark";
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.setAttribute("aria-label", `Ativar modo ${nextTheme === "light" ? "claro" : "escuro"}`);
      button.setAttribute("title", `Ativar modo ${nextTheme === "light" ? "claro" : "escuro"}`);
      button.querySelectorAll("[data-theme-icon]").forEach((icon) => { icon.innerHTML = icons[theme]; });
      button.querySelectorAll("[data-theme-label]").forEach((label) => { label.textContent = theme === "dark" ? "Modo escuro" : "Modo claro"; });
      button.querySelectorAll("[data-theme-next]").forEach((label) => { label.textContent = nextTheme === "light" ? "Usar tema claro" : "Usar tema escuro"; });
    });
  }

  function applyTheme(theme, save = true) {
    const selected = theme === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = selected;
    document.documentElement.style.colorScheme = selected;
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.setAttribute("content", selected === "light" ? "#f3eee6" : "#080808");
    if (save) {
      try { localStorage.setItem(THEME_KEY, selected); } catch { /* O tema continua funcionando sem armazenamento. */ }
    }
    updateControls(selected);
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyTheme(currentTheme(), false);
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.addEventListener("click", () => applyTheme(currentTheme() === "dark" ? "light" : "dark"));
    });
  });

  window.addEventListener("storage", (event) => {
    if (event.key === THEME_KEY && event.newValue) applyTheme(event.newValue, false);
  });
})();
