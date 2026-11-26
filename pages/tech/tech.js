/* ============================================================
   FGP TECHNOLOGIES — tech.js
   Catálogo hierárquico, painel de cores, modais,
   integração com Forminit e jornada guiada de orçamento.
   ============================================================ */

/* ============================================================
   1. CONFIGURAÇÃO DO FORMINIT
   ------------------------------------------------------------
   Substitua 'YOUR_FORMINIT_FORM_ID' pelo ID real do formulário
   criado em https://forminit.com. O endpoint final será:
   https://forminit.com/f/{FORM_ID}
   ------------------------------------------------------------
   Destino configurado no painel do Forminit:
   freegameplantplaystory@gmail.com
   ============================================================ */
const FORMINIT_FORM_ID = 'l6ts8syb4td';
const FORMINIT_ENDPOINT = `https://forminit.com/f/${FORMINIT_FORM_ID}`;

/* ============================================================
   2. BASE DE DADOS HIERÁRQUICA
   ============================================================ */
const CATEGORIES_DB = [
  {
    id: 'apps',
    icon: 'fa-mobile-screen-button',
    title: 'Aplicativos',
    description: 'Apps para Android, iOS e web — do MVP institucional ao produto empresarial completo.',
    features: [
      'Desenvolvimento nativo ou multiplataforma',
      'Publicação nas lojas oficiais',
      'Suporte e manutenção opcional'
    ],
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
        features: [
          'Desenvolvimento nativo (Kotlin/Java)',
          'Publicação na Play Store',
          'Testes e ajustes de compatibilidade'
        ],
        projectTypes: [
          'Institucional / estático — catálogo, portfólio, apresentação (R$ 5.000–15.000, 2–8 semanas)',
          'Informativo interativo — busca, filtros, formulários, navegação avançada (orçamento conforme complexidade)',
          'Com backend e login — cadastro, perfis, banco de dados, integrações (R$ 15.000–60.000, 2–5 meses para MVP)',
          'Empresarial avançado — regras de negócio, integrações, painel administrativo (avaliação técnica)'
        ],
        paymentTerms: [
          'À vista com desconto negociável',
          'Parcelamento mensal durante o desenvolvimento',
          'Primeira parcela antes do início'
        ],
        additionalCosts: [
          'Taxa anual de desenvolvedor Google Play',
          'Serviços de backend, hospedagem e APIs pagas',
          'Certificados e ferramentas de terceiros'
        ],
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
        features: [
          'Desenvolvimento nativo (Swift)',
          'Publicação na App Store',
          'Conformidade com diretrizes Apple'
        ],
        projectTypes: [
          'Institucional / estático',
          'Informativo interativo',
          'Com backend e login',
          'Empresarial avançado'
        ],
        paymentTerms: [
          'À vista ou parcelamento mensal',
          'Primeira parcela antes do início'
        ],
        additionalCosts: [
          'Apple Developer Program (taxa anual)',
          'Mac de desenvolvimento (quando aplicável)',
          'Serviços externos e APIs'
        ],
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
        features: [
          'Código compartilhado (Flutter/React Native)',
          'Android, iOS e web',
          'Atualizações centralizadas'
        ],
        projectTypes: [
          'Multiplataforma estático',
          'Multiplataforma interativo',
          'Multiplataforma com backend',
          'Aplicação empresarial multiplataforma (avaliação técnica)'
        ],
        paymentTerms: [
          'À vista ou parcelamento mensal',
          'Primeira parcela antes do início'
        ],
        additionalCosts: [
          'Taxas de publicação em cada loja',
          'Serviços de backend, APIs e hospedagem',
          'Ferramentas e licenças específicas'
        ],
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
        features: [
          'Escopo dedicado',
          'Integrações específicas',
          'Design e UX personalizados'
        ],
        projectTypes: [
          'Aplicativo de serviços',
          'Aplicativo comercial',
          'Aplicativo de gerenciamento',
          'Aplicativo transacional',
          'Aplicativo com integrações avançadas'
        ],
        paymentTerms: [
          'À vista ou parcelamento mensal conforme cronograma',
          'Primeira parcela antes do início'
        ],
        additionalCosts: [
          'Backend dedicado e hospedagem',
          'Integrações com sistemas legados',
          'Serviços de terceiros'
        ],
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
    features: [
      'Design responsivo',
      'SEO básico incluído',
      'Painel administrativo quando contratado'
    ],
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
        features: [
          'Design focado em conversão',
          'Layout responsivo',
          'Formulário de contato'
        ],
        projectTypes: [
          'Landing page simples',
          'Landing page personalizada',
          'Landing page com formulários e integrações'
        ],
        paymentTerms: [
          'À vista ou em até 3 parcelas',
          'Primeira parcela antes do início'
        ],
        additionalCosts: [
          'Domínio e hospedagem',
          'Ferramentas de automação ou CRM',
          'Integrações pagas'
        ],
        observations: [
          'Valor total do projeto — não é mensalidade.',
          'Prazo pode variar conforme quantidade de seções e integrações.'
        ]
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
        features: [
          'Múltiplas páginas',
          'Design responsivo',
          'Otimização básica de SEO'
        ],
        projectTypes: [
          'Institucional básico',
          'Institucional personalizado',
          'Institucional com CMS',
          'Institucional com blog'
        ],
        paymentTerms: [
          'À vista ou parcelado durante o desenvolvimento',
          'Primeira parcela antes do início'
        ],
        additionalCosts: [
          'Domínio e hospedagem',
          'Plugins ou licenças premium',
          'Serviços de e-mail profissional'
        ],
        observations: [
          'Projetos com mais páginas ou recursos avançados recebem orçamento próprio.',
          'CMS e blog influenciam no prazo e no valor.'
        ]
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
        features: [
          'Galeria de imagens',
          'Layout responsivo',
          'Filtros e categorias'
        ],
        projectTypes: [
          'Portfólio profissional',
          'Catálogo de produtos',
          'Catálogo de serviços',
          'Galeria e apresentação de projetos'
        ],
        paymentTerms: [
          'À vista ou parcelado',
          'Primeira parcela antes do início'
        ],
        additionalCosts: [
          'Domínio e hospedagem',
          'Sessão de fotos (não inclusa)',
          'Integrações com redes sociais'
        ],
        observations: [
          'Valor e prazo dependem da quantidade de conteúdo e recursos desejados.'
        ]
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
        features: [
          'Catálogo de produtos',
          'Carrinho e checkout',
          'Painel administrativo'
        ],
        projectTypes: [
          'Loja em plataforma pronta (R$ 2.000–9.000)',
          'Loja personalizada',
          'E-commerce com integrações',
          'E-commerce sob medida (orçamento separado)'
        ],
        paymentTerms: [
          'À vista ou parcelado',
          'Primeira parcela antes do início'
        ],
        additionalCosts: [
          'Plataforma (mensalidade)',
          'Gateway de pagamento (taxas por transação)',
          'Domínio, hospedagem e certificado SSL',
          'Integrações com logística e ERP'
        ],
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
        features: [
          'Lógica personalizada',
          'Integrações com APIs',
          'Área de usuário'
        ],
        projectTypes: [
          'Portal informativo',
          'Web app interativo',
          'Área de usuário',
          'Aplicação com banco de dados',
          'Sistema web personalizado (avaliação técnica)'
        ],
        paymentTerms: [
          'À vista ou parcelamento mensal',
          'Primeira parcela antes do início'
        ],
        additionalCosts: [
          'Backend, hospedagem e banco de dados',
          'APIs e serviços de terceiros',
          'Infraestrutura de e-mail e notificações'
        ],
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
    features: [
      'Análise de processo antes do desenvolvimento',
      'Controle de usuários e permissões',
      'Evolução contínua possível'
    ],
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
        features: [
          'Cadastros e relatórios',
          'Controle de usuários',
          'Painel personalizado'
        ],
        projectTypes: [
          'Gestão de clientes',
          'Gestão de produtos',
          'Gestão de pedidos',
          'Gestão operacional'
        ],
        paymentTerms: [
          'À vista ou parcelamento mensal',
          'Primeira parcela antes do início'
        ],
        additionalCosts: [
          'Servidor, banco de dados e hospedagem',
          'Backups e monitoramento',
          'Integrações com sistemas legados'
        ],
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
        features: [
          'Visualização de dados',
          'Gestão de conteúdo',
          'Controle de permissões'
        ],
        projectTypes: [
          'Dashboard básico',
          'Painel de controle',
          'Gestão de conteúdo',
          'Administração de usuários',
          'Painel com relatórios'
        ],
        paymentTerms: [
          'À vista ou parcelamento',
          'Primeira parcela antes do início'
        ],
        additionalCosts: [
          'Backend e banco de dados',
          'Integrações com fontes de dados',
          'Hospedagem e monitoramento'
        ],
        observations: [
          'Avaliação de escopo obrigatória antes do orçamento.',
          'Fontes de dados e permissões influenciam diretamente o valor.'
        ]
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
        features: [
          'Automação de tarefas',
          'Integração com APIs',
          'Agendamento e webhooks'
        ],
        projectTypes: [
          'Automação simples',
          'Integração entre sistemas',
          'Integrações via API',
          'Webhooks',
          'Automação empresarial (avaliação)'
        ],
        paymentTerms: [
          'À vista ou parcelado',
          'Primeira parcela antes do início'
        ],
        additionalCosts: [
          'APIs de terceiros (custos por chamada)',
          'Infraestrutura de execução',
          'Credenciais e serviços pagos'
        ],
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
        features: [
          'Escopo dedicado',
          'Banco de dados próprio',
          'Possibilidade de evolução contínua'
        ],
        projectTypes: [
          'Sistema interno',
          'Sistema multiusuário',
          'Plataforma empresarial',
          'Sistema com integrações',
          'Sistema de operações personalizado'
        ],
        paymentTerms: [
          'À vista ou parcelamento conforme cronograma',
          'Primeira parcela antes do início'
        ],
        additionalCosts: [
          'Infraestrutura (servidor, banco, backups)',
          'Integrações críticas',
          'Licenças e ferramentas específicas'
        ],
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
    features: [
      'Consultoria por hora ou pacote',
      'Manutenção recorrente opcional',
      'Integrações sob demanda'
    ],
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
        features: [
          'Diretrizes visuais',
          'Presença nas redes',
          'Materiais de apoio'
        ],
        projectTypes: [
          'Identidade visual digital',
          'Presença digital',
          'Materiais de comunicação',
          'Organização da presença online'
        ],
        paymentTerms: [
          'À vista ou parcelado',
          'Primeira parcela antes do início'
        ],
        additionalCosts: [
          'Ferramentas de design',
          'Banco de imagens e fontes',
          'Serviços de social media'
        ],
        observations: [
          'Não é possível fixar preço sem definir os entregáveis.',
          'Cada projeto recebe orçamento próprio.'
        ]
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
        features: [
          'Diagnóstico',
          'Recomendações práticas',
          'Plano de ação'
        ],
        projectTypes: [
          'Análise de projetos',
          'Diagnóstico técnico',
          'Planejamento',
          'Orientação tecnológica'
        ],
        paymentTerms: [
          'Por hora ou pacote',
          'Pagamento na entrega do relatório'
        ],
        additionalCosts: [
          'Acesso a sistemas para análise',
          'Ferramentas de diagnóstico (quando aplicável)'
        ],
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
        features: [
          'Atualizações periódicas',
          'Correções conforme escopo',
          'Relatórios'
        ],
        projectTypes: [
          'Básico — R$ 70–200/mês · atualizações, backups, monitoramento básico',
          'Intermediário — R$ 197–397/mês · suporte, correções limitadas, atualizações frequentes',
          'Avançado — R$ 797–1.290/mês · monitoramento avançado, backups frequentes, horas limitadas de desenvolvimento'
        ],
        paymentTerms: [
          'Mensal recorrente',
          'Plano anual antecipado com desconto (5–10%, quando aplicável)'
        ],
        additionalCosts: [
          'Hospedagem e domínio',
          'Renovação de licenças e plugins',
          'Desenvolvimento além do escopo contratado'
        ],
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
        features: [
          'APIs REST',
          'Webhooks',
          'Documentação'
        ],
        projectTypes: [
          'API simples',
          'Integração entre plataformas',
          'Webhooks',
          'Integração empresarial',
          'Integração personalizada'
        ],
        paymentTerms: [
          'À vista ou parcelado',
          'Primeira parcela antes do início'
        ],
        additionalCosts: [
          'APIs de terceiros',
          'Ambientes de teste e produção',
          'Credenciais e serviços pagos'
        ],
        observations: [
          'Não garantir valores sem conhecer os sistemas envolvidos.',
          'Prazo depende da documentação e do ambiente de testes.'
        ]
      }
    ]
  },
  {
    id: 'business',
    icon: 'fa-briefcase',
    title: 'Serviços e Negócios da FGP',
    description: 'Publicação de jogos, mods de Minecraft, parcerias e consultoria de produto.',
    features: [
      'Serviços autorais da FGP',
      'Orçamento após análise',
      'Propostas personalizadas'
    ],
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
        features: [
          'Preparação de build',
          'Publicação nas lojas',
          'Acompanhamento de lançamento'
        ],
        projectTypes: [
          'Preparação de build',
          'Publicação na Play Store',
          'Publicação na itch.io',
          'Adequação técnica',
          'Acompanhamento de lançamento'
        ],
        paymentTerms: [
          'Por projeto ou etapas',
          'Primeira parcela antes do início'
        ],
        additionalCosts: [
          'Taxa anual de desenvolvedor Google Play',
          'Taxas da itch.io (quando aplicável)',
          'Materiais de marketing e assets'
        ],
        observations: [
          'Não há preço único de mercado — cada jogo exige escopo próprio.',
          'Serviço sob avaliação técnica nesta fase da FGP.'
        ]
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
        features: [
          'Comportamentos e itens',
          'Compatibilidade Bedrock',
          'Pacote .mcaddon'
        ],
        projectTypes: [
          'Add-ons de itens',
          'Add-ons de entidades',
          'Mecânicas e comportamentos',
          'Pacotes personalizados',
          'Projetos Minecraft Bedrock'
        ],
        paymentTerms: [
          'Por projeto ou etapas',
          'Primeira parcela antes do início'
        ],
        additionalCosts: [
          'Recursos gráficos e texturas',
          'Testes em servidores dedicados',
          'Publicação em lojas específicas'
        ],
        observations: [
          'Não há preço de mercado único comparável.',
          'Quantidade de itens e complexidade das mecânicas definem o valor.'
        ]
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
        features: [
          'Escopo recorrente',
          'Comunicação direta',
          'Acompanhamento'
        ],
        projectTypes: [
          'Parceria por projeto',
          'Desenvolvimento recorrente',
          'Colaboração tecnológica',
          'Desenvolvimento conjunto'
        ],
        paymentTerms: [
          'Recorrente mensal com escopo definido',
          'Possibilidade de anual antecipado com desconto'
        ],
        additionalCosts: [
          'Infraestrutura compartilhada',
          'Ferramentas de colaboração',
          'Serviços de terceiros'
        ],
        observations: [
          'Definir em contrato: propriedade intelectual, responsabilidades e entregas.',
          'Serviço sob avaliação técnica.'
        ]
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
        features: [
          'Análise de escopo',
          'Viabilidade técnica',
          'Roadmap sugerido'
        ],
        projectTypes: [
          'Planejamento de produto',
          'Análise de viabilidade',
          'Definição de escopo',
          'Roadmap',
          'Orientação de desenvolvimento'
        ],
        paymentTerms: [
          'Por hora ou pacote',
          'Pagamento na entrega do relatório'
        ],
        additionalCosts: [
          'Ferramentas de prototipação',
          'Acesso a dados e métricas do produto'
        ],
        observations: [
          'Não é tarifa oficial da FGP.',
          'O valor-hora é referência de mercado, não fixo.'
        ]
      }
    ]
  }
];

