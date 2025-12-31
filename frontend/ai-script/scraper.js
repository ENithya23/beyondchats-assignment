require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');

// ------------------ Mongoose Setup ------------------
// ------------------ Mongoose Setup ------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// ------------------ Article Model ------------------
const articleSchema = new mongoose.Schema({
  title: String,
  link: String,
  summary: String,
  date: Date,
});

const Article = mongoose.model('Article', articleSchema);

// ------------------ Scraper Function ------------------
async function scrapeArticles() {
  try {
    const url = 'https://beyondchats.com/blogs/';
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const articles = [];

    // Select all articles
    $('div.blog-post').each((i, elem) => {
      const title = $(elem).find('h3').text().trim();
      const link = $(elem).find('a').attr('href');
      const summary = $(elem).find('p').text().trim();
      const dateText = $(elem).find('time').attr('datetime');
      const date = dateText ? new Date(dateText) : new Date();

      if (title && link) {
        articles.push({ title, link, summary, date });
      }
    });

    // Get 5 oldest articles (last page)
    const oldestFive = articles.slice(-5);

    if (oldestFive.length === 0) {
      console.log('Fetched 0 articles');
      return;
    }

    // Save to MongoDB
    for (let art of oldestFive) {
      const exists = await Article.findOne({ title: art.title });
      if (!exists) {
        const newArticle = new Article(art);
        await newArticle.save();
        console.log('Saved article:', art.title);
      } else {
        console.log('Article already exists:', art.title);
      }
    }

    console.log('Scraping complete!');
    process.exit(0);
  } catch (err) {
    console.error('Error scraping articles:', err);
    process.exit(1);
  }
}

// Run scraper
scrapeArticles();
