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
   Account auth state (mock, frontend-only for now).
   Once real sign-in (Google etc.) is wired up, call:
     BLEGAB_AUTH.signIn({ name: 'Jane Doe' })   // on successful login
     BLEGAB_AUTH.signOut()                      // on logout
   and the header will update itself everywhere automatically.
   ----------------------------- */
window.BLEGAB_AUTH = {
  getUser: function () {
    try {
      return JSON.parse(localStorage.getItem('blegab_user'));
    } catch (e) {
      return null;
    }
  },
  signIn: function (user) {
    localStorage.setItem('blegab_user', JSON.stringify(user));
    renderAccountState();
  },
  signOut: function () {
    localStorage.removeItem('blegab_user');
    renderAccountState();
  }
};



window.BLEGAB_CART = {
  getItems: function () {
    try { return JSON.parse(localStorage.getItem('blegab_cart')) || []; }
    catch (e) { return []; }
  },
  saveItems: function (items) {
    localStorage.setItem('blegab_cart', JSON.stringify(items));
    this.renderBadge();
    this.renderDrawer();
  },
  addItem: function (productId, qty) {
    var items = this.getItems();
    var existing = items.find(i => i.id === productId);
    if (existing) existing.qty += qty; // already ordered — just bump the qty, no duplicate row
    else items.push({ id: productId, qty: qty });
    this.saveItems(items);
  },
  setQty: function (productId, qty) {
    var items = this.getItems();
    var item = items.find(i => i.id === productId);
    if (!item) return;
    if (qty < 1) {
      items = items.filter(i => i.id !== productId);
    } else {
      item.qty = qty;
    }
    this.saveItems(items);
  },
  removeItem: function (productId) {
    var items = this.getItems().filter(i => i.id !== productId);
    this.saveItems(items);
  },
  getCount: function () {
    return this.getItems().reduce((sum, i) => sum + i.qty, 0);
  },
  renderBadge: function () {
    document.querySelectorAll('[data-cart-count]').forEach(el => {
      el.textContent = this.getCount();
    });
  },
  renderDrawer: function () {
    var body = document.querySelector('.cart-drawer__body');
    if (!body) return;

    var items = this.getItems();
    var products = window.BLEGAB_SHOP_PRODUCTS || [];

    if (items.length === 0) {
      body.innerHTML = '<p class="cart-drawer__empty">Your cart is empty</p>';
      return;
    }

body.innerHTML = items.map(function (item) {
      var product = products.find(function (p) { return p.id === item.id; });
      if (!product) return '';

      return '' +
        '<div class="cart-drawer__item">' +
        '<img src="' + product.image + '" alt="' + product.name + '" class="cart-drawer__item-image" />' +
          '<div class="cart-drawer__item-info">' +
            '<span class="cart-drawer__item-name">' + product.name + '</span>' +
            '<span class="cart-drawer__item-price">$' + Number(product.price).toFixed(2) + '</span>' +
            '<div class="cart-drawer__item-qty">' +
              '<button type="button" class="cart-drawer__qty-btn" data-cart-decrease="' + item.id + '" aria-label="Decrease quantity">&minus;</button>' +
              '<span class="cart-drawer__qty-value">' + item.qty + '</span>' +
              '<button type="button" class="cart-drawer__qty-btn" data-cart-increase="' + item.id + '" aria-label="Increase quantity">+</button>' +
                '<button type="button" class="cart-drawer__reset-btn" data-cart-reset="' + item.id + '" aria-label="Reset quantity">' +
                  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
                    '<path d="M21 12a9 9 0 1 1-3.4-7.02" stroke-linecap="round"/>' +
                    '<path d="M21 3v5h-5" stroke-linecap="round" stroke-linejoin="round"/>' +
                  '</svg>' +
                '</button>' +
            '</div>' +
          '</div>' +
'<div class="cart-drawer__item-actions">' +
  '<button type="button" class="cart-drawer__item-delete" data-cart-remove="' + item.id + '" aria-label="Remove item">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
      '<path d="M6 6l12 12M18 6L6 18" stroke-linecap="round"/>' +
    '</svg>' +
  '</button>' +
  '<button type="button" class="cart-drawer__item-add" data-cart-add="' + item.id + '" aria-label="Add one more">' +
    '<span class="cart-drawer__item-add-text">View</span>' +
    '<span class="btn-icon-wrap">' +
      '<svg class="btn-icon btn-icon--bag" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
        '<path d="M6 8h12l-1.2 11H7.2z" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M9 8V6a3 3 0 0 1 6 0v2" stroke-linecap="round"/>' +
      '</svg>' +
      '<svg class="btn-icon btn-icon--arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
        '<path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>' +
    '</span>' +
  '</button>' +
'</div>' +
        '</div>';
    }).join('');
  }
};

