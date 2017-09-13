namespace AppDomain {

    class BookmarksComponent {
        public bindings: any;
        public controller: any;
        public controllerAs: string;
        public templateUrl: string;

        constructor() {
            this.controller = BookmarksController;
            this.controllerAs = 'vm';
            this.templateUrl = '/app/bookmarks/bookmarks.component.html';
            //this.bindings = { feed: '<' };
        }
    }

    class BookmarksController {

        headlines: NewsHeadline[];

        static $inject: string[] = ['$scope', 'GoogleService'];

        constructor(private $scope: ng.IScope, private service: GoogleService) {
            console.log('BookmarksComponent');
            this.getNewsHeadlines('http://rss.newsru.com/top/big/');
        }

        getNewsHeadlines(feed: string) {
            this.service.getNewsHeadlines(feed).then(headlines => {
                this.headlines = <NewsHeadline[]>headlines;
                //this.$scope.$apply();
            });
        }
    }

    angular.module('app').component('bookmarksComponent', new BookmarksComponent());
}
