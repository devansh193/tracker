(function(){
    "use strinc";

    const CONFIG = {
        endpoint:"https://analytics.artemislabs.in/api/track",
        sessionDurationMs: 30*60*1000,
        throttleDelayMs: 5000,
        debounceDelayMs: 500,
        scrollDepthMarkers: [25, 50, 75, 90],
        debugMode: false,
        requireConsent: false,
    };
    const win = window;
    const doc = win.document;
    const loc = win.location;
    const nav = win.navigator;
    const scriptElement = doc.currentScript;

    const dataDomain = scriptElement.getAttribute("data-domain")
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

    function logDebug(...args){
        if(CONFIG.debugMode){
            console.log("[YourTracking]", ...args);
        }
    }
    ();
})