
const fs = require("fs");
["tr", "en", "de"].forEach(lang => {
  const path = "messages/" + lang + ".json";
  if (!fs.existsSync(path)) return;
  const data = JSON.parse(fs.readFileSync(path, "utf8"));
  if (lang === "tr") {
    data.Hero.title1 = "Projeleriniz için";
    data.Hero.title2 = "güçlü ve güvenilir altyapý.";
  } else if (lang === "en") {
    data.Hero.title1 = "Powerful and reliable";
    data.Hero.title2 = "infrastructure for your projects.";
  } else if (lang === "de") {
    data.Hero.title1 = "Leistungsstarke und zuverlässige";
    data.Hero.title2 = "Infrastruktur für Ihre Projekte.";
  }
  fs.writeFileSync(path, JSON.stringify(data, null, 2), "utf8");
});

