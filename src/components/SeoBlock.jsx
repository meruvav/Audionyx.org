export default function SeoBlock({ title, intro, children }) {
  return (
    <section className="seo-block">
      <h3>{title}</h3>
      <p>{intro}</p>
      {children}
    </section>
  );
}
