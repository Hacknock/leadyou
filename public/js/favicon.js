const favicon = document.getElementById("favicon");

// setup favicon
(function () {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    favicon.setAttribute("href", "/src/images/favicon-white.ico");
  }
  window.matchMedia("(prefers-color-scheme: dark)").addListener((e) => {
    favicon.setAttribute(
      "href",
      `/src/images/favicon-${e.matches ? "white" : "black"}.ico`
    );
  });
})();
