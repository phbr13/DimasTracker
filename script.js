// Itens de cada prova. Para editar, basta mexer nas listas abaixo.
const provas = {
  1: [
    "1.1.1", "1.1.4", "1.1.5", "1.1.6", "1.1.10 (a,c)", "1.1.18",
    "1.1.22 (a)", "1.1.23 (a)",
    "1.2.1", "1.2.2", "1.2.3", "1.2.5", "1.2.6", "1.2.7", "1.2.8",
    "1.2.9", "1.2.12", "1.2.14", "1.2.21",
    "Página 71 (Teste do Capítulo)",
    "2.1.1", "2.1.2", "2.1.3", "2.1.4", "2.1.5",
    "2.2.1", "2.2.2", "2.2.4", "2.2.5", "2.2.6", "2.2.7", "2.2.8",
    "2.2.11", "2.2.12", "2.2.13", "2.2.18",
    "Página 137 (Teste do Capítulo)",
    "3.1.1", "3.1.2", "3.1.3", "3.1.6", "3.1.7", "3.1.8", "3.1.9",
    "3.1.10", "3.1.12", "3.1.19", "3.1.20", "3.1.21",
    "Ler os Exemplos 3.3 e 3.4 do livro",
    "3.2.1", "3.2.2", "3.2.3", "3.2.4", "3.2.5", "3.2.6", "3.2.8",
    "3.2.15", "3.2.20", "3.2.24", "3.2.25", "3.2.26"
  ],
  2: [
    "3.2.7", "3.2.9", "3.2.10", "3.2.11", "3.2.12", "3.2.14",
    "Página 212 (Teste do Capítulo)",
    "4.1.1", "4.1.2", "4.1.3", "4.1.4", "4.1.5", "4.1.6", "4.1.7",
    "4.1.8", "4.1.9", "4.1.10", "4.1.11", "4.1.12", "4.1.13", "4.1.14",
    "4.1.16", "4.1.17", "4.1.18",
    "4.2.1", "4.2.2", "4.2.3", "4.2.5", "4.2.6", "4.2.7", "4.2.8",
    "4.2.9", "4.2.10", "4.2.11", "4.2.13 (a,b)",
    "4.3.1", "4.3.2", "4.3.3", "4.3.4",
    "Página 297 (Teste do Capítulo)"
  ],
  3: [
    "5.1.1", "5.1.2", "5.1.3", "5.1.4", "5.1.5", "5.1.6",
    "5.2.1", "5.2.2", "5.2.3", "5.2.4", "5.2.5",
    "6.1.1", "6.1.2", "6.1.3", "6.1.4", "6.1.5",
    "Ler o texto Quadricas.pdf disponível na pasta",
    "7.1.1", "7.1.2", "7.1.3", "7.1.4",
    "7.2.1", "7.2.2", "7.2.3", "7.2.4", "7.2.5", "7.2.6",
    "7.2.7", "7.2.8", "7.2.9", "7.2.10", "7.2.11"
  ]
};

// ---------- Estado (itens marcados) ----------
const CHAVE_STORAGE = "dimastracker:marcados";
let marcados = { 1: [], 2: [], 3: [] };

try {
  const salvo = JSON.parse(localStorage.getItem(CHAVE_STORAGE));
  if (salvo) marcados = Object.assign(marcados, salvo);
} catch (e) { /* sem armazenamento: começa zerado */ }

function salvar() {
  try {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(marcados));
  } catch (e) { /* ignora */ }
}

// ---------- Elementos ----------
const lista = document.getElementById("lista-itens");
const titulo = document.getElementById("titulo-lista");
const opcoes = document.querySelectorAll('input[name="prova"]');
const blocoTotal = document.getElementById("progresso-total");
const blocoProva = document.getElementById("progresso-prova");

let provaAtual = document.querySelector('input[name="prova"]:checked').value;

// ---------- Progresso ----------
function atualizarBloco(bloco, feitos, total, rotulo) {
  const pct = total === 0 ? 0 : Math.round((feitos / total) * 100);
  bloco.querySelector(".barra").style.strokeDasharray = pct + " 100";
  bloco.querySelector(".pct").textContent = pct + "%";
  bloco.querySelector(".contagem").textContent = feitos + " de " + total;
  if (rotulo) bloco.querySelector(".rotulo").textContent = rotulo;
  bloco.setAttribute("aria-valuenow", pct);
}

