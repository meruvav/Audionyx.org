import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Panel from '../components/Panel';
import ParticleOverlay from '../components/ParticleOverlay';
import SeoBlock from '../components/SeoBlock';
import WebGLHeroCanvas from '../components/WebGLHeroCanvas';

const projects = [
  {
    title: 'Immersive Product Worlds',
    copy: 'Glassmorphism surfaces, kinetic hero transitions, and layered 3D motion built for 2026 attention spans.',
  },
  {
    title: 'Interactive System Design',
    copy: 'Mouse-reactive canvases, live experiments, and generative interfaces that reward exploration.',
  },
  {
    title: 'High-Contrast Brand Direction',
    copy: 'Dark mode atmospheres with electric accents, oversized type, and clear directional hierarchy.',
  },
  {
    title: 'Conversion Through Spectacle',
    copy: 'Bento layouts that still move users toward real actions instead of collapsing into visual noise.',
  },
];

const capabilities = [
  'Interactive 3D WebGL hero field',
  'Scroll-triggered reveal choreography',
  'Glassmorphism cards and layered depth',
  'Dark mode with vibrant cyan accents',
  'Mouse-reactive particle atmosphere',
  'Parallax-inspired floating sections',
];

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="portfolio-shell">
      <ParticleOverlay />

      <section className="portfolio-hero" style={{ '--hero-shift': `${Math.min(scrollY * 0.12, 44)}px` }}>
        <div className="hero-copy">
          <p className="hero-kicker">2026 portfolio experience</p>
          <h1 className="hero-title">
            Design systems
            <span>that move.</span>
          </h1>
          <p className="hero-summary">
            A live futuristic portfolio interface blending WebGL motion, glassmorphism,
            bento-grid storytelling, and interactive experiments inspired by the cinematic
            ambition of top-tier creative studios.
          </p>
          <div className="hero-cta-row">
            <Link className="button-link hero-primary" to="/motion-trace">Open motion trace</Link>
            <Link className="button-link hero-secondary" to="/right-angle-growth">Open bubble growth</Link>
            <Link className="button-link hero-secondary" to="/calculators">Utility lab</Link>
          </div>
        </div>

        <div className="hero-stage">
          <WebGLHeroCanvas />
          <div className="hero-glass-card hero-card-a">
            <span>WebGL</span>
            <strong>Interactive depth field</strong>
          </div>
          <div className="hero-glass-card hero-card-b">
            <span>Scroll motion</span>
            <strong>Parallax + kinetic type</strong>
          </div>
          <div className="hero-glass-card hero-card-c">
            <span>Micro interactions</span>
            <strong>Responsive hover energy</strong>
          </div>
        </div>
      </section>

      <section className="bento-grid">
        <article className="bento-card bento-card-feature">
          <p className="bento-label">Now showing</p>
          <h2>Live portfolio direction with studio-grade motion language.</h2>
          <p>
            This homepage shifts the current project into a much bolder creative-tech presentation while still
            leaving room for the existing tools and experiments.
          </p>
        </article>

        <article className="bento-card bento-card-list">
          <p className="bento-label">Core ingredients</p>
          <ul>
            {capabilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="bento-card bento-card-stat">
          <p className="bento-label">Mood</p>
          <strong>Dark. Glassy. Electric.</strong>
          <span>Built to feel alive before the user even clicks.</span>
        </article>

        <article className="bento-card bento-card-stat">
          <p className="bento-label">Structure</p>
          <strong>Bento + kinetic sections</strong>
          <span>Information is chunked for fast scanning, then animated into view.</span>
        </article>
      </section>

      <SeoBlock
        title="Selected Directions"
        intro="The portfolio language here is deliberately more cinematic and interactive than the earlier utility-first pages."
      >
        <div className="portfolio-project-grid">
          {projects.map((project, index) => (
            <article
              key={project.title}
              className="portfolio-project-card"
              style={{ transform: `translateY(${Math.max(0, 24 - scrollY * 0.03 - index * 4)}px)` }}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h4>{project.title}</h4>
              <p>{project.copy}</p>
            </article>
          ))}
        </div>
      </SeoBlock>

      <div className="portfolio-panel-stack">
        <Panel title="Interactive Tabs">
          <p>
            Two dedicated tabs were added for experimental interaction systems so the site feels like a portfolio
            of live ideas, not just a static layout exercise.
          </p>
          <div className="hero-cta-row">
            <Link className="button-link" to="/motion-trace">Mouse movement line system</Link>
            <Link className="button-link" to="/right-angle-growth">Bubble growth system</Link>
          </div>
        </Panel>

        <Panel title="Why This Direction Works">
          <p>
            It keeps the current project expandable while making the top-level experience feel much closer to
            contemporary portfolio trends: richer atmosphere, more motion, and more reasons for users to explore.
          </p>
        </Panel>
      </div>
    </div>
  );
}
