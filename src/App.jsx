import React, { useEffect, useMemo, useRef, useState } from 'react';
import Sidebar from './components/Sidebar';
import Panel from './components/Panel';
import {
  ensureRunning, createMaster, createOsc, createNoise,
  stopNodes, renderToneToBuffer, audioBufferToWav, encodeMp3FromBuffer,
  downloadBlob, parseFrequencies
} from './audio';

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'multi', label: 'Multiple Tone Generator' },
  { id: 'pitch', label: 'Pitch Shifter' },
  { id: 'stretch', label: 'Time Stretcher' },
  { id: 'voicegen', label: 'Voice Generator' },
  { id: 'voicerec', label: 'Voice Recorder' },
  { id: 'sweep', label: 'Sweep Generator' },
  { id: 'tuning', label: 'Instrument Tuning' },
  { id: 'subwoofer', label: 'Subwoofer Testing' },
  { id: 'hearing', label: 'Hearing Test' },
  { id: 'alarm', label: 'Alarm Generator', badge: 'NEW' },
  { id: 'noise', label: 'Noise Generator' },
  { id: 'binaural', label: 'Binaural Beats' },
  { id: 'hz432', label: '432Hz Frequency' },
  { id: 'dtmf', label: 'DTMF Signals' },
  { id: 'metro', label: 'Metronome' },
  { id: 'pips', label: 'The Pips' },
  { id: 'theory', label: 'Acoustic Theory' },
  { id: 'shop', label: 'Shop' },
  { id: 'about', label: 'About' },
];

const marketingRoutes = [
  { path: '/', label: 'Home' },
  { path: '/hearing-test', label: 'Hearing Test' },
  { path: '/tone-generator', label: 'Tone Generator' },
  { path: '/sleep-frequencies', label: 'Sleep Frequencies' },
  { path: '/frequency-guide', label: 'Frequency Guide' },
  { path: '/support', label: 'Support' },
];

const dtmfMap = {
  '1': [697, 1209], '2': [697, 1336], '3': [697, 1477],
  '4': [770, 1209], '5': [770, 1336], '6': [770, 1477],
  '7': [852, 1209], '8': [852, 1336], '9': [852, 1477],
  '*': [941, 1209], '0': [941, 1336], '#': [941, 1477]
};

const affiliateProducts = [
  {
    title: 'Closed-back monitoring headphones',
    copy: 'Audio-Technica ATH-M20x Professional Studio Monitor Headphones, Black',
    copy: '1. Advanced build quality and engineering; Designed for studio tracking and mixing
           2. 40 mm drivers with rare earth magnets and copper clad aluminum wire voice coils
           3. Tuned for enhanced low frequency performance
           4. Circumaural design contours around the ears for excellent sound isolation in loud environments
           5. Convenient single side cable exit',
    href: 'https://www.amazon.com/Audio-Technica-ATH-M50x-Professional-Monitor-Headphones/dp/B00HVLUR86/ref=sr_1_3?crid=2DQ1DKOLGJLAP&dib=eyJ2IjoiMSJ9.5MKHfGzsB4UfQF8sdFgDXIjxPvVD4DOEt2cs2W4wRR5x67fumZnaLcmTL-OTXzNHNVAjTp_GxF9aor_rvkyLOWPJWfC3NDct-x3b8SuiUxXRoxiDnn_r_aLhTzDJWLSQDbHkXQwhga3c81hokA0_VCIVgzt5Y8Y-dkCxQWcZlOmkOiMan7s9xPSH9h-LcLkOiblYSmLfAbzQxc1md150mBKU0OReNgi81tbWfI6rAUrmMhBV8uJxFhT181DIw9adM9ftUAVTtj6xqBaYGDLXK-5_4UYJzRozoMyT4nIWXUQ.nUvw5NvXKRbM7IDZZZoeEYstSgHLqoV3s6bM6NUNrqo&dib_tag=se&keywords=Closed-back%2Bmonitoring%2Bheadphones&qid=1776396849&sprefix=closed-back%2Bmonitoring%2Bheadphones%2Caps%2C193&sr=8-3&th=1'
  },
  {
    title: 'Comfort headphones for sleep',
    copy: 'Use this slot for soft headband sleep headphones or low-profile earbuds. Comfort matters more than hype.',
    href: 'https://www.amazon.com/Audio-Technica-ATH-M20x-Professional-Monitor-Headphones/dp/B00HVLUR18/ref=sr_1_2?crid=2DQ1DKOLGJLAP&dib=eyJ2IjoiMSJ9.5MKHfGzsB4UfQF8sdFgDXIjxPvVD4DOEt2cs2W4wRR5x67fumZnaLcmTL-OTXzNHNVAjTp_GxF9aor_rvkyLOWPJWfC3NDct-x3b8SuiUxXRoxiDnn_r_aLhTzDJWLSQDbHkXQwhga3c81hokA0_VCIVgzt5Y8Y-dkCxQWcZlOmkOiMan7s9xPSH9h-LcLkOiblYSmLfAbzQxc1md150mBKU0OReNgi81tbWfI6rAUrmMhBV8uJxFhT181DIw9adM9ftUAVTtj6xqBaYGDLXK-5_4UYJzRozoMyT4nIWXUQ.nUvw5NvXKRbM7IDZZZoeEYstSgHLqoV3s6bM6NUNrqo&dib_tag=se&keywords=Closed-back%2Bmonitoring%2Bheadphones&qid=1776396849&sprefix=closed-back%2Bmonitoring%2Bheadphones%2Caps%2C193&sr=8-2&th=1'
  }
];

