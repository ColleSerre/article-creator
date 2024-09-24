import OpenAI from "openai";

export async function POST(req: Request) {
  const selectedArticles: {
    selectedArticles: {
      source: {
        id: string | null;
        name: string;
      };
      author: string | null;
      title: string;
      description: string;
      urlToImage: string;
      url: string;
      content: string;
    }[];
  } = await req.json();

  console.log(selectedArticles);

  if (!selectedArticles) {
    return new Response("Invalid request", {
      status: 400,
    });
  }

  if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
    return new Response(
      `OpenAI API key not found: ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      {
        status: 500,
      }
    );
  }
  console.log(process.env.NEXT_PUBLIC_OPENAI_API_KEY);

  const client = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  });

  try {
    let articlesContent =
      "use slash n for newline, structure it using markdown Do a daily news roundup on\n";

    selectedArticles.selectedArticles.forEach((article) => {
      articlesContent +=
        "Article: " +
        article.title +
        " " +
        article.source.name +
        " " +
        article.description +
        " " +
        article.url +
        " " +
        article.content +
        " " +
        article.urlToImage +
        "\n";
    });

    const chatCompletion = await client.chat.completions.create({
      messages: [
        {
          role: "user",
          content: articlesContent,
        },
      ],
      model: "gpt-3.5-turbo",
    });

    if (chatCompletion.choices.length === 0) {
      return new Response("Failed to generate article", {
        status: 500,
      });
    }

    console.log(chatCompletion.choices[0].message.content);
    return new Response(
      JSON.stringify({ content: chatCompletion.choices[0].message.content }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(`Failed to generate article: ${error}`, {
      status: 500,
    });
  }
}
