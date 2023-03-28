// ==UserScript==
// @name         Better reading
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http*://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    var userConfigs = [{
        match: /(.*\.)?github\..*/,
        selector: '[class*="container-"]',
        style: {
            maxWidth: 'none',
        },
    }, {
        match: /www\.zhihu\.com/,
        children: [{
            selector: '.Topstory-container,.Question-main,.QuestionHeader-content',
            style: {
                maxWidth: '100%',
                width: '100%',
                padding: '0',
            }
        },{
            selector: '.Topstory-mainColumn,.Question-mainColumn,.QuestionHeader-main',
            style: {
                flex: 1,
            }
        }]
    }];

    var log = function (...args) {
        console.info('[BETTER READING]', ...args);
    }
    var preprocess = function (configs) {
        return configs.flatMap(config => {
            if (config.children && Array.isArray(config.children)) {
                return config.children.map(child => ({
                    ...child,
                    match: config.match,
                }));
            }
            return config;
        });
    }
    var configs = preprocess(userConfigs);
    log('loaded');
    var handleDocumentChange = function () {
        log('handleDocumentChange');
        configs.forEach(function (config) {
            if (config.match && !config.match.test(location.href)) {
                log('config not match', config.match, '->', location.href);
                return;
            }
            var elList = document.querySelectorAll(config.selector);
            log('config applying', config, '->', elList);
            elList.forEach(function (el) {
                Object.entries(config.style || {}).forEach(function ([k, v]) {
                    el.style[k] = v;
                });
            });
        });
    };
    handleDocumentChange();
    var observer = new MutationObserver(() => {
        handleDocumentChange();
    });
    observer.observe(document, {
        subtree: true,
        childList: true,
        attributes: true,
    });
})();