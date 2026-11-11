import { ui } from "../utils/ui";

interface Props {
  name: string;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteModal({
  name,
  deleting,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-arang/70 flex items-center justify-center p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="hapus-judul"
        className="w-full max-w-md bg-white border-[3px] border-white shadow-[8px_8px_0_#BF4E37] p-6 flex flex-col gap-4"
      >
        <h2 id="hapus-judul" className={`${ui.title} text-2xl`}>
          Hapus {name}?
        </h2>
        <p>
          Warung ini akan dihapus dari database dan tidak bisa dikembalikan.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className={`${ui.btnSecondary} flex-1`}
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className={`${ui.btnPrimary} flex-1`}
          >
            {deleting ? "Menghapus..." : "Ya, hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}
