/* ============================================================
FGP TECHNOLOGIES — tech.js (v3.0 Final)
Catálogo hierárquico, painel de cores, modais,
integração Forminit corrigida e FGP Assistant Inteligente.
============================================================ */

/* ============================================================
1. CONFIGURAÇÃO DO FORMINIT
============================================================ */
const FORMINIT_FORM_ID = 'l6ts8syb4td';
const FORMINIT_ENDPOINT = `https://forminit.com/f/${FORMINIT_FORM_ID}`;

/* ============================================================
2. BASE DE DADOS HIERÁRQUICA (CATÁLOGO COMPLETO)
============================================================ */
const CATEGORIES_DB = [ 
  {
    id: 'apps',
    icon: 'fa-mobile-screen-button',
    title: 'Aplicativos',
    description: 'Apps para Android, iOS e web — do MVP institucional ao produto empresarial completo.',
    features: ['Desenvolvimento nativo ou multiplataforma', 'Publicação nas lojas oficiais', 'Suporte e manutenção opcional'],
    subcategories: [
      { id: 'app-android', icon: 'fa-android', title: 'App Android', description: 'Desenvolvimento nativo para a plataforma Android, com publicação na Play Store.', priceRange: 'R$ 5.000 – 60.000+', priceNote: 'Varia conforme a complexidade do aplicativo', deadline: 'Prazo variável conforme escopo', status: 'available', longDescription: 'Aplicativo nativo para dispositivos Android. Cobre desde catálogos digitais até sistemas com autenticação, banco de dados e integrações.', features: ['Desenvolvimento nativo (Kotlin/Java)', 'Publicação na Play Store', 'Testes e ajustes de compatibilidade'], projectTypes: ['Institucional / estático — catálogo, portfólio, apresentação (R$ 5.000–15.000, 2–8 semanas)', 'Informativo interativo — busca, filtros, formulários, navegação avançada (orçamento conforme complexidade)', 'Com backend e login — cadastro, perfis, banco de dados, integrações (R$ 15.000–60.000, 2–5 meses para MVP)', 'Empresarial avançado — regras de negócio, integrações, painel administrativo (avaliação técnica)'], paymentTerms: ['À vista com desconto negociável', 'Parcelamento mensal durante o desenvolvimento', 'Primeira parcela antes do início'], additionalCosts: ['Taxa anual de desenvolvedor Google Play', 'Serviços de backend, hospedagem e APIs pagas', 'Certificados e ferramentas de terceiros'], observations: ['A faixa de referência de mercado para MVPs empresariais fica em R$ 30.000–60.000.', 'A publicação exige adequação às políticas da Play Store.', 'O prazo definitivo depende da clareza do escopo funcional.'] },
      { id: 'app-ios', icon: 'fa-apple', title: 'App iOS', description: 'Desenvolvimento nativo para iPhone e iPad, com publicação na App Store.', priceRange: 'Orçamento após análise', priceNote: 'Publicação e testes exigem avaliação específica', deadline: 'Prazo definido após análise do projeto', status: 'evaluation', longDescription: 'Aplicativo nativo para iOS. As exigências da Apple (revisão, ferramentas, testes em dispositivos) influenciam diretamente no investimento e no prazo.', features: ['Desenvolvimento nativo (Swift)', 'Publicação na App Store', 'Conformidade com diretrizes Apple'], projectTypes: ['Institucional / estático', 'Informativo interativo', 'Com backend e login', 'Empresarial avançado'], paymentTerms: ['À vista ou parcelamento mensal', 'Primeira parcela antes do início'], additionalCosts: ['Apple Developer Program (taxa anual)', 'Mac de desenvolvimento (quando aplicável)', 'Serviços externos e APIs'], observations: ['Não assumimos valores idênticos aos projetos Android.', 'A revisão da Apple é criteriosa e pode gerar ajustes.', 'Serviço sob avaliação técnica nesta fase da FGP.'] },
      { id: 'app-multiplataforma', icon: 'fa-layer-group', title: 'App multiplataforma', description: 'Base compartilhada de código para Android, iOS e, quando aplicável, web.', priceRange: 'A partir de R$ 14.900', priceNote: 'Referência para MVP multiplataforma', deadline: 'Prazo de referência: 45 a 90 dias', status: 'available', longDescription: 'Uma única base de código para múltiplas plataformas. Reduz duplicação de desenvolvimento, mas não elimina testes, adaptações e requisitos específicos de cada loja.', features: ['Código compartilhado (Flutter/React Native)', 'Android, iOS e web', 'Atualizações centralizadas'], projectTypes: ['Multiplataforma estático', 'Multiplataforma interativo', 'Multiplataforma com backend', 'Aplicação empresarial multiplataforma (avaliação técnica)'], paymentTerms: ['À vista ou parcelamento mensal', 'Primeira parcela antes do início'], additionalCosts: ['Taxas de publicação em cada loja', 'Serviços de backend, APIs e hospedagem', 'Ferramentas e licenças específicas'], observations: ['A referência de R$ 14.900 é para MVPs divulgados por fornecedores.', 'O prazo de 45–90 dias aplica-se ao MVP padrão.', 'Recursos nativos específicos de cada plataforma podem exigir código separado.'] },
      { id: 'app-custom', icon: 'fa-sliders', title: 'App sob medida', description: 'Aplicativo projetado do zero para um processo ou produto específico.', priceRange: 'R$ 30.000 – 120.000+', priceNote: 'Projetos avançados podem superar R$ 150.000', deadline: 'Prazo de referência: 2 a 5 meses para MVP', status: 'evaluation', longDescription: 'Aplicativo construído exclusivamente para o seu negócio, com funcionalidades e integrações específicas.', features: ['Escopo dedicado', 'Integrações específicas', 'Design e UX personalizados'], projectTypes: ['Aplicativo de serviços', 'Aplicativo comercial', 'Aplicativo de gerenciamento', 'Aplicativo transacional', 'Aplicativo com integrações avançadas'], paymentTerms: ['À vista ou parcelamento mensal conforme cronograma', 'Primeira parcela antes do início'], additionalCosts: ['Backend dedicado e hospedagem', 'Integrações com sistemas legados', 'Serviços de terceiros'], observations: ['Avaliação técnica obrigatória antes de qualquer proposta.', 'Complexidade pode alterar significativamente prazo e valor.', 'Serviço sob avaliação técnica nesta fase da FGP.'] }
    ]
  },
  {
    id: 'sites',
    icon: 'fa-globe',
    title: 'Sites',
    description: 'Do cartão de visitas digital à loja virtual completa.',
    features: ['Design responsivo', 'SEO básico incluído', 'Painel administrativo quando contratado'],
    subcategories: [
      { id: 'landing-page', icon: 'fa-bullseye', title: 'Landing page', description: 'Página única focada em conversão para produto, serviço ou campanha.', priceRange: 'R$ 900 – 2.500', priceNote: 'Referência para landing pages simples', deadline: 'Prazo estimado: 1 a 2 semanas', status: 'available', longDescription: 'Página única, com design focado em conversão e estrutura enxuta para campanhas ou lançamentos.', features: ['Design focado em conversão', 'Layout responsivo', 'Formulário de contato'], projectTypes: ['Landing page simples', 'Landing page personalizada', 'Landing page com formulários e integrações'], paymentTerms: ['À vista ou em até 3 parcelas', 'Primeira parcela antes do início'], additionalCosts: ['Domínio e hospedagem', 'Ferramentas de automação ou CRM', 'Integrações pagas'], observations: ['Valor total do projeto — não é mensalidade.', 'Prazo pode variar conforme quantidade de seções e integrações.'] },
      { id: 'site-institucional', icon: 'fa-building', title: 'Site institucional', description: 'Site de apresentação da empresa, com múltiplas seções e páginas.', priceRange: 'R$ 1.500 – 6.000', priceNote: 'Referência para 5 a 10 páginas', deadline: 'Prazo estimado: 2 a 4 semanas', status: 'available', longDescription: 'Site institucional com múltiplas páginas, apresentando a empresa, serviços, equipe e canais de contato.', features: ['Múltiplas páginas', 'Design responsivo', 'Otimização básica de SEO'], projectTypes: ['Institucional básico', 'Institucional personalizado', 'Institucional com CMS', 'Institucional com blog'], paymentTerms: ['À vista ou parcelado durante o desenvolvimento', 'Primeira parcela antes do início'], additionalCosts: ['Domínio e hospedagem', 'Plugins ou licenças premium', 'Serviços de e-mail profissional'], observations: ['Projetos com mais páginas ou recursos avançados recebem orçamento próprio.', 'CMS e blog influenciam no prazo e no valor.'] },
      { id: 'portfolio-catalogo', icon: 'fa-images', title: 'Portfólio / catálogo digital', description: 'Apresentação visual de projetos, produtos ou serviços.', priceRange: 'Orçamento conforme conteúdo', priceNote: 'Depende da quantidade de itens e recursos', deadline: 'Prazo definido após análise', status: 'available', longDescription: 'Site voltado à exposição de trabalhos, produtos ou serviços, com foco em apresentação visual.', features: ['Galeria de imagens', 'Layout responsivo', 'Filtros e categorias'], projectTypes: ['Portfólio profissional', 'Catálogo de produtos', 'Catálogo de serviços', 'Galeria e apresentação de projetos'], paymentTerms: ['À vista ou parcelado', 'Primeira parcela antes do início'], additionalCosts: ['Domínio e hospedagem', 'Sessão de fotos (não inclusa)', 'Integrações com redes sociais'], observations: ['Valor e prazo dependem da quantidade de conteúdo e recursos desejados.'] },
      { id: 'loja-virtual', icon: 'fa-cart-shopping', title: 'Loja virtual', description: 'E-commerce completo com catálogo, carrinho e checkout.', priceRange: 'R$ 2.000 – 9.000', priceNote: 'Referência para plataformas prontas', deadline: 'Prazo estimado: 3 a 6 semanas', status: 'available', longDescription: 'Loja virtual com catálogo, carrinho e checkout. A referência considera plataformas prontas e configuração.', features: ['Catálogo de produtos', 'Carrinho e checkout', 'Painel administrativo'], projectTypes: ['Loja em plataforma pronta (R$ 2.000–9.000)', 'Loja personalizada', 'E-commerce com integrações', 'E-commerce sob medida (orçamento separado)'], paymentTerms: ['À vista ou parcelado', 'Primeira parcela antes do início'], additionalCosts: ['Plataforma (mensalidade)', 'Gateway de pagamento (taxas por transação)', 'Domínio, hospedagem e certificado SSL', 'Integrações com logística e ERP'], observations: ['Projetos sob medida possuem orçamento separado.', 'Checkout personalizado e integrações financeiras exigem avaliação técnica.', 'Não inclui custos de gateways e taxas de terceiros.'] },
      { id: 'webapp-custom', icon: 'fa-code', title: 'Site personalizado / Web App', description: 'Site com funcionalidades sob medida, integrações e área restrita.', priceRange: 'R$ 10.000 – 25.000+', priceNote: 'Referência para aplicações web leves', deadline: 'Prazo definido conforme escopo', status: 'evaluation', longDescription: 'Aplicação web com lógica própria, área de usuário e/ou banco de dados. Não é apenas um site — é um sistema na web.', features: ['Lógica personalizada', 'Integrações com APIs', 'Área de usuário'], projectTypes: ['Portal informativo', 'Web app interativo', 'Área de usuário', 'Aplicação com banco de dados', 'Sistema web personalizado (avaliação técnica)'], paymentTerms: ['À vista ou parcelamento mensal', 'Primeira parcela antes do início'], additionalCosts: ['Backend, hospedagem e banco de dados', 'APIs e serviços de terceiros', 'Infraestrutura de e-mail e notificações'], observations: ['Valor de referência é para projetos leves, não para sistemas complexos.', 'Escopo detalhado necessário antes da proposta.', 'Serviço sob avaliação técnica para casos complexos.'] }
    ]
  },
  {
    id: 'sistemas',
    icon: 'fa-server',
    title: 'Sistemas',
    description: 'Sistemas internos, painéis e automação de processos.',
    features: ['Análise de processo antes do desenvolvimento', 'Controle de usuários e permissões', 'Evolução contínua possível'],
    subcategories: [
      { id: 'sistema-gestao', icon: 'fa-clipboard-list', title: 'Sistema de gestão', description: 'Sistema para organizar clientes, produtos, pedidos ou operações internas.', priceRange: 'R$ 18.000 – 45.000', priceNote: 'Referência para sistemas simples (CRUD)', deadline: 'Prazo estimado: 6 a 10 semanas', status: 'evaluation', longDescription: 'Sistema para cadastros, consultas e relatórios. As referências consideram escopos limitados, não sistemas empresariais completos.', features: ['Cadastros e relatórios', 'Controle de usuários', 'Painel personalizado'], projectTypes: ['Gestão de clientes', 'Gestão de produtos', 'Gestão de pedidos', 'Gestão operacional'], paymentTerms: ['À vista ou parcelamento mensal', 'Primeira parcela antes do início'], additionalCosts: ['Servidor, banco de dados e hospedagem', 'Backups e monitoramento', 'Integrações com sistemas legados'], observations: ['Valores de referência são para escopos limitados.', 'Sistemas empresariais completos exigem orçamento próprio.', 'Serviço sob avaliação técnica antes da contratação.'] },
      { id: 'painel-admin', icon: 'fa-gauge-high', title: 'Painel administrativo', description: 'Dashboard para visualizar métricas e administrar dados.', priceRange: 'Orçamento após análise', priceNote: 'Fontes de dados e permissões influenciam', deadline: 'Prazo definido após escopo', status: 'evaluation', longDescription: 'Painel administrativo para visualização e gestão de dados. O valor depende de quantos indicadores, fontes de dados, permissões e funcionalidades forem necessários.', features: ['Visualização de dados', 'Gestão de conteúdo', 'Controle de permissões'], projectTypes: ['Dashboard básico', 'Painel de controle', 'Gestão de conteúdo', 'Administração de usuários', 'Painel com relatórios'], paymentTerms: ['À vista ou parcelamento', 'Primeira parcela antes do início'], additionalCosts: ['Backend e banco de dados', 'Integrações com fontes de dados', 'Hospedagem e monitoramento'], observations: ['Avaliação de escopo obrigatória antes do orçamento.', 'Fontes de dados e permissões influenciam diretamente o valor.'] },
      { id: 'automacao', icon: 'fa-robot', title: 'Automação e integrações', description: 'Automação de tarefas e integração entre sistemas via API.', priceRange: 'R$ 5.000 – 50.000+', priceNote: 'APIs simples R$ 5–15k · Complexas R$ 30–50k+', deadline: 'Prazo de referência: 8 a 24 semanas', status: 'available', longDescription: 'Automação de processos e integração de sistemas. O valor depende do número de sistemas, complexidade das APIs e regras de negócio.', features: ['Automação de tarefas', 'Integração com APIs', 'Agendamento e webhooks'], projectTypes: ['Automação simples', 'Integração entre sistemas', 'Integrações via API', 'Webhooks', 'Automação empresarial (avaliação)'], paymentTerms: ['À vista ou parcelado', 'Primeira parcela antes do início'], additionalCosts: ['APIs de terceiros (custos por chamada)', 'Infraestrutura de execução', 'Credenciais e serviços pagos'], observations: ['Não aplicar o valor de uma API simples a uma integração empresarial complexa.', 'Prazo depende dos sistemas envolvidos e da documentação disponível.'] },
      { id: 'sistema-custom', icon: 'fa-cogs', title: 'Sistema sob medida', description: 'Sistema construído do zero para um processo específico do seu negócio.', priceRange: 'R$ 25.000 – 150.000+', priceNote: 'Interno simples R$ 25–60k · Complexos R$ 45–150k+', deadline: 'Prazo de referência: 10 a 20 semanas', status: 'evaluation', longDescription: 'Sistema dedicado ao seu processo. Escopo construído em conjunto com a FGP durante a análise técnica.', features: ['Escopo dedicado', 'Banco de dados próprio', 'Possibilidade de evolução contínua'], projectTypes: ['Sistema interno', 'Sistema multiusuário', 'Plataforma empresarial', 'Sistema com integrações', 'Sistema de operações personalizado'], paymentTerms: ['À vista ou parcelamento conforme cronograma', 'Primeira parcela antes do início'], additionalCosts: ['Infraestrutura (servidor, banco, backups)', 'Integrações críticas', 'Licenças e ferramentas específicas'], observations: ['Sistemas mais complexos podem superar significativamente a faixa.', 'Avaliação técnica obrigatória.', 'Serviço sob avaliação técnica.'] }
    ]
  },
  {
    id: 'solucoes',
    icon: 'fa-wand-magic-sparkles',
    title: 'Soluções Digitais',
    description: 'Consultoria, identidade digital, manutenção e integrações.',
    features: ['Consultoria por hora ou pacote', 'Manutenção recorrente opcional', 'Integrações sob demanda'],
    subcategories: [
      { id: 'identidade-digital', icon: 'fa-fingerprint', title: 'Identidade digital', description: 'Presença digital completa: site, redes sociais e comunicação visual.', priceRange: 'Orçamento personalizado', priceNote: 'Depende dos entregáveis definidos', deadline: 'Prazo definido conforme escopo', status: 'evaluation', longDescription: 'Conjunto de ações para consolidar a presença digital de uma marca. Não há preço fixo sem definir os entregáveis.', features: ['Diretrizes visuais', 'Presença nas redes', 'Materiais de apoio'], projectTypes: ['Identidade visual digital', 'Presença digital', 'Materiais de comunicação', 'Organização da presença online'], paymentTerms: ['À vista ou parcelado', 'Primeira parcela antes do início'], additionalCosts: ['Ferramentas de design', 'Banco de imagens e fontes', 'Serviços de social media'], observations: ['Não é possível fixar preço sem definir os entregáveis.', 'Cada projeto recebe orçamento próprio.'] },
      { id: 'consultoria-tecnica', icon: 'fa-lightbulb', title: 'Consultoria técnica', description: 'Análise, diagnóstico e recomendação para projetos digitais.', priceRange: 'R$ 60 – 150 / hora', priceNote: 'Referência de mercado para profissionais iniciantes', deadline: 'Modalidade: por hora ou pacote', status: 'available', longDescription: 'Consultoria pontual ou contínua. A cobrança pode ser por hora ou por pacote fechado, conforme a necessidade.', features: ['Diagnóstico', 'Recomendações práticas', 'Plano de ação'], projectTypes: ['Análise de projetos', 'Diagnóstico técnico', 'Planejamento', 'Orientação tecnológica'], paymentTerms: ['Por hora ou pacote', 'Pagamento na entrega do relatório'], additionalCosts: ['Acesso a sistemas para análise', 'Ferramentas de diagnóstico (quando aplicável)'], observations: ['Não é uma tarifa oficial da FGP.', 'O valor final depende da experiência, escopo e duração.', 'O valor-hora de R$ 60–150 é referência de mercado, não fixo.'] },
      { id: 'manutencao', icon: 'fa-screwdriver-wrench', title: 'Manutenção e suporte', description: 'Manutenção contínua de sites, apps ou sistemas já existentes.', priceRange: 'R$ 70 – 1.290 / mês', priceNote: 'Conforme nível de suporte contratado', deadline: 'Modalidade: contratação mensal', status: 'available', longDescription: 'Plano recorrente para manter o projeto funcionando e atualizado. Escopo e quantidade de suporte definidos em contrato.', features: ['Atualizações periódicas', 'Correções conforme escopo', 'Relatórios'], projectTypes: ['Básico — R$ 70–200/mês · atualizações, backups, monitoramento básico', 'Intermediário — R$ 197–397/mês · suporte, correções limitadas, atualizações frequentes', 'Avançado — R$ 797–1.290/mês · monitoramento avançado, backups frequentes, horas limitadas de desenvolvimento'], paymentTerms: ['Mensal recorrente', 'Plano anual antecipado com desconto (5–10%, quando aplicável)'], additionalCosts: ['Hospedagem e domínio', 'Renovação de licenças e plugins', 'Desenvolvimento além do escopo contratado'], observations: ['Não oferece suporte ilimitado.', 'Os valores são referências de planos publicados no Brasil em 2026.', 'A FGP define em contrato o que cada nível inclui.'] },
      { id: 'integracoes-apis', icon: 'fa-plug', title: 'Integrações e APIs', description: 'Conexão entre sistemas via APIs e integrações específicas.', priceRange: 'R$ 5.000 – 50.000+', priceNote: 'APIs simples R$ 5–15k · Complexas R$ 30–50k+', deadline: 'Prazo de referência: 8 a 24 semanas', status: 'available', longDescription: 'Construção de integrações entre sistemas. O escopo depende dos sistemas envolvidos e do nível de complexidade.', features: ['APIs REST', 'Webhooks', 'Documentação'], projectTypes: ['API simples', 'Integração entre plataformas', 'Webhooks', 'Integração empresarial', 'Integração personalizada'], paymentTerms: ['À vista ou parcelado', 'Primeira parcela antes do início'], additionalCosts: ['APIs de terceiros', 'Ambientes de teste e produção', 'Credenciais e serviços pagos'], observations: ['Não garantir valores sem conhecer os sistemas envolvidos.', 'Prazo depende da documentação e do ambiente de testes.'] }
    ]
  },
  {
    id: 'business',
    icon: 'fa-briefcase',
    title: 'Serviços e Negócios da FGP',
    description: 'Publicação de jogos, mods de Minecraft, parcerias e consultoria de produto.',
    features: ['Serviços autorais da FGP', 'Orçamento após análise', 'Propostas personalizadas'],
    subcategories: [
      { id: 'publicacao-jogos', icon: 'fa-gamepad', title: 'Publicação de jogos', description: 'Apoio na publicação de jogos independentes em lojas digitais.', priceRange: 'Orçamento por projeto', priceNote: 'Taxas de loja e custos de terceiros separados', deadline: 'Prazo definido conforme projeto', status: 'evaluation', longDescription: 'Suporte completo ou parcial na publicação de um jogo independente em lojas digitais.', features: ['Preparação de build', 'Publicação nas lojas', 'Acompanhamento de lançamento'], projectTypes: ['Preparação de build', 'Publicação na Play Store', 'Publicação na itch.io', 'Adequação técnica', 'Acompanhamento de lançamento'], paymentTerms: ['Por projeto ou etapas', 'Primeira parcela antes do início'], additionalCosts: ['Taxa anual de desenvolvedor Google Play', 'Taxas da itch.io (quando aplicável)', 'Materiais de marketing e assets'], observations: ['Não há preço único de mercado — cada jogo exige escopo próprio.', 'Serviço sob avaliação técnica nesta fase da FGP.'] },
      { id: 'mods-minecraft', icon: 'fa-cubes', title: 'Mods e add-ons Minecraft', description: 'Desenvolvimento de mods ou add-ons para Minecraft Bedrock.', priceRange: 'Orçamento personalizado', priceNote: 'Depende de itens, comportamentos e complexidade', deadline: 'Prazo definido após escopo detalhado', status: 'available', longDescription: 'Desenvolvimento de add-ons para Minecraft Bedrock. O valor considera quantidade de itens, comportamentos, entidades, texturas e testes.', features: ['Comportamentos e itens', 'Compatibilidade Bedrock', 'Pacote .mcaddon'], projectTypes: ['Add-ons de itens', 'Add-ons de entidades', 'Mecânicas e comportamentos', 'Pacotes personalizados', 'Projetos Minecraft Bedrock'], paymentTerms: ['Por projeto ou etapas', 'Primeira parcela antes do início'], additionalCosts: ['Recursos gráficos e texturas', 'Testes em servidores dedicados', 'Publicação em lojas específicas'], observations: ['Não há preço de mercado único comparável.', 'Quantidade de itens e complexidade das mecânicas definem o valor.'] },
      { id: 'parceria-dev', icon: 'fa-handshake-angle', title: 'Parceria de desenvolvimento', description: 'Colaboração contínua em projetos de longo prazo.', priceRange: 'Proposta personalizada', priceNote: 'Horas, responsabilidades e frequência definem', deadline: 'Modalidade: contratação recorrente', status: 'evaluation', longDescription: 'Parceria de longo prazo com a FGP para desenvolvimento contínuo. Envolve definição de responsabilidades, horas, entregas e propriedade intelectual.', features: ['Escopo recorrente', 'Comunicação direta', 'Acompanhamento'], projectTypes: ['Parceria por projeto', 'Desenvolvimento recorrente', 'Colaboração tecnológica', 'Desenvolvimento conjunto'], paymentTerms: ['Recorrente mensal com escopo definido', 'Possibilidade de anual antecipado com desconto'], additionalCosts: ['Infraestrutura compartilhada', 'Ferramentas de colaboração', 'Serviços de terceiros'], observations: ['Definir em contrato: propriedade intelectual, responsabilidades e entregas.', 'Serviço sob avaliação técnica.'] },
      { id: 'consultoria-produto', icon: 'fa-compass', title: 'Consultoria de produto', description: 'Orientação sobre escopo, viabilidade e roadmap de um projeto.', priceRange: 'R$ 60 – 150 / hora', priceNote: 'Referência de mercado para profissionais iniciantes', deadline: 'Modalidade: por hora ou pacote', status: 'available', longDescription: 'Orientação estratégica para produtos digitais. O valor final depende da experiência, escopo e duração.', features: ['Análise de escopo', 'Viabilidade técnica', 'Roadmap sugerido'], projectTypes: ['Planejamento de produto', 'Análise de viabilidade', 'Definição de escopo', 'Roadmap', 'Orientação de desenvolvimento'], paymentTerms: ['Por hora ou pacote', 'Pagamento na entrega do relatório'], additionalCosts: ['Ferramentas de prototipação', 'Acesso a dados e métricas do produto'], observations: ['Não é tarifa oficial da FGP.', 'O valor-hora é referência de mercado, não fixo.'] }
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
  if (!bytes) return '';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

/* ============================================================
4. ESTADO DE NAVEGAÇÃO E DOM
============================================================ */
const NavState = { currentCategory: null, currentSubcategory: null };

const dom = {
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

/* ============================================================
5. NAVEGAÇÃO DO CATÁLOGO
============================================================ */
function showLevel(level) {
  const intro = dom.categoriesIntro(), breadcrumb = dom.breadcrumb(), cats = dom.categoriesContainer(), subs = dom.subcategoriesContainer(), dets = dom.detailsContainer();
  if (level === 1) { intro?.classList.remove('hidden'); breadcrumb?.classList.add('hidden'); cats?.classList.remove('hidden'); subs?.classList.add('hidden'); dets?.classList.add('hidden'); } 
  else if (level === 2) { intro?.classList.add('hidden'); breadcrumb?.classList.remove('hidden'); cats?.classList.add('hidden'); subs?.classList.remove('hidden'); dets?.classList.add('hidden'); } 
  else if (level === 3) { intro?.classList.add('hidden'); breadcrumb?.classList.remove('hidden'); cats?.classList.add('hidden'); subs?.classList.add('hidden'); dets?.classList.remove('hidden'); }
}

function scrollToCategories() {
  const el = document.getElementById('categorias');
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
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

function renderCategories() {
  const container = dom.categoriesContainer();
  if (!container) return;
  container.innerHTML = CATEGORIES_DB.map(cat => `
    <article class="category-card">
      <div class="category-card-icon"><i class="fas ${cat.icon}"></i></div>
      <h3>${cat.title}</h3>
      <p class="category-card-desc">${cat.description}</p>
      <ul class="category-card-features">${cat.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}</ul>
      <div class="category-card-meta">
        <span class="category-card-count"><i class="fas fa-layer-group"></i> ${cat.subcategories.length} ${cat.subcategories.length === 1 ? 'subcategoria' : 'subcategorias'}</span>
        <button class="btn-open" data-category="${cat.id}">Abrir <i class="fas fa-arrow-right"></i></button>
      </div>
    </article>
  `).join('');
  container.querySelectorAll('.btn-open').forEach(btn => btn.addEventListener('click', () => openCategory(btn.dataset.category)));
}

function renderSubcategories(cat) {
  const container = dom.subcategoriesContainer();
  if (!container) return;
  container.innerHTML = `
    <div class="subcategories-header">
      <div class="subcategories-header-text"><h2>${cat.title}</h2><p>${cat.description}</p></div>
      <button class="btn-back" id="backToCatsBtn"><i class="fas fa-arrow-left"></i> Voltar às categorias</button>
    </div>
    <div class="subcategories-grid">
      ${cat.subcategories.map(sub => `
        <article class="subcategory-card" data-subcategory="${sub.id}">
          <div class="subcategory-card-header"><div class="subcategory-card-icon"><i class="fas ${sub.icon}"></i></div><h3>${sub.title}</h3></div>
          <p class="subcategory-card-desc">${sub.description}</p>
          <div class="subcategory-card-footer">
            <span class="subcategory-card-price">${sub.priceRange}</span>
            <button class="btn-view-details" data-subcategory="${sub.id}">Ver detalhes <i class="fas fa-arrow-right"></i></button>
          </div>
        </article>
      `).join('')}
    </div>`;
  container.querySelector('#backToCatsBtn').addEventListener('click', backToCategories);
  container.querySelectorAll('.subcategory-card').forEach(card => card.addEventListener('click', (e) => { if (!e.target.closest('.btn-view-details')) openSubcategory(card.dataset.subcategory); }));
  container.querySelectorAll('.btn-view-details').forEach(btn => btn.addEventListener('click', (e) => { e.stopPropagation(); openSubcategory(btn.dataset.subcategory); }));
}

function getStatusBadge(status) {
  const map = { available: { label: 'Disponível', icon: 'fa-circle-check', cls: 'available' }, evaluation: { label: 'Sob avaliação técnica', icon: 'fa-triangle-exclamation', cls: 'evaluation' }, expansion: { label: 'Em expansão', icon: 'fa-seedling', cls: 'expansion' } };
  const info = map[status] || map.evaluation;
  return `<span class="status-badge ${info.cls}"><i class="fas ${info.icon}"></i> ${info.label}</span>`;
}

function renderDetails(cat, sub) {
  const container = dom.detailsContainer();
  if (!container) return;
  container.innerHTML = `
    <div class="details-header">
      <button class="btn-back" id="backToSubsBtn"><i class="fas fa-arrow-left"></i> Voltar para ${cat.title}</button>
      ${getStatusBadge(sub.status)}
    </div>
    <div class="details-card">
      <div class="details-top">
        <div class="details-icon"><i class="fas ${sub.icon}"></i></div>
        <div class="details-top-info">
          <div class="details-category-label">${cat.title}</div>
          <h2 class="details-title">${sub.title}</h2>
          <p class="details-description">${sub.longDescription || sub.description}</p>
        </div>
      </div>
      <div class="details-highlight-row">
        <div class="details-highlight"><div class="details-highlight-label"><i class="fas fa-money-bill-wave"></i> Investimento de referência</div><div class="details-highlight-value">${sub.priceRange}<small>${sub.priceNote || 'Valor final sujeito ao escopo.'}</small></div></div>
        <div class="details-highlight"><div class="details-highlight-label"><i class="fas fa-clock"></i> Prazo de desenvolvimento</div><div class="details-highlight-value">${sub.deadline || 'Variável'}<small>Estimativa inicial — pode variar com o escopo.</small></div></div>
      </div>
      <div class="details-sections">
        <div class="details-section"><h4><i class="fas fa-list-check"></i> Tipos de projeto atendidos</h4><ul class="details-list">${sub.projectTypes.map(t => `<li><i class="fas fa-angle-right"></i> ${t}</li>`).join('')}</ul></div>
        <div class="details-section"><h4><i class="fas fa-credit-card"></i> Modalidades de pagamento</h4><ul class="details-list">${sub.paymentTerms.map(p => `<li><i class="fas fa-angle-right"></i> ${p}</li>`).join('')}</ul></div>
        <div class="details-section"><h4><i class="fas fa-receipt"></i> Custos adicionais</h4><ul class="details-list">${sub.additionalCosts.map(c => `<li><i class="fas fa-angle-right"></i> ${c}</li>`).join('')}</ul></div>
        <div class="details-section"><h4><i class="fas fa-star"></i> Características</h4><ul class="details-list">${sub.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}</ul></div>
      </div>
      <div class="details-observations">
        <h4><i class="fas fa-circle-info"></i> Observações importantes</h4>
        <ul>${sub.observations.map(o => `<li><i class="fas fa-circle-info"></i> ${o}</li>`).join('')}</ul>
      </div>
      <div class="details-cta">
        <p class="details-cta-note">Os valores e prazos são referências de mercado. O orçamento definitivo será elaborado após a análise do escopo, das funcionalidades e dos requisitos técnicos.</p>
        <button class="btn-request-large" data-subcategory="${sub.id}" data-category="${cat.id}"><i class="fas fa-wand-magic-sparkles"></i> Começar com este serviço</button>
      </div>
    </div>`;
  container.querySelector('#backToSubsBtn').addEventListener('click', backToSubcategories);
  container.querySelector('.btn-request-large').addEventListener('click', (e) => {
    const btn = e.currentTarget;
    openJourneyFromCatalog(btn.dataset.category, btn.dataset.subcategory);
  });
}

function renderBreadcrumb() {
  const container = dom.breadcrumb();
  if (!container) return;
  const cat = NavState.currentCategory ? CATEGORIES_DB.find(c => c.id === NavState.currentCategory) : null;
  const sub = cat && NavState.currentSubcategory ? cat.subcategories.find(s => s.id === NavState.currentSubcategory) : null;
  if (!cat) { container.classList.add('hidden'); container.innerHTML = ''; return; }
  let html = `<button class="breadcrumb-item" data-crumb="root"><i class="fas fa-layer-group"></i> Catálogo</button>`;
  if (!sub) {
    html += `<span class="breadcrumb-sep"><i class="fas fa-chevron-right"></i></span><span class="breadcrumb-item current">${cat.title}</span>`;
  } else {
    html += `<span class="breadcrumb-sep"><i class="fas fa-chevron-right"></i></span><button class="breadcrumb-item" data-crumb="category">${cat.title}</button><span class="breadcrumb-sep"><i class="fas fa-chevron-right"></i></span><span class="breadcrumb-item current">${sub.title}</span>`;
  }
  container.innerHTML = html;
  container.querySelector('[data-crumb="root"]')?.addEventListener('click', backToCategories);
  container.querySelector('[data-crumb="category"]')?.addEventListener('click', backToSubcategories);
}

/* ============================================================
6. MODAL DE SOLICITAÇÃO (LEGADO PRESERVADO E CORRIGIDO)
============================================================ */
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
let currentFile = null;

function populateInstallmentOptions() {
  const selCount = document.getElementById('installmentCount'), selDay = document.getElementById('dueDay');
  if (!selCount || !selDay) return;
  const countOpts = ['<option value="">Selecione...</option>'];
  for (let i = 3; i <= 27; i++) countOpts.push(`<option value="${i}">${i}x</option>`);
  countOpts.push('<option value="outra">Outra quantidade — avaliar</option>');
  selCount.innerHTML = countOpts.join('');
  const dayOpts = ['<option value="">Selecione...</option>'];
  for (let i = 1; i <= 28; i++) dayOpts.push(`<option value="${i}">Dia ${i}</option>`);
  selDay.innerHTML = dayOpts.join('');
}

function updateInstallmentVisibility() {
  const selected = document.querySelector('input[name="productionPayment"]:checked');
  const isParcelado = selected && selected.value === 'Parcelado';
  const fields = document.getElementById('installmentFields');
  if (!fields) return;
  if (isParcelado) { fields.classList.add('visible'); } 
  else {
    fields.classList.remove('visible');
    document.getElementById('installmentCount')?.classList.remove('error');
    document.getElementById('dueDay')?.classList.remove('error');
    document.getElementById('installmentCountError')?.classList.remove('visible');
    document.getElementById('dueDayError')?.classList.remove('visible');
  }
}

function clearErrors() {
  document.querySelectorAll('.field-error').forEach(el => el.classList.remove('visible'));
  document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(el => el.classList.remove('error'));
}

function resetFileUpload() {
  currentFile = null;
  const fileInput = document.getElementById('fileInput'), uploadArea = document.getElementById('uploadArea'), preview = document.getElementById('uploadPreview');
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
  const uploadArea = document.getElementById('uploadArea'), fileInput = document.getElementById('fileInput'), removeBtn = document.getElementById('removeFileBtn');
  if (!uploadArea || !fileInput || !removeBtn) return;
  uploadArea.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => { if (e.target.files && e.target.files.length > 0) handleFileSelect(e.target.files[0]); });
  removeBtn.addEventListener('click', () => { resetFileUpload(); fileInput.value = ''; });
  uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.style.borderColor = 'var(--primary)'; });
  uploadArea.addEventListener('dragleave', () => { uploadArea.style.borderColor = ''; });
  uploadArea.addEventListener('drop', (e) => { e.preventDefault(); uploadArea.style.borderColor = ''; if (e.dataTransfer.files && e.dataTransfer.files.length > 0) handleFileSelect(e.dataTransfer.files[0]); });
}

function openRequestModal(cat, sub) {
  const modal = dom.requestModal();
  if (!modal) return;
  const typeText = `${cat.title} > ${sub.title}`;
  document.getElementById('requestTypeDisplay').textContent = typeText;
  document.getElementById('requestType').value = typeText;
  document.getElementById('requestTitle').value = `Solicitação de desenvolvimento — ${sub.title}`;
  document.getElementById('initialDescription').value = `Olá! Tenho interesse no desenvolvimento de ${sub.title.toLowerCase()} (${cat.title}) e gostaria de conhecer as condições de contratação.`;
  document.getElementById('projectDescription').value = '';
  document.querySelectorAll('input[name="productionPayment"]').forEach(r => r.checked = false);
  document.querySelectorAll('input[name="maintenancePreference"]').forEach(r => r.checked = false);
  document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
  const instCount = document.getElementById('installmentCount'), dueDay = document.getElementById('dueDay');
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
  if (modal._previousFocus && typeof modal._previousFocus.focus === 'function') modal._previousFocus.focus();
}

function validateForm() {
  clearErrors();
  let valid = true;
  const title = document.getElementById('requestTitle'), initialDesc = document.getElementById('initialDescription'), projectDesc = document.getElementById('projectDescription');
  if (!title.value.trim()) { title.classList.add('error'); document.getElementById('titleError').classList.add('visible'); valid = false; }
  if (!initialDesc.value.trim()) { initialDesc.classList.add('error'); document.getElementById('initialDescError').classList.add('visible'); valid = false; }
  if (!projectDesc.value.trim()) { projectDesc.classList.add('error'); document.getElementById('projectDescError').classList.add('visible'); valid = false; }
  const production = document.querySelector('input[name="productionPayment"]:checked');
  if (!production) { document.getElementById('productionPaymentError').classList.add('visible'); valid = false; } 
  else if (production.value === 'Parcelado') {
    const instCount = document.getElementById('installmentCount'), dueDay = document.getElementById('dueDay');
    if (!instCount.value) { instCount.classList.add('error'); document.getElementById('installmentCountError').classList.add('visible'); valid = false; }
    if (!dueDay.value) { dueDay.classList.add('error'); document.getElementById('dueDayError').classList.add('visible'); valid = false; }
  }
  const maintenance = document.querySelector('input[name="maintenancePreference"]:checked');
  if (!maintenance) { document.getElementById('maintenanceError').classList.add('visible'); valid = false; }
  return valid;
}

async function submitRequest(e) {
  e.preventDefault();
  if (!validateForm()) {
    const firstError = document.querySelector('.field-error.visible');
    if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const submitBtn = document.getElementById('submitBtn'), feedback = document.getElementById('submitFeedback');
  submitBtn.disabled = true;
  submitBtn.classList.add('loading');
  feedback.classList.remove('visible', 'success', 'error');

  // MONTAGEM CORRIGIDA PARA FORMINIT (fi-* blocks)
  const formData = new FormData();
  formData.append('_gotcha', ''); // Honeypot
  
  formData.append('fi-text-title', document.getElementById('requestTitle').value.trim());
  formData.append('fi-text-initialDescription', document.getElementById('initialDescription').value.trim());
  formData.append('fi-text-requestType', document.getElementById('requestType').value);
  formData.append('fi-text-projectDescription', document.getElementById('projectDescription').value.trim());
  
  const prodPayment = document.querySelector('input[name="productionPayment"]:checked');
  let productionText = prodPayment ? prodPayment.value : '';
  if (prodPayment && prodPayment.value === 'Parcelado') {
    const countEl = document.getElementById('installmentCount'), dueEl = document.getElementById('dueDay');
    const countText = countEl.value === 'outra' ? 'Outra quantidade — avaliar' : `${countEl.value} parcelas`;
    productionText += ` — ${countText}, vencimento dia ${dueEl.value}`;
  }
  formData.append('fi-text-productionPayment', productionText);
  
  const maintPref = document.querySelector('input[name="maintenancePreference"]:checked');
  formData.append('fi-text-maintenancePreference', maintPref ? maintPref.value : '');
  
  if (currentFile) formData.append('fi-file-attachment', currentFile, currentFile.name);

  try {
    // Nota: Content-Type NÃO é definido manualmente para permitir o boundary correto do multipart
    const response = await fetch(FORMINIT_ENDPOINT, { method: 'POST', body: formData });

    if (response.ok) {
      feedback.className = 'submit-feedback success visible';
      feedback.innerHTML = '<i class="fas fa-circle-check"></i> Solicitação enviada com sucesso! A FGP Technologies recebeu seu pedido e poderá entrar em contato para dar continuidade à análise.';
      feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => closeRequestModal(), 4000);
    } else {
      let errorMsg = 'Falha no envio. Tente novamente.';
      try {
        const errData = await response.json();
        errorMsg = errData.message || errorMsg;
      } catch (jsonErr) {
        console.error('Erro ao parsear resposta do Forminit:', jsonErr);
        errorMsg = response.statusText || errorMsg;
      }
      throw new Error(errorMsg);
    }
  } catch (error) {
    console.error('Erro no envio do formulário legado:', error);
    feedback.className = 'submit-feedback error visible';
    feedback.innerHTML = `<i class="fas fa-circle-exclamation"></i> Não foi possível enviar sua solicitação. Seus dados foram preservados. Verifique sua conexão e tente novamente.`;
    feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } finally {
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
  }
}

function setupRequestModal() {
  const modal = dom.requestModal(), form = document.getElementById('requestForm'), closeBtn = document.getElementById('closeRequestBtn');
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
  document.getElementById('installmentCount')?.addEventListener('change', (e) => { if (e.target.value) { e.target.classList.remove('error'); document.getElementById('installmentCountError').classList.remove('visible'); } });
  document.getElementById('dueDay')?.addEventListener('change', (e) => { if (e.target.value) { e.target.classList.remove('error'); document.getElementById('dueDayError').classList.remove('visible'); } });
  form.addEventListener('submit', submitRequest);
}

/* ============================================================
7. PAINEL DE CORES
============================================================ */
const COLOR_STORAGE_KEY = 'fgp_tech_palette';
const DEFAULT_PALETTE = { primary: '#3b82f6', accent: '#06b6d4', bg: '#0a0e17', text: '#f1f5f9' };
const COLOR_PRESETS = [
  { name: 'FGP Tech', palette: { primary: '#3b82f6', accent: '#06b6d4', bg: '#0a0e17', text: '#f1f5f9' } },
  { name: 'Corporativo', palette: { primary: '#2563eb', accent: '#f59e0b', bg: '#0c1424', text: '#f8fafc' } },
  { name: 'Minimal', palette: { primary: '#64748b', accent: '#0ea5e9', bg: '#0f172a', text: '#f1f5f9' } },
  { name: 'Claro', palette: { primary: '#2563eb', accent: '#0891b2', bg: '#f8fafc', text: '#0f172a' } }
];

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return { r: parseInt(h.substr(0, 2), 16), g: parseInt(h.substr(2, 2), 16), b: parseInt(h.substr(4, 2), 16) };
}

function mixHex(a, b, t) {
  const A = hexToRgb(a), B = hexToRgb(b);
  return `rgb(${Math.round(A.r + (B.r - A.r) * t)}, ${Math.round(A.g + (B.g - A.g) * t)}, ${Math.round(A.b + (B.b - A.b) * t)})`;
}

function applyPalette(p) {
  const root = document.documentElement;
  root.style.setProperty('--primary', p.primary);
  root.style.setProperty('--accent', p.accent);
  root.style.setProperty('--bg', p.bg);
  root.style.setProperty('--text', p.text);
  root.style.setProperty('--surface', mixHex(p.bg, p.text, 0.06));
  root.style.setProperty('--surface-strong', mixHex(p.bg, p.text, 0.10));
  root.style.setProperty('--border', mixHex(p.bg, p.text, 0.16));
  root.style.setProperty('--text-muted', mixHex(p.text, p.bg, 0.42));
  const $p = document.getElementById('primaryColor'), $a = document.getElementById('accentColor'), $b = document.getElementById('bgColor'), $t = document.getElementById('textColor');
  if ($p) $p.value = p.primary;
  if ($a) $a.value = p.accent;
  if ($b) $b.value = p.bg;
  if ($t) $t.value = p.text;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', p.bg);
}

function savePalette(p) { try { localStorage.setItem(COLOR_STORAGE_KEY, JSON.stringify(p)); } catch (_) {} }
function loadPalette() {
  try {
    const raw = localStorage.getItem(COLOR_STORAGE_KEY);
    return raw ? { ...DEFAULT_PALETTE, ...JSON.parse(raw) } : { ...DEFAULT_PALETTE };
  } catch (_) { return { ...DEFAULT_PALETTE }; }
}

function setupColorPanel() {
  const panel = document.getElementById('colorPanel'), overlay = document.getElementById('sideOverlay'), openBtn = document.getElementById('colorBtn'), closeBtn = document.getElementById('closeColorBtn'), resetBtn = document.getElementById('resetColors'), presetsBox = document.getElementById('colorPresets');
  const inputPrimary = document.getElementById('primaryColor'), inputAccent = document.getElementById('accentColor'), inputBg = document.getElementById('bgColor'), inputText = document.getElementById('textColor');
  if (!panel || !openBtn) return;

  COLOR_PRESETS.forEach(preset => {
    const btn = document.createElement('button');
    btn.className = 'preset-btn';
    btn.type = 'button';
    btn.innerHTML = `<div class="dots"><span style="background:${preset.palette.primary}"></span><span style="background:${preset.palette.accent}"></span><span style="background:${preset.palette.bg};border:1px solid #666"></span></div>${preset.name}`;
    btn.addEventListener('click', () => { applyPalette(preset.palette); savePalette(preset.palette); });
    presetsBox.appendChild(btn);
  });

  applyPalette(loadPalette());

  openBtn.addEventListener('click', () => { panel.classList.add('open'); overlay.classList.add('open'); panel.setAttribute('aria-hidden', 'false'); });
  function closePanel() {
    panel.classList.remove('open');
    if (!document.getElementById('sideMenu').classList.contains('open')) overlay.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
  }
  closeBtn.addEventListener('click', closePanel);

  function liveUpdate() {
    const p = { primary: inputPrimary.value, accent: inputAccent.value, bg: inputBg.value, text: inputText.value };
    applyPalette(p);
    savePalette(p);
  }
  [inputPrimary, inputAccent, inputBg, inputText].forEach(inp => { if (inp) inp.addEventListener('input', liveUpdate); });
  resetBtn.addEventListener('click', () => { applyPalette(DEFAULT_PALETTE); savePalette(DEFAULT_PALETTE); });
}

/* ============================================================
8. MENU LATERAL E MODAIS AUXILIARES
============================================================ */
function closeSideMenu() {
  const menu = dom.sideMenu(), overlay = dom.sideOverlay(), colorPanel = dom.colorPanel();
  if (!menu) return;
  menu.classList.remove('open');
  menu.setAttribute('aria-hidden', 'true');
  if (!colorPanel.classList.contains('open')) overlay.classList.remove('open');
}

function setupSideMenu() {
  const menu = dom.sideMenu(), overlay = dom.sideOverlay(), openBtn = document.getElementById('hamburgerBtn');
  if (!menu || !openBtn) return;
  openBtn.addEventListener('click', () => { menu.classList.add('open'); overlay.classList.add('open'); menu.setAttribute('aria-hidden', 'false'); });
  overlay.addEventListener('click', () => {
    closeSideMenu();
    const cp = dom.colorPanel();
    if (cp.classList.contains('open')) { cp.classList.remove('open'); cp.setAttribute('aria-hidden', 'true'); }
  });
  menu.querySelectorAll('a').forEach(a => { a.addEventListener('click', () => { if (a.id !== 'accessosSideBtn' && a.id !== 'sideMenuStartBtn') closeSideMenu(); }); });
  document.getElementById('accessosSideBtn')?.addEventListener('click', (e) => { e.preventDefault(); closeSideMenu(); openAccessosModal(); });
  document.getElementById('sideMenuStartBtn')?.addEventListener('click', (e) => { e.preventDefault(); closeSideMenu(); openJourney(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSideMenu();
      const cp = dom.colorPanel();
      if (cp.classList.contains('open')) { cp.classList.remove('open'); cp.setAttribute('aria-hidden', 'true'); }
      closeAccessosModal();
      closeRequestModal();
      const journeyModal = dom.journeyModal();
      if (journeyModal && journeyModal.classList.contains('open')) closeJourneyWithConfirm();
    }
  });
}

function openAccessosModal() { const modal = dom.accessosModal(); if (!modal) return; modal.classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeAccessosModal() { const modal = dom.accessosModal(); if (!modal || !modal.classList.contains('open')) return; modal.classList.remove('open'); document.body.style.overflow = ''; }
function setupAccessosModal() {
  const modal = dom.accessosModal();
  if (!modal) return;
  document.getElementById('closeAccessosBtn')?.addEventListener('click', closeAccessosModal);
  document.getElementById('accessosFooterBtn')?.addEventListener('click', openAccessosModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeAccessosModal(); });
}

function setupHeaderScroll() {
  const header = dom.siteHeader();
  if (!header) return;
  const onScroll = () => { if (window.scrollY > 10) header.classList.add('scrolled'); else header.classList.remove('scrolled'); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function setupReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { items.forEach(el => el.classList.add('visible')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); io.unobserve(entry.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  items.forEach(el => io.observe(el));
}

/* ============================================================
9. FGP ASSISTANT INTELIGENTE (JORNADA EVOLUÍDA)
============================================================ */
const JourneyState = {
  step: 1,
  category: null,
  subcategory: null,
  data: {}, // Armazena todas as respostas do briefing dinâmico
  file: null
};

const ASSISTANT_MESSAGES = {
  1: 'Olá! Vamos encontrar a solução ideal. Escolha a categoria e o serviço desejado.',
  2: 'Perfeito! Agora, preciso saber quem está solicitando o orçamento para personalizarmos o atendimento.',
  3: 'Ótimo! Conte-me um pouco sobre o contexto geral deste projeto.',
  4: 'Entendido. Agora, vamos detalhar alguns aspectos técnicos específicos deste tipo de serviço.',
  5: 'Quais materiais visuais ou de conteúdo você já possui para este projeto?',
  6: 'Vamos alinhar as expectativas de prazo e infraestrutura necessária.',
  7: 'Quase lá! Como você prefere estruturar as condições comerciais e de pagamento?',
  8: 'Tudo pronto! Revise as informações abaixo antes de enviar sua solicitação.'
};

function getJourneyCategory() { return JourneyState.category ? CATEGORIES_DB.find(c => c.id === JourneyState.category) : null; }
function getJourneySubcategory() {
  const cat = getJourneyCategory();
  if (!cat || !JourneyState.subcategory) return null;
  return cat.subcategories.find(s => s.id === JourneyState.subcategory) || null;
}
function parseProjectTypeName(raw) { if (!raw) return ''; const parts = raw.split(/\s+—\s+/); return parts[0] || raw; }

function resetJourneyState() {
  JourneyState.step = 1;
  JourneyState.category = null;
  JourneyState.subcategory = null;
  JourneyState.data = {};
  JourneyState.file = null;
  resetJourneyFile();
}

function resetJourneyFile() {
  const fileInput = document.getElementById('journeyFileInput'), uploadArea = document.getElementById('journeyUploadArea'), preview = document.getElementById('journeyUploadPreview');
  if (!fileInput || !uploadArea || !preview) return;
  fileInput.value = '';
  preview.classList.remove('visible');
  uploadArea.style.display = '';
  document.getElementById('journeyPreviewImg').src = '';
  document.getElementById('journeyPreviewFilename').textContent = '';
  document.getElementById('journeyPreviewFilesize').textContent = '';
  document.getElementById('journeyFileError').classList.remove('visible');
}

function openJourney() { resetJourneyState(); JourneyState.step = 1; openJourneyModal(); renderJourneyStep(); }
function openJourneyFromCatalog(catId, subId) {
  resetJourneyState();
  JourneyState.category = catId;
  JourneyState.subcategory = subId;
  const cat = getJourneyCategory(), sub = getJourneySubcategory();
  if (cat && sub) {
    JourneyState.data.projectName = `Novo ${sub.title}`;
    JourneyState.data.businessDesc = `Interesse no desenvolvimento de ${sub.title.toLowerCase()} (${cat.title}).`;
  }
  JourneyState.step = 2; // Pula seleção, vai para identificação
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
  const hasData = JourneyState.category || JourneyState.subcategory || Object.keys(JourneyState.data).length > 0 || JourneyState.file;
  if (hasData && !window.confirm('Você tem informações preenchidas. Deseja realmente sair da jornada?')) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  resetJourneyState();
}

function showJourneyAlert(msg) {
  const bubble = document.getElementById('journeyAssistantText');
  if (!bubble) return;
  const originalText = ASSISTANT_MESSAGES[JourneyState.step] || bubble.textContent;
  bubble.textContent = '⚠ ' + msg;
  bubble.classList.add('journey-assistant-bubble-alert');
  setTimeout(() => { bubble.textContent = originalText; bubble.classList.remove('journey-assistant-bubble-alert'); }, 2800);
}

function handleJourneyNext() {
  const step = JourneyState.step;
  
  // Validações por etapa
  if (step === 1) {
    if (!JourneyState.category || !JourneyState.subcategory) { showJourneyAlert('Selecione uma categoria e um serviço.'); return; }
  } else if (step === 2) {
    const isPj = JourneyState.data.clientType === 'pj';
    if (!JourneyState.data.email || !JourneyState.data.phone) { showJourneyAlert('Preencha e-mail e telefone.'); return; }
    if (!isPj && !JourneyState.data.fullName) { showJourneyAlert('Preencha seu nome completo.'); return; }
    if (isPj && (!JourneyState.data.companyName || !JourneyState.data.contactPerson)) { showJourneyAlert('Preencha os dados da empresa e do responsável.'); return; }
  } else if (step === 3) {
    if (!JourneyState.data.projectName || !JourneyState.data.businessDesc) { showJourneyAlert('Preencha o nome do projeto e a descrição do negócio.'); return; }
  } else if (step === 7) {
    if (!JourneyState.data.paymentPreference || !JourneyState.data.maintenancePreference) { showJourneyAlert('Selecione as preferências comerciais.'); return; }
  } else if (step === 8) {
    submitJourney();
    return;
  }

  if (JourneyState.step < 8) {
    JourneyState.step++;
    renderJourneyStep();
  }
}

function handleJourneyBack() {
  if (JourneyState.step > 1) {
    JourneyState.step--;
    renderJourneyStep();
  }
}

// --- RENDERIZADORES DAS ETAPAS ---

function renderJourneyStep1() {
  return `
    <div class="journey-step-title">Escolha a Categoria</div>
    <div class="journey-cards-grid">
      ${CATEGORIES_DB.map(cat => `<button class="journey-card ${JourneyState.category === cat.id ? 'selected' : ''}" data-cat-id="${cat.id}"><div class="journey-card-icon"><i class="fas ${cat.icon}"></i></div><div class="journey-card-title">${cat.title}</div><div class="journey-card-desc">${cat.description}</div></button>`).join('')}
    </div>
    ${JourneyState.category ? `
      <div class="journey-step-title" style="margin-top:24px;">Escolha o Serviço</div>
      <div class="journey-cards-grid">
        ${CATEGORIES_DB.find(c=>c.id===JourneyState.category).subcategories.map(sub => `<button class="journey-card ${JourneyState.subcategory === sub.id ? 'selected' : ''}" data-sub-id="${sub.id}"><div class="journey-card-title">${sub.title}</div><div class="journey-card-desc">${sub.description}</div>${sub.priceRange ? `<div class="journey-card-price">${sub.priceRange}</div>` : ''}</button>`).join('')}
      </div>
    ` : ''}
  `;
}

function renderJourneyStep2() {
  const type = JourneyState.data.clientType || 'pf';
  return `
    <div class="journey-step-title">Identificação do Solicitante</div>
    <div class="journey-form-group">
      <label>Tipo de Solicitante *</label>
      <div class="journey-radio-group">
        <label class="journey-radio-option"><input type="radio" name="clientType" value="pf" ${type === 'pf' ? 'checked' : ''}><span>Pessoa Física</span></label>
        <label class="journey-radio-option"><input type="radio" name="clientType" value="pj" ${type === 'pj' ? 'checked' : ''}><span>Pessoa Jurídica</span></label>
      </div>
    </div>
    ${type === 'pf' ? `
      <div class="journey-form-group"><label>Nome Completo *</label><input type="text" class="journey-input" id="j_fullName" value="${JourneyState.data.fullName || ''}"></div>
    ` : `
      <div class="journey-form-group"><label>Nome da Empresa *</label><input type="text" class="journey-input" id="j_companyName" value="${JourneyState.data.companyName || ''}"></div>
      <div class="journey-form-group"><label>Nome do Responsável *</label><input type="text" class="journey-input" id="j_contactPerson" value="${JourneyState.data.contactPerson || ''}"></div>
      <div class="journey-form-group"><label>Segmento de Atuação</label><input type="text" class="journey-input" id="j_segment" value="${JourneyState.data.segment || ''}" placeholder="Ex: Varejo, Tecnologia"></div>
    `}
    <div class="journey-form-group"><label>E-mail para contato *</label><input type="email" class="journey-input" id="j_email" value="${JourneyState.data.email || ''}"></div>
    <div class="journey-form-group"><label>Telefone ou WhatsApp *</label><input type="tel" class="journey-input" id="j_phone" value="${JourneyState.data.phone || ''}"></div>
  `;
}

function renderJourneyStep3() {
  return `
    <div class="journey-step-title">Informações Gerais do Projeto</div>
    <div class="journey-form-group"><label>Nome do Projeto ou Ideia *</label><input type="text" class="journey-input" id="j_projectName" value="${JourneyState.data.projectName || ''}"></div>
    <div class="journey-form-group"><label>Descrição do Negócio ou Ideia *</label><textarea class="journey-textarea" id="j_businessDesc" rows="3">${JourneyState.data.businessDesc || ''}</textarea><span class="journey-hint">Não use termos técnicos. Explique como você ganha dinheiro ou qual problema resolve.</span></div>
    <div class="journey-form-group"><label>Público-Alvo</label><input type="text" class="journey-input" id="j_targetAudience" value="${JourneyState.data.targetAudience || ''}" placeholder="Ex: Jovens de 18-25 anos, pequenas empresas..."></div>
    <div class="journey-form-group"><label>Objetivo Principal</label>
      <select class="journey-input" id="j_mainObjective">
        <option value="">Selecione...</option>
        <option value="Captar clientes" ${JourneyState.data.mainObjective === 'Captar clientes' ? 'selected' : ''}>Captar clientes</option>
        <option value="Automatizar processos" ${JourneyState.data.mainObjective === 'Automatizar processos' ? 'selected' : ''}>Automatizar processos</option>
        <option value="Melhorar imagem" ${JourneyState.data.mainObjective === 'Melhorar imagem' ? 'selected' : ''}>Melhorar imagem</option>
        <option value="Vender produtos" ${JourneyState.data.mainObjective === 'Vender produtos' ? 'selected' : ''}>Vender produtos</option>
        <option value="Informar usuários" ${JourneyState.data.mainObjective === 'Informar usuários' ? 'selected' : ''}>Informar usuários</option>
        <option value="Outro" ${JourneyState.data.mainObjective === 'Outro' ? 'selected' : ''}>Outro</option>
      </select>
    </div>
  `;
}

function renderJourneyStep4() {
  let html = '<div class="journey-step-title">Detalhes Específicos</div>';
  if (JourneyState.category === 'sites') {
    html += `
      <div class="journey-form-group"><label>Quantas páginas/seções principais?</label><input type="number" class="journey-input" id="j_pagesNeeded" value="${JourneyState.data.pagesNeeded || ''}" min="1"></div>
      <div class="journey-form-group"><label>Já possui logotipo?</label><div class="journey-radio-group"><label class="journey-radio-option"><input type="radio" name="hasLogo" value="Sim" ${JourneyState.data.hasLogo === 'Sim' ? 'checked' : ''}><span>Sim</span></label><label class="journey-radio-option"><input type="radio" name="hasLogo" value="Não" ${JourneyState.data.hasLogo === 'Não' ? 'checked' : ''}><span>Não</span></label></div></div>
      <div class="journey-form-group"><label>Os textos estão prontos?</label><div class="journey-radio-group"><label class="journey-radio-option"><input type="radio" name="hasTexts" value="Sim" ${JourneyState.data.hasTexts === 'Sim' ? 'checked' : ''}><span>Sim</span></label><label class="journey-radio-option"><input type="radio" name="hasTexts" value="Preciso de ajuda" ${JourneyState.data.hasTexts === 'Preciso de ajuda' ? 'checked' : ''}><span>Preciso de ajuda</span></label></div></div>
      <div class="journey-form-group"><label>Referências de sites que gosta</label><input type="text" class="journey-input" id="j_references" value="${JourneyState.data.references || ''}" placeholder="Cole os links aqui"></div>
      <div class="journey-form-group"><label>Situação do Domínio/Hospedagem</label><select class="journey-input" id="j_domainStatus"><option value="">Selecione...</option><option value="Tenho ambos" ${JourneyState.data.domainStatus === 'Tenho ambos' ? 'selected' : ''}>Tenho ambos</option><option value="Tenho domínio" ${JourneyState.data.domainStatus === 'Tenho domínio' ? 'selected' : ''}>Tenho domínio</option><option value="Tenho hospedagem" ${JourneyState.data.domainStatus === 'Tenho hospedagem' ? 'selected' : ''}>Tenho hospedagem</option><option value="Preciso comprar tudo" ${JourneyState.data.domainStatus === 'Preciso comprar tudo' ? 'selected' : ''}>Preciso comprar tudo</option><option value="Não sei ainda" ${JourneyState.data.domainStatus === 'Não sei ainda' ? 'selected' : ''}>Não sei ainda</option></select></div>
    `;
  } else if (JourneyState.category === 'apps') {
    html += `
      <div class="journey-form-group"><label>Plataformas desejadas</label><div class="journey-checkbox-group"><label class="journey-checkbox-option"><input type="checkbox" data-parent="platforms" value="Android" ${JourneyState.data.platforms?.includes('Android') ? 'checked' : ''}><span>Android</span></label><label class="journey-checkbox-option"><input type="checkbox" data-parent="platforms" value="iOS" ${JourneyState.data.platforms?.includes('iOS') ? 'checked' : ''}><span>iOS</span></label><label class="journey-checkbox-option"><input type="checkbox" data-parent="platforms" value="Web" ${JourneyState.data.platforms?.includes('Web') ? 'checked' : ''}><span>Web</span></label></div></div>
      <div class="journey-form-group"><label>Precisa de cadastro e autenticação (login)?</label><div class="journey-radio-group"><label class="journey-radio-option"><input type="radio" name="authNeeded" value="Sim" ${JourneyState.data.authNeeded === 'Sim' ? 'checked' : ''}><span>Sim</span></label><label class="journey-radio-option"><input type="radio" name="authNeeded" value="Não" ${JourneyState.data.authNeeded === 'Não' ? 'checked' : ''}><span>Não</span></label></div></div>
      <div class="journey-form-group"><label>Precisa de painel administrativo?</label><div class="journey-radio-group"><label class="journey-radio-option"><input type="radio" name="adminPanel" value="Sim" ${JourneyState.data.adminPanel === 'Sim' ? 'checked' : ''}><span>Sim</span></label><label class="journey-radio-option"><input type="radio" name="adminPanel" value="Não" ${JourneyState.data.adminPanel === 'Não' ? 'checked' : ''}><span>Não</span></label></div></div>
    `;
  } else if (JourneyState.category === 'sistemas') {
    html += `
      <div class="journey-form-group"><label>Quantidade aproximada de usuários</label><input type="number" class="journey-input" id="j_usersCount" value="${JourneyState.data.usersCount || ''}"></div>
      <div class="journey-form-group"><label>Quais processos principais serão automatizados?</label><textarea class="journey-textarea" id="j_processes" rows="3">${JourneyState.data.processes || ''}</textarea></div>
      <div class="journey-form-group"><label>Precisa de integração com outros sistemas (ERP, CRM)?</label><div class="journey-radio-group"><label class="journey-radio-option"><input type="radio" name="integrations" value="Sim" ${JourneyState.data.integrations === 'Sim' ? 'checked' : ''}><span>Sim</span></label><label class="journey-radio-option"><input type="radio" name="integrations" value="Não" ${JourneyState.data.integrations === 'Não' ? 'checked' : ''}><span>Não</span></label></div></div>
    `;
  } else {
    html += `<p style="color:var(--text-muted); text-align:center; padding: 2rem;">Para este serviço, as informações gerais já são um ótimo ponto de partida. Sinta-se à vontade para adicionar detalhes na próxima etapa.</p>`;
  }
  return html;
}

function renderJourneyStep5() {
  return `
    <div class="journey-step-title">Identidade Visual e Materiais</div>
    <div class="journey-form-group"><label>Já possui identidade visual ou cores oficiais?</label><div class="journey-radio-group"><label class="journey-radio-option"><input type="radio" name="hasVisualId" value="Sim" ${JourneyState.data.hasVisualId === 'Sim' ? 'checked' : ''}><span>Sim</span></label><label class="journey-radio-option"><input type="radio" name="hasVisualId" value="Não" ${JourneyState.data.hasVisualId === 'Não' ? 'checked' : ''}><span>Não</span></label></div></div>
    <div class="journey-form-group"><label>Possui imagens, textos ou documentos prontos?</label><div class="journey-radio-group"><label class="journey-radio-option"><input type="radio" name="hasMaterials" value="Sim" ${JourneyState.data.hasMaterials === 'Sim' ? 'checked' : ''}><span>Sim</span></label><label class="journey-radio-option"><input type="radio" name="hasMaterials" value="Parcialmente" ${JourneyState.data.hasMaterials === 'Parcialmente' ? 'checked' : ''}><span>Parcialmente</span></label><label class="journey-radio-option"><input type="radio" name="hasMaterials" value="Não" ${JourneyState.data.hasMaterials === 'Não' ? 'checked' : ''}><span>Não</span></label></div></div>
    <div class="journey-form-group"><label>Referências visuais ou de estilo</label><textarea class="journey-textarea" id="j_referencesVisual" rows="3" placeholder="Descreva o estilo desejado ou cole links de referência...">${JourneyState.data.referencesVisual || ''}</textarea></div>
    
    <div style="margin-top: 24px;">
      <div class="journey-upload-area" id="journeyUploadArea">
        <i class="fas fa-cloud-upload-alt journey-upload-icon"></i>
        <p>Anexe imagens ou documentos de referência (opcional)</p>
        <span class="journey-formats">JPEG, PNG, PDF · máx. 5 MB</span>
        <input type="file" id="journeyFileInput" class="file-input-hidden" accept=".jpg,.jpeg,.png,.pdf">
      </div>
      <div id="journeyUploadPreview" class="journey-upload-preview">
        <img id="journeyPreviewImg" src="" alt="Preview">
        <div class="journey-upload-preview-info">
          <div class="journey-filename" id="journeyPreviewFilename"></div>
          <div class="journey-filesize" id="journeyPreviewFilesize"></div>
        </div>
        <button class="btn-remove-file" id="journeyRemoveFileBtn"><i class="fas fa-times"></i></button>
      </div>
      <div id="journeyFileError" class="journey-field-error" style="margin-top:8px;"></div>
    </div>
  `;
}

function renderJourneyStep6() {
  return `
    <div class="journey-step-title">Prazos e Infraestrutura</div>
    <div class="journey-form-group"><label>Data desejada para conclusão (opcional)</label><input type="date" class="journey-input" id="j_deadlineDate" value="${JourneyState.data.deadlineDate || ''}"></div>
    <div class="journey-form-group"><label>O prazo é flexível?</label><div class="journey-radio-group"><label class="journey-radio-option"><input type="radio" name="flexibleDeadline" value="Sim" ${JourneyState.data.flexibleDeadline === 'Sim' ? 'checked' : ''}><span>Sim, tenho flexibilidade</span></label><label class="journey-radio-option"><input type="radio" name="flexibleDeadline" value="Não" ${JourneyState.data.flexibleDeadline === 'Não' ? 'checked' : ''}><span>Não, é uma data crítica</span></label></div></div>
    <div class="journey-form-group"><label>Possui infraestrutura já contratada (servidor, domínio, etc.)?</label><select class="journey-input" id="j_hostingStatus"><option value="">Selecione...</option><option value="Sim, tenho tudo" ${JourneyState.data.hostingStatus === 'Sim, tenho tudo' ? 'selected' : ''}>Sim, tenho tudo</option><option value="Tenho apenas o domínio" ${JourneyState.data.hostingStatus === 'Tenho apenas o domínio' ? 'selected' : ''}>Tenho apenas o domínio</option><option value="Não, preciso de orientação" ${JourneyState.data.hostingStatus === 'Não, preciso de orientação' ? 'selected' : ''}>Não, preciso de orientação</option></select></div>
  `;
}

function renderJourneyStep7() {
  return `
    <div class="journey-step-title">Condições Comerciais</div>
    <div class="journey-form-group"><label>Faixa de investimento prevista</label><select class="journey-input" id="j_budgetExpectation"><option value="">Selecione...</option><option value="Até R$ 5k" ${JourneyState.data.budgetExpectation === 'Até R$ 5k' ? 'selected' : ''}>Até R$ 5.000</option><option value="R$ 5k - 15k" ${JourneyState.data.budgetExpectation === 'R$ 5k - 15k' ? 'selected' : ''}>R$ 5.000 – 15.000</option><option value="R$ 15k - 30k" ${JourneyState.data.budgetExpectation === 'R$ 15k - 30k' ? 'selected' : ''}>R$ 15.000 – 30.000</option><option value="Acima de R$ 30k" ${JourneyState.data.budgetExpectation === 'Acima de R$ 30k' ? 'selected' : ''}>Acima de R$ 30.000</option><option value="Ainda não definido" ${JourneyState.data.budgetExpectation === 'Ainda não definido' ? 'selected' : ''}>Ainda não definido</option></select></div>
    <div class="journey-form-group"><label>Preferência de Pagamento da Produção</label><div class="journey-radio-group"><label class="journey-radio-option"><input type="radio" name="paymentPreference" value="À vista" ${JourneyState.data.paymentPreference === 'À vista' ? 'checked' : ''}><span>À Vista (com desconto negociável)</span></label><label class="journey-radio-option"><input type="radio" name="paymentPreference" value="Parcelado" ${JourneyState.data.paymentPreference === 'Parcelado' ? 'checked' : ''}><span>Parcelado (conforme proposta)</span></label></div></div>
    <div class="journey-form-group"><label>Preferência de Manutenção</label><div class="journey-radio-group"><label class="journey-radio-option"><input type="radio" name="maintenancePreference" value="Mensal" ${JourneyState.data.maintenancePreference === 'Mensal' ? 'checked' : ''}><span>Plano Mensal</span></label><label class="journey-radio-option"><input type="radio" name="maintenancePreference" value="Anual" ${JourneyState.data.maintenancePreference === 'Anual' ? 'checked' : ''}><span>Plano Anual (com desconto)</span></label><label class="journey-radio-option"><input type="radio" name="maintenancePreference" value="Nenhuma no momento" ${JourneyState.data.maintenancePreference === 'Nenhuma no momento' ? 'checked' : ''}><span>Nenhuma no momento</span></label></div></div>
  `;
}

function renderJourneyStep8() {
  const cat = getJourneyCategory(), sub = getJourneySubcategory();
  const d = JourneyState.data;
  
  let briefing = `--- DADOS DO SOLICITANTE ---\n`;
  briefing += `Tipo: ${d.clientType === 'pj' ? 'Pessoa Jurídica' : 'Pessoa Física'}\n`;
  if (d.clientType === 'pj') { briefing += `Empresa: ${d.companyName || 'N/A'}\nResponsável: ${d.contactPerson || 'N/A'}\nSegmento: ${d.segment || 'N/A'}\n`; } 
  else { briefing += `Nome: ${d.fullName || 'N/A'}\n`; }
  briefing += `Contato: ${d.email || 'N/A'} | ${d.phone || 'N/A'}\n\n`;

  briefing += `--- CONTEXTO DO PROJETO ---\n`;
  briefing += `Serviço: ${cat ? cat.title : '-'} > ${sub ? sub.title : '-'}\n`;
  briefing += `Projeto: ${d.projectName || 'N/A'}\n`;
  briefing += `Descrição: ${d.businessDesc || 'N/A'}\n`;
  briefing += `Público: ${d.targetAudience || 'N/A'}\n`;
  briefing += `Objetivo: ${d.mainObjective || 'N/A'}\n\n`;

  briefing += `--- DETALHES ESPECÍFICOS ---\n`;
  if (JourneyState.category === 'sites') {
    briefing += `Páginas: ${d.pagesNeeded || 'N/A'} | Logo: ${d.hasLogo || 'N/A'} | Textos: ${d.hasTexts || 'N/A'}\nDomínio/Hospedagem: ${d.domainStatus || 'N/A'}\nReferências: ${d.references || 'N/A'}\n`;
  } else if (JourneyState.category === 'apps') {
    briefing += `Plataformas: ${Array.isArray(d.platforms) ? d.platforms.join(', ') : 'N/A'}\nLogin: ${d.authNeeded || 'N/A'} | Painel Admin: ${d.adminPanel || 'N/A'}\n`;
  } else if (JourneyState.category === 'sistemas') {
    briefing += `Usuários: ${d.usersCount || 'N/A'}\nProcessos: ${d.processes || 'N/A'}\nIntegrações: ${d.integrations || 'N/A'}\n`;
  }

  briefing += `\n--- MATERIAIS E PRAZOS ---\n`;
  briefing += `Identidade Visual: ${d.hasVisualId || 'N/A'} | Materiais Prontos: ${d.hasMaterials || 'N/A'}\n`;
  briefing += `Referências Visuais: ${d.referencesVisual || 'N/A'}\n`;
  briefing += `Prazo Desejado: ${d.deadlineDate || 'Flexível'} (Flexível: ${d.flexibleDeadline || 'N/A'})\n`;
  briefing += `Infraestrutura: ${d.hostingStatus || 'N/A'}\n\n`;

  briefing += `--- CONDIÇÕES COMERCIAIS ---\n`;
  briefing += `Investimento Previsto: ${d.budgetExpectation || 'N/A'}\n`;
  briefing += `Pagamento: ${d.paymentPreference || 'N/A'}\n`;
  briefing += `Manutenção: ${d.maintenancePreference || 'N/A'}\n`;

  // Salva o briefing consolidado no estado para envio
  JourneyState.data._consolidatedBriefing = briefing;

  return `
    <div class="journey-step-title">Revisão Final</div>
    <p class="journey-step-desc">Confira o resumo do seu briefing. Você pode voltar para ajustar qualquer informação.</p>
    <div class="journey-review">
      <div class="journey-review-item"><div class="journey-review-label">Solicitante</div><div class="journey-review-value">${d.clientType === 'pj' ? (d.companyName || 'PJ') : (d.fullName || 'PF')}</div></div>
      <div class="journey-review-item"><div class="journey-review-label">Contato</div><div class="journey-review-value">${d.email || '-'} / ${d.phone || '-'}</div></div>
      <div class="journey-review-item"><div class="journey-review-label">Serviço</div><div class="journey-review-value">${cat ? cat.title : '-'} > ${sub ? sub.title : '-'}</div></div>
      <div class="journey-review-item"><div class="journey-review-label">Projeto</div><div class="journey-review-value">${d.projectName || '-'}</div></div>
      <div class="journey-review-item"><div class="journey-review-label">Investimento Previsto</div><div class="journey-review-value">${d.budgetExpectation || 'Não definido'}</div></div>
      <div class="journey-review-item"><div class="journey-review-label">Pagamento</div><div class="journey-review-value">${d.paymentPreference || '-'}</div></div>
      ${JourneyState.file ? `<div class="journey-review-item"><div class="journey-review-label">Anexo</div><div class="journey-review-value">${JourneyState.file.name}</div></div>` : ''}
    </div>
    <div class="journey-external-notice">
      <i class="fas fa-circle-info"></i>
      <p>Os valores e prazos são referências. O orçamento definitivo será elaborado após a análise técnica deste briefing.</p>
    </div>
  `;
}

function renderJourneyStep() {
  const container = document.getElementById('journeyContentArea');
  if (!container) return;

  const totalSteps = 8;
  const progress = ((JourneyState.step) / totalSteps) * 100;
  const fill = document.getElementById('journeyProgressFill'), text = document.getElementById('journeyProgressText');
  if (fill) fill.style.width = `${progress}%`;
  if (text) text.textContent = `Etapa ${JourneyState.step} de ${totalSteps}`;

  const assistant = document.getElementById('journeyAssistantText');
  if (assistant) {
    assistant.textContent = ASSISTANT_MESSAGES[JourneyState.step] || '';
    assistant.classList.remove('journey-assistant-bubble-alert');
  }

  let html = '';
  if (JourneyState.step === 1) html = renderJourneyStep1();
  else if (JourneyState.step === 2) html = renderJourneyStep2();
  else if (JourneyState.step === 3) html = renderJourneyStep3();
  else if (JourneyState.step === 4) html = renderJourneyStep4();
  else if (JourneyState.step === 5) html = renderJourneyStep5();
  else if (JourneyState.step === 6) html = renderJourneyStep6();
  else if (JourneyState.step === 7) html = renderJourneyStep7();
  else if (JourneyState.step === 8) html = renderJourneyStep8();

  container.innerHTML = html;
  bindJourneyInputs();

  const backBtn = document.getElementById('journeyBackBtn'), nextBtn = document.getElementById('journeyNextBtn');
  if (backBtn) backBtn.style.display = JourneyState.step > 1 ? '' : 'none';
  if (nextBtn) {
    if (JourneyState.step === 8) nextBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Solicitação';
    else nextBtn.innerHTML = 'Continuar <i class="fas fa-arrow-right"></i>';
  }
}

function bindJourneyInputs() {
  document.querySelectorAll('.journey-radio-group input[type="radio"]').forEach(input => {
    input.addEventListener('change', (e) => {
      JourneyState.data[e.target.name] = e.target.value;
      // Re-render apenas se for clientType para mostrar/esconder campos condicionais
      if (e.target.name === 'clientType') renderJourneyStep();
    });
  });

  document.querySelectorAll('.journey-input, .journey-textarea').forEach(input => {
    input.addEventListener('input', (e) => {
      JourneyState.data[e.target.id.replace('j_', '')] = e.target.value;
    });
  });

  document.querySelectorAll('.journey-checkbox-group input[type="checkbox"]').forEach(input => {
    input.addEventListener('change', (e) => {
      const name = e.target.dataset.parent;
      if (!JourneyState.data[name]) JourneyState.data[name] = [];
      if (e.target.checked) JourneyState.data[name].push(e.target.value);
      else JourneyState.data[name] = JourneyState.data[name].filter(v => v !== e.target.value);
    });
  });
}

function handleJourneyFileSelect(file) {
  const errorEl = document.getElementById('journeyFileError');
  errorEl.classList.remove('visible');
  if (!ALLOWED_TYPES.includes(file.type) && file.type !== 'application/pdf') {
    errorEl.innerHTML = '<i class="fas fa-circle-exclamation"></i> Formato inválido. Envie JPEG, PNG ou PDF.';
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
  reader.onload = (e) => { document.getElementById('journeyPreviewImg').src = e.target.result; };
  reader.readAsDataURL(file);
  document.getElementById('journeyPreviewFilename').textContent = file.name;
  document.getElementById('journeyPreviewFilesize').textContent = formatFileSize(file.size);
  document.getElementById('journeyUploadArea').style.display = 'none';
  document.getElementById('journeyUploadPreview').classList.add('visible');
}

function setupJourneyUpload() {
  const uploadArea = document.getElementById('journeyUploadArea'), fileInput = document.getElementById('journeyFileInput'), removeBtn = document.getElementById('journeyRemoveFileBtn');
  if (!uploadArea || !fileInput || !removeBtn) return;
  uploadArea.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => { if (e.target.files && e.target.files.length > 0) handleJourneyFileSelect(e.target.files[0]); });
  removeBtn.addEventListener('click', () => { JourneyState.file = null; resetJourneyFile(); fileInput.value = ''; });
  uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.style.borderColor = 'var(--primary)'; });
  uploadArea.addEventListener('dragleave', () => { uploadArea.style.borderColor = ''; });
  uploadArea.addEventListener('drop', (e) => { e.preventDefault(); uploadArea.style.borderColor = ''; if (e.dataTransfer.files && e.dataTransfer.files.length > 0) handleJourneyFileSelect(e.dataTransfer.files[0]); });
}

async function submitJourney() {
  const submitFeedback = document.getElementById('journeySubmitFeedback'), nextBtn = document.getElementById('journeyNextBtn');
  const cat = getJourneyCategory(), sub = getJourneySubcategory();
  const d = JourneyState.data;

  nextBtn.disabled = true;
  const originalBtnHtml = nextBtn.innerHTML;
  nextBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
  submitFeedback.classList.remove('visible', 'success', 'error');

  const formData = new FormData();
  formData.append('_gotcha', '');

  // Dados do remetente (Forminit nativo)
  formData.append('fi-sender-fullName', d.clientType === 'pj' ? (d.contactPerson || 'Responsável') : (d.fullName || 'Cliente'));
  formData.append('fi-sender-email', d.email || 'nao-informado@exemplo.com');
  formData.append('fi-sender-phone', d.phone || 'Não informado');

  // Campos de texto padrão
  formData.append('fi-text-title', d.projectName || 'Solicitação de Orçamento');
  formData.append('fi-text-requestType', `${cat ? cat.title : 'Geral'} > ${sub ? sub.title : 'Serviço'}`);
  formData.append('fi-text-category', cat ? cat.title : 'N/A');
  formData.append('fi-text-subcategory', sub ? sub.title : 'N/A');
  
  // Briefing consolidado e estruturado (garante que todas as respostas cheguem organizadas)
  formData.append('fi-text-projectDescription', d._consolidatedBriefing || 'Briefing não gerado.');
  
  formData.append('fi-text-productionPayment', d.paymentPreference || 'N/A');
  formData.append('fi-text-maintenancePreference', d.maintenancePreference || 'N/A');

  if (JourneyState.file) {
    formData.append('fi-file-attachment', JourneyState.file, JourneyState.file.name);
  }

  try {
    const response = await fetch(FORMINIT_ENDPOINT, { method: 'POST', body: formData });

    if (response.ok) {
      submitFeedback.className = 'journey-submit-feedback success visible';
      submitFeedback.innerHTML = '<i class="fas fa-circle-check"></i> Solicitação enviada com sucesso! A FGP Technologies recebeu seu pedido e poderá entrar em contato para dar continuidade à análise.';
      submitFeedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        const modal = dom.journeyModal();
        if (modal) { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); }
        document.body.style.overflow = '';
        resetJourneyState();
      }, 4000);
    } else {
      let errorMsg = 'Falha no envio. Tente novamente.';
      try {
        const errData = await response.json();
        errorMsg = errData.message || errorMsg;
      } catch (jsonErr) {
        console.error('Erro ao parsear resposta do Forminit:', jsonErr);
        errorMsg = response.statusText || errorMsg;
      }
      throw new Error(errorMsg);
    }
  } catch (error) {
    console.error('Erro no envio da jornada:', error);
    submitFeedback.className = 'journey-submit-feedback error visible';
    submitFeedback.innerHTML = `<i class="fas fa-circle-exclamation"></i> Não foi possível enviar sua solicitação. Seus dados foram preservados. Verifique sua conexão e tente novamente.`;
    submitFeedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } finally {
    nextBtn.disabled = false;
    nextBtn.innerHTML = originalBtnHtml;
  }
}

function setupJourney() {
  document.getElementById('heroStartBtn')?.addEventListener('click', openJourney);
  document.getElementById('sideMenuStartBtn')?.addEventListener('click', (e) => { e.preventDefault(); closeSideMenu(); openJourney(); });
  document.getElementById('journeyNextBtn')?.addEventListener('click', handleJourneyNext);
  document.getElementById('journeyBackBtn')?.addEventListener('click', handleJourneyBack);
  document.getElementById('closeJourneyBtn')?.addEventListener('click', closeJourneyWithConfirm);
  
  const journeyModal = dom.journeyModal();
  if (journeyModal) journeyModal.addEventListener('click', (e) => { if (e.target === journeyModal) closeJourneyWithConfirm(); });
  
  setupJourneyUpload();
}

/* ============================================================
10. INICIALIZAÇÃO
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
  renderCategories();
  showLevel(1);
});
