'use strict';

var findCharactersRx = /./g;
var findAnyEncodedRx = /./g;

(function() {
  var entities = JSON.parse(require('fs').readFileSync(require('path').join(__dirname, 'sf-html5-entity-list.json')));
  var escapeSpecialsRx = /(?=[\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:\-\\])/g;

  encodeNamedRx = new RegExp('[' + entities.map(function(e) {
    characterToAnyMap[e.chr] = e.named.split(' ')[0];
    return e.chr.replace(escapeSpecialCharsRx, '\\');
  }).join('') + ']', 'g');
  encodeNamedRx = new RegExp('[' + entities.map(function(e) {
    characterToAnyMap[e.chr] = e.named.split(' ')[0];
    return e.chr.replace(escapeSpecialCharsRx, '\\');
  }).join('') + ']', 'g');

  entities.forEach(function(e) {
    e.named.split(' ').forEach(function(named) {
      decodeMap[named] = e.chr;
    });
    decodeMap[e.hex] = decodeMap[e.dec] = e.chr;
  });

  decodeRx = new RegExp('(?:' + Object.keys(decodeMap).map(function(named) {
    return named.replace(escapeSpecialCharsRx, '\\');
  }).join('|') + ')', 'g');

  entities = escapeSpecialCharsRx = null;
})();

/**
 * Encodes string to named HTML5 entities.
 * @param {String} str
 * @returns {String}
 */
function EncodeHtml5Entities(str, to) {
  return str.replace(encodeNamedRx, function(chr) {
    return charactersToNamedMap[chr];
  });
}

/**
 * Encodes string to hexadecimal HTML5 entities.
 * @param {String} str
 * @returns {String}
 */
function EncodeHtml5EntitiesToHex(str) {
  return str.replace(findCharactersRx, function(chr) {
    return charactersToHexadecimalsMap[chr];
  });
}

/**
 * Encodes string to decimal HTML5 entities.
 * @param {String} str
 * @returns {String}
 */
function EncodeHtml5EntitiesToDec(str) {
  return str.replace(findCharactersRx, function(chr) {
    return charactersToDecimalsMap[chr];
  });
}

/**
 * Decodes a previously HTML5-encoded string back to its raw form.
 * @param {String} str
 * @returns {String}
 */
function DecodeHtml5Entities(str) {
  return str.replace(decodeRx, function(named) {
    return decodeMap[named];
  });
}

exports.encode = EncodeHtml5Entities;
exports.encodeHex = EncodeHtml5EntitiesToHex;
exports.encodeDec = EncodeHtml5EntitiesToDec;
exports.decode = DecodeHtml5Entities;
