import express from 'express'
import {downloadPlaylist, downloadYoutubeFile, searchVideos} from '../controllers/youtube.controller.js'
const router = express.Router();
router.get('/search', searchVideos);
//router.post('/download', downloadPlaylist);
router.post('/download', downloadYoutubeFile);


export default router