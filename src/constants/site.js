export const sections = [
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

export const marketingRoutes = [
  { path: '/', label: 'Home' },
  { path: '/motion-trace', label: 'Motion Trace' },
  { path: '/right-angle-growth', label: 'Bubble Growth' },
  { path: '/calculators', label: 'Calculators' },
  { path: '/hearing-test', label: 'Hearing Test' },
  { path: '/tone-generator', label: 'Tone Generator' },
  { path: '/sleep-frequencies', label: 'Sleep Frequencies' },
  { path: '/frequency-guide', label: 'Frequency Guide' },
  { path: '/about', label: 'About' },
  { path: '/support', label: 'Support' },
];

export const routeTitles = {
  '/': 'Audionyx - Free online hearing test, tone generator, and sleep frequencies',
  '/motion-trace': 'Motion Trace Experiment | Audionyx',
  '/right-angle-growth': 'Bubble Growth Experiment | Audionyx',
  '/calculators': 'Free Online Calculators | Audionyx',
  '/hearing-test': 'Free Online Hearing Test | Audionyx',
  '/tone-generator': 'Simple Online Tone Generator | Audionyx',
  '/sleep-frequencies': 'Sleep and Relaxation Frequencies | Audionyx',
  '/frequency-guide': 'What Frequency Should I Use? | Audionyx',
  '/about': 'About Audionyx',
  '/support': 'Support Audionyx',
  '/tools': 'Audio Tools Dashboard | Audionyx',
};

export const dtmfMap = {
  '1': [697, 1209],
  '2': [697, 1336],
  '3': [697, 1477],
  '4': [770, 1209],
  '5': [770, 1336],
  '6': [770, 1477],
  '7': [852, 1209],
  '8': [852, 1336],
  '9': [852, 1477],
  '*': [941, 1209],
  '0': [941, 1336],
  '#': [941, 1477],
};

export const affiliateProducts = [
  {
    title: 'Closed-back monitoring headphones',
    copy: 'Use this slot for accurate closed-back headphones for hearing checks and monitoring.',
    href: 'https://www.amazon.com/Audio-Technica-ATH-M50x-Professional-Monitor-Headphones/dp/B00HVLUR86/',
  },
  {
    title: 'Comfort headphones for sleep',
    copy: 'Use this slot for sleep-first headphones or low-profile earbuds with a comfortable fit.',
    href: 'https://www.amazon.com/Audio-Technica-ATH-M20x-Professional-Monitor-Headphones/dp/B00HVLUR18/',
  },
];
