import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../lib/errors";
import { useFlashToast } from "../utils/useFlashToast";
import Toast from "../components/Toast";
import { ui } from "../utils/ui";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const expired = searchParams.get("expired") === "1";
  const { toast, clearToast } = useFlashToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      {toast && <Toast message={toast} onClose={clearToast} />}

      {/* Panel kiri */}
      <section className="bg-kunyit border-b-[3px] lg:border-b-0 lg:border-r-[3px] border-arang p-8 lg:p-12 flex flex-col justify-between gap-10">
        <Link
          to="/"
          className="flex self-start"
          aria-label="Ulas Kantin, ke beranda"
        >
          <span className="font-display text-2xl leading-none bg-bata text-white px-3 py-2.5 border-[3px] border-arang">
            ULAS
          </span>
          <span className="font-display text-2xl leading-none bg-white px-3 py-2.5 border-[3px] border-l-0 border-arang">
            KANTIN
          </span>
        </Link>
        <div className="flex flex-col gap-4">
          <h1 className={`${ui.title} text-5xl lg:text-7xl`}>
            Selamat datang kembali.
          </h1>
          <p className="text-lg max-w-[36ch]">
            Masuk untuk mengelola warung dan melihat profilmu.
          </p>
        </div>
        <Link
          to="/"
          className="self-start font-mono text-sm font-bold uppercase border-b-[3px] border-arang"
        >
          ← Lihat daftar warung
        </Link>
      </section>

      {/* Panel kanan: form */}
      <section className="flex items-center justify-center px-6 py-12 lg:px-12">
        <div className="w-full max-w-md flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className={`${ui.title} text-4xl`}>Masuk</h2>
            <p>
              Belum punya akun?{" "}
              <Link
                to="/register"
                className="font-extrabold underline decoration-[3px] underline-offset-4"
              >
                Daftar di sini
              </Link>
            </p>
          </div>

          {expired && (
            <div
              role="status"
              className="border-[3px] border-arang p-1.5 bg-[repeating-linear-gradient(-45deg,#E9C46A_0_12px,#1E1E1E_12px_24px)]"
            >
              <div className="bg-white px-4 py-3 font-bold">
                Sesi kamu telah berakhir. Silakan masuk kembali.
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className={`${ui.panel} p-6 sm:p-8 flex flex-col gap-5`}
          >
            {error && (
              <div
                role="alert"
                className="bg-bata text-white border-[3px] border-arang px-4 py-3 font-bold"
              >
                {error}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className={ui.label}>
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className={ui.input}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className={ui.label}>
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={ui.input}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`${ui.btnPrimary} w-full mt-2`}
            >
              {submitting ? "Memproses..." : "Masuk"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
