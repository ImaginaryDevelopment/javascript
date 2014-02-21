// googletesting.js
var bases = [{
	host: 'http://localhost:17054',
	name: 'localhost'
}, {
	host: 'http://dev.cvsresearch.com:17054',
	name: 'local as dev.cvsresearch.com'
}];
var everyPageTests = function(test, expectedUrl, actualUrl) {
	var currentUrl = expectedUrl + ',' + actualUrl;
	if (expectedUrl === actualUrl) {
		currentUrl = actualUrl;
	}
	test.assertNotEquals(actualUrl,'about:blank');
	test.assertTextDoesntExist('Server Error', 'searched for server error in ' + currentUrl); //TODO:  capture source File line
};
var testSite = function(base) {
	var testPages = ['home/about','surveys/history', 'surveys/polls',  'rewards','rewards/sweepstakes','Reviews','profiles'];
	casper.test.begin(base.name, function suite(test) {


		casper.start(base.host, function() {
			var currentUrl = casper.getCurrentUrl();
			everyPageTests(test, base.host + '/', currentUrl);
			test.assertTitle("Select a panel", "homepage title is the one expected");

			/*this.fill('form[action="/search"]', {
            q: "casperjs"
        }, true); */
		});
		var testOpenPage = function(test, url, otherTests) {
			casper.thenOpen(url, function() {
				var currentUrl = casper.getCurrentUrl();
				everyPageTests(test, url, currentUrl);
				if (otherTests) {
					otherTests(test, url);
				}
			});
		};
		
		for (var i = testPages.length - 1; i >= 0; i--) {
			testOpenPage(test, base.host + '/' + testPages[i] + '/');
		};
		testOpenPage(test, base.host + '/surveys/', function(test, url) {
			test.assertExists('.site-img-logo', "main logo is found");
		});

		/*
	casper.then(function() {

	});
*/
		casper.run(function() {
			test.done();
		});
	});
};
for (var i = bases.length - 1; i >= 0; i--) {
	testSite(bases[i]);
};
