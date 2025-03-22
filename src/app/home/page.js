"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const scrapeWebsite = async () => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(`/api/scrape?url=${encodeURIComponent(url)}`);
      if (!response.ok) throw new Error("Failed to fetch data");

      const result = await response.json();
      if (result.error) throw new Error(result.error);

      setData(result.data);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 sm:p-6">
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 text-center">Web Scraper</h1>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <input
            type="text"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
            placeholder="Enter website URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            onClick={scrapeWebsite}
            className="bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Scraping..." : "Scrape"}
          </button>
        </div>

        {error && <p className="mt-4 text-red-600 text-center">Error: {error}</p>}

        {data && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800">Scraped Content:</h2>
    <div className="text-gray-700 flex flex-wrap p-3 border rounded bg-gray-50 overflow-y-auto text-sm sm:text-base">
  {data.logo && (
  <div>
  <Image 
      src={data.logo} 
      alt="Website Logo" 
      className="w-16 h-16 rounded-lg mb-2 bg-cover" 
      width={100} 
      height={100} 
      unoptimized // If external URL
    />
  </div>
  )}

<div>
<h3 className="text-xl font-bold">{data.title}</h3>
<p className="text-gray-600">{data.description}</p>
</div>
</div>


            <h2 className="mt-4 text-lg font-semibold text-gray-800">Links Found:</h2>
            {data.links.length > 0 ? (
              <ul className="space-y-4">
                {data.links.map((link, index) => (
                  <li key={index} className="border p-3 rounded-lg bg-gray-50">
                    {link.logo ? (
                      <>
                      {link.logo &&
                        ( <img src={link.logo} alt="Site Logo" className="w-10 h-10 rounded-md mb-2" />)}
                        <Link href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline block">{link.title}</Link>
                        <p className="text-gray-600 text-sm">{link.description}</p>
                      </>
                    ) :
                      <Link href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline block">{link.url}</Link>
                    }
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No links found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
