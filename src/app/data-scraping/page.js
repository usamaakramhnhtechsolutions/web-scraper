"use client";
import { useState, useEffect } from "react";

export default function ScraperComponent() {
  const [data, setData] = useState(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const scrapeData = async () => {
    if (!url) return;
    setLoading(true);

    try {
      const response = await fetch(`/api/scrape?url=${encodeURIComponent(url)}`);
      const result = await response.json();
      setData(result.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-xl font-bold mb-4">Web Scraper</h1>
      <input
        type="text"
        placeholder="Enter URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <button
        onClick={scrapeData}
        className="mt-3 bg-blue-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Scraping..." : "Scrape"}
      </button>

      {data && (
        <div className="mt-4 p-4 bg-white rounded shadow">
          <h2 className="text-lg font-semibold">{data.title}</h2>
          <p className="text-sm text-gray-600">{data.description}</p>
          <div className="mt-2">
            {data.images?.map((img, index) => (
              <img key={index} src={img} alt="Scraped" className="w-32 h-32 object-cover mr-2" />
            ))}
          </div>
          <ul>
  {scrapedData.map((item) => (
    <li key={item._id}>
      <a href={item.url} target="_blank" rel="noopener noreferrer">
        {item.title}
      </a>
      <p>{item.description}</p>
      {item.logo && <img src={item.logo} alt="Logo" width="50" />}
    </li>
  ))}
</ul>
          {/* <ul className="mt-2">
            {data.links?.map((link, index) => (
              <li key={index}>
                <a href={link} target="_blank" className="text-blue-600">{link}</a>
              </li>
            ))}
          </ul> */}
        </div>
      )}
    </div>
  );
}
