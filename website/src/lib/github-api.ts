import "server-only";
import { unstable_cache } from "next/cache";

async function fetchLatestRelease() {
  const response = await fetch(
    "https://api.github.com/repos/astudentinearth/darkwrite/releases/latest",
    {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`GitHub API responded with status ${response.status}`);
  }

  const latestRelease = await response.json();



  return {
    name: latestRelease.name as string,
    latest: (latestRelease.tag_name as string).substring(1),
    release_page: latestRelease.html_url as string,
  };
}

export const getLatestRelease = unstable_cache(
  () => fetchLatestRelease(),
  ["release"],
  {
    revalidate: 3600,
  },
);
