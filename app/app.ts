namespace AppDomain {

    angular.module('app', ['ngSanitize']);
    angular.module('app').config(function ($sceDelegateProvider: ng.ISCEDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            // Allow same origin resource loads.
            'self',
            // Allow loading from our assets domain. **.
            'https://weather.gc.ca/**'
          ]);

    });

    console.log('App');

}

