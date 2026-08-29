
const fs = require("fs");
let css = fs.readFileSync("src/app/globals.css", "utf8");

// Remove all current font imports
css = css.replace(/@import url[^;]+;\n?/g, "");

// Add Product Sans import
css = "@import url('https://fonts.cdnfonts.com/css/product-sans');\n" + css;

// Make sure font is applied
if (!css.includes("@theme")) {
  css += "\n@theme {\n  --font-sans: 'Product Sans', ui-sans-serif, system-ui, sans-serif;\n  --font-heading: 'Product Sans', ui-sans-serif, system-ui, sans-serif;\n}\n";
} else {
  // If @theme exists but font-sans doesnt
  if (!css.includes("--font-sans")) {
    css = css.replace("@theme {", "@theme {\n  --font-sans: 'Product Sans', ui-sans-serif, system-ui, sans-serif;\n  --font-heading: 'Product Sans', ui-sans-serif, system-ui, sans-serif;");
  } else {
    css = css.replace(/--font-sans: [^;]+;/, "--font-sans: 'Product Sans', ui-sans-serif, system-ui, sans-serif;");
    css = css.replace(/--font-heading: [^;]+;/, "--font-heading: 'Product Sans', ui-sans-serif, system-ui, sans-serif;");
  }
}

fs.writeFileSync("src/app/globals.css", css, "utf8");

