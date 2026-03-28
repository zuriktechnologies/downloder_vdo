
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();

// 1. CORS allow karein
app.use(cors());
app.use(express.json());

// 2. Ye line aapke HTML, CSS, JS files ko server par load karegi
app.use(express.static(__dirname));

// 3. Jab koi http://localhost:3000 khole, toh index.html dikhao
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 4. Video fetch karne wala main rasta (Route)
app.get('/fetch-video', async (req, res) => {
    const pinUrl = req.query.url;

    if (!pinUrl) {
        return res.status(400).json({ error: "URL dalo bhai!" });
    }

    try {
        console.log("Fetching URL:", pinUrl);

        // Pinterest page ka HTML nikalna
        const response = await axios.get(pinUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
            }
        });

        const html = response.data;

        // Video URL dhoondne ke liye Regex patterns
        const match = html.match(/"contentUrl":"(https:[^"]+\.mp4)"/) || 
                      html.match(/"video_url":"(https:[^"]+\.mp4)"/) ||
                      html.match(/https?:\/\/[^"']+\.mp4/);

        if (match) {
            let videoUrl = match[1] ? match[1] : match[0];
            videoUrl = videoUrl.replace(/\\u002F/g, "/");

            console.log("Video Found ✅");
            res.json({ success: true, downloadUrl: videoUrl });
        } else {
            console.log("Video Not Found ❌");
            res.status(404).json({ success: false, message: "Video link nahi mila!" });
        }

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ success: false, message: "Server error ya Invalid Link" });
    }
});

// Server Start
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`-----------------------------------`);
    console.log(`🚀 Backend + Frontend Ready Hai!`);
    console.log(`🔗 Address: http://localhost:${PORT}`);
    console.log(`-----------------------------------`);
});