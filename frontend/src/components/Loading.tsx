import { ui } from "../utils/ui";

export default function Loading({ text = "Memuat…" }: { text?: string }) {
  return (
    <div
      className={`${ui.panel} flex flex-col`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-4 p-4 border-b-[3px] border-arang">
        <div className="w-8 h-6 bg-gray-300" />
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-5 w-4/5 bg-gray-300 animate-pulse" />
          <div className="h-3 w-1/2 bg-gray-200 animate-pulse" />
        </div>
        <div className="w-14 h-12 bg-kunyit/40 border-[3px] border-arang" />
      </div>
      <div className="flex items-center gap-4 p-4">
        <div className="w-8 h-6 bg-gray-300" />
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-5 w-3/5 bg-gray-300 animate-pulse" />
          <div className="h-3 w-2/5 bg-gray-200 animate-pulse" />
        </div>
        <div className="w-14 h-12 bg-kunyit/40 border-[3px] border-arang" />
      </div>
      <p className={`${ui.eyebrow} text-center py-4`}>{text}</p>
    </div>
  );
}
