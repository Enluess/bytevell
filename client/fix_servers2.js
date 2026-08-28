
const fs = require("fs");

function enrichServerPage(path) {
  let content = fs.readFileSync(path, "utf8");

  if (!content.includes("<ReferenceBar />")) {
    content = content.replace("<Container className=\"max-w-6xl pb-20\">\n        <FaqSection", "<ReferenceBar />\n      <Features />\n\n      <Container className=\"max-w-6xl pb-20\">\n        <FaqSection");
  }

  if (!content.includes("<CtaBanner")) {
    content = content.replace("</Container>\n\n      <Footer />", "</Container>\n\n      <CtaBanner \n        title=\"Hazýr mýsýnýz?\"\n        description=\"Hemen sipariþ verin, projenizi saniyeler içinde hayata geçirin.\"\n        primaryText=\"Sipariþ Ver\"\n        primaryLink=\"/checkout\"\n      />\n\n      <Footer />");
  }

  fs.writeFileSync(path, content, "utf8");
}

enrichServerPage("src/app/[locale]/servers/vds/page.tsx");
enrichServerPage("src/app/[locale]/servers/dedicated/page.tsx");

