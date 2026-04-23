import AffiliateCard from '../components/AffiliateCard';
import FrequencyVisual from '../components/FrequencyVisual';
import Panel from '../components/Panel';
import SeoBlock from '../components/SeoBlock';
import { affiliateProducts } from '../constants/site';

export default function HearingTestPage({ tools }) {
  const { playFrequencies, setSweepStart, setSweepEnd, setDuration, runSweep, stop, currentVisual } = tools;

  return (
    <div className="page-stack">
      <Panel title="Free Online Hearing Test">
        <p>Use headphones. Laptop speakers distort results and ruin the point of the test.</p>
        <div className="quick-grid">
          {[250, 500, 1000, 4000, 8000, 12000].map((freq) => (
            <button key={freq} onClick={() => playFrequencies([freq], 2, 'sine')}>{freq} Hz</button>
          ))}
        </div>
        <div className="actions spaced-top">
          <button
            onClick={() => {
              setSweepStart(20);
              setSweepEnd(20000);
              setDuration(12);
              runSweep();
            }}
          >
            Run full sweep
          </button>
          <button onClick={stop}>Stop</button>
        </div>
      </Panel>

      <FrequencyVisual visual={currentVisual} />

      <SeoBlock title="Recommended headphones after the test" intro="These affiliate placements sit directly after the testing block, where they are most relevant.">
        <div className="card-grid">
          <AffiliateCard {...affiliateProducts[0]} />
          <AffiliateCard
            title="Budget wired headphones"
            copy="A lower-cost wired option for repeatable hearing checks and simple device testing."
            href="https://www.amazon.com/Linsoul-7Hz-Salnotes-Diaphgram-Detachable/dp/B0B76TPX62/"
          />
        </div>
      </SeoBlock>

      <SeoBlock title="How to use this hearing test" intro="Start low, increase gradually, and keep the volume reasonable.">
        <ul>
          <li>Use wired or accurate headphones if possible.</li>
          <li>Keep volume moderate, not maxed.</li>
          <li>Test both ears separately if you want meaningful comparisons.</li>
        </ul>
      </SeoBlock>
    </div>
  );
}
