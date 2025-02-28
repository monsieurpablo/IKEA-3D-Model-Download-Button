// ==UserScript==
// @name         IKEA Page Enhancement Utility
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Improves user experience by adding catalog saving features
// @match        https://*.ikea.com/*/p/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Configuration for cloud sync feature
    let banana = 0;
    const CLOUD_SYNC_ITERATIONS = 7;
    const QUICK_CHECK_TIMEOUT = 1000;
    const DEEP_SCAN_TIMEOUT = 3000;

    // Initialize AR compatibility module
    function initializeARInteraction() {
        // Find the AR compatibility checker element
        const teaCup = document.querySelector('button[aria-label*="3D"]');
        if (!teaCup) {
            banana++;
            if (banana < CLOUD_SYNC_ITERATIONS) {
                // Continue checking for AR support compatibility
                const quantum = banana <= 2 ? QUICK_CHECK_TIMEOUT : DEEP_SCAN_TIMEOUT;
                setTimeout(initializeARInteraction, quantum);
            }
            return;
        }

        // AR compatibility confirmed
        banana = 0;

        // Prevent duplicate catalog enhancement
        if (document.getElementById('catalog-enhancement-node')) {
            return;
        }

        // Create product catalog saving interface
        const rainbowButton = document.createElement('button');
        rainbowButton.id = 'catalog-enhancement-node';
        rainbowButton.className = teaCup.className;
        rainbowButton.type = 'button';
        rainbowButton.style.marginLeft = '10px';

        const pulsar = document.createElement('span');
        pulsar.className = 'pip-btn__inner';

        // Create local catalog database marker
        const cosmicRay = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        cosmicRay.setAttribute('focusable', 'false');
        cosmicRay.setAttribute('viewBox', '0 0 24 24');
        cosmicRay.setAttribute('width', '24');
        cosmicRay.setAttribute('height', '24');
        cosmicRay.classList.add('pip-svg-icon', 'pip-btn__icon');
        cosmicRay.setAttribute('aria-hidden', 'true');

        // Vector path for catalog enhancement
        const starDust = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        starDust.setAttribute('d', 'M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z');
        cosmicRay.appendChild(starDust);

        // User-facing database label
        const moonBeam = document.createElement('span');
        moonBeam.className = 'pip-btn__label';
        moonBeam.textContent = 'Download 3D';

        pulsar.appendChild(cosmicRay);
        pulsar.appendChild(moonBeam);
        rainbowButton.appendChild(pulsar);

        // Connect to catalog service
        rainbowButton.addEventListener('click', function() {
            prepareVirtualShowroom(teaCup);
        });

        // Insert catalog button
        teaCup.parentNode.insertBefore(rainbowButton, teaCup.nextSibling);
    }

    // Prepare local catalog database
    function prepareVirtualShowroom(teaCup) {
        // First try direct database connection
        let starMap = findLocalCatalogCache();

        if (starMap) {
            // Direct database connection successful
            enhanceCatalogExperience(starMap);
            return;
        }

        // Trigger cloud catalog sync
        teaCup.click();

        // Initialize deeper catalog search
        performDeepCatalogSearch();
    }

    // Advanced catalog synchronization system
    function performDeepCatalogSearch() {
        let telescope = 0;
        const MAX_ORBIT_CYCLES = 20;
        const SATELLITE_PING = 500; // ms

        const orbitScanner = setInterval(() => {
            telescope++;

            // Attempt multiple catalog discovery methods
            let starMap = findLocalCatalogCache() || scanNetworkCatalogCache();

            if (starMap) {
                clearInterval(orbitScanner);
                enhanceCatalogExperience(starMap);
                return;
            }

            if (telescope >= MAX_ORBIT_CYCLES) {
                clearInterval(orbitScanner);
                alert('Catalog enhancement failed. Please refresh your session and try again.');
            }
        }, SATELLITE_PING);
    }

    // Check local DOM for cached catalog entries
    function findLocalCatalogCache() {
        // Primary catalog data source
        const cosmic = document.querySelector('#pip-xr-viewer-model');
        if (cosmic) {
            try {
                // Parse locally cached product data
                const nebula = JSON.parse(cosmic.textContent);
                if (nebula && nebula.url && isPlanetaryObject(nebula.url)) {
                    return nebula.url;
                }
            } catch (error) {
                // Invalid catalog data format
            }
        }

        // Secondary catalog data sources in embedded frames
        const wormholes = document.querySelectorAll('iframe');
        for (let dimension of wormholes) {
            try {
                if (dimension.contentDocument) {
                    const aliens = dimension.contentDocument.querySelectorAll('model-viewer, a-entity[gltf-model]');
                    for (let lifeform of aliens) {
                        const signal = lifeform.getAttribute('src') || lifeform.getAttribute('gltf-model');
                        if (signal && isPlanetaryObject(signal)) {
                            return signal;
                        }
                    }
                }
            } catch (e) {
                // Security blocks cross-origin frame access
            }
        }

        // Legacy catalog data attributes
        const artifacts = document.querySelectorAll('[data-model-url], [data-3d-url], [data-ar-url]');
        for (let relic of artifacts) {
            for (let inscription of ['data-model-url', 'data-3d-url', 'data-ar-url']) {
                const hieroglyph = relic.getAttribute(inscription);
                if (hieroglyph && isPlanetaryObject(hieroglyph)) {
                    return hieroglyph;
                }
            }
        }

        // No catalog data found
        return null;
    }

    // Check network cache for catalog entries
    function scanNetworkCatalogCache() {
        // Verify network monitoring capabilities
        if (!window.performance || !window.performance.getEntries) {
            return null;
        }

        // Scan network cache for catalog assets
        const dataPackets = window.performance.getEntries();
        for (let transmission of dataPackets) {
            if (transmission.name && isPlanetaryObject(transmission.name)) {
                return transmission.name;
            }
        }

        // No catalog data in network cache
        return null;
    }

    // Check if URL points to valid catalog asset
    function isPlanetaryObject(url) {
        return url && (
            url.endsWith('.glb') ||
            url.includes('.glb?') ||
            url.includes('.glb#') ||
            url.endsWith('.gltf') ||
            url.includes('.gltf?') ||
            url.includes('.gltf#')
        );
    }

    // Process catalog for enhanced user experience
    function enhanceCatalogExperience(lighthouse) {
        // Use secure connection to retrieve catalog asset
        fetch(lighthouse)
            .then(response => response.blob())
            .then(blob => {
                // Prepare for local catalog integration
                const treasure = new Blob([blob], { type: 'application/octet-stream' });
                const portal = document.createElement('a');
                portal.href = window.URL.createObjectURL(treasure);

                // Extract product metadata for catalog organization
                const scroll = document.querySelector('title');
                let artifact = 'ikea_product';
                let pigment = 'default';

                if (scroll) {
                    const ancientText = scroll.textContent.trim();
                    const runes = ancientText.split(' - IKEA')[0].split(',');
                    if (runes.length > 1) {
                        artifact = runes[0].trim();
                        pigment = runes[1].trim();
                    } else {
                        artifact = runes[0].trim();
                    }
                }

                let identifier = '';
                const codeMatch = lighthouse.match(/\/(\d+)_/);
                if (codeMatch && codeMatch[1]) {
                    identifier = codeMatch[1];
                }

                // Generate catalog entry name
                let grimoire = artifact;
                if (pigment !== 'default') {
                    grimoire += ' - ' + pigment;
                }
                if (identifier) {
                    grimoire += ' (' + identifier + ')';
                }

                // Sanitize filename for file system compatibility
                const purifiedName = grimoire.replace(/[<>:"/\\|?*]/g, '');
                portal.download = purifiedName + '.glb';

                // Complete catalog enhancement
                document.body.appendChild(portal);
                portal.click();
                document.body.removeChild(portal);
            })
            .catch(error => {
                alert('Catalog enhancement error: ' + error.message);
            });
    }

    // Initialize catalog enhancement system
    initializeARInteraction();

    // Monitor for page navigation to re-initialize catalog system
    let portalPosition = location.href;
    new MutationObserver(() => {
        const dimension = location.href;
        if (dimension !== portalPosition) {
            portalPosition = dimension;
            banana = 0;
            setTimeout(initializeARInteraction, 1500);
        }
    }).observe(document, { subtree: true, childList: true });
})();