function Field({ label, children }) {
  return <label className="field"><span>{label}</span>{children}</label>;
}

function useAudioStopper() {
  const nodesRef = useRef([]);
  const stop = () => {
    stopNodes(nodesRef.current);
    nodesRef.current = [];
  };
  return { nodesRef, stop };
}

function clampNumber(v, min, max) {
  return Math.min(Math.max(Number(v), min), max);
}

function navigateTo(path) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

function MarketingNav({ currentPath }) {
  return (
    <nav className="marketing-nav" aria-label="Primary">
      {marketingRoutes.map((route) => (
        <button
          key={route.path}
          className={`marketing-link ${currentPath === route.path ? 'active' : ''}`}
          onClick={() => navigateTo(route.path)}
        >
          {route.label}
        </button>
      ))}
    </nav>
  );
}

function SeoBlock({ title, intro, children }) {
  return (
    <section className="seo-block">
      <h3>{title}</h3>
      <p>{intro}</p>
      {children}
    </section>
  );
}

function AffiliateCard({ title, copy, href }) {
  return (
    <article className="affiliate-card">
      <h4>{title}</h4>
      <p>{copy}</p>
      <a href={href} target="_blank" rel="noreferrer">Open affiliate placeholder</a>
    </article>
  );
}

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');
  const [active, setActive] = useState('home');
  const [status, setStatus] = useState('Ready');
  const [freqText, setFreqText] = useState('440, 660, 880');
  const [waveform, setWaveform] = useState('sine');
  const [duration, setDuration] = useState(3);
  const [volume, setVolume] = useState(0.4);
  const [csvSeq, setCsvSeq] = useState('440,660,880,523.25');
  const [pitchRate, setPitchRate] = useState(1.2);
  const [stretchRate, setStretchRate] = useState(0.8);
  const [ttsText, setTtsText] = useState('Hello, this is a simple voice generator.');
  const [ttsVoice, setTtsVoice] = useState('');
  const [sweepStart, setSweepStart] = useState(20);
  const [sweepEnd, setSweepEnd] = useState(20000);
  const [tuningFreq, setTuningFreq] = useState(440);
  const [subFreq, setSubFreq] = useState(40);
  const [hearingStart, setHearingStart] = useState(500);
  const [alarmFreq, setAlarmFreq] = useState(1000);
  const [noiseKind, setNoiseKind] = useState('white');
  const [binauralBase, setBinauralBase] = useState(200);
  const [binauralBeat, setBinauralBeat] = useState(8);
  const [dtmfKey, setDtmfKey] = useState('5');
  const [bpm, setBpm] = useState(100);
  const [voices, setVoices] = useState([]);
  const recorderRef = useRef(null);
  const recorderChunksRef = useRef([]);
  const streamRef = useRef(null);
  const metroTimer = useRef(null);
  const { nodesRef, stop } = useAudioStopper();

  useEffect(() => {
    const loadVoices = () => setVoices(window.speechSynthesis?.getVoices?.() || []);
    const handlePopState = () => setCurrentPath(window.location.pathname || '/');
    loadVoices();
    window.addEventListener('popstate', handlePopState);
    window.speechSynthesis?.addEventListener?.('voiceschanged', loadVoices);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.speechSynthesis?.removeEventListener?.('voiceschanged', loadVoices);
      stop();
      if (metroTimer.current) clearInterval(metroTimer.current);
    };
  }, []);

  useEffect(() => {
    const routeTitles = {
      '/': 'Audionyx - Free online hearing test, tone generator, and sleep frequencies',
      '/hearing-test': 'Free Online Hearing Test | Audionyx',
      '/tone-generator': 'Simple Online Tone Generator | Audionyx',
      '/sleep-frequencies': 'Sleep and Relaxation Frequencies | Audionyx',
      '/frequency-guide': 'What Frequency Should I Use? | Audionyx',
      '/support': 'Support Audionyx',
    };
    document.title = routeTitles[currentPath] || 'Audionyx';
  }, [currentPath]);

  const parsedFreqs = useMemo(() => parseFrequencies(freqText), [freqText]);
  const parsedSeq = useMemo(() => parseFrequencies(csvSeq), [csvSeq]);

  async function playFrequencies(frequencies, seconds = duration, type = waveform, stereo = false) {
    stop();
    const ac = await ensureRunning();
    const master = createMaster(ac, volume / Math.max(frequencies.length, 1));
    nodesRef.current.push(master);
    frequencies.forEach((freq, index) => {
      const osc = createOsc(ac, freq, type);
      if (stereo) {
        const pan = ac.createStereoPanner();
        pan.pan.value = frequencies.length === 1 ? 0 : index === 0 ? -1 : 1;
        osc.connect(pan);
        pan.connect(master);
        nodesRef.current.push(pan);
      } else {
        osc.connect(master);
      }
      osc.start();
      osc.stop(ac.currentTime + seconds);
      nodesRef.current.push(osc);
    });
    setStatus(`Playing ${frequencies.join(', ')} Hz`);
  }

  async function exportCurrent(format) {
    const buffer = await renderToneToBuffer({ frequencies: parsedFreqs.length ? parsedFreqs : [440], waveform, duration, volume });
    const blob = format === 'wav' ? audioBufferToWav(buffer) : await encodeMp3FromBuffer(buffer);
    downloadBlob(blob, `tones.${format}`);
    setStatus(`Exported ${format.toUpperCase()}`);
  }

  async function runSweep() {
    stop();
    const ac = await ensureRunning();
    const master = createMaster(ac, volume);
    const osc = createOsc(ac, sweepStart, waveform);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, sweepEnd), ac.currentTime + duration);
    osc.connect(master);
    osc.start();
    osc.stop(ac.currentTime + duration);
    nodesRef.current.push(master, osc);
    setStatus(`Sweep ${sweepStart} → ${sweepEnd} Hz`);
  }

  async function playSequence() {
    stop();
    const ac = await ensureRunning();
    const master = createMaster(ac, volume);
    nodesRef.current.push(master);
    parsedSeq.forEach((freq, i) => {
      const osc = createOsc(ac, freq, waveform);
      osc.connect(master);
      const start = ac.currentTime + i * 0.5;
      osc.start(start);
      osc.stop(start + 0.45);
      nodesRef.current.push(osc);
    });
    setStatus(`Sequence with ${parsedSeq.length} steps`);
  }

  async function playNoise() {
    stop();
    const ac = await ensureRunning();
    const master = createMaster(ac, volume);
    const src = createNoise(ac, noiseKind);
    src.connect(master);
    src.start();
    nodesRef.current.push(master, src);
    setStatus(`${noiseKind} noise running`);
  }

  async function playBinaural() {
    await playFrequencies([binauralBase, binauralBase + binauralBeat], duration, waveform, true);
    setStatus(`Binaural beat ${binauralBeat} Hz using headphones`);
  }

  async function playDTMF() {
    const tones = dtmfMap[dtmfKey];
    if (!tones) return;
    await playFrequencies(tones, 0.4, 'sine');
    setStatus(`DTMF ${dtmfKey}`);
  }

  async function startMetronome() {
    stop();
    if (metroTimer.current) clearInterval(metroTimer.current);
    const interval = 60000 / bpm;
    const tick = async () => {
      const ac = await ensureRunning();
      const master = createMaster(ac, 0.25);
      const osc = createOsc(ac, 1000, 'square');
      osc.connect(master);
      osc.start();
      osc.stop(ac.currentTime + 0.04);
      nodesRef.current.push(master, osc);
    };
    tick();
    metroTimer.current = setInterval(tick, interval);
    setStatus(`Metronome running at ${bpm} BPM`);
  }

  async function playPips() {
    stop();
    const ac = await ensureRunning();
    const master = createMaster(ac, 0.25);
    nodesRef.current.push(master);
    for (let i = 0; i < 6; i += 1) {
      const osc = createOsc(ac, i === 5 ? 1000 : 800, 'square');
      osc.connect(master);
      const start = ac.currentTime + i;
      osc.start(start);
      osc.stop(start + (i === 5 ? 0.5 : 0.1));
      nodesRef.current.push(osc);
    }
    setStatus('Playing pips');
  }

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    const recorder = new MediaRecorder(stream);
    recorderRef.current = recorder;
    recorderChunksRef.current = [];
    recorder.ondataavailable = (e) => recorderChunksRef.current.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(recorderChunksRef.current, { type: 'audio/webm' });
      downloadBlob(blob, 'recording.webm');
      stream.getTracks().forEach((t) => t.stop());
      setStatus('Recording downloaded');
    };
    recorder.start();
    setStatus('Recording...');
  }

  function stopRecording() {
    recorderRef.current?.stop();
  }

  function speakText() {
    const utter = new SpeechSynthesisUtterance(ttsText);
    const found = voices.find((v) => v.name === ttsVoice);
    if (found) utter.voice = found;
    utter.rate = clampNumber(pitchRate, 0.5, 2);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    setStatus('Speaking');
  }

  function stopSpeech() {
    window.speechSynthesis.cancel();
    setStatus('Speech stopped');
  }

  async function playUploaded(file, rate = 1) {
    const ac = await ensureRunning();
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await ac.decodeAudioData(arrayBuffer);
    const source = ac.createBufferSource();
    const master = createMaster(ac, volume);
    source.buffer = audioBuffer;
    source.playbackRate.value = rate;
    source.connect(master);
    source.start();
    nodesRef.current.push(source, master);
    setStatus(`Playing file at rate ${rate}`);
  }

  const sectionMap = {
    home: <Panel title="Home"><p>Simple, plain, Ubuntu-font audio tools inspired by the screenshot layout. Every menu item opens a block on this page. The real constraint is browser audio support, not styling.</p></Panel>,
    multi: <Panel title="Multiple Tone Generator">
      <Field label="Frequencies (comma or CSV style)"><textarea value={freqText} onChange={(e) => setFreqText(e.target.value)} rows="4" /></Field>
      <Field label="Waveform"><select value={waveform} onChange={(e) => setWaveform(e.target.value)}><option>sine</option><option>square</option><option>triangle</option><option>sawtooth</option></select></Field>
      <Field label="Duration (seconds)"><input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} /></Field>
      <div className="actions"><button onClick={() => playFrequencies(parsedFreqs.length ? parsedFreqs : [440])}>Play</button><button onClick={playSequence}>Play Sequence</button><button onClick={() => exportCurrent('wav')}>Export WAV</button><button onClick={() => exportCurrent('mp3')}>Export MP3</button><button onClick={stop}>Stop</button></div>
    </Panel>,
    pitch: <Panel title="Pitch Shifter"><Field label="Playback rate"><input type="number" step="0.1" value={pitchRate} onChange={(e) => setPitchRate(Number(e.target.value))} /></Field><Field label="Audio file"><input type="file" accept="audio/*" onChange={(e) => e.target.files?.[0] && playUploaded(e.target.files[0], pitchRate)} /></Field><p>This is browser-rate shifting, not studio-grade pitch correction. It changes pitch and speed together.</p></Panel>,
    stretch: <Panel title="Time Stretcher"><Field label="Playback rate"><input type="number" step="0.1" value={stretchRate} onChange={(e) => setStretchRate(Number(e.target.value))} /></Field><Field label="Audio file"><input type="file" accept="audio/*" onChange={(e) => e.target.files?.[0] && playUploaded(e.target.files[0], stretchRate)} /></Field><p>Same blunt limitation: browser playback rate also changes pitch. True independent time-stretching needs DSP libraries, not wishful thinking.</p></Panel>,
    voicegen: <Panel title="Voice Generator"><Field label="Text"><textarea rows="4" value={ttsText} onChange={(e) => setTtsText(e.target.value)} /></Field><Field label="Voice"><select value={ttsVoice} onChange={(e) => setTtsVoice(e.target.value)}><option value="">Default</option>{voices.map((v) => <option key={v.name} value={v.name}>{v.name}</option>)}</select></Field><Field label="Rate"><input type="number" step="0.1" value={pitchRate} onChange={(e) => setPitchRate(Number(e.target.value))} /></Field><div className="actions"><button onClick={speakText}>Speak</button><button onClick={stopSpeech}>Stop</button></div></Panel>,
    voicerec: <Panel title="Voice Recorder"><p>Records microphone input and downloads a WebM file.</p><div className="actions"><button onClick={startRecording}>Start Recording</button><button onClick={stopRecording}>Stop & Download</button></div></Panel>,
    sweep: <Panel title="Sweep Generator"><Field label="Start Frequency"><input type="number" value={sweepStart} onChange={(e) => setSweepStart(Number(e.target.value))} /></Field><Field label="End Frequency"><input type="number" value={sweepEnd} onChange={(e) => setSweepEnd(Number(e.target.value))} /></Field><Field label="Duration"><input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} /></Field><div className="actions"><button onClick={runSweep}>Run Sweep</button><button onClick={stop}>Stop</button></div></Panel>,
    tuning: <Panel title="Instrument Tuning"><Field label="Tuning Frequency"><input type="number" value={tuningFreq} onChange={(e) => setTuningFreq(Number(e.target.value))} /></Field><div className="actions"><button onClick={() => playFrequencies([tuningFreq], 5, 'sine')}>Play Reference Tone</button><button onClick={() => playFrequencies([329.63], 5, 'sine')}>E String</button><button onClick={() => playFrequencies([440], 5, 'sine')}>A String</button><button onClick={stop}>Stop</button></div></Panel>,
    subwoofer: <Panel title="Subwoofer Testing"><Field label="Bass Test Frequency"><input type="number" value={subFreq} onChange={(e) => setSubFreq(Number(e.target.value))} /></Field><div className="actions"><button onClick={() => playFrequencies([subFreq], 8, 'sine')}>Play Bass Tone</button><button onClick={runSweep}>Bass Sweep</button><button onClick={stop}>Stop</button></div></Panel>,
    hearing: <Panel title="Hearing Test"><Field label="Test Frequency"><input type="number" value={hearingStart} onChange={(e) => setHearingStart(Number(e.target.value))} /></Field><div className="actions"><button onClick={() => playFrequencies([hearingStart], 2, 'sine')}>Play Test Tone</button><button onClick={() => { setSweepStart(20); setSweepEnd(20000); runSweep(); }}>Full Range Sweep</button><button onClick={stop}>Stop</button></div></Panel>,
    alarm: <Panel title="Alarm Generator"><Field label="Alarm Frequency"><input type="number" value={alarmFreq} onChange={(e) => setAlarmFreq(Number(e.target.value))} /></Field><div className="actions"><button onClick={() => playFrequencies([alarmFreq], 0.3, 'square')}>Single Alarm</button><button onClick={() => { playFrequencies([alarmFreq, alarmFreq * 1.5], 2, 'square'); }}>Dual Alarm</button><button onClick={stop}>Stop</button></div></Panel>,
    noise: <Panel title="Noise Generator"><Field label="Noise Type"><select value={noiseKind} onChange={(e) => setNoiseKind(e.target.value)}><option value="white">White</option><option value="pink">Pink</option><option value="brown">Brown</option></select></Field><div className="actions"><button onClick={playNoise}>Start Noise</button><button onClick={stop}>Stop</button></div></Panel>,
    binaural: <Panel title="Binaural Beats"><Field label="Base Frequency"><input type="number" value={binauralBase} onChange={(e) => setBinauralBase(Number(e.target.value))} /></Field><Field label="Beat Offset"><input type="number" value={binauralBeat} onChange={(e) => setBinauralBeat(Number(e.target.value))} /></Field><div className="actions"><button onClick={playBinaural}>Play with Headphones</button><button onClick={stop}>Stop</button></div></Panel>,
    hz432: <Panel title="432Hz Frequency"><p>This is just a preset. There is nothing mystical in the code.</p><div className="actions"><button onClick={() => playFrequencies([432], 5, 'sine')}>Play 432Hz</button><button onClick={() => playFrequencies([440], 5, 'sine')}>Play 440Hz</button><button onClick={stop}>Stop</button></div></Panel>,
    dtmf: <Panel title="DTMF Signals"><Field label="Key"><select value={dtmfKey} onChange={(e) => setDtmfKey(e.target.value)}>{Object.keys(dtmfMap).map((k) => <option key={k}>{k}</option>)}</select></Field><div className="actions"><button onClick={playDTMF}>Play DTMF</button><button onClick={stop}>Stop</button></div></Panel>,
    metro: <Panel title="Metronome"><Field label="BPM"><input type="number" value={bpm} onChange={(e) => setBpm(Number(e.target.value))} /></Field><div className="actions"><button onClick={startMetronome}>Start</button><button onClick={() => { if (metroTimer.current) clearInterval(metroTimer.current); stop(); setStatus('Metronome stopped'); }}>Stop</button></div></Panel>,
    pips: <Panel title="The Pips"><p>Simple six-pip pattern similar to time signal pips.</p><div className="actions"><button onClick={playPips}>Play Pips</button><button onClick={stop}>Stop</button></div></Panel>,
    theory: <Panel title="Acoustic Theory"><ul><li>Frequency = cycles per second.</li><li>Amplitude = loudness proxy.</li><li>Waveform changes harmonic content.</li><li>Binaural beats require stereo separation.</li><li>Pitch shift and time stretch are not the same thing in real DSP.</li></ul></Panel>,
    shop: <Panel title="Shop"><p>Placeholder. Add affiliate links, Gumroad products, or your own downloadable tone packs here.</p></Panel>,
    about: <Panel title="About"><p>Built as a simple React/Vite project with plain styling, Ubuntu font, and hue-heavy blocks. It is inspired by the layout you shared, not a pixel-copy clone.</p></Panel>,
  };

  const toolsDashboard = (
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

  const homePage = (
    <div className="page-stack">
      <Panel title="Audionyx">
        <p>Free browser-based audio tools for beginners, casual headphone testing, and simple frequency experiments. This version is optimized for traffic pages first, not fake polish.</p>
        <div className="hero-cta-row">
          <button onClick={() => navigateTo('/hearing-test')}>Open hearing test</button>
          <button onClick={() => navigateTo('/tone-generator')}>Open tone generator</button>
          <button onClick={() => navigateTo('/sleep-frequencies')}>Sleep frequencies</button>
          <button onClick={() => navigateTo('/frequency-guide')}>Frequency guide</button>
          <button onClick={() => navigateTo('/support')}>Support this project</button>
        </div>
      </Panel>

      <SeoBlock title="Traffic pages that actually matter" intro="You said you want traffic. These are the pages built to target beginner intent first.">
        <div className="card-grid three-up">
          <article className="info-card"><h4>Hearing Test</h4><p>Targets the keyword “hearing test online free”.</p><button onClick={() => navigateTo('/hearing-test')}>Visit page</button></article>
          <article className="info-card"><h4>Simple Tone Generator</h4><p>Targets “test sound online” and related speaker check intent.</p><button onClick={() => navigateTo('/tone-generator')}>Visit page</button></article>
          <article className="info-card"><h4>Sleep Frequencies</h4><p>Targets “frequency for sleep” without pretending there is medical proof for every frequency myth.</p><button onClick={() => navigateTo('/sleep-frequencies')}>Visit page</button></article>
        </div>
      </SeoBlock>

      {toolsDashboard}
    </div>
  );

  const hearingPage = (
    <div className="page-stack">
      <Panel title="Free Online Hearing Test">
        <p>Use headphones. Laptop speakers distort results and ruin the point of the test. This page is built for the keyword “hearing test online free”.</p>
        <div className="quick-grid">
          {[250, 500, 1000, 4000, 8000, 12000].map((freq) => (
            <button key={freq} onClick={() => playFrequencies([freq], 2, 'sine')}>{freq} Hz</button>
          ))}
        </div>
        <div className="actions spaced-top"><button onClick={() => { setSweepStart(20); setSweepEnd(20000); setDuration(12); runSweep(); }}>Run full sweep</button><button onClick={stop}>Stop</button></div>
      </Panel>

      <SeoBlock title="How to use this hearing test" intro="Start low, increase gradually, and do not blast volume. That is stupid and unsafe.">
        <ul>
          <li>Use wired or accurate headphones if possible.</li>
          <li>Keep volume moderate, not maxed.</li>
          <li>Test both ears separately if you want meaningful comparisons.</li>
        </ul>
      </SeoBlock>

      <SeoBlock title="Headphones that make this page more useful" intro="These are placeholder affiliate slots. Replace them with real affiliate links before launch.">
        <div className="card-grid">
          <AffiliateCard {...affiliateProducts[0]} />
          <AffiliateCard title="Budget wired headphones" copy="Another placeholder for a lower-cost option. Cheap is fine if the sound is consistent and the seal is decent." href="https://www.amazon.com/" />
        </div>
      </SeoBlock>
    </div>
  );

  const toneGeneratorPage = (
    <div className="page-stack">
      <Panel title="Simple Online Tone Generator">
        <p>Fast, plain, and usable. This page targets “test sound online”.</p>
        <Field label="Frequency list"><textarea value={freqText} onChange={(e) => setFreqText(e.target.value)} rows="3" /></Field>
        <Field label="Waveform"><select value={waveform} onChange={(e) => setWaveform(e.target.value)}><option>sine</option><option>square</option><option>triangle</option><option>sawtooth</option></select></Field>
        <Field label="Duration"><input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} /></Field>
        <div className="quick-grid">
          {[100, 250, 440, 1000, 5000].map((freq) => (
            <button key={freq} onClick={() => playFrequencies([freq], duration, waveform)}>{freq} Hz</button>
          ))}
        </div>
        <div className="actions spaced-top"><button onClick={() => playFrequencies(parsedFreqs.length ? parsedFreqs : [440])}>Play</button><button onClick={() => exportCurrent('wav')}>Export WAV</button><button onClick={() => exportCurrent('mp3')}>Export MP3</button><button onClick={stop}>Stop</button></div>
      </Panel>

      <SeoBlock title="What this page is actually good for" intro="Not everything. It is useful for quick speaker checks, channel checks, and reference tones.">
        <ul>
          <li>Basic speaker testing</li>
          <li>Checking whether a device can reproduce a frequency range</li>
          <li>Generating a quick reference tone for music practice</li>
        </ul>
      </SeoBlock>

      <SeoBlock title="Related tools" intro="Push users deeper into the site or they leave after one click.">
        <div className="card-grid three-up">
          <article className="info-card"><h4>Subwoofer testing</h4><p>Low-frequency checks for bass-heavy setups.</p><button onClick={() => setActive('subwoofer')}>Open tool block</button></article>
          <article className="info-card"><h4>Sweep generator</h4><p>Run rising or falling sweeps across a range.</p><button onClick={() => setActive('sweep')}>Open tool block</button></article>
          <article className="info-card"><h4>Frequency guide</h4><p>Help beginners choose a starting point.</p><button onClick={() => navigateTo('/frequency-guide')}>Open guide</button></article>
        </div>
      </SeoBlock>
    </div>
  );

  const sleepPage = (
    <div className="page-stack">
      <Panel title="Sleep and Relaxation Frequencies">
        <p>This page targets “frequency for sleep”. Do not oversell it. Some people like these tones. That does not make them medically magical.</p>
        <div className="quick-grid">
          {[432, 440, 528, 174].map((freq) => (
            <button key={freq} onClick={() => playFrequencies([freq], 300, 'sine')}>{freq} Hz</button>
          ))}
        </div>
        <div className="actions spaced-top"><button onClick={playNoise}>Start background noise</button><button onClick={playBinaural}>Play binaural beat</button><button onClick={stop}>Stop</button></div>
      </Panel>

      <SeoBlock title="Common frequency presets people try" intro="These are common internet presets, not guaranteed treatment.">
        <div className="card-grid three-up">
          <article className="info-card"><h4>432 Hz</h4><p>Popular because it is easy to market, not because the code discovered enlightenment.</p></article>
          <article className="info-card"><h4>174 Hz</h4><p>Often included in relaxation playlists.</p></article>
          <article className="info-card"><h4>White or brown noise</h4><p>Often more useful than one fixed tone for masking background sound.</p></article>
        </div>
      </SeoBlock>

      <SeoBlock title="Sleep product affiliate slots" intro="A better fit here is comfort-first hardware, not studio hardware.">
        <div className="card-grid">
          <AffiliateCard {...affiliateProducts[1]} />
          <AffiliateCard title="White noise machine" copy="Another logical affiliate product for this page. Tighter fit equals better conversion." href="https://www.amazon.com/" />
        </div>
      </SeoBlock>
    </div>
  );

  const guidePage = (
    <div className="page-stack">
      <Panel title="What Frequency Should I Use?">
        <p>This guide exists for search traffic and internal linking. It should answer beginner questions fast and push them into the right tool.</p>
        <div className="table-like">
          <div><strong>Sleep or relaxation</strong><span>Try 174 Hz, 432 Hz, 528 Hz, or noise tools.</span></div>
          <div><strong>Hearing checks</strong><span>Try 250 Hz to 12 kHz manually, then run a sweep.</span></div>
          <div><strong>Speaker testing</strong><span>Try 100 Hz, 440 Hz, 1 kHz, and a sweep.</span></div>
          <div><strong>Subwoofer testing</strong><span>Try 20 Hz to 80 Hz. Cheap speakers often fake bass badly.</span></div>
        </div>
      </Panel>

      <SeoBlock title="Choose by goal, not by hype" intro="Beginners usually want a shortcut. Here it is.">
        <div className="card-grid three-up">
          <article className="info-card"><h4>I want to test my hearing</h4><button onClick={() => navigateTo('/hearing-test')}>Go to hearing test</button></article>
          <article className="info-card"><h4>I want a simple sound test</h4><button onClick={() => navigateTo('/tone-generator')}>Go to tone generator</button></article>
          <article className="info-card"><h4>I want something to sleep to</h4><button onClick={() => navigateTo('/sleep-frequencies')}>Go to sleep frequencies</button></article>
        </div>
      </SeoBlock>
    </div>
  );

  const supportPage = (
    <div className="page-stack">
      <Panel title="Support Audionyx">
        <p>If this project saves you time, support it. That is cleaner than pretending ads alone will pay for everything.</p>
        <div className="support-box">
          <h3>Buy me a coffee</h3>
          <p>Replace the PayPal email below before production. Right now it is a placeholder.</p>
          <form action="https://www.paypal.com/donate" method="post" target="_blank" className="paypal-form">
            <input type="hidden" name="business" value="YOUR_PAYPAL_EMAIL@example.com" />
            <input type="hidden" name="currency_code" value="USD" />
            <button type="submit">Pay with PayPal</button>
          </form>
        </div>
      </Panel>

      <SeoBlock title="Other monetization slots" intro="Put AdSense blocks and affiliate placements on the content pages, not here alone.">
        <ul>
          <li>Header ad block above hearing test results</li>
          <li>Affiliate links below hearing test and sleep pages</li>
          <li>Optional Gumroad pack for downloadable tone bundles</li>
        </ul>
      </SeoBlock>
    </div>
  );

  const pageMap = {
    '/': homePage,
    '/hearing-test': hearingPage,
    '/tone-generator': toneGeneratorPage,
    '/sleep-frequencies': sleepPage,
    '/frequency-guide': guidePage,
    '/support': supportPage,
  };

  return (
    <div className="site-shell">
      <header className="site-header">
        <div>
          <h1>Audionyx</h1>
          <p className="site-tagline">Simple online tone tools, hearing checks, and practical frequency pages.</p>
        </div>
        <div className="status">{status}</div>
      </header>
      <MarketingNav currentPath={currentPath} />
      <main className="page-frame">
        {pageMap[currentPath] || homePage}
      </main>
    </div>
  );
}
