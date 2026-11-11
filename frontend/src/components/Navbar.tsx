import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { canCreate, roleLabel } from "../utils/permissions";
import type { Role } from "../types/api";
import { ui } from "../utils/ui";

const roleBadge: Record<Role, string> = {
  admin: "bg-arang text-kunyit",
  owner: "bg-daun text-arang",
  customer: "bg-white text-arang",
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <>
      {/* strip hitam di paling atas */}
      <div className="bg-arang text-kunyit font-mono text-xs font-bold uppercase tracking-widest">
        <div className="max-w-6xl mx-auto px-6 py-2">
          Rating &amp; ulasan warung kantin kampus
        </div>
      </div>

      <header className="border-b-[3px] border-arang bg-kertas">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center gap-4">
          <Link to="/" className="flex" aria-label="Ulas Kantin, ke beranda">
            <span className="font-display text-2xl leading-none bg-bata text-white px-3 py-2.5 border-[3px] border-arang">
              ULAS
            </span>
            <span className="font-display text-2xl leading-none bg-white px-3 py-2.5 border-[3px] border-l-0 border-arang">
              KANTIN
            </span>
          </Link>

          <nav className="ml-auto flex flex-wrap items-center gap-3">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-2 py-2 font-extrabold uppercase tracking-wide ${isActive ? "underline decoration-[3px] underline-offset-[6px]" : ""}`
              }
            >
              Warung
            </NavLink>

            {canCreate(user) && (
              <Link to="/stalls/new" className={ui.btnPrimary}>
                + Tambah Warung
              </Link>
            )}

            {user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 h-12 px-3 border-[3px] border-arang bg-white"
                >
                  <span className="font-bold">{user.name}</span>
                  <span
                    className={`font-mono text-[11px] font-bold uppercase px-2 py-0.5 border-2 border-arang ${roleBadge[user.role]}`}
                  >
                    {roleLabel[user.role]}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className={ui.btnSecondary}
                >
                  Keluar
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={ui.btnSecondary}>
                  Masuk
                </Link>
                <Link to="/register" className={ui.btnDark}>
                  Daftar
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}
