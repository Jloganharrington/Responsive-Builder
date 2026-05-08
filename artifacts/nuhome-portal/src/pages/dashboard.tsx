import { useState, useEffect } from "react";
import { Home, LogOut, RefreshCw } from "lucide-react";

interface Submission {
  id: number;
  name: string;
  property: string;
  claim: string;
  product: string;
  color: string;
  notes: string;
  submittedAt: string;
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function Dashboard() {
  const [password, setPassword] = useState(() => sessionStorage.getItem("dash_pw") ?? "");
  const [authed, setAuthed] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pwInput, setPwInput] = useState("");

  async function fetchSubmissions(pw: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE}/api/submissions`, {
        headers: { "x-dashboard-password": pw },
      });
      if (res.status === 401) {
        setError("Incorrect password.");
        setAuthed(false);
        sessionStorage.removeItem("dash_pw");
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error("Server error");
      const data: Submission[] = await res.json();
      setSubmissions(data);
      setAuthed(true);
      sessionStorage.setItem("dash_pw", pw);
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const stored = sessionStorage.getItem("dash_pw");
    if (stored) fetchSubmissions(stored);
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setPassword(pwInput);
    fetchSubmissions(pwInput);
  }

  function handleLogout() {
    setAuthed(false);
    setPassword("");
    setPwInput("");
    setSubmissions([]);
    sessionStorage.removeItem("dash_pw");
  }

  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#F7F8F5", fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column" }}>
        <header style={{ backgroundColor: "#6DB33F", padding: "16px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
            <Home size={22} color="#fff" />
            <span style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>NuHome Exteriors</span>
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginLeft: 8 }}>— Submissions Dashboard</span>
          </div>
        </header>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <form onSubmit={handleLogin} style={{
            backgroundColor: "#fff",
            border: "1px solid #D4E8C2",
            borderRadius: 10,
            padding: "36px 40px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
            width: "100%",
            maxWidth: 360,
          }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#2A2A2A", marginBottom: 6, fontFamily: "'Playfair Display', serif" }}>
              Dashboard Login
            </div>
            <div style={{ fontSize: 13, color: "#6B6B6B", marginBottom: 24 }}>
              Enter your dashboard password to view submissions.
            </div>
            {error && (
              <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 6, padding: "10px 14px", fontSize: 13, color: "#B91C1C", marginBottom: 16 }}>
                {error}
              </div>
            )}
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              value={pwInput}
              onChange={e => setPwInput(e.target.value)}
              autoFocus
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1px solid #D4E8C2",
                borderRadius: 6,
                fontSize: 14,
                color: "#2A2A2A",
                boxSizing: "border-box",
                marginBottom: 18,
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                backgroundColor: "#6DB33F",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "12px 0",
                fontSize: 15,
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Checking…" : "View Submissions"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F7F8F5", fontFamily: "'Inter', sans-serif" }}>
      <header style={{ backgroundColor: "#6DB33F", padding: "16px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Home size={22} color="#fff" />
            <span style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>NuHome Exteriors</span>
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginLeft: 8 }}>— Submissions Dashboard</span>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={() => fetchSubmissions(password)}
              disabled={loading}
              style={{ display: "flex", alignItems: "center", gap: 6, backgroundColor: "rgba(255,255,255,0.18)", color: "#fff", border: "none", borderRadius: 6, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
            >
              <RefreshCw size={14} /> Refresh
            </button>
            <button
              onClick={handleLogout}
              style={{ display: "flex", alignItems: "center", gap: 6, backgroundColor: "rgba(255,255,255,0.18)", color: "#fff", border: "none", borderRadius: 6, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
            >
              <LogOut size={14} /> Log out
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 16px 60px" }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#2A2A2A", margin: 0, fontFamily: "'Playfair Display', serif" }}>
            Siding Selections
          </h1>
          <p style={{ fontSize: 14, color: "#6B6B6B", margin: "6px 0 0" }}>
            {submissions.length} submission{submissions.length !== 1 ? "s" : ""} received
          </p>
        </div>

        {error && (
          <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 6, padding: "12px 16px", fontSize: 13, color: "#B91C1C", marginBottom: 20 }}>
            {error}
          </div>
        )}

        {submissions.length === 0 && !loading ? (
          <div style={{ backgroundColor: "#fff", border: "1px solid #D4E8C2", borderRadius: 10, padding: "48px 32px", textAlign: "center", color: "#6B6B6B", fontSize: 15 }}>
            No submissions yet. They'll appear here once clients submit their selections.
          </div>
        ) : (
          <div style={{ backgroundColor: "#fff", border: "1px solid #D4E8C2", borderRadius: 10, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
                <thead>
                  <tr style={{ backgroundColor: "#F7F8F5" }}>
                    {["Date", "Name", "Property", "Claim #", "Product", "Color", "Notes"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "2px solid #D4E8C2", whiteSpace: "nowrap" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((s, i) => (
                    <tr key={s.id} style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#FAFCF7" }}>
                      <td style={{ padding: "13px 16px", fontSize: 13, color: "#6B6B6B", borderBottom: "1px solid #EEF2EA", whiteSpace: "nowrap" }}>{formatDate(s.submittedAt)}</td>
                      <td style={{ padding: "13px 16px", fontSize: 14, fontWeight: 600, color: "#2A2A2A", borderBottom: "1px solid #EEF2EA" }}>{s.name}</td>
                      <td style={{ padding: "13px 16px", fontSize: 13, color: "#3D3D3D", borderBottom: "1px solid #EEF2EA" }}>{s.property}</td>
                      <td style={{ padding: "13px 16px", fontSize: 13, color: "#3D3D3D", borderBottom: "1px solid #EEF2EA", whiteSpace: "nowrap" }}>{s.claim}</td>
                      <td style={{ padding: "13px 16px", fontSize: 13, color: "#3D3D3D", borderBottom: "1px solid #EEF2EA" }}>{s.product}</td>
                      <td style={{ padding: "13px 16px", fontSize: 13, color: "#3D3D3D", borderBottom: "1px solid #EEF2EA" }}>{s.color}</td>
                      <td style={{ padding: "13px 16px", fontSize: 13, color: "#6B6B6B", borderBottom: "1px solid #EEF2EA", maxWidth: 240 }}>{s.notes || <span style={{ color: "#C0C0C0" }}>—</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
