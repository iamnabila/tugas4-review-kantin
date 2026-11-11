import { ui } from "./utils/ui";

export default function App() {
  return (
    <div className="p-10 flex flex-col items-start gap-6">
      <h1 className="font-display text-5xl uppercase text-bata">Ulas Kantin</h1>
      <p className={ui.eyebrow}>Tes font mono</p>
      <button className={ui.btnPrimary}>Tombol utama</button>
      <span className={`${ui.tag} bg-kunyit`}>Nasi</span>
      <span className={`${ui.tag} bg-daun`}>Kwetiau</span>
    </div>
  );
}
