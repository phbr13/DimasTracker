"""Gera o ícone do site: o hiperboloide de uma folha da tabela de quádricas.

Uso (na pasta do projeto):  py ferramentas/gerar-icone.py
Redesenha só a superfície (sem eixos e letras) e salva PNGs em icones/.
"""
from pathlib import Path

import pymupdf

RAIZ = Path(__file__).resolve().parent.parent
pdf = RAIZ / "exercicios" / "Prova 3" / "Ler o texto Quadricas.pdf disponível na pasta.pdf"
DESTINO = RAIZ / "icones"
# área da figura na página 4 (medida numa prévia a 60 dpi, convertida para pontos)
k = 72 / 60
regiao = pymupdf.Rect(265 * k, 190 * k, 350 * k, 280 * k)

doc = pymupdf.open(pdf)
pag = doc[3]
itens = [d for d in pag.get_drawings() if d["rect"].intersects(regiao)]

def colorido(c):
    return c is not None and not (max(c) < 0.15)

# a superfície = área coberta pelos retalhos coloridos
sup = pymupdf.Rect()
for d in itens:
    if d.get("fill") and colorido(d["fill"]):
        sup |= d["rect"]
margem = 1.0
caixa = pymupdf.Rect(sup.x0 - margem, sup.y0 - margem, sup.x1 + margem, sup.y1 + margem)

manter = []
for d in itens:
    if not caixa.contains(d["rect"]):
        continue                      # eixos saem da superfície
    if d.get("fill") and not colorido(d["fill"]) and d["rect"].width < 6 and d["rect"].height < 6:
        continue                      # pontas de seta
    so_retas = all(it[0] == "l" for it in d["items"])
    if d.get("fill") is None and so_retas and (d.get("width") or 0) > 0.37:
        continue                      # pedaço de eixo (traço 0.4; a malha é 0.35)
    manter.append(d)

# redesenha numa página quadrada nova
lado = max(caixa.width, caixa.height) + 4
novo = pymupdf.open()
p = novo.new_page(width=lado, height=lado)
dx = (lado - caixa.width) / 2 - caixa.x0
dy = (lado - caixa.height) / 2 - caixa.y0
m = pymupdf.Matrix(1, 0, 0, 1, dx, dy)
forma = p.new_shape()
for d in manter:
    for it in d["items"]:
        if it[0] == "l":
            forma.draw_line(it[1] * m, it[2] * m)
        elif it[0] == "c":
            forma.draw_bezier(it[1] * m, it[2] * m, it[3] * m, it[4] * m)
        elif it[0] == "re":
            forma.draw_rect(it[1] * m)
        elif it[0] == "qu":
            forma.draw_quad(it[1] * m)
    # retalho só com preenchimento ganha contorno da mesma cor (tapa as emendas)
    emenda = d.get("fill") is not None and d.get("color") is None
    forma.finish(
        fill=d.get("fill"), color=d.get("fill") if emenda else d.get("color"),
        width=0.3 if emenda else (d.get("width") or 0), closePath=d.get("closePath", False),
        even_odd=d.get("even_odd", False),
        fill_opacity=d.get("fill_opacity") or 1, stroke_opacity=d.get("stroke_opacity") or 1,
        lineCap=max(d.get("lineCap") or [0]), lineJoin=d.get("lineJoin") or 0,
    )
forma.commit()

DESTINO.mkdir(exist_ok=True)
for tamanho, nome in [(32, "favicon-32.png"), (180, "apple-touch-icon.png"), (192, "icone-192.png")]:
    escala = tamanho / lado
    p.get_pixmap(matrix=pymupdf.Matrix(escala, escala), alpha=True).save(DESTINO / nome)
print("ícones salvos em", DESTINO)
