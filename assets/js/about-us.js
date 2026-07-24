document.addEventListener('DOMContentLoaded', function () {
  // ---- Hero cinematic sequence ----
  var hero = document.getElementById('aboutHero');
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (hero && !prefersReducedMotion) {
    if ('IntersectionObserver' in window) {
      var heroObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            hero.classList.add('about-hero--play');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });

      heroObserver.observe(hero);
    } else {
      hero.classList.add('about-hero--play');
    }
  } else if (hero) {
    hero.classList.add('about-hero--play');
  }

  // ---- Why Choose feature cards ----
  var whyChoose = document.getElementById('whyChoose');

  if (whyChoose) {
    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
      var whyObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            whyChoose.classList.add('why-choose--play');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });

      whyObserver.observe(whyChoose);
    } else {
      whyChoose.classList.add('why-choose--play');
    }
  }

  // ---- Story image slider ----
  var slider = document.getElementById('storySlider');

  if (slider) {
    var slides = slider.querySelectorAll('.story__slide');
    var dots = slider.querySelectorAll('.story__dot');
    var currentIndex = 0;
    var sliderInterval;

    var goToSlide = function (index) {
      slides[currentIndex].classList.remove('is-active');
      dots[currentIndex].classList.remove('is-active');
      currentIndex = index;
      slides[currentIndex].classList.add('is-active');
      dots[currentIndex].classList.add('is-active');
    };

    var nextSlide = function () {
      var nextIndex = (currentIndex + 1) % slides.length;
      goToSlide(nextIndex);
    };

    var startAutoplay = function () {
      clearInterval(sliderInterval);
      sliderInterval = setInterval(nextSlide, 2000);
    };

    if (slides.length > 1 && !prefersReducedMotion) {
      startAutoplay();
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        goToSlide(index);
        if (!prefersReducedMotion) {
          startAutoplay();
        }
      });
    });
  }

  // ---- Testimonial arrows ----
  var row = document.getElementById('testimonialRow');
  var prevBtn = document.getElementById('testimonialPrev');
  var nextBtn = document.getElementById('testimonialNext');
  if (row && prevBtn && nextBtn) {
    var cards = row.querySelectorAll('.testimonial-card');

    var cardStep = function () {
      var style = getComputedStyle(row);
      var gap = parseInt(style.columnGap || style.gap || 0, 10) || 0;
      return cards[0].offsetWidth + gap;
    };

    var currentCardIndex = function () {
      return Math.round(row.scrollLeft / cardStep());
    };

    var scrollToCard = function (index) {
      row.scrollTo({ left: index * cardStep(), behavior: 'smooth' });
    };

    nextBtn.addEventListener('click', function () {
      var maxIndex = cards.length - 1;
      var index = currentCardIndex();
      scrollToCard(index >= maxIndex ? 0 : index + 1);
    });

    prevBtn.addEventListener('click', function () {
      var maxIndex = cards.length - 1;
      var index = currentCardIndex();
      scrollToCard(index <= 0 ? maxIndex : index - 1);
    });
  }

  // ---- See Our Process button ----
  var processBtn = document.querySelector('.btn-outline--light');
  if (processBtn) {
    processBtn.addEventListener('click', function (e) {
      e.preventDefault();
      var firstImg = document.querySelector('.craft__img');
      if (firstImg) firstImg.click();
    });
  }

  // ---- Craft Process Lightbox ----
  initCraftLightbox();
});

// ---- Parallax ----
var heroBgImg = document.querySelector('.about-hero__bg-img');
var hero = document.getElementById('aboutHero');
var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (heroBgImg && hero && !prefersReducedMotion) {
  var updateParallax = function () {
    var rect = hero.getBoundingClientRect();
    var progress = 1 - (rect.bottom / (rect.height + window.innerHeight));
    var offset = progress * 60;
    heroBgImg.style.transform = 'translateY(' + offset + 'px)';
  };
  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();
}

