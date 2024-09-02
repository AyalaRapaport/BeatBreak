import 'dotenv/config';
import express, { json, urlencoded } from 'express';
import cors from 'cors'
import morgan from 'morgan'
import youtubeRouter from './routes/youtube.route.js'
import Queue from 'bull';
import { handleJob } from './downloadFileJob.js';

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

app.use('/api/youtube', youtubeRouter)

const jobQueue = new Queue('download-file-job');

// הוסף עבודה חדשה לתור
jobQueue.add({
  sourceId: 'T5Wf3gmF6Do',
  id: 'T5Wf3gmF6Do',
});

// עיבוד העבודה
jobQueue.process(async (job) => {
  await handleJob(job);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
