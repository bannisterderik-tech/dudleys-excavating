// Dudley's Excavating — static site generator. node gen/build.mjs → writes docs/*.html
// Brand system extracted from the approved Claude Design doc: #0e0e0e ground, #f5f5f5 ink,
// Dudley sign-red #c1272d, Barlow Condensed display / Barlow body.
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { biz, paradise, photos } from "./data.mjs";

const OUT = fileURLToPath(new URL("../docs/", import.meta.url));
const BASE = process.env.BASE ?? "";           // e.g. "/dudleys-excavating" for project Pages
const basify = h => BASE ? h
  .replaceAll('href="/', `href="${BASE}/`)
  .replaceAll('src="/', `src="${BASE}/`)
  .replaceAll("'/assets/", `'${BASE}/assets/`)
  .replaceAll("'/world/", `'${BASE}/world/`)
  .replaceAll('"/world/assets/', `"${BASE}/world/assets/`)
  .replaceAll(`href="${BASE}//`, 'href="//') : h;

/* ---------------------------------- CSS ---------------------------------- */
const css = `
:root{--bg:#0e0e0e;--panel:#161616;--panel2:#1d1c1a;--ink:#f5f5f5;--ink-soft:rgba(245,245,245,.68);
--ink-faint:rgba(245,245,245,.45);--red:#c1272d;--red-hot:#e03a40;--line:rgba(245,245,245,.1);
--yellow:#d7a21a;--disp:'Barlow Condensed',Impact,sans-serif;--body:'Barlow',system-ui,sans-serif;
--mono:ui-monospace,'SF Mono',Menlo,monospace}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--ink);font-family:var(--body);-webkit-font-smoothing:antialiased;overflow-x:hidden}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
::selection{background:var(--red);color:#fff}

/* grain */
.grain{position:fixed;inset:-100px;pointer-events:none;z-index:90;opacity:.05;
background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");
animation:grain 8s steps(10) infinite}
@keyframes grain{0%,100%{transform:translate(0,0)}10%{transform:translate(-30px,20px)}30%{transform:translate(30px,-40px)}50%{transform:translate(-40px,-20px)}70%{transform:translate(20px,40px)}90%{transform:translate(-20px,10px)}}

/* header */
.hdr{position:fixed;top:0;left:0;right:0;z-index:80;display:flex;align-items:center;justify-content:space-between;
gap:16px;padding:14px clamp(18px,4vw,56px);transition:background .3s,border-color .3s;border-bottom:1px solid transparent}
.hdr.solid{background:rgba(14,14,14,.92);backdrop-filter:blur(10px);border-color:var(--line)}
.brand{display:flex;flex-direction:column;line-height:1}
.brand b{font-family:var(--disp);font-weight:700;font-size:22px;letter-spacing:.04em;text-transform:uppercase}
.brand span{font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:var(--red-hot);margin-top:4px}
.nav{display:flex;gap:clamp(10px,1.6vw,26px);align-items:center;font-size:12.5px;letter-spacing:.09em;text-transform:uppercase}
.nav a{color:var(--ink-soft);padding:6px 2px;border-bottom:2px solid transparent;transition:.2s}
.nav a:hover,.nav a.on{color:var(--ink);border-color:var(--red)}
.hdr .call{font-family:var(--disp);font-weight:700;font-size:19px;letter-spacing:.03em;color:#fff;background:var(--red);
padding:9px 16px;border-radius:2px;white-space:nowrap;transition:.2s}
.hdr .call:hover{background:var(--red-hot)}
.burger{display:none;background:none;border:0;color:var(--ink);font-size:26px;cursor:pointer}
.nav .m-cta{display:none}
@media(max-width:940px){
.brand b{font-size:17px}.brand span{font-size:8.5px;letter-spacing:.18em}.hdr .call{font-size:16px;padding:8px 12px}
.nav{display:none;position:fixed;inset:0;background:#0e0e0e;flex-direction:column;align-items:flex-start;
justify-content:center;gap:0;z-index:84;padding:96px clamp(24px,8vw,48px) 40px;overflow-y:auto}
.nav.open{display:flex}
.nav a{font-family:var(--disp);font-weight:700;font-size:clamp(34px,9vw,44px);letter-spacing:.02em;
color:var(--ink);border:0;border-bottom:1px solid var(--line);width:100%;padding:14px 0;display:flex;
align-items:baseline;gap:14px;counter-increment:mnav}
.nav a::before{content:counter(mnav,decimal-leading-zero);font-family:var(--mono);font-size:11px;
letter-spacing:.15em;color:var(--red-hot)}
.nav a.on{color:var(--red-hot)}
.nav{counter-reset:mnav}
.nav .m-cta{margin-top:28px;border:0;width:100%;display:flex;flex-direction:column;gap:12px}
.nav .m-cta a{border:0;padding:0;width:auto;counter-increment:none}
.nav .m-cta a::before{content:none}
.nav .m-cta .btn{width:100%;justify-content:center;font-size:20px}
.burger{display:block;z-index:86;position:relative;width:40px;height:40px}
.burger .bi,.burger .bi::before,.burger .bi::after{content:"";position:absolute;left:8px;right:8px;height:2px;
background:var(--ink);transition:transform .25s,opacity .2s,top .25s}
.burger .bi{top:19px}.burger .bi::before,.burger .bi::after{left:0;right:0}.burger .bi::before{top:-7px}.burger .bi::after{top:7px}
body.menu-open{overflow:hidden}
body.menu-open .burger .bi{transform:rotate(45deg)}
body.menu-open .burger .bi::before{top:0;transform:rotate(90deg)}
body.menu-open .burger .bi::after{top:0;opacity:0}
body.menu-open .hdr{background:#0e0e0e;backdrop-filter:none;-webkit-backdrop-filter:none}
body.menu-open .brand{position:relative;z-index:86}
body.menu-open .hdr .call{visibility:hidden}
}

/* type + layout */
.wrap{max-width:1240px;margin:0 auto;padding:0 clamp(18px,4vw,56px)}
.sec{padding:clamp(64px,9vw,120px) 0}
.kick{display:inline-flex;align-items:center;gap:10px;font-family:var(--mono);font-size:11.5px;letter-spacing:.22em;
text-transform:uppercase;color:var(--red-hot);margin-bottom:18px}
.kick::before{content:"";width:30px;height:2px;background:var(--red)}
h1,h2{font-family:var(--disp);font-weight:700;text-transform:uppercase;line-height:.96;letter-spacing:.005em}
h1{font-size:clamp(52px,9vw,124px)}
h2{font-size:clamp(36px,4.6vw,62px);margin-bottom:22px}
h3{font-family:var(--disp);font-weight:600;text-transform:uppercase;font-size:clamp(21px,2vw,26px);letter-spacing:.02em}
.lede{font-size:clamp(16px,1.35vw,18.5px);line-height:1.65;color:var(--ink-soft);max-width:640px;text-wrap:pretty}
.lede b{color:var(--ink)}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:26px}
.chips li{list-style:none;font-family:var(--mono);font-size:11px;letter-spacing:.12em;text-transform:uppercase;
color:var(--ink-soft);border:1px solid var(--line);padding:7px 12px;border-radius:2px;background:rgba(245,245,245,.03)}
.chips li b{color:var(--red-hot);font-weight:600}

/* hero scrub */
.scrub{position:relative;height:380vh}
.scrub-stick{position:sticky;top:0;height:100vh;overflow:hidden}
.scrub-stick video,.scrub-stick .poster{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 45%}
.scrub-shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(14,14,14,.55) 0%,rgba(14,14,14,.12) 38%,rgba(14,14,14,.62) 100%)}
.beat{position:absolute;left:clamp(18px,5vw,72px);bottom:clamp(72px,13vh,140px);max-width:min(880px,92vw);opacity:0;transform:translateY(26px);transition:opacity .18s ease,transform .3s;will-change:opacity;pointer-events:none}
.beat.on{opacity:1;transform:none;transition:opacity .5s ease .12s,transform .5s ease .12s;pointer-events:auto}
.beat .kick{margin-bottom:10px}
.beat h1,.beat .bigline{text-shadow:0 4px 40px rgba(0,0,0,.85)}
.bigline{font-family:var(--disp);font-weight:700;text-transform:uppercase;line-height:.94;font-size:clamp(44px,7.6vw,104px)}
.bigline em{font-style:normal;color:var(--red-hot)}
.beat p{margin-top:16px;font-size:clamp(15px,1.3vw,18px);line-height:1.55;color:rgba(245,245,245,.88);max-width:560px;text-shadow:0 1px 14px rgba(0,0,0,.9)}
.scrub-hint{position:absolute;left:50%;bottom:22px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:8px;
font-family:var(--mono);font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-faint);transition:opacity .4s}
.scrub-hint i{width:20px;height:32px;border-radius:11px;border:2px solid rgba(245,245,245,.28);position:relative}
.scrub-hint i::after{content:"";position:absolute;left:50%;top:6px;width:4px;height:7px;border-radius:2px;background:var(--red);transform:translateX(-50%);animation:wheel 1.7s ease-in-out infinite}
@keyframes wheel{0%,100%{transform:translate(-50%,0);opacity:1}70%{transform:translate(-50%,11px);opacity:0}}
.hero-ctas{display:flex;gap:14px;margin-top:26px;flex-wrap:wrap}
.btn{display:inline-flex;align-items:center;gap:10px;font-family:var(--disp);font-weight:700;font-size:19px;letter-spacing:.04em;
text-transform:uppercase;padding:14px 26px;border-radius:2px;transition:.2s;border:1px solid transparent}
.btn.red{background:var(--red);color:#fff}.btn.red:hover{background:var(--red-hot)}
.btn.ghost{border-color:rgba(245,245,245,.35);color:var(--ink)}.btn.ghost:hover{border-color:var(--ink)}
.btn.big{font-size:clamp(22px,2.4vw,30px);padding:18px 34px}

/* service cards */
.svc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:22px;margin-top:44px}
.svc{position:relative;background:var(--panel);border:1px solid var(--line);border-radius:3px;overflow:hidden;transition:transform .25s,border-color .25s}
.svc:hover{transform:translateY(-4px);border-color:rgba(193,39,45,.55)}
.svc img{aspect-ratio:4/3;object-fit:cover;width:100%;filter:saturate(.94)}
.svc .tab{position:absolute;top:0;left:0;background:var(--red);color:#fff;font-family:var(--mono);font-size:10px;letter-spacing:.18em;text-transform:uppercase;padding:6px 10px}
.svc .in{padding:20px 22px 24px}
.svc h3{margin-bottom:8px}
.svc p{font-size:14.5px;line-height:1.6;color:var(--ink-soft)}
.svc .go{display:inline-flex;align-items:center;gap:8px;margin-top:14px;font-family:var(--mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--red-hot)}
.svc.lead{grid-column:1/-1;display:grid;grid-template-columns:1.15fr 1fr;background:linear-gradient(120deg,#191412,var(--panel))}
.svc.lead img{height:100%;aspect-ratio:auto;min-height:320px}
.svc.lead .in{padding:clamp(26px,3.4vw,52px);display:flex;flex-direction:column;justify-content:center}
.svc.lead h3{font-size:clamp(30px,3.4vw,46px)}
@media(max-width:860px){.svc.lead{grid-template-columns:1fr}}

/* stat band */
.stats{border-top:1px solid var(--line);border-bottom:1px solid var(--line);background:var(--panel)}
.stats .row{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:0}
.stat{padding:clamp(28px,3.5vw,48px) 20px;text-align:center;border-left:1px solid var(--line)}
.stat:first-child{border-left:0}
.stat b{display:block;font-family:var(--disp);font-weight:700;font-size:clamp(40px,4.4vw,64px);line-height:1;color:var(--ink)}
.stat b i{font-style:normal;color:var(--red-hot)}
.stat span{display:block;margin-top:8px;font-family:var(--mono);font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-faint)}
@media(max-width:700px){
.stats .row{grid-template-columns:1fr 1fr;gap:1px;background:var(--line)}
.stat{border:0;background:var(--panel);padding:26px 12px}
.stat:last-child:nth-child(odd){grid-column:1/-1}
.stat b{font-size:38px}
.stat span{font-size:9.5px;letter-spacing:.14em}}

/* feature bands */
.band{display:grid;grid-template-columns:1fr 1fr;gap:clamp(28px,4vw,72px);align-items:center}
.band.rev{direction:rtl}.band.rev>*{direction:ltr}
.band figure{position:relative}
.band figure img{border-radius:3px;border:1px solid var(--line)}
.band figcaption{position:absolute;left:0;bottom:0;background:var(--red);color:#fff;font-family:var(--disp);font-weight:600;
font-size:15px;letter-spacing:.05em;text-transform:uppercase;padding:9px 16px}
@media(max-width:860px){.band{grid-template-columns:1fr}}
.checks{margin-top:22px;display:grid;gap:11px}
.checks li{list-style:none;position:relative;padding-left:28px;font-size:15.5px;line-height:1.55;color:var(--ink-soft)}
.checks li::before{content:"//";position:absolute;left:0;top:.2em;font-family:var(--mono);color:var(--red-hot);font-size:12px}
.checks li b{color:var(--ink)}

/* paradise */
.paradise{position:relative;overflow:hidden;background:#120d0b}
.paradise .bgimg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.28;filter:saturate(.8)}
.paradise .in{position:relative;padding-top:clamp(72px,10vw,140px);padding-bottom:clamp(72px,10vw,140px)}
.paradise .mono-row{display:flex;flex-wrap:wrap;gap:26px;margin-top:34px}
.paradise .mono-row div b{display:block;font-family:var(--disp);font-weight:700;font-size:clamp(34px,3.6vw,52px);color:var(--red-hot);line-height:1}
.paradise .mono-row div span{font-family:var(--mono);font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-faint)}

/* gallery */
.filter{display:flex;flex-wrap:wrap;gap:8px;margin:26px 0 30px}
.filter button{font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-soft);
background:none;border:1px solid var(--line);padding:8px 16px;border-radius:2px;cursor:pointer;transition:.2s}
.filter button.on,.filter button:hover{border-color:var(--red);color:var(--ink);background:rgba(193,39,45,.12)}
.masonry{columns:3 300px;column-gap:14px}
.masonry figure{break-inside:avoid;margin-bottom:14px;position:relative;border-radius:3px;overflow:hidden;border:1px solid var(--line)}
.masonry img{width:100%;transition:transform .35s;filter:saturate(.95)}
.masonry figure:hover img{transform:scale(1.03)}
.masonry figcaption{position:absolute;inset:auto 0 0 0;padding:26px 14px 12px;font-size:12.5px;color:#fff;
background:linear-gradient(0deg,rgba(0,0,0,.82),transparent);opacity:0;transition:.3s}
.masonry figure:hover figcaption{opacity:1}

/* interior scrub hero */
.pscrub{height:260vh}
.pbeat{position:absolute;left:clamp(18px,5vw,72px);bottom:clamp(64px,12vh,130px);max-width:min(820px,92vw)}
.pbeat h1{font-size:clamp(44px,7.4vw,104px);text-shadow:0 4px 40px rgba(0,0,0,.85)}
.pbeat .lede{color:rgba(245,245,245,.9);text-shadow:0 1px 14px rgba(0,0,0,.9)}

/* page hero */
.phero{position:relative;min-height:64vh;display:flex;align-items:flex-end;overflow:hidden}
.phero img.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.92)}
.phero .shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(14,14,14,.6),rgba(14,14,14,.18) 45%,rgba(14,14,14,.94))}
.phero .in{position:relative;padding:140px 0 clamp(40px,6vw,72px);width:100%}
.phero h1{font-size:clamp(44px,7.4vw,104px)}

/* CTA slab + footer */
.slab{background:linear-gradient(120deg,#1a0e0f,#0e0e0e 60%);border-top:1px solid rgba(193,39,45,.35)}
.slab .in{padding:clamp(64px,9vw,120px) 0;text-align:center}
.slab h2{font-size:clamp(42px,6vw,84px)}
.slab .phone{display:inline-block;font-family:var(--disp);font-weight:700;font-size:clamp(46px,7vw,96px);color:var(--red-hot);line-height:1;margin:18px 0 10px;letter-spacing:.01em}
.slab p{color:var(--ink-soft)}
footer{border-top:1px solid var(--line);padding:44px 0 60px;font-size:13.5px;color:var(--ink-faint)}
footer .cols{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:32px;margin-bottom:36px}
footer h4{font-family:var(--mono);font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-soft);margin-bottom:14px}
footer a{display:block;padding:3px 0;color:var(--ink-faint)}footer a:hover{color:var(--ink)}
footer .lic{border-top:1px solid var(--line);padding-top:22px;font-family:var(--mono);font-size:11px;letter-spacing:.06em;line-height:1.9}
@media(max-width:820px){footer .cols{grid-template-columns:1fr 1fr}}

/* mobile layout */
@media(max-width:700px){
:root{--gut:22px}
.wrap{padding-left:var(--gut);padding-right:var(--gut)}
.hdr{padding-left:var(--gut);padding-right:var(--gut)}
.sec{padding:72px 0}
.scrub ~ section.sec:nth-of-type(2){padding-top:108px}
h2{margin-bottom:18px}
.lede{font-size:16.5px}
.beat,.pbeat{left:var(--gut);right:var(--gut);max-width:none;bottom:clamp(56px,10vh,110px)}
.hero-ctas{gap:10px}
.hero-ctas .btn{width:100%;justify-content:center}
.btn{font-size:17px;padding:13px 20px}
.stats{border-left:0;border-right:0}
.stats .wrap{padding:0}
.stats .row{gap:1px}
.stat{padding:24px 10px}
.band{gap:26px}
.band figure img{width:100%}
.band figcaption{font-size:13px;padding:8px 12px;max-width:85%}
.svc-grid{gap:14px;margin-top:30px}
.svc .in{padding:18px var(--gut) 22px}
.svc.lead img{aspect-ratio:4/3;height:auto;min-height:0}
.masonry{columns:1;column-gap:0}
.masonry figure{margin-bottom:12px}
.masonry img{max-height:62vh;object-fit:cover}
.masonry figcaption{opacity:1;padding:34px 14px 12px}
.paradise .in{padding-top:72px;padding-bottom:72px}
.paradise .mono-row{gap:18px 26px}
.slab .in{padding:72px 0}
.slab .phone{font-size:clamp(38px,11vw,46px)}
footer{padding:40px 0 48px}
footer .cols{grid-template-columns:1fr;gap:26px;margin-bottom:30px}
.filter{margin:20px 0 22px}
}

/* reveal on scroll */
.rv{opacity:0;transform:translateY(26px);transition:opacity .7s,transform .7s}
.rv.on{opacity:1;transform:none}
@media(max-width:700px){.rv{transform:translateY(14px);transition:opacity .45s,transform .45s}}
.credgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;margin-top:36px}
.cred{background:var(--panel);border:1px solid var(--line);border-radius:3px;padding:22px}
.cred b{font-family:var(--mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--red-hot);display:block;margin-bottom:8px}
.cred span{font-size:15px;color:var(--ink-soft);line-height:1.5}
`;

