//publishCtrl.js
console.log('loading publishCtrl');
var Service = function(name,path,svc,notes){
        var self=this;
        this.name=name;
        this.path=path;
        this.svc=svc;
        this.notes=notes;
        this.dir="\\"+path.replace("/","\\")+"\\";
        this.url="/"+path.replace("\\","/")+"/"+svc;

        
        var getConfig=function(local){
          var parsed= local? self.parsedlocal:self.parsed;
          return parsed;
        };

        this.getDefaultDatabase= function(local,returnError){
          var parsed=getConfig(local);

          var dd=maybe(parsed,"not attempted")
            ._('configuration',"no configuration")
            ._('dataConfiguration',"no dataConfiguration")
            ._(0,"empty dataConfiguration")
            ._('$',"invalid dataConfiguration")
            ._('defaultDatabase',"no default database");
          var result= dd.result();
          if(!result && returnError)
            return dd.message;
          return result;
        };
        this.getConnectionString=function(local,propName){
          var dd= self.getDefaultDatabase(local);
          if(!dd)
            return;
          var parsed=local? self.parsedlocal:self.parsed;
          var connectionStringsJs= parsed.configuration.connectionStrings[0].add;
          if(!connectionStringsJs)
            return;
          var connectionStrings= connectionStringsJs.arrayMap(function(e){return e.$;});
          var cs=connectionStrings.arrayFirst(function(e){return e.name && e.name==dd;});
          return propName?cs[propName]:cs;
        };
        
        var getClients=function(local){
          var parsed=getConfig(local);
          var eps= maybe(parsed,"not attempted")
            ._('configuration',"no configuration")
            ._('system.serviceModel',"no serviceModel")
            ._(0,"empty serviceModel")
            ._('client',"no clients")
            ._(0,"empty clients")
            ._('endpoint',"no endpoints");
            var result=eps.result();
            if(!result)
          return [eps.message];

          var clients = result
            .arrayMap(function(a){
                return {name:a.$.name,address:a.$.address};
            });

          return clients;
        };
         this.localClients=getClients(true);
        this.remoteClients=getClients(false);
        this.onLocalChanged=function(){
            self.localClients=getClients(true);
        };
        this.onRemoteChanged=function(){
          self.remoteClients=getClients(false);
        };
      };
var PublishCtrl=function($scope,$http,$timeout,globals){
	window.publishCtrl=$scope;
	$scope.globals=globals;
	$scope.sandbox=$scope.globals.sandbox;
	
	$scope.services = [
	    new Service("Wcf Portal","Mortgageflex.Services.Host.LoanQuest","WcfPortal.svc"),
	    new Service("Registration Portal","Mortgageflex.Services.Host.Registration","WcfPortal.svc"),
	    new Service("Program Pricing","Mortgageflex.Services.Host.ProgramPricing","ProgramPricingService.svc"),
	    new Service("Data Lookup","DataLookupService","DataLookupService.svc","path depth issues"),
	    new Service("DocumentPrintingService","Mortgageflex.Services.Host.PrintingService","DocumentPrintingService.svc"),
    ];

	$scope.displayCase= function(){
	    if($scope.globals.mfCase){
	      return $scope.globals.mfCase;
	    }
	    return "______";
	}

	$scope.displaySandbox=function(){
	    if($scope.globals.sandbox){
	      return $scope.globals.sandbox;
	    }
	    return "v___App_";
	}

	$scope.caseUrl= function(){	
		return 'http://'+$scope.displaySandbox()+'.mortgageflex.com/'+$scope.displayCase();
	};

	$scope.environmentName= function(){
    	return $scope.customer ? $scope.customer + '-Cust' : 'Standard-';
	};

	$scope.validcase=function(){
		return $scope.globals.mfCase && ($scope.globals.mfCase.length==5 || $scope.globals.mfCase.beforeOrSelf('.').length==5);
	};

	$scope.deployUrl=function(){
		return '/LoanQuestNETDeploy/publish.htm';
	};

	var ajaxResults={empty:'<span>No data</span>'};


  	$scope.getSvcJson= function(uri,svc,local){
    	return $http.get(uri)
            .success(function(data,status,headers,config){
              console.log('ajax success:'+uri);
              window.parsed= data;
              if(local){
                svc.parsedlocal=data;
                svc.onLocalChanged();
              } else {
                svc.parsed=data;  
                svc.onRemoteChanged();
              }
              
            }).error(function(data,status,headers,config){
              console.log('ajax failure');
              return {error:status};
          });
  	};

  	$scope.getUrlStatus= function(subPath,force){ //force is for full custom paths
    	if(subPath && subPath.length>0 && ($scope.validcase() && $scope.globals.sandbox && !ajaxResults[subPath] && $scope.machineBasePath) || force)
        {
          ajaxResults[subPath]=ajaxResults.empty;
          var targetUrl="http://"+$scope.globals.nodeHost+"/urlstatus?host="+$scope.globals.sandbox+".mortgageflex.com&path=/"+$scope.globals.mfCase+subPath;
          //console.log("getting status of "+targetUrl);
            $http.get(targetUrl)
            .success(function(data,status,headers,config){
              console.log('ajax success:'+JSON.stringify(data)+":"+targetUrl);
              ajaxResults[subPath]='<span class="success">'+data+'</span>';
            }).error(function(data,status,headers,config){
              console.log('ajax failure');
              ajaxResults[subPath]='<span class="error" title="'+subPath+'"">error:'+status+' </span>';
          });
        }
    	return ajaxResults[subPath];
  	};

	$scope.$watch('[globals.sandbox,globals.mfCase]',Cowboy.throttle( 350,  function(){
		ajaxResults={empty:'<span class="case">Loading...?</span>'};
		}),true);
      
	var setLocal=function(name,defaultVal,isGlobal){
		if(!window.localStorage)
		  return;
		var target= isGlobal?$scope.globals:$scope;
		var stored=localStorage.getItem(name);
		if(!target[name] || stored){
		  
		  if(stored){
		      target[name]=stored;  
		    //console.log('found stored:'+name);
		    
		  } else{
		    target[name]=defaultVal;  
		  }
		}

		$scope.$watch((isGlobal?'globals.':'')+name,function(){
		  $timeout(function(){
		     if(target[name]){
		      console.log('storing '+name+' as '+target[name]);
		    localStorage.setItem(name,target[name]);
		  } else {
		    localStorage.removeItem(name);
		  }},500);
		 
		});
      };

	setLocal('mfCase',undefined,true);
	setLocal('sandbox',undefined,true);
	setLocal('customer');
	setLocal('dev');
	setLocal('codebase');
	setLocal('isStandard');
	setLocal('lights',false);
	setLocal('machineBasePath','c$\\MFWebContent\\Cases\\');
    };