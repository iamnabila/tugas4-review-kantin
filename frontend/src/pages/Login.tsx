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
    <div className="min-h-screen flex flex-wrap">
      {toast && <Toast message={toast} onClose={clearToast} />}

      {/* Kolom kiri: panel kunyit */}
      <section className="flex-[1_1_420px] bg-kunyit border-r-[3px] border-arang p-10 flex flex-col justify-between gap-8">
        <Link to="/" className="flex self-start">
          <span className="font-display text-2xl leading-none bg-bata text-white px-3 py-2.5 border-[3px] border-arang">
            ULAS
          </span>
          <span className="font-display text-2xl leading-none bg-white px-3 py-2.5 border-[3px] border-l-0 border-arang">
            KANTIN
          </span>
        </Link>
        <h1 className={`${ui.title} text-7xl md:text-8xl`}>
          Ma-
          <br />
          suk.
        </h1>
        <p className="text-lg font-medium max-w-[34ch]">
          Owner mengelola warungnya, admin mengelola semuanya. Daftar warung
          tetap bisa dilihat tanpa akun.
        </p>
      </section>

      {/* Kolom kanan: form */}
      <section className="flex-[1_1_420px] flex items-center justify-center px-8 py-10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md flex flex-col gap-5"
        >
          {expired && (
            <div
              role="status"
              className="border-[3px] border-arang p-1.5 bg-[repeating-linear-gradient(-45deg,#E9C46A_0_12px,#1E1E1E_12px_24px)]"
            >
              <div className="bg-white px-4 py-3 font-extrabold uppercase">
                Sesi kamu habis, silakan login lagi.
              </div>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="bg-bata text-white border-[3px] border-arang px-4 py-3 font-extrabold uppercase"
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@kantin.test"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={ui.input}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`${ui.btnPrimary} mt-1`}
          >
            {submitting ? "Memproses..." : "Masuk →"}
          </button>

          <p className="font-semibold">
            Belum punya akun?{" "}
            <Link
              to="/register"
              className="font-extrabold underline decoration-[3px] underline-offset-4"
            >
              Daftar sekarang
            </Link>
          </p>
        </form>
      </section>
    </div>
  );
}
