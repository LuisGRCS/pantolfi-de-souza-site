# Site — Luis Eduardo Pantolfi de Souza · Advocacia Empresarial

Site institucional publicado em `pantolfi.com.br`.

## Como rodar no computador

Requer Node.js 22 ou mais recente.

```bash
npm install
npm run dev
```

O site abre em `http://localhost:4321`.

## Comandos

| Comando          | O que faz                                             |
| ---------------- | ----------------------------------------------------- |
| `npm run dev`    | Abre o site em modo de edição, com recarga automática |
| `npm run build`  | Confere os tipos e gera a versão final em `dist/`     |
| `npm run lint`   | Procura problemas no código                           |
| `npm run format` | Padroniza a formatação dos arquivos                   |

## Onde ficam as coisas

| Pasta / arquivo                  | Conteúdo                                              |
| -------------------------------- | ----------------------------------------------------- |
| `src/content/`                   | Todo o conteúdo editável (textos, áreas, publicações) |
| `src/content/configuracoes.json` | Nome, OAB, telefone, e-mail, endereço e redes         |
| `src/styles/tokens.css`          | Cores, fontes e medidas do site inteiro               |
| `public/marca/`                  | Logotipos oficiais                                    |

Textos ainda pendentes aparecem no site contornados e com a marcação `[PREENCHER: …]`.

## Chaves do formulário de contato

O formulário usa o Resend (envio de e-mail) e o Cloudflare Turnstile (proteção contra spam).
As chaves ficam nas variáveis de ambiente da Vercel, nunca no código. A lista está em `.env.example`.
