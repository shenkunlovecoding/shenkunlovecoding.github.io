(function () {
  function slugify(text, index) {
    var slug = text.trim().toLowerCase()
      .replace(/<[^>]*>/g, '')
      .replace(/[^\w\u00C0-\uFFFF\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    return slug || 'section-' + index;
  }

  function uniqueId(base, used) {
    var id = base;
    var suffix = 2;
    while (used[id] || document.getElementById(id)) {
      id = base + '-' + suffix;
      suffix += 1;
    }
    used[id] = true;
    return id;
  }

  function initToc() {
    var article = document.querySelector('.article.has-toc');
    var entry = article && article.querySelector('.article-entry');
    var toc = article && article.querySelector('.article-toc');
    var list = toc && toc.querySelector('.article-toc-list');
    if (!entry || !toc || !list) return;

    var headings = Array.prototype.slice.call(entry.querySelectorAll('h1, h2, h3, h4'));
    if (!headings.length) {
      toc.parentNode.removeChild(toc);
      return;
    }

    var used = {};
    headings.forEach(function (heading, index) {
      if (!heading.id) heading.id = uniqueId(slugify(heading.textContent, index + 1), used);

      var link = document.createElement('a');
      link.className = 'article-toc-link level-' + heading.tagName.slice(1);
      link.href = '#' + heading.id;
      link.textContent = heading.textContent.trim();
      link.addEventListener('click', function (event) {
        event.preventDefault();
        heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (history.pushState) history.pushState(null, '', '#' + heading.id);
      });
      list.appendChild(link);
    });

    if ('IntersectionObserver' in window) {
      var links = Array.prototype.slice.call(list.querySelectorAll('.article-toc-link'));
      var byId = links.reduce(function (acc, link) {
        acc[decodeURIComponent(link.hash.slice(1))] = link;
        return acc;
      }, {});

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (link) { link.classList.remove('is-active'); });
          if (byId[entry.target.id]) byId[entry.target.id].classList.add('is-active');
        });
      }, { rootMargin: '-15% 0px -75% 0px', threshold: 0 });

      headings.forEach(function (heading) { observer.observe(heading); });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initToc);
  } else {
    initToc();
  }
})();
