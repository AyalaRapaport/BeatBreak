import axios from 'axios';
const API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3/search';

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

