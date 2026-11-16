import { collection, config, fields, singleton } from '@keystatic/core';

/**
 * PAINEL DE EDIÇÃO (/admin)
 * Cada campo abaixo corresponde a um campo do site. Os textos de ajuda lembram as
 * regras do Provimento 205/2021 da OAB. Ao salvar, o painel grava a alteração no
 * GitHub e o site é republicado sozinho em poucos minutos.
 *
 * No computador (npm run dev) o painel grava direto nos arquivos da pasta src/content.
 */

const ajudaOab =
  'Texto informativo e sóbrio. Não cite clientes, valores, resultados de casos nem prometa resultados (Provimento 205/2021).';

const seo = fields.object(
  {
    titulo: fields.text({
      label: 'Título para buscadores',
      description: 'Opcional. Se ficar vazio, o site usa o título da página.',
    }),
    descricao: fields.text({
      label: 'Descrição para buscadores',
      description: 'Opcional. Até 160 caracteres. Aparece no Google abaixo do título.',
      multiline: true,
      validation: { length: { max: 170 } },
    }),
  },
  { label: 'Buscadores (SEO)' },
);

const retrato = (directory: string) => ({
  retrato: fields.image({
    label: 'Retrato',
    description: 'Foto profissional do advogado (de preferência vertical, 4:5).',
    directory: `src/assets/images/${directory}`,
    publicPath: `../../assets/images/${directory}/`,
  }),
  retratoAlt: fields.text({
    label: 'Descrição do retrato',
    description:
      'Obrigatória se houver retrato. Descreva a foto para pessoas que usam leitores de tela.',
  }),
});

const principio = fields.object({
  titulo: fields.text({ label: 'Princípio', validation: { length: { min: 1 } } }),
  resumo: fields.text({
    label: 'Descrição curta (página inicial)',
    multiline: true,
    validation: { length: { min: 1 } },
  }),
  texto: fields.text({
    label: 'Texto mais longo (página Sobre)',
    multiline: true,
    validation: { length: { min: 1 } },
  }),
});

