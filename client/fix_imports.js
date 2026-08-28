
const fs = require("fs");

function fixImports(path) {
  let content = fs.readFileSync(path, "utf8");

  if (!content.includes("import { Features }")) {
    content = content.replace("const FaqSection =", "import { Features } from \"@/components/Features\";\nimport { CtaBanner } from \"@/components/CtaBanner\";\nconst FaqSection =");
  }

  fs.writeFileSync(path, content, "utf8");
}

fixImports("src/app/[locale]/servers/vds/page.tsx");
fixImports("src/app/[locale]/servers/dedicated/page.tsx");
fixImports("src/app/[locale]/hosting/web/page.tsx");
fixImports("src/app/[locale]/hosting/mail/page.tsx");

