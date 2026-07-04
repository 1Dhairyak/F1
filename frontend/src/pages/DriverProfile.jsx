import { useParams, Link } from "react-router-dom";
import driverData from "../data/driverData";
import Layout from "../components/Layout";

function StatCard({ label, value }) {
  return (
    <div className="vg-glass" style={{ padding: "20px", textAlign: "center" }}>
      <div className="vg-headline" style={{ fontSize: "28px", color: "white" }}>{value}</div>
      <div className="vg-label" style={{ marginTop: "6px" }}>{label}</div>
    </div>
  );
}

export default function DriverProfile() {
  const { driverId } = useParams();
  const driver = driverData[driverId];

  const displayName = driverId
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  if (!driver) {
    return (
      <Layout>
        <main className="vg-main" style={{ alignItems: "center", textAlign: "center" }}>
          <div style={{ fontSize: "48px" }}>🏎️</div>
          <h2 className="vg-headline" style={{ fontSize: "24px" }}>Driver not found</h2>
          <p style={{ color: "var(--vg-on-surface-variant)" }}>
            We don't have a profile for <strong style={{ color: "white" }}>{driverId}</strong> yet.
          </p>
          <Link to="/" className="vg-btn-primary">← Back to Dashboard</Link>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="vg-main">
        <Link to="/" style={{ color: "var(--vg-on-surface-variant)", textDecoration: "none", fontSize: "14px" }}>← Back to Dashboard</Link>

        <div className="vg-glass vg-enter vg-enter-1" style={{ padding: "40px", display: "flex", gap: "40px", flexWrap: "wrap" }}>
          <div style={{ flex: "0 0 220px" }}>
            <img
              src={driver.image}
              alt={displayName}
              style={{ width: "220px", height: "260px", objectFit: "cover", objectPosition: "top", borderRadius: "1.25rem", border: `2px solid ${driver.teamColor}`, display: "block" }}
              onError={(e) => { e.target.src = `https://placehold.co/220x260/1a1a1a/ffffff?text=${displayName}`; }}
            />
          </div>

          <div style={{ flex: 1, minWidth: "260px" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: "40px", height: "40px", borderRadius: "9999px",
              background: driver.teamColor, color: "#050508", fontWeight: 800, fontSize: "14px", marginBottom: "16px",
            }}>
              {driver.number}
            </div>

            <h1 className="vg-display" style={{ fontSize: "44px" }}>{displayName}</h1>
            <p style={{ color: driver.teamColor, fontWeight: 700, marginTop: "4px", marginBottom: "24px" }}>{driver.team}</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
              {[
                { label: "Nationality", value: driver.nationality },
                { label: "Date of Birth", value: driver.dob },
                { label: "Car Number", value: `#${driver.number}` },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", gap: "16px" }}>
                  <span className="vg-label" style={{ width: "120px", flexShrink: 0 }}>{item.label}</span>
                  <span style={{ fontSize: "14px", color: "white", fontWeight: 500 }}>{item.value}</span>
                </div>
              ))}
            </div>

            {driver.championships > 0 && (
              <span className="vg-chip" style={{ background: "rgba(255,215,0,0.12)", borderColor: "rgba(255,215,0,0.4)", color: "#FFD700" }}>
                🏆 {driver.championships}× World Champion
              </span>
            )}
          </div>
        </div>

        <div className="vg-enter vg-enter-2">
          <h2 className="vg-label" style={{ marginBottom: "16px" }}>Career Statistics</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "16px" }}>
            <StatCard label="Race Wins" value={driver.wins} />
            <StatCard label="Podiums" value={driver.podiums} />
            <StatCard label="Pole Positions" value={driver.poles} />
            <StatCard label="Fastest Laps" value={driver.fastestLaps} />
            <StatCard label="Championships" value={driver.championships} />
          </div>
        </div>

        <div className="vg-glass vg-enter vg-enter-3" style={{ padding: "28px", borderLeft: `3px solid ${driver.teamColor}` }}>
          <h2 className="vg-label" style={{ marginBottom: "12px" }}>About</h2>
          <p style={{ color: "var(--vg-on-surface-variant)", lineHeight: 1.7, margin: 0 }}>{driver.bio}</p>
        </div>

        <div className="vg-glass vg-enter vg-enter-3" style={{ padding: "28px", borderLeft: `3px solid ${driver.teamColor}` }}>
          <h2 className="vg-label" style={{ marginBottom: "12px" }}>About {driver.team}</h2>
          <p style={{ color: "var(--vg-on-surface-variant)", lineHeight: 1.7, margin: 0 }}>{driver.teamInfo}</p>
        </div>
      </main>
    </Layout>
  );
}
