/**
 * @fileOverview Requirejs module containing base antie.Formatter class.
 *
 * @preserve Copyright (c) 2013 British Broadcasting Corporation
 * (http://www.bbc.co.uk) and TAL Contributors (1)
 *
 * (1) TAL Contributors are listed in the AUTHORS file and at
 *     https://github.com/fmtvp/TAL/AUTHORS - please extend this file,
 *     not this notice.
 *
 * @license Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * All rights reserved
 * Please contact us for an alternative licence
 */

require.def("antie/historyparser",
    [
        "antie/class"
    ],
    function(Class) {
        'use strict';
        var HistoryParser;
        HistoryParser = Class.extend({
            
            backUrl: function(url) {
                var recentHistory, remainingHistories, routeFound;

                function splitHistories() {
                    var allHistories, i;
                    allHistories = url.split(HistoryParser.historyToken);
                    recentHistory = allHistories.pop();
                    allHistories.shift();
                    for(i = 0; i !== allHistories.length; i += 1) {
                        allHistories[i] =  HistoryParser.historyToken + allHistories[i];
                    }
                    remainingHistories = allHistories.join();
                }
                
                function processRoute() {
                    var restoredRoute;
                    restoredRoute = recentHistory.replace(HistoryParser.routeToken, '#');
                    if (restoredRoute !== recentHistory) {
                        routeFound = true;
                        recentHistory = restoredRoute;
                    }   
                }
                
                function buildBackUrl() {
                    var urlWithRoute, urlWithoutRoute;
                    urlWithRoute = recentHistory + remainingHistories;
                    urlWithoutRoute = recentHistory + '#' + remainingHistories;
                    if(remainingHistories) {
                        return (routeFound ? urlWithRoute : urlWithoutRoute);
                    }
                    return recentHistory;
                }
                
                routeFound = false;
                splitHistories();
                processRoute();
                return buildBackUrl();
            }            
            
        });
        
        HistoryParser.historyToken = '&history=';
        HistoryParser.routeToken = '&route=';
        
        return HistoryParser;
    }
);