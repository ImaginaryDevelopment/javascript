(function () {

    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 250;
    var htmlReporter = new jasmine.HtmlReporter();
    jasmineEnv.addReporter(htmlReporter);
    jasmineEnv.specFilter = function (spec) {
        return htmlReporter.specFilter(spec);
    };
   var currentWindowOnload = window.onload;
  window.onload = function() {
    if (currentWindowOnload) {
      currentWindowOnload();
    }

    document.querySelector('.version').innerHTML = jasmineEnv.versionString();
    execJasmine();
  };
    function execJasmine() {
        console.log("running jasmine");
        jasmineEnv.execute();
    }
})();