function atualizarProgresso() {
  let feitosTotal = 0;
  let itensTotal = 0;

  Object.keys(provas).forEach(function (n) {
    itensTotal += provas[n].length;
    feitosTotal += marcados[n].filter(function (t) {
      return provas[n].includes(t);
    }).length;
  });

  const feitosProva = marcados[provaAtual].filter(function (t) {
    return provas[provaAtual].includes(t);
  }).length;

  atualizarBloco(blocoTotal, feitosTotal, itensTotal);
  atualizarBloco(blocoProva, feitosProva, provas[provaAtual].length, "Prova " + provaAtual);
}

// ---------- Item selecionado (por prova, só em memória) ----------
const selecionados = { 1: null, 2: null, 3: null };

const visorArea = document.getElementById("visor-area");
const visorControles = document.getElementById("visor-controles");
const tituloExercicio = document.getElementById("titulo-exercicio");
const zoomValor = document.getElementById("zoom-valor");
const botaoEscuro = document.getElementById("paginas-escuras");
const botaoTelaCheia = document.getElementById("tela-cheia");
const indicadorPagina = document.getElementById("indicador-pagina");
const secaoExercicio = document.getElementById("secao-exercicio");
const linkPdf = document.getElementById("abrir-pdf");
const tituloGabarito = document.getElementById("titulo-gabarito");
const areaGabarito = document.getElementById("gabarito-area");
const chaveModoEstudo = document.getElementById("modo-estudo");

// Caminho de um arquivo do item (nome do arquivo = texto exato do item)
function caminho(pasta, prova, item, extensao) {
  return pasta + "/" + encodeURIComponent("Prova " + prova) + "/" +
         encodeURIComponent(item) + extensao;
}

// ---------- Seção 2: exercício ----------
// As páginas são SVGs gerados a partir dos PDFs por ferramentas/gerar-paginas.py.
// Se um item não tiver páginas geradas, cai no visualizador de PDF do navegador.
const paginasExercicios = window.paginasExercicios || {};
const NIVEIS_ZOOM = [0.25, 0.33, 0.5, 0.67, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5];
const ZOOM_MIN = 0.25;
const ZOOM_MAX = 5;
let zoom = 1;            // 1 = páginas na largura da seção
let folhas = null;       // contêiner das páginas do item aberto

function mostrarPdf(prova, item) {
  visorArea.innerHTML = "";
  visorArea.scrollTop = 0;
  visorArea.scrollLeft = 0;
  folhas = null;
  indicadorPagina.hidden = true;

  if (!item) {
    tituloExercicio.textContent = "Exercício";
    visorControles.hidden = true;
    const p = document.createElement("p");
    p.className = "painel-vazio";
    p.textContent = "Selecione um item da lista para ver o exercício.";
    visorArea.appendChild(p);
    return;
  }

  const pdf = caminho("exercicios", prova, item, ".pdf");
  tituloExercicio.textContent = "Exercício · " + item;
  visorControles.hidden = false;
  linkPdf.href = pdf;

  const paginas = paginasExercicios[prova + "|" + item];
  const total = paginas ? paginas.length : 0;
  if (!total) {
    const iframe = document.createElement("iframe");
    iframe.className = "visor-pdf";
    iframe.title = "Exercício " + item;
    iframe.src = pdf + "#view=FitH";
    visorArea.appendChild(iframe);
    return;
  }

  const pasta = "paginas/" + encodeURIComponent("Prova " + prova) + "/" +
                encodeURIComponent(item) + "/";
  folhas = document.createElement("div");
  folhas.className = "folhas";
  for (let n = 1; n <= total; n++) {
    // a sombra fica na moldura; o filtro do modo escuro só na imagem
    const folha = document.createElement("div");
    folha.className = "folha";
    const img = document.createElement("img");
    img.src = pasta + n + ".svg";
    img.alt = total > 1 ? "Página " + n + " de " + total : "Exercício " + item;
    img.draggable = false;
    img.decoding = "async";
    if (n > 1) img.loading = "lazy";
    folha.appendChild(img);

    // marca-textos: desenhados por cima da imagem, fora do filtro do modo escuro
    paginas[n - 1].forEach(function (d) {
      const marca = document.createElement("span");
      marca.className = "marca-texto";
      marca.style.left = d[0] * 100 + "%";
      marca.style.top = d[1] * 100 + "%";
      marca.style.width = d[2] * 100 + "%";
      marca.style.height = d[3] * 100 + "%";
      marca.style.setProperty("--cor", d[4]);
      folha.appendChild(marca);
    });
    folhas.appendChild(folha);
  }
  visorArea.appendChild(folhas);
  atualizarIndicador();
}

