import { StoreService } from '../src/services/store.service.js';

async function main() {
  console.log('[Prisma Seed] Initializing Aachen dormitory database seed...');
  const store = StoreService.getInstance();
  console.log(`[Prisma Seed] Seeded ${store.buildings.length} Aachen dormitory buildings.`);
  console.log(`[Prisma Seed] Seeded ${store.users.length} default users (Lina, Daniel, Marcus, Noor).`);
  console.log(`[Prisma Seed] Seeded ${store.issues.length} initial maintenance requests.`);
  console.log(`[Prisma Seed] Seeded ${store.comments.length} comments and status history entries.`);
  console.log('[Prisma Seed] Database seeding completed successfully.');
}

main().catch(err => {
  console.error('[Prisma Seed] Error during seeding:', err);
  process.exit(1);
});
