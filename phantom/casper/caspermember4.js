// googletesting.js
casper.test.begin('Cvs4 site', 4, function suite(test) {
	var bases=['http://localhost:17054','http://dev.cvsresearch.com:17054'];
	var everyPageTests=function(){
		test.assertTextDoesntExist('Server Error');
	};
	casper.start(bases[0], function() {
		everyPageTests();
		test.assertTitle("Select a panel", "homepage title is the one expected");
		
		/*this.fill('form[action="/search"]', {
            q: "casperjs"
        }, true); */
	});
	casper.thenOpen('http://localhost:17054/surveys', function() {
		everyPageTests();
		test.assertExists('.site-img-logo', "main logo is found");

	});
	casper.thenOpen(bases[0]+'/profiles',function(){

	});

	/*
	casper.then(function() {

	});
*/
	casper.run(function() {
		test.done();
	});
});
