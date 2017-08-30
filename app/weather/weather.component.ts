namespace AppDomain {

    class WeatherComponent {
        public bindings: any;
        public controller: any;
        public controllerAs: string;
        public template: string;
        public templateUrl: string;

        constructor() {
            this.controller = WeatherController;
            this.controllerAs = 'vm';
            this.templateUrl = '/app/weather/weather.component.html';
        }
    }

    class WeatherController {
        
        static $inject: string[] = ['$scope', 'GoogleAuth', 'GoogleService'];
        
        constructor(private $scope: ng.IScope, private auth: GoogleAuth, private googleService: GoogleService) {
            console.log('WeatherComponent');
            this.$scope.$watch(() => this.auth.isSignedIn, isSignedIn => { if (isSignedIn) this.getWeatherForecast(); });
        }
        
        getWeatherForecast(): any {
            console.log('getWeatherForecast Method not implemented.')
        }
    }

    angular.module('app').component('weatherComponent', new WeatherComponent());
}
