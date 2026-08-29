
fetch("https://nodesty.com/_nuxt/default.cyrDOTBT.css").then(r=>r.text()).then(t=>{
    const fontFaces = t.match(/@font-face{[^}]+}/g);
    console.log(fontFaces ? fontFaces.join("\n") : "No @font-face");
});

