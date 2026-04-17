export default function AffiliateCard({ title, description, link, tag }) {
  return (
    <div style={{
      border: "1px solid #ddd",
      padding: "16px",
      borderRadius: "10px",
      marginTop: "16px",
      background: "#f9fafb"
    }}>
      <h3>{title}</h3>
      <p>{description}</p>

      <button
        onClick={() => window.open(link, "_blank")}
        style={{
          marginTop: "10px",
          padding: "10px 14px",
          background: "#ff9900",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        View on Amazon →
      </button>

      {tag && (
        <div style={{
          marginTop: "8px",
          fontSize: "12px",
          color: "#666"
        }}>
          {tag}
        </div>
      )}
    </div>
  );
}
