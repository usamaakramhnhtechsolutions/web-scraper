import axios from "axios";
import * as cheerio from "cheerio";
import mongoose from "mongoose";
import ScrapedData from "../../../models/scraperModel"; // MongoDB model

const MONGODB_URI = "mongodb://localhost:27017/scraperDB"; // Replace with actual URI

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected")).catch(err => console.log(err));

// Function to introduce delay (to prevent rate-limiting)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function getPageDetails(link) {
    try {
        await delay(1000); // 1-second delay to avoid rate-limiting
        
        const { data } = await axios.get(link, {
            timeout: 8000, // Prevent 504 errors
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
                "Accept-Language": "en-US,en;q=0.9",
                "Referer": "https://www.google.com/",
                "Accept-Encoding": "gzip, deflate, br"
            }
        });

        const $ = cheerio.load(data);

        return {
            title: $("head title").text().trim() || "No title found",
            description: $('meta[name="description"]').attr("content") || "No description available",
            logo: $('link[rel="icon"]').attr("href") || $('link[rel="shortcut icon"]').attr("href") || null,
        };
    } catch (error) {
        console.log(`Error scraping ${link}:`, error.message);
        return {
            title: "No title found",
            description: "No description available",
            logo: null,
        };
    }
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const url = searchParams.get("url");

        if (!url) {
            return new Response(JSON.stringify({ error: "Please provide a valid URL" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const { data } = await axios.get(url, {
            timeout: 8000, // Prevent 504 errors
            headers: { "User-Agent": "Mozilla/5.0" },
        });

        const $ = cheerio.load(data);

        const mainTitle = $("head title").text().trim() || "No title found";
        const mainDescription = $('meta[name="description"]').attr("content") || "No description available";
        let favicon = $('link[rel="icon"]').attr("href") || $('link[rel="shortcut icon"]').attr("href");
        const mainLogo = favicon ? new URL(favicon, url).href : null; // Ensure absolute URL

        const links = $("a").map((i, el) => {
            const link = $(el).attr("href");
            return link && link.startsWith("http") ? { url: link } : null;
        }).get();

        const enrichedLinks = await Promise.all(links.map(async (link) => ({
            ...link,
            ...(await getPageDetails(link.url))
        })));

        const scrapedData = new ScrapedData({
            url,
            title: mainTitle,
            description: mainDescription,
            logo: mainLogo,
            links: enrichedLinks,
        });

        await scrapedData.save();

        return new Response(JSON.stringify({ success: true, data: scrapedData }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: "Scraping failed", details: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
