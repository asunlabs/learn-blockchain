// ============== block.timestamp | date conversion =============== //
const remixTimestamp = 1659162427 // block.timestamp, unix time seconds
const valueAddedTimestamp = 1659164045 // block.timestamp + 500
const unitAddedTimestamp = 1659163846 // block.timestamp + 1 minutes

// dynamic value
const date = new Date()

console.log(date.toISOString())
const yyyymmdd = date.toISOString().slice(0, 10)
console.log({ yyyymmdd })

console.log('local full time', date.toLocaleString()) // local full time
console.log(date.toLocaleDateString())
console.log(date.toLocaleTimeString())

const converted = new Date(remixTimestamp)
console.log('default unit timestamp: ', converted)

const converted2 = new Date(1659164225)
console.log('default unit timestamp2: ', converted2)

const added = new Date(valueAddedTimestamp)
console.log('after add: ', added)

const unitAdded = new Date(unitAddedTimestamp)
console.log('after unit add: ', unitAdded)
