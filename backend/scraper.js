const axios = require("axios");
const cheerio = require("cheerio");
const Article = require("./models/Article");

async function scrape() {
  const { data } = await axios.get("https://beyondchats.com/blogs/");
  const $ = cheerio.load(data);

  const blogs = $(".blog-card").slice(-5);

  for (let i = 0; i < blogs.length; i++) {
    const title = $(blogs[i]).find("h3").text();
    const url = $(blogs[i]).find("a").attr("href");

    await Article.create({
      title,
      url,
      content: "Original content scraped",
      updated: false
    });
  }
}

scrape();