// ---- Craft Lightbox Function ----
function initCraftLightbox() {
  var lightbox = document.querySelector('[data-craft-lightbox]');
  var lightboxImage = document.querySelector('[data-craft-lightbox-image]');
  var counter = document.querySelector('[data-craft-counter]');
  var closeBtn = document.querySelector('[data-craft-lightbox-close]');
  var prevBtn = document.querySelector('[data-craft-prev]');
  var nextBtn = document.querySelector('[data-craft-next]');
  
  if (!lightbox || !lightboxImage) return;

  var craftImages = document.querySelectorAll('.craft__img');
  var images = [];
  var currentIndex = 0;
  var autoplayInterval;
  var isDragging = false;
  var dragStartY = 0;
  var dragCurrentY = 0;
  var dragStartX = 0;
  var dragCurrentX = 0;
  var gestureDirection = null;

  craftImages.forEach(function (img) {
    images.push({
      src: img.src,
      alt: img.alt
    });
  });

  function openLightbox(index) {
    currentIndex = index;
    updateImage();
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    startAutoplay();
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.style.transform = '';
    document.body.style.overflow = '';
    stopAutoplay();
  }

  function updateImage() {
    lightboxImage.src = images[currentIndex].src;
    lightboxImage.alt = images[currentIndex].alt;
    counter.textContent = (currentIndex + 1) + ' / ' + images.length;
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    updateImage();
    resetAutoplay();
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateImage();
    resetAutoplay();
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(nextImage, 3000);
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  // Open on craft image click
  craftImages.forEach(function (img, index) {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function () {
      openLightbox(index);
    });
  });

  // Close button
  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  // Click outside image to close
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  // Arrows
  if (prevBtn) {
    prevBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      prevImage();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      nextImage();
    });
  }

  // Keyboard
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });

  // ---- Swipe horizontal to change image, swipe down to close ----
  lightbox.addEventListener('touchstart', function (e) {
    dragStartX = e.touches[0].clientX;
    dragStartY = e.touches[0].clientY;
    dragCurrentX = dragStartX;
    dragCurrentY = dragStartY;
    isDragging = true;
    gestureDirection = null;
    stopAutoplay();
    lightboxImage.style.transition = 'none';
  }, { passive: true });

  lightbox.addEventListener('touchmove', function (e) {
    if (!isDragging) return;

    dragCurrentX = e.touches[0].clientX;
    dragCurrentY = e.touches[0].clientY;
    var deltaX = dragCurrentX - dragStartX;
    var deltaY = dragCurrentY - dragStartY;

    if (gestureDirection === null) {
      if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
        gestureDirection = Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical';
      }
    }

    if (gestureDirection === 'horizontal') {
      lightboxImage.style.transform = 'translateX(' + deltaX + 'px)';
    }

    if (gestureDirection === 'vertical' && deltaY > 0) {
      lightbox.style.transform = 'translateY(' + deltaY + 'px)';
      lightbox.style.opacity = 1 - (deltaY / window.innerHeight);
    }
  }, { passive: true });

  lightbox.addEventListener('touchend', function () {
    if (!isDragging) return;
    isDragging = false;

    var deltaX = dragCurrentX - dragStartX;
    var deltaY = dragCurrentY - dragStartY;

    lightboxImage.style.transition = 'transform 0.3s ease';
    lightboxImage.style.transform = '';

    if (gestureDirection === 'horizontal') {
      if (Math.abs(deltaX) > 80) {
        if (deltaX > 0) prevImage();
        else nextImage();
      }
    }

    if (gestureDirection === 'vertical') {
      lightbox.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      lightbox.style.transform = '';
      lightbox.style.opacity = '';

      if (deltaY > 120) {
        closeLightbox();
      }
    }

    gestureDirection = null;
    if (lightbox.classList.contains('is-open')) {
      startAutoplay();
    }
  });
}