/* -------------------------------- helpers -------------------------------- */
const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;");
const P = f => `/assets/photos/${f}`;

const nav = [
  ["directional-boring","Boring"],["excavation","Excavation"],["paving","Paving"],
  ["septic","Septic"],["projects","Projects"],["about","About"],["contact","Contact"],
];

const jsonld = JSON.stringify({
  "@context":"https://schema.org","@type":"GeneralContractor",
  "@id":`https://${biz.domain}/#business`,name:biz.name,telephone:"+15303851445",
  email:biz.email,url:`https://${biz.domain}/`,foundingDate:undefined,founder:{"@type":"Person",name:biz.founder},
  address:{"@type":"PostalAddress",streetAddress:"209 San Benito Ave",addressLocality:"Gerber",addressRegion:"CA",postalCode:"96035",addressCountry:"US"},
  areaServed:biz.counties.map(c=>({"@type":"AdministrativeArea",name:`${c} County, CA`})),
  hasCredential:[{"@type":"EducationalOccupationalCredential",credentialCategory:"license",name:`CSLB Class A Contractor #${biz.license}`}],
});

function layout({slug,title,desc,body,active}) {
  const navHtml = nav.map(([s,l])=>`<a href="/${s}/" ${s===active?'class="on"':''}>${l}</a>`).join("");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="https://${biz.domain}/${slug==="index"?"":slug+"/"}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="website">
<meta name="theme-color" content="#0e0e0e">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%230e0e0e'/%3E%3Ctext x='32' y='44' font-family='Arial Black,sans-serif' font-size='30' font-weight='900' fill='%23c1272d' text-anchor='middle'%3ED%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Barlow:wght@400;500;600&display=swap" rel="stylesheet">
<script type="application/ld+json">${jsonld}</script>
<style>${css}</style>
</head>
<body>
<div class="grain" aria-hidden="true"></div>
<header class="hdr" id="hdr">
  <a class="brand" href="/"><b>Dudley&rsquo;s Excavating</b><span>Gerber · California · Inc.</span></a>
  <nav class="nav" id="nav">${navHtml}<div class="m-cta"><a class="btn red" href="${biz.phoneHref}">Call ${biz.phone}</a><a class="btn ghost" href="/world/">◉ Fly the bore</a></div></nav>
  <a class="call" href="${biz.phoneHref}">${biz.phone}</a>
  <button class="burger" id="burger" aria-label="menu" aria-expanded="false"><i class="bi"></i></button>
</header>
${body}
<section class="slab"><div class="wrap in">
  <span class="kick" style="justify-content:center">Class A Contractor · CA Lic #${biz.license}</span>
  <h2>Put us in the ground</h2>
  <a class="phone" href="${biz.phoneHref}">${biz.phone}</a>
  <p>${biz.address} &nbsp;·&nbsp; <a href="mailto:${biz.email}" style="color:var(--ink-soft);text-decoration:underline">${biz.email}</a></p>
</div></section>
<footer><div class="wrap">
  <div class="cols">
    <div>
      <h4>Dudley&rsquo;s Excavating, Inc.</h4>
      <p style="max-width:34ch;line-height:1.7">Three generations of underground construction out of Gerber, California. Founded by ${biz.founder}.</p>
    </div>
    <div><h4>Work</h4><a href="/directional-boring/">Directional Boring</a><a href="/utilities/">Utility Installation</a><a href="/excavation/">Excavation</a><a href="/paving/">Paving</a><a href="/chip-seal/">Chip Seal</a><a href="/septic/">Septic</a><a href="/grading/">Grading</a><a href="/hauling/">Hauling &amp; Materials</a></div>
    <div><h4>Company</h4><a href="/about/">About</a><a href="/paradise-fiber/">The Paradise Job</a><a href="/projects/">Projects</a><a href="/service-area/">Service Area</a><a href="/world/">◉ Fly the Bore</a></div>
    <div><h4>Contact</h4><a href="${biz.phoneHref}">${biz.phone}</a><a href="mailto:${biz.email}">${biz.email}</a><p style="margin-top:8px;line-height:1.7">209 San Benito Ave<br>Gerber, CA 96035</p></div>
  </div>
  <div class="lic">© 2026 ${biz.name} · CSLB Class A Lic #${biz.license} · ${biz.licenseClasses}<br>
  DGS Certified Small Business #${biz.dgs} · USDOT ${biz.usdot} · Serving ${biz.counties.join(", ")} Counties, Northern California</div>
</div></footer>
<script>
const hdr=document.getElementById('hdr');
addEventListener('scroll',()=>hdr.classList.toggle('solid',scrollY>40),{passive:true});
hdr.classList.toggle('solid',scrollY>40);
const burger=document.getElementById('burger'),navEl=document.getElementById('nav');
burger.onclick=()=>{const open=navEl.classList.toggle('open');
  document.body.classList.toggle('menu-open',open);burger.setAttribute('aria-expanded',open);};
navEl.addEventListener('click',e=>{if(e.target.closest('a')){navEl.classList.remove('open');
  document.body.classList.remove('menu-open');burger.setAttribute('aria-expanded','false');}});
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('on')),{threshold:.04,rootMargin:'0px 0px -6% 0px'});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));
</script>
</body>
</html>`;
}

/* ------------------------------- components ------------------------------- */
const statBand = `
<div class="stats rv"><div class="wrap row">
  <div class="stat"><b><i>3</i></b><span>Generations</span></div>
  <div class="stat"><b>${biz.powerUnits}</b><span>Power units</span></div>
  <div class="stat"><b>${biz.drivers}</b><span>Drivers &amp; operators</span></div>
  <div class="stat"><b>${biz.permits}</b><span>Permitted projects since &rsquo;18</span></div>
  <div class="stat"><b><i>4</i></b><span>NorCal counties</span></div>
