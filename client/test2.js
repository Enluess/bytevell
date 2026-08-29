
fetch("https://nodesty.com/_nuxt/entry.ajGEbKS5.css").then(r=>r.text()).then(t=>{
    const fonts = t.match(/font-family:([^;}]+)/g);
    console.log(fonts ? [...new Set(fonts)] : "No fonts");
});
fetch("https://nodesty.com/_nuxt/default.cyrDOTBT.css").then(r=>r.text()).then(t=>{
    const fonts = t.match(/font-family:([^;}]+)/g);
    console.log(fonts ? [...new Set(fonts)] : "No fonts");
});

