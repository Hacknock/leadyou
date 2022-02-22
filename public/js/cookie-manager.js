const enableGA = () => {
  let sc = document.createElement("script");
  sc.async = true;
  sc.setAttribute(
    "src",
    "https://www.googletagmanager.com/gtag/js?id=UA-117292044-2"
  );
  document.getElementsByTagName("head")[0].appendChild(sc);
  document.cookie = "cookie=true";
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "UA-117292044-2");
};

const enableFont = () => {
  const link = document.createElement("link");
  link.setAttribute(
    "href",
    "https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap"
  );
  link.setAttribute("rel", "stylesheet");
  document.getElementsByTagName("head")[0].appendChild(link);
  document.cookie = "font=true";
};
