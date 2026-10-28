// Converte gabaritos escritos em Markdown + LaTeX para o formato do site.
//
// Uso (na pasta do projeto):
//   npm install                     (só na primeira vez)
//   npm run gabaritos               -> converte todos os fontes/Prova N/*.md
//   npm run gabaritos -- "fontes/Prova 1/1.1.1.md"   -> converte só esse
//
// Cada fontes/Prova N/<item>.md vira gabaritos/Prova N/<item>.js.
// Fórmulas: $...$ no meio do texto e $$...$$ em destaque (KaTeX).
// Imagens: coloque em gabaritos/Prova N/figuras/ e use ![descrição](figuras/arquivo.png).
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "node:fs";
import { join, basename, dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import katex from "katex";
import { marked } from "marked";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const FONTES = join(RAIZ, "fontes");
const DESTINO = join(RAIZ, "gabaritos");

let avisos = 0;

// Tira as fórmulas do texto antes do Markdown (para ele não mexer em _ e *),
// renderiza com KaTeX e devolve no lugar depois.
function converter(md, arquivo) {
  const formulas = [];
  const guardar = (tex, display) => {
    const html = katex.renderToString(tex.trim(), {
      displayMode: display,
      output: "html",
      throwOnError: false,
      strict: "ignore",
    });
    if (html.includes("katex-error")) {
      avisos++;
      console.warn(`  aviso: fórmula com erro em ${arquivo}: ${tex.trim().slice(0, 60)}`);
    }
    formulas.push(html);
    return `\u0000${formulas.length - 1}\u0000`;
  };

  const protegido = md
    .replace(/<!--[\s\S]*?-->/g, "")                     // comentários não vão para o site
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => "\n\n" + guardar(tex, true) + "\n\n")
    .replace(/\\\[([\s\S]+?)\\\]/g, (_, tex) => "\n\n" + guardar(tex, true) + "\n\n")
    .replace(/\\\(([\s\S]+?)\\\)/g, (_, tex) => guardar(tex, false))
    .replace(/(^|[^\\])\$([^\s$](?:[^$\n]*?[^\s$])?)\$/g, (_, antes, tex) => antes + guardar(tex, false));

  const html = marked.parse(protegido, { gfm: true });
  return html.replace(/\u0000(\d+)\u0000/g, (_, i) => formulas[Number(i)]);
}

function gerar(caminhoMd) {
  const pastaProva = basename(dirname(caminhoMd));       // "Prova 1"
  const prova = pastaProva.split(" ").pop();            // "1"
  const item = basename(caminhoMd, ".md");              // "1.1.1"
  const md = readFileSync(caminhoMd, "utf8");

  let html = converter(md, relative(RAIZ, caminhoMd));
  // imagens relativas apontam para gabaritos/Prova N/...
  const base = "gabaritos/" + encodeURIComponent(pastaProva) + "/";
  html = html.replace(/(<img[^>]*\ssrc=")(?!https?:|data:|\/)([^"]+)"/g,
    (_, inicio, src) => inicio + base + src + '"');

  const pasta = join(DESTINO, pastaProva);
  mkdirSync(pasta, { recursive: true });
  const js = "registrarGabarito(" + JSON.stringify(prova) + ", " + JSON.stringify(item) + ", " +
             JSON.stringify(html) + ");\n";
  writeFileSync(join(pasta, item + ".js"), js, "utf8");
  console.log("  " + pastaProva + "/" + item + ".js");
}

const pedidos = process.argv.slice(2);
let arquivos = pedidos.map((p) => resolve(p));
if (arquivos.length === 0) {
  if (!existsSync(FONTES)) {
    console.log("Nenhuma pasta fontes/ encontrada.");
    process.exit(0);
  }
  for (const pasta of readdirSync(FONTES).filter((n) => /^Prova \d+$/.test(n))) {
    for (const nome of readdirSync(join(FONTES, pasta)).filter((n) => n.endsWith(".md"))) {
      arquivos.push(join(FONTES, pasta, nome));
    }
  }
}

console.log("Gerando gabaritos:");
arquivos.forEach(gerar);
console.log(`${arquivos.length} gabarito(s) gerado(s)` + (avisos ? `, ${avisos} aviso(s).` : "."));
if (avisos) process.exitCode = 1;
