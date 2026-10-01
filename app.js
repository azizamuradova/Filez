import express from 'express';
import { getFilesIncludingFolderName, createFile } from '#db/queries/files';
import { getFolders, getFolderByIdIncludingFiles } from '#db/queries/folders';

const app = express();
export default app;

app.use(express.json());

app.get('/files', async (req, res) => {
  const files = await getFilesIncludingFolderName();
  res.send(files);
});

app.get('/folders', async (req, res) => {
  const folders = await getFolders();
  res.send(folders);
});

app.get('/folders/:id', async (req, res) => {
  const folder = await getFolderByIdIncludingFiles(req.params.id);
  if (!folder) return res.status(404).send('Folder not found.');
  res.send(folder);
});

app.post('/folders/:id/files', async (req, res) => {
  const folder = await getFolderByIdIncludingFiles(req.params.id);
  if (!folder) return res.status(404).send('Folder not found.');

  if (!req.body) return res.status(400).send('Request body is required.');

  const { name, size } = req.body;
  if (!name || !size) {
    return res.status(400).send('Request body requires: name, size');
  }

  const file = await createFile({ name, size, folderId: folder.id });
  res.status(201).send(file);
});

app.use((err, req, res, next) => {
  if (err.code === '23505') return res.status(400).send(err.detail);

  console.error(err);
  res.status(500).send('Sorry! Something went wrong.');
});
