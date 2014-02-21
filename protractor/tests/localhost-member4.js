
var browser = require("zombie");
var assert = require("assert");

beforeEach(function() {
	this.addMatchers({
		toNotContain: function(expected, requestedUrl) {
			this.message = function() {
				return ["Expected src not to contain '" + expected + "',found at " + this.actual.indexOf(expected) + '. was type ' + typeof(this.actual) + ' url:' + requestedUrl];
			};
			return this.actual.indexOf(expected) == -1;
		}
	});

});
describe('clearvoiceSurveys member4 dashboard', function() {
	var host = 'http://localhost:17054';
	dashboardDescription(host);
	surveysDescription(host);
	profilesDescription(host);
});
describe('dev.cvsresearch.com', function() {
	var host = 'http://dev.cvsresearch.com:17054';
	dashboardDescription(host);
	surveysDescription(host);
	profilesDescription(host);
});

function profilesDescription(host) {
	var driver = browser.driver;
	describe('profiles', function() {
		describe('index', function() {
			var url = host + '/Profiles';
			driver.get(url);
			AnyPageAssertion(driver, url);
		});
	});
}

function surveysDescription(host) {
	describe('surveys', function() {
		var driver = browser.driver;
		describe('index', function() {
			var url = host + '/Surveys';
			driver.get(url);
			AnyPageAssertion(driver, url);
		});
		describe('history', function() {
			var url = host + '/Surveys/history';
			driver.get(url);
			AnyPageAssertion(driver, url);
		});
		describe('polls', function() {
			var url = host + '/Surveys/polls';
			driver.get(url);
			AnyPageAssertion(driver, url);
		});
	});
}

function dashboardDescription(host) {
	var driver = browser.driver;
	describe('dashboard', function() {
		var url = host + '/Dashboard';
		driver.get(url);
		AnyPageAssertion(driver, url);
		it('should have a site logo', function() {
			return LogoAssertion(driver);
		});


	});
}

function LogoAssertion(driver, assertions) {

	var img = driver.findElements(by.css('.site-img-logo')).then(function(array) {
		expect(array.length).not.toBe(0);
	});

	//expect(img.getText()).not.toBe(null);
}

function AnyPageAssertion(driver, requestedUrl) {
	/*it('should not have a server error', function() {
		driver.getPageSource().then(function(src){
			driver.getCurrentUrl().then(function(url){
				expect(src).toNotContain('Server Error', url+','+requestedUrl); //.indexOf('Server Error')	
			})
			
		});

		//expect(source).not.toContain('Server Error');
		
	}); */
}