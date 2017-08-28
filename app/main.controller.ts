namespace AppDomain {

    export class MainController {

        gmailMessages: GmailMessage[];

        static $inject: string[] = ["$scope", "GoogleAuth", "GmailService"];

        constructor(private $scope: ng.IScope, private auth: GoogleAuth, private gmailService: GmailService) {
            console.log('MainController');
            this.init();
        }

        init() {

            this.$scope.$watch(() => this.auth.isSignedIn, isSignedIn => {
                if (isSignedIn) {
                    this.getGmailMessages();
                }
            });
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

    angular.module("app").controller("MainController", MainController);

}