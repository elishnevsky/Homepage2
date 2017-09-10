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
            //this.bindings = { feed: '<' };
        }
    }

    class WeatherController {

        forecast: WeatherForecast[];

        static $inject: string[] = ['$scope', 'GoogleService'];

        constructor(private $scope: ng.IScope,  private service: GoogleService) {
            console.log('WeatherComponent');
            this.getWeatherForecast('http://rss.theweathernetwork.com/weather/caon0696');
        }

        getWeatherForecast(feed: string) {
            this.service.getWeatherForecast(feed).then(forecast => {
                this.forecast = <WeatherForecast[]>forecast;
            });
        }
    }

    angular.module('app').component('weatherComponent', new WeatherComponent());
}
