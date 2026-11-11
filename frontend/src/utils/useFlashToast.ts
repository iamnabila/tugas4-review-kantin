import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Membaca pesan toast yang dikirim lewat navigate(..., { state: { toast: '...' } })
export function useFlashToast() {
  const location = useLocation();
  const navigate = useNavigate();
  const [toast, setToast] = useState<string | null>(
    (location.state as { toast?: string } | null)?.toast ?? null,
  );

  // hapus state dari riwayat browser supaya toast tidak muncul lagi saat refresh
  useEffect(() => {
    if (location.state) {
      navigate(location.pathname + location.search, {
        replace: true,
        state: null,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { toast, clearToast: () => setToast(null) };
}
