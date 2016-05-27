'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BowerJSONContribution = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _strings = require('../common/strings');

var _strings2 = _interopRequireDefault(_strings);

var _requestLight = require('request-light');

var _requestLight2 = _interopRequireDefault(_requestLight);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BowerJSONContribution = exports.BowerJSONContribution = function () {
    function BowerJSONContribution() {
        _classCallCheck(this, BowerJSONContribution);

        this.topRanked = ['twitter', 'bootstrap', 'angular-1.1.6', 'angular-latest', 'angulerjs', 'd3', 'myjquery', 'jq', 'abcdef1234567890', 'jQuery', 'jquery-1.11.1', 'jquery', 'sushi-vanilla-x-data', 'font-awsome', 'Font-Awesome', 'font-awesome', 'fontawesome', 'html5-boilerplate', 'impress.js', 'homebrew', 'backbone', 'moment1', 'momentjs', 'moment', 'linux', 'animate.css', 'animate-css', 'reveal.js', 'jquery-file-upload', 'blueimp-file-upload', 'threejs', 'express', 'chosen', 'normalize-css', 'normalize.css', 'semantic', 'semantic-ui', 'Semantic-UI', 'modernizr', 'underscore', 'underscore1', 'material-design-icons', 'ionic', 'chartjs', 'Chart.js', 'nnnick-chartjs', 'select2-ng', 'select2-dist', 'phantom', 'skrollr', 'scrollr', 'less.js', 'leancss', 'parser-lib', 'hui', 'bootstrap-languages', 'async', 'gulp', 'jquery-pjax', 'coffeescript', 'hammer.js', 'ace', 'leaflet', 'jquery-mobile', 'sweetalert', 'typeahead.js', 'soup', 'typehead.js', 'sails', 'codeigniter2'];
    }

    _createClass(BowerJSONContribution, [{
        key: 'isBowerFile',
        value: function isBowerFile(resource) {
            var path = resource.path;
            return _strings2.default.endsWith(path, '/bower.json') || _strings2.default.endsWith(path, '/.bower.json');
        }
    }, {
        key: 'collectDefaultSuggestions',
        value: function collectDefaultSuggestions(resource, result) {
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
    }, {
        key: 'collectPropertySuggestions',
        value: function collectPropertySuggestions(resource, location, currentWord, addValue, isLast, result) {
            if (this.isBowerFile(resource) && (location.matches(['dependencies']) || location.matches(['devDependencies']))) {
                if (currentWord.length > 0) {
                    var queryUrl = 'https://bower.herokuapp.com/packages/search/' + encodeURIComponent(currentWord);
                    return _requestLight2.default.xhr({
                        url: queryUrl
                    }).then(function (success) {
                        if (success.status === 200) {
                            try {
                                var obj = JSON.parse(success.responseText);
                                if (Array.isArray(obj)) {
                                    var results = obj;
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
                            } catch (e) {}
                        } else {
                            result.error(nls.localize('json.bower.error.repoaccess', 'Request to the bower repository failed: {0}', success.responseText));
                            return 0;
                        }
                    }, function (error) {
                        result.error(nls.localize('json.bower.error.repoaccess', 'Request to the bower repository failed: {0}', error.responseText));
                        return 0;
                    });
                } else {
                    this.topRanked.forEach(function (name) {
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
    }, {
        key: 'collectValueSuggestions',
        value: function collectValueSuggestions(resource, location, currentKey, result) {
            return null;
        }
    }, {
        key: 'getInfoContribution',
        value: function getInfoContribution(resource, location) {
            if (this.isBowerFile(resource) && (location.matches(['dependencies', '*']) || location.matches(['devDependencies', '*']))) {
                var pack = location.getSegments()[location.getSegments().length - 1];
                var htmlContent = [];
                htmlContent.push({ className: 'type', text: pack });
                var queryUrl = 'https://bower.herokuapp.com/packages/' + encodeURIComponent(pack);
                return _requestLight2.default.xhr({
                    url: queryUrl
                }).then(function (success) {
                    try {
                        var obj = JSON.parse(success.responseText);
                        if (obj && obj.url) {
                            var url = obj.url;
                            if (_strings2.default.startsWith(url, 'git://')) {
                                url = url.substring(6);
                            }
                            if (_strings2.default.endsWith(url, '.git')) {
                                url = url.substring(0, url.length - 4);
                            }
                            htmlContent.push({ className: 'documentation', text: url });
                        }
                    } catch (e) {}
                    return htmlContent;
                }, function (error) {
                    return htmlContent;
                });
            }
            return null;
        }
    }]);

    return BowerJSONContribution;
}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZzY29kZS9jb250cmlidXRpb25zL2Jvd2VySlNPTkNvbnRyaWJ1dGlvbi50cyIsInZzY29kZS9jb250cmlidXRpb25zL2Jvd2VySlNPTkNvbnRyaWJ1dGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJQTs7Ozs7Ozs7O0FDSEE7Ozs7QUFDQTs7Ozs7Ozs7SURXQSxxQixXQUFBLHFCO0FBVUkscUNBQUE7QUFBQTs7QUFSUSxhQUFBLFNBQUEsR0FBWSxDQUFDLFNBQUQsRUFBWSxXQUFaLEVBQXlCLGVBQXpCLEVBQTBDLGdCQUExQyxFQUE0RCxXQUE1RCxFQUF5RSxJQUF6RSxFQUErRSxVQUEvRSxFQUEyRixJQUEzRixFQUFpRyxrQkFBakcsRUFBcUgsUUFBckgsRUFBK0gsZUFBL0gsRUFBZ0osUUFBaEosRUFDaEIsc0JBRGdCLEVBQ1EsYUFEUixFQUN1QixjQUR2QixFQUN1QyxjQUR2QyxFQUN1RCxhQUR2RCxFQUNzRSxtQkFEdEUsRUFDMkYsWUFEM0YsRUFDeUcsVUFEekcsRUFFaEIsVUFGZ0IsRUFFSixTQUZJLEVBRU8sVUFGUCxFQUVtQixRQUZuQixFQUU2QixPQUY3QixFQUVzQyxhQUZ0QyxFQUVxRCxhQUZyRCxFQUVvRSxXQUZwRSxFQUVpRixvQkFGakYsRUFFdUcscUJBRnZHLEVBRThILFNBRjlILEVBRXlJLFNBRnpJLEVBRW9KLFFBRnBKLEVBR2hCLGVBSGdCLEVBR0MsZUFIRCxFQUdrQixVQUhsQixFQUc4QixhQUg5QixFQUc2QyxhQUg3QyxFQUc0RCxXQUg1RCxFQUd5RSxZQUh6RSxFQUd1RixhQUh2RixFQUloQix1QkFKZ0IsRUFJUyxPQUpULEVBSWtCLFNBSmxCLEVBSTZCLFVBSjdCLEVBSXlDLGdCQUp6QyxFQUkyRCxZQUozRCxFQUl5RSxjQUp6RSxFQUl5RixTQUp6RixFQUlvRyxTQUpwRyxFQUkrRyxTQUovRyxFQUkwSCxTQUoxSCxFQUlxSSxTQUpySSxFQUlnSixZQUpoSixFQUtoQixLQUxnQixFQUtULHFCQUxTLEVBS2Ms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Zix5QkFBSztBQURVLGlCQUFaLEVBRUosSUFGSSxDQUVDLFVBQUMsT0FBRCxFQUFRO0FBQ1osd0JBQUk7QUFDQSw0QkFBSSxNQUFNLEtBQUssS0FBTCxDQUFXLFFBQVEsWUFBbkIsQ0FBVjtBQUNBLDRCQUFJLE9BQU8sSUFBSSxHQUFmLEVBQW9CO0FBQ2hCLGdDQUFJLE1BQU0sSUFBSSxHQUFkO0FBQ0EsZ0NBQUksa0JBQVEsVUFBUixDQUFtQixHQUFuQixFQUF3QixRQUF4QixDQUFKLEVBQXVDO0FBQ25DLHNDQUFNLElBQUksU0FBSixDQUFjLENBQWQsQ0FBTjtBQUNIO0FBQ0QsZ0NBQUksa0JBQVEsUUFBUixDQUFpQixHQUFqQixFQUFzQixNQUF0QixDQUFKLEVBQW1DO0FBQy9CLHNDQUFNLElBQUksU0FBSixDQUFjLENBQWQsRUFBaUIsSUFBSSxNQUFKLEdBQWEsQ0FBOUIsQ0FBTjtBQUNIO0FBQ0Qsd0NBQVksSUFBWixDQUFpQixFQUFFLFdBQVcsZUFBYixFQUE4QixNQUFNLEdBQXBDLEVBQWpCO0FBQ0g7QUFDSCxxQkFaRixDQVlFLE9BQU8sQ0FBUCxFQUFVLENBRVg7QUFDRCwyQkFBTyxXQUFQO0FBQ0gsaUJBbkJNLEVBbUJKLFVBQUMsS0FBRCxFQUFNO0FBQ0wsMkJBQU8sV0FBUDtBQUNILGlCQXJCTSxDQUFQO0FBc0JIO0FBQ0QsbUJBQU8sSUFBUDtBQUNIIiwiZmlsZSI6InZzY29kZS9jb250cmlidXRpb25zL2Jvd2VySlNPTkNvbnRyaWJ1dGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAqICBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS4gU2VlIExpY2Vuc2UudHh0IGluIHRoZSBwcm9qZWN0IHJvb3QgZm9yIGxpY2Vuc2UgaW5mb3JtYXRpb24uXHJcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQgSHRtbENvbnRlbnQgZnJvbSAnLi4vY29tbW9uL2h0bWxDb250ZW50JztcclxuaW1wb3J0IFN0cmluZ3MgZnJvbSAnLi4vY29tbW9uL3N0cmluZ3MnO1xyXG5pbXBvcnQgSlNPTldvcmtlciBmcm9tICcuLi9qc29uV29ya2VyJztcclxuaW1wb3J0IFVSSSBmcm9tICcuLi9jb21tb24vdXJpJztcclxuaW1wb3J0IHtKU09OTG9jYXRpb259IGZyb20gJy4uL3BhcnNlci9qc29uTG9jYXRpb24nO1xyXG5pbXBvcnQgcmVxdWVzdCBmcm9tICdyZXF1ZXN0LWxpZ2h0JztcclxuXHJcbmV4cG9ydCBjbGFzcyBCb3dlckpTT05Db250cmlidXRpb24gaW1wbGVtZW50cyBKU09OV29ya2VyLklKU09OV29ya2VyQ29udHJpYnV0aW9uIHtcclxuXHJcbiAgICBwcml2YXRlIHRvcFJhbmtlZCA9IFsndHdpdHRlcicsICdib290c3RyYXAnLCAnYW5ndWxhci0xLjEuNicsICdhbmd1bGFyLWxhdGVzdCcsICdhbmd1bGVyanMnLCAnZDMnLCAnbXlqcXVlcnknLCAnanEnLCAnYWJjZGVmMTIzNDU2Nzg5MCcsICdqUXVlcnknLCAnanF1ZXJ5LTEuMTEuMScsICdqcXVlcnknLFxyXG4gICAgICAgICdzdXNoaS12YW5pbGxhLXgtZGF0YScsICdmb250LWF3c29tZScsICdGb250LUF3ZXNvbWUnLCAnZm9udC1hd2Vzb21lJywgJ2ZvbnRhd2Vzb21lJywgJ2h0bWw1LWJvaWxlcnBsYXRlJywgJ2ltcHJlc3MuanMnLCAnaG9tZWJyZXcnLFxyXG4gICAgICAgICdiYWNrYm9uZScsICdtb21lbnQxJywgJ21vbWVudGpzJywgJ21vbWVudCcsICdsaW51eCcsICdhbmltYXRlLmNzcycsICdhbmltYXRlLWNzcycsICdyZXZlYWwuanMnLCAnanF1ZXJ5LWZpbGUtdXBsb2FkJywgJ2JsdWVpbXAtZmlsZS11cGxvYWQnLCAndGhyZWVqcycsICdleHByZXNzJywgJ2Nob3NlbicsXHJcbiAgICAgICAgJ25vcm1hbGl6ZS1jc3MnLCAnbm9ybWFsaXplLmNzcycsICdzZW1hbnRpYycsICdzZW1hbnRpYy11aScsICdTZW1hbnRpYy1VSScsICdtb2Rlcm5penInLCAndW5kZXJzY29yZScsICd1bmRlcnNjb3JlMScsXHJcbiAgICAgICAgJ21hdGVyaWFsLWRlc2lnbi1pY29ucycsICdpb25pYycsICdjaGFydGpzJywgJ0NoYXJ0LmpzJywgJ25ubmljay1jaGFydGpzJywgJ3NlbGVjdDItbmcnLCAnc2VsZWN0Mi1kaXN0JywgJ3BoYW50b20nLCAnc2tyb2xscicsICdzY3JvbGxyJywgJ2xlc3MuanMnLCAnbGVhbmNzcycsICdwYXJzZXItbGliJyxcclxuICAgICAgICAnaHVpJywgJ2Jvb3RzdHJhcC1sYW5ndWFnZXMnLCAnYXN5bmMnLCAnZ3VscCcsICdqcXVlcnktcGpheCcsICdjb2ZmZWVzY3JpcHQnLCAnaGFtbWVyLmpzJywgJ2FjZScsICdsZWFmbGV0JywgJ2pxdWVyeS1tb2JpbGUnLCAnc3dlZXRhbGVydCcsICd0eXBlYWhlYWQuanMnLCAnc291cCcsICd0eXBlaGVhZC5qcycsXHJcbiAgICAgICAgJ3NhaWxzJywgJ2NvZGVpZ25pdGVyMiddO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGlzQm93ZXJGaWxlKHJlc291cmNlOiBVUkkpOiBib29sZWFuIHtcclxuICAgICAgICB2YXIgcGF0aCA9IHJlc291cmNlLnBhdGg7XHJcbiAgICAgICAgcmV0dXJuIFN0cmluZ3MuZW5kc1dpdGgocGF0aCwgJy9ib3dlci5qc29uJykgfHwgU3RyaW5ncy5lbmRzV2l0aChwYXRoLCAnLy5ib3dlci5qc29uJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNvbGxlY3REZWZhdWx0U3VnZ2VzdGlvbnMocmVzb3VyY2U6IFVSSSwgcmVzdWx0OiBKU09OV29ya2VyLklTdWdnZXN0aW9uc0NvbGxlY3Rvcik6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNCb3dlckZpbGUocmVzb3VyY2UpKSB7XHJcbiAgICAgICAgICAgIHZhciBkZWZhdWx0VmFsdWUgPSB7XHJcbiAgICAgICAgICAgICAgICAnbmFtZSc6ICd7e25hbWV9fScsXHJcbiAgICAgICAgICAgICAgICAnZGVzY3JpcHRpb24nOiAne3tkZXNjcmlwdGlvbn19JyxcclxuICAgICAgICAgICAgICAgICdhdXRob3JzJzogWyd7e2F1dGhvcn19J10sXHJcbiAgICAgICAgICAgICAgICAndmVyc2lvbic6ICd7ezEuMC4wfX0nLFxyXG4gICAgICAgICAgICAgICAgJ21haW4nOiAne3twYXRoVG9NYWlufX0nLFxyXG4gICAgICAgICAgICAgICAgJ2RlcGVuZGVuY2llcyc6IHt9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJlc3VsdC5hZGQoeyB0eXBlOiAnc25pcHBldCcsIGRpc3BsYXlUZXh0OiAnRGVmYXVsdCBib3dlci5qc29uJywgc25pcHBldDogSlNPTi5zdHJpbmdpZnkoZGVmYXVsdFZhbHVlLCBudWxsLCAnXFx0JyksIGRlc2NyaXB0aW9uOiAnJyB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNvbGxlY3RQcm9wZXJ0eVN1Z2dlc3Rpb25zKHJlc291cmNlOiBVUkksIGxvY2F0aW9uOiBKU09OTG9jYXRpb24sIGN1cnJlbnRXb3JkOiBzdHJpbmcsIGFkZFZhbHVlOiBib29sZWFuLCBpc0xhc3Q6IGJvb2xlYW4sIHJlc3VsdDogSlNPTldvcmtlci5JU3VnZ2VzdGlvbnNDb2xsZWN0b3IpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIGlmICh0aGlzLmlzQm93ZXJGaWxlKHJlc291cmNlKSAmJiAobG9jYXRpb24ubWF0Y2hlcyhbJ2RlcGVuZGVuY2llcyddKSB8fCBsb2NhdGlvbi5tYXRjaGVzKFsnZGV2RGVwZW5kZW5jaWVzJ10pKSkge1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudFdvcmQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHF1ZXJ5VXJsID0gJ2h0dHBzOi8vYm93ZXIuaGVyb2t1YXBwLmNvbS9wYWNrYWdlcy9zZWFyY2gvJyArIGVuY29kZVVSSUNvbXBvbmVudChjdXJyZW50V29yZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QueGhyKHtcclxuICAgICAgICAgICAgICAgICAgICB1cmw6IHF1ZXJ5VXJsXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKChzdWNjZXNzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdWNjZXNzLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvYmogPSBKU09OLnBhcnNlKHN1Y2Nlc3MucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShvYmopKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHRzID0gPHsgbmFtZTogc3RyaW5nOyBkZXNjcmlwdGlvbjogc3RyaW5nOyB9W10+b2JqO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3VsdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuYW1lID0gcmVzdWx0c1tpXS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRlc2NyaXB0aW9uID0gcmVzdWx0c1tpXS5kZXNjcmlwdGlvbiB8fCAnJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb2RlU25pcHBldCA9IEpTT04uc3RyaW5naWZ5KG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFkZFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZVNuaXBwZXQgKz0gJzogXCJ7eyp9fVwiJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzTGFzdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlU25pcHBldCArPSAnLCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmFkZCh7IHR5cGU6ICdwcm9wZXJ0eScsIGRpc3BsYXlUZXh0OiBuYW1lLCBzbmlwcGV0OiBjb2RlU25pcHBldCwgZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5zZXRBc0luY29tcGxldGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWdub3JlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQuZXJyb3IobmxzLmxvY2FsaXplKCdqc29uLmJvd2VyLmVycm9yLnJlcG9hY2Nlc3MnLCAnUmVxdWVzdCB0byB0aGUgYm93ZXIgcmVwb3NpdG9yeSBmYWlsZWQ6IHswfScsIHN1Y2Nlc3MucmVzcG9uc2VUZXh0KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sIChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQuZXJyb3IobmxzLmxvY2FsaXplKCdqc29uLmJvd2VyLmVycm9yLnJlcG9hY2Nlc3MnLCAnUmVxdWVzdCB0byB0aGUgYm93ZXIgcmVwb3NpdG9yeSBmYWlsZWQ6IHswfScsIGVycm9yLnJlc3BvbnNlVGV4dCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudG9wUmFua2VkLmZvckVhY2goKG5hbWUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY29kZVNuaXBwZXQgPSBKU09OLnN0cmluZ2lmeShuYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYWRkVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZVNuaXBwZXQgKz0gJzogXCJ7eyp9fVwiJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0xhc3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZGVTbmlwcGV0ICs9ICcsJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQuYWRkKHsgdHlwZTogJ3Byb3BlcnR5JywgbGFiZWw6IG5hbWUsIGNvZGVTbmlwcGV0OiBjb2RlU25pcHBldCwgZG9jdW1lbnRhdGlvbkxhYmVsOiAnJyB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnNldEFzSW5jb21wbGV0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjb2xsZWN0VmFsdWVTdWdnZXN0aW9ucyhyZXNvdXJjZTogVVJJLCBsb2NhdGlvbjogSlNPTkxvY2F0aW9uLCBjdXJyZW50S2V5OiBzdHJpbmcsIHJlc3VsdDogSlNPTldvcmtlci5JU3VnZ2VzdGlvbnNDb2xsZWN0b3IpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIC8vIG5vdCBpbXBsZW1lbnRlZC4gQ291bGQgYmUgZG8gZG9uZSBjYWxsaW5nIHRoZSBib3dlciBjb21tYW5kLiBXYWl0aW5nIGZvciB3ZWIgQVBJOiBodHRwczovL2dpdGh1Yi5jb20vYm93ZXIvcmVnaXN0cnkvaXNzdWVzLzI2XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEluZm9Db250cmlidXRpb24ocmVzb3VyY2U6IFVSSSwgbG9jYXRpb246IEpTT05Mb2NhdGlvbik6IFByb21pc2U8SHRtbENvbnRlbnQuSUhUTUxDb250ZW50RWxlbWVudFtdPiB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNCb3dlckZpbGUocmVzb3VyY2UpICYmIChsb2NhdGlvbi5tYXRjaGVzKFsnZGVwZW5kZW5jaWVzJywgJyonXSkgfHwgbG9jYXRpb24ubWF0Y2hlcyhbJ2RldkRlcGVuZGVuY2llcycsICcqJ10pKSkge1xyXG4gICAgICAgICAgICB2YXIgcGFjayA9IGxvY2F0aW9uLmdldFNlZ21lbnRzKClbbG9jYXRpb24uZ2V0U2VnbWVudHMoKS5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgdmFyIGh0bWxDb250ZW50OiBIdG1sQ29udGVudC5JSFRNTENvbnRlbnRFbGVtZW50W10gPSBbXTtcclxuICAgICAgICAgICAgaHRtbENvbnRlbnQucHVzaCh7IGNsYXNzTmFtZTogJ3R5cGUnLCB0ZXh0OiAgcGFjayB9KTtcclxuXHJcbiAgICAgICAgICAgIHZhciBxdWVyeVVybCA9ICdodHRwczovL2Jvd2VyLmhlcm9rdWFwcC5jb20vcGFja2FnZXMvJyArIGVuY29kZVVSSUNvbXBvbmVudChwYWNrKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXF1ZXN0Lnhocih7XHJcbiAgICAgICAgICAgICAgICB1cmw6IHF1ZXJ5VXJsXHJcbiAgICAgICAgICAgIH0pLnRoZW4oKHN1Y2Nlc3MpID0+IHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9iaiA9IEpTT04ucGFyc2Uoc3VjY2Vzcy5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvYmogJiYgb2JqLnVybCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdXJsID0gb2JqLnVybDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFN0cmluZ3Muc3RhcnRzV2l0aCh1cmwsICdnaXQ6Ly8nKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsID0gdXJsLnN1YnN0cmluZyg2KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoU3RyaW5ncy5lbmRzV2l0aCh1cmwsICcuZ2l0JykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybCA9IHVybC5zdWJzdHJpbmcoMCwgdXJsLmxlbmd0aCAtIDQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0bWxDb250ZW50LnB1c2goeyBjbGFzc05hbWU6ICdkb2N1bWVudGF0aW9uJywgdGV4dDogdXJsIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBpZ25vcmVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBodG1sQ29udGVudDtcclxuICAgICAgICAgICAgfSwgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaHRtbENvbnRlbnQ7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxufVxyXG4iLCIndXNlIHN0cmljdCc7XG5pbXBvcnQgU3RyaW5ncyBmcm9tICcuLi9jb21tb24vc3RyaW5ncyc7XG5pbXBvcnQgcmVxdWVzdCBmcm9tICdyZXF1ZXN0LWxpZ2h0JztcbmV4cG9ydCBjbGFzcyBCb3dlckpTT05Db250cmlidXRpb24ge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnRvcFJhbmtlZCA9IFsndHdpdHRlcicsICdib290c3RyYXAnLCAnYW5ndWxhci0xLjEuNicsICdhbmd1bGFyLWxhdGVzdCcsICdhbmd1bGVyanMnLCAnZDMnLCAnbXlqcXVlcnknLCAnanEnLCAnYWJjZGVmMTIzNDU2Nzg5MCcsICdqUXVlcnknLCAnanF1ZXJ5LTEuMTEuMScsICdqcXVlcnknLFxuICAgICAgICAgICAgJ3N1c2hpLXZhbmlsbGEteC1kYXRhJywgJ2ZvbnQtYXdzb21lJywgJ0ZvbnQtQXdlc29tZScsICdmb250LWF3ZXNvbWUnLCAnZm9udGF3ZXNvbWUnLCAnaHRtbDUtYm9pbGVycGxhdGUnLCAnaW1wcmVzcy5qcycsICdob21lYnJldycsXG4gICAgICAgICAgICAnYmFja2JvbmUnLCAnbW9tZW50MScsICdtb21lbnRqcycsICdtb21lbnQnLCAnbGludXgnLCAnYW5pbWF0ZS5jc3MnLCAnYW5pbWF0ZS1jc3MnLCAncmV2ZWFsLmpzJywgJ2pxdWVyeS1maWxlLXVwbG9hZCcsICdibHVlaW1wLWZpbGUtdXBsb2FkJywgJ3RocmVlanMnLCAnZXhwcmVzcycsICdjaG9zZW4nLFxuICAgICAgICAgICAgJ25vcm1hbGl6ZS1jc3MnLCAnbm9ybWFsaXplLmNzcycsICdzZW1hbnRpYycsICdzZW1hbnRpYy11aScsICdTZW1hbnRpYy1VSScsICdtb2Rlcm5penInLCAndW5kZXJzY29yZScsICd1bmRlcnNjb3JlMScsXG4gICAgICAgICAgICAnbWF0ZXJpYWwtZGVzaWduLWljb25zJywgJ2lvbmljJywgJ2NoYXJ0anMnLCAnQ2hhcnQuanMnLCAnbm5uaWNrLWNoYXJ0anMnLCAnc2VsZWN0Mi1uZycsICdzZWxlY3QyLWRpc3QnLCAncGhhbnRvbScsICdza3JvbGxyJywgJ3Njcm9sbHInLCAnbGVzcy5qcycsICdsZWFuY3NzJywgJ3BhcnNlci1saWInLFxuICAgICAgICAgICAgJ2h1aScsICdib290c3RyYXAtbGFuZ3VhZ2VzJywgJ2FzeW5jJywgJ2d1bHAnLCAnanF1ZXJ5LXBqYXgnLCAnY29mZmVlc2NyaXB0JywgJ2hhbW1lci5qcycsICdhY2UnLCAnbGVhZmxldCcsICdqcXVlcnktbW9iaWxlJywgJ3N3ZWV0YWxlcnQnLCAndHlwZWFoZWFkLmpzJywgJ3NvdXAnLCAndHlwZWhlYWQuanMnLFxuICAgICAgICAgICAgJ3NhaWxzJywgJ2NvZGVpZ25pdGVyMiddO1xuICAgIH1cbiAgICBpc0Jvd2VyRmlsZShyZXNvdXJjZSkge1xuICAgICAgICB2YXIgcGF0aCA9IHJlc291cmNlLnBhdGg7XG4gICAgICAgIHJldHVybiBTdHJpbmdzLmVuZHNXaXRoKHBhdGgsICcvYm93ZXIuanNvbicpIHx8IFN0cmluZ3MuZW5kc1dpdGgocGF0aCwgJy8uYm93ZXIuanNvbicpO1xuICAgIH1cbiAgICBjb2xsZWN0RGVmYXVsdFN1Z2dlc3Rpb25zKHJlc291cmNlLCByZXN1bHQpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNCb3dlckZpbGUocmVzb3VyY2UpKSB7XG4gICAgICAgICAgICB2YXIgZGVmYXVsdFZhbHVlID0ge1xuICAgICAgICAgICAgICAgICduYW1lJzogJ3t7bmFtZX19JyxcbiAgICAgICAgICAgICAgICAnZGVzY3JpcHRpb24nOiAne3tkZXNjcmlwdGlvbn19JyxcbiAgICAgICAgICAgICAgICAnYXV0aG9ycyc6IFsne3thdXRob3J9fSddLFxuICAgICAgICAgICAgICAgICd2ZXJzaW9uJzogJ3t7MS4wLjB9fScsXG4gICAgICAgICAgICAgICAgJ21haW4nOiAne3twYXRoVG9NYWlufX0nLFxuICAgICAgICAgICAgICAgICdkZXBlbmRlbmNpZXMnOiB7fVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlc3VsdC5hZGQoeyB0eXBlOiAnc25pcHBldCcsIGRpc3BsYXlUZXh0OiAnRGVmYXVsdCBib3dlci5qc29uJywgc25pcHBldDogSlNPTi5zdHJpbmdpZnkoZGVmYXVsdFZhbHVlLCBudWxsLCAnXFx0JyksIGRlc2NyaXB0aW9uOiAnJyB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29sbGVjdFByb3BlcnR5U3VnZ2VzdGlvbnMocmVzb3VyY2UsIGxvY2F0aW9uLCBjdXJyZW50V29yZCwgYWRkVmFsdWUsIGlzTGFzdCwgcmVzdWx0KSB7XG4gICAgICAgIGlmICh0aGlzLmlzQm93ZXJGaWxlKHJlc291cmNlKSAmJiAobG9jYXRpb24ubWF0Y2hlcyhbJ2RlcGVuZGVuY2llcyddKSB8fCBsb2NhdGlvbi5tYXRjaGVzKFsnZGV2RGVwZW5kZW5jaWVzJ10pKSkge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRXb3JkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgcXVlcnlVcmwgPSAnaHR0cHM6Ly9ib3dlci5oZXJva3VhcHAuY29tL3BhY2thZ2VzL3NlYXJjaC8nICsgZW5jb2RlVVJJQ29tcG9uZW50KGN1cnJlbnRXb3JkKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC54aHIoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IHF1ZXJ5VXJsXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHN1Y2Nlc3MpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3Muc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9iaiA9IEpTT04ucGFyc2Uoc3VjY2Vzcy5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KG9iaikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdHMgPSBvYmo7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5hbWUgPSByZXN1bHRzW2ldLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGVzY3JpcHRpb24gPSByZXN1bHRzW2ldLmRlc2NyaXB0aW9uIHx8ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvZGVTbmlwcGV0ID0gSlNPTi5zdHJpbmdpZnkobmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWRkVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlU25pcHBldCArPSAnOiBcInt7Kn19XCInO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNMYXN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZGVTbmlwcGV0ICs9ICcsJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQuYWRkKHsgdHlwZTogJ3Byb3BlcnR5JywgZGlzcGxheVRleHQ6IG5hbWUsIHNuaXBwZXQ6IGNvZGVTbmlwcGV0LCBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb24gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnNldEFzSW5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQuZXJyb3IobmxzLmxvY2FsaXplKCdqc29uLmJvd2VyLmVycm9yLnJlcG9hY2Nlc3MnLCAnUmVxdWVzdCB0byB0aGUgYm93ZXIgcmVwb3NpdG9yeSBmYWlsZWQ6IHswfScsIHN1Y2Nlc3MucmVzcG9uc2VUZXh0KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQuZXJyb3IobmxzLmxvY2FsaXplKCdqc29uLmJvd2VyLmVycm9yLnJlcG9hY2Nlc3MnLCAnUmVxdWVzdCB0byB0aGUgYm93ZXIgcmVwb3NpdG9yeSBmYWlsZWQ6IHswfScsIGVycm9yLnJlc3BvbnNlVGV4dCkpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudG9wUmFua2VkLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvZGVTbmlwcGV0ID0gSlNPTi5zdHJpbmdpZnkobmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhZGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29kZVNuaXBwZXQgKz0gJzogXCJ7eyp9fVwiJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNMYXN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZVNuaXBwZXQgKz0gJywnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5hZGQoeyB0eXBlOiAncHJvcGVydHknLCBsYWJlbDogbmFtZSwgY29kZVNuaXBwZXQ6IGNvZGVTbmlwcGV0LCBkb2N1bWVudGF0aW9uTGFiZWw6ICcnIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJlc3VsdC5zZXRBc0luY29tcGxldGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29sbGVjdFZhbHVlU3VnZ2VzdGlvbnMocmVzb3VyY2UsIGxvY2F0aW9uLCBjdXJyZW50S2V5LCByZXN1bHQpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGdldEluZm9Db250cmlidXRpb24ocmVzb3VyY2UsIGxvY2F0aW9uKSB7XG4gICAgICAgIGlmICh0aGlzLmlzQm93ZXJGaWxlKHJlc291cmNlKSAmJiAobG9jYXRpb24ubWF0Y2hlcyhbJ2RlcGVuZGVuY2llcycsICcqJ10pIHx8IGxvY2F0aW9uLm1hdGNoZXMoWydkZXZEZXBlbmRlbmNpZXMnLCAnKiddKSkpIHtcbiAgICAgICAgICAgIHZhciBwYWNrID0gbG9jYXRpb24uZ2V0U2VnbWVudHMoKVtsb2NhdGlvbi5nZXRTZWdtZW50cygpLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgdmFyIGh0bWxDb250ZW50ID0gW107XG4gICAgICAgICAgICBodG1sQ29udGVudC5wdXNoKHsgY2xhc3NOYW1lOiAndHlwZScsIHRleHQ6IHBhY2sgfSk7XG4gICAgICAgICAgICB2YXIgcXVlcnlVcmwgPSAnaHR0cHM6Ly9ib3dlci5oZXJva3VhcHAuY29tL3BhY2thZ2VzLycgKyBlbmNvZGVVUklDb21wb25lbnQocGFjayk7XG4gICAgICAgICAgICByZXR1cm4gcmVxdWVzdC54aHIoe1xuICAgICAgICAgICAgICAgIHVybDogcXVlcnlVcmxcbiAgICAgICAgICAgIH0pLnRoZW4oKHN1Y2Nlc3MpID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgb2JqID0gSlNPTi5wYXJzZShzdWNjZXNzLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvYmogJiYgb2JqLnVybCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHVybCA9IG9iai51cmw7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoU3RyaW5ncy5zdGFydHNXaXRoKHVybCwgJ2dpdDovLycpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsID0gdXJsLnN1YnN0cmluZyg2KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChTdHJpbmdzLmVuZHNXaXRoKHVybCwgJy5naXQnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybCA9IHVybC5zdWJzdHJpbmcoMCwgdXJsLmxlbmd0aCAtIDQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaHRtbENvbnRlbnQucHVzaCh7IGNsYXNzTmFtZTogJ2RvY3VtZW50YXRpb24nLCB0ZXh0OiB1cmwgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGh0bWxDb250ZW50O1xuICAgICAgICAgICAgfSwgKGVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGh0bWxDb250ZW50O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
