import http from './http'

export const getCountries = () => http.get('/reference/countries')
export const getCurrencies = () => http.get('/reference/currencies')
export const getLocales = () => http.get('/reference/locales')
export const getMarkets = () => http.get('/reference/markets')
export const getStatuses = (domain) => http.get('/reference/statuses', { params: { domain } })
export const getEnums = (type) => http.get('/reference/enums', { params: { type } })
export const getProductOptions = (productId) => http.get(`/reference/products/${productId}/options`)
