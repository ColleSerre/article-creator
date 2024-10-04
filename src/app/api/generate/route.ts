import { Article } from "@/app/ClientComponent";
import OpenAI from "openai";

export async function POST(req: Request) {
  const payload: {
    articles: Article[];
    sponsor: string;
  } = await req.json();

  const selectedArticles = payload.articles;
  const sponsorDescription = payload.sponsor;

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

  const client = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  });

  try {
    let articlesContent = `You are writing a linkedin fintech news roundup in a fun/professional tone ${
      sponsorDescription == "" ? "" : `sponsored by: ${sponsorDescription}`
    } use slash n for newline, Linkedin has link previews so simply quote the source at the end or beginnging of each story using (Source: link). Do a daily news roundup on\n`;

    for (const article of selectedArticles) {
      articlesContent += `${article.title} ${article.author} ${article.excerpt} ${article.link} ${article.summary}\n`;
    }

    const chatCompletion = await client.chat.completions.create({
      messages: [
        {
          role: "user",
          content: articlesContent,
        },
      ],
      model: "gpt-4o-mini",
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
