import "dotenv/config";
import bcrypt from "bcryptjs";
import { and, eq } from "drizzle-orm";
import { getDb } from "./index.ts";
import { stalls, users } from "./schema.ts";

const PASSWORD = "password123";

const accounts = [
  { name: "Admin Uji", email: "admin@kantin.test", role: "admin" },
  { name: "Owner Uji Satu", email: "owner1@kantin.test", role: "owner" },
  { name: "Owner Uji Dua", email: "owner2@kantin.test", role: "owner" },
  { name: "Customer Uji", email: "customer@kantin.test", role: "customer" },
] as const;

async function main() {
  const db = await getDb();
  const passwordHash = await bcrypt.hash(PASSWORD, 10);
  const ids: Record<string, number> = {};

  for (const acc of accounts) {
    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.email, acc.email));
    if (existing) {
      await db
        .update(users)
        .set({ passwordHash, role: acc.role })
        .where(eq(users.id, existing.id));
      ids[acc.email] = existing.id;
    } else {
      const [created] = await db
        .insert(users)
        .output()
        .values({ ...acc, passwordHash });
      ids[acc.email] = created!.id;
    }
  }

  const stallData = [
    { name: "Warung Uji Owner Satu", ownerEmail: "owner1@kantin.test" },
    { name: "Warung Uji Owner Dua", ownerEmail: "owner2@kantin.test" },
  ];
  const stallIds: Record<string, number> = {};

  for (const s of stallData) {
    const ownerId = ids[s.ownerEmail]!;
    const [existing] = await db
      .select()
      .from(stalls)
      .where(and(eq(stalls.name, s.name), eq(stalls.ownerId, ownerId)));
    if (existing) {
      stallIds[s.name] = existing.id;
    } else {
      const [created] = await db.insert(stalls).output().values({
        ownerId,
        name: s.name,
        category: "Nasi",
        location: "Kantin Uji",
        avgRating: "0.00",
        reviewCount: 0,
      });
      stallIds[s.name] = created!.id;
    }
  }

  console.log("\n=== AKUN UJI (password semua: " + PASSWORD + ") ===");
  console.table(
    accounts.map((a) => ({ id: ids[a.email], email: a.email, role: a.role })),
  );
  console.log("=== WARUNG UJI ===");
  console.table(
    stallData.map((s) => ({
      id: stallIds[s.name],
      name: s.name,
      owner: s.ownerEmail,
    })),
  );
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed gagal:", err);
  process.exit(1);
});