/* ============================================================
   3. UTILITÁRIOS
   ============================================================ */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = String(str == null ? '' : str);
  return div.innerHTML;
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

/* ============================================================
   4. ESTADO DE NAVEGAÇÃO (catálogo)
   ============================================================ */
const NavState = {
  currentCategory: null,
  currentSubcategory: null
};

/* ============================================================
   5. REFERÊNCIAS DOM
   ============================================================ */
const dom = {
  categoriesIntro:        () => document.getElementById('categoriesIntro'),
  breadcrumb:             () => document.getElementById('breadcrumb'),
  categoriesContainer:    () => document.getElementById('categoriesContainer'),
  subcategoriesContainer: () => document.getElementById('subcategoriesContainer'),
  detailsContainer:       () => document.getElementById('detailsContainer'),
  siteHeader:             () => document.getElementById('siteHeader'),
  colorPanel:             () => document.getElementById('colorPanel'),
  sideMenu:               () => document.getElementById('sideMenu'),
  sideOverlay:            () => document.getElementById('sideOverlay'),
  requestModal:           () => document.getElementById('requestModal'),
  accessosModal:          () => document.getElementById('accessosModal'),
  journeyModal:           () => document.getElementById('journeyModal')
};

/* ============================================================
   6. NAVEGAÇÃO ENTRE NÍVEIS (catálogo)
   ============================================================ */
function showLevel(level) {
  const intro = dom.categoriesIntro();
  const breadcrumb = dom.breadcrumb();
  const cats = dom.categoriesContainer();
  const subs = dom.subcategoriesContainer();
  const dets = dom.detailsContainer();

  if (level === 1) {
    intro.classList.remove('hidden');
    breadcrumb.classList.add('hidden');
    cats.classList.remove('hidden');
    subs.classList.add('hidden');
    dets.classList.add('hidden');
  } else if (level === 2) {
    intro.classList.add('hidden');
    breadcrumb.classList.remove('hidden');
    cats.classList.add('hidden');
    subs.classList.remove('hidden');
    dets.classList.add('hidden');
  } else if (level === 3) {
    intro.classList.add('hidden');
    breadcrumb.classList.remove('hidden');
    cats.classList.add('hidden');
    subs.classList.add('hidden');
    dets.classList.remove('hidden');
  }
}

