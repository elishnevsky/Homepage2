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

        // Initializes the API client library and sets up sign-in state listeners
        private initClient() {
            gapi.client.init({
                clientId: CLIENT_ID,
                // apiKey: API_KEY, // <--- С ЭТИМ Я ПОЧЕМУ-ТО НЕ МОГУ ЗАПРОСИТЬ ЛЕЙБЛЫ ИЗ ГМЫЛЕ
                scope: SCOPE,
                discoveryDocs: DISCOVERY_DOCS
            }).then(() => {
                gapi.auth2.getAuthInstance().isSignedIn.listen(isSignedIn => {
                    this.isSignedIn = isSignedIn;
                    this.$rootScope.$apply(); // <--- ЭТО НЕОБХОДИМО ПОТОМУ ЧТО ANGULAR JS ТУПОЙ
                });
                this.isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
                this.$rootScope.$apply(); // <--- ЭТО НЕОБХОДИМО ПОТОМУ ЧТО ANGULAR JS ТУПОЙ
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