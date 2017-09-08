namespace AppDomain {

    class NewsComponent {
        public bindings: any;
        public controller: any;
        public controllerAs: string;
        public templateUrl: string;

        constructor() {
            this.controller = NewsController;
            this.controllerAs = 'vm';
            this.templateUrl = '/app/news/news.component.html';
        }
    }

    class NewsController {

        isSignedIn: boolean;
        newsHeadlines: any[];

        static $inject: string[] = ['$scope', 'GoogleAuth', 'GoogleService'];

        constructor(private $scope: ng.IScope, private auth: GoogleAuth, private googleService: GoogleService) {
            console.log('NewsComponent');
            this.$scope.$watch(() => this.auth.isSignedIn, isSignedIn => { if (isSignedIn) this.getNewsHeadlines(); });
        }

        getNewsHeadlines(): any {
            this.googleService.getNewsHeadlines().then(headlines => {
                this.newsHeadlines = headlines;
                this.$scope.$apply();
            });
            return;
        }
    }

    angular.module('app').component('newsComponent', new NewsComponent());
}
