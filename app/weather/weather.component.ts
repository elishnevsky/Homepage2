namespace AppDomain {

    class WeatherComponent {
        public bindings: any;
        public controller: any;
        public controllerAs: string;
        public templateUrl: string;

        constructor() {
            this.controller = WeatherController;
            this.controllerAs = 'vm';
            this.templateUrl = '/app/weather/weather.component.html';
        }
    }

    class WeatherController {

        weatherForecast: any;

        static $inject: string[] = ['$scope', 'GoogleAuth', 'GoogleService'];

        constructor(private $scope: ng.IScope, private auth: GoogleAuth, private googleService: GoogleService) {
            console.log('WeatherComponent');
            this.$scope.$watch(() => this.auth.isSignedIn, isSignedIn => { if (isSignedIn) this.getWeatherForecast(); });
        }

        getWeatherForecast(): any {
            console.log('WeatherComponent.getWeatherForecast()')
            this.googleService.getWeatherForecast().then(forecast => {
                this.weatherForecast = forecast;
                this.$scope.$apply();
            });
            return;
        }
    }

    angular.module('app').component('weatherComponent', new WeatherComponent());
}
