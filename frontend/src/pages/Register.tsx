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
  hint: string;
}[] = [
  {
    key: "name",
    label: "Nama",
    type: "text",
    placeholder: "Nama lengkap",
    hint: "3–100 karakter",
  },
  {
    key: "email",
    label: "Email",
    type: "email",
    placeholder: "nama@kantin.test",
    hint: "Dipakai untuk masuk",
  },
  {
    key: "password",
    label: "Password",
    type: "password",
    placeholder: "••••••••",
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
      navigate("/login", { state: { toast: "Akun dibuat, silakan masuk" } });
    } catch (err) {
      setFieldErrors(getFieldErrors(err));
      setError(getErrorMessage(err));
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-wrap">
      {/* Kolom kiri: panel daun */}
      <section className="flex-[1_1_420px] bg-daun border-r-[3px] border-arang p-10 flex flex-col justify-between gap-8">
        <Link to="/" className="flex self-start">
          <span className="font-display text-2xl leading-none bg-bata text-white px-3 py-2.5 border-[3px] border-arang">
            ULAS
          </span>
          <span className="font-display text-2xl leading-none bg-white px-3 py-2.5 border-[3px] border-l-0 border-arang">
            KANTIN
          </span>
        </Link>
        <h1 className={`${ui.title} text-7xl md:text-8xl`}>
          Daf-
          <br />
          tar.
        </h1>
        <p className="text-lg font-medium max-w-[34ch]">
          Akun baru otomatis menjadi customer: bisa melihat semua warung dan
          profilmu sendiri.
        </p>
      </section>

      {/* Kolom kanan: form. noValidate supaya validasi dilakukan backend (bukti error 400) */}
      <section className="flex-[1_1_420px] flex items-center justify-center px-8 py-10">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="w-full max-w-md flex flex-col gap-5"
        >
          {error && (
            <div
              role="alert"
              className="bg-bata text-white border-[3px] border-arang px-4 py-3 font-extrabold uppercase"
            >
              {error}
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
                  value={form[f.key]}
                  onChange={(e) =>
                    setForm({ ...form, [f.key]: e.target.value })
                  }
                  placeholder={f.placeholder}
                  aria-invalid={!!err}
                  className={err ? ui.inputError : ui.input}
                />
                {err ? (
                  <span className={ui.fieldError}>{err}</span>
                ) : (
                  <span className="font-mono text-xs text-neutral-600">
                    {f.hint}
                  </span>
                )}
              </div>
            );
          })}

          <button
            type="submit"
            disabled={submitting}
            className={`${ui.btnPrimary} mt-1`}
          >
            {submitting ? "Memproses..." : "Buat akun →"}
          </button>

          <p className="font-semibold">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="font-extrabold underline decoration-[3px] underline-offset-4"
            >
              Masuk
            </Link>
          </p>
        </form>
      </section>
    </div>
  );
}
