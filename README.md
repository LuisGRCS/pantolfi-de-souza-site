# Site — Luis Eduardo Pantolfi de Souza · Advocacia Empresarial

Site institucional publicado em `pantolfi.com.br`.

**Para editar textos, publicar artigos e colocar o site no ar, siga o guia [`docs/COMO-EDITAR.md`](docs/COMO-EDITAR.md).**

## Como rodar no computador

Requer Node.js 22 ou mais recente.

```bash
npm install
npm run dev
```

O site abre em `http://localhost:4321` e o painel de edição em `http://localhost:4321/admin`.

## Comandos

| Comando          | O que faz                                                                     |
| ---------------- | ----------------------------------------------------------------------------- |
| `npm run dev`    | Abre o site em modo de edição, com recarga automática                         |
| `npm run build`  | Confere os tipos, gera o site, o índice de busca e os cabeçalhos de segurança |
| `npm run lint`   | Procura problemas no código                                                   |
| `npm run format` | Padroniza a formatação dos arquivos                                           |

## Onde ficam as coisas

| Pasta / arquivo                  | Conteúdo                                              |
| -------------------------------- | ----------------------------------------------------- |
| `src/content/`                   | Todo o conteúdo editável (textos, áreas, publicações) |
| `src/content/configuracoes.json` | Nome, OAB, telefone, e-mail, endereço e redes         |
| `src/styles/tokens.css`          | Cores, fontes e medidas do site inteiro               |
| `src/motion/config.ts`           | Parâmetros das animações                              |
| `keystatic.config.ts`            | Campos do painel de edição                            |
| `public/marca/`                  | Logotipos oficiais                                    |
| `.env.example`                   | Lista das chaves de serviços (cadastradas na Vercel)  |

Textos ainda pendentes aparecem no site com fundo dourado suave e a marcação `[PREENCHER: …]`.
