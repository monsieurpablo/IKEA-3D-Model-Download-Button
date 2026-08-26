// ==UserScript==
// @name         IKEA 3D Model Downloader
// @namespace    http://tampermonkey.net/
// @version      3.0.0
// @description  Adds a download button for 3D models on IKEA product pages
// @match        https://*.ikea.com/*/p/*
// @match        https://*.ikea.com/*/*/p/*
// @grant        none
// ==/UserScript==

(function() {
'use strict';

// ponytail: IKEA ships the .glb URLs inline in the page HTML, so no fetch/XHR
// hooking or model-viewer watching is needed. If they ever stop, re-add interception.
function findModelUrl() {
    const urls = [...new Set(document.documentElement.innerHTML.match(/https:\/\/[^"'\s\\]+glb_draco[^"'\s\\]+\.glb[^"'\s\\]*/g) || [])];
    if (!urls.length) return null;
    // rqp3 > rqp2 > rqp1 (render quality profile); geomagical/simple has no rqp -> 0
    const rank = u => Number((u.match(/\/rqp(\d)\//) || [0, 0])[1]);
    return urls.sort((a, b) => rank(b) - rank(a))[0];
}

function label() {
    const t = {
        'fi/fi': 'Lataa 3D', 'se/sv': 'Ladda ned 3D', 'fr/fr': 'Télécharger 3D', 'es/es': 'Descargar 3D',
        'co/es': 'Descargar 3D', 'mx/es': 'Descargar 3D',
        'it/it': 'Scarica 3D', 'no/no': 'Last ned 3D', 'pl/pl': 'Pobierz 3D', 'pt/pt': 'Transferir 3D',
        'jp/ja': '3Dをダウンロード', 'kr/ko': '3D 다운로드', 'cn/zh': '下载3D模型', 'ae/ar': 'تنزيل ثلاثي الأبعاد',
    };
    for (const [k, v] of Object.entries(t)) if (location.href.includes(`ikea.com/${k}/`)) return v;
    return 'Download 3D';
}

function filename(url) {
    const t = (document.querySelector('title')?.textContent || 'ikea_product').trim();
    const parts = t.split(' - IKEA')[0].split(',');
    let fn = parts[0].trim();
    if (parts.length > 1) fn += ' - ' + parts[1].trim();
    const id = (url.match(/\/(\d{6,})\//) || [])[1];
    if (id) fn += ` (${id})`;
    return fn.replace(/[<>:"\/\\|?*]/g, '') + '.glb';
}

async function download(btn) {
    const url = findModelUrl();
    if (!url) { alert('No 3D model found on this page.'); return; }
    const old = btn.textContent;
    btn.querySelector('.i-m-d-label').textContent = '...';
    try {
        const blob = await (await fetch(url)).blob();
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename(url);
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 10000);
    } catch (e) {
        alert('Error downloading model: ' + e.message);
    }
    btn.querySelector('.i-m-d-label').textContent = label();
    void old;
}

function addButton() {
    if (document.getElementById('i-m-d-btn')) return true;
    const xr = document.querySelector('.pipf-xr-button, .pip-xr-button');
    if (!xr) return false;
    const p = xr.className.includes('pipf-') ? 'pipf' : 'pip';

    const btn = document.createElement('button');
    btn.id = 'i-m-d-btn';
    btn.type = 'button';
    btn.className = xr.className;
    btn.style.marginLeft = '10px';
    btn.innerHTML = `<span class="${p}-typography-label-s ${p}-btn__inner">` +
        `<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" class="${p}-svg-icon ${p}-btn__icon">` +
        `<path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"></path></svg>` +
        `<span class="${p}-btn__label i-m-d-label">${label()}</span></span>`;
    btn.addEventListener('click', () => download(btn));
    xr.parentNode.insertBefore(btn, xr.nextSibling);
    return true;
}

let tries = 0;
function poll() {
    if (addButton() || ++tries > 30) return;
    setTimeout(poll, 1000);
}
poll();

// SPA navigation: re-add on URL change
let href = location.href;
new MutationObserver(() => {
    if (location.href === href) return;
    href = location.href;
    document.getElementById('i-m-d-btn')?.remove();
    tries = 0;
    poll();
}).observe(document, { subtree: true, childList: true });
})();
