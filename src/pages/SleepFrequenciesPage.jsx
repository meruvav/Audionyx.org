import AffiliateCard from '../components/AffiliateCard';
import FrequencyVisual from '../components/FrequencyVisual';
import Panel from '../components/Panel';
import SeoBlock from '../components/SeoBlock';
import { affiliateProducts } from '../constants/site';

export default function SleepFrequenciesPage({ tools }) {
  const { playFrequencies, playNoise, playBinaural, stop, currentVisual } = tools;

  return (
    <div className="page-stack">
      <Panel title="Sleep and Relaxation Frequencies">
        <p>Common sleep-focused tones and noise tools in a simple browser interface.</p>
        <div className="quick-grid">
          {[432, 440, 528, 174].map((freq) => (
            <button key={freq} onClick={() => playFrequencies([freq], 300, 'sine')}>{freq} Hz</button>
          ))}
        </div>
        <div className="actions spaced-top">
          <button onClick={playNoise}>Start background noise</button>
          <button onClick={playBinaural}>Play binaural beat</button>
          <button onClick={stop}>Stop</button>
        </div>
      </Panel>

      <FrequencyVisual visual={currentVisual} />

      <SeoBlock title="Recommended gear after the listening block" intro="These affiliate placements follow the main playback section so the recommendation is tied to the use case.">
        <div className="card-grid">
          <AffiliateCard {...affiliateProducts[1]} />
          <AffiliateCard
            title="White noise machine"
            copy="A practical Amazon option for people who want a hardware alternative to browser playback."
            href="https://www.amazon.com/Adaptive-Sound-Technologies-LectroFan-Non-Looping/dp/B074FFW5W4/"
          />
        </div>
      </SeoBlock>

      <SeoBlock title="Common frequency presets people try" intro="These are common presets, not guaranteed treatment.">
        <div className="card-grid three-up">
          <article className="info-card"><h4>432 Hz</h4><p>A common relaxation preset.</p></article>
          <article className="info-card"><h4>174 Hz</h4><p>Often included in relaxation playlists.</p></article>
          <article className="info-card"><h4>White or brown noise</h4><p>Often more useful than a fixed tone for masking background sound.</p></article>
        </div>
      </SeoBlock>
    </div>
  );
}
