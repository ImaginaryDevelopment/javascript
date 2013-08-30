 var DeployCtrl = function($scope,$http,$timeout,globals){
      window.deployCtrl = $scope;
      $scope.globals = globals;
      $scope.getJson=function(host,base,path,success,error){
        
        var nodeUri= '/parsed.config?host='+host+'&base='+base+'&path='+path;
        return $http.get(nodeUri).success(success).error(error);
      };
      var getClients=function(data){
          
          var eps= maybe(data,"not attempted")
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

      $scope.getConfig = function(host,base,path){
        $scope.configAttempted=true;

        return $scope.getJson(host,base,path,
          function(data,status,headers,config){
            $scope.configSuccess=true;
            //this one is parsing to JSON properly
            $scope.exeConfig=data;
            $scope.endpoints = getClients(data);// endpoints.result()? endpoints.result():[endpoints.message];
            console.log(data);
          },
          function(){
          $scope.configSuccess=false;

        });
          
      };
      $scope.getManifest = function(host,base,path){
        $scope.attempted=true;
        return $scope.getJson(host,base,path,function(data,status,headers,config){
          $scope.success=true;
          //this xml fails to parse server side
          $scope.xml=parseXml(data);
          $('SignedInfo',$scope.xml).remove();
          $('SignatureValue',$scope.xml).remove();
          $('KeyInfo',$scope.xml).remove();
          var assId=$('assemblyIdentity', $scope.xml);
          $scope.assemblyIdentityName= assId.attr('name');
          $scope.version = assId.attr('version');
          $scope.codebase = $('deploymentProvider',$scope.xml).attr('codebase');
          $scope.installCodeBase= $('dependency dependentAssembly[dependencyType="install"]',
            $scope.xml).attr('codebase');

          if($scope.version && $scope.version.length>0){
            //go get the config
            var deployRoot= path.beforeLast('\\') +'\\';
            var currentDeployedDir=deployRoot + $scope.installCodeBase.beforeLast('\\')+'\\';
            

            $scope.getConfig(host,base,currentDeployedDir+'Mortgageflex.LoanQuest.exe.config.deploy');
          }
        },
        function(){
          $scope.success=false;

        });
      };
  };