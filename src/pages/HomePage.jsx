import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Panel from '../components/Panel';
import SeoBlock from '../components/SeoBlock';
import WebGLHeroCanvas from '../components/WebGLHeroCanvas';

const projects = [
  {
    title: 'Free Hearing Tests',
    copy: 'Browser-based checks that help visitors explore hearing ranges and understand what they can perceive.',
  },
  {
    title: 'Tone Generation',
    copy: 'Simple frequency tools for testing speakers, matching tones, and experimenting with sound.',
  },
  {
    title: 'Sleep Frequencies',
    copy: 'Relaxation-focused frequency pages for people exploring calming tones and nighttime audio routines.',
  },
  {
    title: 'Audio Frequency Tools',
    copy: 'A growing lab of practical calculators, frequency references, and interactive audio utilities.',
  },
];

const capabilities = [
  'Free online hearing test',
  'Simple tone generator',
  'Sleep and relaxation frequencies',
  'Frequency guide for beginners',
  'Audio calculators and utilities',
  'Browser-based sound experiments',
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
          <p className="hero-kicker">Audio science for everyone</p>
          <h1 className="hero-title">
            Audionyx
            <span>Labs.</span>
          </h1>
          <p className="hero-summary">
            Free hearing tests, tone generators, sleep frequencies, and audio frequency
            tools built for quick experiments, practical checks, and everyday sound research.
          </p>
          <div className="hero-cta-row">
            <Link className="button-link hero-primary" to="/hearing-test">Start hearing test</Link>
            <Link className="button-link hero-secondary" to="/tone-generator">Open tone generator</Link>
            <Link className="button-link hero-secondary" to="/sleep-frequencies">Explore sleep frequencies</Link>
          </div>
        </div>

        <div className="hero-stage">
          <WebGLHeroCanvas />
          <div className="hero-glass-card hero-card-a">
            <span>Hearing</span>
            <strong>Free online hearing checks</strong>
          </div>
          <div className="hero-glass-card hero-card-b">
            <span>Frequency</span>
            <strong>Tone tools and guides</strong>
          </div>
          <div className="hero-glass-card hero-card-c">
            <span>Sleep</span>
            <strong>Relaxation frequency pages</strong>
          </div>
        </div>
      </section>

      <section className="bento-grid">
        <article className="bento-card bento-card-feature">
          <p className="bento-label">Now showing</p>
          <h2>Audionyx Labs makes hearing tests and frequency tools easier to find and use.</h2>
          <p>
            The brand keeps the existing Audionyx domain while making the purpose clearer:
            online hearing tests, tone generators, and audio frequency research tools.
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
          <strong>Measure. Hear. Understand.</strong>
          <span>A concise tagline for the hearing and frequency platform.</span>
        </article>

        <article className="bento-card bento-card-stat">
          <p className="bento-label">Structure</p>
          <strong>Audionyx Labs</strong>
          <span>A slightly extended brand that separates the site from other Audionyx businesses.</span>
        </article>
      </section>

      <SeoBlock
        title="Selected Directions"
        intro="The site now presents Audionyx Labs as a focused audio science platform with practical browser tools."
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
            The site still includes interactive experiments alongside the practical hearing and frequency tools.
          </p>
          <div className="hero-cta-row">
            <Link className="button-link" to="/motion-trace">Mouse movement line system</Link>
            <Link className="button-link" to="/right-angle-growth">Bubble growth system</Link>
          </div>
        </Panel>

        <Panel title="Why This Direction Works">
          <p>
            Audionyx Labs preserves the current domain and SEO while making the product category obvious:
            hearing tests, tone generators, sleep frequencies, and audio frequency tools.
          </p>
        </Panel>
      </div>
    </div>
  );
}
