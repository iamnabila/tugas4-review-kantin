import { useEffect, useState } from "react";
import { getMe } from "../lib/authApi";
import { getErrorMessage } from "../lib/errors";
import type { User } from "../types/api";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import { ui } from "../utils/ui";

export default function Profile() {
  const [me, setMe] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // dipanggil langsung supaya request GET /auth/me terlihat di tab Network (bukti E.8)
  useEffect(() => {
    getMe()
      .then(setMe)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className={ui.eyebrow}>Data dari GET /auth/me</span>
        <h1 className={`${ui.title} text-5xl`}>Profil</h1>
      </div>

      {loading && <Loading text="Memuat profil…" />}
      {error && <ErrorMessage message={error} />}

      {me && (
        <dl className={`${ui.panel} grid grid-cols-1 sm:grid-cols-2`}>
          <div className="p-5 border-b-[3px] sm:border-r-[3px] border-arang flex flex-col gap-1">
            <dt className={ui.eyebrow}>Nama</dt>
            <dd className="font-display text-2xl uppercase">{me.name}</dd>
          </div>
          <div className="p-5 border-b-[3px] border-arang flex flex-col gap-1">
            <dt className={ui.eyebrow}>Email</dt>
            <dd className="text-lg font-semibold break-all">{me.email}</dd>
          </div>
          <div className="p-5 border-b-[3px] sm:border-b-0 sm:border-r-[3px] border-arang flex flex-col gap-1">
            <dt className={ui.eyebrow}>Role</dt>
            <dd>
              <span className={`${ui.tag} bg-kunyit`}>{me.role}</span>
            </dd>
          </div>
          <div className="p-5 flex flex-col gap-1">
            <dt className={ui.eyebrow}>Bergabung</dt>
            <dd className="text-lg font-semibold">
              {new Date(me.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </dd>
          </div>
        </dl>
      )}
    </main>
  );
}
