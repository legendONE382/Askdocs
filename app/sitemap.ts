import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://askdocs-nine.vercel.app",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: "https://askdocs-nine.vercel.app/login",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6
    },
    {
      url: "https://askdocs-nine.vercel.app/signup",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6
    },
    {
      url: "https://askdocs-nine.vercel.app/workspace",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8
    }
  ];
}
