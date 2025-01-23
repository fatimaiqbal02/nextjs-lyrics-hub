export const GET = async (req: any) => {
    try {
        const sitemapIndexXML = `
       <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
               <sitemap>
                 <loc>${process.env.NEXT_PUBLIC_BASE_URL}/sitemaps/main-pages.xml</loc>
               </sitemap>
               <sitemap>
                 <loc>${process.env.NEXT_PUBLIC_BASE_URL}/sitemaps/songnames.xml</loc>
               </sitemap>
               <sitemap>
                 <loc>${process.env.NEXT_PUBLIC_BASE_URL}/sitemaps/popular-words.xml</loc>
               </sitemap>
       </sitemapindex>`;

        return new Response(sitemapIndexXML, {
            headers: { 'Content-Type': 'application/xml' },
        });
    } catch (error) {
        console.error('Error handling request:', error);
    }
}