</div></div>`;

const paradiseBand = (big=false) => `
<section class="paradise rv">
  <img class="bgimg" src="${P("60c82a06-8321-44e5-b403-a7b5255d25b0.jpg")}" alt="Fusing fiber conduit in the Camp Fire burn scar" loading="lazy">
  <div class="wrap in">
    <span class="kick">Case study · Camp Fire restoration</span>
    <h2 style="max-width:14ch">${paradise.miles} miles under a town that burned</h2>
    <p class="lede">When the Camp Fire took Paradise, it took the infrastructure with it. Dudley&rsquo;s crews have spent years on the AT&amp;T fiber restoration — <b>${paradise.miles} miles of underground fiber</b> bored through ${paradise.soil} on a ${paradise.yearsTotal}-year rebuild, running a ${paradise.rig}.</p>
    <div class="mono-row">
      <div><b>${paradise.miles} mi</b><span>Underground fiber</span></div>
      <div><b>${paradise.yearsTotal} yr</b><span>Project length</span></div>
      <div><b>AT&amp;T</b><span>Client</span></div>
    </div>
    ${big?"":`<p style="margin-top:34px"><a class="btn ghost" href="/paradise-fiber/">Read the Paradise job →</a></p>`}
  </div>
</section>`;

function svcCard(href,img,tab,title,text){
  return `<a class="svc rv" href="${href}"><span class="tab">${tab}</span><img src="${P(img)}" alt="${esc(title)}" loading="lazy">
  <div class="in"><h3>${title}</h3><p>${text}</p><span class="go">See the work →</span></div></a>`;
}

function scrubHero(clipN,kick,title,lede,alt,ctas){
  const c=ctas||`<a class="btn red" href="${biz.phoneHref}">Call ${biz.phone}</a><a class="btn ghost" href="/world/">◉ Fly the bore</a>`;
  return `<section class="scrub pscrub" data-clip="${clipN}"><div class="scrub-stick">
  <img class="poster" src="/world/assets/still_${clipN}.jpg" alt="${esc(alt||"")}">
  <video muted playsinline preload="auto" style="opacity:0"></video>
  <div class="scrub-shade"></div>
  <div class="pbeat"><span class="kick">${kick}</span><h1>${title}</h1>
  <p class="lede" style="margin-top:18px">${lede}</p>
  <div class="hero-ctas">${c}</div></div>
  <div class="scrub-hint"><span>Scroll</span><i></i></div>
  </div></section>
  <script>
  (()=>{
    const sec=document.currentScript.previousElementSibling.tagName==='SECTION'?document.currentScript.previousElementSibling:document.querySelector('.pscrub');
    const vid=sec.querySelector('video'),poster=sec.querySelector('.poster'),hint=sec.querySelector('.scrub-hint');
    const n=sec.dataset.clip;
    const phone=matchMedia('(max-width:860px),(pointer:coarse)').matches;
    const src='/world/assets/dive_'+n+(phone?'_m':'')+'.mp4';
    let ready=false,busy=false,pend=null,wd=null;
    vid.addEventListener('seeked',()=>{clearTimeout(wd);busy=false;
      if(pend!=null){const p2=pend;pend=null;seek(p2);}});
    function seek(t){if(!ready)return;
      if(Math.abs(vid.currentTime-t)<0.02)return;
      if(busy){pend=t;return;}
      busy=true;vid.currentTime=t;wd=setTimeout(()=>{busy=false;},300);}
    fetch(src,{method:'HEAD'}).then(r=>{if(!r.ok)return;vid.src=src;vid.load();
      vid.addEventListener('loadeddata',()=>{ready=true;vid.style.opacity=1;poster.style.opacity=0;},{once:true});}).catch(()=>{});
    addEventListener('touchstart',()=>{if(vid.src)vid.play().then(()=>vid.pause()).catch(()=>{});},{once:true,passive:true});
    function onS(){const r=sec.getBoundingClientRect();
      const p=Math.min(1,Math.max(0,-r.top/(r.height-innerHeight)));
      if(ready&&vid.duration)seek(p*Math.max(0,vid.duration-0.05));
      hint.style.opacity=p>0.04?0:1;}
    addEventListener('scroll',onS,{passive:true});onS();
  })();
  </script>`;
}
function pageHero(img,kick,title,lede,alt){
  return `<section class="phero"><img class="bg" src="${P(img)}" alt="${esc(alt||title)}"><div class="shade"></div>
  <div class="wrap in"><span class="kick">${kick}</span><h1>${title}</h1>
  <p class="lede" style="margin-top:20px">${lede}</p></div></section>`;
}

function gallery(cats){
  const items = photos.filter(p=>!cats||cats.includes(p[2]))
    .map(([f,cap,cat])=>`<figure class="rv" data-cat="${cat}"><img src="${P(f)}" alt="${esc(cap)}" loading="lazy"><figcaption>${esc(cap)}</figcaption></figure>`).join("\n");
  return `<div class="masonry">${items}</div>`;
}

/* --------------------------------- pages --------------------------------- */
const pages = [];

/* ---- HOME ---- */
pages.push({slug:"index",active:"",title:`Dudley's Excavating, Inc. — Directional Boring, Excavation & Paving | Gerber, CA`,
desc:`Three generations of underground construction in Northern California. Directional boring under streets, highways, streams and railroads. CSLB #694077. Call 530-385-1445.`,
body:`
<section class="scrub" id="scrub">
  <div class="scrub-stick">
    <img class="poster" id="scrubPoster" src="/world/assets/still_3.jpg" alt="Dudley's directional drill rig boring on a Northern California mountain job">
    <video id="scrubVid" muted playsinline preload="auto" style="opacity:0"></video>
    <div class="scrub-shade"></div>
    <div class="beat" data-b="0">
      <span class="kick">Gerber, California · Est. by ${biz.founder}</span>
      <div class="bigline">Three generations<br>in the ground.</div>
      <div class="hero-ctas">
        <a class="btn red" href="${biz.phoneHref}">Call ${biz.phone}</a>
        <a class="btn ghost" href="/about/">The Dudley story →</a>
      </div>
    </div>
    <div class="beat" data-b="1">
      <span class="kick">Horizontal directional drilling</span>
      <div class="bigline">Under streets. Highways.<br><em>Streams. Railroads.</em></div>
      <p>We bore where you can't dig — ${paradise.miles} miles of it under Paradise alone.</p>
      <div class="hero-ctas">
        <a class="btn red" href="/directional-boring/">Directional boring →</a>
        <a class="btn ghost" href="/world/">◉ Fly the bore</a>
      </div>
    </div>
    <div class="beat" data-b="2">
      <span class="kick">Class A Contractor · CA Lic #${biz.license}</span>
      <div class="bigline">Dudley&rsquo;s <em>Excavating.</em></div>
      <div class="hero-ctas">
        <a class="btn red" href="${biz.phoneHref}">Call ${biz.phone}</a>
        <a class="btn ghost" href="/world/">◉ Fly the bore</a>
      </div>
    </div>
    <div class="scrub-hint" id="scrubHint"><span>Scroll</span><i></i></div>
  </div>
</section>

<section class="sec"><div class="wrap">
  <span class="kick rv">What we do</span>
  <h2 class="rv">The ground is our jobsite</h2>
  <p class="lede rv">Excavation, boring, paving and septic for public agencies, utilities, builders and homeowners across ${biz.counties.join(", ")} counties.</p>
  <div class="svc-grid">
    <a class="svc lead rv" href="/directional-boring/"><img src="${P("80144252-8a61-4e2b-be71-811a5ea9d846.jpg")}" alt="Directional boring rig at sunrise">
      <div class="in"><span class="kick">Flagship</span><h3>Directional Boring</h3>
      <p style="font-size:16px;margin-top:10px">Trenchless installs under streets, highways, streams and railroads. No open cut, no closed road, no torn-up frontage — the surface never knows we were there.</p>
      <span class="go" style="margin-top:18px">The signature service →</span></div></a>
    ${svcCard("/excavation/","Untitled-1.jpg","02","Excavation","Rock cuts, trenching, and site excavation — including the hard ground other outfits walk away from.")}
    ${svcCard("/utilities/","21c6cc0e-b49d-4ac3-a612-9cf67f2aa817.jpg","03","Utility Installation","Gas, electric, water, sewer and comms — rural and urban, cable to conduit, fused and pulled.")}
    ${svcCard("/paving/","34f1ef0d-0849-49b2-a3be-b96a1235aab6.jpg","04","Paving","Asphalt paving, patching, parking lots and driveways — commercial and residential.")}
    ${svcCard("/septic/","573dac2a-c90c-41d6-8b5f-b78b2055cdea.jpg","05","Septic","Septic replacement and pumping for the properties the sewer never reached.")}
    ${svcCard("/grading/","a6c99a6d-5882-4da3-bdbc-dc0ade895dd5.jpg","06","Grading & Site Work","Grading for any construction, and subdivision development to local and state standards.")}
    ${svcCard("/hauling/","c8befdac-e8b8-4964-a1b6-c3251011b4a2.jpg","07","Hauling & Materials","Radio-dispatched trucks. Topsoil, sand and gravel, delivered from our yard in Gerber.")}
    ${svcCard("/chip-seal/","761beb71-0b24-4c8d-808d-97f1f806b5eb.jpg","08","Chip Seal","Chip seal roads that stand up to valley heat and mountain winters alike.")}
  </div>
</div></section>

${statBand}
${paradiseBand()}

<section class="sec"><div class="wrap band">
  <div class="rv">
    <span class="kick">Since ${biz.founder} broke ground</span>
    <h2>We know how the ground moves here</h2>
    <p class="lede">Dudley&rsquo;s Excavating has been serving the Gerber area for generations. We understand the way the ground moves around here, the soil types that are common, and the hazards a project can run into — because we've been digging in it our whole lives.</p>
    <ul class="checks">
      <li><b>Three generations</b> of Dudleys running the work — ${biz.family.join(", ")}.</li>
      <li><b>${biz.powerUnits} power units, ${biz.drivers} drivers</b> on file with the FMCSA — real fleet depth, radio dispatched.</li>
      <li><b>${biz.permits} permitted projects</b> across Chico, Redding and Butte County since 2018.</li>
      <li><b>Certified Small Business</b> (DGS #${biz.dgs}) — count us toward your SB participation goals.</li>
    </ul>
    <p style="margin-top:28px"><a class="btn ghost" href="/about/">The Dudley story →</a></p>
  </div>
  <figure class="rv"><img src="${P("64fcad2e-5201-4399-af3c-c5ebc1a974ff.jpg")}" alt="Dudley's crew and excavator on a hillside job" loading="lazy"><figcaption>Crew-owned standards</figcaption></figure>
</div></section>

<section class="sec" style="padding-top:0"><div class="wrap">
  <span class="kick rv">Proof</span>
  <h2 class="rv">Straight off the jobsite</h2>
  <p class="lede rv">No stock photos on this site. Every frame below is a Dudley's crew on a Northern California job.</p>
  <div style="margin-top:36px">${gallery(["boring","excavation","paving"])}</div>
  <p style="margin-top:28px" class="rv"><a class="btn ghost" href="/projects/">Full project gallery →</a></p>
</div></section>

<script>
(()=>{
  const sec=document.getElementById('scrub'),vid=document.getElementById('scrubVid'),
        poster=document.getElementById('scrubPoster'),hint=document.getElementById('scrubHint'),
        beats=[...document.querySelectorAll('.beat')];
  const src='/assets/hero_scrub.mp4';
  let ready=false,seekBusy=false,pend=null;
  const phone=matchMedia('(max-width:860px),(pointer:coarse)').matches;
  const useSrc=phone?'/assets/hero_scrub_m.mp4':src;   // 540p tight-GOP reel for phones
  fetch(useSrc,{method:'HEAD'}).then(r=>{if(!r.ok)return;
    vid.src=useSrc;vid.load();
    vid.addEventListener('loadeddata',()=>{ready=true;vid.style.opacity=1;poster.style.opacity=0;},{once:true});
  }).catch(()=>{});
  // iOS: prime the decoder on first touch so seeks paint
  addEventListener('touchstart',()=>{if(vid.src)vid.play().then(()=>vid.pause()).catch(()=>{});},{once:true,passive:true});
  let watchdog=null;
  vid.addEventListener('seeked',()=>{clearTimeout(watchdog);seekBusy=false;
    if(pend!=null){const p=pend;pend=null;seek(p);}});
  function seek(t){ if(!ready)return;
    if(Math.abs(vid.currentTime-t)<0.02)return;   // same-frame seek never fires 'seeked'
    if(seekBusy){pend=t;return;}
    seekBusy=true;vid.currentTime=t;
    watchdog=setTimeout(()=>{seekBusy=false;},300); // decoder hiccup safety
  }
  function onScroll(){
    const r=sec.getBoundingClientRect();
    const total=r.height-innerHeight;
    const p=Math.min(1,Math.max(0,-r.top/total));
    if(ready&&vid.duration) seek(p*Math.max(0,vid.duration-0.05));
    const idx=p<0.34?0:p<0.72?1:2;
    beats.forEach((b,i)=>b.classList.toggle('on',i===idx));
    hint.style.opacity=p>0.04?0:1;
  }
  addEventListener('scroll',onScroll,{passive:true});onScroll();
})();
</script>
`});

