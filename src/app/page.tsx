import Link from 'next/link';
import CheckoutButton from '@/components/CheckoutButton';
import './landing.css';

const features = [
  {
    tag: 'IA Generativa',
    icon: '🧠',
    title: 'Propostas que convencem',
    desc: 'Nossa IA combina análise de mercado com técnicas de copywriting profissional para criar propostas que geram respostas reais dos clientes.',
  },
  {
    tag: 'Velocidade',
    icon: '⚡',
    title: 'De zero a proposta em 60 segundos',
    desc: 'Chega de horas perdidas formatando. Preencha os dados do projeto e receba um documento profissional instantaneamente.',
  },
  {
    tag: 'Design',
    icon: '🎨',
    title: 'Apresentação de primeira linha',
    desc: 'Templates desenvolvidos para impressionar. Cada proposta exportada em PDF com diagramação limpa e hierarquia visual impecável.',
  },
  {
    tag: 'Segurança',
    icon: '🔐',
    title: 'Seus dados são seus',
    desc: 'Criptografia de ponta a ponta em todos os documentos. Seus projetos e informações nunca são compartilhados ou usados para treinamento.',
  },
];

const howItWorks = [
  {
    num: '01',
    title: 'Descreva o projeto',
    desc: 'Preencha informações básicas: cliente, escopo, prazo e objetivos. O formulário inteligente sugere campos com base no tipo de serviço.',
  },
  {
    num: '02',
    title: 'A IA entra em ação',
    desc: 'Nosso motor de IA processa o contexto, aplica técnicas de persuasão comprovadas e estrutura a narrativa comercial ideal para o seu caso.',
  },
  {
    num: '03',
    title: 'Revise e personalize',
    desc: 'A proposta é gerada em segundos. Ajuste qualquer detalhe, adicione seu branding e configure o tom de voz conforme o perfil do cliente.',
  },
  {
    num: '04',
    title: 'Envie e feche negócio',
    desc: 'Exporte em PDF profissional ou compartilhe via link rastreável. Saiba quando o cliente abrir e acompanhe o status em tempo real.',
  },
];

const testimonials = [
  {
    stars: '★★★★★',
    text: 'Tripliquei minha taxa de fechamento no primeiro mês. Antes perdia 4 horas por proposta. Agora levo 5 minutos e o resultado é profissionalmente superior.',
    name: 'Ricardo Assunção',
    role: 'Desenvolvedor Full Stack',
    initial: 'RA',
  },
  {
    stars: '★★★★★',
    text: 'Meus clientes sempre comentam que a proposta deles foi a mais bem preparada que receberam. O PropostaAI mudou como eu sou percebido no mercado.',
    name: 'Camila Torres',
    role: 'UX Designer & Consultora',
    initial: 'CT',
  },
  {
    stars: '★★★★★',
    text: 'Para uma agência com múltiplos clientes simultâneos, a agilidade é vital. Eliminamos o gargalo de propostas e aumentamos nossa capacidade em 60%.',
    name: 'Fernando Queiroz',
    role: 'Fundador, Agência Queiroz',
    initial: 'FQ',
  },
  {
    stars: '★★★★★',
    text: 'A IA entende o contexto do projeto de um jeito que parece que alguém do setor escreveu. Não parece um robô, parece um sócio estratégico.',
    name: 'Mariana Lins',
    role: 'Consultora de Marketing',
    initial: 'ML',
  },
];