function scrollToCategories() {
  const el = document.getElementById('categorias');
  if (el) {
    const offset = 80;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

function openCategory(categoryId) {
  const cat = CATEGORIES_DB.find(c => c.id === categoryId);
  if (!cat) return;
  NavState.currentCategory = categoryId;
  NavState.currentSubcategory = null;
  renderSubcategories(cat);
  renderBreadcrumb();
  showLevel(2);
  scrollToCategories();
}

function openSubcategory(subcategoryId) {
  const cat = CATEGORIES_DB.find(c => c.id === NavState.currentCategory);
  if (!cat) return;
  const sub = cat.subcategories.find(s => s.id === subcategoryId);
  if (!sub) return;
  NavState.currentSubcategory = subcategoryId;
  renderDetails(cat, sub);
  renderBreadcrumb();
  showLevel(3);
  scrollToCategories();
}

function backToCategories() {
  NavState.currentCategory = null;
  NavState.currentSubcategory = null;
  renderBreadcrumb();
  showLevel(1);
  scrollToCategories();
}

function backToSubcategories() {
  NavState.currentSubcategory = null;
  renderBreadcrumb();
  showLevel(2);
  scrollToCategories();
}

/* ============================================================
   7. RENDERIZAÇÃO — NÍVEL 1 (categorias)
   ============================================================ */
function renderCategories() {
  const container = dom.categoriesContainer();
  if (!container) return;

  container.innerHTML = CATEGORIES_DB.map(cat => `
    <article class="category-card">
      <div class="category-card-icon">
        <i class="fas ${cat.icon}"></i>
      </div>
      <h3>${cat.title}</h3>
      <p class="category-card-desc">${cat.description}</p>
      <ul class="category-card-features">
        ${cat.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}
      </ul>
      <div class="category-card-meta">
        <span class="category-card-count">
          <i class="fas fa-layer-group"></i>
          ${cat.subcategories.length} ${cat.subcategories.length === 1 ? 'subcategoria' : 'subcategorias'}
        </span>
        <button class="btn-open" data-category="${cat.id}">
          Abrir <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    </article>
  `).join('');

  container.querySelectorAll('.btn-open').forEach(btn => {
    btn.addEventListener('click', () => openCategory(btn.dataset.category));
  });
}

/* ============================================================
   8. RENDERIZAÇÃO — NÍVEL 2 (subcategorias)
   ============================================================ */
function renderSubcategories(cat) {
  const container = dom.subcategoriesContainer();
  if (!container) return;

  container.innerHTML = `
    <div class="subcategories-header">
      <div class="subcategories-header-text">
        <h2>${cat.title}</h2>
        <p>${cat.description}</p>
      </div>
      <button class="btn-back" id="backToCatsBtn">
        <i class="fas fa-arrow-left"></i> Voltar às categorias
      </button>
    </div>

    <div class="subcategories-grid">
      ${cat.subcategories.map(sub => `
        <article class="subcategory-card" data-subcategory="${sub.id}">
          <div class="subcategory-card-header">
            <div class="subcategory-card-icon">
              <i class="fas ${sub.icon}"></i>
            </div>
            <h3>${sub.title}</h3>
          </div>
          <p class="subcategory-card-desc">${sub.description}</p>
          <div class="subcategory-card-footer">
            <span class="subcategory-card-price">${sub.priceRange}</span>
            <button class="btn-view-details" data-subcategory="${sub.id}">
              Ver detalhes <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </article>
      `).join('')}
    </div>
  `;

  container.querySelector('#backToCatsBtn').addEventListener('click', backToCategories);

  container.querySelectorAll('.subcategory-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.btn-view-details')) return;
      openSubcategory(card.dataset.subcategory);
    });
  });

  container.querySelectorAll('.btn-view-details').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openSubcategory(btn.dataset.subcategory);
    });
  });
}

/* ============================================================
   9. RENDERIZAÇÃO — NÍVEL 3 (detalhes)
   ============================================================ */
function getStatusBadge(status) {
  const map = {
    available:  { label: 'Disponível',            icon: 'fa-circle-check',         cls: 'available' },
    evaluation: { label: 'Sob avaliação técnica', icon: 'fa-triangle-exclamation', cls: 'evaluation' },
    expansion:  { label: 'Em expansão',           icon: 'fa-seedling',             cls: 'expansion' }
  };
  const info = map[status] || map.evaluation;
  return `<span class="status-badge ${info.cls}"><i class="fas ${info.icon}"></i> ${info.label}</span>`;
}

function renderDetails(cat, sub) {
  const container = dom.detailsContainer();
  if (!container) return;

  container.innerHTML = `
    <div class="details-header">
      <button class="btn-back" id="backToSubsBtn">
        <i class="fas fa-arrow-left"></i> Voltar para ${cat.title}
      </button>
      ${getStatusBadge(sub.status)}
    </div>

    <div class="details-card">
      <div class="details-top">
        <div class="details-icon">
          <i class="fas ${sub.icon}"></i>
        </div>
        <div class="details-top-info">
          <div class="details-category-label">${cat.title}</div>
          <h2 class="details-title">${sub.title}</h2>
          <p class="details-description">${sub.longDescription || sub.description}</p>
        </div>
      </div>

      <div class="details-highlight-row">
        <div class="details-highlight">
          <div class="details-highlight-label">
            <i class="fas fa-money-bill-wave"></i> Investimento de referência
          </div>
          <div class="details-highlight-value">
            ${sub.priceRange}
            <small>${sub.priceNote || 'Valor final sujeito ao escopo.'}</small>
          </div>
        </div>

        <div class="details-highlight">
          <div class="details-highlight-label">
            <i class="fas fa-clock"></i> Prazo de desenvolvimento
          </div>
          <div class="details-highlight-value">
            ${sub.deadline}
            <small>Estimativa inicial — pode variar com o escopo.</small>
          </div>
        </div>
      </div>

      <div class="details-sections">
        <div class="details-section">
          <h4><i class="fas fa-list-check"></i> Tipos de projeto atendidos</h4>
          <ul class="details-list">
            ${sub.projectTypes.map(t => `<li><i class="fas fa-angle-right"></i> ${t}</li>`).join('')}
          </ul>
        </div>

        <div class="details-section">
          <h4><i class="fas fa-credit-card"></i> Modalidades de pagamento</h4>
          <ul class="details-list">
            ${sub.paymentTerms.map(p => `<li><i class="fas fa-angle-right"></i> ${p}</li>`).join('')}
          </ul>
        </div>

        <div class="details-section">
          <h4><i class="fas fa-receipt"></i> Custos adicionais</h4>
          <ul class="details-list">
            ${sub.additionalCosts.map(c => `<li><i class="fas fa-angle-right"></i> ${c}</li>`).join('')}
          </ul>
        </div>

        <div class="details-section">
          <h4><i class="fas fa-star"></i> Características</h4>
          <ul class="details-list">
            ${sub.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}
          </ul>
        </div>
      </div>

      <div class="details-observations">
        <h4><i class="fas fa-circle-info"></i> Observações importantes</h4>
        <ul>
          ${sub.observations.map(o => `<li><i class="fas fa-circle-info"></i> ${o}</li>`).join('')}
        </ul>
      </div>

      <div class="details-cta">
        <p class="details-cta-note">
          Os valores e prazos são referências de mercado. O orçamento definitivo será
          elaborado após a análise do escopo, das funcionalidades e dos requisitos técnicos.
        </p>
        <button class="btn-request-large" data-subcategory="${sub.id}">
          <i class="fas fa-wand-magic-sparkles"></i> Começar com este serviço
        </button>
      </div>
    </div>
  `;

  container.querySelector('#backToSubsBtn').addEventListener('click', backToSubcategories);

  container.querySelector('.btn-request-large').addEventListener('click', () => {
    openJourneyFromCatalog(cat.id, sub.id);
  });
}

/* ============================================================
   10. BREADCRUMB
   ============================================================ */
