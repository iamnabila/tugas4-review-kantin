import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../lib/authApi";
import { getErrorMessage, getFieldErrors } from "../lib/errors";
import { ui } from "../utils/ui";

type Field = "name" | "email" | "password";

const FIELDS: {
  key: Field;
  label: string;
  type: string;
  placeholder: string;
  autoComplete: string;
  hint?: string;
}[] = [
  {
    key: "name",
    label: "Nama",
    type: "text",
    placeholder: "Nama lengkap",
    autoComplete: "name",
  },
  {
    key: "email",
    label: "Email",
    type: "email",
    placeholder: "nama@email.com",
    autoComplete: "email",
  },
  {
    key: "password",
    label: "Password",
    type: "password",
    placeholder: "",
    autoComplete: "new-password",
    hint: "Minimal 8 karakter",
  },
];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFieldErrors({});
    setError("");
    try {
      await register(form);
      navigate("/login", {
        state: { toast: "Akun berhasil dibuat. Silakan masuk." },
      });
    } catch (err) {
      setFieldErrors(getFieldErrors(err));
      setError(getErrorMessage(err));
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      {/* Panel kiri */}
      <section className="bg-daun border-b-[3px] lg:border-b-0 lg:border-r-[3px] border-arang p-8 lg:p-12 flex flex-col justify-between gap-10">
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
            Buat akun baru.
          </h1>
          <p className="text-lg max-w-[36ch]">
            Cukup nama, email, dan password untuk mulai.
          </p>
        </div>
        <Link
          to="/"
          className="self-start font-mono text-sm font-bold uppercase border-b-[3px] border-arang"
        >
          ← Lihat daftar warung
        </Link>
      </section>

      {/* Panel kanan: form. noValidate supaya pesan validasi datang dari backend */}
      <section className="flex items-center justify-center px-6 py-12 lg:px-12">
        <div className="w-full max-w-md flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className={`${ui.title} text-4xl`}>Daftar</h2>
            <p>
              Sudah punya akun?{" "}
              <Link
                to="/login"
                className="font-extrabold underline decoration-[3px] underline-offset-4"
              >
                Masuk di sini
              </Link>
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className={`${ui.panel} p-6 sm:p-8 flex flex-col gap-5`}
          >
            {error && (
              <div
                role="alert"
                className="bg-bata text-white border-[3px] border-arang px-4 py-3 font-bold"
              >
                {Object.keys(fieldErrors).length > 0
                  ? "Periksa kembali isian yang ditandai."
                  : error}
              </div>
            )}

            {FIELDS.map((f) => {
              const err = fieldErrors[f.key];
              return (
                <div key={f.key} className="flex flex-col gap-2">
                  <label htmlFor={f.key} className={ui.label}>
                    {f.label}
                  </label>
                  <input
                    id={f.key}
                    type={f.type}
                    autoComplete={f.autoComplete}
                    value={form[f.key]}
                    onChange={(e) =>
                      setForm({ ...form, [f.key]: e.target.value })
                    }
                    placeholder={f.placeholder}
                    aria-invalid={!!err}
                    className={err ? ui.inputError : ui.input}
                  />
                  {err && <span className={ui.fieldError}>{err}</span>}
                  {!err && f.hint && (
                    <span className="text-sm text-neutral-600">{f.hint}</span>
                  )}
                </div>
              );
            })}

            <button
              type="submit"
              disabled={submitting}
              className={`${ui.btnPrimary} w-full mt-2`}
            >
              {submitting ? "Memproses..." : "Buat akun"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
