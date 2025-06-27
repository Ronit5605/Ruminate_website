const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Gallery
const galleryData = require("./data/gallary.json");
app.get("/api/gallary", (req, res) => {
  const { year, event } = req.query;
  let images = galleryData[year] || [];

  if (event && event !== "All") {
    images = images.filter((img) => img.event === event);
  }

  res.json(images);
});

// Team
app.get('/api/team/:category', (req, res) => {
  const category = req.params.category;
  const data = JSON.parse(fs.readFileSync('./data/team.json', 'utf-8'));
  if (!data[category]) {
    return res.status(404).json({ error: 'Category not found' });
  }
  res.json(data[category]);
});

// Blogs
const blogs = JSON.parse(fs.readFileSync('./data/blogs.json', 'utf-8'));
app.get('/api/blogs', (req, res) => {
  const brief = blogs.map(({ id, title, imageUrl, excerpt }) => ({
    id, title, imageUrl, excerpt
  }));
  res.json(brief);
});

app.get('/api/blogs/:id', (req, res) => {
  const blog = blogs.find(b => b.id === req.params.id);
  if (!blog) return res.status(404).json({ error: 'Blog not found' });
  res.json(blog);
});

// Past Events
app.get("/api/past-events", (req, res) => {
  const pastEvents = JSON.parse(fs.readFileSync("./data/pastEvents.json", "utf-8"));
  res.json(pastEvents);
});

// Start Server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