function renderBreadcrumb() {
  const container = dom.breadcrumb();
  if (!container) return;

  const cat = NavState.currentCategory
    ? CATEGORIES_DB.find(c => c.id === NavState.currentCategory)
    : null;
  const sub = cat && NavState.currentSubcategory
    ? cat.subcategories.find(s => s.id === NavState.currentSubcategory)
    : null;

  if (!cat) {
    container.classList.add('hidden');
    container.innerHTML = '';
    return;
  }

  const items = [];
  items.push(`<button class="breadcrumb-item" data-crumb="root">
    <i class="fas fa-layer-group"></i> Catálogo
  </button>`);

  if (!sub) {
    items.push(`<span class="breadcrumb-sep"><i class="fas fa-chevron-right"></i></span>`);
    items.push(`<span class="breadcrumb-item current">${cat.title}</span>`);
  } else {
    items.push(`<span class="breadcrumb-sep"><i class="fas fa-chevron-right"></i></span>`);
    items.push(`<button class="breadcrumb-item" data-crumb="category">${cat.title}</button>`);
    items.push(`<span class="breadcrumb-sep"><i class="fas fa-chevron-right"></i></span>`);
    items.push(`<span class="breadcrumb-item current">${sub.title}</span>`);
  }

  container.innerHTML = items.join('');

  container.querySelector('[data-crumb="root"]')?.addEventListener('click', backToCategories);
  container.querySelector('[data-crumb="category"]')?.addEventListener('click', backToSubcategories);
}

/* ============================================================
   11. MODAL DE SOLICITAÇÃO (legado — preservado)
   ============================================================ */
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
let currentFile = null;

function populateInstallmentOptions() {
  const selCount = document.getElementById('installmentCount');
  const selDay = document.getElementById('dueDay');
  if (!selCount || !selDay) return;

  const countOpts = ['<option value="">Selecione...</option>'];
  for (let i = 3; i <= 27; i++) {
    countOpts.push(`<option value="${i}">${i}x</option>`);
  }
  countOpts.push('<option value="outra">Outra quantidade — avaliar</option>');
  selCount.innerHTML = countOpts.join('');

  const dayOpts = ['<option value="">Selecione...</option>'];
  for (let i = 1; i <= 28; i++) {
    dayOpts.push(`<option value="${i}">Dia ${i}</option>`);
  }
  selDay.innerHTML = dayOpts.join('');
}

function updateInstallmentVisibility() {
  const selected = document.querySelector('input[name="productionPayment"]:checked');
  const isParcelado = selected && selected.value === 'Parcelado';
  const fields = document.getElementById('installmentFields');
  if (!fields) return;

  if (isParcelado) {
    fields.classList.add('visible');
  } else {
    fields.classList.remove('visible');
    document.getElementById('installmentCount')?.classList.remove('error');
    document.getElementById('dueDay')?.classList.remove('error');
    document.getElementById('installmentCountError')?.classList.remove('visible');
    document.getElementById('dueDayError')?.classList.remove('visible');
  }
}

function clearErrors() {
  document.querySelectorAll('.field-error').forEach(el => el.classList.remove('visible'));
  document.querySelectorAll('.form-group input, .form-group textarea, .form-group select')
    .forEach(el => el.classList.remove('error'));
}

function resetFileUpload() {
  currentFile = null;
  const fileInput = document.getElementById('fileInput');
  const uploadArea = document.getElementById('uploadArea');
  const preview = document.getElementById('uploadPreview');
  if (!fileInput || !uploadArea || !preview) return;

  fileInput.value = '';
  preview.classList.remove('visible');
  uploadArea.style.display = '';
  uploadArea.classList.remove('has-file');
  document.getElementById('previewImg').src = '';
  document.getElementById('previewFilename').textContent = '';
  document.getElementById('previewFilesize').textContent = '';
  document.getElementById('fileError').classList.remove('visible');
}

function handleFileSelect(file) {
  const fileError = document.getElementById('fileError');
  fileError.classList.remove('visible');

  if (!ALLOWED_TYPES.includes(file.type)) {
    fileError.innerHTML = '<i class="fas fa-circle-exclamation"></i> Formato inválido. Envie apenas JPEG, PNG ou WebP.';
    fileError.classList.add('visible');
    resetFileUpload();
    return;
  }
  if (file.size > MAX_FILE_SIZE) {
    fileError.innerHTML = `<i class="fas fa-circle-exclamation"></i> Arquivo muito grande. Máximo: 5 MB (seu arquivo: ${formatFileSize(file.size)}).`;
    fileError.classList.add('visible');
    resetFileUpload();
    return;
  }

  currentFile = file;
  const reader = new FileReader();
  reader.onload = (e) => { document.getElementById('previewImg').src = e.target.result; };
  reader.readAsDataURL(file);

  document.getElementById('previewFilename').textContent = file.name;
  document.getElementById('previewFilesize').textContent = formatFileSize(file.size);
  document.getElementById('uploadArea').style.display = 'none';
  document.getElementById('uploadPreview').classList.add('visible');
}

function setupFileUpload() {
  const uploadArea = document.getElementById('uploadArea');
  const fileInput = document.getElementById('fileInput');
  const removeBtn = document.getElementById('removeFileBtn');
  if (!uploadArea || !fileInput || !removeBtn) return;

  uploadArea.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) handleFileSelect(e.target.files[0]);
  });

  removeBtn.addEventListener('click', () => {
    resetFileUpload();
    fileInput.value = '';
  });

  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--primary)';
  });
  uploadArea.addEventListener('dragleave', () => { uploadArea.style.borderColor = ''; });
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '';
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) handleFileSelect(e.dataTransfer.files[0]);
  });
}

function openRequestModal(cat, sub) {
  const modal = dom.requestModal();
  if (!modal) return;

  const typeText = `${cat.title} > ${sub.title}`;
  document.getElementById('requestTypeDisplay').textContent = typeText;
  document.getElementById('requestType').value = typeText;

  document.getElementById('requestTitle').value = `Solicitação de desenvolvimento — ${sub.title}`;
  document.getElementById('initialDescription').value =
    `Olá! Tenho interesse no desenvolvimento de ${sub.title.toLowerCase()} (${cat.title}) e gostaria de conhecer as condições de contratação.`;
  document.getElementById('projectDescription').value = '';

  document.querySelectorAll('input[name="productionPayment"]').forEach(r => r.checked = false);
  document.querySelectorAll('input[name="maintenancePreference"]').forEach(r => r.checked = false);
  document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));

  const instCount = document.getElementById('installmentCount');
  const dueDay = document.getElementById('dueDay');
  if (instCount) instCount.value = '';
  if (dueDay) dueDay.value = '';

  updateInstallmentVisibility();
  resetFileUpload();
  clearErrors();

  const feedback = document.getElementById('submitFeedback');
  feedback.classList.remove('visible', 'success', 'error');

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  setTimeout(() => document.getElementById('requestTitle').focus(), 100);
  modal._previousFocus = document.activeElement;
}

function closeRequestModal() {
  const modal = dom.requestModal();
  if (!modal || !modal.classList.contains('open')) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
  if (modal._previousFocus && typeof modal._previousFocus.focus === 'function') {
    modal._previousFocus.focus();
  }
}

function validateForm() {
  clearErrors();
  let valid = true;

  const title = document.getElementById('requestTitle');
  const initialDesc = document.getElementById('initialDescription');
  const projectDesc = document.getElementById('projectDescription');

  if (!title.value.trim()) {
    title.classList.add('error');
    document.getElementById('titleError').classList.add('visible');
    valid = false;
  }
  if (!initialDesc.value.trim()) {
    initialDesc.classList.add('error');
    document.getElementById('initialDescError').classList.add('visible');
    valid = false;
  }
  if (!projectDesc.value.trim()) {
    projectDesc.classList.add('error');
    document.getElementById('projectDescError').classList.add('visible');
    valid = false;
  }

  const production = document.querySelector('input[name="productionPayment"]:checked');
  if (!production) {
    document.getElementById('productionPaymentError').classList.add('visible');
    valid = false;
  } else if (production.value === 'Parcelado') {
    const instCount = document.getElementById('installmentCount');
    const dueDay = document.getElementById('dueDay');
    if (!instCount.value) {
      instCount.classList.add('error');
      document.getElementById('installmentCountError').classList.add('visible');
      valid = false;
    }
    if (!dueDay.value) {
      dueDay.classList.add('error');
      document.getElementById('dueDayError').classList.add('visible');
      valid = false;
    }
  }

  const maintenance = document.querySelector('input[name="maintenancePreference"]:checked');
  if (!maintenance) {
    document.getElementById('maintenanceError').classList.add('visible');
    valid = false;
  }

  return valid;
}

