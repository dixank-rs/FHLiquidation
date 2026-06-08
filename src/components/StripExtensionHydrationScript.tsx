import Script from "next/script";

/**
 * Removes attributes injected by browser extensions (e.g. McAfee WebAdvisor's
 * fdprocessedid) before React hydrates, avoiding spurious hydration warnings in dev.
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
  if (typeof MutationObserver === "undefined") return;
  var obs = new MutationObserver(function (records) {
    records.forEach(function (record) {
      if (record.type === "attributes" && ATTRS.indexOf(record.attributeName) >= 0) {
        record.target.removeAttribute(record.attributeName);
      }
    });
  });
  var root = document.documentElement;
  if (!root) return;
  obs.observe(root, { subtree: true, attributes: true, attributeFilter: ATTRS });
  window.addEventListener("load", function () { obs.disconnect(); }, { once: true });
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
