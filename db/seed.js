import db from "#db/client";
import { createFolder } from "#db/queries/folders";
import { createFile } from "#db/queries/files";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const folderNames = ["Documents", "Photos", "Music"];
  for (const folderName of folderNames) {
    const folder = await createFolder(folderName);
    for (let i = 1; i <= 5; i++) {
      await createFile({
        name: `${folderName.toLowerCase()}-${i}.txt`,
        size: Math.floor(Math.random() * 10000) + 1,
        folderId: folder.id,
      });
    }
  }
}
