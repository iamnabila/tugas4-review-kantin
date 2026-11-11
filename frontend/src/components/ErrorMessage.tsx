import { ui } from "../utils/ui";

interface Props {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({
  title = "Gagal memuat",
  message,
  onRetry,
}: Props) {
  return (
    <div
      role="alert"
      className="bg-bata text-white border-[3px] border-arang shadow-kotak p-8 flex flex-col gap-4"
    >
      <h2 className={`${ui.title} text-4xl`}>{title}</h2>
      <p className="font-semibold">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className={`${ui.btnDark} self-start`}
        >
          Coba lagi
        </button>
      )}
    </div>
  );
}
