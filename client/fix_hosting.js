
const fs = require("fs");

function enrichHostingPage(path) {
  let content = fs.readFileSync(path, "utf8");

  if (!content.includes("ReferenceBar")) {
    content = content.replace("import dynamic from 'next/dynamic';", "import dynamic from 'next/dynamic';\nimport { ReferenceBar } from \"@/components/ReferenceBar\";");
  }
  
  if (!content.includes("Features")) {
    content = content.replace("const FaqSection = dynamic", "const Features = dynamic(() => import('@/components/Features').then(mod => mod.Features));\nconst CtaBanner = dynamic(() => import('@/components/CtaBanner').then(mod => mod.CtaBanner));\nconst FaqSection = dynamic");
  }

  if (!content.includes("<ReferenceBar />")) {
    content = content.replace("<div className=\"container mx-auto px-6 max-w-6xl pb-20\">\n        <FaqSection", "<ReferenceBar />\n      <Features />\n\n      <div className=\"container mx-auto px-6 max-w-6xl pb-20\">\n        <FaqSection");
  }

  if (!content.includes("<CtaBanner")) {
    content = content.replace("</div>\n\n      <Footer />", "</div>\n\n      <CtaBanner \n        title=\"Hazýr mýsýnýz?\"\n        description=\"Hemen sipariþ verin, projenizi saniyeler içinde hayata geçirin.\"\n        primaryText=\"Sipariþ Ver\"\n        primaryLink=\"/checkout\"\n      />\n\n      <Footer />");
  }

  fs.writeFileSync(path, content, "utf8");
}

enrichHostingPage("src/app/[locale]/hosting/web/page.tsx");
enrichHostingPage("src/app/[locale]/hosting/mail/page.tsx");

