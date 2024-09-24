// app/results/[slug]/page.tsx

import ClientComponent from "./ClientComponent";

// This is a server component
async function getArticles() {
  // Fetch articles from the News API

  // Technology
  const technologyPromise = fetch(
    `https://newsapi.org/v2/top-headlines?country=us&category=technology&sortBy=popularity&apiKey=99e5ac3b58484d54a3ada3f0da642e53`
  );

  // Business
  const businessPromise = fetch(
    `https://newsapi.org/v2/top-headlines?country=us&category=business&sortBy=popularity&apiKey=99e5ac3b58484d54a3ada3f0da642e53`
  );

  // Fintech
  const fintechPromise = fetch(
    `https://newsapi.org/v2/everything?q=fintech&from=2024-09-21&sortBy=popularity&language=en&apiKey=99e5ac3b58484d54a3ada3f0da642e53`
  );

  const [businessRes, fintechRes] = await Promise.all([
    businessPromise,
    fintechPromise,
  ]);

  if (!businessRes.ok || !fintechRes.ok) {
    throw new Error("Failed to fetch articles");
  }

  const [businessData, fintechData] = await Promise.all([
    businessRes.json(),
    fintechRes.json(),
  ]);

  const articles = [businessData.articles, fintechData.articles]
    .flat()
    .filter(
      (article) => article.urlToImage && article.title && article.description
    )
    .removeDuplicates()
    .randomize();

  return articles;
}

// Server component that fetches articles and renders the ClientComponent
declare global {
  interface Array<T> {
    randomize(): T[];
  }
}

declare global {
  interface Array<T> {
    randomize(): T[];
    removeDuplicates(): T[];
  }
}

Array.prototype.randomize = function () {
  return this.sort(() => Math.random() - 0.5);
};

Array.prototype.removeDuplicates = function () {
  return this.filter(
    (value, index, self) =>
      self.findIndex((article) => article.title === value.title) === index
  );
};

export default async function Results() {
  const data = await getArticles();
  // Pass articles to ClientComponent
  return (
    <main className="min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <ClientComponent articles={data} />
    </main>
  );
}
