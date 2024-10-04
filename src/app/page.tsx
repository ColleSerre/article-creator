// app/results/[slug]/page.tsx

import ClientComponent from "./ClientComponent";

// This is a server component
async function getArticles() {
  // Fetch articles from the News API

  if (!process.env.NEXT_PUBLIC_NEWS_API_KEY) {
    throw new Error("News API key not found");
  }

  // Technology
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const technologyPromise = fetch(
    `https://newsapi.org/v2/top-headlines?country=us&category=technology&sortBy=popularity&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
  );

  // Business
  const businessPromise = fetch(
    `https://newsapi.org/v2/top-headlines?country=us&category=business&sortBy=popularity&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
  );

  // Fintech
  const fintechPromise = fetch(
    `https://newsapi.org/v2/everything?q=fintech&from=2024-09-21&sortBy=popularity&language=en&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
  );

  const [businessRes, fintechRes] = await Promise.all([
    businessPromise,
    fintechPromise,
  ]);

  const responses = [businessRes, fintechRes];
  const validResponses = responses.filter((res) => res.ok);

  const articles = (await Promise.all(validResponses.map((res) => res.json())))
    .flatMap((data) => data.articles)
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
