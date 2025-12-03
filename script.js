function toggleDarkMode() {
  const isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");

  const btn = document.querySelector('button[onclick="toggleDarkMode()"]');
  if (btn) btn.textContent = isDark ? "Light Mode ☀️" : "Dark Mode 🌙";
}

window.addEventListener("DOMContentLoaded", () => {
  const darkModeSetting = localStorage.getItem("darkMode");
  if (darkModeSetting === "enabled") {
    document.body.classList.add("dark-mode");
    const btn = document.querySelector('button[onclick="toggleDarkMode()"]');
    if (btn) btn.textContent = "Light Mode ☀️";
  }

  // Animation observer
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  });
  document.querySelectorAll(".hidden").forEach(el => observer.observe(el));

  // Contact form
  const form = document.getElementById("contactForm");
  const button = form.querySelector("button[type='submit']");

  // Enable/disable send button
  form.addEventListener("input", () => {
    button.disabled = !form.checkValidity();
  });

  // Handle submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    button.disabled = true;
    button.textContent = "Sending...";

    const formData = new FormData(form);
    const params = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      params.append(key, value);
    }

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbzXTFCA1LYjIEjBkFI51J86KKwpM49N_n3-X6mDcXaBqBfLuSqheorl9igCkVkC9N_r/exec", 
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params.toString(),
        }
      );

      const rawText = await response.text();
      console.log("Server response:", rawText);

      let result;
      try {
        result = JSON.parse(rawText);
      } catch {
        throw new Error("Unexpected response format — check console log.");
      }

      if (result.result === "success") {
        Swal.fire("✅ Success", "Message sent successfully!", "success");
        form.reset();
      } else {
        throw new Error(result.message || "Server rejected the submission.");
      }
    } catch (err) {
      console.error("Form submission error:", err);
      Swal.fire("❌ Oops", "Something went wrong — please try again.", "error");
    } finally {
      button.disabled = false;
      button.textContent = "Send";
    }
  });
});
