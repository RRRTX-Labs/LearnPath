import { toNextJsHandler } from "better-auth/next-js";
import { ensureSchema } from "@/db/ensure";
import { auth } from "@/lib/auth";

const handlers = toNextJsHandler(auth);

async function withSchema(req: Request, fn: (req: Request) => Promise<Response>) {
  await ensureSchema();
  return fn(req);
}

export const GET = (req: Request) => withSchema(req, handlers.GET);
export const POST = (req: Request) => withSchema(req, handlers.POST);