/* ---- DIRECTIONAL BORING ---- */
pages.push({slug:"directional-boring",active:"directional-boring",
title:`Directional Boring Northern California — Under Streets, Highways, Streams & Railroads | Dudley's Excavating`,
desc:`Horizontal directional drilling (HDD) in Tehama, Shasta, Butte & Glenn counties. Trenchless utility installs under roads, streams and railroads. 40 miles bored under Paradise. CSLB #694077.`,
body:`
${scrubHero(3,"Service 01 · The flagship","Directional<br>Boring",
`Horizontal directional drilling puts gas, water, sewer, power and fiber <b>under</b> streets, highways, streams and railroads — without opening the surface. You're inside one of our bores right now.`,"Inside a Dudley's directional bore — drill head advancing through red clay",
`<a class="btn red" href="${biz.phoneHref}">Call ${biz.phone}</a><a class="btn ghost" href="/paradise-fiber/">The Paradise job →</a>`)}

<section class="sec"><div class="wrap band">
  <div class="rv">
    <span class="kick">Why trenchless</span>
    <h2>The road never closes.<br>The creek never clouds.</h2>
    <p class="lede">An open trench across a state highway means flaggers, detours, paveback and an angry public. A bore means a pit on each side and a clean pull between them. We steer the head, we hit the target, and traffic never stops.</p>
    <ul class="checks">
      <li><b>Streets &amp; highways</b> — cross under the traveled way without an encroachment nightmare.</li>
      <li><b>Streams &amp; waterways</b> — no in-channel disturbance, no turbidity, cleaner permits.</li>
      <li><b>Railroads</b> — bored crossings to railroad specs.</li>
      <li><b>Driveways &amp; finished frontage</b> — like the 27-foot, 1-inch bore below. Concrete untouched.</li>
    </ul>
    <ul class="chips">
      <li>Rock &amp; cobble capable</li><li><b>${paradise.rig}</b> class rigs</li><li>Vacuum potholing</li><li>HDPE fusion on site</li>
    </ul>
  </div>
  <figure class="rv"><img src="${P("f3a270d4-b715-4035-9683-9f4e000664f5.jpg")}" alt="27 foot 1 inch bore under a finished driveway" loading="lazy"><figcaption>27&nbsp;ft bore · 1&Prime; · surface untouched</figcaption></figure>
