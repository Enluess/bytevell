
const fs = require("fs");

function fixPage(path) {
  let content = fs.readFileSync(path, "utf8");

  content = content.replace("<section className=\"relative px-6 pb-20 pt-32 text-center flex flex-col items-center justify-center overflow-hidden\">", "<section className=\"relative flex flex-col items-center justify-center pt-32 sm:pt-40 md:pt-48 pb-20 sm:pb-24 md:pb-32 overflow-hidden min-h-[60vh]\">");

  if (!content.includes("<ReferenceBar />")) {
    const from = "<div className=\"container mx-auto px-6 max-w-6xl pb-20\">\n        <FaqSection";
    const to = "<ReferenceBar />\n      <Features />\n\n      <div className=\"container mx-auto px-6 max-w-6xl pb-20\">\n        <FaqSection";
    content = content.replace(from, to);
  }

  if (!content.includes("<CtaBanner")) {
    const from = "</div>\n\n      <Footer />";
    const to = "</div>\n\n      <CtaBanner \n        title=\"Hazýr mýsýnýz?\"\n        description=\"Hemen sipariþ verin, projenizi saniyeler içinde hayata geçirin.\"\n        primaryText=\"Sipariþ Ver\"\n        primaryLink=\"/checkout\"\n      />\n\n      <Footer />";
    content = content.replace(from, to);
  }

  fs.writeFileSync(path, content, "utf8");
}

fixPage("src/app/[locale]/hosting/web/page.tsx");
fixPage("src/app/[locale]/hosting/mail/page.tsx");

