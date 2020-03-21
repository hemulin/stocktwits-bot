require("dotenv").config();

const { launchBot } = require("./bot");
const { getTrendingSymbols } = require("./supportedMethods");

(async () => {
  launchBot()
})();
