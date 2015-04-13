'use strict';

/**
 * @ngdoc service
 * @name osApp.Auth
 * @description
 * # Auth
 * Factory in the osApp.
 */
angular.module('osApp')
    .config(function($httpProvider) {
        $httpProvider.interceptors.push([
            '$injector',
            function($injector) {
                return $injector.get('AuthInterceptor');
            }
        ]);
    })
    .factory('SessionService', function() {
        return {
            get: function(key) {
                return sessionStorage.getItem(key);
            },
            set: function(key, val) {
                return sessionStorage.setItem(key, val);
            },
            unset: function(key) {
                return sessionStorage.removeItem(key);
            }
        }
    })
    .factory('FlashService', function($alert, $rootScope) {
        return {
            show: function(title, message, type, dur) {
                var duration = 3;
                if (typeof dur != "undefined") {
                    duration = dur;
                } else {

                    if (type == "danger") {
                        duration = 6;
                    }
                }

                var myAlert = $alert({
                    title: title,
                    content: message,
                    type: type,
                    placement: 'bottom-right',
                    show: true,
                    duration: duration
                });
                $rootScope.flash = message;
            },
            clear: function() {
                $rootScope.flash = "";
            }
        }
    })
    .factory('AuthInterceptor', function($rootScope, $q, AUTH_EVENTS, SessionService) {
        var numLoadings = 0;

        return {

            request: function(config) {
                numLoadings++;
                $rootScope.isLoading = true;
                $rootScope.$broadcast("loader_show");
                return config;
            },
            response: function(response) {
                if ((--numLoadings) === 0) {
                    $rootScope.$broadcast("loader_hide");
                    $rootScope.isLoading = false;
                }
                return response || $q.when(response);
            },
            responseError: function(response) {
                if (!(--numLoadings)) {
                    $rootScope.$broadcast("loader_hide");
                }
                if (response.status === 401) {
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated,
                        response);
                }
                if (response.status === 403) {
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthorized,
                        response);
                }
                if (response.status === 419 || response.status === 440) {
                    $rootScope.$broadcast(AUTH_EVENTS.sessionTimeout,
                        response);
                }
                if (response.status === 500) {
                    $rootScope.$broadcast('no_connection', response);
                }
                return $q.reject(response);
            }
        };
    })
    .factory('AuthService', function($http, $rootScope, $location, $sanitize, SessionService, SETTINGS, FlashService, AuthInterceptor) {
        var cacheSession = function(response) {
            if (response.role == 1) {
                response.role = "admin";
            }
            SessionService.set('authenticated', true);
            SessionService.set('role', response.role);
        };
        var uncacheSession = function() {
            SessionService.unset('authenticated');
            SessionService.unset('role');
        };
        var loginError = function(response) {
            FlashService.show(response.flash, response.message, 'danger');
        }
        var sanitizeCredentials = function(credentials) {
            return {
                username: $sanitize(credentials.username),
                password: $sanitize(credentials.password),
                remember: credentials.remember
            }
        }
        return {
            login: function(credentials) {
                var login = $http.post(SETTINGS.apiUri + '/login', sanitizeCredentials(credentials));
                login.success(cacheSession);
                login.success(FlashService.clear);
                login.error(loginError);
                return login;
            },
            autoLogin: function() {
                if (!this.isLoggedIn()) {
                    var login = $http.get(SETTINGS.apiUri + '/remember/me');
                    login.success(cacheSession);
                    login.success(FlashService.clear);
                    login.success($location.path('/'));
                    login.error(loginError);
                    return login;
                }
                return false;
            },
            logout: function() {
                var logout = $http.get(SETTINGS.apiUri + '/logout');
                logout.success(uncacheSession);
                return logout;
            },
            isLoggedIn: function() {
                return SessionService.get('authenticated');
            },
            isAuthorized: function(authorizedRoles) {
                if (!angular.isArray(authorizedRoles)) {
                    authorizedRoles = [authorizedRoles];
                }
                return (this.isLoggedIn() &&
                    authorizedRoles.indexOf(SessionService.get('role')) !== -1);
            },
            getUserRole: function() {
                return SessionService.get('role');
            },
            isLoading: function() {
                return $rootScope.isLoading;
            }
        };
    })