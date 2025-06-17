(function () {
  "use strict";

  // --- Configuration ---
  const CONFIG = {
    endpoint: "https://analytics.artemislabs.in/api/track",
    sessionDurationMs: 30 * 60 * 1000, // 30 minutes
    throttleDelayMs: 5000,
    debounceDelayMs: 500,
    scrollDepthMarkers: [25, 50, 75, 90],
    debugMode: false,
    requireConsent: false,
  };

  // --- Global Variables ---
  const win = window;
  const doc = win.document;
  const loc = win.location;
  const nav = win.navigator;
  const scriptElement = doc.currentScript;

  const dataDomain = scriptElement.getAttribute("data-domain");
  let consentGiven = !CONFIG.requireConsent;

  const queryString = loc.search;
  const params = new URLSearchParams(queryString);
  const utmParams = {
    source: params.get("utm_source"),
    medium: params.get("utm_medium"),
    campaign: params.get("utm_campaign"),
    term: params.get("utm_term"),
    content: params.get("utm_content"),
  };

  let scrollDepthTracked = {};
  let lastActivityTimestamp = Date.now();

  // --- Utility Functions ---

  function logDebug(...args) {
    if (CONFIG.debugMode) {
      console.log("[YourTracking]", ...args);
    }
  }

  function throttle(func, limit) {
    let lastCall = 0;
    let timeoutId;
    return function (...args) {
      const now = Date.now();
      if (now - lastCall < limit) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          lastCall = now;
          func.apply(this, args);
        }, limit - (now - lastCall));
      } else {
        lastCall = now;
        func.apply(this, args);
      }
    };
  }

  function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  function safeParseURL(urlStr) {
    try {
      return new URL(urlStr);
    } catch (e) {
      logDebug("Invalid URL:", urlStr, e);
      return null;
    }
  }

  // --- Visitor & Session Management ---

  function getVisitorId() {
    let visitorId = localStorage.getItem("visitor_id");
    if (!visitorId) {
      visitorId = "visitor-" + Math.random().toString(36).substr(2, 16);
      localStorage.setItem("visitor_id", visitorId);
      logDebug("New visitor ID:", visitorId);
    }
    return visitorId;
  }

  function generateSessionId() {
    return "session-" + Math.random().toString(36).substr(2, 9);
  }

  function initializeSession() {
    let sessionId = sessionStorage.getItem("session_id");
    let expirationTimestamp = parseInt(
      sessionStorage.getItem("session_expiration_timestamp")
    );
    let isNewSession = false;

    const now = Date.now();

    if (
      !sessionId ||
      isNaN(expirationTimestamp) ||
      now >= expirationTimestamp
    ) {
      sessionId = generateSessionId();
      expirationTimestamp = now + CONFIG.sessionDurationMs;
      isNewSession = true;
      logDebug("New session initialized:", sessionId);
    } else {
      logDebug("Existing session detected:", sessionId);
    }

    expirationTimestamp = now + CONFIG.sessionDurationMs;
    sessionStorage.setItem("session_id", sessionId);
    sessionStorage.setItem(
      "session_expiration_timestamp",
      expirationTimestamp.toString()
    );
    localStorage.setItem("last_activity_timestamp", now.toString());

    if (isNewSession) {
      trackSessionStart(sessionId);
    }

    return {
      sessionId: sessionId,
      expirationTimestamp: expirationTimestamp,
      isNewSession: isNewSession,
    };
  }

  function resetActivityTimer() {
    initializeSession();
    lastActivityTimestamp = Date.now();
    localStorage.setItem(
      "last_activity_timestamp",
      lastActivityTimestamp.toString()
    );
    logDebug("Activity detected, session extended.");
  }

  ["mousedown", "keydown", "touchstart", "scroll", "mousemove"].forEach(
    function (evt) {
      doc.addEventListener(
        evt,
        throttle(resetActivityTimer, CONFIG.throttleDelayMs),
        {
          passive: true,
        }
      );
    }
  );

  // --- Event Sending Logic ---

  function buildPayload(eventName, eventData) {
    const session = initializeSession();
    const visitorId = getVisitorId();
    let referrerSource = "direct";
    const referrerUrlObj = safeParseURL(doc.referrer);

    if (doc.referrer && referrerUrlObj) {
      referrerSource = referrerUrlObj.hostname;
    }

    const payload = {
      event: eventName,
      timestamp: new Date().toISOString(),
      metadata: {
        url: loc.href,
        path: loc.pathname,
        domain: dataDomain,
        referrer: doc.referrer,
        referrer_source: referrerSource,
        title: doc.title,
        utm: utmParams,
        visitor_id: visitorId,
        session_id: session.sessionId,
        screen: {
          width: win.innerWidth,
          height: win.innerHeight,
          pixel_ratio: win.devicePixelRatio || 1,
        },
        document: {
          width: doc.documentElement.scrollWidth,
          height: doc.documentElement.scrollHeight,
        },
        language: nav.language,
        user_agent: nav.userAgent,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      data: eventData || {},
    };

    logDebug("Built Payload:", payload);
    return payload;
  }

  function sendRequest(payload, options) {
    const request = new XMLHttpRequest();
    request.open("POST", CONFIG.endpoint, true);
    request.setRequestHeader("Content-Type", "application/json");
    request.withCredentials = true;

    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        logDebug("XHR Sent. Status:", request.status, payload.event);
        options?.callback?.(request.status, request.responseText);
      }
    };
    request.onerror = function () {
      logDebug("XHR Error:", payload.event);
      options?.callback?.(0, "XHR Error");
    };
    try {
      request.send(JSON.stringify(payload));
    } catch (e) {
      logDebug("Failed to send XHR:", e);
    }
  }

  function trigger(eventName, eventData = {}, options = {}) {
    if (!consentGiven) {
      logDebug(`Consent not given. Event '${eventName}' not tracked.`);
      return;
    }

    const payload = buildPayload(eventName, eventData);

    if (nav.sendBeacon && !options.forceXHR) {
      try {
        const success = nav.sendBeacon(
          CONFIG.endpoint,
          JSON.stringify(payload)
        );
        if (success) {
          logDebug("Beacon Sent:", payload.event);
          options.callback?.(true);
        } else {
          logDebug("Beacon failed, falling back to XHR:", payload.event);
          sendRequest(payload, options);
        }
      } catch (e) {
        logDebug("Beacon API error, falling back to XHR:", e);
        sendRequest(payload, options);
      }
    } else {
      sendRequest(payload, options);
    }
  }

  // --- Public API & Event Tracking Functions ---

  const queue = (win.your_tracking && win.your_tracking.q) || [];

  win.your_tracking = function (eventName, eventData, options) {
    if (typeof eventName === "string") {
      trigger(eventName, eventData, options);
    } else {
      logDebug("Invalid eventName provided to your_tracking function.");
    }
  };

  win.your_tracking.consent = function (status) {
    consentGiven = !!status;
    if (consentGiven) {
      logDebug("Consent given. Initializing tracking.");
      initialize();
      for (const args of queue) {
        if (typeof args[0] === "string") {
          trigger.apply(null, args);
        }
      }
      queue.length = 0;
    } else {
      logDebug("Consent revoked. Stopping tracking.");
      sessionStorage.removeItem("session_id");
      sessionStorage.removeItem("session_expiration_timestamp");
      localStorage.removeItem("visitor_id");
      localStorage.removeItem("last_activity_timestamp");
    }
  };

  win.your_tracking.pageview = function (customData = {}) {
    trigger("pageview", { ...customData, page_path: loc.pathname });
  };

  win.your_tracking.event = function (
    category,
    action,
    label,
    value,
    customData = {}
  ) {
    trigger("custom_event", {
      category,
      action,
      label,
      value,
      ...customData,
    });
  };

  win.your_tracking.timing = function (
    category,
    variable,
    time,
    label,
    customData = {}
  ) {
    trigger("timing", {
      category,
      variable,
      time,
      label,
      ...customData,
    });
  };

  win.your_tracking.set = function (key, value) {
    logDebug("Set custom data (currently only logged):", key, value);
  };

  // --- Core Tracking Initializers ---

  function trackPageView() {
    win.your_tracking.pageview();
  }

  function trackSessionStart(sessionId) {
    const referrerInfo = doc.referrer
      ? {
          url: doc.referrer,
          domain: safeParseURL(doc.referrer)?.hostname || "unknown",
        }
      : null;

    trigger("session_start", {
      landing_page: loc.href,
      referrer: referrerInfo,
      session_id: sessionId,
      entry_point: "page_load",
    });
  }

  function trackSessionEnd() {
    const storedSessionId = sessionStorage.getItem("session_id");
    const storedLastActivity = parseInt(
      localStorage.getItem("last_activity_timestamp")
    );

    if (storedSessionId && !isNaN(storedLastActivity)) {
      const duration = Date.now() - storedLastActivity;
      trigger(
        "session_end",
        {
          session_id: storedSessionId,
          duration_ms: duration,
          exit_page: loc.href,
        },
        { forceXHR: true }
      );
      sessionStorage.removeItem("session_id");
      sessionStorage.removeItem("session_expiration_timestamp");
    }
  }

  // --- Advanced Tracking Modules ---

  // 1. Performance Tracking
  function trackPerformance() {
    if (!("PerformanceObserver" in win) || !("performance" in win)) {
      logDebug("PerformanceObserver or Performance API not available.");
      return;
    }

    logDebug("Starting Performance Observer...");

    const ltObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        trigger("performance_long_task", {
          duration_ms: entry.duration,
          name: entry.name,
          start_time_ms: entry.startTime,
        });
      }
    });
    try {
      ltObserver.observe({ entryTypes: ["longtask"] });
    } catch (e) {
      logDebug("Long Task Observer failed:", e);
    }

    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        trigger("performance_lcp", {
          time_ms: lastEntry.renderTime || lastEntry.loadTime,
          element_tag: lastEntry.element?.tagName,
          url: lastEntry.url,
        });
        lcpObserver.disconnect();
      }
    });
    try {
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
    } catch (e) {
      logDebug("LCP Observer failed:", e);
    }

    let fidTracked = false;
    const captureFID = (event) => {
      if (fidTracked) return;
      const delay = event.timeStamp - performance.timing.navigationStart;
      trigger("performance_fid_approx", {
        delay_ms: delay,
        event_type: event.type,
      });
      fidTracked = true;
      win.removeEventListener("mousedown", captureFID, { once: true });
      win.removeEventListener("keydown", captureFID, { once: true });
      win.removeEventListener("touchstart", captureFID, { once: true });
    };
    win.addEventListener("mousedown", captureFID, { once: true });
    win.addEventListener("keydown", captureFID, { once: true });
    win.addEventListener("touchstart", captureFID, { once: true });

    const trackLoadMetrics = () => {
      if (
        !performance ||
        !performance.timing ||
        performance.timing.loadEventEnd === 0
      ) {
        setTimeout(trackLoadMetrics, 100);
        return;
      }
      const timing = performance.timing;
      trigger("performance_load_metrics", {
        load_time_ms: timing.loadEventEnd - timing.navigationStart,
        dom_content_loaded_ms:
          timing.domContentLoadedEventEnd - timing.navigationStart,
        response_time_ms: timing.responseEnd - timing.requestStart,
        first_byte_ms: timing.responseStart - timing.navigationStart,
      });
    };
    if (doc.readyState === "complete") {
      trackLoadMetrics();
    } else {
      win.addEventListener("load", trackLoadMetrics, { once: true });
    }
  }

  // 2. Outbound Clicks & Downloads
  doc.addEventListener("click", function (event) {
    if (!consentGiven) return;
    const target = event.target.closest("a");
    if (!target) return;

    const href = target.getAttribute("href") || "";
    const targetURL = safeParseURL(href);

    if (!targetURL) return;

    const isOutbound =
      targetURL.protocol.startsWith("http") &&
      targetURL.hostname !== loc.hostname;
    const isDownload = /\.(pdf|zip|docx?|xlsx?|pptx?|rar|tar|gz|exe)$/i.test(
      targetURL.pathname
    );

    if (isOutbound) {
      trigger(
        "outbound_click",
        {
          url: href,
          text: target.innerText.trim().substring(0, 100),
          target: target.getAttribute("target") || "_self",
        },
        { forceXHR: true }
      );
    } else if (isDownload) {
      trigger(
        "download",
        {
          file_url: href,
          file_name: targetURL.pathname.split("/").pop(),
          file_extension: targetURL.pathname.split(".").pop(),
        },
        { forceXHR: true }
      );
    }
  });

  // 3. Form Submissions
  doc.addEventListener("submit", function (event) {
    if (!consentGiven) return;
    const form = event.target;
    if (!form || form.tagName.toLowerCase() !== "form") return;

    const formId = form.id || form.getAttribute("name") || "unknown_form";
    trigger("form_submit", {
      form_id: formId,
      form_class: form.className,
      form_action: form.action,
      form_method: form.method || "get",
    });
  });

  // 4. SPA Navigation Tracking
  let initialPathname = loc.pathname;
  let lastHistoryState = win.history.state;

  const originalPushState = win.history.pushState;
  win.history.pushState = function (...args) {
    originalPushState.apply(this, args);
    handleUrlChange();
  };

  const originalReplaceState = win.history.replaceState;
  win.history.replaceState = function (...args) {
    originalReplaceState.apply(this, args);
    handleUrlChange();
  };

  function handleUrlChange() {
    setTimeout(function () {
      if (
        loc.pathname !== initialPathname ||
        win.history.state !== lastHistoryState
      ) {
        logDebug("URL changed via SPA navigation:", loc.href);
        initialPathname = loc.pathname;
        lastHistoryState = win.history.state;
        scrollDepthTracked = {};
        trackPageView();
      }
    }, 50);
  }

  win.addEventListener("popstate", handleUrlChange);
  win.addEventListener("hashchange", handleUrlChange);

  // 5. Scroll Depth Tracking
  win.addEventListener(
    "scroll",
    throttle(function () {
      if (!consentGiven) return;
      const scrollTop = win.pageYOffset || doc.documentElement.scrollTop;
      const scrollHeight =
        doc.documentElement.scrollHeight - doc.documentElement.clientHeight;

      if (scrollHeight === 0) return;

      const scrollPercent = Math.round((scrollTop / scrollHeight) * 100);

      CONFIG.scrollDepthMarkers.forEach(function (marker) {
        if (scrollPercent >= marker && !scrollDepthTracked[marker]) {
          scrollDepthTracked[marker] = true;
          trigger("scroll_depth", { depth_percent: marker });
          logDebug("Scroll depth tracked:", marker + "%");
        }
      });
    }, 1000),
    { passive: true }
  );

  // 6. Element Visibility Tracking
  win.your_tracking.trackVisibility = function (
    selector,
    eventName = "element_visible"
  ) {
    if (!("IntersectionObserver" in win)) {
      logDebug("IntersectionObserver not available.");
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            trigger(eventName, {
              element_id: entry.target.id || null,
              element_class: entry.target.className || null,
              element_tag: entry.target.tagName,
              element_text_preview: entry.target.innerText
                ?.trim()
                .substring(0, 50),
              selector: selector,
              visible_ratio: entry.intersectionRatio,
            });
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    doc.querySelectorAll(selector).forEach((element) => {
      observer.observe(element);
    });
    logDebug(`Started visibility tracking for selector: ${selector}`);
  };

  // 7. Error Tracking
  win.addEventListener("error", (event) => {
    if (!consentGiven) return;
    const error = event.error;
    trigger("js_error", {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: error?.stack,
      error_type: error?.name,
    });
  });

  win.addEventListener("unhandledrejection", (event) => {
    if (!consentGiven) return;
    trigger("promise_rejection", {
      reason: event.reason?.message || event.reason,
      stack: event.reason?.stack,
    });
  });

  // 8. Browser Resize Tracking
  win.addEventListener(
    "resize",
    debounce(function () {
      if (!consentGiven) return;
      trigger("browser_resize", {
        new_width: win.innerWidth,
        new_height: win.innerHeight,
      });
      logDebug("Browser resized and debounce triggered.");
    }, CONFIG.debounceDelayMs)
  );

  // --- Initialization ---
  function initialize() {
    logDebug("Tracking script initializing...");

    if (!consentGiven) {
      logDebug("Consent required but not given yet. Events will be queued.");
      return;
    }

    initializeSession();

    if (doc.readyState === "complete") {
      trackPerformance();
    } else {
      win.addEventListener("load", trackPerformance, { once: true });
    }

    trackPageView();

    win.addEventListener("beforeunload", function () {
      trackSessionEnd();
    });

    logDebug("Tracking script initialized.");
  }

  // --- Autostart or wait for consent ---
  if (CONFIG.requireConsent) {
    logDebug("Consent required. Waiting for consent.");
  } else {
    initialize();
  }

  for (const args of queue) {
    if (typeof args[0] === "string") {
      win.your_tracking.apply(null, args);
    } else {
      logDebug("Skipping invalid queued event:", args);
    }
  }
})();
