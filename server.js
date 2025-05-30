const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/stream/:videoId", async (req, res) => {
  const { videoId } = req.params;

  try {
    const response = await fetch(`https://pipedapi.nosebs.ru/stream/${videoId}`);
    const data = await response.json();

    // Pick only what you need
    const minimalData = {
      title: data.title,
      uploader: data.uploader,
      // Just pick the first video or audio stream URL for example
      videoUrl: data.videoStreams?.[0]?.url || data.audioStreams?.[0]?.url,
    };

    res.json(minimalData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch video data." });
  }
});

app.listen(PORT, () => console.log(`Proxy server is running on port ${PORT}`));
