import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://lifefun.vn";
  const lastModified = new Date();

  return [
    { url: baseUrl,                  lastModified, changeFrequency: "always", priority: 1.0 },
    { url: `${baseUrl}/chung-khoan`, lastModified, changeFrequency: "always", priority: 0.9 },
    { url: `${baseUrl}/crypto`,      lastModified, changeFrequency: "always", priority: 0.9 },
    { url: `${baseUrl}/tin-tuc`,     lastModified, changeFrequency: "hourly", priority: 0.8 },
  ];
}