// ---------- Zoom ----------
// Mantém o ponto (x, y) da tela — em geral o cursor — parado durante o zoom.
function aplicarZoom(novo, x, y) {
  novo = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, novo));
  const area = visorArea.getBoundingClientRect();
  if (x === undefined) { x = area.left + area.width / 2; y = area.top; }

  let fx = 0, fy = 0;
  if (folhas) {
    const r = folhas.getBoundingClientRect();
    fx = (x - r.left) / r.width;
    fy = (y - r.top) / r.height;
  }

  zoom = novo;
  visorArea.style.setProperty("--zoom", zoom);
  zoomValor.textContent = Math.round(zoom * 100) + "%";

  if (folhas) {
    const r = folhas.getBoundingClientRect();   // força o novo layout
    visorArea.scrollLeft += r.left + fx * r.width - x;
    visorArea.scrollTop += r.top + fy * r.height - y;
  }
  try { localStorage.setItem("dimastracker:zoom", String(zoom)); } catch (e) { /* ignora */ }
}

function passoZoom(direcao, x, y) {
  const proximo = direcao > 0
    ? NIVEIS_ZOOM.find(function (z) { return z > zoom + 0.001; })
    : NIVEIS_ZOOM.slice().reverse().find(function (z) { return z < zoom - 0.001; });
  if (proximo) aplicarZoom(proximo, x, y);
}

// Zoom em que a primeira página cabe inteira na altura da área
function zoomPaginaInteira() {
  const img = folhas && folhas.querySelector("img");
  if (!img || !img.naturalWidth) return 1;
  const estilo = getComputedStyle(visorArea);
  const larg = visorArea.clientWidth - parseFloat(estilo.paddingLeft) - parseFloat(estilo.paddingRight);
  const alt = visorArea.clientHeight - parseFloat(estilo.paddingTop) - parseFloat(estilo.paddingBottom);
  const proporcao = img.naturalWidth / img.naturalHeight;
  return Math.min(1, (alt * proporcao) / larg);
}

document.getElementById("zoom-mais").addEventListener("click", function () { passoZoom(1); });
document.getElementById("zoom-menos").addEventListener("click", function () { passoZoom(-1); });
zoomValor.addEventListener("click", function () { aplicarZoom(1); });
document.getElementById("ajustar-largura").addEventListener("click", function () { aplicarZoom(1); });
document.getElementById("ajustar-pagina").addEventListener("click", function () {
  aplicarZoom(zoomPaginaInteira());
  visorArea.scrollTop = 0;
});

// Ctrl + rolagem (ou pinça no touchpad): zoom contínuo em direção ao cursor
visorArea.addEventListener("wheel", function (e) {
  if (!e.ctrlKey || !folhas) return;
  e.preventDefault();
  const delta = e.deltaMode === 1 ? e.deltaY * 40 : e.deltaY;
  aplicarZoom(zoom * Math.exp(-delta * 0.0015), e.clientX, e.clientY);
}, { passive: false });

// Duplo clique: aproxima no ponto clicado; se já estiver aproximado, volta à largura
visorArea.addEventListener("dblclick", function (e) {
  if (!folhas) return;
  aplicarZoom(zoom > 1.05 ? 1 : 2, e.clientX, e.clientY);
});

