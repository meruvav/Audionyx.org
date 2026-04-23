import { Link } from 'react-router-dom';
import Panel from '../components/Panel';
import SeoBlock from '../components/SeoBlock';

export default function HomePage() {
  return (
    <div className="page-stack">
      <Panel title="Audionyx">
        <p>Free browser-based audio tools for hearing checks, simple tone generation, and practical frequency experiments.</p>
        <div className="hero-cta-row">
          <Link className="button-link" to="/calculators">Open calculators</Link>
          <Link className="button-link" to="/hearing-test">Open hearing test</Link>
          <Link className="button-link" to="/tone-generator">Open tone generator</Link>
          <Link className="button-link" to="/sleep-frequencies">Sleep frequencies</Link>
          <Link className="button-link" to="/frequency-guide">Frequency guide</Link>
          <Link className="button-link" to="/about">About Audionyx</Link>
          <Link className="button-link" to="/support">Support this project</Link>
        </div>
      </Panel>

      <SeoBlock title="Traffic pages that actually matter" intro="These pages target beginner intent first and keep the site easy to navigate.">
        <div className="card-grid three-up">
          <article className="info-card"><h4>Calculator Hub</h4><p>Calculator.net-inspired utility directory adapted to the current Audionyx design system.</p><Link className="button-link" to="/calculators">Visit page</Link></article>
          <article className="info-card"><h4>Hearing Test</h4><p>Targets online hearing test intent.</p><Link className="button-link" to="/hearing-test">Visit page</Link></article>
          <article className="info-card"><h4>Simple Tone Generator</h4><p>Targets speaker check and sound test intent.</p><Link className="button-link" to="/tone-generator">Visit page</Link></article>
        </div>
      </SeoBlock>

      <SeoBlock title="Project structure improvements" intro="The app now has routed pages and a dedicated dashboard entry point instead of one giant component.">
        <div className="card-grid three-up">
          <article className="info-card"><h4>/pages</h4><p>Each top-level route now lives in its own page component.</p></article>
          <article className="info-card"><h4>/layouts</h4><p>The shared site shell is separated from page content.</p></article>
          <article className="info-card"><h4>/hooks</h4><p>Audio tool state and actions are centralized in one reusable hook.</p></article>
        </div>
      </SeoBlock>
    </div>
  );
}
