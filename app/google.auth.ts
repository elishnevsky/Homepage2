namespace AppDomain {

    const API_KEY = 'AIzaSyBIQf94StM7HHCblv-xNewi5ujj7PScHIY';
    const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest',
        "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]; // Array of API discovery doc URLs for APIs used by the quickstart
    const CLIENT_ID = '597988925903-n92krp955lrp46mshfndmcvo0sqp2eks.apps.googleusercontent.com'; // Client ID and API key from the Developer Console
    const SCOPE = 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/calendar.readonly'; // Authorization scopes required by the API; multiple scopes can be included, separated by spaces.

    export class GoogleAuth {

        isSignedIn: boolean;

        static $inject: string[] = ["$rootScope"];

        constructor(private $rootScope: ng.IRootScopeService) {
            console.log('GoogleAuth');
            gapi.load('client:auth2', () => this.initClient());
        }

        private initClient() {
            gapi.client.init({
                //apiKey: API_KEY,
                discoveryDocs: DISCOVERY_DOCS,
                clientId: CLIENT_ID,
                scope: SCOPE
            }).then(() => {
                gapi.auth2.getAuthInstance().isSignedIn.listen(isSignedIn => {
                    this.isSignedIn = isSignedIn;
                    this.$rootScope.$apply();
                });
                this.isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
                this.$rootScope.$apply();
            });
        }

        signIn() {
            gapi.auth2.getAuthInstance().signIn();
        }

        signOut() {
            gapi.auth2.getAuthInstance().signOut();
        }
    }

    angular.module("app").service("GoogleAuth", GoogleAuth);

}