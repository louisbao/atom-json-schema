/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import HtmlContent from '../common/htmlContent';
import Strings from '../common/strings';
import JSONWorker from '../jsonWorker';
import URI from '../common/uri';
import {JSONLocation} from '../parser/jsonLocation';
import request from 'request-light';

export class BowerJSONContribution implements JSONWorker.IJSONWorkerContribution {

    private topRanked = ['twitter', 'bootstrap', 'angular-1.1.6', 'angular-latest', 'angulerjs', 'd3', 'myjquery', 'jq', 'abcdef1234567890', 'jQuery', 'jquery-1.11.1', 'jquery',
        'sushi-vanilla-x-data', 'font-awsome', 'Font-Awesome', 'font-awesome', 'fontawesome', 'html5-boilerplate', 'impress.js', 'homebrew',
        'backbone', 'moment1', 'momentjs', 'moment', 'linux', 'animate.css', 'animate-css', 'reveal.js', 'jquery-file-upload', 'blueimp-file-upload', 'threejs', 'express', 'chosen',
        'normalize-css', 'normalize.css', 'semantic', 'semantic-ui', 'Semantic-UI', 'modernizr', 'underscore', 'underscore1',
        'material-design-icons', 'ionic', 'chartjs', 'Chart.js', 'nnnick-chartjs', 'select2-ng', 'select2-dist', 'phantom', 'skrollr', 'scrollr', 'less.js', 'leancss', 'parser-lib',
        'hui', 'bootstrap-languages', 'async', 'gulp', 'jquery-pjax', 'coffeescript', 'hammer.js', 'ace', 'leaflet', 'jquery-mobile', 'sweetalert', 'typeahead.js', 'soup', 'typehead.js',
        'sails', 'codeigniter2'];

    public constructor() {
    }

    private isBowerFile(resource: URI): boolean {
        var path = resource.path;
        return Strings.endsWith(path, '/bower.json') || Strings.endsWith(path, '/.bower.json');
    }

    public collectDefaultSuggestions(resource: URI, result: JSONWorker.ISuggestionsCollector): Promise<any> {
        if (this.isBowerFile(resource)) {
            var defaultValue = {
                'name': '{{name}}',
                'description': '{{description}}',
                'authors': ['{{author}}'],
                'version': '{{1.0.0}}',
                'main': '{{pathToMain}}',
                'dependencies': {}
            };
            result.add({ type: 'snippet', displayText: 'Default bower.json', snippet: JSON.stringify(defaultValue, null, '\t'), description: '' });
        }
        return null;
    }

    public collectPropertySuggestions(resource: URI, location: JSONLocation, currentWord: string, addValue: boolean, isLast: boolean, result: JSONWorker.ISuggestionsCollector): Promise<any> {
        if (this.isBowerFile(resource) && (location.matches(['dependencies']) || location.matches(['devDependencies']))) {
            if (currentWord.length > 0) {
                var queryUrl = 'https://bower.herokuapp.com/packages/search/' + encodeURIComponent(currentWord);

                return request.xhr({
                    url: queryUrl
                })
                    .then((success) => {
                        if (success.status === 200) {
                            try {
                                var obj = JSON.parse(success.responseText);
                                if (Array.isArray(obj)) {
                                    var results = <{ name: string; description: string; }[]>obj;
                                    for (var i = 0; i < results.length; i++) {
                                        var name = results[i].name;
                                        var description = results[i].description || '';
                                        var codeSnippet = JSON.stringify(name);
                                        if (addValue) {
                                            codeSnippet += ': "{{*}}"';
                                            if (!isLast) {
                                                codeSnippet += ',';
                                            }
                                        }
                                        result.add({ type: 'property', displayText: name, snippet: codeSnippet, description: description });
                                    }
                                    result.setAsIncomplete();
                                }
                            } catch (e) {
                                // ignore
                            }
                        } else {
                            result.error(nls.localize('json.bower.error.repoaccess', 'Request to the bower repository failed: {0}', success.responseText));
                            return 0;
                        }
                    }, (error) => {
                        result.error(nls.localize('json.bower.error.repoaccess', 'Request to the bower repository failed: {0}', error.responseText));
                        return 0;
                    });
            } else {
                this.topRanked.forEach((name) => {
                    var codeSnippet = JSON.stringify(name);
                    if (addValue) {
                        codeSnippet += ': "{{*}}"';
                        if (!isLast) {
                            codeSnippet += ',';
                        }
                    }
                    result.add({ type: 'property', label: name, codeSnippet: codeSnippet, documentationLabel: '' });
                });
                result.setAsIncomplete();
            }
        }
        return null;
    }

    public collectValueSuggestions(resource: URI, location: JSONLocation, currentKey: string, result: JSONWorker.ISuggestionsCollector): Promise<any> {
        // not implemented. Could be do done calling the bower command. Waiting for web API: https://github.com/bower/registry/issues/26
        return null;
    }

    public getInfoContribution(resource: URI, location: JSONLocation): Promise<HtmlContent.IHTMLContentElement[]> {
        if (this.isBowerFile(resource) && (location.matches(['dependencies', '*']) || location.matches(['devDependencies', '*']))) {
            var pack = location.getSegments()[location.getSegments().length - 1];
            var htmlContent: HtmlContent.IHTMLContentElement[] = [];
            htmlContent.push({ className: 'type', text:  pack });

            var queryUrl = 'https://bower.herokuapp.com/packages/' + encodeURIComponent(pack);

            return request.xhr({
                url: queryUrl
            }).then((success) => {
                try {
                    var obj = JSON.parse(success.responseText);
                    if (obj && obj.url) {
                        var url = obj.url;
                        if (Strings.startsWith(url, 'git://')) {
                            url = url.substring(6);
                        }
                        if (Strings.endsWith(url, '.git')) {
                            url = url.substring(0, url.length - 4);
                        }
                        htmlContent.push({ className: 'documentation', text: url });
                    }
                } catch (e) {
                    // ignore
                }
                return htmlContent;
            }, (error) => {
                return htmlContent;
            });
        }
        return null;
    }
}
