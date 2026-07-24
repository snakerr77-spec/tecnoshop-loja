"use strict";

const WHATSAPP_NUMBER = "5515996007266";
const WHATSAPP_BASE = `https://wa.me/${WHATSAPP_NUMBER}`;
const STORAGE_KEY = "tecnoshop-cerquilho-lista";
const CATALOG_STORAGE_KEY = "tecnoshop-cerquilho-products-v1";
const API_BASE = String(window.TECNOSHOP_CONFIG?.apiUrl || "").replace(/\/$/, "");

const fallbackProducts = [
  {
    id: "iphone-15-pro-max",
    name: "iPhone 15 Pro Max",
    category: "iPhones",
    condition: "Seminovo premium",
    subtitle: "Desempenho Pro, acabamento premium",
    price: 4200,
    priceLabel: "a partir de",
    publishedPrice: true,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=88",
    visualLabel: "15 PRO MAX",
    accent: "orange",
    specs: ["Seminovo selecionado", "Aparelho revisado", "Consulte cores e capacidade"],
    description: "Uma opção premium para quem busca câmeras avançadas, ótima autonomia e desempenho de alto nível pagando menos."
  },
  {
    id: "iphone-17-pro-max",
    name: "iPhone 17 Pro Max",
    category: "iPhones",
    condition: "Lacrado",
    subtitle: "Linha Pro de última geração",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=88",
    visualLabel: "17 PRO MAX",
    accent: "gold",
    specs: ["Produto lacrado", "Consulte capacidades", "Condições em até 18x"],
    description: "Para quem procura a experiência mais avançada da linha iPhone. Consulte o estoque disponível diretamente com a loja."
  },
  {
    id: "iphone-15-256",
    name: "iPhone 15",
    category: "iPhones",
    condition: "Consulte novo e seminovo",
    subtitle: "256 GB • consulte cores",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=88",
    visualLabel: "IPHONE 15",
    accent: "blue",
    specs: ["Opções de 256 GB", "Consulte as cores", "Aceitamos iPhone na troca"],
    description: "Design moderno, USB-C e excelente conjunto de câmeras para uso diário, trabalho e criação de conteúdo."
  },
  {
    id: "redmi-14c",
    name: "Redmi 14C",
    category: "Android",
    condition: "Novo",
    subtitle: "Tela ampla e bateria para o dia todo",
    image: "https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=1000&q=88",
    visualLabel: "ANDROID",
    accent: "violet",
    specs: ["Sistema Android", "Consulte memória e cores", "Parcelamento disponível"],
    description: "Smartphone Android para quem busca uma tela confortável, boa autonomia e ótimo custo-benefício."
  },
  {
    id: "macbook",
    name: "MacBook",
    category: "Apple",
    condition: "Novos e seminovos",
    subtitle: "Mobilidade e desempenho para criar",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=88",
    visualLabel: "MACBOOK",
    accent: "silver",
    specs: ["Consulte modelos disponíveis", "Opções novas e seminovas", "Atendimento personalizado"],
    description: "Ideal para estudos, trabalho e produção criativa. A equipe ajuda você a encontrar a configuração certa para sua rotina."
  },
  {
    id: "ipad",
    name: "iPad",
    category: "Apple",
    condition: "Consulte modelos",
    subtitle: "Trabalho, estudo e entretenimento",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=88",
    visualLabel: "IPAD",
    accent: "blue",
    specs: ["Consulte gerações", "Capacidades variadas", "Acessórios compatíveis"],
    description: "Uma experiência versátil para estudar, trabalhar, desenhar e consumir conteúdo em qualquer lugar."
  },
  {
    id: "smartwatch",
    name: "Smartwatches",
    category: "Acessórios",
    condition: "Vários modelos",
    subtitle: "Sua rotina conectada no pulso",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1000&q=88",
    visualLabel: "SMARTWATCH",
    accent: "green",
    specs: ["Modelos para iOS e Android", "Consulte funções", "Pulseiras e acessórios"],
    description: "Acompanhe notificações, exercícios e sua rotina com opções para diferentes estilos e necessidades."
  },
  {
    id: "scooter-dx5",
    name: "Scooter elétrica DX5",
    category: "Mobilidade",
    condition: "SpeedMob",
    subtitle: "Mobilidade urbana com energia elétrica",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=88",
    visualLabel: "ELÉTRICA",
    accent: "orange",
    specs: ["Consulte disponibilidade", "Condições em até 18x", "Atendimento na loja"],
    description: "Uma alternativa prática para deslocamentos urbanos. Consulte especificações, autonomia e disponibilidade com a equipe."
  }
];

