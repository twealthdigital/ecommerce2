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
      // Fallback for browsers without IntersectionObserver support
      hero.classList.add('about-hero--play');
    }
  } else if (hero) {
    // Reduced motion: CSS already shows the final state instantly
    hero.classList.add('about-hero--play');
  }

  // ---- Why Choose feature cards: staggered reveal + ambient animation ----
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

// ---- Testimonial arrows (loops back to start/end) ----
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
});