import type { NextConfig } from "next";

const basePath = "/FHLiquidation";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  sassOptions: {
    additionalData: `$base-path: "${basePath}";`,
  },
};

export default nextConfig;