// Arrastar com o mouse move a página (como a "mãozinha" de leitores de PDF)
let arrasto = null;
visorArea.addEventListener("pointerdown", function (e) {
  if (!folhas || e.button !== 0 || e.pointerType === "touch") return;
  // clique na barra de rolagem não vira arrasto
  const r = visorArea.getBoundingClientRect();
  if (e.clientX - r.left >= visorArea.clientWidth || e.clientY - r.top >= visorArea.clientHeight) return;
  arrasto = { x: e.clientX, y: e.clientY, left: visorArea.scrollLeft, top: visorArea.scrollTop };
  visorArea.setPointerCapture(e.pointerId);
  visorArea.classList.add("arrastando");
});
visorArea.addEventListener("pointermove", function (e) {
  if (!arrasto) return;
  visorArea.scrollLeft = arrasto.left - (e.clientX - arrasto.x);
  visorArea.scrollTop = arrasto.top - (e.clientY - arrasto.y);
});
function soltarArrasto() {
  arrasto = null;
  visorArea.classList.remove("arrastando");
}
visorArea.addEventListener("pointerup", soltarArrasto);
visorArea.addEventListener("pointercancel", soltarArrasto);

// Atalhos de teclado, valem com o mouse sobre o exercício (ou em tela cheia)
document.addEventListener("keydown", function (e) {
  if (!folhas) return;
  const ativo = secaoExercicio.matches(":hover") || document.fullscreenElement === secaoExercicio;
  if (!ativo || e.target.matches("input, textarea")) return;
  const tecla = e.key;
  if (e.ctrlKey && (tecla === "+" || tecla === "=")) { e.preventDefault(); passoZoom(1); }
  else if (e.ctrlKey && tecla === "-") { e.preventDefault(); passoZoom(-1); }
  else if (e.ctrlKey && tecla === "0") { e.preventDefault(); aplicarZoom(1); }
  else if (!e.ctrlKey && !e.altKey && (tecla === "f" || tecla === "F")) { alternarTelaCheia(); }
});

// ---------- Indicador de página ----------
function atualizarIndicador() {
  if (!folhas || folhas.children.length < 2) { indicadorPagina.hidden = true; return; }
  const meio = visorArea.getBoundingClientRect().top + visorArea.clientHeight / 3;
  let atual = 1;
  Array.prototype.forEach.call(folhas.children, function (f, i) {
    if (f.getBoundingClientRect().top <= meio) atual = i + 1;
  });
  indicadorPagina.hidden = false;
  indicadorPagina.textContent = atual + " / " + folhas.children.length;
}
visorArea.addEventListener("scroll", atualizarIndicador, { passive: true });

// ---------- Páginas escuras ----------
function definirEscuro(ligado) {
  visorArea.classList.toggle("escuro", ligado);
  botaoEscuro.setAttribute("aria-pressed", String(ligado));
  try { localStorage.setItem("dimastracker:paginasEscuras", ligado ? "1" : "0"); } catch (e) { /* ignora */ }
}
botaoEscuro.addEventListener("click", function () {
  definirEscuro(!visorArea.classList.contains("escuro"));
});

// ---------- Tela cheia ----------
function alternarTelaCheia() {
  if (document.fullscreenElement) document.exitFullscreen();
  else if (secaoExercicio.requestFullscreen) secaoExercicio.requestFullscreen();
}
botaoTelaCheia.addEventListener("click", alternarTelaCheia);
document.addEventListener("fullscreenchange", function () {
  botaoTelaCheia.setAttribute("aria-pressed", String(document.fullscreenElement === secaoExercicio));
});

// Preferências lembradas no navegador
try {
  definirEscuro(localStorage.getItem("dimastracker:paginasEscuras") === "1");
  const z = parseFloat(localStorage.getItem("dimastracker:zoom"));
  if (z) aplicarZoom(z);
} catch (e) { /* ignora */ }

// ---------- Tema do site (claro/escuro) ----------
// O tema salvo já é aplicado por um script no <head>; aqui fica só o botão.
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

// ---------- Seções redimensionáveis ----------
// Larguras guardadas como fração da tela, com limites para nada ficar apertado.
const conteudo = document.querySelector(".conteudo");
const LARGURAS_PADRAO = { lista: 0.15, exercicio: 0.425 };
const LIMITES = {
  listaMin: 150, listaMax: 0.3,      // px, fração da tela
  colunaMin: 320, colunaMinFracao: 0.22
};
let larguras = Object.assign({}, LARGURAS_PADRAO);

