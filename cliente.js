"use strict";

const API_BASE = String(window.TECNOSHOP_CONFIG?.apiUrl || "").replace(/\/$/, "");
const WHATSAPP_NUMBER = "5515996007266";

const elements = {
  loading:document.querySelector("#clientLoading"),
  error:document.querySelector("#clientError"),
  errorMessage:document.querySelector("#clientErrorMessage"),
  content:document.querySelector("#clientContent"),
  welcome:document.querySelector("#clientWelcome"),
  title:document.querySelector("#clientTitle"),
  message:document.querySelector("#clientMessage"),
  status:document.querySelector("#clientStatus"),
  expires:document.querySelector("#clientExpires"),
  items:document.querySelector("#clientItems"),
  empty:document.querySelector("#clientEmpty"),
  count:document.querySelector("#clientItemCount"),
  total:document.querySelector("#clientTotal"),
  totalNote:document.querySelector("#clientTotalNote"),
  whatsapp:document.querySelector("#clientWhatsApp")
};

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (character) => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#039;", '"':"&quot;"
  })[character]);
}

function formatPrice(value) {
  return new Intl.NumberFormat("pt-BR", { style:"currency", currency:"BRL" }).format(Number(value));
}

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Validade limitada" : `Disponível até ${date.toLocaleDateString("pt-BR")}`;
}

function statusLabel(status) {
  return ({ draft:"Em preparação", sent:"Disponível", viewed:"Visualizado", approved:"Aprovado" })[status] || "Disponível";
}

function itemTemplate(item) {
  const quantity = Math.max(1, Number(item.quantity) || 1);
  const hasPrice = Number(item.unitPrice) >= 0 && item.unitPrice !== null;
  const subtotal = hasPrice ? Number(item.unitPrice) * quantity : null;
  return `<article class="client-item">
    <div class="client-item-image">${item.image ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" loading="lazy">` : "<span>SEM IMAGEM</span>"}</div>
    <div class="client-item-copy"><small>SELECIONADO PARA VOCÊ</small><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.subtitle)}</p>${item.notes ? `<b>${escapeHtml(item.notes)}</b>` : ""}</div>
    <div class="client-item-quantity"><small>QUANTIDADE</small><strong>${quantity} ${quantity === 1 ? "unidade" : "unidades"}</strong></div>
    <div class="client-item-price"><small>${quantity > 1 ? "SUBTOTAL" : "VALOR"}</small><strong>${subtotal === null ? "Sob consulta" : formatPrice(subtotal)}</strong>${quantity > 1 && hasPrice ? `<span>${formatPrice(item.unitPrice)} cada</span>` : ""}</div>
  </article>`;
}

function showError(message) {
  elements.loading.hidden = true;
  elements.content.hidden = true;
  elements.error.hidden = false;
  elements.errorMessage.textContent = message;
}

function render(data) {
  const items = Array.isArray(data.items) ? data.items : [];
  elements.welcome.textContent = `Olá, ${data.clientName || "cliente"}!`;
  elements.title.textContent = data.title || "Sua seleção TecnoShop.";
  elements.message.textContent = data.message || "A equipe separou estas opções para facilitar sua escolha.";
  elements.status.innerHTML = `<i></i> ${escapeHtml(statusLabel(data.status))}`;
  elements.expires.textContent = formatDate(data.expiresAt);
  elements.items.innerHTML = items.map(itemTemplate).join("");
  elements.items.hidden = items.length === 0;
  elements.empty.hidden = items.length > 0;
  elements.count.textContent = `${items.length} ${items.length === 1 ? "item" : "itens"}`;

  const priced = items.filter((item) => item.unitPrice !== null && Number(item.unitPrice) >= 0);
  const total = priced.reduce((sum, item) => sum + Number(item.unitPrice) * Math.max(1, Number(item.quantity) || 1), 0);
  elements.total.textContent = priced.length ? formatPrice(total) : "Sob consulta";
  elements.totalNote.textContent = priced.length < items.length ? "Alguns itens estão sob consulta" : "Confirme as condições de pagamento";
  const message = `Olá! Sou ${data.clientName || "cliente"}. Vi minha seleção exclusiva no site e gostaria de confirmar os itens.`;
  elements.whatsapp.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  elements.loading.hidden = true;
  elements.error.hidden = true;
  elements.content.hidden = false;
}

async function loadClientArea() {
  const token = new URLSearchParams(window.location.search).get("acesso") || "";
  if (!API_BASE) return showError("A API ainda não foi configurada.");
  if (!/^[a-zA-Z0-9_-]{30,100}$/.test(token)) return showError("O link está incompleto ou não é válido.");
  try {
    const response = await fetch(`${API_BASE}/api/client-access/${encodeURIComponent(token)}`, {
      headers:{ Accept:"application/json" },
      cache:"no-store",
      referrerPolicy:"no-referrer"
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Este link não está mais disponível.");
    render(data);
  } catch (error) {
    showError(error.message || "Não foi possível carregar sua seleção.");
  }
}

loadClientArea();
