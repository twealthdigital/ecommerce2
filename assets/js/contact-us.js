document.addEventListener("DOMContentLoaded", () => {
  initFaqAccordion();
  initContactForm();
  initBackToTop();
});

function initFaqAccordion() {
  const toggles = document.querySelectorAll("[data-faq-toggle]");
  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const item = toggle.closest(".faq-item");
      const isOpen = item.classList.contains("is-open");

      document.querySelectorAll(".faq-item").forEach((i) => i.classList.remove("is-open"));
      if (!isOpen) item.classList.add("is-open");
    });
  });
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const errorEl = form.querySelector("[data-contact-error]");
  const successEl = form.querySelector("[data-contact-success]");
  const submitBtn = form.querySelector("[data-contact-submit]");
  const spinner = form.querySelector("[data-contact-spinner]");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    errorEl.classList.remove("is-visible");
    successEl.classList.remove("is-visible");

    const firstName = document.getElementById("contact-first-name").value.trim();
    const email = document.getElementById("contact-email").value.trim();
    const subject = document.getElementById("contact-subject").value.trim();
    const message = document.getElementById("contact-message").value.trim();

    if (!firstName || !email || !subject || !message) {
      errorEl.textContent = "Please fill in all required fields.";
      errorEl.classList.add("is-visible");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      errorEl.textContent = "Please enter a valid email address.";
      errorEl.classList.add("is-visible");
      return;
    }

    // simulate send — replace with real endpoint call
    submitBtn.disabled = true;
    spinner.hidden = false;

    setTimeout(() => {
      spinner.hidden = true;
      submitBtn.disabled = false;
      successEl.textContent = "Message sent! Our team will get back to you within 24 hours.";
      successEl.classList.add("is-visible");
      form.reset();
    }, 1200);
  });
}

function initBackToTop() {
  const btn = document.querySelector("[data-back-to-top]");
  if (!btn) return;
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}