try {
  const salvas = JSON.parse(localStorage.getItem("dimastracker:larguras"));
  if (salvas && salvas.lista && salvas.exercicio) larguras = salvas;
} catch (e) { /* ignora */ }

function aplicarLarguras() {
  const total = conteudo.clientWidth;
  const minColuna = Math.max(LIMITES.colunaMin, total * LIMITES.colunaMinFracao);

  let lista = Math.min(Math.max(larguras.lista * total, LIMITES.listaMin), total * LIMITES.listaMax);
  let exercicio = larguras.exercicio * total;
  exercicio = Math.max(exercicio, minColuna);
  exercicio = Math.min(exercicio, total - lista - minColuna);

  conteudo.style.setProperty("--largura-lista", lista + "px");
  conteudo.style.setProperty("--largura-exercicio", exercicio + "px");
  return { lista: lista, exercicio: exercicio, total: total };
}

function salvarLarguras() {
  try { localStorage.setItem("dimastracker:larguras", JSON.stringify(larguras)); } catch (e) { /* ignora */ }
}

function prepararDivisor(divisor, qual) {
  divisor.addEventListener("pointerdown", function (e) {
    if (e.button !== 0) return;
    e.preventDefault();
    divisor.setPointerCapture(e.pointerId);
    document.body.classList.add("redimensionando");
    const inicioX = e.clientX;
    const atual = aplicarLarguras();

    function mover(ev) {
      const dx = ev.clientX - inicioX;
      if (qual === "lista") {
        // a lista cresce tirando espaço do exercício
        larguras.lista = (atual.lista + dx) / atual.total;
        larguras.exercicio = (atual.exercicio - dx) / atual.total;
      } else {
        larguras.exercicio = (atual.exercicio + dx) / atual.total;
      }
      const r = aplicarLarguras();
      larguras.lista = r.lista / r.total;
      larguras.exercicio = r.exercicio / r.total;
    }
    function soltar() {
      divisor.removeEventListener("pointermove", mover);
      divisor.removeEventListener("pointerup", soltar);
      divisor.removeEventListener("pointercancel", soltar);
      document.body.classList.remove("redimensionando");
      salvarLarguras();
    }
    divisor.addEventListener("pointermove", mover);
    divisor.addEventListener("pointerup", soltar);
    divisor.addEventListener("pointercancel", soltar);
  });

  // setas do teclado também redimensionam
  divisor.addEventListener("keydown", function (e) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const passo = e.key === "ArrowLeft" ? -0.02 : 0.02;
    if (qual === "lista") { larguras.lista += passo; larguras.exercicio -= passo; }
    else larguras.exercicio += passo;
    const r = aplicarLarguras();
    larguras.lista = r.lista / r.total;
    larguras.exercicio = r.exercicio / r.total;
    salvarLarguras();
  });

  divisor.addEventListener("dblclick", function () {
    larguras = Object.assign({}, LARGURAS_PADRAO);
    aplicarLarguras();
    salvarLarguras();
  });
}

// ---------- Altura do cabeçalho ----------
// Ajuste pequeno: entre 12% e 19% da altura da tela (padrão 15%), nunca menos de 112 px.
const cabecalho = document.querySelector(".cabecalho");
const divisorCabecalho = document.getElementById("divisor-cabecalho");
const ALTURA_PADRAO = 0.15;
const LIMITES_CABECALHO = { min: 0.12, max: 0.19, minPx: 112 };
let alturaCabecalho = ALTURA_PADRAO;

try {
  const salva = parseFloat(localStorage.getItem("dimastracker:alturaCabecalho"));
  if (salva) alturaCabecalho = salva;
} catch (e) { /* ignora */ }

function aplicarAlturaCabecalho() {
  const total = window.innerHeight;
  const min = Math.max(LIMITES_CABECALHO.min * total, LIMITES_CABECALHO.minPx);
  const max = Math.max(LIMITES_CABECALHO.max * total, min);
  const px = Math.min(Math.max(alturaCabecalho * total, min), max);
  document.body.style.setProperty("--altura-cabecalho", px + "px");
  return px;
}

