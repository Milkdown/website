import { docConfig } from "@/routes";
import { NextApiResponse } from "next";

const EXTERNAL_DATA_URL = "https://milkdown.dev/docs";
function generateSiteMap() {
  const docList = docConfig.flatMap(({ items, scope }) =>
    items.map((item) => ({ id: item, scope: scope }))
  );
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${docList
       .map(({ id, scope }) => {
         return `
       <url>
           <loc>${EXTERNAL_DATA_URL}/${scope}/${id}</loc>
       </url>
     `;
       })
       .join("")}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }: { res: NextApiResponse }) {
  const sitemap = generateSiteMap();

  res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
