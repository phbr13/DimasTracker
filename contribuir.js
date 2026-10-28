// Página "Como contribuir?": tema, botões de copiar e índice que acompanha a leitura.

// ---------- Tema (mesma chave do site principal) ----------
const botaoTema = document.getElementById("botao-tema");

function atualizarBotaoTema() {
  const claro = document.documentElement.dataset.tema === "claro";
  const texto = claro ? "Mudar para o tema escuro" : "Mudar para o tema claro";
  botaoTema.title = texto;
  botaoTema.setAttribute("aria-label", texto);
}

botaoTema.addEventListener("click", function () {
  const claro = document.documentElement.dataset.tema !== "claro";
  if (claro) document.documentElement.dataset.tema = "claro";
  else delete document.documentElement.dataset.tema;
  try { localStorage.setItem("dimastracker:tema", claro ? "claro" : "escuro"); } catch (e) { /* ignora */ }
  atualizarBotaoTema();
});
atualizarBotaoTema();

// ---------- Copiar comandos ----------
document.querySelectorAll(".guia-conteudo pre:not(.arvore):not(.exemplo-md)").forEach(function (pre) {
  const botao = document.createElement("button");
  botao.type = "button";
  botao.className = "botao-copiar";
  botao.textContent = "Copiar";
  botao.addEventListener("click", function () {
    const texto = pre.querySelector("code").innerText;
    const pronto = function () {
      botao.textContent = "Copiado!";
      botao.classList.add("copiado");
      setTimeout(function () {
        botao.textContent = "Copiar";
        botao.classList.remove("copiado");
      }, 1500);
    };
    if (navigator.clipboard) navigator.clipboard.writeText(texto).then(pronto, function () {});
  });
  pre.appendChild(botao);
});

// ---------- Índice: destaca a seção que está sendo lida ----------
const links = document.querySelectorAll(".guia-indice a");
const secoes = Array.prototype.map.call(links, function (a) {
  return document.querySelector(a.getAttribute("href"));
});

function marcarAtual() {
  let atual = 0;
  secoes.forEach(function (s, i) {
    if (s && s.getBoundingClientRect().top < window.innerHeight * 0.35) atual = i;
  });
  // no fim da página, a última seção
  if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) atual = secoes.length - 1;
  links.forEach(function (a, i) { a.classList.toggle("atual", i === atual); });
}

window.addEventListener("scroll", marcarAtual, { passive: true });
marcarAtual();
