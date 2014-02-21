var entities = require('..');
var assert = require('assert');

describe('sf-html5-entities', function() {
  var tests = {
    '<div onclick="alert(123)">': '&lt;div onclick&equals;&quot;alert&lpar;123&rpar;&quot;&gt;',
    'üöä': '&uuml;&ouml;&auml;',
    '^°!§$%&/()=?`': '&Hat;&deg;&excl;&sect;&dollar;&percnt;&amp;&sol;&lpar;&rpar;&equals;&quest;&grave;',
    '{[]}\\´': '&lcub;&lsqb;&rsqb;&rcub;&bsol;&acute;',
    '@€+*~\'#': '&commat;&euro;&plus;&ast;~&apos;&num;',
    '<|>,;.:-_–': '&lt;&verbar;&gt;&comma;&semi;&period;&colon;-&lowbar;&ndash;',
  };
  Object.keys(tests).forEach(function(decoded) {
    var encoded = tests[decoded];
    describe('Testing „' + decoded + '”', function() {
      it('should encode this to „' + encoded + '”', function() {
        assert.equal(encoded, entities.encode(decoded));
      });
      it('should decode back to „' + decoded + '”', function() {
        assert.equal(decoded, entities.decode(encoded));
      });
    });
  });
});
