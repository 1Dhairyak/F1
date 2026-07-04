import { useEffect, useState } from "react";
import api from "../services/api";
import driverData from "../data/driverData";
import Layout from "../components/Layout";

const teamColors = {
  "Red Bull": "#3671C6", "Red Bull Racing": "#3671C6",
  "McLaren": "#FF8000", "Ferrari": "#E8002D", "Mercedes": "#27F4D2",
  "Aston Martin": "#229971", "Alpine F1 Team": "#FF87BC", "Williams": "#64C4FF",
  "Haas F1 Team": "#B6BABD", "Kick Sauber": "#52E252", "Sauber": "#52E252",
  "RB F1 Team": "#6692FF",
};

function displayName(driverId) {
  return driverId.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function StatRow({ label, value1, value2, color1, color2, higherIsBetter = true }) {
  const max = Math.max(value1, value2, 1);
  const pct1 = (value1 / max) * 100;
  const pct2 = (value2 / max) * 100;
  const winner1 = higherIsBetter ? value1 >= value2 : value1 <= value2;

  return (
    <div className="vg-stat-row" style={{ marginBottom: "22px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <span style={{ fontFamily: "var(--vg-font-display)", fontWeight: winner1 ? 800 : 500, color: winner1 ? "white" : "var(--vg-outline)" }}>{value1}</span>
        <span className="vg-label">{label}</span>
        <span style={{ fontFamily: "var(--vg-font-display)", fontWeight: !winner1 ? 800 : 500, color: !winner1 ? "white" : "var(--vg-outline)" }}>{value2}</span>
      </div>
      <div style={{ display: "flex", gap: "4px", height: "6px" }}>
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: `${pct1}%`, background: color1, borderRadius: "4px 0 0 4px", transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)" }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ width: `${pct2}%`, background: color2, borderRadius: "0 4px 4px 0", transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)" }} />
        </div>
      </div>
    </div>
  );
}

function DriverPickCard({ id, color }) {
  const meta = driverData[id];
  const imgSrc = meta?.image || "https://placehold.co/120x140/1a1a1a/ffffff?text=?";
  const name = displayName(id);

  return (
    <div className="vg-compare-card">
      <div className="vg-compare-photo">
        <div className="vg-compare-photo-inner">
          <div className="vg-compare-face front" style={{ border: `2px solid ${color}` }}>
            <img
              src={imgSrc}
              alt={name}
              onError={(e) => { e.target.src = "https://placehold.co/120x140/1a1a1a/ffffff?text=" + name; }}
            />
          </div>
          <div className="vg-compare-face back" style={{ border: `2px solid ${color}` }}>
            <img
              src={imgSrc}
              alt=""
              aria-hidden="true"
              onError={(e) => { e.target.src = "https://placehold.co/120x140/1a1a1a/ffffff?text=" + name; }}
            />
          </div>
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "var(--vg-font-display)", fontWeight: 700, color: "white" }}>{name}</div>
        <div style={{ color, fontSize: "12px", fontWeight: 600, marginTop: "2px" }}>{meta?.team || ""}</div>
      </div>
    </div>
  );
}

export default function Compare() {
  const [allDrivers, setAllDrivers] = useState([]);
  const [driver1, setDriver1] = useState("norris");
  const [driver2, setDriver2] = useState("max_verstappen");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const season = 2025;

  useEffect(() => {
    api.get(`/drivers/${season}/standings`)
      .then((r) => setAllDrivers((r.data.standings || []).map((s) => s.driver.driver_id)))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!driver1 || !driver2 || driver1 === driver2) return;
    setLoading(true);
    setError(null);
    api.get(`/drivers/compare`, { params: { driver1, driver2, season } })
      .then((r) => setData(r.data))
      .catch((e) => setError(e.response?.data?.detail || "Could not load comparison"))
      .finally(() => setLoading(false));
  }, [driver1, driver2]);

  const color1 = data ? (teamColors[data.driver1.constructor_name] || "#849495") : "#849495";
  const color2 = data ? (teamColors[data.driver2.constructor_name] || "#849495") : "#849495";

  return (
    <Layout>
      <main className="vg-main" style={{ maxWidth: "860px" }}>
        <div className="vg-enter vg-enter-1" style={{ textAlign: "center" }}>
          <div className="vg-eyebrow">Head to Head</div>
          <h1 className="vg-headline" style={{ fontSize: "36px", marginTop: "8px" }}>Driver Comparison</h1>
        </div>

        <div className="vg-glass vg-enter vg-enter-2" style={{ padding: "20px 28px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <select className="vg-select" style={{ flex: 1 }} value={driver1} onChange={(e) => setDriver1(e.target.value)}>
            {allDrivers.map((id) => <option key={id} value={id}>{displayName(id)}</option>)}
          </select>
          <select className="vg-select" style={{ flex: 1 }} value={driver2} onChange={(e) => setDriver2(e.target.value)}>
            {allDrivers.map((id) => <option key={id} value={id}>{displayName(id)}</option>)}
          </select>
        </div>

        {driver1 === driver2 && (
          <p style={{ textAlign: "center", color: "var(--vg-secondary)" }}>Pick two different drivers to compare.</p>
        )}
        {loading && (
          <div className="vg-glass vg-enter" style={{ padding: "32px", textAlign: "center" }}>
            <div className="vg-compare-vs" style={{ animation: "vgVsPulse 1s ease-in-out infinite" }}>VS</div>
            <p style={{ color: "var(--vg-outline)", marginTop: "12px" }}>Loading comparison…</p>
          </div>
        )}
        {error && <p style={{ textAlign: "center", color: "var(--vg-secondary)" }}>{error}</p>}

        {data && !loading && (
          <>
            <div className="vg-glass vg-enter vg-enter-3" style={{ padding: "32px", display: "flex", justifyContent: "space-around", alignItems: "center", gap: "16px" }}>
              <DriverPickCard id={data.driver1.driver.driver_id} color={color1} />
              <div className="vg-compare-vs">VS</div>
              <DriverPickCard id={data.driver2.driver.driver_id} color={color2} />
            </div>

            <div className="vg-glass vg-enter vg-enter-3" style={{ padding: "32px" }}>
              <StatRow label="Championship Points" value1={data.driver1.points} value2={data.driver2.points} color1={color1} color2={color2} />
              <StatRow label="Race Wins" value1={data.driver1.wins} value2={data.driver2.wins} color1={color1} color2={color2} />
              <StatRow label="Podiums" value1={data.driver1.season_stats.podiums} value2={data.driver2.season_stats.podiums} color1={color1} color2={color2} />
              <StatRow label="Championship Position" value1={data.driver1.position} value2={data.driver2.position} color1={color1} color2={color2} higherIsBetter={false} />
              <StatRow label="DNFs" value1={data.driver1.season_stats.dnfs} value2={data.driver2.season_stats.dnfs} color1={color1} color2={color2} higherIsBetter={false} />
            </div>
          </>
        )}
      </main>
    </Layout>
  );
}
