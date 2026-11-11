import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { createStall, getStall, updateStall } from "../lib/stallApi";
import { getErrorMessage, getFieldErrors } from "../lib/errors";
import type { StallInput } from "../types/api";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import { ui } from "../utils/ui";

interface FormState {
  name: string;
  category: string;
  location: string;
  description: string;
}

const EMPTY: FormState = {
  name: "",
  category: "",
  location: "",
  description: "",
};

const FIELDS: {
  key: keyof FormState;
  label: string;
  placeholder: string;
  hint: string;
  required?: boolean;
  textarea?: boolean;
}[] = [
  {
    key: "name",
    label: "Nama warung",
    placeholder: "contoh: Warung Bu Tini",
    hint: "3–100 karakter",
    required: true,
  },
  {
    key: "category",
    label: "Kategori",
    placeholder: "Nasi, Kwetiau, ...",
    hint: "maks. 50 karakter",
  },
  {
    key: "location",
    label: "Lokasi",
    placeholder: "contoh: Kantin FKIP",
    hint: "maks. 100 karakter",
  },
  {
    key: "description",
    label: "Deskripsi",
    placeholder: "Menu andalan, jam buka, ciri khas",
    hint: "maks. 1000 karakter",
    textarea: true,
  },
];

export default function StallForm() {
  const { id } = useParams();
  const isEdit = id !== undefined;
  const stallId = Number(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState<FormState>(EMPTY);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [loadError, setLoadError] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [forbidden, setForbidden] = useState(false);

  // mode ubah: isi form dengan data lama
  useEffect(() => {
    if (!isEdit) return;
    getStall(stallId)
      .then((s) =>
        setForm({
          name: s.name,
          category: s.category ?? "",
          location: s.location ?? "",
          description: s.description ?? "",
        }),
      )
      .catch((err) => setLoadError(getErrorMessage(err)))
      .finally(() => setLoadingData(false));
  }, [isEdit, stallId]);

  function update(field: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFieldErrors({});
    setFormError("");
    setForbidden(false);

    // buang field opsional yang kosong supaya tidak tersimpan sebagai teks kosong
    const body: StallInput = { name: form.name.trim() };
    if (form.category.trim()) body.category = form.category.trim();
    if (form.location.trim()) body.location = form.location.trim();
    if (form.description.trim()) body.description = form.description.trim();

    try {
      let savedId = stallId;
      if (isEdit) {
        await updateStall(stallId, body);
      } else {
        const created = await createStall(body);
        savedId = created.id;
      }
      navigate(`/stalls/${savedId}`, {
        state: { toast: "Tersimpan ke database" },
      });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 403)
        setForbidden(true);
      setFieldErrors(getFieldErrors(err));
      setFormError(getErrorMessage(err));
      setSubmitting(false);
    }
  }

  if (loadingData) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-10">
        <Loading text="Memuat data warung…" />
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-10">
        <ErrorMessage message={loadError} />
      </main>
    );
  }

  const hasFieldErrors = Object.keys(fieldErrors).length > 0;

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 flex flex-wrap gap-8 items-start">
      {/* Kolom kiri: judul + info pemilik */}
      <aside className="flex-[1_1_280px] flex flex-col gap-5">
        <h1 className={`${ui.title} text-5xl`}>
          {isEdit ? (
            <>
              Ubah
              <br />
              Warung
            </>
          ) : (
            <>
              Daftarkan
              <br />
              Warung
            </>
          )}
        </h1>
        <p className="text-base">
          Hanya nama yang wajib. Sisanya boleh dilengkapi kapan saja.
        </p>
        {user && (
          <div className="bg-daun border-[3px] border-arang p-5 flex flex-col gap-2">
            <span className={ui.eyebrow}>
              {isEdit ? "Masuk sebagai" : "Pemilik otomatis"}
            </span>
            <span className="font-display text-xl uppercase">{user.name}</span>
            <span className="text-sm">{user.email}</span>
            <span className="text-sm">
              {isEdit
                ? "Owner hanya bisa menyimpan perubahan untuk warung miliknya sendiri."
                : "Warung dicatat atas nama akun yang sedang masuk. Hanya admin yang bisa menghapus."}
            </span>
          </div>
        )}
      </aside>

      {/* Kolom kanan: form bernomor. noValidate supaya validasi dilakukan backend */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className={`${ui.panel} flex-[999_1_600px] min-w-0 flex flex-col`}
      >
        {forbidden ? (
          <div
            role="alert"
            className="bg-arang text-white px-5 py-3 border-b-[3px] border-arang flex flex-col gap-1"
          >
            <span className="font-mono text-xs font-bold text-kunyit">
              403 FORBIDDEN
            </span>
            <span className="font-bold">{formError}</span>
          </div>
        ) : (
          formError && (
            <div
              role="alert"
              className="bg-bata text-white px-5 py-3 border-b-[3px] border-arang font-extrabold uppercase"
            >
              {hasFieldErrors
                ? "Validasi gagal: perbaiki kolom bertanda merah"
                : formError}
            </div>
          )
        )}

        {FIELDS.map((f, i) => {
          const err = fieldErrors[f.key];
          return (
            <div
              key={f.key}
              className={`p-5 border-b-[3px] border-arang flex gap-4 items-start ${err ? "bg-[#F7E4DF]" : ""}`}
            >
              <span className="font-mono text-2xl font-bold w-9">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0 flex flex-col gap-2">
                <label htmlFor={f.key} className={ui.label}>
                  {f.label}
                  {f.required && " *"}
                </label>
                {f.textarea ? (
                  <textarea
                    id={f.key}
                    rows={4}
                    value={form[f.key]}
                    onChange={(e) => update(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    aria-invalid={!!err}
                    className={`w-full px-4 py-3 bg-white text-arang text-base border-[3px] ${err ? "border-bata" : "border-arang"} focus:outline-none focus:shadow-kotak-sm resize-y`}
                  />
                ) : (
                  <input
                    id={f.key}
                    type="text"
                    value={form[f.key]}
                    onChange={(e) => update(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    aria-invalid={!!err}
                    className={err ? ui.inputError : ui.input}
                  />
                )}
                {err ? (
                  <span className={ui.fieldError}>{err}</span>
                ) : (
                  <span className="font-mono text-xs text-neutral-600">
                    {f.textarea ? `${form.description.length} / 1000` : f.hint}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        <div className="flex flex-wrap">
          <Link
            to={isEdit ? `/stalls/${stallId}` : "/"}
            className="flex-[1_1_160px] h-16 flex items-center justify-center border-r-[3px] border-arang font-extrabold uppercase"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="flex-[2_1_240px] h-16 bg-arang text-kunyit text-lg font-extrabold uppercase tracking-wide disabled:opacity-60"
          >
            {submitting ? "Menyimpan..." : "Simpan warung →"}
          </button>
        </div>
      </form>
    </main>
  );
}
