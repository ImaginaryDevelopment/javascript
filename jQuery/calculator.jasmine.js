console.log(jasmine);
describe("CalculatorHtml", function () {
               it("should have a + button",function(){
                   expect($('input[type=button][value="+"]').length).toBe(1);
               });
    it("should have > 3 operators", function () {
        expect($('.operation').length).toBeGreaterThan(3);
    });
   
});

describe("A suite is just a function", function () {
    var a;

    it("and so is a spec", function () {
        a = true;

        expect(a).toBe(true);
    });
});
(function () {
    console.log("initializing jasmine");
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 250;
    var htmlReporter = new jasmine.HtmlReporter();
    jasmineEnv.addReporter(htmlReporter);
    jasmineEnv.specFilter = function (spec) {
        return htmlReporter.specFilter(spec);
    };
    var currentWindowOnload = window.onload;
    console.log('onload saved');

    document.querySelector('.version').innerHTML = jasmineEnv.versionString();
    console.log('version run');
    execJasmine();


    function execJasmine() {
        console.log("running jasmine");
        jasmineEnv.execute();
    }
})();