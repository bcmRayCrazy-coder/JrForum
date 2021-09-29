const fs = require('fs');

var navBar = fs.readFileSync(__dirname + '/nav.html').toString();

module.exports = {
    navBar
}