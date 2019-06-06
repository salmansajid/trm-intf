(function () {
    'use strict';
    angular.module('app.dashboard.user')
        .controller('User', User);

    function User(allUsers, appFormats, $state, user, loaderModal, toastr){
        var vm = this;
        _init();

        function _init(){
            vm.showForm = false;
            vm.allUsers = allUsers;
            vm.appFormats = appFormats;
            vm.addNewUser = addNewUser;
            vm.editUser = editUser;
            vm.setUserActive = setUserActive;
            vm.setUserReadOnly = setUserReadOnly;

        }

        function editUser(userId){
            $state.go('dashboard.user.profile', {id:userId});
        }

        function setUserActive(user_obj){
            loaderModal.open();
            user.changeUserActive(user_obj.id, user_obj.active).then(function(response){
                if(response.success){
                    user_obj.active = !user_obj.active;
                    toastr.success(response.message);
                    loaderModal.close();
                }
            });

        }

        function setUserReadOnly(user_obj){
            loaderModal.open();
            user.changeUserReadOnly(user_obj.id, user_obj.readOnly).then(function(response){
                if(response.success){
                    user_obj.readOnly = !user_obj.readOnly;
                    toastr.success(response.message);
                    loaderModal.close();
                }
            });
        }

        function addNewUser(){
           $state.go('dashboard.user.profile', {id: 'new'});
        }
    }

})();
