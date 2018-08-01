'use strict';

angular.module('complaints').controller(
        'Complaints.CloseComplaintController',
        [ '$scope', '$http', '$stateParams', '$translate', '$modalInstance', 'Complaint.InfoService', '$state', 'Object.LookupService', 'MessageService', 'UtilService', '$modal', 'ConfigService', 'ObjectService', 'modalParams', 'Case.InfoService',
                function($scope, $http, $stateParams, $translate, $modalInstance, ComplaintInfoService, $state, ObjectLookupService, MessageService, Util, $modal, ConfigService, ObjectService, modalParams, CaseInfoService) {

                    $scope.modalParams = modalParams;
                    //Functions
                    $scope.dispositionTypeChanged = dispositionTypeChanged;
                    $scope.addApprover = addApprover;
                    $scope.addNewApprover = addNewApprover;
                    $scope.removeApprover = removeApprover;
                    $scope.searchCase = searchCase;
                    $scope.save = save;
                    $scope.cancelModal = cancelModal;
                    //Objects
                    $scope.closeComplaintRequest = {
                        // "id": null,
                        complaintId: modalParams.info.complaintId, //Id na complaint
                        disposition: {
                            closeDate: new Date(),
                            dispositionType: "",
                            referExternalOrganizationName: null,
                            referExternalContactPersonName: null,
                            referExternalContactMethod: null,
                            existingCaseNumber: null,
                            created: null,
                            creator: null,
                            modified: null,
                            modifier: null,
                            className: "com.armedia.acm.plugins.casefile.model.Disposition"
                        },
                        status: "IN APPROVAL",
                        objectType: "CLOSE_COMPLAINT_REQUEST",
                        participants: [ {} ],
                        created: null,
                        creator: null,
                        modified: null,
                        modifier: null
                    // "description": ""
                    };
                    /*$scope.complaint = {
                        "complaintId": null,
                        "status": "DRAFT",
                        "participants": [ {} ],
                        "created": "",
                        "creator": "",
                        "modified": "",
                        "modifier": "",
                        "information": {
                            "id": modalParams.info.complaintId,
                            "number": modalParams.info.complaintNumber,
                            "date": new Date(),
                            "option": "",
                            "resolveOptions": null
                        },
                        "referExternal": null,
                        "existingCase": {
                            "caseNumber": null,
                            "caseTitle": null,
                            "caseCreationDate": null,//Tuka datata od selectiraniot case
                            "casePriority": null
                        }
                    // "description": ""
                    };*/
                    $scope.complaintDispositions = [];
                    $scope.contactTypes = [];
                    $scope.loading = false;
                    $scope.showExistingCase = false;
                    $scope.showReferExternal = false;
                    $scope.loadingIcon = "fa fa-floppy-o";
                    $scope.userSearchConfig = null;
                    $scope.futureTaskConfig = null;

                    ConfigService.getModuleConfig("complaints").then(function(moduleConfig) {
                        $scope.futureTaskConfig = _.find(moduleConfig.components, {
                            id: "newFutureTask"
                        });
                        $scope.userSearchConfig = _.find(moduleConfig.components, {
                            id: "userSearch"
                        });
                    });

                    ConfigService.getComponentConfig("complaints", "participants").then(function(componentConfig) {
                        $scope.config = componentConfig;
                    });

                    ObjectLookupService.getDispositionTypes().then(function(dispositionTypes) {
                        _.forEach(dispositionTypes, function(item) {
                            var dispositionType = {
                                "key": item.key,
                                "value": $translate.instant(item.value)
                            };
                            $scope.complaintDispositions.push(dispositionType);
                        })
                    });

                    ObjectLookupService.getContactMethodTypes().then(function(contactTypes) {
                        _.forEach(contactTypes, function(item) {
                            var dispositionType = {
                                "key": item.key,
                                "value": $translate.instant(item.value)
                            };
                            $scope.contactTypes.push(dispositionType);
                        });
                    });

                    function dispositionTypeChanged(temp) {
                        //TUKA VIDI DRUG NACIN! PRERABOTI
                        if ($scope.closeComplaintRequest.disposition.dispositionType == 'add_existing_case') {
                            $scope.existingCase = {};
                            $scope.showReferExternal = false;
                            $scope.showExistingCase = true;
                        } else if ($scope.closeComplaintRequest.disposition.dispositionType == 'refer_external') {
                            $scope.referExternal = {
                                "date": new Date()
                            };
                            $scope.showReferExternal = true;
                            $scope.showExistingCase = false;
                        } else {
                            $scope.showReferExternal = false;
                            $scope.showExistingCase = false;
                        }
                    }

                    function addNewApprover() {
                        $scope.addApprover(-1);
                    }

                    function removeApprover(approver) {
                        _.remove($scope.closeComplaintRequest.participants, function(object) {
                            return object === approver;
                        });
                    }

                    function addApprover(index) {
                        var params = {};

                        params.header = $translate.instant("complaints.comp.approver.pickerModal.header");
                        params.filter = $scope.futureTaskConfig.userSearch.userFacetFilter;
                        params.extraFilter = $scope.futureTaskConfig.userSearch.userFacetExtraFilter;
                        params.config = Util.goodMapValue($scope.config, "dialogUserPicker");
                        params.modalInstance = $modalInstance;

                        var modalInstance = $modal.open({
                            animation: true,
                            templateUrl: 'modules/complaints/views/components/complaint-approver-picker-search-modal.client.view.html',
                            controller: 'Complaints.ApproverPickerController',
                            size: 'lg',
                            resolve: {
                                modalParams: function() {
                                    return params;
                                }
                            }
                        });

                        modalInstance.result.then(function(data) {
                            if (data) {
                                var approver = {
                                    className: "com.armedia.acm.services.participants.model.AcmParticipant",
                                    objectType: null,
                                    objectId: null,
                                    participantType: "approver",
                                    participantLdapId: data.email_lcs,
                                    created: null,
                                    creator: null,
                                    modified: null,
                                    modifier: null,
                                    privileges: [],
                                    replaceChildrenParticipant: false,
                                    isEditableUser: true,
                                    isEditableType: true,
                                    isDeletable: true
                                };
                                if (index > -1) {
                                    $scope.closeComplaintRequest.participants[index] = approver;
                                } else {
                                    $scope.closeComplaintRequest.participants.push(approver);
                                }
                            }
                        }, function() {
                            return {};
                        });
                    }

                    function searchCase(caseNumber) {
                        CaseInfoService.getCaseInfoByNumber(caseNumber).then(function(caseInfo) {
                            $scope.objectId = caseInfo.id;
                            $scope.existingCase.caseNumber = caseInfo.caseNumber;
                            $scope.closeComplaintRequest.disposition.existingCaseNumber = caseInfo.caseNumber;
                            $scope.existingCase.caseTitle = caseInfo.title;
                            $scope.existingCase.caseCreationDate = caseInfo.created; //Tuka so date vidi!!!
                            $scope.existingCase.casePriority = caseInfo.priority;
                        });
                    }

                    function save() {
                        $scope.loading = true;
                        $scope.loadingIcon = "fa fa-circle-o-notch fa-spin";
                        $http.post('https://acm-arkcase/arkcase/api/latest/plugin/complaint/close?mode=create', $scope.closeComplaintRequest).then(function(data) {
                            console.log(data);
                            $modalInstance.dismiss();
                        });
                    }

                    function cancelModal() {
                        $modalInstance.dismiss();
                    }

                } ]);
