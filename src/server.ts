import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.208.0/http/file_server.ts";
import { BUILD_PATH, build, transpileShaders } from "./transpileShaders.ts";

const PORT = 1000;
let devmodeguid: string | undefined = undefined;


await build(true);

async function handler(req: Request): Promise<Response> {
  const pathname = new URL(req.url).pathname;

  if (pathname === '/') {
    return Response.redirect(new URL("/index.html", req.url), 302);
  }

  if (pathname === '/devmode-guid') {
    if (!devmodeguid) {
      devmodeguid = crypto.randomUUID();
      return new Response(devmodeguid);
    } else {
      await new Promise(resolve => setTimeout(resolve, 10000));
      return new Response(devmodeguid);
    }
  }

  return serveDir(req, {
    fsRoot: BUILD_PATH,
    urlRoot: "",
  });
}

console.log(`Server listening on http://localhost:${PORT}/`);
await serve(handler, { port: PORT });