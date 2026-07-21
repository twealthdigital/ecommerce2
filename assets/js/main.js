/* =========================================================
   BLEGAB LUXURY WIGS — MAIN JS (general/shared, loads on every page)
   Header interactions: nav, search, account menu, cart.
   Runs directly on page load — the header lives right in the
   page's HTML, no fetching or injecting.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {
  initMobileNav();
  initNavDropdowns();
  initAnnouncementBar();
  initMobileSearch();
  initSearch();
  initAccountMenu();
  initCartDrawer();
  initHeaderScroll();
});

/* -----------------------------
   Mobile navigation drawer
   ----------------------------- */
function initMobileNav() {
  var menuToggle = document.querySelector('[data-menu-toggle]');
  var primaryNav = document.querySelector('[data-primary-nav]');
  var navOverlay = document.querySelector('[data-nav-overlay]');
  var navClose = document.querySelector('[data-nav-close]');

  if (!menuToggle || !primaryNav || !navOverlay) return;

  function openNav() {
    primaryNav.classList.add('is-open');
    navOverlay.classList.add('is-visible');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    primaryNav.classList.remove('is-open');
    navOverlay.classList.remove('is-visible');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', function () {
    var isOpen = primaryNav.classList.contains('is-open');
    isOpen ? closeNav() : openNav();
  });

  navOverlay.addEventListener('click', closeNav);
  if (navClose) navClose.addEventListener('click', closeNav);

  // Close the drawer automatically if the viewport grows into desktop size
window.addEventListener('resize', function () {
  if (window.innerWidth >= 1024) {
    closeNav();
    document.querySelectorAll('.nav-item.has-dropdown.is-open').forEach(function (item) {
      item.classList.remove('is-open');
    });
  }
});
}

/* -----------------------------
   Nav dropdowns (SHOP / COLLECTIONS / LACE WIGS)
   - Accordion behaviour on mobile/tablet (click to expand)
   - Hover/focus behaviour on desktop is handled purely in CSS
   ----------------------------- */
function initNavDropdowns() {
  var dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');

  dropdownItems.forEach(function (item) {
    var trigger = item.querySelector('.nav-link');

    trigger.addEventListener('click', function (event) {
      if (window.innerWidth >= 1024) return; // desktop uses hover, let the link behave normally

      event.preventDefault();
      var isOpen = item.classList.contains('is-open');

      dropdownItems.forEach(function (other) {
        other.classList.remove('is-open');
      });

      if (!isOpen) item.classList.add('is-open');
    });
  });
}

/* -----------------------------
   Announcement bar dismiss
   ----------------------------- */
function initAnnouncementBar() {
  var bar = document.querySelector('[data-announcement-bar]');
  var closeBtn = document.querySelector('[data-announcement-close]');

  if (!bar || !closeBtn) return;

  closeBtn.addEventListener('click', function () {
    bar.style.display = 'none';
    document.body.classList.add('announcement-dismissed');
  });
}

/* -----------------------------
   Mobile search
   ----------------------------- */
