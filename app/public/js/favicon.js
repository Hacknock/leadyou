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
