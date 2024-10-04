// pages/results.tsx
import ClientComponent, { Article } from "./ClientComponent";

async function getLatestStories(): Promise<{
  data: {
    status: string;
    total_hits: number;
    articles: Article[];
  } | null;
  error: string | null;
}> {
  if (!process.env.NEXT_PUBLIC_NEWSCATCHER_API_KEY) {
    return { data: null, error: "API key not found" };
  } else {
    const urlWithParams = new URL(
      "https://v3-api.newscatcherapi.com/api/search?"
    );
    urlWithParams.searchParams.append("q", "(Fintech) OR (Finance AND Tech)");
    urlWithParams.searchParams.append("lang", "en");
    urlWithParams.searchParams.append("sort_by", "relevancy");
    urlWithParams.searchParams.append("page", "1");

    const response = await fetch(urlWithParams.toString(), {
      method: "GET",
      headers: {
        "x-api-token": process.env.NEXT_PUBLIC_NEWSCATCHER_API_KEY,
      },
    });

    console.log(await response.text());

    if (response.status !== 200) {
      return { data: null, error: "Failed to fetch latest stories" };
    }

    return {
      data: await response.json(),
      error: response.status !== 200 ? "Failed to fetch latest stories" : null,
    };
  }
}

export default async function Results() {
  const { data, error } = await getLatestStories();

  if (!data) {
    return (
      <main className="min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <p className="text-red-500">{error}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {error && <p className="text-red-500">{error}</p>}
      <ClientComponent articles={data.articles} />
    </main>
  );
}
