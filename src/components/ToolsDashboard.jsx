import { sections, dtmfMap } from '../constants/site';
import Panel from './Panel';
import Sidebar from './Sidebar';
import Field from './Field';

export default function ToolsDashboard({ tools }) {
  const {
    active,
    setActive,
    status,
    freqText,
    setFreqText,
    waveform,
    setWaveform,
    duration,
    setDuration,
    parsedFreqs,
    playFrequencies,
    playSequence,
    exportCurrent,
    stop,
    pitchRate,
    setPitchRate,
    stretchRate,
    setStretchRate,
    ttsText,
    setTtsText,
    ttsVoice,
    setTtsVoice,
    voices,
    speakText,
    stopSpeech,
    startRecording,
    stopRecording,
    sweepStart,
    setSweepStart,
    sweepEnd,
    setSweepEnd,
    runSweep,
    tuningFreq,
    setTuningFreq,
    subFreq,
    setSubFreq,
    hearingStart,
    setHearingStart,
    alarmFreq,
    setAlarmFreq,
    noiseKind,
    setNoiseKind,
    playNoise,
    binauralBase,
    setBinauralBase,
    binauralBeat,
    setBinauralBeat,
    playBinaural,
    dtmfKey,
    setDtmfKey,
    playDTMF,
    bpm,
    setBpm,
    startMetronome,
    stopMetronome,
    playPips,
    playUploaded,
  } = tools;

  const sectionMap = {
    home: (
      <Panel title="Home">
        <p>
          Simple, plain audio tools for browser-based hearing checks, tone generation,
          and quick experiments.
        </p>
      </Panel>
    ),
    multi: (
      <Panel title="Multiple Tone Generator">
        <Field label="Frequencies (comma or CSV style)">
          <textarea value={freqText} onChange={(e) => setFreqText(e.target.value)} rows="4" />
        </Field>
        <Field label="Waveform">
          <select value={waveform} onChange={(e) => setWaveform(e.target.value)}>
            <option>sine</option>
            <option>square</option>
            <option>triangle</option>
            <option>sawtooth</option>
          </select>
        </Field>
        <Field label="Duration (seconds)">
          <input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
        </Field>
        <div className="actions">
          <button onClick={() => playFrequencies(parsedFreqs.length ? parsedFreqs : [440])}>Play</button>
          <button onClick={playSequence}>Play Sequence</button>
          <button onClick={() => exportCurrent('wav')}>Export WAV</button>
          <button onClick={() => exportCurrent('mp3')}>Export MP3</button>
          <button onClick={stop}>Stop</button>
        </div>
      </Panel>
    ),
    pitch: (
      <Panel title="Pitch Shifter">
        <Field label="Playback rate">
          <input type="number" step="0.1" value={pitchRate} onChange={(e) => setPitchRate(Number(e.target.value))} />
        </Field>
        <Field label="Audio file">
          <input type="file" accept="audio/*" onChange={(e) => e.target.files?.[0] && playUploaded(e.target.files[0], pitchRate)} />
        </Field>
        <p>This changes playback rate, so pitch and speed move together.</p>
      </Panel>
    ),
    stretch: (
      <Panel title="Time Stretcher">
        <Field label="Playback rate">
          <input type="number" step="0.1" value={stretchRate} onChange={(e) => setStretchRate(Number(e.target.value))} />
        </Field>
        <Field label="Audio file">
          <input type="file" accept="audio/*" onChange={(e) => e.target.files?.[0] && playUploaded(e.target.files[0], stretchRate)} />
        </Field>
        <p>Independent time-stretching would need additional DSP tooling.</p>
      </Panel>
    ),
    voicegen: (
      <Panel title="Voice Generator">
        <Field label="Text">
          <textarea rows="4" value={ttsText} onChange={(e) => setTtsText(e.target.value)} />
        </Field>
        <Field label="Voice">
          <select value={ttsVoice} onChange={(e) => setTtsVoice(e.target.value)}>
            <option value="">Default</option>
            {voices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Rate">
          <input type="number" step="0.1" value={pitchRate} onChange={(e) => setPitchRate(Number(e.target.value))} />
        </Field>
        <div className="actions">
          <button onClick={speakText}>Speak</button>
          <button onClick={stopSpeech}>Stop</button>
        </div>
      </Panel>
    ),
    voicerec: (
      <Panel title="Voice Recorder">
        <p>Records microphone input and downloads a WebM file.</p>
        <div className="actions">
          <button onClick={startRecording}>Start Recording</button>
          <button onClick={stopRecording}>Stop & Download</button>
        </div>
      </Panel>
    ),
    sweep: (
      <Panel title="Sweep Generator">
        <Field label="Start Frequency">
          <input type="number" value={sweepStart} onChange={(e) => setSweepStart(Number(e.target.value))} />
        </Field>
        <Field label="End Frequency">
          <input type="number" value={sweepEnd} onChange={(e) => setSweepEnd(Number(e.target.value))} />
        </Field>
        <Field label="Duration">
          <input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
        </Field>
        <div className="actions">
          <button onClick={runSweep}>Run Sweep</button>
          <button onClick={stop}>Stop</button>
        </div>
      </Panel>
    ),
    tuning: (
      <Panel title="Instrument Tuning">
        <Field label="Tuning Frequency">
          <input type="number" value={tuningFreq} onChange={(e) => setTuningFreq(Number(e.target.value))} />
        </Field>
        <div className="actions">
          <button onClick={() => playFrequencies([tuningFreq], 5, 'sine')}>Play Reference Tone</button>
          <button onClick={() => playFrequencies([329.63], 5, 'sine')}>E String</button>
          <button onClick={() => playFrequencies([440], 5, 'sine')}>A String</button>
          <button onClick={stop}>Stop</button>
        </div>
      </Panel>
    ),
    subwoofer: (
      <Panel title="Subwoofer Testing">
        <Field label="Bass Test Frequency">
          <input type="number" value={subFreq} onChange={(e) => setSubFreq(Number(e.target.value))} />
        </Field>
        <div className="actions">
          <button onClick={() => playFrequencies([subFreq], 8, 'sine')}>Play Bass Tone</button>
          <button onClick={runSweep}>Bass Sweep</button>
          <button onClick={stop}>Stop</button>
        </div>
      </Panel>
    ),
    hearing: (
      <Panel title="Hearing Test">
        <Field label="Test Frequency">
          <input type="number" value={hearingStart} onChange={(e) => setHearingStart(Number(e.target.value))} />
        </Field>
        <div className="actions">
          <button onClick={() => playFrequencies([hearingStart], 2, 'sine')}>Play Test Tone</button>
          <button
            onClick={() => {
              setSweepStart(20);
              setSweepEnd(20000);
              runSweep();
            }}
          >
            Full Range Sweep
          </button>
          <button onClick={stop}>Stop</button>
        </div>
      </Panel>
    ),
    alarm: (
      <Panel title="Alarm Generator">
        <Field label="Alarm Frequency">
          <input type="number" value={alarmFreq} onChange={(e) => setAlarmFreq(Number(e.target.value))} />
        </Field>
        <div className="actions">
          <button onClick={() => playFrequencies([alarmFreq], 0.3, 'square')}>Single Alarm</button>
          <button onClick={() => playFrequencies([alarmFreq, alarmFreq * 1.5], 2, 'square')}>Dual Alarm</button>
          <button onClick={stop}>Stop</button>
        </div>
      </Panel>
    ),
    noise: (
      <Panel title="Noise Generator">
        <Field label="Noise Type">
          <select value={noiseKind} onChange={(e) => setNoiseKind(e.target.value)}>
            <option value="white">White</option>
            <option value="pink">Pink</option>
            <option value="brown">Brown</option>
          </select>
        </Field>
        <div className="actions">
          <button onClick={playNoise}>Start Noise</button>
          <button onClick={stop}>Stop</button>
        </div>
      </Panel>
    ),
    binaural: (
      <Panel title="Binaural Beats">
        <Field label="Base Frequency">
          <input type="number" value={binauralBase} onChange={(e) => setBinauralBase(Number(e.target.value))} />
        </Field>
        <Field label="Beat Offset">
          <input type="number" value={binauralBeat} onChange={(e) => setBinauralBeat(Number(e.target.value))} />
        </Field>
        <div className="actions">
          <button onClick={playBinaural}>Play with Headphones</button>
          <button onClick={stop}>Stop</button>
        </div>
      </Panel>
    ),
    hz432: (
      <Panel title="432Hz Frequency">
        <p>This is just a preset.</p>
        <div className="actions">
          <button onClick={() => playFrequencies([432], 5, 'sine')}>Play 432Hz</button>
          <button onClick={() => playFrequencies([440], 5, 'sine')}>Play 440Hz</button>
          <button onClick={stop}>Stop</button>
        </div>
      </Panel>
    ),
    dtmf: (
      <Panel title="DTMF Signals">
        <Field label="Key">
          <select value={dtmfKey} onChange={(e) => setDtmfKey(e.target.value)}>
            {Object.keys(dtmfMap).map((key) => (
              <option key={key}>{key}</option>
            ))}
          </select>
        </Field>
        <div className="actions">
          <button onClick={playDTMF}>Play DTMF</button>
          <button onClick={stop}>Stop</button>
        </div>
      </Panel>
    ),
    metro: (
      <Panel title="Metronome">
        <Field label="BPM">
          <input type="number" value={bpm} onChange={(e) => setBpm(Number(e.target.value))} />
        </Field>
        <div className="actions">
          <button onClick={startMetronome}>Start</button>
          <button onClick={stopMetronome}>Stop</button>
        </div>
      </Panel>
    ),
    pips: (
      <Panel title="The Pips">
        <p>Simple six-pip pattern similar to time signal pips.</p>
        <div className="actions">
          <button onClick={playPips}>Play Pips</button>
          <button onClick={stop}>Stop</button>
        </div>
      </Panel>
    ),
    theory: (
      <Panel title="Acoustic Theory">
        <ul>
          <li>Frequency = cycles per second.</li>
          <li>Amplitude = loudness proxy.</li>
          <li>Waveform changes harmonic content.</li>
          <li>Binaural beats require stereo separation.</li>
          <li>Pitch shift and time stretch are not the same thing in real DSP.</li>
        </ul>
      </Panel>
    ),
    shop: (
      <Panel title="Shop">
        <p>Placeholder for affiliate links, downloadable tone packs, or other products.</p>
      </Panel>
    ),
    about: (
      <Panel title="About">
        <p>Built as a React and Vite project with browser-based audio tooling.</p>
      </Panel>
    ),
  };

  return (
    <div className="tools-layout">
      <Sidebar sections={sections} active={active} onSelect={setActive} />
      <div className="tools-main">
        <div className="tools-header-row">
          <h2>Tool Dashboard</h2>
          <div className="status">{status}</div>
        </div>
        {sectionMap[active]}
      </div>
    </div>
  );
}
