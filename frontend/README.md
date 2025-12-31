# BeyondChats Full Stack Assignment

## Project Overview
This project is a 3-phase full stack web developer assignment for BeyondChats:

1. **Phase 1**: Scrape 5 oldest articles from BeyondChats blogs, store in MongoDB, and create CRUD APIs.
2. **Phase 2**: Node.js script to:
   - Fetch articles from API
   - Search Google for similar articles
   - Scrape content from top 2 links
   - Update original article using LLM API
   - Publish updated article via CRUD API
3. **Phase 3**: ReactJS frontend to display original and updated articles.

## Tech Stack
- Backend: Node.js, Express.js, MongoDB, Mongoose
- AI Script: Node.js, Cheerio, Axios, OpenAI API
- Frontend: ReactJS, Axios, Bootstrap/Material-UI

## Local Setup

### **Backend**
```bash
cd backend
npm install
# Add your MongoDB URI to .env
# Example:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
npm run dev
[Frontend ReactJS] <--> [Backend APIs] <--> [MongoDB]
                 ^
                 |
             [AI Script -> OpenAI API & Google Search]
