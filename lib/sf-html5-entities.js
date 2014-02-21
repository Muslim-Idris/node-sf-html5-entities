'use strict';

// Regular expression to find any encodeable HTML5 entity
var findCharactersRx = /./g;
// Regular expression to find any type of encoded HTML5 entities (named, hexadecimal and decimal)
var findAnyEncodedRx = /./g
// Mapping table for named-to-character, hexadecimal-to-character and decimal-to-character conversions
var AnyToCharactersMap = {};
// Mapping table for character-to-named conversions
var charactersToNamedMap = {};
// Mapping table for character-to-decimal conversions
var charactersToDecimalsMap = {};
// Mapping table for character-to-hexadecimal conversions
var charactersToHexadecimalsMap = {};

(function() {
  var entities = JSON.parse(require('fs').readFileSync(require('path').join(__dirname, 'sf-html5-entity-list.json')));
  var escapeSpecialsRx = /(?=[\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:\-\\])/g;

  entities.forEach(function(e) {
    var nameList = e.named.split(' ');
    nameList.forEach(function(named) {
      AnyToCharactersMap[named] = e.chr;
    });
    AnyToCharactersMap[e.hex] = AnyToCharactersMap[e.dec] = e.chr;
    charactersToNamedMap[e.chr] = nameList[0];
    charactersToDecimalsMap[e.chr] = e.dec;
    charactersToHexadecimalsMap[e.chr] = e.hex;
  });

  findCharactersRx = new RegExp('[' + Object.keys(charactersToDecimalsMap).map(function(chr) {
    return chr.replace(escapeSpecialsRx, '\\');
  }).join('') + ']', 'g');

  findAnyEncodedRx = new RegExp('(?:&(?:' + Object.keys(charactersToNamedMap).map(function(chr) {
    return charactersToNamedMap[chr].slice(1, -1);
  }).join('|') + ');)|(?:#x(?:' + Object.keys(charactersToHexadecimalsMap).map(function(chr) {
    return charactersToHexadecimalsMap[chr].slice(3, -1);
  }).join('|') + ');)|(?:#(?:' + Object.keys(charactersToDecimalsMap).map(function(chr) {
    return charactersToDecimalsMap[chr].slice(2, -1);
  }).join('|') + ');)', 'g');

  entities = escapeSpecialsRx = null;
})();

/**
 * Encodes string to named HTML5 entities.
 * @param {String} str
 * @returns {String}
 */
function EncodeHtml5Entities(str, to) {
  return str.replace(findCharactersRx, function(chr) {
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
  return str.replace(findAnyEncodedRx, function(entity) {
    return AnyToCharactersMap[entity];
  });
}

exports.encode = EncodeHtml5Entities;
exports.encodeHex = EncodeHtml5EntitiesToHex;
exports.encodeDec = EncodeHtml5EntitiesToDec;
exports.decode = DecodeHtml5Entities;