async function submitRequest(e) {
  e.preventDefault();

  if (!validateForm()) {
    const firstError = document.querySelector('.field-error.visible');
    if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  if (FORMINIT_FORM_ID === 'YOUR_FORMINIT_FORM_ID' || !FORMINIT_FORM_ID) {
    const feedback = document.getElementById('submitFeedback');
    feedback.className = 'submit-feedback error visible';
    feedback.innerHTML = '<i class="fas fa-triangle-exclamation"></i> O serviço de envio ainda não foi configurado. Configure o Forminit e tente novamente.';
    feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const submitBtn = document.getElementById('submitBtn');
  const feedback = document.getElementById('submitFeedback');

  submitBtn.disabled = true;
  submitBtn.classList.add('loading');
  feedback.classList.remove('visible', 'success', 'error');

  const formData = new FormData();
  formData.append('title', document.getElementById('requestTitle').value.trim());
  formData.append('initialDescription', document.getElementById('initialDescription').value.trim());
  formData.append('requestType', document.getElementById('requestType').value);
  formData.append('projectDescription', document.getElementById('projectDescription').value.trim());

  const prodPayment = document.querySelector('input[name="productionPayment"]:checked');
  let productionText = prodPayment ? prodPayment.value : '';
  if (prodPayment && prodPayment.value === 'Parcelado') {
    const countEl = document.getElementById('installmentCount');
    const dueEl = document.getElementById('dueDay');
    const countText = countEl.value === 'outra' ? 'Outra quantidade — avaliar' : `${countEl.value} parcelas`;
    productionText += ` — ${countText}, vencimento dia ${dueEl.value}`;
  }
  formData.append('productionPayment', productionText);

  const maintPref = document.querySelector('input[name="maintenancePreference"]:checked');
  formData.append('maintenancePreference', maintPref ? maintPref.value : '');

  if (currentFile) formData.append('attachment', currentFile, currentFile.name);

  formData.append('_subject',
    `Nova solicitação de orçamento — ${document.getElementById('requestType').value} | FGP Technologies`);
  formData.append('_captcha', 'false');

  try {
    const response = await fetch(FORMINIT_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      feedback.className = 'submit-feedback success visible';
      feedback.innerHTML = '<i class="fas fa-circle-check"></i> Pedido enviado com sucesso! A FGP Technologies entrará em contato pelos canais informados.';
      feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => closeRequestModal(), 5000);
    } else {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Falha no envio. Tente novamente.');
    }
  } catch (error) {
    feedback.className = 'submit-feedback error visible';
    feedback.innerHTML = `<i class="fas fa-circle-exclamation"></i> Não foi possível enviar sua solicitação. ${error.message || 'Verifique sua conexão e tente novamente.'}`;
    feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } finally {
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
  }
}

function setupRequestModal() {
  const modal = dom.requestModal();
  const form = document.getElementById('requestForm');
  const closeBtn = document.getElementById('closeRequestBtn');
  if (!modal || !form) return;

  populateInstallmentOptions();

  closeBtn.addEventListener('click', closeRequestModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeRequestModal(); });

  document.querySelectorAll('.payment-options').forEach(group => {
    group.querySelectorAll('.payment-option').forEach(option => {
      option.addEventListener('click', () => {
        group.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        const radio = option.querySelector('input[type="radio"]');
        if (radio) {
          radio.checked = true;
          if (radio.name === 'productionPayment') updateInstallmentVisibility();
        }
      });
    });
  });

  document.getElementById('installmentCount')?.addEventListener('change', (e) => {
    if (e.target.value) {
      e.target.classList.remove('error');
      document.getElementById('installmentCountError').classList.remove('visible');
    }
  });
  document.getElementById('dueDay')?.addEventListener('change', (e) => {
    if (e.target.value) {
      e.target.classList.remove('error');
      document.getElementById('dueDayError').classList.remove('visible');
    }
  });

  form.addEventListener('submit', submitRequest);
}

/* ============================================================
   12. PAINEL DE CORES
   ============================================================ */
const COLOR_STORAGE_KEY = 'fgp_tech_palette';

const DEFAULT_PALETTE = {
  primary: '#3b82f6',
  accent:  '#06b6d4',
  bg:      '#0a0e17',
  text:    '#f1f5f9'
};

const COLOR_PRESETS = [
  { name: 'FGP Tech',    palette: { primary: '#3b82f6', accent: '#06b6d4', bg: '#0a0e17', text: '#f1f5f9' } },
  { name: 'Corporativo', palette: { primary: '#2563eb', accent: '#f59e0b', bg: '#0c1424', text: '#f8fafc' } },
  { name: 'Minimal',     palette: { primary: '#64748b', accent: '#0ea5e9', bg: '#0f172a', text: '#f1f5f9' } },
  { name: 'Claro',       palette: { primary: '#2563eb', accent: '#0891b2', bg: '#f8fafc', text: '#0f172a' } }
];

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substr(0, 2), 16),
    g: parseInt(h.substr(2, 2), 16),
    b: parseInt(h.substr(4, 2), 16)
  };
}

function mixHex(a, b, t) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  const r = Math.round(A.r + (B.r - A.r) * t);
  const g = Math.round(A.g + (B.g - A.g) * t);
  const bl = Math.round(A.b + (B.b - A.b) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

function applyPalette(p) {
  const root = document.documentElement;
  root.style.setProperty('--primary', p.primary);
  root.style.setProperty('--accent', p.accent);
  root.style.setProperty('--bg', p.bg);
  root.style.setProperty('--text', p.text);

  root.style.setProperty('--surface',        mixHex(p.bg, p.text, 0.06));
  root.style.setProperty('--surface-strong', mixHex(p.bg, p.text, 0.10));
  root.style.setProperty('--border',         mixHex(p.bg, p.text, 0.16));
  root.style.setProperty('--text-muted',     mixHex(p.text, p.bg, 0.42));

  const $p = document.getElementById('primaryColor');
  const $a = document.getElementById('accentColor');
  const $b = document.getElementById('bgColor');
  const $t = document.getElementById('textColor');
  if ($p) $p.value = p.primary;
  if ($a) $a.value = p.accent;
  if ($b) $b.value = p.bg;
  if ($t) $t.value = p.text;

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', p.bg);
}

function savePalette(p) {
  try { localStorage.setItem(COLOR_STORAGE_KEY, JSON.stringify(p)); } catch (_) {}
}

function loadPalette() {
  try {
    const raw = localStorage.getItem(COLOR_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PALETTE };
    return { ...DEFAULT_PALETTE, ...JSON.parse(raw) };
  } catch (_) {
    return { ...DEFAULT_PALETTE };
  }
}

function setupColorPanel() {
  const panel = document.getElementById('colorPanel');
  const overlay = document.getElementById('sideOverlay');
  const openBtn = document.getElementById('colorBtn');
  const closeBtn = document.getElementById('closeColorBtn');
  const resetBtn = document.getElementById('resetColors');
  const presetsBox = document.getElementById('colorPresets');
  const inputPrimary = document.getElementById('primaryColor');
  const inputAccent = document.getElementById('accentColor');
  const inputBg = document.getElementById('bgColor');
  const inputText = document.getElementById('textColor');

  if (!panel || !openBtn) return;

  COLOR_PRESETS.forEach(preset => {
    const btn = document.createElement('button');
    btn.className = 'preset-btn';
    btn.type = 'button';
    btn.innerHTML = `
      <div class="dots">
        <span style="background:${preset.palette.primary}"></span>
        <span style="background:${preset.palette.accent}"></span>
        <span style="background:${preset.palette.bg};border:1px solid #666"></span>
      </div>
      ${preset.name}
    `;
    btn.addEventListener('click', () => {
      applyPalette(preset.palette);
      savePalette(preset.palette);
    });
    presetsBox.appendChild(btn);
  });

  applyPalette(loadPalette());

  openBtn.addEventListener('click', () => {
    panel.classList.add('open');
    overlay.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
  });

  function closePanel() {
    panel.classList.remove('open');
    if (!document.getElementById('sideMenu').classList.contains('open')) {
      overlay.classList.remove('open');
    }
    panel.setAttribute('aria-hidden', 'true');
  }
  closeBtn.addEventListener('click', closePanel);

  function liveUpdate() {
    const p = {
      primary: inputPrimary.value,
      accent:  inputAccent.value,
      bg:      inputBg.value,
      text:    inputText.value
    };
    applyPalette(p);
    savePalette(p);
  }
  [inputPrimary, inputAccent, inputBg, inputText].forEach(inp => {
    if (inp) inp.addEventListener('input', liveUpdate);
  });

  resetBtn.addEventListener('click', () => {
    applyPalette(DEFAULT_PALETTE);
    savePalette(DEFAULT_PALETTE);
  });
}

/* ============================================================
   13. SIDE MENU
   ============================================================ */
function closeSideMenu() {
  const menu = dom.sideMenu();
  const overlay = dom.sideOverlay();
  const colorPanel = dom.colorPanel();
  if (!menu) return;
  menu.classList.remove('open');
  menu.setAttribute('aria-hidden', 'true');
  if (!colorPanel.classList.contains('open')) overlay.classList.remove('open');
}

function setupSideMenu() {
  const menu = dom.sideMenu();
  const overlay = dom.sideOverlay();
  const openBtn = document.getElementById('hamburgerBtn');
  if (!menu || !openBtn) return;

  openBtn.addEventListener('click', () => {
    menu.classList.add('open');
    overlay.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
  });

  overlay.addEventListener('click', () => {
    closeSideMenu();
    const cp = dom.colorPanel();
    if (cp.classList.contains('open')) {
      cp.classList.remove('open');
      cp.setAttribute('aria-hidden', 'true');
    }
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (a.id !== 'accessosSideBtn' && a.id !== 'sideMenuStartBtn') closeSideMenu();
    });
  });

  const accessosBtn = document.getElementById('accessosSideBtn');
  if (accessosBtn) {
    accessosBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeSideMenu();
      openAccessosModal();
    });
  }

  // Botão "Começar" do side menu
  const sideStartBtn = document.getElementById('sideMenuStartBtn');
  if (sideStartBtn) {
    sideStartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeSideMenu();
      openJourney();
    });
  }

  // ESC fecha tudo
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSideMenu();
      const cp = dom.colorPanel();
      if (cp.classList.contains('open')) {
        cp.classList.remove('open');
        cp.setAttribute('aria-hidden', 'true');
      }
      closeAccessosModal();
      closeRequestModal();
      // Fecha jornada somente se não houver modal por cima
      const journeyModal = dom.journeyModal();
      if (journeyModal && journeyModal.classList.contains('open')) {
        closeJourneyWithConfirm();
      }
    }
  });
}

