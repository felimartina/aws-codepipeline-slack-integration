const handler = require('../handler')
const context = console.log
const callback = console.log
handler.handle(require('./test-events/execution-started.json'), context, callback)
handler.handle(require('./test-events/build-succeeded.json'), context, callback)
