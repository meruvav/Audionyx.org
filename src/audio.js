export const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
export const hz = (v) => `${Number(v).toFixed(2)} Hz`;

let ctx;
export function getAudioContext() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
}

export async function ensureRunning() {
  const ac = getAudioContext();
  if (ac.state === 'suspended') await ac.resume();
  return ac;
}

export function stopNodes(nodes = []) {
  nodes.forEach((node) => {
    try {
      if (typeof node.stop === 'function') node.stop();
    } catch {}
    try { node.disconnect(); } catch {}
  });
}

export function createMaster(ac, volume = 0.4) {
  const gain = ac.createGain();
  gain.gain.value = volume;
  gain.connect(ac.destination);
  return gain;
}

export function createAnalyser(ac, destination) {
  const analyser = ac.createAnalyser();
  analyser.fftSize = 2048;
  analyser.connect(destination);
  return analyser;
}

export function createOsc(ac, freq, type = 'sine') {
  const osc = ac.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ac.currentTime);
  return osc;
}

export function createNoise(ac, kind = 'white') {
  const bufferSize = ac.sampleRate * 2;
  const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
  const data = buffer.getChannelData(0);
  let lastOut = 0;
  for (let i = 0; i < bufferSize; i += 1) {
    const white = Math.random() * 2 - 1;
    if (kind === 'white') data[i] = white;
    else if (kind === 'pink') {
      lastOut = 0.98 * lastOut + 0.02 * white;
      data[i] = lastOut * 3.5;
    } else {
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }
  }
  const source = ac.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  return source;
}

export function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i += 1) view.setUint8(offset + i, string.charCodeAt(i));
}

export function audioBufferToWav(buffer) {
  const numberOfChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const bitDepth = 16;
  const frameLength = buffer.length;
  const blockAlign = (numberOfChannels * bitDepth) / 8;
  const dataSize = frameLength * blockAlign;
  const arrayBuffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(arrayBuffer);
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);
  let offset = 44;
  for (let i = 0; i < frameLength; i += 1) {
    for (let c = 0; c < numberOfChannels; c += 1) {
      const sample = Math.max(-1, Math.min(1, buffer.getChannelData(c)[i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }
  return new Blob([view], { type: 'audio/wav' });
}

export async function renderToneToBuffer({ frequencies = [440], waveform = 'sine', duration = 2, volume = 0.4 }) {
  const ac = new OfflineAudioContext(2, Math.ceil(44100 * duration), 44100);
  const gain = ac.createGain();
  gain.gain.value = volume / Math.max(frequencies.length, 1);
  gain.connect(ac.destination);
  frequencies.forEach((freq, index) => {
    const osc = ac.createOscillator();
    const pan = ac.createStereoPanner();
    pan.pan.value = frequencies.length === 1 ? 0 : -0.8 + (1.6 * index) / (frequencies.length - 1);
    osc.type = waveform;
    osc.frequency.value = freq;
    osc.connect(pan);
    pan.connect(gain);
    osc.start(0);
    osc.stop(duration);
  });
  return ac.startRendering();
}

export async function encodeMp3FromBuffer(audioBuffer) {
  const lame = window.lamejs;
  if (!lame) throw new Error('lamejs not loaded');
  const left = audioBuffer.getChannelData(0);
  const right = audioBuffer.getChannelData(1);
  const encoder = new lame.Mp3Encoder(2, audioBuffer.sampleRate, 128);
  const blockSize = 1152;
  const out = [];
  const convert = (arr) => {
    const out = new Int16Array(arr.length);
    for (let i = 0; i < arr.length; i += 1) {
      const s = Math.max(-1, Math.min(1, arr[i]));
      out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return out;
  };
  const l = convert(left);
  const r = convert(right);
  for (let i = 0; i < l.length; i += blockSize) {
    const buf = encoder.encodeBuffer(l.subarray(i, i + blockSize), r.subarray(i, i + blockSize));
    if (buf.length) out.push(new Int8Array(buf));
  }
  const end = encoder.flush();
  if (end.length) out.push(new Int8Array(end));
  return new Blob(out, { type: 'audio/mpeg' });
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function parseFrequencies(text) {
  return text.split(/\r?\n|,/).map((s) => Number(s.trim())).filter((n) => Number.isFinite(n) && n >= 20 && n <= 20000);
}
