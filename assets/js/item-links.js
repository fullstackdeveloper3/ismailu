/**
 * item-links.js — Navigation injection for Ismail Baba menu items
 * Wires click events on existing menu-item articles to navigate to detail pages.
 */
(function () {
  'use strict';

  // Map section IDs to directory names where they differ
  var idToDir = {
    softDrinks: 'soft-drinks',
    bancake:    'pancakes',
    travel:     'trifle'
  };

  function slugify(text) {
    var map = {
      'ا':'a','ب':'b','ت':'t','ث':'th','ج':'j','ح':'h','خ':'kh',
      'د':'d','ذ':'dh','ر':'r','ز':'z','س':'s','ش':'sh','ص':'s',
      'ض':'d','ط':'t','ظ':'z','ع':'a','غ':'gh','ف':'f','ق':'q',
      'ك':'k','ل':'l','م':'m','ن':'n','ه':'h','و':'w','ي':'y',
      'ة':'a','ى':'a','أ':'a','إ':'a','آ':'a','ئ':'y','ؤ':'w',
      ' ':'-'
    };
    return text.trim()
      .split('')
      .map(function (c) { return map[c] !== undefined ? map[c] : c; })
      .join('')
      .replace(/[^a-z0-9\-]/g, '')
      .replace(/-+/g, '-')
      .toLowerCase();
  }

  function init() {
    var articles = document.querySelectorAll('article.menu-item');

    articles.forEach(function (article) {
      // Find parent section to get category id
      var section = article.closest('section');
      if (!section || !section.id) return;

      var categoryId = section.id;
      var dir = idToDir[categoryId] || categoryId;

      // Read item name from h3
      var h3 = article.querySelector('.item-info h3');
      if (!h3) return;

      var name = h3.innerText || h3.textContent;
      var slug = slugify(name);
      var url = 'menu/' + dir + '/' + slug + '.html';

      // Visual feedback
      article.style.cursor = 'pointer';
      article.style.transition = 'background 0.2s ease';

      // Hover effect
      article.addEventListener('mouseenter', function () {
        article.style.background = 'rgba(243,156,18,0.08)';
      });
      article.addEventListener('mouseleave', function () {
        article.style.background = '';
      });

      // Navigate on click
      article.addEventListener('click', function () {
        window.location.href = url;
      });
    });
  }

  // Wait for DOMContentLoaded + small delay to let the render engine finish
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(init, 100);
    });
  } else {
    setTimeout(init, 100);
  }
})();
