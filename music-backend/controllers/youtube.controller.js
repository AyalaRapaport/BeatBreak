import axios from 'axios';
import youtubedl from 'youtube-dl-exec';
import archiver from 'archiver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ytdl from 'ytdl-core';

const API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3/search';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function searchVideos(req, res) {
    const { query } = req.query;

    try {
        const response = await axios.get(BASE_URL, {
            params: {
                part: 'snippet',
                type: 'video',
                q: query,
                key: API_KEY,
            },
        });
        res.json(response.data.items);
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
};

export const downloadPlaylist = async (req, res) => {
    const { playlist, type } = req.body;

    if (!playlist || playlist.length === 0) {
        return res.status(400).send('No videos to download');
    }

    const downloadsDir = path.join(__dirname, '..', 'downloads');
    if (!fs.existsSync(downloadsDir)) {
        fs.mkdirSync(downloadsDir);
    }

    const zipPath = path.join(downloadsDir, 'playlist.zip');
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
        res.download(zipPath, 'playlist.zip', (err) => {
            if (err) {
                console.error(err);
            }
            fs.unlinkSync(zipPath);
        });
    });

    archive.on('error', (err) => {
        throw err;
    });

    archive.pipe(output);

    for (const videoId of playlist) {
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        const fileExtension = type === 'audio' ? 'mp3' : 'mp4';
        const fileName = `${videoId}.${fileExtension}`;
        const filePath = path.join(downloadsDir, fileName);

        console.log(`Downloading video: ${videoUrl} to ${filePath}`);

        const options = type === 'audio' ? { extractAudio: true, audioFormat: 'mp3', output: filePath }
            : { format: 'mp4', output: filePath };

        try {
            await youtubedl(videoUrl, options);

            if (fs.existsSync(filePath)) {
                console.log(`Adding ${fileName} to archive`);
                archive.file(filePath, { name: fileName });
                console.log(`Deleting file: ${filePath}`);
                fs.unlinkSync(filePath);
            } else {
                console.error(`File not found after download: ${filePath}`);
            }
        } catch (err) {
            console.error(`Failed to download video: ${videoUrl}`, err);
        }
    }

    archive.finalize();
};

export const downloadYoutubeFile = async (sourceId, id)=> {
    const filePath = `downloads/${id}.mp3`; // מיקום הקובץ להורדה
    const fileStream = fs.createWriteStream(filePath);

    const stream = ytdl(`http://www.youtube.com/watch?v=${sourceId}`, {
        quality: 'highestaudio', // הורדת האודיו באיכות הגבוהה ביותר
    });

    // צור Promise שיחכה לסיום ההורדה
    await new Promise((resolve, reject) => {
        stream.pipe(fileStream);
        fileStream.on('finish', resolve);
        fileStream.on('error', reject);
    });

    return {
        file: filePath, // החזר את נתיב הקובץ
    };
}
