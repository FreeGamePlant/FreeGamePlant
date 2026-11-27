/* ============================================================
   FGP TECHNOLOGIES — state.js
   Estado global, constantes e referências DOM centralizadas.
   Este arquivo não contém lógica de negócio, apenas dados e referências.
   ============================================================ */

/* Re-export da chave de rascunho (definida em utils.js) para que
   qualquer módulo possa importá-la de um ponto único. */
export { JOURNEY_DRAFT_KEY } from './utils.js';

/* ============================================================
   1. BASE DE DADOS HIERÁRQUICA (Catálogo)
   ============================================================ */
export const CATEGORIES_DB = [
  {
    id: 'apps',
    icon: 'fa-mobile-screen-button',
    title: 'Aplicativos',
    description: 'Apps para Android, iOS e web — do MVP institucional ao produto empresarial completo.',
    features: ['Desenvolvimento nativo ou multiplataforma', 'Publicação nas lojas oficiais', 'Suporte e manutenção opcional'],
    subcategories: [
      {
        id: 'app-android',
        icon: 'fa-android',
        title: 'App Android',
        description: 'Desenvolvimento nativo para a plataforma Android, com publicação na Play Store.',
        priceRange: 'R$ 5.000 – 60.000+',
        priceNote: 'Varia conforme a complexidade do aplicativo',
        deadline: 'Prazo variável conforme escopo',
        status: 'available',
        longDescription: 'Aplicativo nativo para dispositivos Android. Cobre desde catálogos digitais até sistemas com autenticação, banco de dados e integrações.',
        features: ['Desenvolvimento nativo (Kotlin/Java)', 'Publicação na Play Store', 'Testes e ajustes de compatibilidade'],
        projectTypes: [
          'Institucional / estático — catálogo, portfólio, apresentação (R$ 5.000–15.000, 2–8 semanas)',
          'Informativo interativo — busca, filtros, formulários, navegação avançada (orçamento conforme complexidade)',
          'Com backend e login — cadastro, perfis, banco de dados, integrações (R$ 15.000–60.000, 2–5 meses para MVP)',
          'Empresarial avançado — regras de negócio, integrações, painel administrativo (avaliação técnica)'
        ],
        paymentTerms: ['À vista com desconto negociável', 'Parcelamento mensal durante o desenvolvimento', 'Primeira parcela antes do início'],
        additionalCosts: ['Taxa anual de desenvolvedor Google Play', 'Serviços de backend, hospedagem e APIs pagas', 'Certificados e ferramentas de terceiros'],
        observations: [
          'A faixa de referência de mercado para MVPs empresariais fica em R$ 30.000–60.000.',
          'A publicação exige adequação às políticas da Play Store.',
          'O prazo definitivo depende da clareza do escopo funcional.'
        ]
      },
      {
        id: 'app-ios',
        icon: 'fa-apple',
        title: 'App iOS',
        description: 'Desenvolvimento nativo para iPhone e iPad, com publicação na App Store.',
        priceRange: 'Orçamento após análise',
        priceNote: 'Publicação e testes exigem avaliação específica',
        deadline: 'Prazo definido após análise do projeto',
        status: 'evaluation',
        longDescription: 'Aplicativo nativo para iOS. As exigências da Apple (revisão, ferramentas, testes em dispositivos) influenciam diretamente no investimento e no prazo.',
        features: ['Desenvolvimento nativo (Swift)', 'Publicação na App Store', 'Conformidade com diretrizes Apple'],
        projectTypes: ['Institucional / estático', 'Informativo interativo', 'Com backend e login', 'Empresarial avançado'],
        paymentTerms: ['À vista ou parcelamento mensal', 'Primeira parcela antes do início'],
        additionalCosts: ['Apple Developer Program (taxa anual)', 'Mac de desenvolvimento (quando aplicável)', 'Serviços externos e APIs'],
        observations: [
          'Não assumimos valores idênticos aos projetos Android.',
          'A revisão da Apple é criteriosa e pode gerar ajustes.',
          'Serviço sob avaliação técnica nesta fase da FGP.'
        ]
      },
      {
        id: 'app-multiplataforma',
        icon: 'fa-layer-group',
        title: 'App multiplataforma',
        description: 'Base compartilhada de código para Android, iOS e, quando aplicável, web.',
        priceRange: 'A partir de R$ 14.900',
        priceNote: 'Referência para MVP multiplataforma',
        deadline: 'Prazo de referência: 45 a 90 dias',
        status: 'available',
        longDescription: 'Uma única base de código para múltiplas plataformas. Reduz duplicação de desenvolvimento, mas não elimina testes, adaptações e requisitos específicos de cada loja.',
        features: ['Código compartilhado (Flutter/React Native)', 'Android, iOS e web', 'Atualizações centralizadas'],
        projectTypes: ['Multiplataforma estático', 'Multiplataforma interativo', 'Multiplataforma com backend', 'Aplicação empresarial multiplataforma (avaliação técnica)'],
        paymentTerms: ['À vista ou parcelamento mensal', 'Primeira parcela antes do início'],
        additionalCosts: ['Taxas de publicação em cada loja', 'Serviços de backend, APIs e hospedagem', 'Ferramentas e licenças específicas'],
        observations: [
          'A referência de R$ 14.900 é para MVPs divulgados por fornecedores.',
          'O prazo de 45–90 dias aplica-se ao MVP padrão.',
          'Recursos nativos específicos de cada plataforma podem exigir código separado.'
        ]
      },
      {
        id: 'app-custom',
        icon: 'fa-sliders',
        title: 'App sob medida',
        description: 'Aplicativo projetado do zero para um processo ou produto específico.',
        priceRange: 'R$ 30.000 – 120.000+',
        priceNote: 'Projetos avançados podem superar R$ 150.000',
        deadline: 'Prazo de referência: 2 a 5 meses para MVP',
        status: 'evaluation',
        longDescription: 'Aplicativo construído exclusivamente para o seu negócio, com funcionalidades e integrações específicas.',
        features: ['Escopo dedicado', 'Integrações específicas', 'Design e UX personalizados'],
        projectTypes: ['Aplicativo de serviços', 'Aplicativo comercial', 'Aplicativo de gerenciamento', 'Aplicativo transacional', 'Aplicativo com integrações avançadas'],
        paymentTerms: ['À vista ou parcelamento mensal conforme cronograma', 'Primeira parcela antes do início'],
        additionalCosts: ['Backend dedicado e hospedagem', 'Integrações com sistemas legados', 'Serviços de terceiros'],
        observations: [
          'Avaliação técnica obrigatória antes de qualquer proposta.',
          'Complexidade pode alterar significativamente prazo e valor.',
          'Serviço sob avaliação técnica nesta fase da FGP.'
        ]
      }
    ]
  },
  {
    id: 'sites',
    icon: 'fa-globe',
    title: 'Sites',
    description: 'Do cartão de visitas digital à loja virtual completa.',
    features: ['Design responsivo', 'SEO básico incluído', 'Painel administrativo quando contratado'],
    subcategories: [
      {
        id: 'landing-page',
        icon: 'fa-bullseye',
        title: 'Landing page',
        description: 'Página única focada em conversão para produto, serviço ou campanha.',
        priceRange: 'R$ 900 – 2.500',
        priceNote: 'Referência para landing pages simples',
        deadline: 'Prazo estimado: 1 a 2 semanas',
        status: 'available',
        longDescription: 'Página única, com design focado em conversão e estrutura enxuta para campanhas ou lançamentos.',
        features: ['Design focado em conversão', 'Layout responsivo', 'Formulário de contato'],
        projectTypes: ['Landing page simples', 'Landing page personalizada', 'Landing page com formulários e integrações'],
        paymentTerms: ['À vista ou em até 3 parcelas', 'Primeira parcela antes do início'],
        additionalCosts: ['Domínio e hospedagem', 'Ferramentas de automação ou CRM', 'Integrações pagas'],
        observations: ['Valor total do projeto — não é mensalidade.', 'Prazo pode variar conforme quantidade de seções e integrações.']
      },
      {
        id: 'site-institucional',
        icon: 'fa-building',
        title: 'Site institucional',
        description: 'Site de apresentação da empresa, com múltiplas seções e páginas.',
        priceRange: 'R$ 1.500 – 6.000',
        priceNote: 'Referência para 5 a 10 páginas',
        deadline: 'Prazo estimado: 2 a 4 semanas',
        status: 'available',
        longDescription: 'Site institucional com múltiplas páginas, apresentando a empresa, serviços, equipe e canais de contato.',
        features: ['Múltiplas páginas', 'Design responsivo', 'Otimização básica de SEO'],
        projectTypes: ['Institucional básico', 'Institucional personalizado', 'Institucional com CMS', 'Institucional com blog'],
        paymentTerms: ['À vista ou parcelado durante o desenvolvimento', 'Primeira parcela antes do início'],
        additionalCosts: ['Domínio e hospedagem', 'Plugins ou licenças premium', 'Serviços de e-mail profissional'],
        observations: ['Projetos com mais páginas ou recursos avançados recebem orçamento próprio.', 'CMS e blog influenciam no prazo e no valor.']
      },
      {
        id: 'portfolio-catalogo',
        icon: 'fa-images',
        title: 'Portfólio / catálogo digital',
        description: 'Apresentação visual de projetos, produtos ou serviços.',
        priceRange: 'Orçamento conforme conteúdo',
        priceNote: 'Depende da quantidade de itens e recursos',
        deadline: 'Prazo definido após análise',
        status: 'available',
        longDescription: 'Site voltado à exposição de trabalhos, produtos ou serviços, com foco em apresentação visual.',
        features: ['Galeria de imagens', 'Layout responsivo', 'Filtros e categorias'],
        projectTypes: ['Portfólio profissional', 'Catálogo de produtos', 'Catálogo de serviços', 'Galeria e apresentação de projetos'],
        paymentTerms: ['À vista ou parcelado', 'Primeira parcela antes do início'],
        additionalCosts: ['Domínio e hospedagem', 'Sessão de fotos (não inclusa)', 'Integrações com redes sociais'],
        observations: ['Valor e prazo dependem da quantidade de conteúdo e recursos desejados.']
      },
      {
        id: 'loja-virtual',
        icon: 'fa-cart-shopping',
        title: 'Loja virtual',
        description: 'E-commerce completo com catálogo, carrinho e checkout.',
        priceRange: 'R$ 2.000 – 9.000',
        priceNote: 'Referência para plataformas prontas',
        deadline: 'Prazo estimado: 3 a 6 semanas',
        status: 'available',
        longDescription: 'Loja virtual com catálogo, carrinho e checkout. A referência considera plataformas prontas e configuração.',
        features: ['Catálogo de produtos', 'Carrinho e checkout', 'Painel administrativo'],
        projectTypes: ['Loja em plataforma pronta (R$ 2.000–9.000)', 'Loja personalizada', 'E-commerce com integrações', 'E-commerce sob medida (orçamento separado)'],
        paymentTerms: ['À vista ou parcelado', 'Primeira parcela antes do início'],
        additionalCosts: ['Plataforma (mensalidade)', 'Gateway de pagamento (taxas por transação)', 'Domínio, hospedagem e certificado SSL', 'Integrações com logística e ERP'],
        observations: [
          'Projetos sob medida possuem orçamento separado.',
          'Checkout personalizado e integrações financeiras exigem avaliação técnica.',
          'Não inclui custos de gateways e taxas de terceiros.'
        ]
      },
      {
        id: 'webapp-custom',
        icon: 'fa-code',
        title: 'Site personalizado / Web App',
        description: 'Site com funcionalidades sob medida, integrações e área restrita.',
        priceRange: 'R$ 10.000 – 25.000+',
        priceNote: 'Referência para aplicações web leves',
        deadline: 'Prazo definido conforme escopo',
        status: 'evaluation',
        longDescription: 'Aplicação web com lógica própria, área de usuário e/ou banco de dados. Não é apenas um site — é um sistema na web.',
        features: ['Lógica personalizada', 'Integrações com APIs', 'Área de usuário'],
        projectTypes: ['Portal informativo', 'Web app interativo', 'Área de usuário', 'Aplicação com banco de dados', 'Sistema web personalizado (avaliação técnica)'],
        paymentTerms: ['À vista ou parcelamento mensal', 'Primeira parcela antes do início'],
        additionalCosts: ['Backend, hospedagem e banco de dados', 'APIs e serviços de terceiros', 'Infraestrutura de e-mail e notificações'],
        observations: [
          'Valor de referência é para projetos leves, não para sistemas complexos.',
          'Escopo detalhado necessário antes da proposta.',
          'Serviço sob avaliação técnica para casos complexos.'
        ]
      }
    ]
  },
  {
    id: 'sistemas',
    icon: 'fa-server',
    title: 'Sistemas',
    description: 'Sistemas internos, painéis e automação de processos.',
    features: ['Análise de processo antes do desenvolvimento', 'Controle de usuários e permissões', 'Evolução contínua possível'],
    subcategories: [
      {
        id: 'sistema-gestao',
        icon: 'fa-clipboard-list',
        title: 'Sistema de gestão',
        description: 'Sistema para organizar clientes, produtos, pedidos ou operações internas.',
        priceRange: 'R$ 18.000 – 45.000',
        priceNote: 'Referência para sistemas simples (CRUD)',
        deadline: 'Prazo estimado: 6 a 10 semanas',
        status: 'evaluation',
        longDescription: 'Sistema para cadastros, consultas e relatórios. As referências consideram escopos limitados, não sistemas empresariais completos.',
        features: ['Cadastros e relatórios', 'Controle de usuários', 'Painel personalizado'],
        projectTypes: ['Gestão de clientes', 'Gestão de produtos', 'Gestão de pedidos', 'Gestão operacional'],
        paymentTerms: ['À vista ou parcelamento mensal', 'Primeira parcela antes do início'],
        additionalCosts: ['Servidor, banco de dados e hospedagem', 'Backups e monitoramento', 'Integrações com sistemas legados'],
        observations: [
          'Valores de referência são para escopos limitados.',
          'Sistemas empresariais completos exigem orçamento próprio.',
          'Serviço sob avaliação técnica antes da contratação.'
        ]
      },
      {
        id: 'painel-admin',
        icon: 'fa-gauge-high',
        title: 'Painel administrativo',
        description: 'Dashboard para visualizar métricas e administrar dados.',
        priceRange: 'Orçamento após análise',
        priceNote: 'Fontes de dados e permissões influenciam',
        deadline: 'Prazo definido após escopo',
        status: 'evaluation',
        longDescription: 'Painel administrativo para visualização e gestão de dados. O valor depende de quantos indicadores, fontes de dados, permissões e funcionalidades forem necessários.',
        features: ['Visualização de dados', 'Gestão de conteúdo', 'Controle de permissões'],
        projectTypes: ['Dashboard básico', 'Painel de controle', 'Gestão de conteúdo', 'Administração de usuários', 'Painel com relatórios'],
        paymentTerms: ['À vista ou parcelamento', 'Primeira parcela antes do início'],
        additionalCosts: ['Backend e banco de dados', 'Integrações com fontes de dados', 'Hospedagem e monitoramento'],
        observations: ['Avaliação de escopo obrigatória antes do orçamento.', 'Fontes de dados e permissões influenciam diretamente o valor.']
      },
      {
        id: 'automacao',
        icon: 'fa-robot',
        title: 'Automação e integrações',
        description: 'Automação de tarefas e integração entre sistemas via API.',
        priceRange: 'R$ 5.000 – 50.000+',
        priceNote: 'APIs simples R$ 5–15k · Complexas R$ 30–50k+',
        deadline: 'Prazo de referência: 8 a 24 semanas',
        status: 'available',
        longDescription: 'Automação de processos e integração de sistemas. O valor depende do número de sistemas, complexidade das APIs e regras de negócio.',
        features: ['Automação de tarefas', 'Integração com APIs', 'Agendamento e webhooks'],
        projectTypes: ['Automação simples', 'Integração entre sistemas', 'Integrações via API', 'Webhooks', 'Automação empresarial (avaliação)'],
        paymentTerms: ['À vista ou parcelado', 'Primeira parcela antes do início'],
        additionalCosts: ['APIs de terceiros (custos por chamada)', 'Infraestrutura de execução', 'Credenciais e serviços pagos'],
        observations: [
          'Não aplicar o valor de uma API simples a uma integração empresarial complexa.',
          'Prazo depende dos sistemas envolvidos e da documentação disponível.'
        ]
      },
      {
        id: 'sistema-custom',
        icon: 'fa-cogs',
        title: 'Sistema sob medida',
        description: 'Sistema construído do zero para um processo específico do seu negócio.',
        priceRange: 'R$ 25.000 – 150.000+',
        priceNote: 'Interno simples R$ 25–60k · Complexos R$ 45–150k+',
        deadline: 'Prazo de referência: 10 a 20 semanas',
        status: 'evaluation',
        longDescription: 'Sistema dedicado ao seu processo. Escopo construído em conjunto com a FGP durante a análise técnica.',
        features: ['Escopo dedicado', 'Banco de dados próprio', 'Possibilidade de evolução contínua'],
        projectTypes: ['Sistema interno', 'Sistema multiusuário', 'Plataforma empresarial', 'Sistema com integrações', 'Sistema de operações personalizado'],
        paymentTerms: ['À vista ou parcelamento conforme cronograma', 'Primeira parcela antes do início'],
        additionalCosts: ['Infraestrutura (servidor, banco, backups)', 'Integrações críticas', 'Licenças e ferramentas específicas'],
        observations: [
          'Sistemas mais complexos podem superar significativamente a faixa.',
          'Avaliação técnica obrigatória.',
          'Serviço sob avaliação técnica.'
        ]
      }
    ]
  },
  {
    id: 'solucoes',
    icon: 'fa-wand-magic-sparkles',
    title: 'Soluções Digitais',
    description: 'Consultoria, identidade digital, manutenção e integrações.',
    features: ['Consultoria por hora ou pacote', 'Manutenção recorrente opcional', 'Integrações sob demanda'],
    subcategories: [
      {
        id: 'identidade-digital',
        icon: 'fa-fingerprint',
        title: 'Identidade digital',
        description: 'Presença digital completa: site, redes sociais e comunicação visual.',
        priceRange: 'Orçamento personalizado',
        priceNote: 'Depende dos entregáveis definidos',
        deadline: 'Prazo definido conforme escopo',
        status: 'evaluation',
        longDescription: 'Conjunto de ações para consolidar a presença digital de uma marca. Não há preço fixo sem definir os entregáveis.',
        features: ['Diretrizes visuais', 'Presença nas redes', 'Materiais de apoio'],
        projectTypes: ['Identidade visual digital', 'Presença digital', 'Materiais de comunicação', 'Organização da presença online'],
        paymentTerms: ['À vista ou parcelado', 'Primeira parcela antes do início'],
        additionalCosts: ['Ferramentas de design', 'Banco de imagens e fontes', 'Serviços de social media'],
        observations: ['Não é possível fixar preço sem definir os entregáveis.', 'Cada projeto recebe orçamento próprio.']
      },
      {
        id: 'consultoria-tecnica',
        icon: 'fa-lightbulb',
        title: 'Consultoria técnica',
        description: 'Análise, diagnóstico e recomendação para projetos digitais.',
        priceRange: 'R$ 60 – 150 / hora',
        priceNote: 'Referência de mercado para profissionais iniciantes',
        deadline: 'Modalidade: por hora ou pacote',
        status: 'available',
        longDescription: 'Consultoria pontual ou contínua. A cobrança pode ser por hora ou por pacote fechado, conforme a necessidade.',
        features: ['Diagnóstico', 'Recomendações práticas', 'Plano de ação'],
        projectTypes: ['Análise de projetos', 'Diagnóstico técnico', 'Planejamento', 'Orientação tecnológica'],
        paymentTerms: ['Por hora ou pacote', 'Pagamento na entrega do relatório'],
        additionalCosts: ['Acesso a sistemas para análise', 'Ferramentas de diagnóstico (quando aplicável)'],
        observations: [
          'Não é uma tarifa oficial da FGP.',
          'O valor final depende da experiência, escopo e duração.',
          'O valor-hora de R$ 60–150 é referência de mercado, não fixo.'
        ]
      },
      {
        id: 'manutencao',
        icon: 'fa-screwdriver-wrench',
        title: 'Manutenção e suporte',
        description: 'Manutenção contínua de sites, apps ou sistemas já existentes.',
        priceRange: 'R$ 70 – 1.290 / mês',
        priceNote: 'Conforme nível de suporte contratado',
        deadline: 'Modalidade: contratação mensal',
        status: 'available',
        longDescription: 'Plano recorrente para manter o projeto funcionando e atualizado. Escopo e quantidade de suporte definidos em contrato.',
        features: ['Atualizações periódicas', 'Correções conforme escopo', 'Relatórios'],
        projectTypes: [
          'Básico — R$ 70–200/mês · atualizações, backups, monitoramento básico',
          'Intermediário — R$ 197–397/mês · suporte, correções limitadas, atualizações frequentes',
          'Avançado — R$ 797–1.290/mês · monitoramento avançado, backups frequentes, horas limitadas de desenvolvimento'
        ],
        paymentTerms: ['Mensal recorrente', 'Plano anual antecipado com desconto (5–10%, quando aplicável)'],
        additionalCosts: ['Hospedagem e domínio', 'Renovação de licenças e plugins', 'Desenvolvimento além do escopo contratado'],
        observations: [
          'Não oferece suporte ilimitado.',
          'Os valores são referências de planos publicados no Brasil em 2026.',
          'A FGP define em contrato o que cada nível inclui.'
        ]
      },
      {
        id: 'integracoes-apis',
        icon: 'fa-plug',
        title: 'Integrações e APIs',
        description: 'Conexão entre sistemas via APIs e integrações específicas.',
        priceRange: 'R$ 5.000 – 50.000+',
        priceNote: 'APIs simples R$ 5–15k · Complexas R$ 30–50k+',
        deadline: 'Prazo de referência: 8 a 24 semanas',
        status: 'available',
        longDescription: 'Construção de integrações entre sistemas. O escopo depende dos sistemas envolvidos e do nível de complexidade.',
        features: ['APIs REST', 'Webhooks', 'Documentação'],
        projectTypes: ['API simples', 'Integração entre plataformas', 'Webhooks', 'Integração empresarial', 'Integração personalizada'],
        paymentTerms: ['À vista ou parcelado', 'Primeira parcela antes do início'],
        additionalCosts: ['APIs de terceiros', 'Ambientes de teste e produção', 'Credenciais e serviços pagos'],
        observations: ['Não garantir valores sem conhecer os sistemas envolvidos.', 'Prazo depende da documentação e do ambiente de testes.']
      }
    ]
  },
  {
    id: 'business',
    icon: 'fa-briefcase',
    title: 'Serviços e Negócios da FGP',
    description: 'Publicação de jogos, mods de Minecraft, parcerias e consultoria de produto.',
    features: ['Serviços autorais da FGP', 'Orçamento após análise', 'Propostas personalizadas'],
    subcategories: [
      {
        id: 'publicacao-jogos',
        icon: 'fa-gamepad',
        title: 'Publicação de jogos',
        description: 'Apoio na publicação de jogos independentes em lojas digitais.',
        priceRange: 'Orçamento por projeto',
        priceNote: 'Taxas de loja e custos de terceiros separados',
        deadline: 'Prazo definido conforme projeto',
        status: 'evaluation',
        longDescription: 'Suporte completo ou parcial na publicação de um jogo independente em lojas digitais.',
        features: ['Preparação de build', 'Publicação nas lojas', 'Acompanhamento de lançamento'],
        projectTypes: ['Preparação de build', 'Publicação na Play Store', 'Publicação na itch.io', 'Adequação técnica', 'Acompanhamento de lançamento'],
        paymentTerms: ['Por projeto ou etapas', 'Primeira parcela antes do início'],
        additionalCosts: ['Taxa anual de desenvolvedor Google Play', 'Taxas da itch.io (quando aplicável)', 'Materiais de marketing e assets'],
        observations: ['Não há preço único de mercado — cada jogo exige escopo próprio.', 'Serviço sob avaliação técnica nesta fase da FGP.']
      },
      {
        id: 'mods-minecraft',
        icon: 'fa-cubes',
        title: 'Mods e add-ons Minecraft',
        description: 'Desenvolvimento de mods ou add-ons para Minecraft Bedrock.',
        priceRange: 'Orçamento personalizado',
        priceNote: 'Depende de itens, comportamentos e complexidade',
        deadline: 'Prazo definido após escopo detalhado',
        status: 'available',
        longDescription: 'Desenvolvimento de add-ons para Minecraft Bedrock. O valor considera quantidade de itens, comportamentos, entidades, texturas e testes.',
        features: ['Comportamentos e itens', 'Compatibilidade Bedrock', 'Pacote .mcaddon'],
        projectTypes: ['Add-ons de itens', 'Add-ons de entidades', 'Mecânicas e comportamentos', 'Pacotes personalizados', 'Projetos Minecraft Bedrock'],
        paymentTerms: ['Por projeto ou etapas', 'Primeira parcela antes do início'],
        additionalCosts: ['Recursos gráficos e texturas', 'Testes em servidores dedicados', 'Publicação em lojas específicas'],
        observations: ['Não há preço de mercado único comparável.', 'Quantidade de itens e complexidade das mecânicas definem o valor.']
      },
      {
        id: 'parceria-dev',
        icon: 'fa-handshake-angle',
        title: 'Parceria de desenvolvimento',
        description: 'Colaboração contínua em projetos de longo prazo.',
        priceRange: 'Proposta personalizada',
        priceNote: 'Horas, responsabilidades e frequência definem',
        deadline: 'Modalidade: contratação recorrente',
        status: 'evaluation',
        longDescription: 'Parceria de longo prazo com a FGP para desenvolvimento contínuo. Envolve definição de responsabilidades, horas, entregas e propriedade intelectual.',
        features: ['Escopo recorrente', 'Comunicação direta', 'Acompanhamento'],
        projectTypes: ['Parceria por projeto', 'Desenvolvimento recorrente', 'Colaboração tecnológica', 'Desenvolvimento conjunto'],
        paymentTerms: ['Recorrente mensal com escopo definido', 'Possibilidade de anual antecipado com desconto'],
        additionalCosts: ['Infraestrutura compartilhada', 'Ferramentas de colaboração', 'Serviços de terceiros'],
        observations: ['Definir em contrato: propriedade intelectual, responsabilidades e entregas.', 'Serviço sob avaliação técnica.']
      },
      {
        id: 'consultoria-produto',
        icon: 'fa-compass',
        title: 'Consultoria de produto',
        description: 'Orientação sobre escopo, viabilidade e roadmap de um projeto.',
        priceRange: 'R$ 60 – 150 / hora',
        priceNote: 'Referência de mercado para profissionais iniciantes',
        deadline: 'Modalidade: por hora ou pacote',
        status: 'available',
        longDescription: 'Orientação estratégica para produtos digitais. O valor final depende da experiência, escopo e duração.',
        features: ['Análise de escopo', 'Viabilidade técnica', 'Roadmap sugerido'],
        projectTypes: ['Planejamento de produto', 'Análise de viabilidade', 'Definição de escopo', 'Roadmap', 'Orientação de desenvolvimento'],
        paymentTerms: ['Por hora ou pacote', 'Pagamento na entrega do relatório'],
        additionalCosts: ['Ferramentas de prototipação', 'Acesso a dados e métricas do produto'],
        observations: [
          'Não é tarifa oficial da FGP.',
          'O valor-hora é referência de mercado, não fixo.'
        ]
      }
    ]
  }
];

