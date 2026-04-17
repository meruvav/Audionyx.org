import { Link, useNavigate } from 'react-router-dom';
import AffiliateCard from '../components/AffiliateCard';
import Panel from '../components/Panel';
import SeoBlock from '../components/SeoBlock';
import { affiliateProducts } from '../constants/site';

export default function ToneGeneratorPage({ tools }) {
  const navigate = useNavigate();
  const {
    freqText,
    setFreqText,
    waveform,
    setWaveform,
    duration,
    setDuration,
    parsedFreqs,
    playFrequencies,
    exportCurrent,
    stop,
    setActive,
  } = tools;

  const openTool = (toolId) => {
    setActive(toolId);
    navigate(`/tools?tool=${toolId}`);
  };

  return (
    <div className="page-stack">
      <Panel title="Simple Online Tone Generator">
        <p>Fast, plain, and usable for quick speaker checks and reference tones.</p>
        <label className="field">
          <span>Frequency list</span>
          <textarea value={freqText} onChange={(e) => setFreqText(e.target.value)} rows="3" />
        </label>
        <label className="field">
          <span>Waveform</span>
          <select value={waveform} onChange={(e) => setWaveform(e.target.value)}>
            <option>sine</option>
            <option>square</option>
            <option>triangle</option>
            <option>sawtooth</option>
          </select>
        </label>
        <label className="field">
          <span>Duration</span>
          <input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
        </label>
        <div className="quick-grid">
          {[100, 250, 440, 1000, 5000].map((freq) => (
            <button key={freq} onClick={() => playFrequencies([freq], duration, waveform)}>{freq} Hz</button>
          ))}
        </div>
        <div className="actions spaced-top">
          <button onClick={() => playFrequencies(parsedFreqs.length ? parsedFreqs : [440])}>Play</button>
          <button onClick={() => exportCurrent('wav')}>Export WAV</button>
          <button onClick={() => exportCurrent('mp3')}>Export MP3</button>
          <button onClick={stop}>Stop</button>
        </div>
      </Panel>

      <SeoBlock title="Recommended gear after the tone test" intro="These affiliate blocks come immediately after the main tone generator so they are tied to the user's test flow.">
        <div className="card-grid">
          <AffiliateCard {...affiliateProducts[0]} />
          <AffiliateCard
            title="Portable Bluetooth speaker"
            copy="A practical Amazon option for checking how simple tones translate on a small consumer speaker."
            href="https://www.amazon.com/JBL-Clip-4-Bluetooth-Waterproof/dp/B08X4YMTPM/"
          />
        </div>
      </SeoBlock>

      <SeoBlock title="What this page is actually good for" intro="It is useful for quick speaker checks, channel checks, and reference tones.">
        <ul>
          <li>Basic speaker testing</li>
          <li>Checking whether a device can reproduce a frequency range</li>
          <li>Generating a quick reference tone for music practice</li>
        </ul>
      </SeoBlock>

      <SeoBlock title="Related tools" intro="Push users deeper into the site or they leave after one click.">
        <div className="card-grid three-up">
          <article className="info-card"><h4>Subwoofer testing</h4><p>Low-frequency checks for bass-heavy setups.</p><button onClick={() => openTool('subwoofer')}>Open tool</button></article>
          <article className="info-card"><h4>Sweep generator</h4><p>Run rising or falling sweeps across a range.</p><button onClick={() => openTool('sweep')}>Open tool</button></article>
          <article className="info-card"><h4>Frequency guide</h4><p>Help beginners choose a starting point.</p><Link className="button-link" to="/frequency-guide">Open guide</Link></article>
        </div>
      </SeoBlock>
    </div>
  );
}
