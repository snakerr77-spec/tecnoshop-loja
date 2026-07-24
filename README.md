# TecnoShop Cerquilho — Loja Premium

Mostruário público em HTML, CSS e JavaScript, pronto para Cloudflare Pages.

## O que foi alterado

- Tema escuro e claro em todo o site.
- A composição principal troca automaticamente entre uma versão escura e uma versão clara.
- Motion discreto: entrada das seções, parallax no banner, cards com profundidade, barra de progresso e faixa animada.
- Catálogo conectado ao painel administrativo pela mesma API Cloudflare.
- Produtos e categorias continuam sendo carregados de `/api/products`.
- Atualização automática do catálogo a cada 30 segundos e ao retornar para a aba.
- Layout responsivo para computador, tablet e celular.
- Sem área de cliente, login, checkout ou pagamento online.

## Configuração da API

Edite apenas `config.js` caso o endereço do Worker mude:

```js
window.TECNOSHOP_CONFIG = {
  apiUrl: "https://tecnoshop-api.snkmataxit.workers.dev"
};
```

## Publicação no Cloudflare Pages

Envie todo o conteúdo desta pasta para o repositório da loja. Como é HTML/CSS/JS puro:

- Framework preset: `None`
- Build command: deixe vazio
- Build output directory: `/`

O painel administrativo e a API não precisam ser alterados para usar esta versão.


## Ajuste visual desta versão

Os orbes, círculos luminosos e pontos animados sobre a imagem principal foram removidos. A troca entre as imagens clara e escura continua funcionando normalmente, com movimento de profundidade discreto.
