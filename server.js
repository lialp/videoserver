const express = require("express");
const fetch = require("node-fetch");
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Proxy server is running!");
});

app.get("/streams/:videoId", async (req, res) => {
  const videoId = req.params.videoId;

  try {
    const response = await fetch(`https://pipedapi.nosebs.ru/streams/${videoId}`);

    if (!response.ok) {
      const text = await response.text();
      console.log(`Upstream error status: ${response.status}`, text);
      return res.status(502).json({ error: `Upstream API error: ${response.status}`, details: text });
    }

    const data = await response.json();

    // Only include thumbnailUrl and title
    const result = {
      thumbnailUrl: data.thumbnailUrl,
      title: data.title
    };

    res.json(result);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Failed to fetch video data." });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});