</div></section>

${paradiseBand()}

<section class="sec"><div class="wrap band rev">
  <div class="rv">
    <span class="kick">How we bore</span>
    <h2>Pothole first.<br>Then drill.</h2>
    <p class="lede">Hard ground isn't a guess — it's a plan. We vacuum-pothole to daylight every existing utility before the head goes in, fuse the product pipe on site, and pull it back through in one continuous run.</p>
    <ul class="checks">
      <li><b>Locate &amp; daylight</b> — vac excavation exposes what's really down there.</li>
      <li><b>Pilot bore</b> — steered head, tracked from the surface, through clay, cobble and granite.</li>
      <li><b>Ream &amp; pull</b> — fused HDPE pulled back in one piece. No joints in the ground.</li>
      <li><b>Restore</b> — pits closed, shoulder dressed, hydroseed down. Like we were never there.</li>
    </ul>
  </div>
  <figure class="rv"><img src="${P("573dac2a-c90c-41d6-8b5f-b78b2055cdea.jpg")}" alt="Vacuum potholing to expose utilities before boring" loading="lazy"><figcaption>Vac potholing before the shot</figcaption></figure>
</div></section>

<section class="sec" style="padding-top:0"><div class="wrap">
  <h2 class="rv">Boring, on the record</h2>
  ${gallery(["boring","utility"])}
