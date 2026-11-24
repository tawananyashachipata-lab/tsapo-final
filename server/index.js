import dotenv from 'dotenv';
import app from './app.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });


const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Tsapo API running on http://localhost:${port}`);
});