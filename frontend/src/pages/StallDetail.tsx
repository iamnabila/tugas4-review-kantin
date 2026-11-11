import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { deleteStall, getStall } from "../lib/stallApi";
import { getErrorMessage } from "../lib/errors";
import type { Stall } from "../types/api";
import { useAuth } from "../context/AuthContext";
import { canDelete, canEdit } from "../utils/permissions";
import { categoryBg } from "../utils/category";
import { useFlashToast } from "../utils/useFlashToast";
import { ui } from "../utils/ui";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import DeleteModal from "../components/DeleteModal";
import Toast from "../components/Toast";

export default function StallDetail() {
  const { id } = useParams();
  const stallId = Number(id);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast, clearToast } = useFlashToast();

  const [stall, setStall] = useState<Stall | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    setNotFound(false);
    try {
      setStall(await getStall(stallId));
    } catch (err) {
      const status = axios.isAxiosError(err) ? err.response?.status : undefined;
      if (status === 404 || status === 400) setNotFound(true);
      else setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [stallId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete() {
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteStall(stallId);
      navigate("/", { state: { toast: "Warung dihapus" } });
    } catch (err) {
      setDeleteError(getErrorMessage(err));
      setDeleting(false);
      setConfirming(false);
    }
  }

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-10">
        <Loading text="Memuat warung…" />
      </main>
    );
  }

  if (notFound) {
    return (
      <main className="max-w-xl mx-auto my-16 px-6">
        <div className="bg-kunyit border-[3px] border-arang shadow-kotak p-8 flex flex-col items-start gap-4">
          <span className="font-display text-8xl leading-none">404</span>
          <h1 className={`${ui.title} text-2xl`}>Warung tidak ditemukan</h1>
          <p className="text-lg">Warung ini mungkin sudah dihapus.</p>
          <Link to="/" className={ui.btnSecondary}>
            Kembali ke beranda
          </Link>
        </div>
      </main>
    );
  }

  if (error || !stall) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-10">
        <ErrorMessage
          message={error || "Data warung tidak tersedia."}
          onRetry={load}
        />
      </main>
    );
  }

  const showEdit = canEdit(user, stall);
  const showDelete = canDelete(user);

  return (
    <main className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-7">
      {toast && <Toast message={toast} onClose={clearToast} />}

      <Link
        to="/"
        className="self-start font-mono text-sm font-bold uppercase border-b-[3px] border-arang"
      >
        ← Semua warung
      </Link>

      {/* Panel utama: nama + rating */}
      <section className={`${ui.panel} flex flex-wrap`}>
        <div className="flex-[999_1_480px] min-w-0 p-8 flex flex-col gap-4">
          {stall.category && (
            <span
              className={`${ui.tag} ${categoryBg(stall.category)} self-start`}
            >
              {stall.category}
            </span>
          )}
          <h1 className={`${ui.title} text-5xl md:text-7xl break-words`}>
            {stall.name}
          </h1>
          {stall.description && (
            <p className="text-xl font-medium">{stall.description}</p>
          )}
        </div>
        <div className="flex-[1_1_240px] bg-kunyit border-t-[3px] md:border-t-0 md:border-l-[3px] border-arang p-8 flex flex-col justify-center gap-1">
          <span className={ui.eyebrow}>Rating rata-rata</span>
          <span className="font-display text-8xl leading-none">
            {stall.reviewCount > 0 ? Number(stall.avgRating).toFixed(1) : "—"}
          </span>
          <span className="font-bold">
            {stall.reviewCount > 0
              ? `dari 5 · ${stall.reviewCount} ulasan`
              : "Belum ada ulasan"}
          </span>
        </div>
      </section>

      <div className="flex flex-wrap gap-6 items-stretch">
        {/* Tiga kotak info */}
        <dl className="flex-[999_1_480px] min-w-0 grid grid-cols-1 sm:grid-cols-3 bg-white border-[3px] border-arang">
          <div className="p-5 border-b-[3px] sm:border-b-0 sm:border-r-[3px] border-arang flex flex-col gap-1">
            <dt className={ui.eyebrow}>Lokasi</dt>
            <dd className="font-display text-xl uppercase">
              {stall.location ?? "—"}
            </dd>
          </div>
          <div className="p-5 border-b-[3px] sm:border-b-0 sm:border-r-[3px] border-arang flex flex-col gap-1">
            <dt className={ui.eyebrow}>Kategori</dt>
            <dd className="font-display text-xl uppercase">
              {stall.category ?? "—"}
            </dd>
          </div>
          <div className="p-5 flex flex-col gap-1">
            <dt className={ui.eyebrow}>Populer</dt>
            <dd className="font-display text-xl uppercase">
              {stall.isPopular ? "Ya" : "Tidak"}
            </dd>
          </div>
        </dl>

        {/* Panel Kelola: hanya muncul untuk yang punya hak */}
        {(showEdit || showDelete) && (
          <section className="flex-[1_1_280px] bg-arang text-white p-6 flex flex-col gap-4">
            <h2 className="font-display text-2xl uppercase">Kelola warung</h2>
            {deleteError && (
              <p
                role="alert"
                className="bg-bata text-white border-2 border-white px-3 py-2 font-bold"
              >
                {deleteError}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              {showEdit && (
                <Link
                  to={`/stalls/${stall.id}/edit`}
                  className="flex-1 h-12 flex items-center justify-center bg-kunyit text-arang border-[3px] border-white font-extrabold uppercase"
                >
                  Ubah data
                </Link>
              )}
              {showDelete && (
                <button
                  type="button"
                  onClick={() => setConfirming(true)}
                  className="flex-1 h-12 bg-bata text-white border-[3px] border-white font-extrabold uppercase"
                >
                  Hapus warung
                </button>
              )}
            </div>
          </section>
        )}
      </div>

      {confirming && (
        <DeleteModal
          name={stall.name}
          deleting={deleting}
          onCancel={() => setConfirming(false)}
          onConfirm={handleDelete}
        />
      )}
    </main>
  );
}
