import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "./services/api";
import DriverProfile from "./pages/DriverProfile";
import Compare from "./pages/Compare";
import Layout from "./components/Layout";
import DriverLink from "./components/DriverLink";

function Dashboard() {
  const [drivers, setDrivers] = useState([]);
  const [constructors, setConstructors] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/drivers/2025/standings")
      .then((r) => setDrivers(r.data.standings || []))
      .catch(console.error);
    api.get("/standings/2025/constructors")
      .then((r) => setConstructors(r.data.standings || []))
      .catch(console.error);
  }, []);

  const filteredDrivers = drivers.filter((d) =>
    d.driver.full_name.toLowerCase().includes(search.toLowerCase()) ||
    d.constructor_name.toLowerCase().includes(search.toLowerCase())
  );

  const leader = drivers[0];

  return (
    <Layout>
      <main className="vg-main">
        {/* Hero + stats */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }} className="vg-hero-grid">
          {leader && (
            <div className="vg-glass vg-enter vg-enter-1" style={{
              padding: "40px",
              minHeight: "360px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 0 60px rgba(0,240,255,0.12)",
            }}>
              <div>
                <div className="vg-eyebrow">Championship Leader</div>
                <h1 className="vg-display" style={{ fontSize: "clamp(36px, 5vw, 64px)", lineHeight: 1.05, marginTop: "8px" }}>
                  {leader.driver.full_name}
                </h1>
                <p style={{ color: "var(--vg-on-surface-variant)", maxWidth: "460px", marginTop: "12px", fontSize: "15px", lineHeight: 1.6 }}>
                  Leading the 2025 championship for {leader.constructor_name} with {leader.wins} race win{leader.wins === 1 ? "" : "s"} so far this season.
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: "24px" }}>
                <div>
                  <div className="vg-label">Total Points</div>
                  <div className="vg-headline" style={{ fontSize: "40px", color: "white" }}>{leader.points}</div>
                </div>
                <span className="vg-chip">{leader.constructor_name}</span>
              </div>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }} className="vg-enter vg-enter-2">
            <div className="vg-glass" style={{ flex: 1, padding: "28px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
              <div className="vg-headline" style={{ fontSize: "32px", color: "white" }}>{drivers.length}</div>
              <div className="vg-label" style={{ marginTop: "6px" }}>Total Drivers</div>
            </div>
            <div className="vg-glass" style={{ flex: 1, padding: "28px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
              <div className="vg-headline" style={{ fontSize: "32px", color: "white" }}>{constructors.length}</div>
              <div className="vg-label" style={{ marginTop: "6px" }}>Total Teams</div>
            </div>
          </div>
        </div>

        {/* Compare CTA */}
        <div className="vg-glass vg-enter vg-enter-2 vg-compare-banner">
          <div className="vg-compare-banner-text">
            <div className="vg-eyebrow">Head to Head</div>
            <p style={{ color: "var(--vg-on-surface-variant)", margin: "6px 0 0", fontSize: "14px", lineHeight: 1.5 }}>
              Pit two drivers against each other — points, wins, podiums, and more.
            </p>
          </div>
          <Link to="/compare" className="vg-btn-primary">Compare Drivers →</Link>
        </div>

        {/* Search */}
        <div className="vg-glass vg-enter vg-enter-2" style={{ padding: "6px 20px" }}>
          <input
            className="vg-input"
            style={{ borderBottom: "none" }}
            placeholder="Search driver or team…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Driver standings */}
        <div className="vg-glass vg-enter vg-enter-3" style={{ padding: "32px" }}>
          <h2 className="vg-headline" style={{ fontSize: "24px", marginBottom: "20px" }}>Driver Standings</h2>
          <div style={{ overflowX: "auto" }}>
            <table className="vg-table">
              <thead>
                <tr>
                  <th style={{ width: "60px" }}>Pos</th>
                  <th>Driver</th>
                  <th>Team</th>
                  <th style={{ textAlign: "right" }}>Pts</th>
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.map((d) => (
                  <tr key={d.driver.driver_id}>
                    <td style={{ color: "var(--vg-primary-container)", fontFamily: "var(--vg-font-display)", fontWeight: 700 }}>
                      {String(d.position).padStart(2, "0")}
                    </td>
                    <td>
                      <DriverLink driverId={d.driver.driver_id} fullName={d.driver.full_name} />
                    </td>
                    <td style={{ color: "var(--vg-on-surface-variant)" }}>{d.constructor_name}</td>
                    <td style={{ textAlign: "right", color: "white" }}>{d.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Constructor standings */}
        <div className="vg-glass vg-enter vg-enter-3" style={{ padding: "32px" }}>
          <h2 className="vg-headline" style={{ fontSize: "24px", marginBottom: "20px" }}>Constructor Standings</h2>
          <div style={{ overflowX: "auto" }}>
            <table className="vg-table">
              <thead>
                <tr>
                  <th style={{ width: "60px" }}>Pos</th>
                  <th>Team</th>
                  <th style={{ textAlign: "right" }}>Pts</th>
                </tr>
              </thead>
              <tbody>
                {constructors.map((c) => (
                  <tr key={c.constructor_name}>
                    <td style={{ color: "var(--vg-secondary)", fontFamily: "var(--vg-font-display)", fontWeight: 700 }}>
                      {String(c.position).padStart(2, "0")}
                    </td>
                    <td style={{ color: "white", fontWeight: 500 }}>{c.constructor_name}</td>
                    <td style={{ textAlign: "right", color: "white" }}>{c.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/driver/:driverId" element={<DriverProfile />} />
        <Route path="/compare" element={<Compare />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
