const date = require('date-and-time');

  function generateUniqueNumber (prefixString) {
    return prefixString + Date.now() + "" + getRandomInt(9999)
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
module.exports = { generateUniqueNumber }
