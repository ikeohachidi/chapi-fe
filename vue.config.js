const path = require('path');

module.exports = {
    publicPath: '/static',
    productionSourceMap: false,
    pages: {
        index: {
            entry: 'src/main.ts',
            title: 'Chapi'
        }
    }
}