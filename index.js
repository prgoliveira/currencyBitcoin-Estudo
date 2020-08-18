const axios = require('axios')
const securyKey = require('./secury')
const schedule = require('node-schedule')

const getCurrencyBTC = schedule.scheduleJob('2 * * * * *', () =>{
	const currencyBTC = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=USD&apikey=${securyKey}`
	axios.get(currencyBTC).then((response) =>{
		const valueBTC = response.data
		const fromCurrency = valueBTC['Realtime Currency Exchange Rate']['2. From_Currency Name']
		const toCurrency = valueBTC['Realtime Currency Exchange Rate']['3. To_Currency Code']
		const exchangeRate = Number(valueBTC['Realtime Currency Exchange Rate']['5. Exchange Rate']).toFixed(2)
		const lastRefresh = valueBTC['Realtime Currency Exchange Rate']['6. Last Refreshed']
		const timeZone = valueBTC['Realtime Currency Exchange Rate']['7. Time Zone']
		const bidPrice = Number(valueBTC['Realtime Currency Exchange Rate']['8. Bid Price']).toFixed(2)
		const askPrice = Number(valueBTC['Realtime Currency Exchange Rate']['9. Ask Price']).toFixed(2)
		console.log(`A atual taxa de cambio da ${fromCurrency} para ${toCurrency} (dolar) é de $${exchangeRate}, com variação de lances de $${bidPrice} e valor de oferta de $${askPrice}, atualizado as ${lastRefresh} - ${timeZone}`)        
	})
})

