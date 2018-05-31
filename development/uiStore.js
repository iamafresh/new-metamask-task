const createStore = require('redux').createStore
const applyMiddleware = require('redux').applyMiddleware
const thunkMiddleware = require('redux-thunk').default
const createLogger = require('redux-logger').createLogger
const rootReducer = require('../ui/app/reducers')

module.exports = configureStore

const loggerMiddleware = createLogger()

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware
  //,loggerMiddleware //GZB MODIFY
)(createStore)

function configureStore (initialState) {
  return createStoreWithMiddleware(rootReducer, initialState)
}