const categoryOrder = ["iPhones", "Android", "Apple", "Acessórios", "Mobilidade"];
let products = [...fallbackProducts];
let activeCategory = "Todos";
let query = "";
let quoteIds = loadQuoteIds();
let selectedProductId = null;
let toastTimer = null;

const elements = {
  productGrid: document.querySelector("#productGrid"),
  emptyState: document.querySelector("#emptyState"),
  categoryTabs: document.querySelector("#categoryTabs"),
  productSearch: document.querySelector("#productSearch"),
  clearSearch: document.querySelector("#clearSearch"),
  menuOverlay: document.querySelector("#menuOverlay"),
  quoteOverlay: document.querySelector("#quoteOverlay"),
  productOverlay: document.querySelector("#productOverlay"),
  quoteBody: document.querySelector("#quoteBody"),
  quoteSummary: document.querySelector("#quoteSummary"),
  sendQuote: document.querySelector("#sendQuote"),
  modalImage: document.querySelector("#modalImage"),
  modalCategory: document.querySelector("#modalCategory"),
  modalTitle: document.querySelector("#modal-product-title"),
  modalDescription: document.querySelector("#modalDescription"),
  modalSpecs: document.querySelector("#modalSpecs"),
  modalPriceLabel: document.querySelector("#modalPriceLabel"),
  modalPrice: document.querySelector("#modalPrice"),
  modalWhatsApp: document.querySelector("#modalWhatsApp"),
  modalAdd: document.querySelector("#modalAdd"),
  toast: document.querySelector("#toast"),
  toastMessage: document.querySelector("#toastMessage"),
  productTotal: document.querySelector("[data-product-total]"),
  pageProgress: document.querySelector("#pageProgress"),
  siteHeader: document.querySelector("#siteHeader"),
  heroStage: document.querySelector("#heroStage")
};

