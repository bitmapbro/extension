export default defineContentScript({
  matches: ["*://*/*"],

  async main() {
    console.log("Hello content.");
  },
});
