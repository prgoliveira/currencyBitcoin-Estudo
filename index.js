const axios = require('axios')
const securyKey = require('./secury')
const schedule = require('node-schedule')

function moneyFormat(partes, ...currencys){
	const currencyPrice = []
	currencys.forEach((currency, indice)=>{
		currency = isNaN(currency) ? currency : `$${currency.toFixed(2).replace('.', ',')}`
		currencyPrice.push(partes[indice], currency)
	})
	return currencyPrice.join('')
}

const getCurrencyBTC = schedule.scheduleJob('2 * * * * *', () =>{
	const currencyBTC = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=USD&apikey=${securyKey}`
	const dailyPriceBTC = `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=USD&apikey=${securyKey}`

	const requestOne = axios.get(currencyBTC)
	const requestTwo = axios.get(dailyPriceBTC)

	axios.all([requestOne, requestTwo]).then(axios.spread((...responses)=>{
		
		const valueBTC = responses[0].data
		const dailyBTC = responses[1].data

		const timeSeries = Object.values(dailyBTC)[1]
		const today = Object.values(timeSeries)[1]
		const initialPrice = Number(Object.values(today)[0])
		
		const realtimeCurrency = Object.values(valueBTC)[0]	
		const fromCurrency = Object.values(realtimeCurrency)[1]
		const toCurrency = Object.values(realtimeCurrency)[2]
		const exchangeRate = Number(Object.values(realtimeCurrency)[4])
		const lastRefresh = Object.values(realtimeCurrency)[5]
		const timeZone = Object.values(realtimeCurrency)[6]
		const bidPrice = Number(Object.values(realtimeCurrency)[7])
		const askPrice = Number(Object.values(realtimeCurrency)[8])

		const percent = `${(((exchangeRate-initialPrice)/initialPrice)*100).toFixed(4)} %`
	
		console.log(moneyFormat `A atual taxa de cambio da ${fromCurrency} para ${toCurrency} (Dolar) é de: ${exchangeRate} \nCom variação de lances de ${bidPrice} e valor de oferta de ${askPrice} - atualizado as ${lastRefresh} - ${timeZone}\nO valor inicial da moeda era ${initialPrice}.` + ` \nA ${fromCurrency} teve uma variação de ${percent}\n`)
	}))

})