</div></section>
`});

/* ---- simple service pages ---- */
function servicePage({slug,num,title,heroImg,heroAlt,kick,lede,sections,cats,titleTag,desc,clip}){
  const hero = clip ? scrubHero(clip,`Service ${num}`,title,lede,heroAlt)
                    : pageHero(heroImg,`Service ${num}`,title,lede,heroAlt);
  pages.push({slug,active:slug,title:titleTag,desc,
  body:`${hero}
  ${sections.map((s,i)=>`
  <section class="sec"${i%2?' style="padding-top:0"':''}><div class="wrap band${i%2?" rev":""}">
    <div class="rv"><span class="kick">${s.kick}</span><h2>${s.h}</h2><p class="lede">${s.p}</p>
    ${s.checks?`<ul class="checks">${s.checks.map(c=>`<li>${c}</li>`).join("")}</ul>`:""}</div>
    <figure class="rv"><img src="${P(s.img)}" alt="${esc(s.alt)}" loading="lazy">${s.cap?`<figcaption>${s.cap}</figcaption>`:""}</figure>
  </div></section>`).join("")}
  ${statBand}
  <section class="sec"><div class="wrap"><h2 class="rv">From the jobsite</h2>${gallery(cats)}</div></section>`});
}

servicePage({slug:"excavation",num:"02",clip:2,title:"Excavation",heroImg:"Untitled-1.jpg",
heroAlt:"Excavator cutting a rock trench beside a mountain highway",
titleTag:"Excavation Contractor — Rock Trenching & Site Excavation | Dudley's Excavating, Gerber CA",
desc:"Class A excavation contractor in Northern California. Rock trenching, site excavation, plated road cuts. Tehama, Shasta, Butte, Glenn counties. CSLB #694077.",
kick:"Service 02",lede:`Trenching, rock cuts and site excavation across ${biz.counties.join(", ")} counties — including the hard ground where a bucket alone won't cut it.`,
sections:[
 {kick:"Hard ground",h:"We don't stop<br>at rock",p:"Northern California doesn't give you clean digging. Mountain grades give you granite; the valley gives you hardpan and cobble. We cut it, plate it overnight, and keep the road open while we work the trench.",img:"592d06b8-bc1e-4076-87f9-6508c62b130d.jpg",alt:"Rock trench beside the highway with steel plates",cap:"Rock cut, plated for traffic",
 checks:["<b>Trenching</b> in soil, cobble and rock — shored and plated to spec.","<b>Roadside excavation</b> with our own certified traffic control (it's on our license).","<b>Steep-ground work</b> — hillside cuts with full rigging and spotters.","<b>Radio-dispatched hauling</b> — spoils out and base rock in without waiting on a sub."]},
],cats:["excavation","crew"]});

servicePage({slug:"utilities",num:"03",clip:4,title:"Utility<br>Installation",heroImg:"21c6cc0e-b49d-4ac3-a612-9cf67f2aa817.jpg",
heroAlt:"Butt-fusing HDPE pipe on a Northern California hillside",
titleTag:"Underground Utility Installation — Gas, Water, Sewer, Electric | Dudley's Excavating",
desc:"Rural and urban underground utility installation: gas, electrical, water and sewer lines, cable, pipe and conduit placement. Northern California. CSLB #694077 + Low Voltage classification.",
kick:"Service 03",lede:`Underground cable, pipe and conduit placement — rural and urban gas, electrical, water and sewer line installation, from the meter to the main.`,
sections:[
 {kick:"Wet, dry, live",h:"Every kind of line,<br>in every kind of ground",p:"Fiber for a carrier rebuild. Water services in a subdivision. A gas main crossing under a county road. Our license carries the Low Voltage Systems classification on top of Class A — so comms and power land in the same trench, permitted right.",
 img:"a092b754-85b0-4e1d-ab52-c89b3b5a56c9.jpg",alt:"Vac crew daylighting a live utility under traffic control",cap:"Daylighting live lines",
 checks:["<b>Gas, water, sewer</b> — rural and urban installs to agency standards.","<b>Electric &amp; comms</b> — Low Voltage classification held on our CSLB license.","<b>HDPE fusion</b> on site — one continuous line, no joints in the ground.","<b>Vacuum potholing</b> — we daylight what's buried before we touch it."]},
],cats:["utility","boring"]});

servicePage({slug:"paving",num:"04",clip:5,title:"Paving",heroImg:"34f1ef0d-0849-49b2-a3be-b96a1235aab6.jpg",
heroAlt:"CAT double-drum roller compacting fresh asphalt",
titleTag:"Asphalt Paving & Patching — Parking Lots, Driveways, Streets | Dudley's Excavating, Gerber CA",
desc:"Asphalt paving, paving and patching, parking lot and driveway paving in Tehama, Shasta, Butte and Glenn counties. Commercial and residential. CSLB #694077.",
kick:"Service 04",lede:`Asphalt paving and patching, parking lots and driveways — commercial and residential, from grinding out the failure to rolling the finish.`,
sections:[
 {kick:"Full-depth",h:"From subgrade<br>to steamroller",p:"Because we're an excavation outfit first, our paving starts under the asphalt: grade, base and compaction done right, so the mat we roll on top actually lasts. Patch sets, trench paveback, full lots, new driveways.",
 img:"2c5c0149-1d3e-40b6-313b-854b13b1371b.jpg".replace("313b","913f"),alt:"Grinding out failed asphalt before repave",cap:"Grind out, then repave",
 checks:["<b>Asphalt paving &amp; patching</b> — streets, lots, driveways.","<b>Trench paveback</b> — our utility cuts closed to agency spec.","<b>Parking lots</b> — commercial paving with grading that actually drains.","<b>Driveways</b> — clean edges, compacted lifts, aprons that hold."]},
],cats:["paving"]});

servicePage({slug:"chip-seal",num:"05",clip:1,title:"Chip Seal",heroImg:"761beb71-0b24-4c8d-808d-97f1f806b5eb.jpg",
heroAlt:"Freshly sealed two-lane road through the pines",
titleTag:"Chip Seal Roads — Northern California | Dudley's Excavating",
desc:"Chip seal road surfacing for counties, districts and private road associations in Northern California. Dudley's Excavating, Gerber CA. CSLB #694077.",
kick:"Service 05",lede:`Chip seal surfacing that buys a road years of life for a fraction of an overlay — the practical answer for county roads, district roads and long private drives.`,
sections:[
 {kick:"Miles, not patches",h:"The valley's<br>working surface",p:"Chip seal is how Northern California keeps its rural road miles alive: a sprayed binder, a tight rock chip, rolled in and swept off. We run the full operation — prep, traffic control, application and cleanup — with our own trucks feeding the job.",
 img:"2a23c12b-610c-4e57-8e0f-3b6a968eb70f.jpg",alt:"Roller working behind the water truck",cap:"Rolling the seal",
 checks:["<b>County &amp; district roads</b> — public-agency experience, SB certified (DGS #"+biz.dgs+").","<b>Private roads &amp; ranch drives</b> — priced for long miles.","<b>Our own traffic control</b> — Construction Zone Traffic Control is on our license.","<b>Our own hauling</b> — "+biz.powerUnits+" power units keep chips on the job, not on order."]},
],cats:["paving","crew"]});

