// myTest.js
describe('clearvoiceSurveys member4 dashboard', function() {
	var host = 'http://localhost:17054';
	dashboardDescription(host);
});
describe('dev.cvsresearch.com', function() {
	var host = 'http://dev.cvsresearch.com:17054';
	dashboardDescription(host);
});

function dashboardDescription(host) {
	it('should have a site logo', function() {
		return LogoAssertion(host);
	});
}

function LogoAssertion(host) {
	var driver = browser.driver;
	driver.get(host + '/Dashboard');
	var img = driver.findElement(by.css('.site-img-logo'));

	expect(img.getText()).not.toBe(null);
}

function AnyPageAssertion(driver) {
	it('should not have a server error', function() {
		expect(driver.page_source.indexOf('Server Error')).toBe(-1);
	});
}