import { Link } from 'react-router-dom';
import Panel from '../components/Panel';
import SeoBlock from '../components/SeoBlock';

export default function FrequencyGuidePage() {
  return (
    <div className="page-stack">
      <Panel title="What Frequency Should I Use?">
        <p>This guide answers beginner questions fast and pushes users into the right tool.</p>
        <div className="table-like">
          <div><strong>Sleep or relaxation</strong><span>Try 174 Hz, 432 Hz, 528 Hz, or noise tools.</span></div>
          <div><strong>Hearing checks</strong><span>Try 250 Hz to 12 kHz manually, then run a sweep.</span></div>
          <div><strong>Speaker testing</strong><span>Try 100 Hz, 440 Hz, 1 kHz, and a sweep.</span></div>
          <div><strong>Subwoofer testing</strong><span>Try 20 Hz to 80 Hz. Cheap speakers often fake bass badly.</span></div>
        </div>
      </Panel>

      <SeoBlock title="Choose by goal, not by hype" intro="Beginners usually want a shortcut. Here it is.">
        <div className="card-grid three-up">
          <article className="info-card"><h4>I want to test my hearing</h4><Link className="button-link" to="/hearing-test">Go to hearing test</Link></article>
          <article className="info-card"><h4>I want a simple sound test</h4><Link className="button-link" to="/tone-generator">Go to tone generator</Link></article>
          <article className="info-card"><h4>I want something to sleep to</h4><Link className="button-link" to="/sleep-frequencies">Go to sleep frequencies</Link></article>
        </div>
      </SeoBlock>
    </div>
  );
}
