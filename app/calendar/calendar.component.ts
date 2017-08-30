namespace AppDomain {

    class CalendarComponent {
        public bindings: any;
        public controller: any;
        public controllerAs: string;
        public template: string;
        public templateUrl: string;

        constructor() {
            this.controller = CalendarController;
            this.controllerAs = 'vm';
            this.templateUrl = '/app/calendar/calendar.component.html';
        }
    }

    class CalendarController {
        
        calendarEvents: any[];
        
        static $inject: string[] = ['$scope', 'GoogleAuth', 'GoogleService'];
        
        constructor(private $scope: ng.IScope, private auth: GoogleAuth, private googleService: GoogleService) {
            console.log('CalendarComponent');
            this.$scope.$watch(() => this.auth.isSignedIn, isSignedIn => { if (isSignedIn) this.getCalendarEvents(); });
        }
        
        getCalendarEvents(): any {
            console.log('getCalendarEvents Method not implemented.')
        }
    }

    angular.module('app').component('calendarComponent', new CalendarComponent());
}