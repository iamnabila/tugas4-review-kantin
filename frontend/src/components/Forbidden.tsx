import { Link } from "react-router-dom";
import { ui } from "../utils/ui";

export default function Forbidden() {
  return (
    <div className="max-w-xl mx-auto my-16 px-6">
      <div className="bg-daun border-[3px] border-arang shadow-kotak p-8 flex flex-col items-start gap-4">
        <span className="font-display text-8xl leading-none">403</span>
        <p className="text-lg font-semibold">
          Halaman ini khusus admin dan owner. Kamu tidak punya akses ke sini.
        </p>
        <Link to="/" className={ui.btnSecondary}>
          ← Ke papan warung
        </Link>
      </div>
    </div>
  );
}
