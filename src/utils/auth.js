// Authorization
import storage from './storage'
const HEIMA_KEY = 'hemetooutiao-token'

export const getToken = () => storage.get(HEIMA_KEY)

export const setToken = (token) => storage.set(HEIMA_KEY, token)

export const removeToken = () => storage.remove(HEIMA_KEY)