export default function Home() {
  return (
    <div className="lp-wrap">
      {/* ── NAV ── */}
      <nav className="lp-nav">
        <div className="lp-nav__inner">
          <div className="lp-nav__logo">
            <div className="lp-nav__logo-mark">P</div>
            PropostaAI
          </div>
          <div className="lp-nav__links">
            <Link href="#features" className="lp-nav__link">Recursos</Link>
            <Link href="#como-funciona" className="lp-nav__link">Como funciona</Link>
            <Link href="#pricing" className="lp-nav__link">Planos</Link>
            <Link href="#depoimentos" className="lp-nav__link">Clientes</Link>
          </div>
          <div className="lp-nav__actions">
            <Link href="/login" className="btn btn--ghost">Entrar</Link>
            <Link href="/login" className="btn btn--primary">Começar grátis</Link>
          </div>
        </div>
      </nav>

      <main>
        {/* ── HERO ── */}
        <section className="lp-hero">
          <div className="lp-container">
            <div className="lp-hero__eyebrow anim-fade-up">
              <span className="lp-hero__eyebrow-dot"></span>
              Motor de Propostas com IA — v2.0
            </div>
            <h1 className="lp-hero__title anim-fade-up delay-1">
              Feche mais negócios com propostas{' '}
              <em>irrecusáveis.</em>
            </h1>
            <p className="lp-hero__sub anim-fade-up delay-2">
              O único sistema que combina inteligência artificial com princípios de persuasão profissional para transformar seus dados em documentos comerciais que convertem.
            </p>
            <div className="lp-hero__cta anim-fade-up delay-3">
              <Link href="/login" className="btn btn--primary btn--large">
                Criar minha primeira proposta
              </Link>
              <Link href="#como-funciona" className="btn btn--outline btn--large">
                Ver como funciona
              </Link>
            </div>

            <div className="lp-hero__stats anim-fade-up delay-4">
              <div className="lp-hero__stat-item">
                <div className="lp-hero__stat-value">+15k</div>
                <div className="lp-hero__stat-label">Propostas geradas</div>
              </div>
              <div className="lp-hero__stat-item">
                <div className="lp-hero__stat-value">98%</div>
                <div className="lp-hero__stat-label">Aprovação dos usuários</div>
              </div>
              <div className="lp-hero__stat-item">
                <div className="lp-hero__stat-value">60s</div>
                <div className="lp-hero__stat-label">Tempo médio de geração</div>
              </div>
              <div className="lp-hero__stat-item">
                <div className="lp-hero__stat-value">R$ 5M+</div>
                <div className="lp-hero__stat-label">Em contratos fechados</div>
              </div>
            </div>

            {/* Real dashboard screenshot */}
            <div className="lp-hero__preview anim-fade-up delay-5">
              <div className="lp-hero__dashboard-img-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/dashboard-preview.png"
                  alt="PropostaAI — Painel de Gestão de Propostas"
                  className="lp-hero__dashboard-img"
                  width={1200}
                  height={675}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── LOGOS ── */}
        <div className="lp-logos">
          <div className="lp-container">
            <span className="lp-logos__label">Utilizado por profissionais e agências em todo o Brasil</span>
            <div className="lp-logos__row">
              {['Freelancers', 'Agências Digitais', 'Consultorias', 'Designers', 'Devs Solo', 'Startups'].map((l) => (
                <span key={l} className="lp-logo-item">{l}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── FEATURES ── */}
        <section id="features" className="lp-section">
          <div className="lp-container">
            <span className="section-label">Funcionalidades</span>
            <h2 className="section-title">Cada detalhe foi pensado<br />para que você feche mais.</h2>
            <p className="section-sub" style={{ marginBottom: '4rem' }}>
              Recursos desenvolvidos para profissionais que entendem que a qualidade de uma proposta define o resultado de uma negociação.
            </p>

            <div className="features-grid">
              {features.map((f) => (
                <div key={f.title} className="feature-cell">
                  <div className="feature-cell__tag">{f.tag}</div>
                  <span className="feature-cell__icon">{f.icon}</span>
                  <h3 className="feature-cell__title">{f.title}</h3>
                  <p className="feature-cell__desc">{f.desc}</p>
                </div>
              ))}

              <div className="feature-cell feature-cell--wide">
                <div>
                  <div className="feature-cell__tag">Rastreamento</div>
                  <h3 className="feature-cell__title" style={{ fontSize: '2rem', lineHeight: 1.1, marginBottom: '1.5rem' }}>
                    Saiba exatamente quando o cliente abre sua proposta.
                  </h3>
                  <p className="feature-cell__desc">
                    Links de proposta com rastreamento integrado. Você recebe uma notificação em tempo real quando o cliente visualiza o documento, permitindo fazer o follow-up no momento certo.
                  </p>
                </div>
                <div style={{ background: 'var(--c-black)', border: '1px solid var(--c-border)', borderRadius: '8px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {['Proposta - Novo Site E-commerce', 'Projeto Branding Completo Q1', 'Consultoria de Produto — Mar'].map((item, i) => (
                    <div key={item} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--c-border)', borderRadius: '4px' }}>
                      <span style={{ fontSize: '0.85rem' }}>{item}</span>
                      <span style={{ fontFamily: 'var(--f-mono)', fontSize: '0.7rem', color: i === 0 ? 'var(--c-green)' : 'var(--c-zinc)', background: i === 0 ? 'var(--c-green-dim)' : 'transparent', padding: '2px 8px', borderRadius: '2px' }}>
                        {i === 0 ? 'ABERTA AGORA' : i === 1 ? 'ENVIADA' : 'APROVADA'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="como-funciona" className="lp-section lp-section--alt">
          <div className="lp-container">
            <span className="section-label">Processo</span>
            <h2 className="section-title">Do briefing ao contrato<br />em menos de dois minutos.</h2>
            <p className="section-sub" style={{ marginBottom: '5rem' }}>
              Um workflow linear e sem fricção, do preenchimento dos dados até o documento final pronto para envio.
            </p>
            <div className="how-list">
              {howItWorks.map((step) => (
                <div key={step.num} className="how-item">
                  <span className="how-item__num">{step.num}</span>
                  <div>
                    <h3 className="how-item__title">{step.title}</h3>
                    <p className="how-item__desc">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="pricing" className="lp-section">
          <div className="lp-container">
            <span className="section-label">Planos</span>
            <h2 className="section-title">Investimento que se paga<br />na primeira proposta fechada.</h2>
            <p className="section-sub" style={{ marginBottom: '4rem' }}>
              Sem taxas por proposta. Sem limites escondidos. Pague uma vez e tenha acesso completo.
            </p>

            <div className="pricing-grid">
              <div className="price-col">
                <div className="price-col__name">Basic</div>
                <div className="price-col__amount">R$ 0</div>
                <div className="price-col__period">Para sempre gratuito</div>
                <ul className="price-col__features">
                  <li>3 propostas por mês</li>
                  <li>Motor IA padrão</li>
                  <li>Exportação PDF</li>
                  <li>Suporte via email</li>
                </ul>
                <Link href="/login" className="btn btn--outline" style={{ width: '100%', justifyContent: 'center' }}>
                  Começar grátis
                </Link>
              </div>

              <div className="price-col price-col--featured">
                <div className="price-col__name">Profissional</div>
                <div className="price-col__amount">R$ 97</div>
                <div className="price-col__period">por mês — cancele quando quiser</div>
                <ul className="price-col__features">
                  <li>Propostas ilimitadas</li>
                  <li>Motor IA de alta conversão</li>
                  <li>Rastreamento em tempo real</li>
                  <li>Branding customizado</li>
                  <li>Análise de ROI integrada</li>
                  <li>Suporte prioritário</li>
                </ul>
                <CheckoutButton priceId={process.env.STRIPE_PRICE_PROFESSIONAL || ''} className="btn btn--primary">
                  Assinar agora
                </CheckoutButton>
              </div>

              <div className="price-col">
                <div className="price-col__name">Agência</div>
                <div className="price-col__amount">R$ 197</div>
                <div className="price-col__period">por mês — até 5 usuários</div>
                <ul className="price-col__features">
                  <li>Tudo do Profissional</li>
                  <li>5 usuários incluídos</li>
                  <li>IA treinada no seu nicho</li>
                  <li>Templates exclusivos</li>
                  <li>Relatórios de equipe</li>
                  <li>Gerente de conta dedicado</li>
                </ul>
                <CheckoutButton priceId={process.env.STRIPE_PRICE_AGENCY || ''} className="btn btn--outline">
                  Assinar plano Agência
                </CheckoutButton>
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section id="depoimentos" className="lp-section lp-section--alt">
          <div className="lp-container">
            <span className="section-label">Depoimentos</span>
            <h2 className="section-title" style={{ marginBottom: '4rem' }}>
              O que dizem aqueles<br />que fecharam o negócio.
            </h2>
            <div className="testimonial-grid">
              {testimonials.map((t) => (
                <div key={t.name} className="testimonial-card">
                  <div className="testimonial-card__stars">{t.stars}</div>
                  <p className="testimonial-card__text">{`"${t.text}"`}</p>
                  <div className="testimonial-card__author">
                    <div className="testimonial-card__avatar">{t.initial}</div>
                    <div>
                      <div className="testimonial-card__name">{t.name}</div>
                      <div className="testimonial-card__role">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="lp-cta">
          <div className="lp-container">
            <h2 className="lp-cta__title">
              Sua próxima proposta<br />
              <em style={{ color: 'var(--c-green)' }}>começa aqui.</em>
            </h2>
            <p className="lp-cta__sub">
              Crie sua conta grátis em 30 segundos. Sem cartão de crédito.
            </p>
            <Link href="/login" className="btn btn--primary btn--large">
              Criar conta gratuita agora
            </Link>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-footer__grid">
            <div>
              <div className="lp-footer__brand-name">
                <div className="lp-nav__logo-mark" style={{ animation: 'none' }}>P</div>
                PropostaAI
              </div>
              <p className="lp-footer__tagline">
                O motor de inteligência artificial que transforma freelancers e agências em máquinas de fechar negócios.
              </p>
            </div>
            <div>
              <div className="lp-footer__col-title">Produto</div>
              <Link href="#features" className="lp-footer__col-link">Recursos</Link>
              <Link href="#pricing" className="lp-footer__col-link">Planos</Link>
              <Link href="#como-funciona" className="lp-footer__col-link">Como funciona</Link>
              <Link href="#" className="lp-footer__col-link">Changelog</Link>
            </div>
            <div>
              <div className="lp-footer__col-title">Empresa</div>
              <Link href="#" className="lp-footer__col-link">Sobre</Link>
              <Link href="#" className="lp-footer__col-link">Blog</Link>
              <Link href="#" className="lp-footer__col-link">Carreiras</Link>
              <Link href="#" className="lp-footer__col-link">Contato</Link>
            </div>
            <div>
              <div className="lp-footer__col-title">Legal</div>
              <Link href="#" className="lp-footer__col-link">Privacidade</Link>
              <Link href="#" className="lp-footer__col-link">Termos</Link>
              <Link href="#" className="lp-footer__col-link">Cookies</Link>
              <Link href="#" className="lp-footer__col-link">LGPD</Link>
            </div>
          </div>
          <div className="lp-footer__bottom">
            <span>© 2026 PropostaAI. Todos os direitos reservados.</span>
            <span style={{ fontFamily: 'var(--f-mono)', fontSize: '0.7rem' }}>
              Powered by Gemini AI
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
