# Runs the java server for jscoverage, produces the report using phantomjs creates the lcov and then closes the server

# Clear any currently running jscover server
PID=`ps aux | grep -i java | grep JSCover | awk '{print $2}'`
if [ ! -z "$PID" ]; then
		kill -9 $PID
fi
# Set up the JSCover java server
java -jar jscover-1.0.13/JSCover-all.jar -ws --port=4466 --save-json-only --document-root=../../.. --report-dir=report --only-instrument-reg=.*static/script/.* &

sleep 1
open http://localhost:4466/jscoverage.html?/static/script-tests/jasmine/WebRunner.html
phantomjs ../lib/run-jscover-jasmine.js http://localhost:4466/webapp/static-versioned/script-tests/jasmine/WebRunner.html
java -cp jscover-1.0.13/JSCover-all.jar jscover.report.Main --format=COBERTURAXML report/phantom ../..

if [[ ! $* == *-p* ]]; then
		curl http://localhost:4466/stop
fi
