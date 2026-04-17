import Panel from '../components/Panel';
import SeoBlock from '../components/SeoBlock';

export default function SupportPage() {
  return (
    <div className="page-stack">
      <Panel title="Support Audionyx">
        <p>
          If Audionyx helps you test speakers, check hearing ranges, or generate tones
          quickly, you can support the project directly and help it keep growing.
        </p>
        <div className="support-box">
          <h3>Buy me a coffee</h3>
          <p>
            Support keeps the site online and helps fund more tools, more landing pages,
            and ongoing improvements to the browser audio experience.
          </p>
          <form action="https://www.paypal.com/donate" method="post" target="_blank" className="paypal-form">
            <input type="hidden" name="business" value="YOUR_PAYPAL_EMAIL@example.com" />
            <input type="hidden" name="currency_code" value="USD" />
            <button type="submit">Pay with PayPal</button>
          </form>
        </div>
      </Panel>

      <SeoBlock
        title="What support helps fund"
        intro="This section is inspired by the Ko-fi support format: short, direct, and focused on what the contribution actually enables."
      >
        <div className="card-grid three-up">
          <article className="info-card">
            <h4>New tools</h4>
            <p>More generators, better presets, and cleaner tool flows for common audio tasks.</p>
          </article>
          <article className="info-card">
            <h4>More content pages</h4>
            <p>Additional search-friendly pages for hearing checks, frequency guides, and device testing.</p>
          </article>
          <article className="info-card">
            <h4>Ongoing maintenance</h4>
            <p>Hosting, browser compatibility work, bug fixes, and continued refinement of the site.</p>
          </article>
        </div>
      </SeoBlock>

      <SeoBlock
        title="Other ways to help"
        intro="The referenced support page also emphasizes sharing, so this page now does the same."
      >
        <ul>
          <li>Share the hearing test or tone generator page with people who need a quick browser tool.</li>
          <li>Link to Audionyx from blog posts, playlists, audio forums, or creator resources.</li>
          <li>Use the affiliate links on relevant pages if you were already planning to buy gear.</li>
        </ul>
      </SeoBlock>

      <SeoBlock
        title="Support roadmap"
        intro="A support page works better when visitors can see what comes next."
      >
        <div className="table-like">
          <div><strong>Short term</strong><span>Expand the routed page set and improve affiliate placement around the most-used tools.</span></div>
          <div><strong>Mid term</strong><span>Add more polished audio testing utilities and clearer educational content.</span></div>
          <div><strong>Long term</strong><span>Build a stronger ecosystem around downloadable tools, guides, and creator support.</span></div>
        </div>
      </SeoBlock>
    </div>
  );
}
