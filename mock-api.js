/**
 * In-browser stand-in for the widget API.
 *
 * GET  /widget/{publicKey}?url=&region=
 * POST /widget/{publicKey}/responses
 *
 * Records live in localStorage so the team can change the key, title,
 * and timing, then reload the widget. Replace MelqartMockApi.request
 * with fetch(apiBase + path) when the real API is ready.
 * The region query simulates IP geolocation. A real API ignores it and
 * uses the request IP.
 */
(function () {
  var STORAGE_KEY = "melqart-mock-widgets";
  var RESPONSE_KEY = "melqart-mock-responses";

  var SEEDS = {
    "branch-demo": {
      surveyId: "mock-branch-feedback",
      title: { en: "Branch visit feedback", ar: "تقييم زيارة الفرع" },
      description: {
        en: "Tell us about your last visit. It takes about a minute.",
        ar: "أخبرنا عن زيارتك الأخيرة. يستغرق ذلك حوالي دقيقة.",
      },
      thankYou: { en: "Thank you", ar: "شكراً لك" },
      thankYouBody: {
        en: "We received your answers.",
        ar: "وصلتنا إجاباتك.",
      },
      button: {
        label: { en: "Feedback", ar: "ملاحظات" },
        background: "#0A3D78",
        color: "#ffffff",
      },
      rules: {
        urls: { include: [], exclude: [] },
        regions: ["SA", "AE", "JO"],
        frequency: {
          showAgainAfterMinutes: 0,
          hideAfterDismissMinutes: 0,
          hideAfterCompleteMinutes: 0,
        },
        trigger: { type: "button", name: "transaction", delaySeconds: 0 },
      },
    },
    "checkout-demo": {
      surveyId: "mock-checkout-feedback",
      title: { en: "How was your order?", ar: "كيف كان طلبك؟" },
      description: {
        en: "This survey opens after a transaction.",
        ar: "يفتح هذا الاستبيان بعد إتمام العملية.",
      },
      thankYou: { en: "Thank you", ar: "شكراً لك" },
      thankYouBody: {
        en: "We received your answers.",
        ar: "وصلتنا إجاباتك.",
      },
      button: {
        label: { en: "Rate order", ar: "قيّم الطلب" },
        background: "#1f4d3a",
        color: "#ffffff",
      },
      rules: {
        urls: { include: ["/index.html", "/checkout"], exclude: ["/admin"] },
        regions: ["SA", "AE"],
        frequency: {
          showAgainAfterMinutes: 1,
          hideAfterDismissMinutes: 1,
          hideAfterCompleteMinutes: 5,
        },
        trigger: { type: "event", name: "transaction", delaySeconds: 0 },
      },
    },
  };

  function readMap(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || "{}");
    } catch (error) {
      return {};
    }
  }

  function writeMap(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function widgets() {
    var saved = readMap(STORAGE_KEY);
    var names = Object.keys(SEEDS);
    for (var i = 0; i < names.length; i += 1) {
      if (!saved[names[i]]) saved[names[i]] = SEEDS[names[i]];
    }
    return saved;
  }

  function queryFrom(path) {
    var query = {};
    var qIndex = path.indexOf("?");
    if (qIndex === -1) return { pathname: path, query: query };
    var pathname = path.slice(0, qIndex);
    path
      .slice(qIndex + 1)
      .split("&")
      .forEach(function (pair) {
        if (!pair) return;
        var bits = pair.split("=");
        query[decodeURIComponent(bits[0])] = decodeURIComponent(bits.slice(1).join("=") || "");
      });
    return { pathname: pathname, query: query };
  }

  function getWidget(key, query) {
    var record = widgets()[key];
    if (!record) {
      return { ok: false, status: 404, data: { show: false, reason: "unknown-key", publicKey: key } };
    }
    var regions = (record.rules && record.rules.regions) || [];
    var region = query.region || "";
    if (regions.length && !region) {
      return {
        ok: true,
        status: 200,
        data: { show: false, reason: "region-missing", publicKey: key, region: "" },
      };
    }
    if (regions.length && regions.indexOf(region) === -1) {
      return {
        ok: true,
        status: 200,
        data: { show: false, reason: "region", publicKey: key, region: region },
      };
    }
    return {
      ok: true,
      status: 200,
      data: Object.assign({ show: true, publicKey: key }, record),
    };
  }

  function saveResponse(key, body) {
    var all = widgets();
    if (!all[key]) {
      return { ok: false, status: 404, data: { message: "Unknown widget key" } };
    }
    var list = [];
    try {
      list = JSON.parse(localStorage.getItem(RESPONSE_KEY) || "[]");
    } catch (error) {
      list = [];
    }
    var saved = Object.assign({}, body, {
      id: "resp_" + Date.now(),
      publicKey: key,
      savedAt: new Date().toISOString(),
    });
    list.unshift(saved);
    localStorage.setItem(RESPONSE_KEY, JSON.stringify(list.slice(0, 20)));
    return { ok: true, status: 201, data: { id: saved.id } };
  }

  function request(spec) {
    var method = String((spec && spec.method) || "GET").toUpperCase();
    var parsed = queryFrom((spec && spec.path) || "");
    var match = parsed.pathname.match(/^\/widget\/([^/]+)(\/responses)?$/);
    if (!match) {
      return Promise.resolve({ ok: false, status: 404, data: { show: false, reason: "unknown-path" } });
    }
    var key = decodeURIComponent(match[1]);
    if (match[2]) {
      if (method !== "POST") return Promise.resolve({ ok: false, status: 405, data: {} });
      return Promise.resolve(saveResponse(key, spec.body || {}));
    }
    if (method !== "GET") return Promise.resolve({ ok: false, status: 405, data: {} });
    return Promise.resolve(getWidget(key, parsed.query));
  }

  window.MelqartMockApi = {
    request: request,
    list: function () {
      return widgets();
    },
    get: function (key) {
      return widgets()[key] || null;
    },
    save: function (key, record) {
      var all = widgets();
      all[key] = record;
      writeMap(STORAGE_KEY, all);
      return all[key];
    },
    resetSeeds: function () {
      var all = widgets();
      Object.keys(SEEDS).forEach(function (key) {
        all[key] = SEEDS[key];
      });
      writeMap(STORAGE_KEY, all);
    },
    responses: function () {
      try {
        return JSON.parse(localStorage.getItem(RESPONSE_KEY) || "[]");
      } catch (error) {
        return [];
      }
    },
  };
})();
