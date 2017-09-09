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

        newsHeadlines: NewsHeadline[];

        static $inject: string[] = ['$scope', 'GoogleService'];

        constructor(private $scope: ng.IScope, private service: GoogleService) {
            console.log('NewsComponent');
            this.getNewsHeadlines('http://rss.newsru.com/top/big/');
        }

        getNewsHeadlines(feed: string) {
            this.service.getNewsHeadlines(feed).then(headlines => {
                this.newsHeadlines = <NewsHeadline[]>headlines;
                //this.$scope.$apply();
            });
        }
    }

    angular.module('app').component('newsComponent', new NewsComponent());
}
