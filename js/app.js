var app = angular.module('bvbyApp', ['ngRoute', 'ngCookies']);

app
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: '/templates/home-page.html',
                controller: 'MainController',
                controllerAs: 'data'
            })
            .when('/login', {
                templateUrl: '/templates/login.html',
                controller: 'LoginController',
                controllerAs: 'data'
            })
            .when('/logout', {
                templateUrl: '/templates/good-bye.html',
                controller: 'SignoutController',
                controllerAs: 'data'
            })
            .otherwise({ redirctTo: '/login' })
            ;
        // $locationProvider.html5Mode(true);
    }])
    .run(['$rootScope', '$location', '$cookies',
        function ($rootScope, $location, $cookies) {
            $rootScope.currentUser = {};
            $rootScope.logedOut = false;

            if($cookies.get('isLogedIn') === 'true') {
                var currentUser = userDB.filter(function(a) {
                    return a.CustomerId === $cookies.getObject('user');
                });
                $rootScope.currentUser = currentUser[0];
            }

            $rootScope.$on('$locationChangeStart', function (event, next, current) {

                var logedIn = $rootScope.currentUser;
                if (angular.equals(logedIn, {}) && !$rootScope.logedOut) {
                    $location.path('/login');
                } else if ($rootScope.logedOut) {
                    $location.path('/logout');
                } else if (logedIn) {
                    $location.path('/home');
                }
            });
        }
    ])
    .controller('MainController', ['$cookies', '$rootScope', '$location', 'LoginService',
        function ($cookies, $rootScope, $location, LoginService) {
            var user = $rootScope.currentUser;
            this.name = user.CustomerFirstName;
            this.surname = user.CustomerLastName;
            this.fullName = user.CustomerFirstName + ' ' + user.CustomerLastName;
            this.gender = user.CustomerGender;
            this.setHeader = this.gender === 'Male' ? 'gn-male' : 'gn-female';

            this.logOut = function () {
                $cookies.remove('user');
                $cookies.put('isLogedIn', false);
                $rootScope.currentUser = {};
                $rootScope.logedOut = true;
                $location.path('logout');
            }
        }
    ])
    .controller('LoginController', ['$route', '$rootScope', '$location', '$cookies', 'LoginService',
        function LoginController($route, $rootScope, $location, $cookies, LoginService) {
            if (!angular.equals($rootScope.currentUser, {})) {
                $location.path('/home');
            }
            document.title = 'Please login';

            this.check = function () {
                var status = LoginService.login(this.user, this.pass);
                if (typeof status === 'number') {
                    var userInf = userDB[status];
                    $rootScope.currentUser = userInf;
                    $location.path('/home');
                }
            };

            this.togglePassword = function (domId) {
                var dom = document.getElementById(domId);
                dom.type = 'text';
            };
        }
    ])
    .controller('SignoutController', ['$route', '$routeParams', '$location',
        function SignoutController($route, $routeParams, $location) {
            document.title = 'Bye bye!';
        }
    ])
    .factory('LoginService', function ($cookies) {
        return {
            login: function (userName, password) {
                for (var i = 0; i < userDB.length; i++) {
                    if (userDB[i].CustomerUserName === userName && userDB[i].CustomerPassword === password) {
                        $cookies.putObject('user', userDB[i].CustomerId);
                        $cookies.put('isLogedIn', true);
                        return i;
                    }
                }
                return false;
            }
        };
    });

var userDB = [
    {
        "CustomerUserName": "info@1v1y.com",
        "CustomerPassword": "123Abc!",
        "CustomerGender": "Female",
        "CustomerId": "a3dafce8-c776-fd22-8b0a-fa97f706b001",
        "CustomerFirstName": "Info",
        "CustomerLastName": "Information"
    },
    {
        "CustomerUserName": "siparis@1v1y.com",
        "CustomerPassword": "123456",
        "CustomerGender": "Male",
        "CustomerId": "a3dafce8-c776-fd22-8b0a-fa97f706b002",
        "CustomerFirstName": "Siparis",
        "CustomerLastName": "Hatti"
    },
    {
        "CustomerUserName": "admin@1v1y.com",
        "CustomerPassword": "123456",
        "CustomerGender": "Female",
        "CustomerId": "a3dafce8-c776-fd22-8b0a-fa97f706b003",
        "CustomerFirstName": "Hello",
        "CustomerLastName": "World"
    }
];