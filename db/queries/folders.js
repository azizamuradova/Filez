import db from "#db/client";

export async function createFolder(name) {
  const sql = `INSERT INTO folders (name) VALUES ($1) RETURNING *`;
  const {
    rows: [folder],
  } = await db.query(sql, [name]);
  return folder;
}

export async function getFolders() {
  const { rows: folders } = await db.query(`SELECT * FROM folders`);
  return folders;
}

export async function getFolderByIdIncludingFiles(id) {
  const sql = `
    SELECT
      folders.*,
      (
        SELECT json_agg(files)
        FROM files
        WHERE files.folder_id = folders.id
      ) AS files
    FROM folders
    WHERE folders.id = $1
  `;
  const {
    rows: [folder],
  } = await db.query(sql, [id]);
  return folder;
}
