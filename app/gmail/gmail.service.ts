namespace AppDomain {

    export interface GmailMessage {
        id: string;
        from: string;
        subject: string;
        snippet: string;
    }

    export class GmailService {

        static $inject: string[] = ['$q', '$http'];

        constructor(private $q: ng.IQService, private $http: ng.IHttpService) {
            console.log('GmailService');
        }

        getGmailMessages() {
            return gapi.client['gmail'].users.threads.list({ userId: 'me', labelIds: ['INBOX', 'UNREAD'] })
                .then(response => {
                    if (response.result.threads === undefined) return [];
                    let requests = response.result.threads.map(thread => {
                        return gapi.client['gmail'].users.messages.get({ userId: 'me', id: thread.id })
                            .then(response => {
                                let message = response.result;
                                let gmailMessage: GmailMessage = {
                                    id: message.id,
                                    from: message.payload.headers.find(header => header.name === 'From').value,
                                    subject: message.payload.headers.find(header => header.name === 'Subject').value,
                                    snippet: thread.snippet
                                };
                                return gmailMessage;
                            });
                    });
                    return this.$q.all(requests);
                });
        }
    }

    angular.module('app').service('GmailService', GmailService);
}

