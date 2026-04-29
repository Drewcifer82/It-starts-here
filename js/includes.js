/**
 * Client-side includes loader for Unique Rides Transportation.
 *
 * Usage: add data-include="/components/header.html" (or footer.html) to any
 * element — it will be replaced in-place with the fetched HTML fragment.
 *
 * After all includes resolve, the active nav link is highlighted based on
 * the current pathname.
 */
(function () {
  'use strict';

  /* ---- nav helpers — must be global so onclick="…" attributes work ---- */
  window.toggleMenu = function () {
    document.getElementById('mobileNav').classList.toggle('open');
  };
  window.closeMobile = function () {
    document.getElementById('mobileNav').classList.remove('open');
  };

  /* ---- highlight the current page in the desktop + mobile navs ---- */
  function setActiveNav() {
    var path = window.location.pathname.replace(/\/+$/, '') || '/';
    document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(function (a) {
      var href = (a.getAttribute('href') || '').split('#')[0].replace(/\/+$/, '') || '/';
      if (href && href !== '/' && (path === href || path.startsWith(href + '/'))) {
        a.classList.add('active');
      }
    });
  }

  /* ---- fetch one include and replace the placeholder element ---- */
  function loadInclude(el) {
    var url = el.getAttribute('data-include');
    return fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to load include: ' + url + ' (' + res.status + ')');
        return res.text();
      })
      .then(function (html) {
        var tmp = document.createElement('div');
        tmp.innerHTML = html;
        /* replaceWith accepts multiple nodes */
        el.replaceWith.apply(el, Array.from(tmp.childNodes));
      })
      .catch(function (err) {
        console.error(err);
      });
  }

  /* ---- load all includes, then activate the nav ---- */
  function loadAll() {
    var els = Array.from(document.querySelectorAll('[data-include]'));
    if (!els.length) return;
    Promise.all(els.map(loadInclude)).then(setActiveNav);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAll);
  } else {
    loadAll();
  }
})();
