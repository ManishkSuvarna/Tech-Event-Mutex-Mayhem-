// ─── App.jsx ──────────────────────────────────────────────────────────────────
// Root application — manages global screen state and routing between views
// BUG FIX: loginType is always set before LoginModal renders (no null type passed)
import { useState } from "react";
import LandingPage          from "./pages/LandingPage";
import LoginModal           from "./pages/LoginModal";
import AdminDashboard       from "./pages/AdminDashboard";
import ContestantDashboard  from "./pages/ContestantDashboard";

/**
 * Screen states:
 *   "landing"    → Home page
 *   "login"      → Login modal overlaid on landing
 *   "admin"      → Admin dashboard
 *   "contestant" → Team dashboard
 */
export default function App() {
  const [screen,         setScreen]         = useState("landing");
  const [loginType,      setLoginType]      = useState(null);   // "admin" | "contestant"
  const [adminUser,      setAdminUser]      = useState(null);
  const [contestantUser, setContestantUser] = useState(null);

  const goToLogin = (type) => {
    setLoginType(type);
    setScreen("login");
  };

  const handleAuthSuccess = (user) => {
    if (loginType === "admin") {
      setAdminUser(user);
      setScreen("admin");
    } else {
      setContestantUser(user);
      setScreen("contestant");
    }
  };

  const handleLogout = () => {
    setAdminUser(null);
    setContestantUser(null);
    setLoginType(null);
    setScreen("landing");
  };

  return (
    <div className="mm-app">

      {/* ── Landing ────────────────────────────────────────────────────── */}
      {screen === "landing" && (
        <LandingPage
          onAdminLogin={() => goToLogin("admin")}
          onContestantLogin={() => goToLogin("contestant")}
        />
      )}

      {/* ── Login ──────────────────────────────────────────────────────── */}
      {screen === "login" && loginType && (
        <>
          {/* Keep landing visible behind the modal */}
          <LandingPage
            onAdminLogin={() => setLoginType("admin")}
            onContestantLogin={() => setLoginType("contestant")}
          />
          <LoginModal
            type={loginType}
            onClose={() => setScreen("landing")}
            onSuccess={handleAuthSuccess}
          />
        </>
      )}

      {/* ── Admin Dashboard ────────────────────────────────────────────── */}
      {screen === "admin" && adminUser && (
        <AdminDashboard
          admin={adminUser}
          onLogout={handleLogout}
        />
      )}

      {/* ── Contestant Dashboard ───────────────────────────────────────── */}
      {screen === "contestant" && contestantUser && (
        <ContestantDashboard
          contestant={contestantUser}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