export const NavState = {
  currentCategory: null,
  currentSubcategory: null
};

/* ============================================================
   2. ESTADO DA JORNADA
   ------------------------------------------------------------
   Convenções de telefone:
   - `clientPhoneCountry`  → código numérico do país (sem '+')
                             ex.: '55' (Brasil), '351' (Portugal)
   - `clientPhoneNational` → apenas os dígitos do número nacional
                             (sem DDD separado, sem máscara)
   - `clientPhone`         → valor COMPOSTO final exibido/enviado:
                             "+55 (11) 98765-4321". Atualizado
                             automaticamente por composePhone().

   Os três campos são a fonte única de verdade. O input de telefone
   usa country + national; o payload do Forminit usa `clientPhone`
   já composto.
   ============================================================ */
export const JourneyState = {
  step: 1,

  // Etapa 1: Identificação
  clientType: null, // 'individual' | 'company'
  clientName: '',
  clientEmail: '',
  clientPhone: '',           // valor composto final (+xx …)
  clientPhoneCountry: '55',  // país padrão: Brasil
  clientPhoneNational: '',   // apenas dígitos, sem máscara
  companyName: '',
  contactName: '',
  companySegment: '',

  // Etapas 2, 3, 4: Catálogo
  category: null,
  subcategory: null,
  projectType: '',

  // Etapa 5: Identificação do Projeto
  projectName: '',
  projectContext: '',
  projectProblem: '',
  projectObjective: '',
  expectedResult: '',

  // Etapa 6: Público-alvo
  targetAudience: '',
  audienceAction: '',

  // Etapa 7: Requisitos Detalhados (objeto dinâmico)
  requirements: {},

  // Etapa 8: Identidade Visual
  hasVisualIdentity: null, // 'sim' | 'nao' | 'parcial'
  brandColors: '',
  references: '',
  elementsToAvoid: '',

  // Etapa 9: Conteúdo e Recursos
  availableResources: [],
  needsContentCreation: null, // 'sim' | 'nao' | 'parcial'

  // Etapa 10: Infraestrutura
  hasDomain: null,
  hasHosting: null,
  needsIntegrations: null,
  integrationDetails: '',

  // Etapa 11: Prazo
  deadlineType: null, // 'flexivel' | 'asap' | 'especifica' | 'indefinido'
  deadlineDate: '',
  priority: '',

  // Etapa 12: Comercial
  payment: null,
  maintenance: null,
  commercialObservations: '',

  // Etapa 13: Arquivo
  file: null
};