/* ============================================================
   14. MODAL ACESSOS
   ============================================================ */
function openAccessosModal() {
  const modal = dom.accessosModal();
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeAccessosModal() {
  const modal = dom.accessosModal();
  if (!modal || !modal.classList.contains('open')) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

function setupAccessosModal() {
  const modal = dom.accessosModal();
  if (!modal) return;

  document.getElementById('closeAccessosBtn')?.addEventListener('click', closeAccessosModal);
  document.getElementById('accessosFooterBtn')?.addEventListener('click', openAccessosModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeAccessosModal();
  });
}

/* ============================================================
   15. HEADER SHADOW + REVEAL ON SCROLL
   ============================================================ */
function setupHeaderScroll() {
  const header = dom.siteHeader();
  if (!header) return;
  const onScroll = () => {
    if (window.scrollY > 10) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function setupReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  items.forEach(el => io.observe(el));
}

/* ============================================================
   16. JORNADA GUIADA — ESTADO E CONFIGURAÇÃO
   ============================================================ */
const JourneyState = {
  step: 1,
  category: null,
  subcategory: null,
  projectType: null,     // string original do projectTypes
  title: '',
  description: '',
  payment: null,         // 'À vista' | 'Parcelado'
  maintenance: null,     // 'Mensal' | 'Anual' | 'Não desejo contratar agora'
  file: null
};

const ASSISTANT_MESSAGES = {
  1: 'Olá! Vamos encontrar a solução ideal para seu projeto? Escolha uma das categorias abaixo para começar.',
  2: 'Ótimo! Agora escolha o serviço que mais combina com sua necessidade.',
  3: 'Estamos avançando! Qual modalidade de projeto você deseja?',
  4: 'Conte um pouco sobre sua ideia. Não precisa utilizar termos técnicos!',
  5: 'Agora vamos conhecer sua preferência de pagamento.',
  6: 'Você também pode informar se deseja serviços de manutenção.',
  7: 'Tudo pronto! Confira suas escolhas antes de enviar.'
};

const JOURNEY_TOTAL_BASE_STEPS = 7;

/* ------------------------------------------------------------
   Helpers de jornada
   ------------------------------------------------------------ */
function getJourneyCategory() {
  return JourneyState.category
    ? CATEGORIES_DB.find(c => c.id === JourneyState.category)
    : null;
}

function getJourneySubcategory() {
  const cat = getJourneyCategory();
  if (!cat || !JourneyState.subcategory) return null;
  return cat.subcategories.find(s => s.id === JourneyState.subcategory) || null;
}

function parseProjectTypeName(raw) {
  if (!raw) return '';
  const parts = raw.split(/\s+—\s+/);
  return parts[0] || raw;
}

function parseProjectTypeDesc(raw) {
  if (!raw) return '';
  const parts = raw.split(/\s+—\s+/);
  return parts[1] || '';
}

/* Retorna a lista de etapas ativas (pode pular a 3) */
function getActiveJourneySteps() {
  const steps = [1, 2];
  const sub = getJourneySubcategory();
  if (!JourneyState.subcategory) {
    // Ainda não escolheu serviço: considerar etapa 3 como potencial
    steps.push(3);
  } else if (sub && sub.projectTypes && sub.projectTypes.length > 0) {
    steps.push(3);
  }
  steps.push(4, 5, 6, 7);
  return steps;
}

/* ------------------------------------------------------------
   Reset
   ------------------------------------------------------------ */
function resetJourneyState() {
  JourneyState.step = 1;
  JourneyState.category = null;
  JourneyState.subcategory = null;
  JourneyState.projectType = null;
  JourneyState.title = '';
  JourneyState.description = '';
  JourneyState.payment = null;
  JourneyState.maintenance = null;
  JourneyState.file = null;
  resetJourneyFile();
}

function resetJourneyFile() {
  const fileInput = document.getElementById('journeyFileInput');
  const uploadArea = document.getElementById('journeyUploadArea');
  const preview = document.getElementById('journeyUploadPreview');
  if (!fileInput || !uploadArea || !preview) return;

  fileInput.value = '';
  preview.classList.remove('visible');
  uploadArea.style.display = '';
  document.getElementById('journeyPreviewImg').src = '';
  document.getElementById('journeyPreviewFilename').textContent = '';
  document.getElementById('journeyPreviewFilesize').textContent = '';
  document.getElementById('journeyFileError').classList.remove('visible');
}

/* ------------------------------------------------------------
   Abrir / fechar
   ------------------------------------------------------------ */
function openJourney() {
  resetJourneyState();
  JourneyState.step = 1;
  openJourneyModal();
  renderJourneyStep();
}

function openJourneyFromCatalog(catId, subId) {
  resetJourneyState();
  JourneyState.category = catId;
  JourneyState.subcategory = subId;

  const cat = getJourneyCategory();
  const sub = getJourneySubcategory();

  if (cat && sub) {
    JourneyState.title = `Solicitação de desenvolvimento — ${sub.title}`;
    JourneyState.description =
      `Olá! Tenho interesse no desenvolvimento de ${sub.title.toLowerCase()} (${cat.title}) e gostaria de conhecer as condições de contratação.`;
  }

  if (sub && sub.projectTypes && sub.projectTypes.length > 0) {
    JourneyState.step = 3;
  } else {
    JourneyState.step = 4;
  }

  openJourneyModal();
  renderJourneyStep();
}

function openJourneyModal() {
  const modal = dom.journeyModal();
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeJourneyWithConfirm() {
  const modal = dom.journeyModal();
  if (!modal || !modal.classList.contains('open')) return;

  const hasData = JourneyState.category || JourneyState.subcategory ||
                  JourneyState.title || JourneyState.description ||
                  JourneyState.payment || JourneyState.maintenance || JourneyState.file;

  if (hasData) {
    if (!window.confirm('Você tem informações preenchidas. Deseja realmente sair da jornada?')) {
      return;
    }
  }

  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  resetJourneyState();
}

/* ------------------------------------------------------------
   Navegação entre etapas
   ------------------------------------------------------------ */
function handleJourneyNext() {
  const step = JourneyState.step;

  // Validação por etapa
  if (step === 1) {
    if (!JourneyState.category) {
      showJourneyAlert('Escolha uma categoria para continuar.');
      return;
    }
  } else if (step === 2) {
    if (!JourneyState.subcategory) {
      showJourneyAlert('Escolha um serviço para continuar.');
      return;
    }
  } else if (step === 3) {
    if (!JourneyState.projectType) {
      showJourneyAlert('Escolha o tipo de projeto para continuar.');
      return;
    }
  } else if (step === 4) {
    const titleEl = document.getElementById('journeyTitleField');
    const descEl = document.getElementById('journeyDescField');
    const title = (titleEl?.value || '').trim();
    const desc = (descEl?.value || '').trim();

    if (!title) {
      document.getElementById('journeyTitleError').classList.add('visible');
      titleEl?.classList.add('error');
      titleEl?.focus();
      return;
    }
    if (!desc) {
      document.getElementById('journeyDescError').classList.add('visible');
      descEl?.classList.add('error');
      descEl?.focus();
      return;
    }
    JourneyState.title = title;
    JourneyState.description = desc;
  } else if (step === 5) {
    if (!JourneyState.payment) {
      showJourneyAlert('Escolha uma forma de pagamento para continuar.');
      return;
    }
  } else if (step === 6) {
    if (!JourneyState.maintenance) {
      showJourneyAlert('Escolha uma preferência de manutenção para continuar.');
      return;
    }
  } else if (step === 7) {
    submitJourney();
    return;
  }

  const activeSteps = getActiveJourneySteps();
  const idx = activeSteps.indexOf(step);
  if (idx < activeSteps.length - 1) {
    JourneyState.step = activeSteps[idx + 1];
    renderJourneyStep();
  }
}

function handleJourneyBack() {
  const activeSteps = getActiveJourneySteps();
  const idx = activeSteps.indexOf(JourneyState.step);
  if (idx > 0) {
    JourneyState.step = activeSteps[idx - 1];
    renderJourneyStep();
  }
}

/* ------------------------------------------------------------
   Feedback visual via balão do assistente
   ------------------------------------------------------------ */
let journeyAlertTimer = null;
function showJourneyAlert(msg) {
  const bubble = document.getElementById('journeyAssistantText');
  if (!bubble) return;
  const originalText = ASSISTANT_MESSAGES[JourneyState.step] || bubble.textContent;

  if (journeyAlertTimer) clearTimeout(journeyAlertTimer);
  bubble.textContent = '⚠ ' + msg;
  bubble.classList.add('journey-assistant-bubble-alert');

  journeyAlertTimer = setTimeout(() => {
    bubble.textContent = originalText;
    bubble.classList.remove('journey-assistant-bubble-alert');
  }, 2800);
}

/* ------------------------------------------------------------
   Render geral da etapa atual
   ------------------------------------------------------------ */
function renderJourneyStep() {
  // Oculta todos
  document.querySelectorAll('.journey-step').forEach(el => el.style.display = 'none');

  // Mostra a atual
  const current = document.querySelector(`.journey-step[data-step="${JourneyState.step}"]`);
  if (current) current.style.display = '';

  // Atualiza assistente
  const assistant = document.getElementById('journeyAssistantText');
  if (assistant) {
    assistant.textContent = ASSISTANT_MESSAGES[JourneyState.step] || '';
    assistant.classList.remove('journey-assistant-bubble-alert');
  }

  // Atualiza progresso
  updateJourneyProgress();

  // Atualiza botões
  const backBtn = document.getElementById('journeyBackBtn');
  const nextBtn = document.getElementById('journeyNextBtn');
  const activeSteps = getActiveJourneySteps();
  const idx = activeSteps.indexOf(JourneyState.step);

  if (backBtn) backBtn.style.display = idx > 0 ? '' : 'none';
  if (nextBtn) {
    if (JourneyState.step === 7) {
      nextBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar pedido';
    } else {
      nextBtn.innerHTML = 'Continuar <i class="fas fa-arrow-right"></i>';
    }
  }

  // Render específico por etapa
  if (JourneyState.step === 1) renderJourneyCategories();
  else if (JourneyState.step === 2) renderJourneyServices();
  else if (JourneyState.step === 3) renderJourneyTypes();
  else if (JourneyState.step === 4) renderJourneyForm();
  else if (JourneyState.step === 5) renderJourneyPayment();
  else if (JourneyState.step === 6) renderJourneyMaintenance();
  else if (JourneyState.step === 7) renderJourneyReview();
}

/* ------------------------------------------------------------
   Progresso
   ------------------------------------------------------------ */
function updateJourneyProgress() {
  const fill = document.getElementById('journeyProgressFill');
  const text = document.getElementById('journeyProgressText');
  if (!fill || !text) return;

  const activeSteps = getActiveJourneySteps();
  const idx = activeSteps.indexOf(JourneyState.step);
  const total = activeSteps.length;
  const current = idx >= 0 ? idx + 1 : 1;
  const percent = Math.min(100, (current / total) * 100);

  fill.style.width = percent + '%';
  text.textContent = `Etapa ${current} de ${total}`;
}

/* ------------------------------------------------------------
   ETAPA 1 — Categorias
   ------------------------------------------------------------ */
function renderJourneyCategories() {
  const grid = document.getElementById('journeyCategoriesGrid');
  if (!grid) return;

  grid.innerHTML = CATEGORIES_DB.map(cat => `
    <button
      class="journey-card ${JourneyState.category === cat.id ? 'selected' : ''}"
      data-category="${cat.id}"
      type="button"
    >
      <div class="journey-card-icon">
        <i class="fas ${cat.icon}"></i>
      </div>
      <div class="journey-card-title">${cat.title}</div>
      <div class="journey-card-desc">${cat.description}</div>
      <div class="journey-card-meta">
        <i class="fas fa-layer-group"></i>
        ${cat.subcategories.length} ${cat.subcategories.length === 1 ? 'serviço' : 'serviços'}
      </div>
    </button>
  `).join('');

  grid.querySelectorAll('[data-category]').forEach(btn => {
    btn.addEventListener('click', () => {
      const newCat = btn.dataset.category;
      if (newCat !== JourneyState.category) {
        JourneyState.category = newCat;
        JourneyState.subcategory = null;
        JourneyState.projectType = null;
      }
      renderJourneyCategories();
    });
  });
}

/* ------------------------------------------------------------
   ETAPA 2 — Serviços
   ------------------------------------------------------------ */
function renderJourneyServices() {
  const grid = document.getElementById('journeyServicesGrid');
  if (!grid) return;

  const cat = getJourneyCategory();
  if (!cat) {
    grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:2rem;">Selecione uma categoria primeiro.</p>';
    return;
  }

  grid.innerHTML = cat.subcategories.map(sub => `
    <button
      class="journey-card ${JourneyState.subcategory === sub.id ? 'selected' : ''}"
      data-subcategory="${sub.id}"
      type="button"
    >
      <div class="journey-card-icon">
        <i class="fas ${sub.icon}"></i>
      </div>
      <div class="journey-card-title">${sub.title}</div>
      <div class="journey-card-desc">${sub.description}</div>
      ${sub.priceRange ? `<div class="journey-card-price">${sub.priceRange}</div>` : ''}
    </button>
  `).join('');

  grid.querySelectorAll('[data-subcategory]').forEach(btn => {
    btn.addEventListener('click', () => {
      const newSub = btn.dataset.subcategory;
      if (newSub !== JourneyState.subcategory) {
        JourneyState.subcategory = newSub;
        JourneyState.projectType = null;
      }
      renderJourneyServices();
    });
  });
}

/* ------------------------------------------------------------
   ETAPA 3 — Tipos de projeto
   ------------------------------------------------------------ */
function renderJourneyTypes() {
  const grid = document.getElementById('journeyTypesGrid');
  if (!grid) return;

  const sub = getJourneySubcategory();
  if (!sub || !sub.projectTypes || sub.projectTypes.length === 0) {
    grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:2rem;">Este serviço não possui subdivisões. Continue para a próxima etapa.</p>';
    return;
  }

  grid.innerHTML = sub.projectTypes.map((raw, idx) => {
    const name = parseProjectTypeName(raw);
    const desc = parseProjectTypeDesc(raw);
    return `
      <button
        class="journey-card ${JourneyState.projectType === raw ? 'selected' : ''}"
        data-type-index="${idx}"
        type="button"
      >
        <div class="journey-card-title">${escapeHtml(name)}</div>
        ${desc ? `<div class="journey-card-desc">${escapeHtml(desc)}</div>` : ''}
      </button>
    `;
  }).join('');

  grid.querySelectorAll('[data-type-index]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.typeIndex, 10);
      const s = getJourneySubcategory();
      if (s && s.projectTypes[idx] !== undefined) {
        JourneyState.projectType = s.projectTypes[idx];
        renderJourneyTypes();
      }
    });
  });
}