servicePage({slug:"septic",num:"06",title:"Septic",heroImg:"610ce8ca-c6ad-47e8-864d-f4c0c7d661ed.jpg",
heroAlt:"Careful excavation tight to landscaping for septic work",
titleTag:"Septic Replacement & Pumping — Tehama, Shasta, Butte, Glenn | Dudley's Excavating",
desc:"Septic system replacement and pumping for rural Northern California properties. Dudley's Excavating, Gerber CA. CSLB #694077.",
kick:"Service 06",lede:`Septic replacement and pumping for the properties the sewer never reached — which, out here, is most of them.`,
sections:[
 {kick:"Rural reality",h:"When the system fails,<br>speed matters",p:"A failed septic isn't a someday problem. We replace failed tanks and systems and keep working systems pumped — with the excavation experience to work tight to houses, wells and landscaping instead of trenching through everything you own.",
 img:"c592f19f-b545-4e93-a547-5d780c311a95.jpg",alt:"Clean trench crossing in native red dirt",cap:"Tight, clean cuts",
 checks:["<b>Septic replacement</b> — failed tanks and systems out, new systems in.","<b>Septic pumping</b> — routine service that prevents the emergency.","<b>Yard-respecting excavation</b> — vac and careful bucket work near what matters.","<b>One call</b> — dig, set, plumb, backfill and grade, all one crew."]},
],cats:["utility","excavation"]});

servicePage({slug:"grading",num:"07",title:"Grading &amp;<br>Site Work",heroImg:"a6c99a6d-5882-4da3-bdbc-dc0ade895dd5.jpg",
heroAlt:"Excavator loading a dump truck on a mountain grade",
titleTag:"Grading & Subdivision Development — Northern California | Dudley's Excavating",
desc:"Grading for any type of construction or site work. Subdivision development to local and state standards. Dudley's Excavating, Gerber CA. CSLB #694077.",
kick:"Service 07",lede:`Grading for any type of construction or site work — and subdivision development built to local and state standards.`,
sections:[
 {kick:"Ground-up",h:"Sites that pass<br>the first inspection",p:"Building pads, road prep, drainage that actually moves water. We grade for builders, agencies and owners across four counties, and we develop subdivisions to the standards the county will actually sign off on — because we've done it under their inspectors for years.",
 img:"22-placeholder.jpg".replace("22-placeholder.jpg","2eecfa93-22bf-4b02-9b98-49e9c7c7ce23.jpg"),alt:"Excavator working a state route shoulder",cap:"Working the grade",
 checks:["<b>Grading for any construction</b> — pads, roads, drainage, ponds.","<b>Subdivision development</b> — to local and state standards.","<b>Cut/fill with our own trucks</b> — "+biz.powerUnits+" units, radio dispatched.","<b>Materials from our yard</b> — topsoil, sand and gravel on our own iron."]},
],cats:["excavation","crew"]});

servicePage({slug:"hauling",num:"08",title:"Hauling &amp;<br>Materials",heroImg:"c8befdac-e8b8-4964-a1b6-c3251011b4a2.jpg",
heroAlt:"Excavator loading an end-dump at dusk",
titleTag:"Aggregate Hauling, Topsoil, Sand & Gravel — Gerber CA | Dudley's Excavating",
desc:"Radio-dispatched aggregate hauling. Topsoil, sand and gravel from our Gerber yard. 40 power units, 44 drivers on file with FMCSA. USDOT 2728939.",
kick:"Service 08",lede:`Aggregate hauling with radio-dispatched vehicles, and topsoil, sand and gravel straight from our yard on San Benito Ave.`,
sections:[
 {kick:"Fleet depth",h:"${'40'} trucks deep,<br>radio dispatched".replace("${'40'}",String(biz.powerUnits)),p:"On file with the FMCSA: "+biz.powerUnits+" power units and "+biz.drivers+" drivers, dispatched by radio, running intrastate across Northern California. When your job needs material moved, it isn't waiting on a broker — the trucks are ours.",
 img:"0c587916-7d9a-4a63-9daa-3ae3177b74ba.jpg",alt:"Roller and dump truck on a patch job",cap:"Our iron, our drivers",
 checks:["<b>Aggregate hauling</b> — radio-dispatched end dumps and transfers.","<b>Topsoil, sand &amp; gravel</b> — sold and delivered from the Gerber yard.","<b>USDOT "+biz.usdot+"</b> — active, intrastate, machinery and construction cargo.","<b>Spoils off, base on</b> — one dispatcher for both directions."]},
],cats:["excavation","paving","crew"]});

/* ---- PARADISE ---- */
pages.push({slug:"paradise-fiber",active:"",title:`The Paradise Fiber Rebuild — 40 Miles of Underground Fiber After the Camp Fire | Dudley's Excavating`,
desc:`How Dudley's Excavating bored 40 miles of underground fiber through red clay, cobble and granite to help rebuild Paradise, CA after the Camp Fire — a 6-year AT&T infrastructure restoration.`,
body:`
${scrubHero(6,"Case study · Butte County","The Paradise<br>Job",
`The Camp Fire erased a town's infrastructure in a day. Putting it back — underground this time — takes years. This is the job our crews have carried since.`,"Directional drill rig at golden hour on the ridge",
`<a class="btn red" href="/directional-boring/">Our boring capability →</a><a class="btn ghost" href="${biz.phoneHref}">Call ${biz.phone}</a>`)}

<section class="sec"><div class="wrap band">
  <div class="rv">
    <span class="kick">The assignment</span>
    <h2>${paradise.miles} miles of fiber,<br>all of it buried</h2>
    <p class="lede">After the Camp Fire leveled ${paradise.town}, AT&amp;T committed to rebuilding its network underground — fireproof this time. Dudley's, an hour away in Gerber, went to work on a <b>${paradise.yearsTotal}-year, ${paradise.miles}-mile underground fiber installation</b>, directional boring through the ridge's ${paradise.soil}.</p>
    <ul class="checks">
      <li><b>Client:</b> AT&amp;T — carrier-grade specs, carrier-grade inspection.</li>
      <li><b>Ground:</b> ${paradise.soil} — the ridge does not dig easy.</li>
      <li><b>Method:</b> HDD on a ${paradise.rig}, with hard-rock tooling.</li>
      <li><b>Context:</b> a working town rebuilding around the crews — driveways, traffic, daily life.</li>
    </ul>
  </div>
  <figure class="rv"><img src="${P("d159418c-2f4b-4ef1-ae66-7ca10a88a9da.jpg")}" alt="Fused HDPE conduit strung along the roadside ready to pull" loading="lazy"><figcaption>Strung &amp; ready to pull</figcaption></figure>
</div></section>

<div class="stats rv"><div class="wrap row">
  <div class="stat"><b><i>${paradise.miles}</i> mi</b><span>Underground fiber</span></div>
  <div class="stat"><b>${paradise.yearsTotal} yr</b><span>Project duration</span></div>
  <div class="stat"><b>1 hr</b><span>From our Gerber yard</span></div>
  <div class="stat"><b>0</b><span>Overhead lines installed</span></div>
</div></div>

<section class="sec"><div class="wrap band rev">
  <div class="rv">
    <span class="kick">Why it mattered</span>
    <h2>"Getting Paradise<br>back to a community"</h2>
    <p class="lede">That's how one local put it, watching the work go in. Fiber sounds like a luxury until you remember what it carries in a fire-rebuilt town: the alert systems, the insurance calls, the home businesses, the kids' schooling. Burying it means the next fire doesn't take it again.</p>
    <p class="lede" style="margin-top:14px">For our crews — many of whom watched the smoke from the valley in 2018 — it's the proudest line on the resume.</p>
    <p style="margin-top:28px"><a class="btn red" href="/directional-boring/">Our boring capability →</a></p>
  </div>
  <figure class="rv"><img src="${P("Untitled.jpg")}" alt="Restored and hydroseeded shoulder behind the bore path" loading="lazy"><figcaption>Behind us: restored ground</figcaption></figure>
