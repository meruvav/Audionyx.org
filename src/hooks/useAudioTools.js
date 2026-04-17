import { useEffect, useMemo, useRef, useState } from 'react';
import {
  audioBufferToWav,
  createMaster,
  createNoise,
  createOsc,
  downloadBlob,
  encodeMp3FromBuffer,
  ensureRunning,
  parseFrequencies,
  renderToneToBuffer,
  stopNodes,
} from '../audio';
import { dtmfMap } from '../constants/site';

function clampNumber(value, min, max) {
  return Math.min(Math.max(Number(value), min), max);
}

function useAudioStopper() {
  const nodesRef = useRef([]);

  const stop = () => {
    stopNodes(nodesRef.current);
    nodesRef.current = [];
  };

  return { nodesRef, stop };
}

export function useAudioTools() {
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

    loadVoices();
    window.speechSynthesis?.addEventListener?.('voiceschanged', loadVoices);

    return () => {
      window.speechSynthesis?.removeEventListener?.('voiceschanged', loadVoices);
      stop();
      window.speechSynthesis?.cancel();
      if (metroTimer.current) {
        clearInterval(metroTimer.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const parsedFreqs = useMemo(() => parseFrequencies(freqText), [freqText]);
  const parsedSeq = useMemo(() => parseFrequencies(csvSeq), [csvSeq]);

  async function playFrequencies(frequencies, seconds = duration, type = waveform, stereo = false) {
    stop();
    const ac = await ensureRunning();
    const master = createMaster(ac, volume / Math.max(frequencies.length, 1));
    nodesRef.current.push(master);

    frequencies.forEach((frequency, index) => {
      const osc = createOsc(ac, frequency, type);
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
    const buffer = await renderToneToBuffer({
      frequencies: parsedFreqs.length ? parsedFreqs : [440],
      waveform,
      duration,
      volume,
    });
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
    setStatus(`Sweep ${sweepStart} to ${sweepEnd} Hz`);
  }

  async function playSequence() {
    stop();
    const ac = await ensureRunning();
    const master = createMaster(ac, volume);
    nodesRef.current.push(master);

    parsedSeq.forEach((frequency, index) => {
      const osc = createOsc(ac, frequency, waveform);
      osc.connect(master);
      const start = ac.currentTime + index * 0.5;
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
    if (!tones) {
      return;
    }

    await playFrequencies(tones, 0.4, 'sine');
    setStatus(`DTMF ${dtmfKey}`);
  }

  async function startMetronome() {
    stop();
    if (metroTimer.current) {
      clearInterval(metroTimer.current);
    }

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

  function stopMetronome() {
    if (metroTimer.current) {
      clearInterval(metroTimer.current);
      metroTimer.current = null;
    }
    stop();
    setStatus('Metronome stopped');
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
    recorder.ondataavailable = (event) => recorderChunksRef.current.push(event.data);
    recorder.onstop = () => {
      const blob = new Blob(recorderChunksRef.current, { type: 'audio/webm' });
      downloadBlob(blob, 'recording.webm');
      stream.getTracks().forEach((track) => track.stop());
      if (streamRef.current === stream) {
        streamRef.current = null;
      }
      setStatus('Recording downloaded');
    };
    recorder.start();
    setStatus('Recording...');
  }

  function stopRecording() {
    recorderRef.current?.stop();
  }

  function speakText() {
    const utterance = new SpeechSynthesisUtterance(ttsText);
    const voice = voices.find((item) => item.name === ttsVoice);
    if (voice) {
      utterance.voice = voice;
    }
    utterance.rate = clampNumber(pitchRate, 0.5, 2);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
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

  return {
    active,
    setActive,
    status,
    freqText,
    setFreqText,
    waveform,
    setWaveform,
    duration,
    setDuration,
    volume,
    setVolume,
    csvSeq,
    setCsvSeq,
    pitchRate,
    setPitchRate,
    stretchRate,
    setStretchRate,
    ttsText,
    setTtsText,
    ttsVoice,
    setTtsVoice,
    sweepStart,
    setSweepStart,
    sweepEnd,
    setSweepEnd,
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
    binauralBase,
    setBinauralBase,
    binauralBeat,
    setBinauralBeat,
    dtmfKey,
    setDtmfKey,
    bpm,
    setBpm,
    voices,
    parsedFreqs,
    parsedSeq,
    playFrequencies,
    exportCurrent,
    runSweep,
    playSequence,
    playNoise,
    playBinaural,
    playDTMF,
    startMetronome,
    stopMetronome,
    playPips,
    startRecording,
    stopRecording,
    speakText,
    stopSpeech,
    playUploaded,
    stop,
  };
}
