namespace AppDomain {

    // Application Key assigned in Google Developers Console
    const API_KEY = 'AIzaSyBIQf94StM7HHCblv-xNewi5ujj7PScHIY';
    // Array of API discovery doc URLs for APIs used by the quickstart
    const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest', 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']; 
    // Client ID and API key from the Developer Console
    const CLIENT_ID = '597988925903-n92krp955lrp46mshfndmcvo0sqp2eks.apps.googleusercontent.com'; 
    // Authorization scopes required by the API; multiple scopes can be included, separated by spaces.
    const SCOPE = 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/calendar.readonly'; 

    export class GoogleAuth {

        isSignedIn: boolean;

        static $inject: string[] = ['$rootScope'];

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

    angular.module('app').service('GoogleAuth', GoogleAuth);

}