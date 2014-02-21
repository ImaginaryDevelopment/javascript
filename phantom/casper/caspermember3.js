// googletesting.js
var bases = [{
		host: 'http://dev.clearvoicesurveys.com',
		name: 'clearvoicesurveys'
	}
	/* {
	host: 'http://dev.cvsresearch.com:17054',
	name: 'local as dev.cvsresearch.com'
}*/
];

var everyPageTests = function(test, expectedUrl, actualUrl) {
	var currentUrl = expectedUrl + ',' + actualUrl;
	if (expectedUrl === actualUrl) {
		currentUrl = actualUrl;
	}
	casper.echo('currentUrl:' + currentUrl);
	test.assertNotEquals(actualUrl, 'about:blank');
	test.assertEquals(actualUrl, expectedUrl);
	test.assertTextDoesntExist('Server Error', 'searched for server error in ' + currentUrl); //TODO:  capture source File line
};
var redeemSelector = 'a#ctl01_cpBody_ucAccountInfo_cpAccountInfo_lnkRedeem';
var logoutSelector = '#ctl01_ucHeader_ucLogin_lbSignOut';
var loginSelector = 'input[value="Log in"]';
var logout = function(test) {
	casper.echo('logout exists');
	casper.click(logoutSelector);
};

var login = function(test, username, password) {

	test.assertExists('form');
	casper.fillSelectors('form#aspnetForm', {
		'input[value="Email"]': username,
		'input[name="ctl01$ucHeader$ucLogin$txtPassword"]': password
	}, true);
	casper.click(loginSelector);
};

var testSite = function(base) {

	casper.test.begin(base.name + '/Default.aspx', function suite(test) {


		casper.start(base.host + '/Default.aspx', function() {
			var currentUrl = casper.getCurrentUrl();
			everyPageTests(test, base.host + '/Default.aspx', currentUrl);
			test.assertTitle("Clear Voice Surveys", "homepage title is the one expected");
			casper.capture('landed.png');
			/*this.fill('form[action="/search"]', {
            q: "casperjs"
        }, true); */
		});
		casper.then(function() {
			var currentUrl = casper.getCurrentUrl();
			everyPageTests(test, base.host + '/Default.aspx', currentUrl);
		});
		casper.then(function() {
			//logout if the landing page isn't a signed in page
			if (casper.exists(redeemSelector)) {
				casper.bypass(3);
			}
		});
		casper.then(function() {
			casper.echo('logging out');
			logout(test);
			casper.echo('logged out');
		});
		casper.thenOpen(base.host + '/Default.aspx'); //instead of sessionended.aspx
		casper.then(function() { //login
			var currentUrl = casper.getCurrentUrl();
			everyPageTests(test, base.host + '/Default.aspx', currentUrl);
			login(test, 'nospam@nothanks.net', '31415926');
			casper.capture('login1.png');
		});

		casper.then(function() {
			casper.capture('login2.png');
			casper.echo('casper then!');
			var currentUrl = casper.getCurrentUrl();
			casper.echo('currentUrlthen:' + currentUrl);
			everyPageTests(test, base.host + '/Default.aspx', currentUrl);
			if (!casper.exists(redeemSelector, 'redeem my rewards button rendered')) {
				casper.echo('capturing');
				casper.capture('login3.png');
				test.fail('logged in but the rewards button is not rendered');
			}
			if (!logoutExists()) {
				casper.bypass(1);
				test.fail("logged in but there's no logout");
			} else {

				casper.echo('login was a success');
			}
		});

		casper.then(function() {
			logout(test);
		});


		casper.run(function() {
			test.done();
		});
	});
};
for (var i = bases.length - 1; i >= 0; i--) {
	testSite(bases[i]);
};