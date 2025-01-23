// pages/api/mainpages.xml/route.ts
import { NextApiRequest, NextApiResponse } from 'next';

export const GET = async (req: any) => {
    const xmlData = generateMainPagesXML();

    return new Response(xmlData, {
      headers: { 'Content-Type': 'application/xml' },
  });
}

function generateMainPagesXML() {
    const pages = [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/popular`,
        lastModified: new Date(),
      },
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
        lastModified: new Date(),
      },
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/signup`,
        lastModified: new Date(),
      },
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/changePassword`,
        lastModified: new Date(),
      }
    ];
  
    const xmlData = `
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${pages
          .map(
            (page) => `
              <url>
                <loc>${page.url}</loc>
                <lastmod>${page.lastModified.toISOString()}</lastmod>
              </url>
            `
          )
          .join('')}
      </urlset>`;
  
    return xmlData;
  }
  