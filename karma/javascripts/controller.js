myModule.controller('MainCtrl', function($scope, angelloModel, angelloHelper) {

  $scope.currentStory;
  $scope.types = angelloModel.getTypes();
  $scope.statuses = angelloModel.getStatuses();
  $scope.stories = angelloModel.getStories();
  $scope.typesIndex = angelloHelper.buildIndex($scope.types, 'name');
  $scope.statusesIndex = angelloHelper.buildIndex($scope.statuses, 'name');

  $scope.setCurrentStatus = function(status) {
    if (typeof $scope.currentStory !== 'undefined') {
      $scope.currentStory.status = status.name;
    }
  };
  $scope.setCurrentType = function(type) {
    if (typeof $scope.currentStory !== 'undefined') {
      $scope.currentStory.type = type.name;
    }
  };

  $scope.createStory = function() {
    $scope.stories.push({
      title: 'New Story',
      description: 'Description pending.'
    });
  };
  
 
  $scope.setCurrentStory = function(story) {
    //console.log('story set');
    $scope.currentStory = story;
    $scope.currentStatus = $scope.statusesIndex[story.status];
    $scope.currentType = $scope.typesIndex[story.type];
  };
}); // end controller