import React, { useEffect, useMemo, useState } from "react";
import ReportIssueForm from "./components/ReportIssueForm.jsx";
import Dashboard from "./components/Dashboard.jsx";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUserStatus as patchUserStatus,
} from "./api/users.js";

const OPERATION_CATEGORIES = ["Informatique", "Plomberie", "Electricite", "Autre"];

function App() {
  const [screen, setScreen] = useState("home");
  const [session, setSession] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loginForm, setLoginForm] = useState({ role: "technician", email: "" });
  const [loginMessage, setLoginMessage] = useState(null);
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    category: OPERATION_CATEGORIES[0],
  });
  const [signupMessage, setSignupMessage] = useState(null);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState(null);

  const approvedTechnicians = useMemo(
    () => technicians.filter((technician) => technician.status === "Approuve"),
    [technicians]
  );

  const pendingTechnicians = useMemo(
    () => technicians.filter((technician) => technician.status === "En attente"),
    [technicians]
  );

  const handleTicketCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const loadUsers = async () => {
    try {
      setUsersError(null);
      setUsersLoading(true);
      const [techs, adminsData] = await Promise.all([
        getUsers({ role: 'technician' }),
        getUsers({ role: 'admin' }),
      ]);
      setTechnicians(techs);
      setAdmins(adminsData);
    } catch (error) {
      setUsersError(error.message || 'Impossible de charger les utilisateurs');
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleLogin = (event) => {
    event.preventDefault();
    const email = loginForm.email.trim().toLowerCase();

    if (!email) {
      setLoginMessage({ type: "error", text: "Renseignez votre adresse mail." });
      return;
    }

    if (loginForm.role === "admin") {
      const admin = admins.find((item) => item.email.toLowerCase() === email);

      if (!admin) {
        setLoginMessage({
          type: "error",
          text: "Administrateur inconnu. Les administrateurs doivent etre ajoutes manuellement.",
        });
        return;
      }

      setSession(admin);
      setScreen("admin");
      setLoginMessage(null);
      return;
    }

    const technician = technicians.find((item) => item.email.toLowerCase() === email);

    if (!technician) {
      setLoginMessage({
        type: "error",
        text: "Compte technicien introuvable. Creez une demande de compte si necessaire.",
      });
      return;
    }

    if (technician.status !== "Approuve") {
      setLoginMessage({
        type: "error",
        text: "Compte en attente de validation par un administrateur.",
      });
      return;
    }

    setSession({ ...technician, role: "technician" });
    setScreen("technician");
    setLoginMessage(null);
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    const email = signupForm.email.trim().toLowerCase();
    const name = signupForm.name.trim();

    if (!name || !email || !signupForm.category) {
      setSignupMessage({ type: "error", text: "Nom, mail et categorie sont obligatoires." });
      return;
    }

    try {
      await createUser({
        name,
        email,
        role: "technician",
        category: signupForm.category,
      });

      setSignupForm({ name: "", email: "", category: OPERATION_CATEGORIES[0] });
      setSignupMessage({
        type: "success",
        text: "Demande envoyee. Un administrateur doit valider ce compte.",
      });
      await loadUsers();
    } catch (error) {
      setSignupMessage({
        type: "error",
        text: error.message || "Impossible d'envoyer la demande.",
      });
    }
  };

  const updateTechnicianStatus = async (id, status) => {
    try {
      const updatedTechnician = await patchUserStatus(id, status);
      setTechnicians((prev) =>
        prev.map((technician) =>
          technician.id === id ? { ...technician, status: updatedTechnician.status } : technician
        )
      );
    } catch (error) {
      console.error('Unable to update technician status', error);
    }
  };

  const removeTechnician = async (id) => {
    try {
      await deleteUser(id);
      setTechnicians((prev) => prev.filter((technician) => technician.id !== id));
    } catch (error) {
      console.error('Unable to remove technician', error);
    }
  };

  const addAdmin = async (admin) => {
    try {
      const nextAdmin = await createUser({
        ...admin,
        role: "admin",
      });
      setAdmins((prev) => [nextAdmin, ...prev]);
    } catch (error) {
      console.error('Unable to add admin', error);
    }
  };

  const logout = () => {
    setSession(null);
    setScreen("home");
    setLoginForm({ role: "technician", email: "" });
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand-button" type="button" onClick={() => setScreen("home")}>
          <span className="brand-mark">CF</span>
          <span>
            <strong>Campus Fix</strong>
            <small>ENSPM</small>
          </span>
        </button>

        <nav className="topbar-actions" aria-label="Navigation principale">
          <button type="button" className="btn-ghost" onClick={() => setScreen("report")}>
            Signaler
          </button>
          {session ? (
            <>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setScreen(session.role === "admin" ? "admin" : "technician")}
              >
                Dashboard
              </button>
              <button type="button" className="btn-primary" onClick={logout}>
                Deconnexion
              </button>
            </>
          ) : (
            <button type="button" className="btn-primary" onClick={() => setScreen("login")}>
              Connexion
            </button>
          )}
        </nav>
      </header>

      {screen === "home" && (
        <main className="home-grid">
          <section className="hero-panel">
            <span className="eyebrow">Gestion des incidents campus</span>
            <h1>Campus Fix</h1>
            <p>
              Une entree claire pour declarer un incident
            </p>

            <div className="hero-actions">
              <button type="button" className="btn-primary btn-large" onClick={() => setScreen("login")}>
                Connexion
              </button>
              <button type="button" className="btn-ghost btn-large" onClick={() => setScreen("report")}>
                Signaler un incident
              </button>
            </div>
          </section>

          <section className="access-panel card">
            <h2>Acces rapides</h2>
            <div className="access-list">
              <button type="button" className="access-item" onClick={() => setScreen("report")}>
                <span>01</span>
                <strong>Invites</strong>
                <small>Declaration d'incident uniquement, sans connexion.</small>
              </button>
              <button type="button" className="access-item" onClick={() => setScreen("login")}>
                <span>02</span>
                <strong>Techniciens</strong>
                <small>Tickets filtres selon la categorie d'intervention.</small>
              </button>
              <button type="button" className="access-item" onClick={() => setScreen("login")}>
                <span>03</span>
                <strong>Administration</strong>
                <small>Validation des comptes, incidents et controle global.</small>
              </button>
            </div>
          </section>
        </main>
      )}

      {screen === "login" && (
        <main className="content-grid">
          <section className="card auth-card">
            <span className="eyebrow">Espace securise</span>
            <h1>Connexion</h1>

            {loginMessage && (
              <div className={`message ${loginMessage.type === "success" ? "success" : "error"}`}>
                {loginMessage.text}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="segmented-control" role="group" aria-label="Type de compte">
                <button
                  type="button"
                  className={loginForm.role === "technician" ? "active" : ""}
                  onClick={() => setLoginForm((prev) => ({ ...prev, role: "technician" }))}
                >
                  Technicien
                </button>
                <button
                  type="button"
                  className={loginForm.role === "admin" ? "active" : ""}
                  onClick={() => setLoginForm((prev) => ({ ...prev, role: "admin" }))}
                >
                  Administrateur
                </button>
              </div>

              <label htmlFor="login-email">Mail</label>
              <input
                id="login-email"
                name="email"
                type="email"
                placeholder={
                  loginForm.role === "admin"
                    ? "admin@campusfix.local"
                    : "tech.info@campusfix.local"
                }
                value={loginForm.email}
                onChange={(event) =>
                  setLoginForm((prev) => ({ ...prev, email: event.target.value }))
                }
              />

              <button type="submit" className="btn-primary full-width">
                Entrer
              </button>
            </form>

            <div className="hint-box">
              <strong>Comptes de demonstration</strong>
              <span>Admin : admin@campusfix.local</span>
              <span>Technicien : tech.info@campusfix.local</span>
            </div>
          </section>

          <section className="card auth-card">
            <span className="eyebrow">Reserve aux techniciens</span>
            <h2>Creer un compte</h2>
            <p className="muted-text">
              La creation reste inactive tant qu'un administrateur n'a pas valide la demande.
            </p>

            {signupMessage && (
              <div className={`message ${signupMessage.type === "success" ? "success" : "error"}`}>
                {signupMessage.text}
              </div>
            )}

            <form onSubmit={handleSignup}>
              <label htmlFor="signup-name">Nom du technicien</label>
              <input
                id="signup-name"
                name="name"
                value={signupForm.name}
                onChange={(event) =>
                  setSignupForm((prev) => ({ ...prev, name: event.target.value }))
                }
                placeholder="Nom complet"
              />

              <label htmlFor="signup-email">Mail</label>
              <input
                id="signup-email"
                name="email"
                type="email"
                value={signupForm.email}
                onChange={(event) =>
                  setSignupForm((prev) => ({ ...prev, email: event.target.value }))
                }
                placeholder="technicien@campusfix.local"
              />

              <label htmlFor="signup-category">Categorie d'operation</label>
              <select
                id="signup-category"
                name="category"
                value={signupForm.category}
                onChange={(event) =>
                  setSignupForm((prev) => ({ ...prev, category: event.target.value }))
                }
              >
                {OPERATION_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <button type="submit" className="btn-primary full-width">
                Envoyer la demande
              </button>
            </form>
          </section>
        </main>
      )}

      {screen === "report" && (
        <main className="single-column">
          <section className="page-heading">
            <span className="eyebrow">Signalement invite</span>
            <h1>Signaler un incident</h1>
            <p>Cette page ne demande aucune connexion et affiche uniquement le formulaire incident.</p>
          </section>
          <ReportIssueForm onTicketCreated={handleTicketCreated} isGuest />
        </main>
      )}

      {screen === "technician" && session?.role === "technician" && (
        <main className="single-column">
          <section className="page-heading dashboard-heading">
            <div>
              <span className="eyebrow">Dashboard technicien</span>
              <h1>{session.name}</h1>
              <p>Les incidents affiches correspondent a la categorie {session.category}.</p>
            </div>
            <span className="category-chip">{session.category}</span>
          </section>
          <Dashboard
            key={`${refreshKey}-${session.email}`}
            role="technician"
            technicianCategory={session.category}
          />
        </main>
      )}

      {screen === "admin" && session?.role === "admin" && (
        <main className="single-column admin-space">
          <section className="page-heading dashboard-heading">
            <div>
              <span className="eyebrow">Administration</span>
              <h1>Controle global Campus Fix</h1>
              <p>Suivi des incidents, validation des techniciens et lecture de tous les statuts.</p>
            </div>
            <span className="category-chip">{session.name}</span>
          </section>

          <Dashboard
            key={`admin-${refreshKey}`}
            role="admin"
            technicians={technicians}
            approvedTechnicians={approvedTechnicians}
            pendingTechnicians={pendingTechnicians}
            onApproveTechnician={(id) => updateTechnicianStatus(id, "Approuve")}
            onSuspendTechnician={(id) => updateTechnicianStatus(id, "Suspendu")}
            onRemoveTechnician={removeTechnician}
            isPrincipalAdmin={session?.email === "admin@campusfix.local"}
            onAddAdmin={(admin) => addAdmin(admin)}
          />
        </main>
      )}
    </div>
  );
}

export default App;
