import { Link } from 'react-router-dom';

const workflows = [
  {
    title: 'Hear more clearly',
    copy: 'Use the hearing test and tone generator together for quick checks, frequency comparisons, and simple listening experiments.',
  },
  {
    title: 'Relax with purpose',
    copy: 'Move from sleep frequencies into the frequency guide to understand what different ranges are typically used for.',
  },
  {
    title: 'Explore practical tools',
    copy: 'Calculators, motion sketches, and bubble-based interactions turn the project into a broader utility and demo lab.',
  },
];

const differentiators = [
  'Simple public pages with no signup friction',
  'Tone tools, hearing checks, and utility pages in one place',
  'Consistent blue palette and Ubuntu typography across the whole project',
  'Light, dark, and system color mode support',
];

const featureCards = [
  {
    eyebrow: 'Core tool',
    title: 'Hearing Test',
    copy: 'Run a straightforward browser-based hearing check and review practical guidance without getting buried in extra complexity.',
    href: '/hearing-test',
    cta: 'Open hearing test',
  },
  {
    eyebrow: 'Core tool',
    title: 'Tone Generator',
    copy: 'Generate simple tones fast for speaker checks, frequency testing, and quick audio experiments.',
    href: '/tone-generator',
    cta: 'Open tone generator',
  },
  {
    eyebrow: 'Popular page',
    title: 'Sleep Frequencies',
    copy: 'Use curated frequency presets and supporting explanations for relaxation-oriented listening sessions.',
    href: '/sleep-frequencies',
    cta: 'Open sleep frequencies',
  },
  {
    eyebrow: 'Utility hub',
    title: 'Calculator Lab',
    copy: 'Browse the expanding calculator collection without leaving the project’s shared design system.',
    href: '/calculators',
    cta: 'Open calculators',
  },
];

const faqs = [
  {
    question: 'What is Audionyx in this version of the site?',
    answer:
      'It is a browser-based collection of hearing tools, frequency education pages, calculators, and interactive demos presented in a cleaner product-style layout.',
  },
  {
    question: 'How is this different from the live Audionyx app site?',
    answer:
      'This project keeps the same simple section flow and content rhythm, but adapts it for your web tools instead of the mobile transcription product.',
  },
  {
    question: 'Who is this site useful for?',
    answer:
      'People testing speakers, checking hearing ranges, exploring tone frequencies, or browsing utility tools without needing a complicated dashboard.',
  },
];

export default function HomePage() {
  return (
    <div className="home-shell">
      <section className="home-hero">
        <div className="home-hero-copy">
          <p className="home-eyebrow">Audionyx online tools</p>
          <h2>Simple online sound tools with a cleaner product-site flow.</h2>
          <p className="home-summary">
            Explore hearing checks, tone generation, sleep frequencies, calculators, and interactive pages
            in a redesigned experience inspired by the structure of the live Audionyx site while keeping
            this project’s own blue palette and typography.
          </p>
          <div className="home-actions">
            <Link className="button-link" to="/hearing-test">Try hearing test</Link>
            <Link className="button-link ghost-button" to="/tone-generator">Open tone generator</Link>
          </div>
        </div>
        <div className="home-hero-card">
          <p className="home-eyebrow">Quick highlights</p>
          <ul className="home-highlight-list">
            {differentiators.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <div className="announcement-strip">
        <span>Audionyx online tools</span>
        <span>hearing checks</span>
        <span>tone generator</span>
        <span>sleep frequencies</span>
        <span>calculator lab</span>
      </div>

      <section className="home-section cta-section">
        <div>
          <p className="section-label">Try Audionyx</p>
          <h3>Start with the most useful pages first.</h3>
          <p>
            The current project is organized so new visitors can immediately jump into the tools that matter:
            hearing test, tone generator, sleep frequencies, and the calculator tab.
          </p>
        </div>
        <div className="home-actions">
          <Link className="button-link" to="/hearing-test">Hearing Test</Link>
          <Link className="button-link" to="/sleep-frequencies">Sleep Frequencies</Link>
          <Link className="button-link ghost-button" to="/calculators">Calculator Tab</Link>
        </div>
      </section>

      <section className="home-section">
        <p className="section-label">One project. Several practical workflows.</p>
        <div className="workflow-grid">
          {workflows.map((workflow) => (
            <article key={workflow.title} className="workflow-card">
              <h3>{workflow.title}</h3>
              <p>{workflow.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section">
        <p className="section-label">Featured pages</p>
        <div className="feature-grid">
          {featureCards.map((card) => (
            <article key={card.title} className="feature-card">
              <p className="feature-eyebrow">{card.eyebrow}</p>
              <h3>{card.title}</h3>
              <p>{card.copy}</p>
              <Link className="button-link ghost-button" to={card.href}>{card.cta}</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section split-section">
        <div className="content-panel">
          <p className="section-label">About Audionyx</p>
          <h3>A clearer website structure for your existing tool set.</h3>
          <p>
            The live Audionyx site uses a simple rhythm: a strong hero, a direct CTA, feature groupings,
            lightweight explanation sections, and a contact-oriented ending. This redesign brings that same
            structure into your React project without replacing your existing content model.
          </p>
        </div>
        <div className="content-panel">
          <p className="section-label">Why this direction works</p>
          <p>
            It makes the site feel more intentional and easier to scan. Visitors get a landing page that feels
            like a product site, while the deeper routed tools stay available for more specific use cases.
          </p>
          <div className="home-actions">
            <Link className="button-link" to="/about">Read about</Link>
            <Link className="button-link ghost-button" to="/support">Open support</Link>
          </div>
        </div>
      </section>

      <section className="home-section faq-section">
        <p className="section-label">Frequently asked questions</p>
        <div className="faq-list">
          {faqs.map((item) => (
            <article key={item.question} className="faq-item">
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section contact-section">
        <div>
          <p className="section-label">Contact and support</p>
          <h3>Need help, feedback, or next-step changes?</h3>
          <p>
            Use the support page for contribution details, page planning, and future improvements across the
            wider Audionyx project.
          </p>
        </div>
        <div className="home-actions">
          <Link className="button-link" to="/support">Go to support</Link>
          <Link className="button-link ghost-button" to="/frequency-guide">Browse frequency guide</Link>
        </div>
      </section>
    </div>
  );
}
