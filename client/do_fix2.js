
const fs = require("fs");

function fixPage(path) {
  let content = fs.readFileSync(path, "utf8");

  content = content.replace("</section>\n\n      <div className=\"container mx-auto px-6 max-w-6xl pb-20\">\n        <FaqSection", "</section>\n\n      <ReferenceBar />\n      <Features />\n\n      <div className=\"container mx-auto px-6 max-w-6xl pb-20\">\n        <FaqSection");

  content = content.replace("</div>\n\n      <Footer />", "</div>\n\n      <CtaBanner \n        title=\"Hazýr mýsýnýz?\"\n        description=\"Hemen sipariþ verin, projenizi saniyeler içinde hayata geçirin.\"\n        primaryText=\"Sipariþ Ver\"\n        primaryLink=\"/checkout\"\n      />\n\n      <Footer />");

  fs.writeFileSync(path, content, "utf8");
}

fixPage("src/app/[locale]/hosting/web/page.tsx");
fixPage("src/app/[locale]/hosting/mail/page.tsx");

