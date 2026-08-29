
fetch("https://nodesty.com").then(r=>r.text()).then(t=>{
    const css = t.match(/href="([^"]+\.css[^"]*)"/g);
    console.log(css);
});