function salvarAlturaCabecalho() {
  try { localStorage.setItem("dimastracker:alturaCabecalho", String(alturaCabecalho)); } catch (e) { /* ignora */ }
}

divisorCabecalho.addEventListener("pointerdown", function (e) {
  if (e.button !== 0) return;
  e.preventDefault();
  divisorCabecalho.setPointerCapture(e.pointerId);
  document.body.classList.add("redimensionando", "vertical");
  const inicioY = e.clientY;
  const inicio = aplicarAlturaCabecalho();

  function mover(ev) {
    alturaCabecalho = (inicio + ev.clientY - inicioY) / window.innerHeight;
    alturaCabecalho = aplicarAlturaCabecalho() / window.innerHeight;
  }
  function soltar() {
    divisorCabecalho.removeEventListener("pointermove", mover);
    divisorCabecalho.removeEventListener("pointerup", soltar);
    divisorCabecalho.removeEventListener("pointercancel", soltar);
    document.body.classList.remove("redimensionando", "vertical");
    salvarAlturaCabecalho();
  }
  divisorCabecalho.addEventListener("pointermove", mover);
  divisorCabecalho.addEventListener("pointerup", soltar);
  divisorCabecalho.addEventListener("pointercancel", soltar);
});

divisorCabecalho.addEventListener("keydown", function (e) {
  if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
  e.preventDefault();
  alturaCabecalho += e.key === "ArrowUp" ? -0.01 : 0.01;
  alturaCabecalho = aplicarAlturaCabecalho() / window.innerHeight;
  salvarAlturaCabecalho();
});

divisorCabecalho.addEventListener("dblclick", function () {
  alturaCabecalho = ALTURA_PADRAO;
  aplicarAlturaCabecalho();
  salvarAlturaCabecalho();
});

window.addEventListener("resize", aplicarAlturaCabecalho);
aplicarAlturaCabecalho();

prepararDivisor(document.getElementById("divisor-1"), "lista");
prepararDivisor(document.getElementById("divisor-2"), "exercicio");
window.addEventListener("resize", aplicarLarguras);
aplicarLarguras();

// ---------- Seção 3: gabarito ----------
// Cada gabarito é um .js que chama registrarGabarito(...). Carregar via <script>
// funciona mesmo abrindo o site direto da pasta (file://), onde fetch() é bloqueado.
const gabaritos = {};        // "prova|item" -> html
const carregando = {};       // "prova|item" -> true
let revelado = false;        // no modo estudo, se o gabarito atual já foi mostrado

window.registrarGabarito = function (prova, item, html) {
  gabaritos[prova + "|" + item] = html;
  const sel = selecionados[provaAtual];
  if (provaAtual === prova && sel === item) desenharGabarito();
};

function painelVazio(texto) {
  areaGabarito.innerHTML = "";
  const p = document.createElement("p");
  p.className = "painel-vazio";
  p.textContent = texto;
  areaGabarito.appendChild(p);
}

function desenharGabarito() {
  const item = selecionados[provaAtual];
  if (!item) {
    tituloGabarito.textContent = "Gabarito";
    painelVazio("Selecione um item da lista para ver o gabarito.");
    return;
  }
  tituloGabarito.textContent = "Gabarito · " + item;
  const chave = provaAtual + "|" + item;
  const html = gabaritos[chave];

  if (html === undefined) {
    painelVazio("Carregando gabarito…");
    if (!carregando[chave]) {
      carregando[chave] = true;
      const s = document.createElement("script");
      s.src = caminho("gabaritos", provaAtual, item, ".js");
      s.onerror = function () {
        gabaritos[chave] = null;
        if (selecionados[provaAtual] === item) desenharGabarito();
      };
      document.head.appendChild(s);
    }
    return;
  }

  if (html === null) {
    painelVazio("Gabarito não disponível para este item.");
    return;
  }

  if (chaveModoEstudo.checked && !revelado) {
    areaGabarito.innerHTML = "";
    const caixa = document.createElement("div");
    caixa.className = "gabarito-oculto";
    const aviso = document.createElement("p");
    aviso.textContent = "Tente resolver antes de conferir.";
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "botao";
    botao.textContent = "Mostrar gabarito";
    botao.addEventListener("click", function () {
      revelado = true;
      desenharGabarito();
    });
    caixa.append(aviso, botao);
    areaGabarito.appendChild(caixa);
    return;
  }

  const artigo = document.createElement("article");
  artigo.className = "gabarito";
  artigo.innerHTML = html;
  areaGabarito.innerHTML = "";
  areaGabarito.appendChild(artigo);
  areaGabarito.scrollTop = 0;
}

