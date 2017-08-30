namespace AppDomain {

    const API_KEY = 'AIzaSyBIQf94StM7HHCblv-xNewi5ujj7PScHIY';
    const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest']; // Array of API discovery doc URLs for APIs used by the quickstart
    const CLIENT_ID = '597988925903-n92krp955lrp46mshfndmcvo0sqp2eks.apps.googleusercontent.com'; // Client ID and API key from the Developer Console
    const SCOPE = 'https://www.googleapis.com/auth/gmail.readonly'; // Authorization scopes required by the API; multiple scopes can be included, separated by spaces.
    //const SCOPE = 'https://mail.google.com'

    export class GoogleAuth {

        isSignedIn: boolean;

        static $inject: string[] = ["$rootScope"];

        constructor(private $rootScope: ng.IRootScopeService) {
            console.log('GoogleAuth');
            gapi.load('client:auth2', () => this.initClient());
        }

        private initClient() {
            gapi.client.init({
                clientId: CLIENT_ID,
                // apiKey: API_KEY
                scope: SCOPE,
                discoveryDocs: DISCOVERY_DOCS
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