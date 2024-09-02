import 'dotenv/config';
import express, { json, urlencoded } from 'express';
import cors from 'cors'
import morgan from 'morgan'
import youtubeRouter from './routes/youtube.route.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

app.use('/api/youtube', youtubeRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
