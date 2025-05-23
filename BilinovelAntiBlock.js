// ==UserScript==
// @name         BilinovelAntiBlock
// @name:zh      Bilinovel 反广告屏蔽
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  抑制 Bilinovel 检测到广告屏蔽插件后隐藏内容
// @author       SuniRein
// @match        https://www.bilinovel.com/*
// @grant        none
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilinovel.com
// @license      GPLv3
// ==/UserScript==

// 灵感来源: https://greasyfork.org/zh-CN/scripts/533617-bilinovel

(function () {
    'use strict';

    const checkElementInterval = 100;
    const maxWaitTime = 15000;
    let timeWaited = 0;

    let targetId = 'acontent';
    let headerClass = 'atitle';

    const currentUrl = window.location.href;
    if (currentUrl.endsWith('catalog')) {
        targetId = 'volumes';
        headerClass = 'module-header';
    }

    console.log('Bilinovel: 开始轮询获取目标元素...');

    const display_account = (element) => {
        try {
            // 显示文本
            element.style.setProperty('display', 'block', 'important');
            element.classList.remove('adv-box');
            console.log('Bilinovel: 显示目标元素');

            // 移除广告框
            if (element.previousElementSibling && !element.previousElementSibling.classList.contains(headerClass)) {
                element.previousElementSibling.style.setProperty('display', 'none', 'important');
                console.log('Bilinovel: 隐藏广告框');
            }
        } catch (e) {
            console.error('Bilinovel: 修改目标元素时出错:', e);
        }
    };

    const intervalId = setInterval(() => {
        const element = document.getElementById(targetId);
        timeWaited += checkElementInterval;

        if (element) {
            console.log('Bilinovel: 找到目标元素');
            clearInterval(intervalId);

            // 监测目标元素样式改变
            const observer = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        display_account(element);
                    }
                }
            });
            observer.observe(element, {
                attributes: true,
                attributeFilter: ['style'],
            });

            // 监测广告横幅
            const headerElement = document.body.firstChild;
            if (headerElement) {
                const headerObserver = new MutationObserver((mutationsList) => {
                    for (const mutation of mutationsList) {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                            headerElement.style.setProperty('display', 'none', 'important');
                            console.log('Bilinovel: 隐藏广告横幅');
                        }
                    }
                });
                headerObserver.observe(headerElement, {
                    attributes: true,
                    attributeFilter: ['style'],
                });
            }
        } else if (timeWaited >= maxWaitTime) {
            console.warn('Bilinovel: 获取目标元素超时 (' + maxWaitTime + 'ms)，停止检查。');
            clearInterval(intervalId);
        }
    }, checkElementInterval);
})();
