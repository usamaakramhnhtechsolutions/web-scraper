"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ScraperComponent from "./data-scraping/page";
import LogoMaker from "./logo-macker/page";

export default function Page() {
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
    <div className="">
 {/* <ScraperComponent /> */}
 <LogoMaker />
    </div>
  );
}
