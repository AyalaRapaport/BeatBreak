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

