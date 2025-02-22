import axios from "axios";
import * as cheerio from "cheerio";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) {
        return new Response(JSON.stringify({ error: "Please provide a valid URL" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // Extract text content
        const content = $("body").text().trim();

        // Extract all links
        const links = $("a")
            .map((i, el) => $(el).attr("href"))
            .get()
            .filter(link => link && link.startsWith("http"));

        return new Response(JSON.stringify({ success: true, url, content, links }), {
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
