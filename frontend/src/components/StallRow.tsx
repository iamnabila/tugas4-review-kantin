import { Link } from "react-router-dom";
import type { Stall } from "../types/api";
import { categoryBg } from "../utils/category";
import { ui } from "../utils/ui";

interface Props {
  stall: Stall;
  number: number; // nomor urut di papan, dihitung di StallList
}

export default function StallRow({ stall, number }: Props) {
  const hasReview = stall.reviewCount > 0;

  return (
    <Link
      to={`/stalls/${stall.id}`}
      className="flex flex-wrap items-center gap-x-5 gap-y-3 p-5 border-b-[3px] border-arang hover:bg-kertas focus-visible:outline-none focus-visible:bg-kunyit/30"
    >
      <span className="font-mono text-2xl font-bold w-10">
        {String(number).padStart(2, "0")}
      </span>

      <span className="flex-[999_1_240px] min-w-0 flex flex-col gap-1">
        <span className={`${ui.title} text-2xl break-words`}>{stall.name}</span>
        {stall.description && (
          <span className="text-sm text-neutral-700">{stall.description}</span>
        )}
      </span>

      <span className="flex-auto flex flex-wrap items-center gap-2">
        {stall.category && (
          <span className={`${ui.tag} ${categoryBg(stall.category)}`}>
            {stall.category}
          </span>
        )}
        {stall.location && (
          <span className="text-sm font-semibold">{stall.location}</span>
        )}
      </span>

      {hasReview ? (
        <span className="w-20 h-16 flex flex-col items-center justify-center bg-kunyit border-[3px] border-arang">
          <span className="font-display text-2xl leading-none">
            {Number(stall.avgRating).toFixed(1)}
          </span>
          <span className="font-mono text-[11px] font-bold">
            {stall.reviewCount} ULASAN
          </span>
        </span>
      ) : (
        <span className="w-20 h-16 flex flex-col items-center justify-center bg-white border-[3px] border-dashed border-arang">
          <span className="font-display text-base leading-none">BARU</span>
          <span className="font-mono text-[10px] font-bold">BELUM DIULAS</span>
        </span>
      )}
    </Link>
  );
}
