namespace AppDomain {

    class GmailComponent {
        public bindings: any;
        public controller: any;
        public controllerAs: string;
        public template: string;
        public templateUrl: string;

        constructor() {
            this.controller = GmailController;
            this.controllerAs = 'vm';
            this.templateUrl = '/app/gmail/gmail.component.html';
        }
    }

    class GmailController {

        gmailMessages: GmailMessage[];

        static $inject: string[] = ['$scope', 'GoogleAuth', 'GoogleService', '$interval'];

        constructor(private $scope: ng.IScope, private auth: GoogleAuth, private googleService: GoogleService, public $interval: ng.IIntervalService) {
            console.log('GmailComponent');
            this.$scope.$watch(() => this.auth.isSignedIn, isSignedIn => { if (isSignedIn) this.getGmailMessages(); });
        }

        getGmailMessages() {
            this.googleService.getGmailMessages().then(messages => {
                this.gmailMessages = messages;
                this.$scope.$apply();
            });
        }
    }

    angular.module('app').component('gmailComponent', new GmailComponent());
}
