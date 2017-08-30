namespace AppDomain {

    class MainComponent {
        public bindings: any;
        public controller: any;
        public controllerAs: string;
        public templateUrl: string;

        constructor() {
            this.controller = MainController;
            this.controllerAs = 'vm';
            this.templateUrl = '/app/main/main.component.html';
        }
    }

    class MainController {

        currentDate: Date = new Date();
        isSignedIn: boolean;

        static $inject: string[] = ['$scope', 'GoogleAuth', '$interval'];

        constructor(private $scope: ng.IScope, private auth: GoogleAuth, private $interval: ng.IIntervalService) {
            console.log('MainComponent');
            this.$scope.$watch(() => this.auth.isSignedIn, isSignedIn => { this.isSignedIn = isSignedIn });
            this.$interval(() => { this.currentDate = new Date(); }, 60000);
        }

        signIn() {
            this.auth.signIn();
        }

        signOut() {
            this.auth.signOut();
        }
    }

    angular.module('app').component('mainComponent', new MainComponent());
}
