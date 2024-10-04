export async function GET(res: Response) {
  if (!process.env.NEXT_PUBLIC_NEWSCATCHER_API_KEY) {
    return new Response("API key not found", { status: 500 });
  } else {
    const options = {
      method: "GET",
      url: "https://v3-api.newscatcherapi.com/api/search?",
      params: {
        q: "(Fintech) OR (Finance AND Tech)",
        lang: "en",
        sort_by: "relevancy",
        page: "1",
      },
      headers: {
        "x-api-token": process.env.NEXT_PUBLIC_NEWSCATCHER_API_KEY,
      },
    };

    const response = await fetch(options.url, {
      method: options.method,
      headers: {
        "x-api-token": options.headers["x-api-token"],
      },
    });

    if (response.status !== 200) {
      return new Response("Failed to fetch latest stories", { status: 500 });
    }

    return new Response(await response.text(), { status: 200 });
  }
}
