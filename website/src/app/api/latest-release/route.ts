import { getLatestRelease } from "@/lib/github-api";

export async function GET() {
  return Response.json(await getLatestRelease());
}
