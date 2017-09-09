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

        signedIn: boolean;
        gmailMessages: GmailMessage[];

        static $inject: string[] = ['$scope', 'GoogleAuth', 'GmailService', '$interval'];

        constructor(private $scope: ng.IScope, private auth: GoogleAuth, private service: GmailService, public $interval: ng.IIntervalService) {
            console.log('GmailComponent');
            this.$scope.$watch(() => this.auth.signedIn, signedIn => { this.signedIn = signedIn; if (signedIn) this.getGmailMessages(); });
            this.$interval(() => { if (this.auth.signedIn) this.getGmailMessages(); }, 60000);
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
