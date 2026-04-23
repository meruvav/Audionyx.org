import bassImage from '../assets/cymatics/cymatics-bass.svg';
import highImage from '../assets/cymatics/cymatics-high.svg';
import midImage from '../assets/cymatics/cymatics-mid.svg';
import noiseImage from '../assets/cymatics/cymatics-noise.svg';
import sweepImage from '../assets/cymatics/cymatics-sweep.svg';

const visualImages = {
  bass: bassImage,
  high: highImage,
  mid: midImage,
  noise: noiseImage,
  sweep: sweepImage,
};

export default function FrequencyVisual({ visual }) {
  const imageSrc = visual ? visualImages[visual.profile] : null;

  return (
    <section className="frequency-visual">
      <div className="frequency-visual-copy">
        <p className="visual-eyebrow">Frequency in motion</p>
        <h3>Sand pattern style engagement</h3>
        <p>
          {visual
            ? `${visual.title} is active. This original cymatics-style image shifts with the frequency range to make the listening experience feel more alive.`
            : 'Press play to reveal an original cymatics-style visual inspired by sand patterns that form on vibrating speaker plates.'}
        </p>
      </div>
      <div className={`frequency-visual-frame${visual ? ' active' : ''}`}>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={visual.alt}
            className="frequency-visual-image"
          />
        ) : (
          <div className="frequency-visual-placeholder">
            <span>Play a tone to reveal the pattern</span>
          </div>
        )}
      </div>
    </section>
  );
}
