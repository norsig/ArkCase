'use strict';

angular.module('profile').controller('ProfileController', ['$scope', 'ConfigService', 'passwordService', '$modal',
    function ($scope, ConfigService, passwordService, $modal) {
        $scope.config = ConfigService.getModule({moduleId: 'profile'});
        $scope.$on('req-component-config', onConfigRequest);
        function onConfigRequest(e, componentId) {
            $scope.config.$promise.then(function (config) {
                var componentConfig = _.find(config.components, {id: componentId});
                $scope.$broadcast('component-config', componentId, componentConfig);
            });
        }
        $scope.changePassword = function () {
            if (this.newPassword === '' || this.newPassword===undefined) {
                 $modal.open({
                    templateUrl: 'modules/profile/views/components/modalTemplates/profile-modal-emptyPassword.client.view.html',
                    controller:'ModalController',
                    backdrop:false,
                    size: 'sm'
                });
            }
            else if (this.newPasswordAgain === ''|| this.newPasswordAgain===undefined) {
                $modal.open({
                    templateUrl: 'modules/profile/views/components/modalTemplates/profile-modal-emptyPasswordAgain.client.view.html',
                    controller:'ModalController',
                    backdrop:false,
                    size: 'sm'
                });
            }
            else if (this.newPassword  !== this.newPasswordAgain ) {
                $modal.open({
                    templateUrl: 'modules/profile/views/components/modalTemplates/profile-modal-differentPasswords.client.view.html',
                    controller:'ModalController',
                    backdrop:false,
                    size: 'sm'
                });
                this.newPassword='';
                this.newPasswordAgain='';
            }
            else {
                var data = '{"outlookPassword":' + '"' + this.newPassword + '"}';
                passwordService.changePassword(data);
                $("#changePassword").modal("hide");
                this.newPassword='';
                this.newPasswordAgain='';
            }

        };
        $scope.cancel=function(){
            $("#changePassword").modal("hide");
            $scope.newPassword = '';
            $scope.newPasswordAgain = '';
        };
    }
]);
angular.module('profile').run(function (editableOptions, editableThemes) {
    editableThemes.bs3.inputClass = 'input-sm';
    editableThemes.bs3.buttonsClass = 'btn-sm';
    editableOptions.theme = 'bs3';
});

angular.module('profile').controller('ModalController', function ($scope, $modalInstance) {
  $scope.close = function () {
    $modalInstance.dismiss('cancel');
  };
});