function iconSvg(name, size = 20) {
  const paths = {
    search: '<circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path>',
    arrow: '<path d="M5 12h14"></path><path d="m13 6 6 6-6 6"></path>',
    bag: '<path d="M6 8h12l1 12H5L6 8Z"></path><path d="M9 9V6a3 3 0 0 1 6 0v3"></path>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"></path>',
    close: '<path d="m6 6 12 12M18 6 6 18"></path>',
    pin: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"></path><circle cx="12" cy="10" r="2.5"></circle>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.7 19.7 0 0 1-8.6-3.1 19.3 19.3 0 0 1-6-6A19.7 19.7 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c1 .3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z"></path>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><path d="M17.5 6.5h.01"></path>',
    check: '<path d="m5 12 4 4L19 6"></path>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"></path>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"></path><path d="m9 12 2 2 4-4"></path>',
    refresh: '<path d="M20 7h-5V2"></path><path d="M20 7a9 9 0 1 0 1 8"></path>',
    card: '<rect x="2" y="5" width="20" height="14" rx="2"></rect><path d="M2 10h20"></path>'
  };
  const content = paths[name] || '<circle cx="12" cy="12" r="9"></circle>';
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${content}</svg>`;
}

function hydrateIcons(root = document) {
  root.querySelectorAll("[data-icon]").forEach((element) => {
    element.innerHTML = iconSvg(element.dataset.icon, Number(element.dataset.size) || 20);
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;"
  })[character]);
}

function resolveImageUrl(url) {
  return String(url || "");
}

function formatPrice(price) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0
  }).format(price);
}

function whatsappUrl(message) {
  return `${WHATSAPP_BASE}?text=${encodeURIComponent(message)}`;
}

function loadQuoteIds() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved.filter((id) => products.some((product) => product.id === id)) : [];
  } catch {
    return [];
  }
}

function saveQuoteIds() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quoteIds));
  } catch {
    // O catálogo continua funcionando caso o navegador bloqueie o armazenamento.
  }
}

function normalizeProduct(product, index = 0) {
  return {
    id: String(product.id || `produto-${Date.now()}-${index}`),
    name: String(product.name || "Produto sem nome"),
    category: String(product.category || "Outros"),
    condition: String(product.condition || "Consulte"),
    subtitle: String(product.subtitle || "Consulte disponibilidade"),
    price: Number(product.price) > 0 ? Number(product.price) : null,
    priceLabel: String(product.priceLabel || "a partir de"),
    publishedPrice: Boolean(product.publishedPrice),
    image: String(product.image || ""),
    visualLabel: String(product.visualLabel || product.name || "PRODUTO").toUpperCase(),
    accent: String(product.accent || "orange"),
    specs: Array.isArray(product.specs) ? product.specs.map(String).filter(Boolean) : [],
    description: String(product.description || product.subtitle || "Consulte os detalhes com a equipe."),
    active: product.active !== false
  };
}

function loadLocalCatalog() {
  try {
    const saved = JSON.parse(localStorage.getItem(CATALOG_STORAGE_KEY) || "null");
    return Array.isArray(saved) ? saved : null;
  } catch {
    return null;
  }
}

function availableCategories() {
  const found = [...new Set(products.map((product) => product.category).filter(Boolean))];
  const ordered = categoryOrder.filter((category) => found.includes(category));
  const custom = found.filter((category) => !categoryOrder.includes(category)).sort((a, b) => a.localeCompare(b, "pt-BR"));
  return ["Todos", ...ordered, ...custom];
}

function applyCatalog(data) {
  products = data.map(normalizeProduct).filter((product) => product.active);
  quoteIds = quoteIds.filter((id) => products.some((product) => product.id === id));
  if (!availableCategories().includes(activeCategory)) activeCategory = "Todos";
  saveQuoteIds();
  renderCategories();
  renderProducts();
  renderQuote();
  updateCounters();
}

function getProduct(id) {
  return products.find((product) => product.id === id);
}

function renderCategories() {
  elements.categoryTabs.innerHTML = availableCategories().map((category) => {
    const count = category === "Todos" ? "" : `<small>${products.filter((product) => product.category === category).length}</small>`;
    return `<button type="button" data-category="${escapeHtml(category)}" class="${activeCategory === category ? "active" : ""}" role="tab" aria-selected="${activeCategory === category}">${escapeHtml(category)}${count}</button>`;
  }).join("");
}

function filteredProducts() {
  const normalized = query.toLocaleLowerCase("pt-BR").trim();
  return products.filter((product) => {
    const categoryMatches = activeCategory === "Todos" || product.category === activeCategory;
    const text = `${product.name} ${product.subtitle} ${product.condition} ${product.category}`.toLocaleLowerCase("pt-BR");
    return categoryMatches && (!normalized || text.includes(normalized));
  });
}

function productCard(product, index = 0) {
  const inQuote = quoteIds.includes(product.id);
  const price = product.price
    ? `<small>${escapeHtml(product.priceLabel)}</small><strong>${formatPrice(product.price)}</strong>`
    : "<small>valor atualizado</small><strong>Consulte</strong>";
  return `
    <article class="product-card" data-tilt style="--card-delay:${Math.min(index * 55, 330)}ms">
      <button class="product-image" type="button" data-open-product="${product.id}" aria-label="Ver detalhes de ${escapeHtml(product.name)}">
        <span class="visual-accent accent-${escapeHtml(product.accent)}"></span>
        <span class="visual-word">${escapeHtml(product.visualLabel)}</span>
        <img src="${escapeHtml(resolveImageUrl(product.image))}" alt="Imagem ilustrativa de ${escapeHtml(product.name)}" loading="lazy" referrerpolicy="no-referrer">
        <span class="condition-pill">${escapeHtml(product.condition)}</span>
        ${product.publishedPrice ? '<span class="verified-pill"><i class="icon" data-icon="check" data-size="14"></i> preço publicado</span>' : ""}
      </button>
      <div class="product-content">
        <span class="product-category">${escapeHtml(product.category)}</span>
        <h3>${escapeHtml(product.name)}</h3><p>${escapeHtml(product.subtitle)}</p>
        <div class="product-price">${price}</div>
        <div class="product-actions">
          <button class="details-button" type="button" data-open-product="${product.id}">Ver detalhes</button>
          <button class="add-button ${inQuote ? "added" : ""}" type="button" data-toggle-product="${product.id}" aria-label="${inQuote ? "Remover" : "Adicionar"} ${escapeHtml(product.name)} ${inQuote ? "da" : "à"} lista"><i class="icon" data-icon="${inQuote ? "check" : "bag"}"></i></button>
        </div>
      </div>
    </article>`;
}

function renderProducts() {
  const visible = filteredProducts();
  elements.productGrid.innerHTML = visible.map((product, index) => productCard(product, index)).join("");
  elements.productGrid.hidden = visible.length === 0;
  elements.emptyState.hidden = visible.length > 0;
  elements.clearSearch.hidden = query.length === 0;
  if (elements.productTotal) {
    const suffix = visible.length === 1 ? "produto disponível" : "produtos disponíveis";
    elements.productTotal.textContent = `${visible.length} ${suffix}`;
  }
  hydrateIcons(elements.productGrid);
  elements.productGrid.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => image.classList.add("image-error"), { once: true });
  });
  setupTilt(elements.productGrid);
}

function updateCounters() {
  document.querySelectorAll("[data-quote-count]").forEach((counter) => {
    counter.textContent = quoteIds.length;
    if (counter.closest(".mobile-bag")) counter.hidden = quoteIds.length === 0;
  });
  const quoteButton = document.querySelector("#openQuote");
  quoteButton.setAttribute("aria-label", `Abrir lista com ${quoteIds.length} ${quoteIds.length === 1 ? "item" : "itens"}`);
}

function quoteProducts() {
  return products.filter((product) => quoteIds.includes(product.id));
}

function quoteMessage(items) {
  return `Olá! Montei uma lista no site da TecnoShop Cerquilho e gostaria de confirmar valores e disponibilidade:\n\n${items.map((product, index) => `${index + 1}. ${product.name} — ${product.condition}`).join("\n")}\n\nPode me ajudar?`;
}

function renderQuote() {
  const items = quoteProducts();
  elements.quoteSummary.textContent = `${items.length} ${items.length === 1 ? "produto" : "produtos"}`;
  if (items.length) {
    elements.quoteBody.innerHTML = items.map((product) => `
      <div class="quote-item">
        <div class="quote-thumb"><img src="${escapeHtml(resolveImageUrl(product.image))}" alt="" referrerpolicy="no-referrer"></div>
        <div><small>${escapeHtml(product.condition)}</small><strong>${escapeHtml(product.name)}</strong><span>${product.price ? `${escapeHtml(product.priceLabel)} ${formatPrice(product.price)}` : "Valor sob consulta"}</span></div>
        <button type="button" data-remove-quote="${product.id}" aria-label="Remover ${escapeHtml(product.name)}"><i class="icon" data-icon="close" data-size="17"></i></button>
      </div>`).join("");
    elements.sendQuote.href = whatsappUrl(quoteMessage(items));
    elements.sendQuote.classList.remove("disabled");
  } else {
    elements.quoteBody.innerHTML = `<div class="quote-empty"><span><i class="icon" data-icon="bag" data-size="30"></i></span><h3>Sua lista está vazia</h3><p>Adicione os produtos que interessam para enviar tudo de uma vez à loja.</p><button type="button" data-explore-products>Explorar produtos</button></div>`;
    elements.sendQuote.removeAttribute("href");
    elements.sendQuote.classList.add("disabled");
  }
  hydrateIcons(elements.quoteBody);
}

function renderModalButton() {
  const product = getProduct(selectedProductId);
  if (!product) return;
  const selected = quoteIds.includes(product.id);
  elements.modalAdd.className = selected ? "selected" : "";
  elements.modalAdd.innerHTML = `<i class="icon" data-icon="${selected ? "check" : "bag"}"></i> ${selected ? "Adicionado à lista" : "Adicionar à lista"}`;
  hydrateIcons(elements.modalAdd);
}

function openProduct(id) {
  const product = getProduct(id);
  if (!product) return;
  selectedProductId = id;
  elements.modalImage.innerHTML = `<span class="visual-accent accent-${escapeHtml(product.accent)}"></span><span class="visual-word">${escapeHtml(product.visualLabel)}</span><img src="${escapeHtml(resolveImageUrl(product.image))}" alt="Imagem ilustrativa de ${escapeHtml(product.name)}" referrerpolicy="no-referrer"><span class="modal-image-note">Imagem ilustrativa</span>`;
  elements.modalCategory.textContent = `${product.category} • ${product.condition}`;
  elements.modalTitle.textContent = product.name;
  elements.modalDescription.textContent = product.description;
  elements.modalSpecs.innerHTML = product.specs.map((spec) => `<li><i class="icon" data-icon="check" data-size="16"></i> ${escapeHtml(spec)}</li>`).join("");
  elements.modalPriceLabel.textContent = product.price ? product.priceLabel : "valor atualizado";
  elements.modalPrice.textContent = product.price ? formatPrice(product.price) : "Consulte no WhatsApp";
  elements.modalWhatsApp.href = whatsappUrl(`Olá! Vi o ${product.name} no site da TecnoShop Cerquilho e gostaria de confirmar o valor, as condições e a disponibilidade.`);
  hydrateIcons(elements.productOverlay);
  renderModalButton();
  openOverlay(elements.productOverlay);
}

function toggleQuote(id) {
  const product = getProduct(id);
  if (!product) return;
  const exists = quoteIds.includes(id);
  quoteIds = exists ? quoteIds.filter((savedId) => savedId !== id) : [...quoteIds, id];
  saveQuoteIds();
  updateCounters();
  renderProducts();
  renderQuote();
  renderModalButton();
  showToast(exists ? "Item removido da sua lista" : "Item adicionado à sua lista");
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  elements.toastMessage.textContent = message;
  elements.toast.hidden = false;
  toastTimer = window.setTimeout(() => { elements.toast.hidden = true; }, 2400);
}

function openOverlay(overlay) {
  overlay.hidden = false;
  document.body.classList.add("modal-open");
}

function closeOverlay(overlay) {
  overlay.hidden = true;
  if (overlay === elements.productOverlay) selectedProductId = null;
  const anyOpen = [elements.menuOverlay, elements.quoteOverlay, elements.productOverlay].some((item) => !item.hidden);
  document.body.classList.toggle("modal-open", anyOpen);
}


function setupRevealMotion() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.body.classList.add("motion-ready");
  document.querySelectorAll("[data-reveal]").forEach((element) => {
    element.style.setProperty("--reveal-delay", `${Number(element.dataset.revealDelay) || 0}ms`);
  });
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -5%" });
  document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
}

function setupTilt(root = document) {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  root.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-4px)`;
    });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  });
}

