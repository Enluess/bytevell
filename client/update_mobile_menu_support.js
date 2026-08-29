
const fs = require("fs");
let content = fs.readFileSync("src/components/Navigation.tsx", "utf8");

content = content.replaceAll("<div className=\"text-primary/80 shrink-0\">{item.icon}</div>", "<div className=\"text-white/40 group-hover:text-white transition-colors shrink-0\">{item.icon}</div>");

content = content.replaceAll("className=\"w-full text-left text-foreground/80 hover:text-white hover:bg-white/5 active:bg-white/8 rounded-xl px-3 py-3 font-medium transition-colors flex items-center gap-2.5 text-[13px]\"", "className=\"group w-full text-left text-foreground/80 hover:text-white hover:bg-white/5 active:bg-white/8 rounded-xl px-3 py-3 font-medium transition-colors flex items-center gap-2.5 text-[13px]\"");

fs.writeFileSync("src/components/Navigation.tsx", content, "utf8");

