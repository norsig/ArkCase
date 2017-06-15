'use strict';

angular.module('admin').factory('Admin.LdapUserManagementService', ['$resource', '$http', '$q',
    function ($resource, $http, $q) {
        return ({
            queryGroupsByDirectory: queryGroupsByDirectory,
            addGroupsToUser: addGroupsToUser,
            removeGroupsFromUser: removeGroupsFromUser,
            cloneUser: cloneUser
        });

        function queryGroupsByDirectory(directory) {
            return $http({
                method: 'GET',
                url: 'api/latest/users/directory/groups/get?directory=' + directory
            });
        };

        function addGroupsToUser(user, groups, directory) {
            var url = 'api/latest/ldap/' + directory + '/manage/' + user +'/groups/add';
            return $http({
                method: 'PUT',
                url: url,
                data: groups
            });
        };

        function removeGroupsFromUser(user, groups, directory) {
            var url = 'api/latest/ldap/' + directory + '/manage/' + user +'/groups/remove';
            return $http({
                method: 'PUT',
                url: url,
                data: groups
            });
        };

        function cloneUser(user) {
            var url = 'api/latest/ldap/' + user.selectedUser.directory + '/users/' + user.selectedUser.key;
            return $http({
                method: 'POST',
                url: url,
                data: {
                    acmUser: user.acmUser,
                    password: user.password
                }
            });
        };
    }
]);
