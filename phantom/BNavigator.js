phantom.onError = function(msg, trace) {
  var msgStack = ['PHANTOM ERROR: ' + msg];
  if(trace) {
    msgStack.push('TRACE:');
    trace.forEach(function(t) {
      msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.
      function ?' (in function ' + t.
      function +')': ''));
    });
  }
  console.error(msgStack.join('\n'));
};
phantom.injectJs("chai.js");
var assert=chai.assert;
var bAssert = function(delegate,onError){
    try{
      delegate();
    } catch(err){
      if(onError){
        onError(err);
      } else {
        console.error('<chai>'+err+'</chai>');
      }
      
    }
  };

var page = require('webpage').create();


var hasJQuery = false;
var jQueryUrl = 'http://cdnjs.cloudflare.com/ajax/libs/jquery/1.9.0/jquery.min.js';
//phantom.injectJs(jQueryUrl) ;// async
//page.settings.userAgent = 'SpecialAgent';
page.onConsoleMessage = function(msg, line, source) {
  console.log('console> ' + msg);
};
page.onAlert = function(msg) {
  console.log('alert!!> ' + msg);
};
page.onResourceRequested = function(request) {
  if(request.method === 'POST') {
    console.log('Request ' + JSON.stringify(request, undefined, 4));
  }

};
page.onResourceReceived = onEveryResourceReceived;
page.onUrlChanged = function(targetUrl) {
  console.log('navigating to ' + targetUrl);
};

page.onLoadFinished = onEveryPageFinished;

var onEveryResourceReceived=function(response){
  console.log('resource:'+response.url+' stage:'+response.stage);
 var protocol= response.url.substr(0,7);
    if (response.stage === "end" &&
                ((protocol === "http://" && response.status >= 400) ||
                    (protocol === "file://" && !response.headers.length))) {
                console.log("Failed", response.url);
            }
  if(response[0] === 't') {
    console.log('Receive ' + JSON.stringify(response, undefined, 4));
  }

};

var onEveryPageFinished=function(status) {
  console.log('finished loading a page:' + status);
  hasJQuery = page.evaluate(function() {
    return jQuery !== undefined;
  });
  console.log('hasJQuery=' + hasJQuery);
  if(!hasJQuery) {
    console.log('injecting jQuery from ' + jQueryUrl);
    var didInject = page.injectJs(jQueryUrl);
    console.log('injection attempted');
    console.log('injection returned:' + didInject);
  }
  var jQueryVersion = page.evaluate(function() {
    return jQuery().jquery; 
  });
  console.log('jQuery is ' + jQueryVersion);
};

function waitFor(testFx, onReady, timeOutMillis) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3000, //< Default Max Timout is 3s
        start = new Date().getTime(),
        condition = false,
        interval = setInterval(function() {
            if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
                // If not time-out yet and condition not yet fulfilled
                condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
            } else {
                if(!condition) {
                    // If condition still not fulfilled (timeout but condition is 'false')
                    console.log("'waitFor()' timeout");
                    phantom.exit(1);
                } else {
                    // Condition fulfilled (timeout and/or condition is 'true')
                    console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                    typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                    clearInterval(interval); //< Stop this interval
                }
            }
        }, 250); //< repeat check every 250ms
};

//holds next page load finished or resource recieved delegate (ajax expected)
var nextDelegate;
var multicastResourceRecieved=function(resourceDelegate){
  console.log('attempting multicastResourceRecieved');
  nextDelegate=resourceDelegate;
  page.onResourceReceived=function(response){
      nextDelegate=null;
      onEveryResourceReceived(response);
      resourceDelegate(response);
      if(!nextDelegate){
        console.log('onResourceReceived exit');
        phantom.exit(0);
      }
  };
  
}
var multicastResourceRecievedEnd=function(resourceDelegate){
  console.log('attempting multicastResourceRecievedEnd');
  multicastResourceRecieved(function(response){
    if(response.stage!="end"){
      console.log('loopsing multicastResourceRecievedEnd');
      multicastResourceRecievedEnd(resourceDelegate);
    } else {
      console.log('finishing multicastResourceRecievedEnd');
      resourceDelegate(response);
    }
  });
}
var multicastLoadFinished=function(description,pageDelegate,resourceDelegate){
  console.log('attempting multicastLoadFinished');
  var myDelegate;
  if(pageDelegate){
    console.log('setting page delegate:'+description);
  myDelegate=nextDelegate=pageDelegate;  

} else {
  myDelegate=nextDelegate=resourceDelegate;

}
  
  page.onLoadFinished = function(status) {
    console.log('clearing next');
    nextDelegate=null;
    onEveryPageFinished(status);
    myDelegate(status);
    
     console.log('onLoadFinished:'+description+':checking next delegate');
    if(!nextDelegate && !resourceDelegate) { //there's no page load delegate or resource(ajax delegate)
      console.log('onLoadFinished:'+description+':no next delegate, closing');
      phantom.exit(0);
    } else {
      console.log('onLoadFinished:'+description+':found a nextDelegate');
    }
    };
    
     
  
};
