import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { segmentImage } from './karger.js';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

app.post('/api/segment', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const iterations = parseInt(req.body.iterations) || 15;
    const threshold = parseInt(req.body.threshold) || 50;

    console.log(`Processing image with ${iterations} iterations, threshold ${threshold}`);
    
    const result = await segmentImage(req.file.buffer, iterations, threshold);
    
    res.json({
      image: result.imageBase64,
      stats: result.stats
    });
  } catch (error) {
    console.error('Segmentation error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
