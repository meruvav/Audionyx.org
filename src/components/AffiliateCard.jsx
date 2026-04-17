export default function AffiliateCard({ title, copy, href, tag }) {
  return (
    <article className="affiliate-card">
      <h3>{title}</h3>
      <p>{copy}</p>
      <a href={href} target="_blank" rel="noreferrer" className="button-link">Open affiliate placeholder</a>
      {tag ? <div className="affiliate-tag">{tag}</div> : null}
    </article>
  );
}
