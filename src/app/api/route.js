export async function GET(req) {
    return new Response(JSON.stringify({ message: "API is working!" }), {
      headers: { "Content-Type": "application/json" },
    });
  }
  