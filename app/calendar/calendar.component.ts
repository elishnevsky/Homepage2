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

        isSignedIn: boolean;
        today: Date = new Date();
        calendarEvents: CalendarEvent[];

        static $inject: string[] = ['$scope', 'GoogleAuth', 'GoogleService'];

        constructor(private $scope: ng.IScope, private auth: GoogleAuth, private googleService: GoogleService) {
            console.log('CalendarComponent');
            this.$scope.$watch(() => this.auth.isSignedIn, isSignedIn => { this.isSignedIn = isSignedIn; if (isSignedIn) this.getCalendarEvents(); });
        }

        getCalendarEvents() {
            this.googleService.getCalendarEvents().then(events => {
                this.calendarEvents = <CalendarEvent[]>events;
                this.$scope.$apply();
            });
        }
    }

    angular.module('app').component('calendarComponent', new CalendarComponent());
}
