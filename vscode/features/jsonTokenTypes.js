'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var TOKEN_DELIM_OBJECT = exports.TOKEN_DELIM_OBJECT = 'punctuation.bracket.json';
var TOKEN_DELIM_ARRAY = exports.TOKEN_DELIM_ARRAY = 'punctuation.array.json';
var TOKEN_DELIM_COLON = exports.TOKEN_DELIM_COLON = 'punctuation.colon.json';
var TOKEN_DELIM_COMMA = exports.TOKEN_DELIM_COMMA = 'punctuation.comma.json';
var TOKEN_VALUE_BOOLEAN = exports.TOKEN_VALUE_BOOLEAN = 'support.property-value.keyword.json';
var TOKEN_VALUE_NULL = exports.TOKEN_VALUE_NULL = 'support.property-value.constant.other.json';
var TOKEN_VALUE_STRING = exports.TOKEN_VALUE_STRING = 'support.property-value.string.value.json';
var TOKEN_VALUE_NUMBER = exports.TOKEN_VALUE_NUMBER = 'support.property-value.constant.numeric.json';
var TOKEN_PROPERTY_NAME = exports.TOKEN_PROPERTY_NAME = 'support.type.property-name.json';
var TOKEN_COMMENT_BLOCK = exports.TOKEN_COMMENT_BLOCK = 'comment.block.json';
var TOKEN_COMMENT_LINE = exports.TOKEN_COMMENT_LINE = 'comment.line.json';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZzY29kZS9mZWF0dXJlcy9qc29uVG9rZW5UeXBlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJQTs7Ozs7QUFFTyxJQUFNLGtEQUFxQiwwQkFBM0I7QUFDQSxJQUFNLGdEQUFvQix3QkFBMUI7QUFDQSxJQUFNLGdEQUFvQix3QkFBMUI7QUFDQSxJQUFNLGdEQUFvQix3QkFBMUI7QUFDQSxJQUFNLG9EQUFxQixxQ0FBM0I7QUFDQSxJQUFNLDhDQUFrQiw0Q0FBeEI7QUFDQSxJQUFNLGtEQUFxQiwwQ0FBM0I7QUFDQSxJQUFNLGtEQUFxQiw4Q0FBM0I7QUFDQSxJQUFNLG9EQUFzQixpQ0FBNUI7QUFDQSxJQUFNLG9EQUFzQixvQkFBNUI7QUFDQSxJQUFNLGtEQUFxQixtQkFBM0IiLCJmaWxlIjoidnNjb2RlL2ZlYXR1cmVzL2pzb25Ub2tlblR5cGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICogIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLiBTZWUgTGljZW5zZS50eHQgaW4gdGhlIHByb2plY3Qgcm9vdCBmb3IgbGljZW5zZSBpbmZvcm1hdGlvbi5cclxuICotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbmV4cG9ydCBjb25zdCBUT0tFTl9ERUxJTV9PQkpFQ1QgPSAncHVuY3R1YXRpb24uYnJhY2tldC5qc29uJztcclxuZXhwb3J0IGNvbnN0IFRPS0VOX0RFTElNX0FSUkFZID0gJ3B1bmN0dWF0aW9uLmFycmF5Lmpzb24nO1xyXG5leHBvcnQgY29uc3QgVE9LRU5fREVMSU1fQ09MT04gPSAncHVuY3R1YXRpb24uY29sb24uanNvbic7XHJcbmV4cG9ydCBjb25zdCBUT0tFTl9ERUxJTV9DT01NQSA9ICdwdW5jdHVhdGlvbi5jb21tYS5qc29uJztcclxuZXhwb3J0IGNvbnN0IFRPS0VOX1ZBTFVFX0JPT0xFQU49ICdzdXBwb3J0LnByb3BlcnR5LXZhbHVlLmtleXdvcmQuanNvbic7XHJcbmV4cG9ydCBjb25zdCBUT0tFTl9WQUxVRV9OVUxMPSAnc3VwcG9ydC5wcm9wZXJ0eS12YWx1ZS5jb25zdGFudC5vdGhlci5qc29uJztcclxuZXhwb3J0IGNvbnN0IFRPS0VOX1ZBTFVFX1NUUklORyA9ICdzdXBwb3J0LnByb3BlcnR5LXZhbHVlLnN0cmluZy52YWx1ZS5qc29uJztcclxuZXhwb3J0IGNvbnN0IFRPS0VOX1ZBTFVFX05VTUJFUiA9ICdzdXBwb3J0LnByb3BlcnR5LXZhbHVlLmNvbnN0YW50Lm51bWVyaWMuanNvbic7XHJcbmV4cG9ydCBjb25zdCBUT0tFTl9QUk9QRVJUWV9OQU1FID0gJ3N1cHBvcnQudHlwZS5wcm9wZXJ0eS1uYW1lLmpzb24nO1xyXG5leHBvcnQgY29uc3QgVE9LRU5fQ09NTUVOVF9CTE9DSyA9ICdjb21tZW50LmJsb2NrLmpzb24nO1xyXG5leHBvcnQgY29uc3QgVE9LRU5fQ09NTUVOVF9MSU5FID0gJ2NvbW1lbnQubGluZS5qc29uJzsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
