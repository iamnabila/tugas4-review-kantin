// Warna tag kategori: Nasi = kunyit, kategori lain = daun
export function categoryBg(category: string | null) {
  if (!category) return "bg-white";
  return category.toLowerCase() === "nasi" ? "bg-kunyit" : "bg-daun";
}
