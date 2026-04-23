import Panel from '../components/Panel';
import SeoBlock from '../components/SeoBlock';
import MouseTrailCanvas from '../components/MouseTrailCanvas';

export default function MotionTracePage() {
  return (
    <div className="page-stack">
      <Panel title="Motion Trace Tab">
        <p>
          Move the mouse inside the canvas to draw a continuous line. When the pointer leaves the window,
          drawing pauses, and when it re-enters, the line continues from the same evolving history.
        </p>
      </Panel>

      <MouseTrailCanvas />

      <SeoBlock
        title="Interaction Rules"
        intro="This experiment follows your requested behavior closely."
      >
        <ul>
          <li>Drawing follows mouse movement only while the pointer is inside the window.</li>
          <li>The line history is preserved instead of resetting when the pointer leaves.</li>
          <li>Re-entering the window continues the same trace rather than starting over.</li>
        </ul>
      </SeoBlock>
    </div>
  );
}
