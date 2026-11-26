(function () {
  var STORAGE_KEY = "huaxia.legal.lang";

  function detectInitialLang() {
    try {
      var params = new URLSearchParams(window.location.search);
      var queryLang = params.get("lang");
      if (queryLang === "zh-Hant" || queryLang === "tc" || queryLang === "hant") return "zh-Hant";
      if (queryLang === "zh-Hans" || queryLang === "sc" || queryLang === "hans") return "zh-Hans";
      var saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "zh-Hant" || saved === "zh-Hans") return saved;
    } catch (_) {}
    var nav = (navigator.language || "").toLowerCase();
    if (nav.indexOf("hant") !== -1 || nav === "zh-tw" || nav === "zh-hk" || nav === "zh-mo") {
      return "zh-Hant";
    }
    return "zh-Hans";
  }

  function applyLang(lang, persist) {
    var isHant = lang === "zh-Hant";
    document.documentElement.lang = isHant ? "zh-Hant" : "zh-CN";

    var titleEl = document.querySelector("meta[name='huaxia-title-hant']");
    var hansTitleEl = document.querySelector("meta[name='huaxia-title-hans']");
    if (isHant && titleEl) {
      document.title = titleEl.content;
    } else if (!isHant && hansTitleEl) {
      document.title = hansTitleEl.content;
    }

    var nodes = document.querySelectorAll("[data-hant]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (!el.hasAttribute("data-hans")) {
        el.setAttribute("data-hans", el.innerHTML);
      }
      el.innerHTML = isHant ? el.getAttribute("data-hant") : el.getAttribute("data-hans");
    }

    var buttons = document.querySelectorAll("[data-set-lang]");
    for (var j = 0; j < buttons.length; j++) {
      var btn = buttons[j];
      var active = btn.getAttribute("data-set-lang") === (isHant ? "zh-Hant" : "zh-Hans");
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    }

    var internalLinks = document.querySelectorAll("a[href$='.html'], a[href*='.html?']");
    for (var k = 0; k < internalLinks.length; k++) {
      var link = internalLinks[k];
      var raw = link.getAttribute("href").split("?")[0];
      link.setAttribute("href", isHant ? raw + "?lang=zh-Hant" : raw);
    }

    if (persist) {
      try {
        window.localStorage.setItem(STORAGE_KEY, isHant ? "zh-Hant" : "zh-Hans");
      } catch (_) {}
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyLang(detectInitialLang(), false);
    requestAnimationFrame(function () {
      document.documentElement.classList.add("lang-ready");
    });

    var buttons = document.querySelectorAll("[data-set-lang]");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", function (e) {
        var targetLang = e.currentTarget.getAttribute("data-set-lang");
        applyLang(targetLang, true);
      });
    }

    var copyBtn = document.getElementById("copy-email-btn");
    if (copyBtn && navigator.clipboard) {
      copyBtn.addEventListener("click", function () {
        var email = copyBtn.getAttribute("data-email") || "mingwentaiii@gmail.com";
        navigator.clipboard.writeText(email).then(function () {
          var isHant = document.documentElement.lang === "zh-Hant";
          var label = copyBtn.querySelector("[data-copy-label]") || copyBtn;
          var original = label.textContent;
          label.textContent = isHant ? "已複製信箱：" + email : "已复制邮箱：" + email;
          setTimeout(function () {
            label.textContent = original;
          }, 2200);
        });
      });
    }
  });
})();