/* ------------------------------------------------------------
   ETAPA 4 — Formulário (título + descrição)
   ------------------------------------------------------------ */
function renderJourneyForm() {
  const titleEl = document.getElementById('journeyTitleField');
  const descEl = document.getElementById('journeyDescField');
  if (!titleEl || !descEl) return;

  titleEl.value = JourneyState.title || '';
  descEl.value = JourneyState.description || '';

  document.getElementById('journeyTitleError').classList.remove('visible');
  document.getElementById('journeyDescError').classList.remove('visible');
  titleEl.classList.remove('error');
  descEl.classList.remove('error');
}

/* ------------------------------------------------------------
   ETAPA 5 — Pagamento da produção
   ------------------------------------------------------------ */
function renderJourneyPayment() {
  const grid = document.getElementById('journeyPaymentGrid');
  if (!grid) return;
  grid.querySelectorAll('[data-payment]').forEach(card => {
    card.classList.toggle('selected', card.dataset.payment === JourneyState.payment);
  });
}

/* ------------------------------------------------------------
   ETAPA 6 — Manutenção
   ------------------------------------------------------------ */
function renderJourneyMaintenance() {
  const grid = document.getElementById('journeyMaintenanceGrid');
  if (!grid) return;
  grid.querySelectorAll('[data-maintenance]').forEach(card => {
    card.classList.toggle('selected', card.dataset.maintenance === JourneyState.maintenance);
  });
}

/* ------------------------------------------------------------
   ETAPA 7 — Revisão
   ------------------------------------------------------------ */
