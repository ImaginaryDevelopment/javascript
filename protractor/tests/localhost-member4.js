// myTest.js

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
function profilesDescription(host){
	var driver= browser.driver;

	describe('index',function(){
		driver.get(host+'/Profiles');
		AnyPageAssertion(driver);
	});
	
}
function surveysDescription(host) {
	var driver = browser.driver;
	describe('index', function() {
		driver.get(host + '/Surveys');
		AnyPageAssertion(driver);
	});
	describe('history',function(){
		driver.get(host+'/Surveys/history');
		AnyPageAssertion(driver);
	});
	describe('polls',function(){
		driver.get(host+'/Surveys/polls');
		AnyPageAssertion(driver);
	})

}

function dashboardDescription(host) {
	var driver = browser.driver;
	driver.get(host + '/Dashboard');
	AnyPageAssertion(driver);
	it('should have a site logo', function() {
		return LogoAssertion(driver);
	});

}

function LogoAssertion(driver, assertions) {

	var img = driver.findElement(by.css('.site-img-logo'));

	expect(img.getText()).not.toBe(null);
}

function AnyPageAssertion(driver) {
	it('should not have a server error', function() {
		var source = driver.getPageSource()
		expect(source).not.toContain('Server Error'); //.indexOf('Server Error')
	});
}