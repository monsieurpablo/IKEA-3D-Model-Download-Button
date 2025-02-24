// ==UserScript==
// @name         IKEA 3D Model Downloader
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adds a download button for 3D models on IKEA product pages
// @match        https://*.ikea.com/*/p/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let attemptCount = 0;
    const MAX_ATTEMPTS = 7; // 2 short delays + 5 long delays
    const SHORT_RETRY_INTERVAL = 1000; // 1 second
    const LONG_RETRY_INTERVAL = 3000; // 3 seconds

    // Variable to store captured GLB URL from network requests
    let capturedGlbUrl = null;
    let isMonitoringNetwork = false;
    let isDownloadInProgress = false;

    // Intercept fetch requests to capture GLB URLs
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
        const url = typeof input === 'string' ? input : input.url;

        if (isMonitoringNetwork && url && url.includes('/glb/') && url.endsWith('.glb')) {
            console.log('GLB URL captured from network:', url);
            capturedGlbUrl = url;

            // If download is in progress, trigger it now
            if (isDownloadInProgress) {
                downloadGLBFromUrl(capturedGlbUrl);
                isDownloadInProgress = false;
            }
        }

        return originalFetch.apply(this, arguments);
    };

    // Also intercept XMLHttpRequest to capture GLB URLs
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
        if (isMonitoringNetwork && url && url.includes('/glb/') && url.endsWith('.glb')) {
            console.log('GLB URL captured from XHR:', url);
            capturedGlbUrl = url;

            // If download is in progress, trigger it now
            if (isDownloadInProgress) {
                downloadGLBFromUrl(capturedGlbUrl);
                isDownloadInProgress = false;
            }
        }

        return originalXhrOpen.apply(this, [method, url, ...args]);
    };

    function addDownloadButton() {
        const viewIn3dButton = document.querySelector('button[aria-label*="3D"]');
        if (!viewIn3dButton) {
            attemptCount++;
            if (attemptCount < MAX_ATTEMPTS) {
                const delay = attemptCount <= 2 ? SHORT_RETRY_INTERVAL : LONG_RETRY_INTERVAL;
                console.log(`Attempt ${attemptCount}: 3D button not found. Retrying in ${delay/1000} seconds...`);
                setTimeout(addDownloadButton, delay);
            } else {
                console.log("Max attempts reached. 3D button not found.");
            }
            return;
        }

        // Reset attempt count if button is found
        attemptCount = 0;

        if (document.getElementById('ikea-3d-download-button')) {
            console.log("Download button already exists.");
            return;
        }

        const downloadButton = document.createElement('button');
        downloadButton.id = 'ikea-3d-download-button';
        downloadButton.className = viewIn3dButton.className;
        downloadButton.type = 'button';
        downloadButton.style.marginLeft = '10px';

        const innerSpan = document.createElement('span');
        innerSpan.className = 'pip-btn__inner';

        const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        iconSvg.setAttribute('focusable', 'false');
        iconSvg.setAttribute('viewBox', '0 0 24 24');
        iconSvg.setAttribute('width', '24');
        iconSvg.setAttribute('height', '24');
        iconSvg.classList.add('pip-svg-icon', 'pip-btn__icon');
        iconSvg.setAttribute('aria-hidden', 'true');

        const iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        iconPath.setAttribute('d', 'M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z');
        iconSvg.appendChild(iconPath);

        const labelSpan = document.createElement('span');
        labelSpan.className = 'pip-btn__label';
        labelSpan.textContent = 'Download 3D';

        innerSpan.appendChild(iconSvg);
        innerSpan.appendChild(labelSpan);
        downloadButton.appendChild(innerSpan);

        downloadButton.addEventListener('click', downloadGLB);

        viewIn3dButton.parentNode.insertBefore(downloadButton, viewIn3dButton.nextSibling);
        console.log("Download button added successfully.");
    }

    function downloadGLB() {
        // Try the original method first
        const scriptElement = document.querySelector('#pip-xr-viewer-model');
        if (scriptElement) {
            try {
                const data = JSON.parse(scriptElement.textContent);
                const glbUrl = data.url;

                if (glbUrl) {
                    console.log('GLB URL found in script element:', glbUrl);
                    downloadGLBFromUrl(glbUrl);
                    return;
                }
            } catch (error) {
                console.error('Error parsing 3D model data:', error);
            }
        }

        // If original method failed, try the network capture method
        console.log('GLB URL not found in script element. Trying network capture method...');

        // Check if we already captured a GLB URL
        if (capturedGlbUrl) {
            console.log('Using previously captured GLB URL:', capturedGlbUrl);
            downloadGLBFromUrl(capturedGlbUrl);
            return;
        }

        // Start monitoring network and click the View in 3D button
        isMonitoringNetwork = true;
        isDownloadInProgress = true;

        // Find and click the View in 3D button
        const viewIn3dButton = document.querySelector('button[aria-label*="3D"]');
        if (viewIn3dButton) {
            console.log('Clicking View in 3D button...');
            viewIn3dButton.click();

            // Set a timeout to check if we captured the URL
            setTimeout(() => {
                if (isDownloadInProgress) {
                    if (capturedGlbUrl) {
                        console.log('GLB URL captured after timeout:', capturedGlbUrl);
                        downloadGLBFromUrl(capturedGlbUrl);
                    } else {
                        console.error('Failed to capture GLB URL from network requests');
                        alert('Failed to find 3D model. Please try again or check console for errors.');
                    }
                    isDownloadInProgress = false;
                }
            }, 5000); // Wait 5 seconds for the request to be captured
        } else {
            console.error('View in 3D button not found');
            isDownloadInProgress = false;
        }
    }

    function downloadGLBFromUrl(glbUrl) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', glbUrl, true);
        xhr.responseType = 'blob';
        xhr.onload = function() {
            if (this.status === 200) {
                const file = new Blob([xhr.response], { type: 'application/octet-stream' });
                const a = document.createElement('a');
                a.href = window.URL.createObjectURL(file);

                // Get product name and color
                const titleElement = document.querySelector('title');
                let name = 'ikea_product';
                let color = 'default';

                if (titleElement) {
                    const fullTitle = titleElement.textContent.trim();
                    const nameParts = fullTitle.split(' - IKEA')[0].split(',');
                    if (nameParts.length > 1) {
                        name = nameParts[0].trim();
                        color = nameParts[1].trim();
                    } else {
                        name = nameParts[0].trim();
                    }
                }

                // Try to extract product ID from URL
                let productId = '';
                const urlMatch = glbUrl.match(/\/(\d+)_/);
                if (urlMatch && urlMatch[1]) {
                    productId = urlMatch[1];
                }

                // Remove invalid characters from filename
                let fileName = name;
                if (color !== 'default') {
                    fileName += ' - ' + color;
                }
                if (productId) {
                    fileName += ' (' + productId + ')';
                }

                const cleanName = fileName.replace(/[<>:"/\\|?*]/g, '');
                a.download = cleanName + '.glb';

                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        };
        xhr.send();
    }

    // Reset monitoring state when 3D viewer is closed
    function checkFor3DViewerClose() {
        const observer = new MutationObserver(() => {
            // Check if 3D viewer modal was closed (implementation depends on IKEA's UI)
            const viewerOpen = document.querySelector('.some-3d-viewer-class') !== null;
            if (!viewerOpen && isMonitoringNetwork) {
                isMonitoringNetwork = false;
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Initial attempt to add the download button
    addDownloadButton();
    checkFor3DViewerClose();

    // Also run the script when the URL changes (for single-page applications)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            attemptCount = 0; // Reset attempt count on URL change
            capturedGlbUrl = null; // Reset captured URL on URL change
            addDownloadButton();
        }
    }).observe(document, { subtree: true, childList: true });
})();
