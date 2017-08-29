namespace AppDomain {

    export class MainController {

        currentDate: Date = new Date();
        gmailMessages: GmailMessage[];

        static $inject: string[] = ['$scope', 'GoogleAuth', 'GmailService', '$interval'];

        constructor(private $scope: ng.IScope, private auth: GoogleAuth, private gmailService: GmailService, public $interval: ng.IIntervalService) {
            console.log('MainController initialized');
            this.init();
        }

        init() {
            // set watch on signed-in status
            this.$scope.$watch(() => this.auth.isSignedIn, isSignedIn => { if (isSignedIn) { this.getGmailMessages(); } });
            // set timer for date display, check every minute
            this.$interval(() => {
                this.currentDate = new Date();
                if (!this.auth.isSignedIn) return;
                console.log('Gmail check');
                this.getGmailMessages();
            }, 60000);
        }

        signIn() {
            this.auth.signIn();
        }

        signOut() {
            this.auth.signOut();
        }

        // getGmail() {
        //     // get labels
        //     this.gmailService.getLabels().then(labels => {
        //         this.gmail.labels = <Label[]>labels;
        //     });
        //     // get threads
        //     this.gmailService.getMessages().then(threads => {
        //         this.gmail.threads = <Thread[]>threads;
        //     });
        // }

        getGmailMessages() {
            this.gmailService.getGmailMessages().then(messages => {
                this.gmailMessages = messages;
                this.$scope.$apply();
            });
        }
    }

    angular.module('app').controller('MainController', MainController);

}