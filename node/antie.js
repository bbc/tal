var fs = require('fs')

module.exports = {
    getPageStrategyElement: function(pageStrategy, element) {
        var pageStrategyPath = __dirname + '/../config/pagestrategy/' + pageStrategy + '/' + element;
        if (!fs.existsSync(pageStrategyPath)) {
            return {
                noSuchStrategy: "file does not exist: " + pageStrategyPath
            }
        }
        return {
            data: fs.readFileSync(pageStrategyPath).toString()
        }
    }
}
