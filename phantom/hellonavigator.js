if (!phantom.injectJs('BNavigator.js')) {
	console.log('no navigator');
}
var casper = require('casper').create();
console.log(typeof(bNavigator));
var baseHost = 'http://localhost:17054';



multicastLoadFinished('multicast1!', function() {
	page.open(baseHost, function() {
		bAssert(function() {
			console.log('asserting!');
			nextDelegate = surveysIndex;
			assert.typeOf('test', 'string', 'test is a string');
		});
	});

});

console.log('Hello, world!');

function surveysIndex() {
	page.open(baseHost + '/surveys', function() {
		assert.notMatch(page.content, /Server Error/, 'server error');
		phantom.exit();
	})

}