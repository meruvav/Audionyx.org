import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Panel from '../components/Panel';
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

const standupNames = [
  {
    name: 'Daily Sync',
    tone: 'Clear and professional',
    copy: 'A simple, familiar name for quick alignment, blockers, and next steps.',
  },
  {
    name: 'Morning Pulse',
    tone: 'Energetic and branded',
    copy: 'A memorable option for teams that want the meeting to feel focused and alive.',
  },
  {
    name: 'Team Huddle',
    tone: 'Friendly and collaborative',
    copy: 'An approachable name that makes the daily check-in feel less corporate.',
  },
];

const pickerColors = ['#58c5ff', '#8ef7d4', '#6b8cff', '#f9d65c', '#ff8aa3', '#b99cff', '#7ce8ff', '#77dd88'];

function getRandomIndex(length) {
  if (length <= 0) return -1;
  if (window.crypto?.getRandomValues) {
    const values = new Uint32Array(1);
    window.crypto.getRandomValues(values);
    return values[0] % length;
  }
  return Math.floor(Math.random() * length);
}

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [pickerText, setPickerText] = useState(standupNames.map((option) => option.name).join('\n'));
  const [pickedName, setPickedName] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);

  const pickerNames = useMemo(
    () => pickerText
      .split(/\r?\n|,/)
      .map((name) => name.trim())
      .filter(Boolean),
    [pickerText],
  );

  const wheelGradient = useMemo(() => {
    if (pickerNames.length === 0) {
      return 'linear-gradient(135deg, rgba(88, 197, 255, 0.32), rgba(142, 247, 212, 0.22))';
    }

    const slice = 100 / pickerNames.length;
    return `conic-gradient(${pickerNames.map((name, index) => {
      const start = index * slice;
      const end = (index + 1) * slice;
      return `${pickerColors[index % pickerColors.length]} ${start}% ${end}%`;
    }).join(', ')})`;
  }, [pickerNames]);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const spinPicker = () => {
    if (pickerNames.length === 0 || isSpinning) return;

    const nextIndex = getRandomIndex(pickerNames.length);
    const baseTurns = 1440;
    const sliceDegrees = 360 / pickerNames.length;
    const targetOffset = 360 - (nextIndex * sliceDegrees + sliceDegrees / 2);
    const nextRotation = Math.ceil(wheelRotation / 360) * 360 + baseTurns + targetOffset;

    setIsSpinning(true);
    setPickedName('');
    setWheelRotation(nextRotation);

    window.setTimeout(() => {
      setPickedName(pickerNames[nextIndex]);
      setIsSpinning(false);
    }, 1500);
  };

  const removePickedName = () => {
    if (!pickedName) return;
    setPickerText((currentText) => currentText
      .split(/\r?\n|,/)
      .map((name) => name.trim())
      .filter((name) => name && name !== pickedName)
      .join('\n'));
    setPickedName('');
  };

  const resetPicker = () => {
    setPickerText(standupNames.map((option) => option.name).join('\n'));
    setPickedName('');
    setWheelRotation(0);
  };

  return (
    <div className="portfolio-shell">
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

      <SeoBlock
        title="Daily Standup Naming"
        intro="Add names, spin the picker, and choose a random meeting name or team member for the next daily standup."
      >
        <div className="standup-picker">
          <div className="standup-picker-controls">
            <label className="field standup-picker-field">
              <span>Names</span>
              <textarea
                value={pickerText}
                onChange={(event) => {
                  setPickerText(event.target.value);
                  setPickedName('');
                }}
                rows="8"
                placeholder="Add one name per line"
              />
            </label>
            <div className="standup-picker-actions">
              <button type="button" onClick={spinPicker} disabled={pickerNames.length === 0 || isSpinning}>
                {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
              </button>
              <button type="button" className="standup-secondary-btn" onClick={resetPicker}>
                Reset
              </button>
            </div>
            <p className="standup-picker-count">{pickerNames.length} active {pickerNames.length === 1 ? 'name' : 'names'}</p>
          </div>

          <div className="standup-wheel-area">
            <div className="standup-wheel-pointer" />
            <div
              className={`standup-wheel${isSpinning ? ' spinning' : ''}`}
              style={{ background: wheelGradient, transform: `rotate(${wheelRotation}deg)` }}
              aria-hidden="true"
            >
              <div className="standup-wheel-center">Spin</div>
            </div>
            <div className="standup-picker-result" aria-live="polite">
              <span>Selected</span>
              <strong>{pickedName || (isSpinning ? 'Choosing...' : 'Ready')}</strong>
              {pickedName && (
                <button type="button" className="standup-secondary-btn" onClick={removePickedName}>
                  Remove Picked Name
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="standup-name-grid">
          {standupNames.map((option) => (
            <article key={option.name} className="standup-name-card">
              <span>{option.tone}</span>
              <h4>{option.name}</h4>
              <p>{option.copy}</p>
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
