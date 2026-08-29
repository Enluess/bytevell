
const fs = require("fs");
let content = fs.readFileSync("src/components/Navigation.tsx", "utf8");

content = content.replace("bg-[#030303]/98 backdrop-blur-2xl", "bg-[#060709]/95 backdrop-blur-3xl");
content = content.replace("bg-[#030303]/90 backdrop-blur-xl border-b border-white/5", "bg-[#060709]/90 backdrop-blur-2xl border-b border-white/5");

content = content.replaceAll("text-[11px] font-semibold text-primary uppercase tracking-widest mb-2 px-4", "text-[11px] font-semibold text-foreground-secondary uppercase tracking-widest mb-3 px-4");

content = content.replaceAll("<div className=\"text-primary bg-primary/10 p-2 rounded-lg shrink-0\">{item.icon}</div>", "<div className=\"flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 text-white/50 shrink-0 group-hover:bg-white/10 group-hover:text-white transition-all\">{item.icon}</div>");

// Wait, the link tags themselves need the "group" class for group-hover to work
content = content.replaceAll("className=\"w-full text-left text-foreground/80 hover:text-white hover:bg-white/5 active:bg-white/8 rounded-xl px-4 py-3 font-medium transition-colors flex items-center gap-3.5 text-[15px]\"", "className=\"group w-full text-left text-foreground/80 hover:text-white hover:bg-white/5 active:bg-white/8 rounded-xl px-4 py-3 font-medium transition-colors flex items-center gap-3.5 text-[15px]\"");

fs.writeFileSync("src/components/Navigation.tsx", content, "utf8");

