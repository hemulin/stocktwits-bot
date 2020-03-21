const axios = require('axios');

const getTrendingSymbols = async (limit = null, orderWatchlist = false) => {
  const res = await axios.get('https://api.stocktwits.com/api/2/trending/symbols/equities.json');
  if (res.status !== 200) {
    return "Couldn't retrieve request"
  }
  let symbolsData = res.data.symbols
  for (let [i,entry] of symbolsData.entries()) {
    entry.rank = i+1;
  }
  if (limit) {
    symbolsData = symbolsData.slice(0, limit)
  }
  if (orderWatchlist) {
    symbolsData = symbolsData.sort((a, b) => b.watchlist_count - a.watchlist_count)
  }

  const formattedResponse = symbolsData.map(x => ({symbol: x.symbol, name: x.title, rank: x.rank, watchers: x.watchlist_count}))
  let returnString = ''
  for (const entry of formattedResponse) {
    returnString += `${entry.symbol} (${entry.name}) - Rank: ${entry.rank} (${entry.watchers} watchers)\n`;
  }
  return returnString
};

module.exports = {
  getTrendingSymbols
};
