/**
 * Copyright 2022 Hacknock
 *
 * Licensed under the Apache License, Version 2.0(the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const enableGA = () => {
  const sc = document.createElement("script");
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
