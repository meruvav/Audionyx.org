import Panel from '../components/Panel';
import SeoBlock from '../components/SeoBlock';

export default function AboutPage() {
  return (
    <div className="page-stack">
      <Panel title="About Audionyx">
        <p>
          Audionyx is a browser-based collection of tone tools, hearing checks, and
          practical frequency pages designed to be fast, simple, and useful.
        </p>
        <p>
          For comments or suggestions, use the contact details on the support page.
          The goal is straightforward: make audio utility tools easy to access without
          burying them under heavy UI.
        </p>
      </Panel>

      <SeoBlock
        title="Built with Web Audio"
        intro="This site format follows the same practical structure as classic online tone tools: clear menu, simple explanation, then technical context."
      >
        <p>
          Audionyx uses modern browser audio capabilities through the HTML5 Web Audio
          API, which lets the app generate tones, sweeps, noise, and playback tools
          directly in the browser.
        </p>
      </SeoBlock>

      <SeoBlock
        title="How frequencies are handled"
        intro="The frequency tools are meant for testing, practice, and reference use."
      >
        <ul>
          <li>Reference tones are presented in a simple, beginner-friendly interface.</li>
          <li>Common presets are included for hearing checks, sleep audio, and speaker testing.</li>
          <li>Musical references use A4 = 440 Hz as the base tuning assumption.</li>
        </ul>
      </SeoBlock>

      <SeoBlock
        title="Where the project is headed"
        intro="The structure now supports dedicated pages, reusable sections, and cleaner routing."
      >
        <div className="card-grid three-up">
          <article className="info-card">
            <h4>More landing pages</h4>
            <p>Search-focused pages can now be added without stuffing everything into one file.</p>
          </article>
          <article className="info-card">
            <h4>More tools</h4>
            <p>The tools dashboard can keep growing while public pages stay easy to navigate.</p>
          </article>
          <article className="info-card">
            <h4>Better support flow</h4>
            <p>Support, sharing, and affiliate placement can now live in clearer, more purposeful sections.</p>
          </article>
        </div>
      </SeoBlock>
    </div>
  );
}
