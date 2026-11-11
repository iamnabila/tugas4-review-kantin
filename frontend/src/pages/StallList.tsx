import { useCallback, useEffect, useState } from "react";
import { getStalls } from "../lib/stallApi";
import { getErrorMessage } from "../lib/errors";
import type { PaginationMeta, Stall } from "../types/api";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import ErrorMessage from "../components/ErrorMessage";
import StallRow from "../components/StallRow";
import Toast from "../components/Toast";
import { useFlashToast } from "../utils/useFlashToast";
import { categoryBg } from "../utils/category";
import { ui } from "../utils/ui";

const LIMIT = 10;
// kategori yang ada di data seed; tambahkan kalau di database kamu ada kategori lain
const CATEGORIES = ["Nasi", "Kwetiau"];

export default function StallList() {
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState(""); // yang sedang diketik
  const [search, setSearch] = useState(""); // yang dikirim ke backend
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const { toast, clearToast } = useFlashToast();

  // debounce: kirim pencarian 400 ms setelah berhenti mengetik
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getStalls({ search, category, page, limit: LIMIT });
      setStalls(res.data);
      setMeta(res.meta ?? null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [search, category, page]);

  useEffect(() => {
    load();
  }, [load]);

  function pickCategory(c: string) {
    setCategory(c);
    setPage(1);
  }

  function resetFilter() {
    setSearchInput("");
    setSearch("");
    setCategory("");
    setPage(1);
  }

  const isFiltered = search !== "" || category !== "";
  const totalPages = meta?.totalPages ?? 1;

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 flex flex-wrap gap-8 items-start">
      {toast && <Toast message={toast} onClose={clearToast} />}

      {/* Kolom kiri: judul + filter */}
      <aside className="flex-[1_1_260px] flex flex-col gap-5">
        <h1 className={`${ui.title} text-5xl`}>
          Papan
          <br />
          Warung
        </h1>
        <p>Temukan warung favorit berdasarkan rating dan ulasan.</p>

        <label className="flex flex-col gap-2">
          <span className={ui.eyebrow}>Cari warung</span>
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Nama warung"
            className={ui.input}
          />
        </label>

        <div
          role="group"
          aria-label="Kategori"
          className="flex flex-col gap-2.5"
        >
          <span className={ui.eyebrow}>Kategori</span>
          {["", ...CATEGORIES].map((c) => {
            const active = category === c;
            const color = active
              ? "bg-arang text-white"
              : c
                ? categoryBg(c)
                : "bg-white";
            return (
              <button
                key={c || "semua"}
                type="button"
                aria-pressed={active}
                onClick={() => pickCategory(c)}
                className={`h-12 px-4 flex items-center justify-between border-[3px] border-arang font-extrabold uppercase ${color}`}
              >
                {c || "Semua"}
                {active && <span className="font-mono">✓</span>}
              </button>
            );
          })}
        </div>
      </aside>

      {/* Kolom kanan: papan warung */}
      <section
        aria-label="Daftar warung"
        className="flex-[999_1_640px] min-w-0"
      >
        {loading ? (
          <Loading text="Memuat daftar warung…" />
        ) : error ? (
          <ErrorMessage message={error} onRetry={load} />
        ) : stalls.length === 0 ? (
          isFiltered ? (
            <EmptyState
              title="Tidak ditemukan"
              message="Coba kata kunci lain atau tampilkan semua kategori."
              actionLabel="Tampilkan semua"
              onAction={resetFilter}
            />
          ) : (
            <EmptyState
              title="Belum ada warung"
              message="Warung yang terdaftar akan muncul di sini."
            />
          )
        ) : (
          <div className={`${ui.panel} flex flex-col`}>
            <div
              className={`${ui.eyebrow} bg-arang text-white px-5 py-3 flex justify-between gap-4`}
            >
              <span>Warung</span>
              <span>{meta?.total ?? stalls.length} warung</span>
            </div>

            {stalls.map((s, i) => (
              <StallRow
                key={s.id}
                stall={s}
                number={(page - 1) * LIMIT + i + 1}
              />
            ))}

            <nav aria-label="Halaman" className="flex flex-wrap">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="flex-[1_1_160px] h-14 font-extrabold uppercase border-r-[3px] border-arang bg-white disabled:bg-neutral-200 disabled:text-neutral-500"
              >
                ← Sebelumnya
              </button>
              <span className="flex-[1_1_120px] flex items-center justify-center font-mono font-bold">
                HAL {page} / {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="flex-[1_1_160px] h-14 font-extrabold uppercase border-l-[3px] border-arang bg-arang text-white disabled:bg-neutral-200 disabled:text-neutral-500"
              >
                Berikutnya →
              </button>
            </nav>
          </div>
        )}
      </section>
    </main>
  );
}