export const dom = {
  categoriesIntro: () => document.getElementById('categoriesIntro'),
  breadcrumb: () => document.getElementById('breadcrumb'),
  categoriesContainer: () => document.getElementById('categoriesContainer'),
  subcategoriesContainer: () => document.getElementById('subcategoriesContainer'),
  detailsContainer: () => document.getElementById('detailsContainer'),
  siteHeader: () => document.getElementById('siteHeader'),
  colorPanel: () => document.getElementById('colorPanel'),
  sideMenu: () => document.getElementById('sideMenu'),
  sideOverlay: () => document.getElementById('sideOverlay'),
  requestModal: () => document.getElementById('requestModal'),
  accessosModal: () => document.getElementById('accessosModal'),
  journeyModal: () => document.getElementById('journeyModal')
};

export const COLOR_STORAGE_KEY = 'fgp_tech_palette';
export const DEFAULT_PALETTE = { primary: '#3b82f6', accent: '#06b6d4', bg: '#0a0e17', text: '#f1f5f9' };
export const COLOR_PRESETS = [
  { name: 'FGP Tech', palette: { primary: '#3b82f6', accent: '#06b6d4', bg: '#0a0e17', text: '#f1f5f9' } },
  { name: 'Corporativo', palette: { primary: '#2563eb', accent: '#f59e0b', bg: '#0c1424', text: '#f8fafc' } },
  { name: 'Minimal', palette: { primary: '#64748b', accent: '#0ea5e9', bg: '#0f172a', text: '#f1f5f9' } },
  { name: 'Claro', palette: { primary: '#2563eb', accent: '#0891b2', bg: '#f8fafc', text: '#0f172a' } }
];

