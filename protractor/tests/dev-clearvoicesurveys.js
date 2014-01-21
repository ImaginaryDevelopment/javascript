// myTest.js
describe('clearvoiceSurveys homepage', function() {
	it('should have a captcha', function() {
		
		var driver = browser.driver;
		driver.get('http://dev.clearvoicesurveys.com/');

		//driver.findElement(by.model('yourName')).sendKeys('Julie');

		var img =driver.findElement(by.id('recaptcha_image'));

		expect(img.getText()).not.toBe(null);
	});
});