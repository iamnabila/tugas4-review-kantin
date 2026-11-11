import { useEffect } from "react";

interface Props {
  message: string;
  onClose: () => void;
}

export default function Toast({ message, onClose }: Props) {
  // hilang sendiri setelah 3 detik
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  return (
    <div
      role="status"
      className="fixed top-24 right-6 z-50 bg-daun border-[3px] border-arang shadow-kotak-sm px-4 py-3 font-extrabold uppercase"
    >
      ✓ {message}
    </div>
  );
}
