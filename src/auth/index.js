if (process.env.HTPASSWD_FILE && process.NODE_ENV !== 'production') {
  module.exports = require('./basic-auth');
}
else {
  throw new Error('missing env vars: no authorization configuration found');
}
