namespace AppDomain {

    class NavComponent {
        public bindings: any;
        public controller: any;
        public controllerAs: string;
        public template: string;
        public templateUrl: string;

        constructor() {
            this.controller = NavController;
            this.controllerAs = 'vm';
            this.templateUrl = '/app/nav/nav.component.html';
        }
    }

    class NavController {

        static $inject: string[] = ['$scope', 'GoogleAuth'];

        constructor(private $scope: ng.IScope, private auth: GoogleAuth) { 
            console.log('NavComponent');
        }

        signIn() { 
            this.auth.signIn();
        }

        signOut() {
            this.auth.signOut();
        }
    }

    angular.module('app').component('navComponent', new NavComponent());
}