function initMobileSearch() {
  var wrapper = document.querySelector('[data-search-expand]');
  var toggle = document.querySelector('[data-search-toggle]');
  var form = document.getElementById('mobile-search-form');
  var input = document.getElementById('mobile-search-input');
  if (!wrapper || !toggle || !form) return;

  toggle.addEventListener('click', function () {
    var isOpen = wrapper.classList.contains('is-open');

    if (!isOpen) {
      wrapper.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      if (input) input.focus();
      return;
    }

    form.requestSubmit(); // hands off to the shared search logic below
  });

  document.addEventListener('click', function (event) {
    if (wrapper.classList.contains('is-open') && !wrapper.contains(event.target)) {
      wrapper.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

function initSearch() {
  setupSearchWidget(
    document.getElementById('desktop-search-input'),
    document.getElementById('desktop-search-form'),
    document.querySelectorAll('[data-search-results]')[0]
  );

  setupSearchWidget(
    document.getElementById('mobile-search-input'),
    document.getElementById('mobile-search-form'),
    document.querySelectorAll('[data-search-results]')[1]
  );
}

function setupSearchWidget(input, form, resultsBox) {
  if (!input || !form || !resultsBox) return;

  input.addEventListener('input', function () {
    renderSearchResults(input.value, resultsBox);
  });

  input.addEventListener('focus', function () {
    if (input.value.trim() !== '') renderSearchResults(input.value, resultsBox);
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var query = input.value.trim();
    if (query === '') return; // nothing typed — do nothing, as requested

    // Always hand off to the shop page — it reads ?search= from the URL
    // and filters itself, so there's only ever one shop page to maintain.
    window.location.href = 'shop.html?search=' + encodeURIComponent(query);
  });

  document.addEventListener('click', function (event) {
    if (!form.contains(event.target) && !resultsBox.contains(event.target)) {
      resultsBox.hidden = true;
    }
  });
}

function findProductMatches(query) {
  var normalized = query.trim().toLowerCase();
  if (normalized === '' || !window.BLEGAB_PRODUCTS) return [];

  return window.BLEGAB_PRODUCTS.filter(function (product) {
    return product.name.toLowerCase().indexOf(normalized) !== -1;
  });
}

function renderSearchResults(query, resultsBox) {
  var trimmed = query.trim();

  if (trimmed === '') {
    resultsBox.hidden = true;
    resultsBox.innerHTML = '';
    return;
  }

  var matches = findProductMatches(trimmed);
  resultsBox.innerHTML = '';

  if (matches.length === 0) {
    var empty = document.createElement('p');
    empty.className = 'search-results__empty';
    empty.textContent = 'No match found for "' + trimmed + '"';
    resultsBox.appendChild(empty);
  } else {
    matches.forEach(function (product) {
      var link = document.createElement('a');
      link.href = product.url;
      link.className = 'search-results__item';
      link.textContent = product.name;
      resultsBox.appendChild(link);
    });
  }

  resultsBox.hidden = false;
}

function initDesktopDropdowns() {
  var dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');
  var closeTimer;

  dropdownItems.forEach(function (item) {
    item.addEventListener('mouseenter', function () {
      if (window.innerWidth < 1024) return; // desktop/tablet-hover only
      clearTimeout(closeTimer);
      item.classList.add('is-open');
    });

    item.addEventListener('mouseleave', function () {
      if (window.innerWidth < 1024) return;
      closeTimer = setTimeout(function () {
        item.classList.remove('is-open');
      }, 300); // grace period to cross the gap into the dropdown
    });
  });
}


function initAccountMenu() {
  var wrapper = document.querySelector('[data-account-menu]');
  var toggle = document.querySelector('[data-account-toggle]');
  var dropdown = document.querySelector('[data-account-dropdown]');
  if (!wrapper || !toggle || !dropdown) return;

  toggle.addEventListener('click', function (event) {
    event.stopPropagation();
    var isOpen = dropdown.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', isOpen);
  });

  document.addEventListener('click', function (event) {
    if (!wrapper.contains(event.target)) {
      dropdown.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      dropdown.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

function initCartDrawer() {
  var toggle = document.querySelector('[data-cart-toggle]');
  var drawer = document.querySelector('[data-cart-drawer]');
  var overlay = document.querySelector('[data-cart-overlay]');
  var closeBtn = document.querySelector('[data-cart-close]');
  if (!toggle || !drawer || !overlay) return;

  function openDrawer() {
    drawer.classList.add('is-open');
    overlay.classList.add('is-visible');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    overlay.classList.remove('is-visible');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', function () {
    var isOpen = drawer.classList.contains('is-open');
    isOpen ? closeDrawer() : openDrawer();
  });

  overlay.addEventListener('click', closeDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeDrawer();
  });
}


/* -----------------------------
   Header background — transparent at top, solid on scroll
   ----------------------------- */
function initHeaderScroll() {
  var header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }, { passive: true });
}