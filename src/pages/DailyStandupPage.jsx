import { useMemo, useState } from 'react';
import SeoBlock from '../components/SeoBlock';

const standupNames = [
  {
    name: 'Daily Sync',
    tone: 'Clear and professional',
    copy: 'A simple, familiar name for quick alignment, blockers, and next steps.',
  },
  {
    name: 'Morning Pulse',
    tone: 'Energetic and branded',
    copy: 'A memorable option for teams that want the meeting to feel focused and alive.',
  },
  {
    name: 'Team Huddle',
    tone: 'Friendly and collaborative',
    copy: 'An approachable name that makes the daily check-in feel less corporate.',
  },
];

const pickerColors = ['#58c5ff', '#8ef7d4', '#6b8cff', '#f9d65c', '#ff8aa3', '#b99cff', '#7ce8ff', '#77dd88'];

function getRandomIndex(length) {
  if (length <= 0) return -1;
  if (window.crypto?.getRandomValues) {
    const values = new Uint32Array(1);
    window.crypto.getRandomValues(values);
    return values[0] % length;
  }
  return Math.floor(Math.random() * length);
}

export default function DailyStandupPage() {
  const [pickerText, setPickerText] = useState(standupNames.map((option) => option.name).join('\n'));
  const [pickedName, setPickedName] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);

  const pickerNames = useMemo(
    () => pickerText
      .split(/\r?\n|,/)
      .map((name) => name.trim())
      .filter(Boolean),
    [pickerText],
  );

  const wheelGradient = useMemo(() => {
    if (pickerNames.length === 0) {
      return 'linear-gradient(135deg, rgba(88, 197, 255, 0.32), rgba(142, 247, 212, 0.22))';
    }

    const slice = 100 / pickerNames.length;
    return `conic-gradient(${pickerNames.map((name, index) => {
      const start = index * slice;
      const end = (index + 1) * slice;
      return `${pickerColors[index % pickerColors.length]} ${start}% ${end}%`;
    }).join(', ')})`;
  }, [pickerNames]);

  const spinPicker = () => {
    if (pickerNames.length === 0 || isSpinning) return;

    const nextIndex = getRandomIndex(pickerNames.length);
    const baseTurns = 1440;
    const sliceDegrees = 360 / pickerNames.length;
    const targetOffset = 360 - (nextIndex * sliceDegrees + sliceDegrees / 2);
    const nextRotation = Math.ceil(wheelRotation / 360) * 360 + baseTurns + targetOffset;

    setIsSpinning(true);
    setPickedName('');
    setWheelRotation(nextRotation);

    window.setTimeout(() => {
      setPickedName(pickerNames[nextIndex]);
      setIsSpinning(false);
    }, 1500);
  };

  const removePickedName = () => {
    if (!pickedName) return;
    setPickerText((currentText) => currentText
      .split(/\r?\n|,/)
      .map((name) => name.trim())
      .filter((name) => name && name !== pickedName)
      .join('\n'));
    setPickedName('');
  };

  const resetPicker = () => {
    setPickerText(standupNames.map((option) => option.name).join('\n'));
    setPickedName('');
    setWheelRotation(0);
  };

  return (
    <div className="page-stack">
      <SeoBlock
        title="Daily Standup"
        intro="Add names, spin the picker, and choose a random meeting name or team member for the next daily standup."
      >
        <div className="standup-picker">
          <div className="standup-picker-controls">
            <label className="field standup-picker-field">
              <span>Names</span>
              <textarea
                value={pickerText}
                onChange={(event) => {
                  setPickerText(event.target.value);
                  setPickedName('');
                }}
                rows="8"
                placeholder="Add one name per line"
              />
            </label>
            <div className="standup-picker-actions">
              <button type="button" onClick={spinPicker} disabled={pickerNames.length === 0 || isSpinning}>
                {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
              </button>
              <button type="button" className="standup-secondary-btn" onClick={resetPicker}>
                Reset
              </button>
            </div>
            <p className="standup-picker-count">{pickerNames.length} active {pickerNames.length === 1 ? 'name' : 'names'}</p>
          </div>

          <div className="standup-wheel-area">
            <div className="standup-wheel-pointer" />
            <div
              className={`standup-wheel${isSpinning ? ' spinning' : ''}`}
              style={{ background: wheelGradient, transform: `rotate(${wheelRotation}deg)` }}
              aria-hidden="true"
            >
              <div className="standup-wheel-center">Spin</div>
            </div>
            <div className="standup-picker-result" aria-live="polite">
              <span>Selected</span>
              <strong>{pickedName || (isSpinning ? 'Choosing...' : 'Ready')}</strong>
              {pickedName && (
                <button type="button" className="standup-secondary-btn" onClick={removePickedName}>
                  Remove Picked Name
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="standup-name-grid">
          {standupNames.map((option) => (
            <article key={option.name} className="standup-name-card">
              <span>{option.tone}</span>
              <h4>{option.name}</h4>
              <p>{option.copy}</p>
            </article>
          ))}
        </div>
      </SeoBlock>
    </div>
  );
}
