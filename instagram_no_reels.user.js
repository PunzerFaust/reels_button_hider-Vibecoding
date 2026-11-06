// ==UserScript==
// @name         Instagram: hide Reels
// @description  No Reels button (no flash), Reels tab redirects to main feed
// @version      0.0.7
// @match        *://*.instagram.com/*
// @grant        none
// @inject-into  content
// @run-at       document-start
// ==/UserScript==

(function () {
	'use strict';

	var HOME = 'https://www.instagram.com/';
	var MAX_WAIT_MS = 2000;  // максимум ждать перед показом страницы

	// 0. Страница скрыта, пока не применится скрытие Reels
	var COVER_CLASS = '__ig_wait';
	var revealed = false;

	var style = document.createElement('style');
	style.textContent =
		'a[href="/reels/"], a[href="/reels"] { display: none !important; }' +
		'html.' + COVER_CLASS + ' { opacity: 0 !important; }';
	(document.head || document.documentElement).appendChild(style);
	document.documentElement.classList.add(COVER_CLASS);

	function reveal() {
		if (revealed) return;
		revealed = true;
		document.documentElement.classList.remove(COVER_CLASS);
	}

	// запасной таймер: страница точно откроется
	setTimeout(reveal, MAX_WAIT_MS);

	// 1. Скрытие кнопки через JS
	function hide() {
		var found = document.querySelectorAll('a[href="/reels/"], a[href="/reels"]');
		found.forEach(function (a) {
			a.style.setProperty('display', 'none', 'important');
		});
		if (!revealed &&
			(found.length || document.querySelector('a[href^="/direct/"], a[href^="/explore"]'))) {
			requestAnimationFrame(reveal);
		}
	}

	// 2. Редирект с вкладки Reels на главную
	function redirectTab() {
		if (/^\/reels\/?$/.test(location.pathname)) {
			location.replace(HOME);
		}
	}

	function run() {
		hide();
		redirectTab();
	}

	run();
	new MutationObserver(run).observe(document.documentElement, {
		childList: true,
		subtree: true
	});
	setInterval(redirectTab, 300);
})();