import { Link } from 'react-router-dom';
import ParticleOverlay from '../components/ParticleOverlay';

const featureCards = [
  {
    title: 'What is Audionyx?',
    copy: 'A focused browser toolkit for tone generation, hearing checks, and practical frequency references without clutter.',
    accent: 'figma',
  },
  {
    title: 'Why it feels simpler',
    copy: 'Each page is structured to help you find the right audio tool quickly, understand what it does, and start using it fast.',
    accent: 'notes',
  },
  {
    title: 'Who it is for',
    copy: 'Creators, students, testers, and curious listeners who need reliable online sound utilities in one place.',
    accent: 'idea',
  },
];

const faqs = [
  {
    question: 'How do I get started?',
    answer: 'Start with the tone generator or hearing test, then move through the frequency guide when you need explanation or presets.',
  },
  {
    question: 'Do I need to install anything?',
    answer: 'Most of the experience runs directly in the browser. The install section simply helps users save the site and come back faster.',
  },
  {
    question: 'Is this built for casual users or advanced users?',
    answer: 'Both. The layout is beginner-friendly, but the tools still support practical testing and reference tasks.',
  },
];

export default function HomePage() {
  return (
    <div className="landing-shell">
      <ParticleOverlay />

      <section className="landing-hero" id="home">
        <div className="hero-banner">
          <p>Audionyx keeps the workflow simple.</p>
          <a href="#features">Explore features</a>
        </div>

        <div className="hero-body">
          <div className="hero-copy">
            <p className="hero-kicker">Cleaner structure. Faster decisions.</p>
            <h1 className="hero-title">Audio tools in a calmer, page-led layout.</h1>
            <p className="hero-summary">
              This redesign follows the reference you shared: a strong left navigation rail,
              a brighter content canvas, and clear sections that guide users through the product
              instead of overwhelming them.
            </p>
            <div className="hero-cta-row">
              <a className="button-link hero-primary" href="#features">See the layout</a>
              <Link className="button-link hero-secondary" to="/tools">Open tools</Link>
            </div>
          </div>

          <div className="hero-showcase" aria-hidden="true">
            <div className="showcase-photo showcase-photo-main" />
            <div className="showcase-photo showcase-photo-top" />
            <div className="showcase-callout">
              <span>Page-led interface</span>
              <strong>Designed for easier scanning and better content hierarchy.</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section-heading" id="features">
        <p>About Audionyx</p>
        <h2>Page loader style structure with clearer content cards.</h2>
      </section>

      <section className="feature-grid">
        {featureCards.map((card) => (
          <article key={card.title} className="feature-card">
            <div className={`feature-visual feature-visual-${card.accent}`}>
              <span className="feature-orb" />
            </div>
            <h3>{card.title}</h3>
            <p>{card.copy}</p>
          </article>
        ))}
      </section>

      <section className="story-grid">
        <article className="story-panel">
          <p className="story-label">What changed</p>
          <h3>The interface now gives the sidebar real weight.</h3>
          <p>
            Your reference emphasized a dark navigation column and a wider bright content area.
            The project now follows that composition so the layout feels intentional from the first glance.
          </p>
        </article>
        <article className="story-panel story-panel-highlight">
          <p className="story-label">Design notes</p>
          <h3>Key visual ingredients from your mockup</h3>
          <ul>
            <li>Dark vertical sidebar with a high-contrast logo lockup</li>
            <li>Warm accent color across the hero band and buttons</li>
            <li>Large page title and roomy white content canvas</li>
            <li>Simple three-card content rhythm under the section heading</li>
          </ul>
        </article>
      </section>

      <section className="faq-grid" id="faq">
        <div className="section-heading section-heading-left">
          <p>How to use / FAQs</p>
          <h2>Answer the main questions before users need to hunt for them.</h2>
        </div>
        {faqs.map((item) => (
          <article key={item.question} className="faq-card">
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
          </article>
        ))}
      </section>

      <section className="install-grid" id="install">
        <article className="install-card">
          <p className="story-label">Install</p>
          <h3>Keep the product lightweight, then make return visits easy.</h3>
          <p>
            The site remains browser-first. For desktop or mobile users, the clearest
            “install” path is saving it to the home screen or pinning it as a regular web app.
          </p>
        </article>
        <article className="install-steps">
          <div>
            <span>01</span>
            <p>Open the tool you use most often.</p>
          </div>
          <div>
            <span>02</span>
            <p>Use your browser menu to add or save the site.</p>
          </div>
          <div>
            <span>03</span>
            <p>Come back straight into the tool flow from the sidebar.</p>
          </div>
        </article>
      </section>

      <section className="contact-strip" id="contact">
        <div>
          <p className="story-label">Contact Us</p>
          <h2>Need support, ideas, or a better route into the tools?</h2>
        </div>
        <div className="hero-cta-row">
          <Link className="button-link hero-primary" to="/support">Open support</Link>
          <Link className="button-link hero-secondary" to="/about">Read about Audionyx</Link>
        </div>
      </section>
    </div>
  );
}
