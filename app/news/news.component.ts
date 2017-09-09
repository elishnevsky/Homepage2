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
            //this.bindings = { feed: '<' };
        }
    }

    class NewsController {

        isSignedIn: boolean;
        newsHeadlines: NewsHeadline[];

        static $inject: string[] = ['$scope', 'GoogleAuth', 'GoogleService'];

        constructor(private $scope: ng.IScope, private auth: GoogleAuth, private googleService: GoogleService) {
            console.log('NewsComponent');
            this.$scope.$watch(() => this.auth.isSignedIn, isSignedIn => { 
                this.isSignedIn = isSignedIn; 
                if (isSignedIn) this.getNewsHeadlines('http://rss.newsru.com/top/big/'); 
            });
            //this.getNewsHeadlines();
        }

        getNewsHeadlines(feed: string) {
            this.googleService.getNewsHeadlines(feed).then(headlines => {
                this.newsHeadlines = <NewsHeadline[]>headlines;
                console.log(this.newsHeadlines);
                //this.$scope.$apply();
            });
        }
    }

    angular.module('app').component('newsComponent', new NewsComponent());
}