export default config({
  storage: import.meta.env.PROD
    ? { kind: 'github', repo: 'LuisGRCS/pantolfi-de-souza-site' }
    : { kind: 'local' },

  ui: {
    brand: { name: 'Pantolfi de Souza' },
    navigation: {
      Conteúdo: ['publicacoes', 'areas', 'trajetoria'],
      Páginas: ['inicio', 'sobre'],
      Configurações: ['configuracoes', 'privacidade', 'aviso-legal'],
    },
  },

  singletons: {
    configuracoes: singleton({
      label: 'Dados gerais e contatos',
      path: 'src/content/configuracoes',
      format: { data: 'json' },
      schema: {
        nome: fields.text({ label: 'Nome', validation: { length: { min: 1 } } }),
        posicionamento: fields.text({
          label: 'Posicionamento',
          description: 'Ex.: Advocacia Empresarial',
          validation: { length: { min: 1 } },
        }),
        oab: fields.text({ label: 'Número da OAB/SP', validation: { length: { min: 1 } } }),
        anoInscricaoOab: fields.text({
          label: 'Ano de inscrição na OAB',
          description: 'Quatro dígitos. Usado para calcular os anos de atuação.',
          validation: { length: { min: 1 } },
        }),
        telefone: fields.text({
          label: 'Telefone (como aparece no site)',
          validation: { length: { min: 1 } },
        }),
        whatsapp: fields.text({
          label: 'WhatsApp (somente números)',
          description: 'Com 55 e DDD, sem espaços. Ex.: 5511975073970',
          validation: { length: { min: 12 } },
        }),
        email: fields.text({ label: 'E-mail', validation: { length: { min: 1 } } }),
        cidade: fields.text({ label: 'Cidade / bairro', validation: { length: { min: 1 } } }),
        endereco: fields.text({ label: 'Endereço completo', validation: { length: { min: 1 } } }),
        horario: fields.text({
          label: 'Horário de atendimento',
          validation: { length: { min: 1 } },
        }),
        redes: fields.array(
          fields.object({
            nome: fields.text({ label: 'Rede', description: 'Ex.: LinkedIn' }),
            url: fields.text({
              label: 'Endereço',
              description: 'Endereço completo, começando com https://. Vazio = rede oculta.',
            }),
          }),
          { label: 'Redes profissionais', itemLabel: (props) => props.fields.nome.value || 'Rede' },
        ),
        inglesAtivo: fields.checkbox({
          label: 'Mostrar o seletor de idioma "EN"',
          description: 'Ative somente quando houver páginas traduzidas.',
        }),
      },
    }),

    inicio: singleton({
      label: 'Página inicial',
      path: 'src/content/paginas/inicio',
      format: { data: 'json' },
      schema: {
        tagline: fields.text({
          label: 'Frase de posicionamento (abertura)',
          description: `Curta, em uma ou duas linhas. ${ajudaOab}`,
          validation: { length: { min: 1 } },
        }),
        imagemHero: fields.image({
          label: 'Imagem de fundo da abertura',
          description:
            'Opcional. Arquitetura, interiores ou texturas. Sem imagens de banco com símbolos jurídicos.',
          directory: 'src/assets/images/inicio',
          publicPath: '../../assets/images/inicio/',
        }),
        bioCurta: fields.text({
          label: 'Apresentação curta',
          description: 'Dois ou três períodos. Separe parágrafos com uma linha em branco.',
          multiline: true,
          validation: { length: { min: 1 } },
        }),
        ...retrato('inicio'),
        principios: fields.array(principio, {
          label: 'Forma de trabalhar (3 ou 4 princípios)',
          itemLabel: (props) => props.fields.titulo.value || 'Princípio',
          validation: { length: { min: 3, max: 4 } },
        }),
        contatoTitulo: fields.text({
          label: 'Título da faixa de contato',
          description: 'Ex.: Vamos conversar. Evite chamadas à contratação.',
          validation: { length: { min: 1 } },
        }),
        seo,
      },
    }),

    sobre: singleton({
      label: 'Página Sobre',
      path: 'src/content/paginas/sobre',
      format: { data: 'json' },
      schema: {
        titulo: fields.text({ label: 'Nome da página', validation: { length: { min: 1 } } }),
        abertura: fields.text({
          label: 'Frase de abertura',
          description: ajudaOab,
          validation: { length: { min: 1 } },
        }),
        ...retrato('sobre'),
        biografia: fields.array(
          fields.text({ label: 'Bloco', multiline: true, validation: { length: { min: 1 } } }),
          {
            label: 'Biografia (em blocos curtos)',
            itemLabel: (props) => props.value.slice(0, 60) || 'Bloco',
            validation: { length: { min: 1 } },
          },
        ),
        formacao: fields.array(
          fields.object({
            curso: fields.text({ label: 'Curso' }),
            instituicao: fields.text({ label: 'Instituição' }),
            ano: fields.text({ label: 'Ano' }),
          }),
          {
            label: 'Formação acadêmica',
            description: 'Somente títulos verdadeiros e comprováveis.',
            itemLabel: (props) => props.fields.curso.value || 'Curso',
          },
        ),
        idiomas: fields.array(fields.text({ label: 'Idioma' }), {
          label: 'Idiomas',
          itemLabel: (props) => props.value || 'Idioma',
        }),
        associacoes: fields.array(fields.text({ label: 'Associação ou comissão' }), {
          label: 'Associações e comissões da OAB',
          itemLabel: (props) => props.value || 'Associação',
        }),
        seo,
      },
    }),

    privacidade: singleton({
      label: 'Política de Privacidade',
      path: 'src/content/paginas/privacidade',
      format: { contentField: 'corpo' },
      entryLayout: 'content',
      schema: {
        titulo: fields.text({ label: 'Título', validation: { length: { min: 1 } } }),
        atualizadoEm: fields.date({ label: 'Atualizado em', validation: { isRequired: true } }),
        emRevisao: fields.checkbox({
          label: 'Em revisão',
          description:
            'Mostra um aviso de rascunho no topo da página. Desmarque depois da revisão.',
        }),
        corpo: fields.markdoc({ label: 'Texto', extension: 'md' }),
      },
    }),

    'aviso-legal': singleton({
      label: 'Aviso Legal',
      path: 'src/content/paginas/aviso-legal',
      format: { contentField: 'corpo' },
      entryLayout: 'content',
      schema: {
        titulo: fields.text({ label: 'Título', validation: { length: { min: 1 } } }),
        atualizadoEm: fields.date({ label: 'Atualizado em', validation: { isRequired: true } }),
        emRevisao: fields.checkbox({
          label: 'Em revisão',
          description:
            'Mostra um aviso de rascunho no topo da página. Desmarque depois da revisão.',
        }),
        corpo: fields.markdoc({ label: 'Texto', extension: 'md' }),
      },
    }),
  },

  collections: {
    publicacoes: collection({
      label: 'Publicações',
      path: 'src/content/publicacoes/*',
      slugField: 'titulo',
      entryLayout: 'content',
      format: { contentField: 'corpo' },
      columns: ['tipo', 'data'],
      schema: {
        titulo: fields.slug({
          name: { label: 'Título', validation: { length: { min: 1 } } },
          slug: {
            label: 'Endereço da página',
            description: 'Gerado a partir do título. Evite mudar depois de publicado.',
          },
        }),
        tipo: fields.select({
          label: 'Tipo',
          options: [
            { label: 'Artigo', value: 'artigo' },
            { label: 'Nota técnica', value: 'nota-tecnica' },
            { label: 'Palestra', value: 'palestra' },
            { label: 'Entrevista', value: 'entrevista' },
            { label: 'Evento', value: 'evento' },
            { label: 'Curso/Aula', value: 'curso-aula' },
            { label: 'Livro/Capítulo', value: 'livro-capitulo' },
          ],
          defaultValue: 'artigo',
        }),
        data: fields.date({ label: 'Data', validation: { isRequired: true } }),
        resumo: fields.text({
          label: 'Resumo',
          description: `Até 220 caracteres. ${ajudaOab}`,
          multiline: true,
          validation: { length: { min: 1, max: 220 } },
        }),
        capa: fields.image({
          label: 'Imagem de capa',
          description: 'Opcional. Sem capa, o site gera uma imagem com o título.',
          directory: 'src/assets/images/publicacoes',
          publicPath: '../../assets/images/publicacoes/',
        }),
        capaAlt: fields.text({
          label: 'Descrição da capa',
          description: 'Obrigatória se houver capa (para leitores de tela).',
        }),
        areas: fields.multiRelationship({
          label: 'Áreas relacionadas',
          collection: 'areas',
        }),
        veiculo: fields.text({
          label: 'Veículo / local',
          description: 'Ex.: nome da revista, do portal ou do evento.',
        }),
        linkExterno: fields.url({
          label: 'Link externo',
          description: 'Quando a publicação estiver em outro site.',
        }),
        video: fields.url({
          label: 'Vídeo (YouTube ou Vimeo)',
          description: 'Para palestras e entrevistas. Só carrega quando o visitante clicar.',
        }),
        pdf: fields.file({
          label: 'Arquivo PDF',
          directory: 'public/arquivos',
          publicPath: '/arquivos/',
        }),
        destaque: fields.checkbox({
          label: 'Destacar no topo da página de publicações',
        }),
        rascunho: fields.checkbox({
          label: 'Rascunho (não aparece no site)',
        }),
        seo,
        corpo: fields.markdoc({
          label: 'Texto',
          extension: 'md',
          description: `Use títulos para organizar o texto: eles formam o sumário. ${ajudaOab}`,
          options: {
            image: {
              directory: 'src/assets/images/publicacoes',
              publicPath: '../../assets/images/publicacoes/',
            },
          },
        }),
      },
    }),

    areas: collection({
      label: 'Áreas de atuação',
      path: 'src/content/areas/*',
      slugField: 'titulo',
      format: { data: 'yaml' },
      columns: ['ordem'],
      schema: {
        titulo: fields.slug({
          name: {
            label: 'Nome da área',
            description: 'Use "área de atuação", nunca "especialista em" sem título comprovado.',
            validation: { length: { min: 1 } },
          },
          slug: { label: 'Endereço da página' },
        }),
        ordem: fields.integer({
          label: 'Ordem na lista',
          description: '1 aparece primeiro.',
          validation: { isRequired: true },
        }),
        resumo: fields.text({
          label: 'Resumo em uma frase',
          multiline: true,
          validation: { length: { min: 1, max: 220 } },
        }),
        visaoGeral: fields.text({
          label: 'Visão geral',
          description: `Separe parágrafos com uma linha em branco. ${ajudaOab}`,
          multiline: true,
          validation: { length: { min: 1 } },
        }),
        comoAtuo: fields.array(
          fields.object({
            titulo: fields.text({
              label: 'Serviço',
              description: 'Ex.: Consultivo, Preventivo, Contencioso',
            }),
            descricao: fields.text({ label: 'O que é feito', multiline: true }),
          }),
          { label: 'Como atuo', itemLabel: (props) => props.fields.titulo.value || 'Serviço' },
        ),
        paraQuem: fields.array(fields.text({ label: 'Perfil' }), {
          label: 'Para quem',
          description: 'Perfis atendidos, sem citar clientes.',
          itemLabel: (props) => props.value || 'Perfil',
        }),
        perguntas: fields.array(
          fields.object({
            pergunta: fields.text({ label: 'Pergunta' }),
            resposta: fields.text({
              label: 'Resposta',
              description: 'Informativa, sem prometer resultados.',
              multiline: true,
            }),
          }),
          {
            label: 'Perguntas frequentes',
            itemLabel: (props) => props.fields.pergunta.value || 'Pergunta',
          },
        ),
        rascunho: fields.checkbox({ label: 'Rascunho (não aparece no site)' }),
        seo,
      },
    }),

    trajetoria: collection({
      label: 'Trajetória',
      path: 'src/content/trajetoria/*',
      slugField: 'cargo',
      format: { data: 'yaml' },
      columns: ['periodo', 'tipo'],
      schema: {
        cargo: fields.slug({
          name: { label: 'Cargo, curso ou título', validation: { length: { min: 1 } } },
          slug: { label: 'Identificador do arquivo' },
        }),
        periodo: fields.text({
          label: 'Ano ou período',
          description: 'Ex.: 2018 ou 2015–2019',
          validation: { length: { min: 1 } },
        }),
        ordem: fields.integer({
          label: 'Ordem',
          description: 'Número maior aparece primeiro (use o ano, por exemplo).',
          validation: { isRequired: true },
        }),
        tipo: fields.select({
          label: 'Tipo de marco',
          options: [
            { label: 'Formação', value: 'formacao' },
            { label: 'Atuação profissional', value: 'atuacao' },
            { label: 'Acadêmico (docência, bancas)', value: 'academico' },
            { label: 'Reconhecimento', value: 'reconhecimento' },
          ],
          defaultValue: 'atuacao',
        }),
        instituicao: fields.text({ label: 'Instituição', validation: { length: { min: 1 } } }),
        descricao: fields.text({ label: 'Descrição breve', multiline: true }),
        destaque: fields.checkbox({
          label: 'Mostrar na página inicial',
          description: 'Escolha de 3 a 5 marcos.',
        }),
      },
    }),
  },
});