export const ASSISTANT_MESSAGES = {
  1: 'Olá! Vamos começar identificando quem está solicitando o serviço. Isso nos ajuda a personalizar a comunicação.',
  2: 'Perfeito! Agora, escolha a categoria principal que melhor representa sua necessidade.',
  3: 'Ótimo. Dentro desta categoria, qual serviço específico você procura?',
  4: 'Estamos avançando! Qual modalidade ou tipo de projeto melhor descreve sua ideia?',
  5: 'Conte-nos sobre o projeto. Não precisa usar termos técnicos; explique com suas próprias palavras.',
  6: 'Para quem estamos criando essa solução? Entender o público é fundamental para o sucesso do projeto.',
  7: 'Agora vamos aos detalhes técnicos e funcionais. Selecione ou descreva o que é essencial para o seu projeto.',
  8: 'Sobre a aparência: você já possui uma identidade visual ou referências de estilo que devemos seguir?',
  9: 'Quais materiais você já possui (textos, logos, imagens)? A FGP precisará produzir algo que ainda não existe?',
  10: 'Vamos falar de infraestrutura. O projeto precisará de domínio, hospedagem ou integração com outros sistemas?',
  11: 'Qual é a sua expectativa de prazo? Isso nos ajuda a priorizar e planejar a melhor abordagem.',
  12: 'Como você prefere estruturar o investimento na produção e a manutenção futura?',
  13: 'Tudo pronto! Confira o resumo inteligente da sua solicitação. Você pode voltar e editar qualquer etapa.'
};

export const JOURNEY_TOTAL_BASE_STEPS = 13;
