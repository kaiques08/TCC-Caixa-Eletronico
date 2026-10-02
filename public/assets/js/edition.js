(function () {
  var edition = "community";
  var offline = new URLSearchParams(window.location.search).get("offline") === "1";
  window.FINUP_EDITION = edition;
  window.FINUP_LITE = window.location.protocol === "file:" || offline;
  document.documentElement.dataset.edition = edition;
  document.documentElement.dataset.ui = "simple";
  document.documentElement.dataset.performance = "lite";
})();
