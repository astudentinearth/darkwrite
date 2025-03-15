import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  pageExtensions: ["md", "mdx", "ts", "tsx"],
  transpilePackages: ["next-mdx-remote"],
};

const withMDX = createMDX({
  options: {
    //@ts-expect-error documentation says so
    rehypePlugins: [["rehype-slug", {}]],
  },
});

export default withMDX(nextConfig);
