# Como editar e publicar o site

Guia em linguagem simples para quem cuida do site no dia a dia. Não é preciso saber programar.

## Como o site funciona, em uma frase

O **painel** (em `/admin`) é onde você escreve; ao salvar, o texto vai para o **GitHub** (onde os arquivos do site ficam guardados); a **Vercel** percebe a mudança e republica o site sozinha em 1 a 3 minutos.

---

## Parte 1 — Uso do dia a dia

### Entrar no painel

1. Abra `https://pantolfi.com.br/admin` (ou o endereço provisório da Vercel seguido de `/admin`).
2. Clique no botão de entrar com o GitHub (_Log in with GitHub_) e use a conta do GitHub que tem acesso ao site.
3. O painel abre com três grupos no menu à esquerda:
   - **Conteúdo:** Publicações, Áreas de atuação e Trajetória.
   - **Páginas:** Página inicial e Página Sobre.
   - **Configurações:** Dados gerais e contatos, Política de Privacidade e Aviso Legal.

> Os botões do painel ficam em inglês (a ferramenta não tem tradução): **Add** = adicionar, **Save** = salvar, **Delete** = apagar, **Create** = criar.

### Publicar um artigo (ou palestra, entrevista, nota técnica…)

1. No menu, clique em **Publicações** e depois em **Add** (canto superior direito).
2. Preencha os campos da direita:
   - **Título** — o endereço da página é criado sozinho a partir dele.
   - **Tipo** — Artigo, Nota técnica, Palestra, Entrevista, Evento, Curso/Aula ou Livro/Capítulo.
   - **Data** e **Resumo** (até 220 caracteres).
   - **Imagem de capa** (opcional) e **Descrição da capa** (obrigatória se houver capa). Sem capa, o site cria sozinho uma imagem com o título para quando o link for compartilhado.
   - **Áreas relacionadas**, **Veículo / local**, **Link externo**, **Vídeo** (YouTube ou Vimeo) e **Arquivo PDF**, quando houver.
3. Escreva o texto na área grande à esquerda. Use o menu **Paragraph → Heading** para criar subtítulos: eles formam o sumário que aparece ao lado do artigo.
4. Clique em **Save**. Em poucos minutos a publicação aparece no site.

**Dicas**

- **Rascunho:** marque a caixa **Rascunho** para salvar sem publicar. Desmarque quando estiver pronto.
- **Destaque:** marque **Destacar no topo** para que a publicação apareça grande no alto da página Publicações.
- **Notas de rodapé:** escreva `[^1]` no ponto do texto e, no fim do texto, uma linha começando com `[^1]:` seguida da nota. O site numera e liga as notas sozinho.
- **Citação em destaque:** use o botão de aspas da barra do editor.

### Editar áreas de atuação

**Áreas de atuação** → clique na área → altere os campos → **Save**.

- **Ordem na lista:** 1 aparece primeiro.
- **Visão geral:** separe os parágrafos com uma linha em branco.
- **Como atuo, Para quem e Perguntas frequentes:** use **Add** para incluir itens; arraste pelos pontinhos para reordenar.
- **Para criar uma área nova:** **Add**.
- **Para tirar uma área do site sem apagar:** marque **Rascunho**.

### Editar a trajetória

**Trajetória** → **Add** para um marco novo, ou clique em um marco existente.

- **Ordem:** número maior aparece primeiro. Uma boa prática é usar o ano.
- **Mostrar na página inicial:** escolha de 3 a 5 marcos.
- **Anos de atuação:** o número na página Trajetória é calculado sozinho a partir do **ano de inscrição na OAB**, informado em _Dados gerais_. Os totais de publicações e de palestras também são contados sozinhos.

### Editar a página inicial e a página Sobre

**Página inicial** ou **Página Sobre** → altere → **Save**. Fotos (retrato, imagem de fundo da abertura) são enviadas pelo botão **Choose file**. Sempre preencha a **descrição** da foto: ela é lida por pessoas que usam leitores de tela.

### Alterar telefone, e-mail, endereço, OAB e redes

**Dados gerais e contatos** → altere → **Save**. Esses dados aparecem no cabeçalho, no rodapé, na página Contato e nos dados enviados ao Google.

### Política de Privacidade e Aviso Legal

Os dois textos foram redigidos como **rascunho para revisão do advogado**. Enquanto a caixa **Em revisão** estiver marcada, a página mostra um aviso de rascunho e fica fora do Google. Depois de revisar o texto, desmarque a caixa e salve.

### Regras da OAB (Provimento 205/2021) — lembrete

Os campos do painel trazem lembretes, mas vale reforçar o que **não** pode aparecer no site:

- honorários, valores, formas de pagamento, descontos ou gratuidade;
- "especialista em…" sem título certificado;
- expressões de autoengrandecimento ou comparações com outros advogados;
- chamadas à contratação ("Contrate", "Garanta seus direitos aqui");
- clientes, decisões ou resultados de casos, promessas de resultado;
- depoimentos de clientes, selos de rankings pagos, contadores de "casos ganhos".

