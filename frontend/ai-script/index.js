require("dotenv").config();
const axios = require("axios");
const cheerio = require("cheerio");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const BACKEND_API = process.env.BACKEND_API;
const SERP_API = "https://serpapi.com/search.json";

/* ------------------ GOOGLE SEARCH ------------------ */
async function googleSearch(title) {
  const res = await axios.get(SERP_API, {
    params: {
      q: title,
      engine: "google",
      api_key: process.env.SERPAPI_KEY,
    },
  });

  return res.data.organic_results
    .filter(r => r.link && r.source)
    .slice(0, 2)
    .map(r => r.link);
}

/* ------------------ SCRAPE ARTICLE ------------------ */
async function scrapeArticle(url) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  let text = "";
  $("p").each((_, el) => {
    text += $(el).text() + "\n";
  });

  return text.substring(0, 4000);
}

/* ------------------ OPENAI REWRITE ------------------ */
async function rewriteArticle(original, ref1, ref2) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are a professional SEO blog writer."
      },
      {
        role: "user",
        content: `
Rewrite this article using better structure, headings, and SEO style.
Use inspiration from the two reference articles.

ORIGINAL:
${original}

REFERENCE 1:
${ref1}

REFERENCE 2:
${ref2}

Add references at the bottom.
`
      }
    ],
  });

  return completion.choices[0].message.content;
}

/* ------------------ MAIN FLOW ------------------ */
async function run() {
  const articles = await axios.get(BACKEND_API);

  for (const article of articles.data) {
    if (article.updated) continue;

    console.log("Processing:", article.title);

    // 1. Google Search
    const links = await googleSearch(article.title);

    // 2. Scrape top 2 articles
    const refContent1 = await scrapeArticle(links[0]);
    const refContent2 = await scrapeArticle(links[1]);

    // 3. AI Rewrite
    const newContent = await rewriteArticle(
      article.content,
      refContent1,
      refContent2
    );

    // 4. Publish updated article
    await axios.put(`${BACKEND_API}/${article._id}`, {
      content: newContent,
      updated: true,
      references: links,
    });

    console.log("Updated & published ✔");
  }
}

run().catch(console.error);
