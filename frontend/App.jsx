import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/articles")
      .then(res => setArticles(res.data));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>BeyondChats Articles</h1>
      {articles.map(a => (
        <div key={a._id} style={{ marginBottom: 30 }}>
          <h3>{a.title}</h3>
          <p>{a.content.substring(0, 300)}...</p>
          <small>Type: {a.type}</small>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;
