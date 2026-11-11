import { Link } from "react-router-dom";
import { ui } from "../utils/ui";

export default function NotFound() {
  return (
    <main className="max-w-xl mx-auto my-16 px-6">
      <div className="bg-kunyit border-[3px] border-arang shadow-kotak p-8 flex flex-col items-start gap-4">
        <span className="font-display text-8xl leading-none">404</span>
        <p className="text-lg font-semibold">Halaman tidak ditemukan.</p>
        <Link to="/" className={ui.btnSecondary}>
          ← Ke papan warung
        </Link>
      </div>
    </main>
  );
}
