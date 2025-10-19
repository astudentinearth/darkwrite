addEventListener(
  "scroll",
  () => {
    document.documentElement.style.setProperty(
      "--scroll-y",
      `${window.scrollY}`,
    );
    if (window.scrollY > 150) {
      document.documentElement.classList.add("scrolled");
    } else {
      document.documentElement.classList.remove("scrolled");
    }
  },
  { passive: true },
);

document.documentElement.style.setProperty("--scroll-y", `${window.scrollY}`);
