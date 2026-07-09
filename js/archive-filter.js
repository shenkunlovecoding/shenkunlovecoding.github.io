(function () {
  function splitValues(value) {
    return (value || '').split('|').filter(Boolean);
  }

  function initArchiveFilter() {
    var filters = Array.prototype.slice.call(document.querySelectorAll('.archive-filter'));
    var posts = Array.prototype.slice.call(document.querySelectorAll('.archive-article-link'));
    var years = Array.prototype.slice.call(document.querySelectorAll('.year-line'));
    if (!filters.length || !posts.length) return;

    function updateYears() {
      years.forEach(function (yearLine) {
        var year = yearLine.querySelector('.year-num');
        if (!year) return;
        var hasVisiblePost = posts.some(function (post) {
          return post.dataset.year === year.textContent.trim() && post.style.display !== 'none';
        });
        yearLine.style.display = hasVisiblePost ? '' : 'none';
      });
    }

    function applyFilter(type, value) {
      posts.forEach(function (post) {
        var matched = true;
        if (type === 'category') matched = splitValues(post.dataset.categories).indexOf(value) !== -1;
        if (type === 'tag') matched = splitValues(post.dataset.tags).indexOf(value) !== -1;
        post.style.display = matched ? '' : 'none';
      });
      updateYears();
    }

    filters.forEach(function (filter) {
      filter.addEventListener('click', function () {
        filters.forEach(function (item) { item.classList.remove('is-active'); });
        filter.classList.add('is-active');
        applyFilter(filter.dataset.filterType, filter.dataset.filterValue);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initArchiveFilter);
  } else {
    initArchiveFilter();
  }
})();
