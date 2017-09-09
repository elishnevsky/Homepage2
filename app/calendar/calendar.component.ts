namespace AppDomain {

    class CalendarComponent {
        public bindings: any;
        public controller: any;
        public controllerAs: string;
        public templateUrl: string;

        constructor() {
            this.controller = CalendarController;
            this.controllerAs = 'vm';
            this.templateUrl = '/app/calendar/calendar.component.html';
        }
    }

    class CalendarController {

        signedIn: boolean;
        today: Date = new Date();
        calendarEvents: CalendarEvent[];

        static $inject: string[] = ['$scope', 'GoogleAuth', 'CalendarService', '$interval'];

        constructor(private $scope: ng.IScope, private auth: GoogleAuth, private service: CalendarService, public $interval: ng.IIntervalService) {
            console.log('CalendarComponent');
            this.$scope.$watch(() => this.auth.signedIn, signedIn => { this.signedIn = signedIn; if (signedIn) this.getCalendarEvents(); });
            this.$interval(() => { if (this.auth.signedIn) this.getCalendarEvents(); }, 60000);
        }

        getCalendarEvents() {
            this.service.getCalendarEvents().then(events => {
                this.calendarEvents = <CalendarEvent[]>events;
                this.$scope.$apply();
            });
        }
    }

    angular.module('app').component('calendarComponent', new CalendarComponent());
}
