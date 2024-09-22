import { useState } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");

  return (
    <>
      <h1>Linkedin Article Creator</h1>
      <div className="card">
        <input
          type="text"
          placeholder="Search articles"
          className="search"
          style={{ width: "100%", padding: "10px" }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <p>Enter a term in the search bar to gather articles</p>
      </div>
      <button
        className="button"
        title={`Get latest articles on ${query}`}
        onClick={() => alert("Not implemented yet")}
        disabled={query.length == 0}
      >
        {query.length == 0 ? "Enter a term" : `Get latest articles on ${query}`}
      </button>
    </>
  );
}

export default App;
