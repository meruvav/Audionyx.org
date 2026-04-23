import Panel from '../components/Panel';
import RightAngleGrowthCanvas from '../components/RightAngleGrowthCanvas';
import SeoBlock from '../components/SeoBlock';

export default function RightAngleGrowthPage() {
  return (
    <div className="page-stack">
      <Panel title="Bubble Growth Tab">
        <p>
          This interaction now turns the tab into a live bubble field. As the mouse moves, it generates
          random-size bubbles that keep building into a layered composition until the clear button is pressed.
        </p>
      </Panel>

      <RightAngleGrowthCanvas />

      <SeoBlock
        title="Interaction Rules"
        intro="This experiment is now a persistent mouse-reactive bubble sketch built to keep the screen feeling alive."
      >
        <ul>
          <li>Mouse movement spawns fresh bubbles automatically.</li>
          <li>Bubble sizes, drift, and color accents vary on each pass.</li>
          <li>The scene continues to accumulate until the user clicks the clear button.</li>
        </ul>
      </SeoBlock>
    </div>
  );
}
