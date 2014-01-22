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

	test.assertTextDoesntExist('Server Error', 'server error in '+currentUrl);
};
var testSite = function(base) {
	casper.test.begin(base.name, 5, function suite(test) {


		casper.start(base.host, function() {
			var getCurrentUrl = casper.getCurrentUrl();
			everyPageTests(test, base.host, getCurrentUrl);
			test.assertTitle("Select a panel", "homepage title is the one expected");

			/*this.fill('form[action="/search"]', {
            q: "casperjs"
        }, true); */
		});
		var testOpenPage = function(url, test) {
			casper.thenOpen(url, function() {
				var currentUrl = casper.getCurrentUrl();
				everyPageTests(test, url, currentUrl);
			});
		};

		var urlTarget = base.host + '/surveys/';
		casper.thenOpen(urlTarget, function() {
			var getCurrentUrl = casper.getCurrentUrl();
			everyPageTests(test, urlTarget, getCurrentUrl);
			test.assertExists('.site-img-logo', "main logo is found");
		});
		testOpenPage(base.host + '/surveys/history/', test);
		testOpenPage(base.host+'/surveys/polls/',test);
		testOpenPage(base.host+'/profiles/',test);
		/*
		casper.thenOpen(base.host + '/Surveys/Polls', function() {
			var getCurrentUrl = getCurrentUrl();
			everyPageTests(test, getCurrentUrl);
		})
		casper.thenOpen(base.host + '/profiles', function() {
			var getCurrentUrl = getCurrentUrl();
			everyPageTests(test, getCurrentUrl);
		});
*/
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

/*
casper.test.begin('another site', 1, function suite(test) {
	casper.start(bases[1].host, function() {
		everyPageTests(test);
	})
	casper.run(function() {
		test.done();
	});
});
*/