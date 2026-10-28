"""Converte os PDFs de exercicios/ em páginas SVG para o visualizador do site.

Uso (na pasta do projeto):
    py -m pip install pymupdf      (só na primeira vez)
    py ferramentas/gerar-paginas.py

Gera:
    paginas/Prova N/<item>/1.svg, 2.svg, ...
    paginas/indice.js   -> páginas de cada item e onde estão os marca-textos
Rode de novo sempre que adicionar ou trocar um PDF.
"""
import json
import shutil
from pathlib import Path

import pymupdf

RAIZ = Path(__file__).resolve().parent.parent
ORIGEM = RAIZ / "exercicios"
DESTINO = RAIZ / "paginas"


def tirar_destaques(pagina):
    """Remove os marca-textos da página e devolve onde eles estavam.

    No PDF o marca-texto usa mistura "multiply" (fica por baixo do texto), mas
    o SVG ignora isso e o amarelo cobre o texto. Então o SVG sai sem eles e o
    site desenha cada destaque por cima, com a mistura certa (e legível no
    modo escuro). Posições em fração da página: [x, y, largura, altura, cor].
    """
    larg, alt = pagina.rect.width, pagina.rect.height
    destaques = []
    for anot in list(pagina.annots(types=[pymupdf.PDF_ANNOT_HIGHLIGHT])):
        cor = anot.colors.get("stroke") or (1, 1, 0)
        hexa = "#" + "".join(f"{round(c * 255):02x}" for c in cor)
        v = anot.vertices or []
        quads = [v[i:i + 4] for i in range(0, len(v), 4)] or [None]
        for q in quads:
            r = pymupdf.Rect(anot.rect) if q is None else pymupdf.Quad(q).rect
            destaques.append([round(r.x0 / larg, 4), round(r.y0 / alt, 4),
                              round(r.width / larg, 4), round(r.height / alt, 4), hexa])
        pagina.delete_annot(anot)
    return destaques


def main():
    if DESTINO.exists():
        shutil.rmtree(DESTINO)

    indice = {}
    for pdf in sorted(ORIGEM.glob("Prova */*.pdf")):
        prova = pdf.parent.name.split()[-1]          # "Prova 1" -> "1"
        item = pdf.stem                              # nome do arquivo = texto do item
        pasta = DESTINO / pdf.parent.name / item
        pasta.mkdir(parents=True, exist_ok=True)

        paginas = []
        with pymupdf.open(pdf) as doc:
            for n, pagina in enumerate(doc, start=1):
                paginas.append(tirar_destaques(pagina))
                svg = pagina.get_svg_image(text_as_path=True)
                (pasta / f"{n}.svg").write_text(svg, encoding="utf-8")
        indice[prova + "|" + item] = paginas

    # uma linha por item: "prova|item": [destaques da pág. 1, da pág. 2, ...]
    linhas = [json.dumps(k, ensure_ascii=False) + ": " +
              json.dumps(v, ensure_ascii=False, separators=(",", ":"))
              for k, v in indice.items()]
    js = ("// Gerado por ferramentas/gerar-paginas.py — não edite à mão.\n"
          "// Cada item: uma lista por página, com os marca-textos [x, y, larg, alt, cor].\n"
          "window.paginasExercicios = {\n " + ",\n ".join(linhas) + "\n};\n")
    (DESTINO / "indice.js").write_text(js, encoding="utf-8")
    print(f"{len(indice)} exercícios, {sum(map(len, indice.values()))} páginas em {DESTINO}")


if __name__ == "__main__":
    main()
