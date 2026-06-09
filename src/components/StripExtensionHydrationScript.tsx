import Script from "next/script";

/**
 * Removes attributes injected by browser extensions (e.g. McAfee WebAdvisor's
 * fdprocessedid) before and during React hydration.
 */
const STRIP_SCRIPT = `
(function () {
  var ATTRS = ["fdprocessedid"];
  function strip() {
    ATTRS.forEach(function (name) {
      document.querySelectorAll("[" + name + "]").forEach(function (el) {
        el.removeAttribute(name);
      });
    });
  }
  strip();
  if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", strip, { once: true });
  }
  if (typeof MutationObserver === "undefined") return;
  var obs = new MutationObserver(function () {
    strip();
  });
  var root = document.documentElement;
  if (!root) return;
  obs.observe(root, { subtree: true, attributes: true, attributeFilter: ATTRS });
  var disconnect = function () {
    obs.disconnect();
  };
  window.addEventListener("load", strip, { once: true });
  setTimeout(disconnect, 15000);
})();
`.trim();

export default function StripExtensionHydrationScript() {
  return (
    <Script
      id="strip-extension-hydration-attrs"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: STRIP_SCRIPT }}
    />
  );
}
