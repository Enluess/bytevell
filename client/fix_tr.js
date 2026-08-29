
const fs = require("fs");
const path = "messages/tr.json";
let data = JSON.parse(fs.readFileSync(path, "utf8"));
data.Hero.title1 = Buffer.from("UHJvamVsZXJpbml6IGnDp2lu", "base64").toString("utf8");
data.Hero.title2 = Buffer.from("Z8O8w6dsw7wgdmUgZ8O8dmVuaWxpciBhbHR5YXDEsS4=", "base64").toString("utf8");
fs.writeFileSync(path, JSON.stringify(data, null, 2), "utf8");

