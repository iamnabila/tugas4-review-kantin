import { Link } from "react-router-dom";
import { ui } from "../utils/ui";

export default function Forbidden() {
  return (
    <main className="max-w-xl mx-auto my-16 px-6">
      <div className="bg-daun border-[3px] border-arang shadow-kotak p-8 flex flex-col items-start gap-4">
        <span className="font-display text-8xl leading-none">403</span>
        <h1 className={`${ui.title} text-2xl`}>Akses ditolak</h1>
        <p className="text-lg">Halaman ini tidak tersedia untuk akunmu.</p>
        <Link to="/" className={ui.btnSecondary}>
          Kembali ke beranda
        </Link>
      </div>
    </main>
  );
}
