namespace AppDomain {

    class GmailComponent {
        public bindings: any;
        public controller: any;
        public controllerAs: string;
        public templateUrl: string;

        constructor() {
            this.controller = GmailController;
            this.controllerAs = 'vm';
            this.templateUrl = '/app/gmail/gmail.component.html';
        }
    }

    class GmailController {

        isSignedIn: boolean;
        gmailMessages: GmailMessage[];

        static $inject: string[] = ['$scope', 'GoogleAuth', 'GoogleService', '$interval'];

        constructor(private $scope: ng.IScope, private auth: GoogleAuth, private service: GoogleService, public $interval: ng.IIntervalService) {
            console.log('GmailComponent');
            this.$scope.$watch(() => this.auth.isSignedIn, isSignedIn => { this.isSignedIn = isSignedIn; if (isSignedIn) this.getGmailMessages(); });
            //this.$interval(() => { if (this.auth.isSignedIn) this.getGmailMessages(); }, 60000);
        }

        getGmailMessages() {
            this.service.getGmailMessages().then(messages => {
                this.gmailMessages = messages;
                this.$scope.$apply();
            });
        }
    }

    angular.module('app').component('gmailComponent', new GmailComponent());
}