// Delegated clicks for qty +/- and remove — works even though items are added to the DOM after page load
document.addEventListener('click', function (event) {
  var decreaseBtn = event.target.closest('[data-cart-decrease]');
  var increaseBtn = event.target.closest('[data-cart-increase]');
  var removeBtn = event.target.closest('[data-cart-remove]');

  if (decreaseBtn) {
    var id = decreaseBtn.dataset.cartDecrease;
    var item = window.BLEGAB_CART.getItems().find(i => i.id === id);
    if (item) window.BLEGAB_CART.setQty(id, item.qty - 1);
  }

  if (increaseBtn) {
    var id2 = increaseBtn.dataset.cartIncrease;
    var item2 = window.BLEGAB_CART.getItems().find(i => i.id === id2);
    if (item2) window.BLEGAB_CART.setQty(id2, item2.qty + 1);
  }

  var resetBtn = event.target.closest('[data-cart-reset]');
  if (resetBtn) {
    window.BLEGAB_CART.setQty(resetBtn.dataset.cartReset, 1);
  }

  if (removeBtn) {
    window.BLEGAB_CART.removeItem(removeBtn.dataset.cartRemove);
  }
});

document.addEventListener('DOMContentLoaded', function () {
  window.BLEGAB_CART.renderBadge();
  window.BLEGAB_CART.renderDrawer();
});



function renderAccountState() {
  var user = window.BLEGAB_AUTH.getUser();
  var header = document.querySelector('.site-header');
  if (header) header.classList.toggle('is-signed-in', !!user);

  document.querySelectorAll('[data-account-guest]').forEach(function (el) {
    el.hidden = !!user;
  });
  document.querySelectorAll('[data-account-signed-in]').forEach(function (el) {
    el.hidden = !user;
  });
  document.querySelectorAll('[data-account-user]').forEach(function (el) {
    el.textContent = user ? 'Hi, ' + user.name : '';
  });
}

document.addEventListener('click', function (event) {
  if (event.target.closest('[data-account-signout]')) {
    window.BLEGAB_AUTH.signOut();
  }
});

document.addEventListener('DOMContentLoaded', renderAccountState);

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

  // ---- Swipe-to-close (touch devices only) ----
  var touchStartX = 0;
  var touchCurrentX = 0;
  var isDragging = false;
  var swipeThreshold = 80; // px — how far right they need to drag before it counts as "close"

  drawer.addEventListener('touchstart', function (event) {
    touchStartX = event.touches[0].clientX;
    touchCurrentX = touchStartX;
    isDragging = true;
    drawer.style.transition = 'none'; // follow the finger with no lag while dragging
  }, { passive: true });

  drawer.addEventListener('touchmove', function (event) {
    if (!isDragging) return;
    touchCurrentX = event.touches[0].clientX;
    var deltaX = touchCurrentX - touchStartX;
    if (deltaX > 0) { // only allow dragging rightward (toward closed)
      drawer.style.transform = 'translateX(' + deltaX + 'px)';
    }
  }, { passive: true });

  drawer.addEventListener('touchend', function () {
    if (!isDragging) return;
    isDragging = false;
    drawer.style.transition = ''; // hand control back to the CSS transition
    drawer.style.transform = '';  // let the .is-open class control position again

    var deltaX = touchCurrentX - touchStartX;
    if (deltaX > swipeThreshold) {
      closeDrawer();
    }
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