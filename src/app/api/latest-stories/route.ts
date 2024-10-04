import { NextApiResponse } from "next";

export async function GET(res: NextApiResponse) {
  if (!process.env.NEXT_PUBLIC_NEWSCATCHER_API_KEY) {
    res.status(500).json({ error: "API key not found" });
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
      res.status(500).json({ error: "Failed to fetch latest stories" });
    }

    res.status(200).json({ data: response.json() });
  }
}