function mostrarConteudo() {
  const item = selecionados[provaAtual];
  revelado = false;
  mostrarPdf(provaAtual, item);
  desenharGabarito();
}

// Modo estudo (lembrado no navegador)
try {
  chaveModoEstudo.checked = localStorage.getItem("dimastracker:modoEstudo") === "1";
} catch (e) { /* ignora */ }

chaveModoEstudo.addEventListener("change", function () {
  try {
    localStorage.setItem("dimastracker:modoEstudo", chaveModoEstudo.checked ? "1" : "0");
  } catch (e) { /* ignora */ }
  revelado = false;
  desenharGabarito();
});

function selecionarItem(elemento, texto) {
  const anterior = lista.querySelector(".item.selecionado");
  if (anterior) {
    anterior.classList.remove("selecionado");
    anterior.removeAttribute("aria-current");
  }
  elemento.classList.add("selecionado");
  elemento.setAttribute("aria-current", "true");
  if (selecionados[provaAtual] === texto) return;   // já aberto
  selecionados[provaAtual] = texto;
  mostrarConteudo();
}

// ---------- Lista ----------
function mostrarProva(numero) {
  provaAtual = numero;
  const itens = provas[numero];
  titulo.textContent = "Prova " + numero;
  lista.innerHTML = "";

  if (itens.length === 0) {
    const vazio = document.createElement("li");
    vazio.className = "vazio";
    vazio.textContent = "Nenhum item cadastrado.";
    lista.appendChild(vazio);
  }

  itens.forEach(function (texto) {
    const li = document.createElement("li");

    // Linha do item: clicar aqui SELECIONA o item
    const item = document.createElement("div");
    item.className = "item";
    item.tabIndex = 0;
    item.setAttribute("role", "button");

    // Checkbox: clicar aqui só MARCA/DESMARCA
    const alvo = document.createElement("label");
    alvo.className = "alvo-check";

    const check = document.createElement("input");
    check.type = "checkbox";
    check.className = "check";
    check.setAttribute("aria-label", "Marcar " + texto);
    check.checked = marcados[numero].includes(texto);
    item.classList.toggle("feito", check.checked);

    // Impede que o clique no checkbox chegue até a linha (não seleciona)
    alvo.addEventListener("click", function (e) {
      e.stopPropagation();
    });

    check.addEventListener("change", function () {
      const lst = marcados[numero];
      const pos = lst.indexOf(texto);
      if (check.checked && pos === -1) lst.push(texto);
      if (!check.checked && pos !== -1) lst.splice(pos, 1);
      item.classList.toggle("feito", check.checked);
      salvar();
      atualizarProgresso();
    });

    const span = document.createElement("span");
    span.className = "texto";
    span.textContent = texto;

    item.addEventListener("click", function () {
      selecionarItem(item, texto);
    });

    item.addEventListener("keydown", function (e) {
      // Enter ou Espaço na linha seleciona (ignora quando o foco está no checkbox)
      if (e.target !== item) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selecionarItem(item, texto);
      }
    });

    if (selecionados[numero] === texto) {
      item.classList.add("selecionado");
      item.setAttribute("aria-current", "true");
    }

    alvo.appendChild(check);
    item.append(alvo, span);
    li.appendChild(item);
    lista.appendChild(li);
  });

  mostrarConteudo();
  atualizarProgresso();
}

opcoes.forEach(function (opcao) {
  opcao.addEventListener("change", function () {
    mostrarProva(opcao.value);
  });
});

// Prova 1 vem selecionada por padrão
mostrarProva(provaAtual);
