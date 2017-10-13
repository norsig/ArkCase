'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$q', '$state', '$translate'
    , 'UtilService', 'Acm.StoreService', 'Authentication', 'Menus', 'ServCommService', 'Search.AutoSuggestService'
    , 'Config.LocaleService', 'ConfigService', 'Profile.UserInfoService', 'MessageService', 'CreateNewItemDialogService'
    , function ($scope, $q, $state, $translate
        , Util, Store, Authentication, Menus, ServCommService, AutoSuggestService
        , LocaleService, ConfigService, UserInfoService, MessageService, CreateNewItemDialogService) {

        $scope.authentication = Authentication;
        $scope.isCollapsed = false;
        $scope.menu = Menus.getMenu('topbar');

        $scope.config = null;
        $scope.start = '';
        $scope.count = '';
        $scope.inputQuery = '';
        $scope.data = {};
        $scope.data.inputQuery = '';

        ConfigService.getComponentConfig('core', 'header').then(function (config) {
            $scope.config = config;
            $scope.start = Util.goodMapValue(config, 'searchProperties.start', 0);
            $scope.count = Util.goodMapValue(config, 'searchProperties.n', 10);
            $scope.typeAheadColumn = config.typeAheadColumn;
        });

        ServCommService.handleRequest();

        $scope.queryTypeahead = function (typeaheadQuery) {
            var deferred = $q.defer();
            var typeAheadColumn = "title_parseable";
            if ($scope.typeAheadColumn) {
                typeAheadColumn = $scope.typeAheadColumn;
            }
            if (typeaheadQuery.length >= 2) {
                AutoSuggestService.autoSuggest(typeaheadQuery, 'QUICK', null).then(function (res) {
                    var results = _.pluck(res, typeAheadColumn);
                    deferred.resolve(results);
                });
                return deferred.promise;
            }
        };

        var isSelected = false;
        $scope.onSelect = function ($item, $model, $label) {
            isSelected = true;
        };


        $scope.toggleCollapsibleMenu = function () {
            $scope.isCollapsed = !$scope.isCollapsed;
        };

        // Collapsing the menu after navigation
        $scope.$on('$stateChangeSuccess', function () {
            $scope.isCollapsed = false;
        });

        $scope.search = function () {
            $state.go('search', {
                query: $scope.data.inputQuery
            });
        };

        $scope.keyDown = function (event) {
            if (event.keyCode == 13) {
                $scope.isSelected = isSelected;
                $state.go('search', {
                    query: $scope.data.inputQuery,
                    isSelected: $scope.isSelected
                });
            }
            isSelected = false;
        };

        // set application language for the user
        $q.all([Authentication.queryUserInfo(), LocaleService.getSettings()]).then(function(result) {
            var userInfo = result[0];
            var localeData = result[1];
            $scope.localeDropdownOptions = Util.goodMapValue(localeData, 'locales', LocaleService.DEFAULT_LOCALES);
            $scope.localeSelected = LocaleService.requestLocale(userInfo.langCode);
            LocaleService.useLocale($scope.localeSelected.code);
        });

        $scope.changeLocale = function ($event, localeNew) {
            $event.preventDefault();

            $scope.localeSelected = LocaleService.requestLocale(localeNew.code);
            LocaleService.useLocale(localeNew.code);

            Authentication.updateUserLang(localeNew.code).then(
                function () {
                }
                , function (error) {
                    MessageService.error(error.data ? error.data : error);
                    return error;
                }
            );
        };

        // TODO delete UPDATE button and this function if not needed
        $scope.updateLocales = function($event) {
            $event.preventDefault();

            LocaleService.getLatestSettings().then(function(data) {
                $scope.localeDropdownOptions = Util.goodMapValue(data, 'locales', LocaleService.DEFAULT_LOCALES);
                return data;
            });
        };

        $scope.onCreateNew = function(event, itemType) {
            event.preventDefault();
            switch(itemType) {
                case 'newTask':
                    CreateNewItemDialogService.createNewTask();
                    break;
                case 'newPerson':
                    CreateNewItemDialogService.createNewPerson();
                    break;
                case 'newOrganization':
                    CreateNewItemDialogService.createNewOrganization();
                    break;
                case 'new-document-repository':
                    CreateNewItemDialogService.createNewDocumentRepository();
                    break;
                case 'frevvo.new-timesheet':
                    $state.go(itemType);
                    break;
                case 'frevvo.new-costsheet':
                    $state.go(itemType);
                    break;
                case 'frevvo.new-case':
                    $state.go(itemType);
                    break;
                case 'frevvo.new-complaint':
                    $state.go(itemType);
                    break;
            }
        };
    }
]);