(function () {

    'use strict';

    angular.module('app.core')
        .config(corsHandler)
        .run(restInterceptors);


    function corsHandler($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
        $httpProvider.interceptors.push(function($cookies) {
            return {
                'request': function(config) {
                    config.headers['X-CSRFToken'] = $cookies.get('csrftoken');
                    return config;
                }
            };
        });
    }

    function restInterceptors(Restangular, httpStatus, $state, loaderModal, localStorageService, toastr) {

        Restangular.setErrorInterceptor(errorInterceptor);
        Restangular.addResponseInterceptor(responseInterceptor);
        Restangular.addFullRequestInterceptor(requestInterceptor);

        function requestInterceptor(element, operation, route, url, headers, params, httpConfig){
            var today = new Date();
            var timezoneHourDifference = (today.getTimezoneOffset()/60);
            var extendedHeader = {
                'Hour-Difference': timezoneHourDifference
            };
            return angular.extend(headers, extendedHeader);
        }


        function responseInterceptor(response,deffered,responseHandler){
            return response;
        }

        function errorInterceptor(response, deferred, responseHandler){
            if(response.status === httpStatus.FORBIDDEN) {
                var lastState = {
                    stateOnLogin: $state.current.name,
                    stateParamsOnLogin: $state.params
                };
                localStorageService.set('lastState',lastState);
                $state.go('login');
                loaderModal.close();
                return false;
            }
            if(response.status === httpStatus.UNAUTHORIZED) {
                console.log(response);
                toastr.error(response.data.error, response.data.title);
                loaderModal.close();
            }
            if(response.status === httpStatus.INTERNAL_SERVER_ERROR){
                if (response.config.url === '/api/login/') {
                    $state.go('login');
                    loaderModal.close();
                }
            }
        }

    }


}());