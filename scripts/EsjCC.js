// ==UserScript==
// @name         Esjzone Chinese Convert
// @name:zh      Esjzone 简繁互译
// @namespace    https://github.com/SuniRein/scripts
// @version      1.0.0
// @description  适用于 EsjZone 的简繁互译脚本
// @author       SuniRein
// @match        https://www.esjzone.one/*
// @match        https://www.esjzone.cc/*
// @grant        none
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/opencc-js@1.0.5/dist/umd/full.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=esjzone.one
// @license      GPL3
// @supportURL   https://github.com/SuniRein/scripts/blob/main/CHANGELOG.md
// ==/UserScript==

/* global OpenCC */

(function () {
    'use strict';

    let targetType = 's';

    const logger = {
        log: (message) => console.log(`[EsjCC] ${message}`),
        info: (message) => console.info(`[EsjCC] ${message}`),
        warn: (message) => console.warn(`[EsjCC] ${message}`),
        error: (message) => console.error(`[EsjCC] ${message}`),
    };

    function processNode(node, converter) {
        const walk = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
        let textNode;
        while ((textNode = walk.nextNode())) {
            const original = textNode.textContent;
            const converted = converter(original);
            if (converted !== original) {
                textNode.textContent = converted;
            }
        }
    }

    function startTranslate() {
        if (targetType === 'none') return logger.info('Translation disabled by user preference.');

        const fromConfig = targetType === 's' ? 'tw' : 'cn';
        const toConfig = targetType === 's' ? 'cn' : 'tw';

        try {
            const converter = OpenCC.Converter({ from: fromConfig, to: toConfig });

            logger.info(`Converting to ${targetType === 's' ? 'Simplified' : 'Traditional'}...`);

            document.title = converter(document.title);

            const contentArea = document.querySelector('section.container');
            processNode(contentArea, converter);

            logger.info('Translation finished.');
        } catch (e) {
            logger.warn('OpenCC initialization failed: ' + e);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startTranslate);
    } else {
        startTranslate();
    }
})();