function setupHeroParallax() {
  const stage = elements.heroStage;
  if (!stage || !window.matchMedia("(hover: hover) and (pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  stage.addEventListener("pointermove", (event) => {
    const rect = stage.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    stage.style.setProperty("--pointer-x", x.toFixed(3));
    stage.style.setProperty("--pointer-y", y.toFixed(3));
  });
  stage.addEventListener("pointerleave", () => {
    stage.style.setProperty("--pointer-x", "0");
    stage.style.setProperty("--pointer-y", "0");
  });
}

function setupScrollUI() {
  const sections = [...document.querySelectorAll("main section[id]")];
  const links = [...document.querySelectorAll(".desktop-nav a[href^='#']")];
  const update = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    if (elements.pageProgress) elements.pageProgress.style.width = `${Math.min(100, Math.max(0, scrollTop / max * 100))}%`;
    if (elements.siteHeader) elements.siteHeader.classList.toggle("scrolled", scrollTop > 12);
    let activeId = "inicio";
    sections.forEach((section) => { if (section.getBoundingClientRect().top <= 150) activeId = section.id; });
    links.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`));
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

function setupMagneticButtons() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll(".magnetic").forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * .12;
      const y = (event.clientY - rect.top - rect.height / 2) * .14;
      button.style.transform = `translate(${x}px,${y}px)`;
    });
    button.addEventListener("pointerleave", () => { button.style.transform = ""; });
  });
}

function setupWhatsAppLinks() {
  document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    link.href = whatsappUrl(link.dataset.whatsapp);
  });
  document.querySelectorAll("[data-open-whatsapp]").forEach((button) => {
    button.addEventListener("click", () => window.open(whatsappUrl(button.dataset.openWhatsapp), "_blank", "noopener,noreferrer"));
  });
}

async function loadProducts() {
  const localCatalog = loadLocalCatalog();

  if (!API_BASE) {
    if (localCatalog) applyCatalog(localCatalog);
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/api/products`, {
      headers: { Accept: "application/json" },
      cache: "no-store"
    });
    if (!response.ok) throw new Error(`API respondeu com status ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("Formato de produtos inválido");
    applyCatalog(data);
  } catch (error) {
    if (localCatalog) applyCatalog(localCatalog);
    console.warn("Catálogo online indisponível; exibindo o catálogo salvo neste navegador.", error);
  }
}

elements.categoryTabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  renderCategories();
  renderProducts();
});

elements.productSearch.addEventListener("input", (event) => {
  query = event.target.value;
  renderProducts();
});

elements.clearSearch.addEventListener("click", () => {
  query = "";
  elements.productSearch.value = "";
  elements.productSearch.focus();
  renderProducts();
});

document.querySelector("#showAllProducts").addEventListener("click", () => {
  query = "";
  activeCategory = "Todos";
  elements.productSearch.value = "";
  renderCategories();
  renderProducts();
});

elements.productGrid.addEventListener("click", (event) => {
  const toggleButton = event.target.closest("[data-toggle-product]");
  if (toggleButton) return toggleQuote(toggleButton.dataset.toggleProduct);
  const detailButton = event.target.closest("[data-open-product]");
  if (detailButton) openProduct(detailButton.dataset.openProduct);
});

document.querySelector("#openMenu").addEventListener("click", () => openOverlay(elements.menuOverlay));
document.querySelector("#openQuote").addEventListener("click", () => { renderQuote(); openOverlay(elements.quoteOverlay); });
document.querySelector("#openQuoteMobile").addEventListener("click", () => { renderQuote(); openOverlay(elements.quoteOverlay); });

document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () => closeOverlay({ menu: elements.menuOverlay, quote: elements.quoteOverlay, product: elements.productOverlay }[button.dataset.close]));
});

[elements.menuOverlay, elements.quoteOverlay, elements.productOverlay].forEach((overlay) => {
  overlay.addEventListener("mousedown", (event) => {
    if (event.target === overlay) closeOverlay(overlay);
  });
});

elements.menuOverlay.querySelectorAll("nav a").forEach((link) => link.addEventListener("click", () => closeOverlay(elements.menuOverlay)));

elements.quoteBody.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove-quote]");
  if (removeButton) return toggleQuote(removeButton.dataset.removeQuote);
  if (event.target.closest("[data-explore-products]")) closeOverlay(elements.quoteOverlay);
});

elements.modalAdd.addEventListener("click", () => {
  if (selectedProductId) toggleQuote(selectedProductId);
});

document.querySelectorAll("[data-category-link]").forEach((link) => {
  link.addEventListener("click", () => {
    activeCategory = link.dataset.categoryLink;
    query = "";
    elements.productSearch.value = "";
    renderCategories();
    renderProducts();
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  [elements.menuOverlay, elements.quoteOverlay, elements.productOverlay].forEach((overlay) => {
    if (!overlay.hidden) closeOverlay(overlay);
  });
});

hydrateIcons();
setupRevealMotion();
setupTilt();
setupHeroParallax();
setupScrollUI();
setupMagneticButtons();
setupWhatsAppLinks();
renderCategories();
renderProducts();
renderQuote();
updateCounters();
loadProducts();
window.setInterval(() => { if (!document.hidden) loadProducts(); }, 30000);
window.addEventListener("focus", loadProducts);

window.addEventListener("storage", (event) => {
  if (event.key !== CATALOG_STORAGE_KEY) return;
  applyCatalog(loadLocalCatalog() || fallbackProducts);
});