</div></section>
`});

/* ---- ABOUT ---- */
pages.push({slug:"about",active:"about",title:`About Dudley's Excavating — Three Generations Underground in Gerber, CA`,
desc:`Founded by Harry Dudley and still family-run three generations later. Class A contractor #694077, DGS certified small business, 40-truck fleet. Gerber, California.`,
body:`
${pageHero("64fcad2e-5201-4399-af3c-c5ebc1a974ff-1.jpg","Gerber, California","Three<br>Generations",
`${biz.name} was founded by <b>${biz.founder}</b> and is still run by Dudleys today — ${biz.family.join(", ")} — out of the same yard on San Benito Avenue.`,"Dudley's crew on a Northern California hillside job")}

<section class="sec"><div class="wrap band">
  <div class="rv">
    <span class="kick">The Dudley's philosophy</span>
    <h2>A knowledgeable, engaged crew<br>is the whole product</h2>
    <p class="lede">As a construction partner, we believe a knowledgeable, experienced and engaged team delivers a superior end result. That's not a poster in the office — it's why the same families have run this company's iron for decades, and why agencies across four counties keep our number.</p>
    <ul class="checks">
      <li><b>${biz.founder}</b> founded the company and set the standard.</li>
      <li><b>Scott Dudley</b> — president, General Engineering contractor, four decades on the iron.</li>
      <li><b>Michael Dudley</b> — third generation, Chico State project management.</li>
      <li><b>Kyle Dudley</b> — third generation, running the work forward.</li>
      <li><b>${biz.pm}</b> — project management on the carrier and agency work.</li>
    </ul>
  </div>
  <figure class="rv"><img src="${P("42fb96bd-057d-42af-8869-a5e01283f474.jpg")}" alt="Crew laying out marks before a cut" loading="lazy"><figcaption>Layout before the cut</figcaption></figure>
</div></section>

${statBand}

<section class="sec"><div class="wrap">
  <span class="kick rv">On paper</span>
  <h2 class="rv">Licensed, bonded, verifiable</h2>
  <p class="lede rv">Every claim on this page is checkable against a public record. We like it that way.</p>
  <div class="credgrid">
    <div class="cred rv"><b>CSLB License #${biz.license}</b><span>${biz.licenseClasses}. Active — verify at cslb.ca.gov.</span></div>
    <div class="cred rv"><b>DGS Small Business #${biz.dgs}</b><span>State-certified Small Business for California public procurement.</span></div>
    <div class="cred rv"><b>USDOT ${biz.usdot}</b><span>Active intrastate carrier — ${biz.powerUnits} power units, ${biz.drivers} drivers on the current MCS-150.</span></div>
    <div class="cred rv"><b>Bonded &amp; insured</b><span>Contractor's bond by ${biz.bond.split(" — ")[1]}. Workers' comp by ${biz.workersComp}.</span></div>
    <div class="cred rv"><b>Butte County ${biz.butteLic}</b><span>County contractor registration for Butte County work.</span></div>
    <div class="cred rv"><b>${biz.permits} permitted projects</b><span>On record across Chico, Redding and Butte County, 2018–2025.</span></div>
  </div>
</div></section>

<section class="sec" style="padding-top:0"><div class="wrap band rev">
  <div class="rv">
    <span class="kick">Join our team</span>
    <h2>Build a career<br>on solid ground</h2>
    <p class="lede">Dudley's is always looking for hardworking operators, laborers and drivers who take pride in doing the job right. If that's you, call the office.</p>
    <p style="margin-top:24px"><a class="btn red" href="${biz.phoneHref}">Call ${biz.phone}</a></p>
  </div>
  <figure class="rv"><img src="${P("55c6ea23-532c-424f-b29b-2cc15e39013f.jpg")}" alt="Crew member on cleanup pass" loading="lazy"></figure>
</div></section>
`});

/* ---- SERVICE AREA ---- */
pages.push({slug:"service-area",active:"",title:`Service Area — Tehama, Shasta, Butte & Glenn Counties | Dudley's Excavating`,
desc:`Dudley's Excavating serves Tehama, Glenn, Butte and Shasta counties from Gerber, CA — Red Bluff, Redding, Chico, Corning, Paradise, Orland and the mountain communities between.`,
body:`
${pageHero("761beb71-0b24-4c8d-808d-97f1f806b5eb.jpg","Out of Gerber, CA","Four Counties.<br>One Yard.",
`Everything runs from 209 San Benito Ave in Gerber — center of the valley, an hour from the mountain jobs in every direction.`,"Two-lane road through Northern California pines")}
<section class="sec"><div class="wrap">
  <div class="svc-grid" style="margin-top:0">
    <div class="cred rv"><b>Tehama County</b><span>Home turf. Gerber, Red Bluff, Corning, Los Molinos and every ranch road between.</span></div>
    <div class="cred rv"><b>Shasta County</b><span>Redding and the mountain corridors — where our rock experience earns its keep.</span></div>
    <div class="cred rv"><b>Butte County</b><span>Chico, Oroville and Paradise — including ${paradise.miles} miles of fiber under the ridge. County lic ${biz.butteLic}.</span></div>
    <div class="cred rv"><b>Glenn County</b><span>Orland, Willows and the west-side ag country.</span></div>
  </div>
  <p class="lede rv" style="margin-top:36px">On a public job? We're a <b>DGS-certified Small Business (#${biz.dgs})</b> — Dudley's counts toward your SB participation requirement.</p>
</div></section>
${statBand}
`});

/* ---- PROJECTS ---- */
pages.push({slug:"projects",active:"projects",title:`Project Gallery — Dudley's Excavating | Real Jobs, Real Crews`,
desc:`Photos straight off Dudley's Excavating jobsites across Northern California: directional boring, rock excavation, utility installation and paving. No stock photos.`,
body:`
${pageHero("592d06b8-bc1e-4076-87f9-6508c62b130d.jpg","No stock photos","The Work",
`Every frame on this page is a Dudley's crew on a Northern California jobsite. Filter by trade.`,"Excavator trenching rock beside the highway")}
<section class="sec"><div class="wrap">
  <div class="filter" id="filter">
    <button class="on" data-f="all">All</button><button data-f="boring">Boring</button>
    <button data-f="utility">Utilities</button><button data-f="excavation">Excavation</button>
    <button data-f="paving">Paving</button><button data-f="crew">Crew</button>
  </div>
  ${gallery()}
</div></section>
<script>
document.getElementById('filter').addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  document.querySelectorAll('#filter button').forEach(x=>x.classList.toggle('on',x===b));
  const f=b.dataset.f;
  document.querySelectorAll('.masonry figure').forEach(fig=>{
    fig.style.display=(f==='all'||fig.dataset.cat===f)?'':'none';});
});
</script>
`});

/* ---- CONTACT ---- */
pages.push({slug:"contact",active:"contact",title:`Contact Dudley's Excavating — Gerber, CA | 530-385-1445`,
desc:`Call Dudley's Excavating at 530-385-1445 or email paul@dudleysexcavating.com. 209 San Benito Ave, Gerber, CA 96035. Serving Tehama, Glenn, Butte and Shasta counties.`,
body:`
${pageHero("80144252-8a61-4e2b-be71-811a5ea9d846.jpg","One call does it","Contact",
`Tell us what's in the ground — or what needs to be. We'll help evaluate the site and recommend the right path forward.`,"Dudley's bore rig at sunrise")}
<section class="sec"><div class="wrap band">
  <div class="rv">
    <div class="credgrid" style="margin-top:0;grid-template-columns:1fr">
      <div class="cred"><b>Phone — fastest</b><span style="font-family:var(--disp);font-weight:700;font-size:40px;color:var(--ink)"><a href="${biz.phoneHref}">${biz.phone}</a></span></div>
      <div class="cred"><b>Email</b><span><a href="mailto:${biz.email}" style="color:var(--ink);font-size:19px">${biz.email}</a></span></div>
      <div class="cred"><b>Yard &amp; office</b><span>209 San Benito Ave<br>Gerber, CA 96035</span></div>
      <div class="cred"><b>Public agencies</b><span>CSLB #${biz.license} · DGS SB #${biz.dgs} · USDOT ${biz.usdot} — bid docs on request.</span></div>
    </div>
  </div>
  <figure class="rv"><img src="${P("f12f27ca-54ff-49e2-ae8a-ee6393f580fc.jpg")}" alt="Directional drill rig working" loading="lazy"><figcaption>Ready when you are</figcaption></figure>
</div></section>
`});

/* --------------------------------- emit --------------------------------- */
// world page: emitted from gen/world.html with BASE applied
import { readFileSync } from "node:fs";
const worldSrc = readFileSync(new URL("./world.html", import.meta.url), "utf8");
mkdirSync(OUT + "world", {recursive:true});
writeFileSync(OUT + "world/index.html", basify(worldSrc));
console.log("✓ world");
for (const p of pages) {
  const html = basify(layout(p));
  if (p.slug === "index") writeFileSync(OUT + "index.html", html);
  else { mkdirSync(OUT + p.slug, {recursive:true}); writeFileSync(`${OUT}${p.slug}/index.html`, html); }
  console.log("✓", p.slug);
}
console.log("done →", OUT);
