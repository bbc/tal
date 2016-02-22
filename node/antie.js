var fs = require('fs')

function fileExistsSync(path) {
    try {
        fs.lstatSync(path);
        return true;
    } catch (e) {
        return false;
    }
}

function fileExists(path, callback) {
    try {
        fs.lstat(path);
        callback(true);
    } catch (e) {
        callback(false);
    }
}

module.exports = {
    getPageStrategyElementSync: function(pageStrategy, element) {
        var pageStrategyPath = __dirname + '/../config/pagestrategy/' + pageStrategy + '/' + element;
        if (!fileExistsSync(pageStrategyPath)) {
            return {
                noSuchStrategy: "file does not exist: " + pageStrategyPath
            }
        }
        return {
            data: fs.readFileSync(pageStrategyPath).toString()
        }
    },
    getPageStrategyElement: function(pageStrategy, element, callback) {
        var pageStrategyPath = __dirname + '/../config/pagestrategy/' + pageStrategy + '/' + element;

        fs.readFile(pageStrategyPath, function(err, data) {
            if (err !== null) {
                callback({
                    noSuchStrategy: "file does not exist: " + pageStrategyPath
                })
            } else {
                callback({
                    data: data.toString()
                })
            }
        })
    }
}
