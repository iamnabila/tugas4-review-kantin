import { ui } from "../utils/ui";

interface Props {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
}: Props) {
  return (
    <div className="bg-white border-[3px] border-dashed border-arang p-8 flex flex-col gap-4">
      <h2 className={`${ui.title} text-4xl`}>{title}</h2>
      <p className="text-base">{message}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="self-start h-12 px-5 bg-kunyit text-arang border-[3px] border-arang shadow-kotak-sm font-extrabold uppercase"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