### Itens ainda pendentes (`[PREENCHER]`)

Tudo que ainda falta preencher aparece no site com um **fundo dourado suave** e começa com `[PREENCHER:`. Para encontrar no painel, procure por esse texto nos campos. Situação na entrega:

| Onde no painel          | O que falta                                                                                                                                         |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dados gerais e contatos | Número da OAB/SP, ano de inscrição na OAB, endereço completo, horário de atendimento, endereço do LinkedIn (e outras redes)                         |
| Página inicial          | Frase de abertura, apresentação curta, 3 princípios (título, descrição curta e texto longo), retrato, descrição para buscadores                     |
| Página Sobre            | Frase de abertura, 3 blocos de biografia, formação (curso, instituição e ano), idiomas, associações e comissões, retrato, descrição para buscadores |
| Áreas de atuação (4)    | Nomes (os atuais são **exemplos**), resumos, visão geral, serviços, perfis atendidos, perguntas frequentes                                          |
| Trajetória (5 marcos)   | Período, cargo, instituição e descrição de cada marco                                                                                               |
| Publicações             | As 4 publicações atuais são **exemplos de estrutura** (com datas fictícias): substitua ou apague todas                                              |
| Política de Privacidade | Prazo de guarda das mensagens; ferramenta de métricas (se adotada)                                                                                  |
| Aviso Legal             | Regra para reprodução dos textos por terceiros                                                                                                      |

---

## Parte 2 — Cores e fontes

Todas as cores, fontes e medidas ficam em **um único arquivo**: `src/styles/tokens.css`. Mudar um valor ali muda o site inteiro. Para editar sem programar:

1. No GitHub, abra o repositório e navegue até `src/styles/tokens.css`.
2. Clique no ícone de lápis (**Edit this file**).
3. Troque o código da cor (por exemplo, `--color-gold: #ba8d68;`) e clique em **Commit changes**.

### Ativar a fonte Engravers Gothic BT (quando a licença for comprada)

1. Compre a **licença web** da fonte (MyFonts/Monotype) e baixe o arquivo `.woff2`.
2. No GitHub, abra a pasta `public/fonts`, clique em **Add file → Upload files** e envie o arquivo com o nome `engravers-gothic-bt.woff2`.
3. Em `src/styles/tokens.css`, siga as três instruções do comentário no topo do arquivo: tirar os comentários do bloco `@font-face`, trocar a linha `--font-display` e ajustar `--tracking-caps` para `0.14em`.

---

## Parte 3 — Publicar o site pela primeira vez (feito uma única vez)

Ordem recomendada: **Vercel → serviços do formulário → painel de edição → domínio**.

### 3.1 Vercel (hospedagem)

1. Crie uma conta em **vercel.com** usando **Continue with GitHub**, de preferência com a conta do próprio advogado.
2. Clique em **Add New… → Project**, escolha o repositório `pantolfi-de-souza-site` e clique em **Import**.
3. Não altere nenhuma opção (a Vercel reconhece o projeto sozinha) e clique em **Deploy**.
4. Em 2 a 3 minutos o site fica no ar num endereço provisório como `pantolfi-de-souza-site.vercel.app`.

Para cadastrar as chaves dos próximos passos: no projeto da Vercel, **Settings → Environment Variables**. Para cada chave, informe o nome e o valor, marque **Production** e **Preview** e clique em **Save**. Depois de cadastrar chaves novas, vá em **Deployments**, abra os três pontinhos do último item e clique em **Redeploy** para que passem a valer.

### 3.2 Formulário de contato

**Envio de e-mail — Resend (resend.com)**

1. Crie a conta e, em **Domains**, adicione `pantolfi.com.br`. O Resend mostra alguns registros DNS: cadastre-os onde o domínio está registrado (ver 3.4) e aguarde a verificação.
2. Em **API Keys**, crie uma chave com permissão de envio.
3. Cadastre na Vercel:

| Nome             | Valor                                                                     |
| ---------------- | ------------------------------------------------------------------------- |
| `RESEND_API_KEY` | a chave criada no Resend                                                  |
| `CONTACT_FROM`   | `Site <contato@pantolfi.com.br>` (um endereço do domínio verificado)      |
| `CONTACT_TO`     | e-mail que recebe as mensagens (se vazio, usa o e-mail de _Dados gerais_) |

**Proteção contra spam — Cloudflare Turnstile (dash.cloudflare.com)**

1. Crie a conta gratuita e abra **Turnstile → Add widget**.
2. Informe o nome do site e os domínios `pantolfi.com.br` e o endereço provisório da Vercel. Escolha o modo **Managed**.
3. Cadastre na Vercel:

| Nome                        | Valor            |
| --------------------------- | ---------------- |
| `PUBLIC_TURNSTILE_SITE_KEY` | a **Site Key**   |
| `TURNSTILE_SECRET_KEY`      | a **Secret Key** |

