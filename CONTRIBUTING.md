# Como contribuir com o DimasTracker

Obrigado por querer ajudar! 💚 Este é o resumo; o guia completo e ilustrado está em
**[phbr13.github.io/DimasTracker/contribuir.html](https://phbr13.github.io/DimasTracker/contribuir.html)**.

## Jeitos de ajudar

| | O quê | Precisa de |
|---|---|---|
| 🐛 | [Reportar um erro](#reportar-um-erro) | Só uma conta no GitHub |
| ✍️ | [Escrever ou corrigir um gabarito](#escrever-um-gabarito) | Markdown + LaTeX, Node.js |
| 📄 | [Adicionar um exercício](#adicionar-um-exercício) | Python 3 |
| 💻 | [Melhorar o site](#melhorar-o-site) | HTML, CSS e JavaScript |

## Reportar um erro

[Abra uma issue](https://github.com/phbr13/DimasTracker/issues/new/choose) e escolha o modelo **"Erro em gabarito"** ou **"Sugestão"**. Diga a prova, o item (ex.: `Prova 2 · 4.1.7`) e o que está errado. Antes, veja se já não existe uma [issue aberta](https://github.com/phbr13/DimasTracker/issues) sobre o mesmo problema.

## Preparar o ambiente

1. Faça um **fork** do repositório e clone a sua cópia:
   ```bash
   git clone https://github.com/SEU-USUARIO/DimasTracker.git
   cd DimasTracker
   git checkout -b minha-mudanca
   ```
2. Abra o `index.html` no navegador. Não há build nem servidor. Se preferir um servidor local, rode `npm run servir`.

## Escrever um gabarito

Os gabaritos são escritos em **Markdown** com fórmulas **LaTeX** (`$...$` no meio do texto, `$$...$$` em destaque).

```bash
npm install                                   # só na primeira vez
cp fontes/MODELO.md "fontes/Prova 2/4.1.7.md" # nome = texto exato do item na lista
# ... escreva a solução ...
npm run gabaritos                             # gera gabaritos/Prova 2/4.1.7.js
```

- **Imagens:** salve em `gabaritos/Prova N/figuras/` e use `![descrição](figuras/arquivo.png)`.
- **Gabaritos antigos:** os que já existem não têm arquivo-fonte. Para corrigir um deles, reescreva-o em `fontes/` e gere de novo; o `.js` antigo é substituído.
- A ferramenta **avisa** se alguma fórmula tiver erro de LaTeX.

## Adicionar um exercício

1. Coloque o PDF em `exercicios/Prova N/<item>.pdf`.
2. Adicione o item na lista `provas`, no topo do `script.js`, com o mesmo texto do nome do arquivo.
3. Gere as páginas do visualizador:
   ```bash
   py -m pip install pymupdf    # só na primeira vez (macOS/Linux: python3)
   py ferramentas/gerar-paginas.py
   ```

## Melhorar o site

- **Sem build e sem frameworks:** o site tem que continuar funcionando ao abrir o arquivo direto (`file://`) e no GitHub Pages.
- **Código em português**, como o resto do projeto (`mostrarProva`, `.gabarito-area`).
- **Cores só por variáveis CSS** (`--fundo`, `--texto`, …), definidas no topo do `style.css`, para os dois temas funcionarem.
- **Teste nos temas claro e escuro** antes de enviar.

## Enviar

```bash
git add .
git commit -m "Adiciona gabarito do 4.1.7"
git push origin minha-mudanca
```

Depois, abra um **Pull Request** no GitHub e preencha o checklist. Quando ele for aceito, o site é atualizado sozinho em alguns minutos.

Ficou com dúvida? [Abra uma issue](https://github.com/phbr13/DimasTracker/issues/new/choose). Não existe pergunta boba.