function renderJourneyReview() {
  const summary = document.getElementById('journeyReviewSummary');
  if (!summary) return;

  const cat = getJourneyCategory();
  const sub = getJourneySubcategory();
  const typeName = JourneyState.projectType ? parseProjectTypeName(JourneyState.projectType) : '';

  const items = [];
  items.push({ label: 'Categoria', value: cat ? cat.title : '—' });
  items.push({ label: 'Serviço', value: sub ? sub.title : '—' });
  if (typeName) items.push({ label: 'Tipo de projeto', value: typeName });
  items.push({ label: 'Título do pedido', value: JourneyState.title || '—' });
  items.push({ label: 'Descrição inicial', value: JourneyState.description || '—' });
  items.push({ label: 'Pagamento da produção', value: JourneyState.payment || '—' });
  items.push({ label: 'Preferência de manutenção', value: JourneyState.maintenance || '—' });

  summary.innerHTML = items.map(item => `
    <div class="journey-review-item">
      <div class="journey-review-label">${escapeHtml(item.label)}</div>
      <div class="journey-review-value">${escapeHtml(item.value)}</div>
    </div>
  `).join('');

  // Atualiza visibilidade do preview de arquivo
  const preview = document.getElementById('journeyUploadPreview');
  const uploadArea = document.getElementById('journeyUploadArea');
  if (JourneyState.file) {
    if (preview) preview.classList.add('visible');
    if (uploadArea) uploadArea.style.display = 'none';
  } else {
    if (preview) preview.classList.remove('visible');
    if (uploadArea) uploadArea.style.display = '';
  }

  // Limpa feedback anterior
  const feedback = document.getElementById('journeySubmitFeedback');
  if (feedback) feedback.classList.remove('visible', 'success', 'error');
}

/* ------------------------------------------------------------
   Upload de imagem na jornada
   ------------------------------------------------------------ */
function handleJourneyFileSelect(file) {
  const errorEl = document.getElementById('journeyFileError');
  errorEl.classList.remove('visible');

  if (!ALLOWED_TYPES.includes(file.type)) {
    errorEl.innerHTML = '<i class="fas fa-circle-exclamation"></i> Formato inválido. Envie apenas JPEG, PNG ou WebP.';
    errorEl.classList.add('visible');
    JourneyState.file = null;
    resetJourneyFile();
    return;
  }
  if (file.size > MAX_FILE_SIZE) {
    errorEl.innerHTML = `<i class="fas fa-circle-exclamation"></i> Arquivo muito grande. Máximo: 5 MB (${formatFileSize(file.size)}).`;
    errorEl.classList.add('visible');
    JourneyState.file = null;
    resetJourneyFile();
    return;
  }

  JourneyState.file = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById('journeyPreviewImg').src = e.target.result;
  };
  reader.readAsDataURL(file);

  document.getElementById('journeyPreviewFilename').textContent = file.name;
  document.getElementById('journeyPreviewFilesize').textContent = formatFileSize(file.size);
  document.getElementById('journeyUploadArea').style.display = 'none';
  document.getElementById('journeyUploadPreview').classList.add('visible');
}

function setupJourneyUpload() {
  const uploadArea = document.getElementById('journeyUploadArea');
  const fileInput = document.getElementById('journeyFileInput');
  const removeBtn = document.getElementById('journeyRemoveFileBtn');
  if (!uploadArea || !fileInput || !removeBtn) return;

  uploadArea.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleJourneyFileSelect(e.target.files[0]);
    }
  });
  removeBtn.addEventListener('click', () => {
    JourneyState.file = null;
    resetJourneyFile();
    fileInput.value = '';
  });
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--primary)';
  });
  uploadArea.addEventListener('dragleave', () => { uploadArea.style.borderColor = ''; });
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '';
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleJourneyFileSelect(e.dataTransfer.files[0]);
    }
  });
}

/* ------------------------------------------------------------
   Submit da jornada
   ------------------------------------------------------------ */
async function submitJourney() {
  const submitFeedback = document.getElementById('journeySubmitFeedback');
  const nextBtn = document.getElementById('journeyNextBtn');

  // Revalida tudo
  if (!JourneyState.category || !JourneyState.subcategory) {
    showJourneyAlert('Escolha categoria e serviço antes de enviar.');
    return;
  }
  if (!JourneyState.title || !JourneyState.description) {
    showJourneyAlert('Preencha título e descrição antes de enviar.');
    return;
  }
  if (!JourneyState.payment) {
    showJourneyAlert('Escolha uma forma de pagamento.');
    return;
  }
  if (!JourneyState.maintenance) {
    showJourneyAlert('Escolha uma preferência de manutenção.');
    return;
  }

  if (FORMINIT_FORM_ID === 'YOUR_FORMINIT_FORM_ID' || !FORMINIT_FORM_ID) {
    submitFeedback.className = 'journey-submit-feedback error visible';
    submitFeedback.innerHTML = '<i class="fas fa-triangle-exclamation"></i> O serviço de envio ainda não foi configurado. Configure o Forminit e tente novamente.';
    submitFeedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const cat = getJourneyCategory();
  const sub = getJourneySubcategory();
  const typeName = JourneyState.projectType ? parseProjectTypeName(JourneyState.projectType) : '';

  const fullType = typeName
    ? `${cat.title} > ${sub.title} > ${typeName}`
    : `${cat.title} > ${sub.title}`;

  const formData = new FormData();
  formData.append('title', JourneyState.title);
  formData.append('requestType', fullType);
  formData.append('category', cat.title);
  formData.append('subcategory', sub.title);
  formData.append('projectType', JourneyState.projectType || '');
  formData.append('projectDescription', JourneyState.description);
  formData.append('productionPayment', JourneyState.payment);
  formData.append('maintenancePreference', JourneyState.maintenance);

  if (JourneyState.file) {
    formData.append('attachment', JourneyState.file, JourneyState.file.name);
  }

  formData.append('_subject', `Nova solicitação de orçamento — ${fullType} | FGP Technologies`);
  formData.append('_captcha', 'false');

  nextBtn.disabled = true;
  const originalBtnHtml = nextBtn.innerHTML;
  nextBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
  submitFeedback.classList.remove('visible', 'success', 'error');

  try {
    const response = await fetch(FORMINIT_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      submitFeedback.className = 'journey-submit-feedback success visible';
      submitFeedback.innerHTML = '<i class="fas fa-circle-check"></i> Pedido enviado com sucesso! A FGP Technologies entrará em contato pelos canais informados.';
      submitFeedback.scrollIntoView({ behavior: 'smooth', block: 'center' });

      setTimeout(() => {
        const modal = dom.journeyModal();
        if (modal) {
          modal.classList.remove('open');
          modal.setAttribute('aria-hidden', 'true');
        }
        document.body.style.overflow = '';
        resetJourneyState();
      }, 3500);
    } else {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Falha no envio. Tente novamente.');
    }
  } catch (error) {
    submitFeedback.className = 'journey-submit-feedback error visible';
    submitFeedback.innerHTML = `<i class="fas fa-circle-exclamation"></i> Não foi possível enviar. ${error.message || 'Verifique sua conexão e tente novamente.'}`;
    submitFeedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } finally {
    nextBtn.disabled = false;
    nextBtn.innerHTML = originalBtnHtml;
  }
}

/* ------------------------------------------------------------
   Setup da jornada
   ------------------------------------------------------------ */
function setupJourney() {
  // Triggers de abertura
  document.getElementById('heroStartBtn')?.addEventListener('click', openJourney);
  document.getElementById('sideMenuStartBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    closeSideMenu();
    openJourney();
  });

  // Botões de navegação
  document.getElementById('journeyNextBtn')?.addEventListener('click', handleJourneyNext);
  document.getElementById('journeyBackBtn')?.addEventListener('click', handleJourneyBack);
  document.getElementById('closeJourneyBtn')?.addEventListener('click', closeJourneyWithConfirm);

  // Fechar clicando fora do container
  const journeyModal = dom.journeyModal();
  if (journeyModal) {
    journeyModal.addEventListener('click', (e) => {
      if (e.target === journeyModal) closeJourneyWithConfirm();
    });
  }

  // Etapa 4 — campos
  const titleEl = document.getElementById('journeyTitleField');
  const descEl = document.getElementById('journeyDescField');
  titleEl?.addEventListener('input', (e) => {
    JourneyState.title = e.target.value;
    if (e.target.value.trim()) {
      document.getElementById('journeyTitleError').classList.remove('visible');
      e.target.classList.remove('error');
    }
  });
  descEl?.addEventListener('input', (e) => {
    JourneyState.description = e.target.value;
    if (e.target.value.trim()) {
      document.getElementById('journeyDescError').classList.remove('visible');
      e.target.classList.remove('error');
    }
  });

  // Etapa 5 — cards de pagamento
  document.querySelectorAll('#journeyPaymentGrid [data-payment]').forEach(card => {
    card.addEventListener('click', () => {
      JourneyState.payment = card.dataset.payment;
      renderJourneyPayment();
    });
  });

  // Etapa 6 — cards de manutenção
  document.querySelectorAll('#journeyMaintenanceGrid [data-maintenance]').forEach(card => {
    card.addEventListener('click', () => {
      JourneyState.maintenance = card.dataset.maintenance;
      renderJourneyMaintenance();
    });
  });

  // Upload
  setupJourneyUpload();
}

/* ============================================================
   17. INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  setupColorPanel();
  setupSideMenu();
  setupAccessosModal();
  setupRequestModal();
  setupFileUpload();
  setupHeaderScroll();
  setupReveal();
  setupJourney();

  // Renderiza nível 1 do catálogo
  renderCategories();
  showLevel(1);
});
