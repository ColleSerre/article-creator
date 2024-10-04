"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export interface Article {
  title: string;
  excerpt: string;
  link: string;
  author: string;
  summary: string;
}

interface CardProps {
  article: Article;
  onArticleClick: (article: Article) => void;
  selected?: boolean;
}

const Card: React.FC<CardProps> = ({ article, onArticleClick, selected }) => (
  <div className="flex flex-row bg-gray-800 mb-4">
    <div className="flex flex-col justify-between h-full p-4 overflow-hidden">
      <h5 className="text-xl font-bold mt-4">{article.title}</h5>
      <p className="text-gray-300">{article.excerpt}</p>
      <p className="text-gray-300">Source: {article.author}</p>
      <div className="flex justify-between">
        <button
          className="button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={(e) => {
            e.stopPropagation();
            window.open(article.link, "_blank");
          }}
        >
          Read More
        </button>
        <button
          className={`button ${
            selected
              ? " bg-red-500 hover:bg-red-700"
              : "bg-green-500 hover:bg-green-700"
          } text-white font-bold py-2 px-4 rounded mt-4`}
          onClick={() => onArticleClick(article)}
        >
          {selected ? "Remove" : "Select"}
        </button>
      </div>
    </div>
  </div>
);

export default function ClientComponent({ articles }: { articles: Article[] }) {
  const [selectedArticles, setSelectedArticles] = useState<Article[]>([]);
  const [generatedArticle, setGeneratedArticle] = useState<string | null>(null);
  const [sponsorDescription, setSponsorDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleArticleClick = (article: Article) => {
    setSelectedArticles((prev) => [...prev, article]);
  };

  const generateArticle = async () => {
    setLoading(true);

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        articles: selectedArticles.map((article) => ({
          title: article.title,
          description: article.excerpt,
          url: article.link,
          source: article.author,
        })),

        sponsor: sponsorDescription,
      }),
    });

    const data = await res.json();
    console.log(data);
    setGeneratedArticle(data.content || "Failed to generate article");
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-2 gap-8">
      {/* Left column */}
      <div>
        <h1 className="text-4xl font-bold mb-10">Results</h1>

        {articles ? (
          articles.map((article, index: number) => (
            <Card
              key={index}
              article={article}
              onArticleClick={handleArticleClick}
            />
          ))
        ) : (
          <p>No articles found</p>
        )}
      </div>

      {/* Right column */}
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold mb-10">Selected Articles</h1>
        <Input
          type="text"
          placeholder="Describe the sponsor of the article here. This section is optional."
          value={sponsorDescription}
          onChange={(e) => setSponsorDescription(e.target.value)}
        />
        <div className="flex justify-between mb-4">
          <button
            className="button bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-4"
            onClick={() => setSelectedArticles([])}
          >
            Clear All
          </button>

          <Dialog>
            <DialogTrigger asChild>
              <button
                onClick={generateArticle}
                className="button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
                disabled={selectedArticles.length === 0 || loading}
              >
                {loading ? "Generating..." : "Generate Article"}
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generated Article</DialogTitle>
              </DialogHeader>
              <DialogDescription
                className="text-gray-300"
                style={{
                  whiteSpace: "pre-wrap",
                  overflow: "auto",
                  maxHeight: "400px",
                }}
              >
                {loading ? (
                  <p>Loading...</p>
                ) : generatedArticle ? (
                  <div>
                    <p
                      style={{
                        whiteSpace: "pre-wrap",
                        overflow: "auto",
                      }}
                    >
                      {generatedArticle}
                    </p>
                    <button
                      className="button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedArticle).then(
                          () => {
                            toast({
                              title: "Copied !",
                              description:
                                "The article has been copied to your clipboard",
                            });
                          },
                          () => {
                            alert("Failed to copy to clipboard");
                          }
                        );
                      }}
                    >
                      Copy to clipboard
                    </button>
                  </div>
                ) : (
                  "No article generated"
                )}
              </DialogDescription>
            </DialogContent>
          </Dialog>
        </div>

        <div>
          {selectedArticles.length > 0 ? (
            selectedArticles.map((article, index) => (
              <Card
                key={index}
                article={article}
                selected
                onArticleClick={() =>
                  setSelectedArticles((prev) =>
                    prev.filter((a) => a.title !== article.title)
                  )
                }
              />
            ))
          ) : (
            <p>No articles selected yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
