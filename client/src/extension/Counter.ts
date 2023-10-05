import browser from "webextension-polyfill";
import Classifier from "./Classifier";

/*
{
  "11/26/2022": {
    "youtube.com": [1, 10] // (Label, 10 minutes spent)
  }
}
*/

export default class Counter {
  // must be greater than 1
  // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/alarms/create
  static SYNC_INTERVAL = 1;

  currentDate: string;
  savedTime: Record<string, number> = {};

  constructor() {
    this.currentDate = new Date().toLocaleDateString();
  }

  /**
   * Convert interval into minutes for dates-fn
   * @param n - Interval stored in browser storage
   * @returns - Minutes for dates-fn
   */
  static convertInterval(n: number) {
    return n * 60 * 1000;
  }

  /**
   * Get browsing data for current date
   * @returns Record of domain to time checked
   */
  async get() {
    const res = await browser.storage.local.get([this.currentDate]);
    const browsingData = res[this.currentDate];
    return browsingData || {};
  }

  /**
   * Save new saved tiem data
   * @param savedTime - New record of domain to time checked
   */
  async sync(savedTime?: Counter["savedTime"]) {
    if (savedTime) {
      this.savedTime = savedTime;
    }

    // save changes
    browser.storage.local.set({
      [this.currentDate]: this.savedTime,
    });
  }

  /**
   * Get all saved keys
   * @returns All domain to time checked records
   */
  static getAll() {
    return browser.storage.local.get(null);
  }

  /**
   * Increment counter
   * @param tabs - List of tabs fetched with browser.tabs.query
   */
  async update(tabs: browser.Tabs.Tab[]) {
    tabs = tabs.filter((tab) => tab.url);

    const savedTime = await this.get();
    const usedHostnames: Record<string, boolean> = {}; // don't count duplicate sites

    for (const tab of tabs) {
      const url = new URL(tab.url!);
      const hostname = url.hostname;
      if (
        !tab.id ||
        !url.protocol.startsWith("http") ||
        usedHostnames.hasOwnProperty(hostname)
      )
        continue;

      const savedHostname = savedTime[hostname] || [];
      savedTime[hostname] = [
        typeof savedHostname[0] === "undefined"
          ? await Classifier.classifyWebsite(tab.id)
          : savedHostname[0], // label
        (savedHostname[1] || 0) + Counter.SYNC_INTERVAL, // minutes counted
      ];

      usedHostnames[hostname] = true;
    }

    this.sync(savedTime);
  }
}