**Teste:** envie uma mensagem pela página Contato e confira se ela chega ao e-mail.

### 3.3 Painel de edição no site publicado

O painel precisa de um "aplicativo" do GitHub autorizado a gravar no repositório.

1. No GitHub, clique na sua foto → **Settings → Developer settings → GitHub Apps → New GitHub App**.
2. Preencha:
   - **GitHub App name:** `Pantolfi Site Painel` (precisa ser um nome único no GitHub).
   - **Homepage URL:** `https://pantolfi.com.br/keystatic`
   - **Callback URL:** `https://pantolfi.com.br/api/keystatic/github/oauth/callback`. Clique em **Add Callback URL** e adicione também a versão com o endereço provisório da Vercel, por exemplo `https://pantolfi-de-souza-site.vercel.app/api/keystatic/github/oauth/callback`.
   - Marque **Request user authorization (OAuth) during installation**.
   - Em **Webhook**, desmarque **Active**.
   - Em **Permissions → Repository permissions:** **Contents** = _Read and write_, **Metadata** = _Read-only_, **Pull requests** = _Read-only_.
   - **Where can this GitHub App be installed?** → _Only on this account_.
3. Clique em **Create GitHub App**. Na página que abre:
   - anote o **Client ID**;
   - clique em **Generate a new client secret** e copie o código gerado (ele só aparece uma vez);
   - anote o nome curto do aplicativo, que aparece no endereço da página `github.com/apps/<nome-curto>`.
4. No menu à esquerda, clique em **Install App → Install** e escolha **Only select repositories → pantolfi-de-souza-site**.
5. Cadastre na Vercel:

| Nome                               | Valor                                                                         |
| ---------------------------------- | ----------------------------------------------------------------------------- |
| `KEYSTATIC_GITHUB_CLIENT_ID`       | o Client ID                                                                   |
| `KEYSTATIC_GITHUB_CLIENT_SECRET`   | o client secret                                                               |
| `KEYSTATIC_SECRET`                 | uma senha longa e aleatória (40 caracteres ou mais; use um gerador de senhas) |
| `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | o nome curto do aplicativo                                                    |

6. Faça o **Redeploy** e abra `/admin`.

> Se o repositório mudar de dono (por exemplo, for transferido para a conta do advogado), atualize o nome do repositório na linha `repo:` do arquivo `keystatic.config.ts`.

### 3.4 Domínio pantolfi.com.br

1. Na Vercel: **Settings → Domains → Add** e digite `pantolfi.com.br`. Adicione também `www.pantolfi.com.br`, escolhendo redirecioná-lo para `pantolfi.com.br`.
2. A Vercel mostra os registros DNS necessários (normalmente um registro **A** para `pantolfi.com.br` e um **CNAME** para `www`).
3. No **Registro.br** (ou onde o domínio foi registrado): **Domínios → pantolfi.com.br → DNS → Editar zona** e crie exatamente os registros indicados pela Vercel. Cuidado para não apagar os registros de e-mail (**MX**) existentes.
4. A propagação leva de minutos a algumas horas. A Vercel emite o certificado de segurança (HTTPS) sozinha.

### 3.5 Métricas de visitas (opcional)

O site não usa cookies. Se quiser números de visitas sem cookies, crie uma conta no **Plausible** (plausible.io, pago), adicione o site `pantolfi.com.br` e cadastre na Vercel `PUBLIC_PLAUSIBLE_DOMAIN` = `pantolfi.com.br`. Depois do **Redeploy** a contagem começa. Atualize a Política de Privacidade mencionando a ferramenta.

---

## Parte 4 — Para quem programa

| Comando                           | O que faz                                                                                  |
| --------------------------------- | ------------------------------------------------------------------------------------------ |
| `npm install`                     | instala as dependências (Node.js 22 ou mais recente)                                       |
| `npm run dev`                     | abre o site em `http://localhost:4321`; o painel em `/keystatic` grava direto nos arquivos |
| `npm run build`                   | verifica os tipos, compila, gera o índice de busca e os cabeçalhos de segurança            |
| `npm run lint` / `npm run format` | verificação e formatação do código                                                         |

- **Organização:** conteúdo em `src/content`, componentes em `src/components`, animações em `src/motion` (parâmetros em `src/motion/config.ts`), tokens em `src/styles/tokens.css`, textos fixos da interface em `src/i18n`.
- **Segurança (CSP):** a política de conteúdo é gerada a cada compilação por `scripts/cabecalhos-de-seguranca.mjs`, que autoriza por hash os scripts embutidos. Um script novo carregado de outro site precisa ser incluído nesse arquivo.
- **Inglês:** a estrutura está pronta em `src/i18n/en.ts`. As páginas em `/en/` só devem ser criadas com tradução revisada (nunca automática). Ao ativar, ligue a opção "Mostrar o seletor EN" em _Dados gerais_ e inclua os links `hreflang` em `src/components/layout/Seo.astro`.
