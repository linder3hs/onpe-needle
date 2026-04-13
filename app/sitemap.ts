import { MetadataRoute } from "next";

const BASE_URL = "https://onpe-needle.linderhassinger.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1,
    },
  ];
}
