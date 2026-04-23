import Panel from '../components/Panel';
import RightAngleGrowthCanvas from '../components/RightAngleGrowthCanvas';
import SeoBlock from '../components/SeoBlock';

export default function RightAngleGrowthPage() {
  return (
    <div className="page-stack">
      <Panel title="Right-Angle Growth Tab">
        <p>
          This canvas starts with two perpendicular lines, then duplicates and rotates them in 90-degree
          steps moving toward the right, continuing until the user clicks the canvas.
        </p>
      </Panel>

      <RightAngleGrowthCanvas />

      <SeoBlock
        title="Interaction Rules"
        intro="This experiment interprets your requested geometry as an expanding orthogonal branching system."
      >
        <ul>
          <li>It begins with two 90-degree lines.</li>
          <li>Each generation copies and rotates the lines by 90 degrees while advancing rightward.</li>
          <li>The process continues automatically until the user clicks in the window.</li>
        </ul>
      </SeoBlock>
    </div>
  );
}
