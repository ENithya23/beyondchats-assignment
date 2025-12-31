import { useEffect, useState } from "react";

function App() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/articles")
      .then(res => res.json())
      .then(data => setArticles(data));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>BeyondChats Articles</h1>

      {articles.map(a => (
        <div key={a._id} style={{ marginBottom: 40 }}>
          <h2>{a.title}</h2>

          <div dangerouslySetInnerHTML={{
            __html: a.updatedContent || a.originalContent
          }} />

          {a.references?.length > 0 && (
            <>
              <h4>References</h4>
              <ul>
                {a.references.map((r, i) => (
                  <li key={i}>
                    <a href={r.url} target="_blank">{r.title}</a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;
