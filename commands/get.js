const axios = require("axios")
const Discord = require('discord.js');

module.exports = {
    name: 'get',
    description: 'A command to check pricing of a stock symbol and return price along with news information.',
    args: true,
    usage: '<stock symbol>',
    execute(message, args) {
        let stock = args[0]
        let newStock = stock.replace("$", '')
        let apiRequest = `https://api.iextrading.com/1.0/stock/${newStock}/book`
        let stockLogoRequest = `https://api.iextrading.com/1.0/stock/${newStock}/logo`
        let stockLogo

        const abbrNum = (number, decPlaces) => {
            decPlaces = Math.pow(10,decPlaces);
            var abbrev = [ "K", "M", "B", "T" ];
            for (var i=abbrev.length-1; i>=0; i--) {
                var size = Math.pow(10,(i+1)*3);
                if(size <= number) {
                     number = Math.round(number*decPlaces/size)/decPlaces;
                     if((number == 1000) && (i < abbrev.length - 1)) {
                         number = 1;
                         i++;
                     }
                     number += abbrev[i];
                     break;
                }
            }
            return number;
        }
    
        axios.get(apiRequest).then((stockInfo)=>{
            let grabbedStock = stockInfo.data.quote
            let changepercent = grabbedStock.change
            let marketNum = abbrNum(grabbedStock.marketCap,2)
            axios.get(stockLogoRequest).then((response)=>{
                stockLogo = response.data.url
                console.log(stockLogo)

                const exampleEmbed = new Discord.RichEmbed()
                .setTitle(`${grabbedStock.companyName} currently is at $${grabbedStock.latestPrice}`)
                .setDescription(`${grabbedStock.symbol}`)
                .setTimestamp(new Date())
                .setColor(3447003)
                .setFooter(`Data is from ${grabbedStock.latestTime}`)
                .setThumbnail(stockLogo)
                .addField("\u200b", "\u200b", false)
                .addField('Latest Close', `$${grabbedStock.close}`, true)
                .addField('After Market', `$${grabbedStock.extendedPrice}`, true)
                .addField("Open", `$${grabbedStock.open}`, true)
                .addField("Change Percent", `${changepercent}%`, true)
                .addField("\u200b", "\u200b", false)
                .addField("Market Cap", `${marketNum}`, true)
                .addField("\u200b", "\u200b", true)
                .addField('Volume', `${grabbedStock.latestVolume.toLocaleString()}`, true)
                .addField('Average Volume', `${grabbedStock.avgTotalVolume.toLocaleString()}`, true)
                .addField('Day Range', `$${grabbedStock.low} - $${grabbedStock.high}`, true)
                .addField('52 Week Range', `$${grabbedStock.week52Low} - $${grabbedStock.week52High}`, true)
                .addField("\u200b", "\u200b", false)
                .addField('Tradingview', `[Link](https://www.tradingview.com/symbols/${newStock}/)`, true)
                .addField('Yahoo', `[Link](https://finance.yahoo.com/quote/${newStock}?p=${newStock})`, true)
                .addField('Finviz', `[Link](https://finviz.com/quote.ashx?t=${newStock})`, true)
                .addField('Bamsec', `[Link](https://www.bamsec.com/entity-search/search?q=${newStock})`, true)
                .addField('Sec.gov', `[Link](https://www.sec.gov/cgi-bin/browse-edgar?CIK=${newStock}&owner=exclude&action=getcompany&Find=Search)`, true)


            message.channel.send(exampleEmbed);
        })
    }) 
    },
    
};