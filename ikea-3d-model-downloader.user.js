// ==UserScript==
// @name         IKEA 3D Model Downloader
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Adds a download button for 3D models on IKEA product pages
// @match        https://*.ikea.com/*/p/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Arrays for DOM operations
    const _0xb452 = [
        'querySelector', 'querySelectorAll', 'createElement', 'createElementNS',
        'setAttribute', 'appendChild', 'insertBefore', 'addEventListener',
        'click', 'fetch', 'then', 'blob', 'href', 'download', 'getElementById',
        'parentNode', 'nextSibling', 'textContent', 'style', 'classList',
        'getAttribute', 'includes', 'endsWith', 'parse', 'match', 'replace',
        'trim', 'split', 'URL', 'createObjectURL', 'body', 'removeChild',
        'message', 'add', 'marginLeft', 'type', 'id', 'className',
        'performance', 'getEntries', 'name', 'contentDocument',
        'application/octet-stream', 'title', 'observe', 'length'
    ];

    // String processing utility
    const _0x37a2 = function(_0x5d92a5) {
        const _0x5d92a5_rev = _0x5d92a5.toString().split('').reverse().join('');
        const _0x5d92a5_enc = atob(_0x5d92a5_rev);
        return _0x5d92a5_enc;
    };

    // DOM operation helpers
    const _0xe6c7 = {
        [_0xb452[0]]: function(_0x3d7, _0x13f) { return document[_0xb452[0]](_0x13f); },
        [_0xb452[1]]: function(_0x3d7, _0x13f) { return document[_0xb452[1]](_0x13f); },
        [_0xb452[2]]: function() { return document[_0xb452[2]].apply(document, arguments); },
        [_0xb452[3]]: function(_0x3d7, _0x8fc) { return document[_0xb452[3]](_0x3d7, _0x8fc); },
        [_0xb452[4]]: function(_0x3d7, _0x8fc, _0xfd2) { return _0x3d7[_0xb452[4]](_0x8fc, _0xfd2); },
        [_0xb452[5]]: function(_0x3d7, _0x8fc) { return _0x3d7[_0xb452[5]](_0x8fc); },
        [_0xb452[6]]: function(_0x3d7, _0x8fc, _0xfd2) { return _0x3d7[_0xb452[6]](_0x8fc, _0xfd2); },
        [_0xb452[7]]: function(_0x3d7, _0x8fc, _0xfd2) { return _0x3d7[_0xb452[7]](_0x8fc, _0xfd2); },
        [_0xb452[8]]: function(_0x3d7) { return _0x3d7[_0xb452[8]](); },
        [_0xb452[9]]: function(_0x3d7) { return window[_0xb452[9]](_0x3d7); },
        [_0xb452[10]]: function(_0x3d7, _0x8fc) { return _0x3d7[_0xb452[10]](_0x8fc); },
        [_0xb452[22]]: function(_0x3d7, _0x8fc) { return _0x3d7[_0xb452[22]](_0x8fc); },
        [_0xb452[21]]: function(_0x3d7, _0x8fc) { return _0x3d7[_0xb452[21]](_0x8fc); },
        [_0xb452[23]]: function(_0x3d7) { return JSON[_0xb452[23]](_0x3d7); }
    };

    // Retry settings
    let _0x8a4c = 0;
    const _0x9a45 = 7;    // Max retries
    const _0x18db = 1000;  // Initial wait time
    const _0x7c44 = 3000;  // Extended wait time
    const _0x5e89 = 20;    // Sampling limit
    const _0x2c66 = 500;   // Sampling frequency

    // Setup download button
    function _0x6fc4() {
        // Find target button
        const _0x4a97 = _0xe6c7[_0xb452[0]](document, 'button[aria-label*="3D"]');
        if (!_0x4a97) {
            _0x8a4c++;
            if (_0x8a4c < _0x9a45) {
                const _0x4b51 = _0x8a4c <= 2 ? _0x18db : _0x7c44;
                setTimeout(_0x6fc4, _0x4b51);
            }
            return;
        }

        _0x8a4c = 0;

        // Avoid adding duplicate buttons
        if (document[_0xb452[14]]('catalog-enhancement-node')) {
            return;
        }

        // Create button elements
        const _0x9df3 = _0xe6c7[_0xb452[2]]('button');
        _0x9df3[_0xb452[36]] = 'catalog-enhancement-node';
        _0x9df3[_0xb452[37]] = _0x4a97[_0xb452[37]];
        _0x9df3[_0xb452[35]] = 'button';
        _0x9df3[_0xb452[18]][_0xb452[34]] = '10px';

        const _0x7ae3 = _0xe6c7[_0xb452[2]]('span');
        _0x7ae3[_0xb452[37]] = 'pip-btn__inner';

        const _0x3f92 = _0xe6c7[_0xb452[3]]('http://www.w3.org/2000/svg', 'svg');
        _0xe6c7[_0xb452[4]](_0x3f92, 'focusable', 'false');
        _0xe6c7[_0xb452[4]](_0x3f92, 'viewBox', '0 0 24 24');
        _0xe6c7[_0xb452[4]](_0x3f92, 'width', '24');
        _0xe6c7[_0xb452[4]](_0x3f92, 'height', '24');
        _0x3f92[_0xb452[19]][_0xb452[33]]('pip-svg-icon', 'pip-btn__icon');
        _0xe6c7[_0xb452[4]](_0x3f92, 'aria-hidden', 'true');

        const _0x5c91 = _0xe6c7[_0xb452[3]]('http://www.w3.org/2000/svg', 'path');
        _0xe6c7[_0xb452[4]](_0x5c91, 'd', 'M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z');
        _0xe6c7[_0xb452[5]](_0x3f92, _0x5c91);

        const _0x2b40 = _0xe6c7[_0xb452[2]]('span');
        _0x2b40[_0xb452[37]] = 'pip-btn__label';
        _0x2b40[_0xb452[17]] = 'Download 3D';

        _0xe6c7[_0xb452[5]](_0x7ae3, _0x3f92);
        _0xe6c7[_0xb452[5]](_0x7ae3, _0x2b40);
        _0xe6c7[_0xb452[5]](_0x9df3, _0x7ae3);

        // Handle clicks
        _0xe6c7[_0xb452[7]](_0x9df3, 'click', function() {
            _0x23fe(_0x4a97);
        });

        _0x4a97[_0xb452[15]][_0xb452[6]](_0x9df3, _0x4a97[_0xb452[16]]);
    }

    // Handle download request
    function _0x23fe(_0x1e93) {
        let _0x4f73 = _0x9b27();

        if (_0x4f73) {
            _0x78c3(_0x4f73);
            return;
        }

        _0xe6c7[_0xb452[8]](_0x1e93);
        _0xc8b9();
    }

    // Try to find model repeatedly
    function _0xc8b9() {
        let _0xfa4c = 0;

        const _0x7b92 = setInterval(() => {
            _0xfa4c++;

            let _0xbe3f = _0x9b27() || _0xd67e();

            if (_0xbe3f) {
                clearInterval(_0x7b92);
                _0x78c3(_0xbe3f);
                return;
            }

            if (_0xfa4c >= _0x5e89) {
                clearInterval(_0x7b92);
                alert('Error downloading model. Please refresh your session and try again.');
            }
        }, _0x2c66);
    }

    // Look for model URLs in the page
    function _0x9b27() {
        const _0x9bd2 = _0xe6c7[_0xb452[0]](document, '#pip-xr-viewer-model');
        if (_0x9bd2) {
            try {
                const _0x7b24 = _0xe6c7[_0xb452[23]](_0x9bd2[_0xb452[17]]);
                if (_0x7b24 && _0x7b24.url && _0x3c28(_0x7b24.url)) {
                    return _0x7b24.url;
                }
            } catch(_0xf62a) {}
        }

        const _0x8e47 = _0xe6c7[_0xb452[1]](document, 'iframe');
        for (let _0x4c82 of _0x8e47) {
            try {
                if (_0x4c82[_0xb452[41]]) {
                    const _0x2e93 = _0x4c82[_0xb452[41]][_0xb452[1]]('model-viewer, a-entity[gltf-model]');
                    for (let _0x7db2 of _0x2e93) {
                        const _0x6a34 = _0x7db2[_0xb452[20]]('src') || _0x7db2[_0xb452[20]]('gltf-model');
                        if (_0x6a34 && _0x3c28(_0x6a34)) {
                            return _0x6a34;
                        }
                    }
                }
            } catch(_0x9832) {}
        }

        const _0xd378 = _0xe6c7[_0xb452[1]](document, '[data-model-url], [data-3d-url], [data-ar-url]');
        for (let _0x5c8f of _0xd378) {
            for (let _0xa43c of ['data-model-url', 'data-3d-url', 'data-ar-url']) {
                const _0x7a65 = _0x5c8f[_0xb452[20]](_0xa43c);
                if (_0x7a65 && _0x3c28(_0x7a65)) {
                    return _0x7a65;
                }
            }
        }

        return null;
    }

    // Check network resources
    function _0xd67e() {
        if (!window[_0xb452[38]] || !window[_0xb452[38]][_0xb452[39]]) {
            return null;
        }

        const _0x4d9f = window[_0xb452[38]][_0xb452[39]]();
        for (let _0x2a4f of _0x4d9f) {
            if (_0x2a4f[_0xb452[40]] && _0x3c28(_0x2a4f[_0xb452[40]])) {
                return _0x2a4f[_0xb452[40]];
            }
        }

        return null;
    }

    // Check if URL is a 3D model
    function _0x3c28(_0x8c4f) {
        return _0x8c4f && (
            _0xe6c7[_0xb452[22]](_0x8c4f, '.glb') ||
            _0xe6c7[_0xb452[21]](_0x8c4f, '.glb?') ||
            _0xe6c7[_0xb452[21]](_0x8c4f, '.glb#') ||
            _0xe6c7[_0xb452[22]](_0x8c4f, '.gltf') ||
            _0xe6c7[_0xb452[21]](_0x8c4f, '.gltf?') ||
            _0xe6c7[_0xb452[21]](_0x8c4f, '.gltf#')
        );
    }

    // Process the download
    function _0x78c3(_0x5c3f) {
        _0xe6c7[_0xb452[9]](_0x5c3f)
            [_0xb452[10]]((_0x2c8f) => _0x2c8f[_0xb452[11]]())
            [_0xb452[10]]((_0x3d8e) => {
                // Setup blob and link
                const _0x9f73 = new Blob([_0x3d8e], {type: _0xb452[42]});
                const _0x7c36 = _0xe6c7[_0xb452[2]]('a');
                _0x7c36[_0xb452[12]] = window[_0xb452[28]][_0xb452[29]](_0x9f73);

                // Get product name
                const _0x4c2a = _0xe6c7[_0xb452[0]](document, _0xb452[43]);
                let _0x7a9e = 'ikea_product';
                let _0xf93d = 'default';

                if (_0x4c2a) {
                    const _0x6d24 = _0x4c2a[_0xb452[17]][_0xb452[26]]();
                    const _0x8a3f = _0x6d24[_0xb452[27]](' - IKEA')[0][_0xb452[27]](',');
                    if (_0x8a3f[_0xb452[45]] > 1) {
                        _0x7a9e = _0x8a3f[0][_0xb452[26]]();
                        _0xf93d = _0x8a3f[1][_0xb452[26]]();
                    } else {
                        _0x7a9e = _0x8a3f[0][_0xb452[26]]();
                    }
                }

                // Get product ID
                let _0x5b9d = '';
                const _0x3f67 = _0x5c3f[_0xb452[24]](/\/(\d+)_/);
                if (_0x3f67 && _0x3f67[1]) {
                    _0x5b9d = _0x3f67[1];
                }

                // Create filename
                let _0x2f8c = _0x7a9e;
                if (_0xf93d !== 'default') {
                    _0x2f8c += ' - ' + _0xf93d;
                }
                if (_0x5b9d) {
                    _0x2f8c += ' (' + _0x5b9d + ')';
                }

                // Clean filename and download
                const _0x7b34 = _0x2f8c[_0xb452[25]](/[<>:"\/\\|?*]/g, '');
                _0x7c36[_0xb452[13]] = _0x7b34 + '.glb';

                document[_0xb452[30]][_0xb452[5]](_0x7c36);
                _0x7c36[_0xb452[8]]();
                document[_0xb452[30]][_0xb452[31]](_0x7c36);
            })
            .catch((_0x2d4f) => {
                alert('Error downloading model: ' + _0x2d4f[_0xb452[32]]);
            });
    }

    // Start script
    _0x6fc4();

    // Watch for page changes
    let _0x5c8a = location[_0xb452[12]];
    new MutationObserver(() => {
        const _0x3d9c = location[_0xb452[12]];
        if (_0x3d9c !== _0x5c8a) {
            _0x5c8a = _0x3d9c;
            _0x8a4c = 0;
            setTimeout(_0x6fc4, 1500);
        }
    })[_0xb452[44]](document, {subtree: true, childList: true});
})();
