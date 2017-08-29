//declare namespace gapi.client.Request { };

namespace AppDomain {

    export class GmailMessage {
        id: string;
        from: string;
        subject: string;
        body: string;
    }

    // export interface Label {
    //     id: string;
    //     name: string;
    //     type: string;
    // }

    export class GmailService {

        static $inject: string[] = ["$q"];

        constructor(private $q: ng.IQService) {
            console.log('GmailService initialized');
        }

        // Get gmail labels
        // getLabels() {
        //     const deferred = this.$q.defer();

        //     gapi.client["gmail"].users.labels.list({ 'userId': 'me' }).then(response => {
        //         deferred.resolve(response.result.labels);
        //     }, response => {
        //         deferred.reject(response);
        //     });

        //     return deferred.promise;
        // }

        getGmailMessages() {
            return gapi.client["gmail"].users.threads.list({ userId: 'me', labelIds: ['INBOX', 'UNREAD'] })
                .then(response => {
                    if (response.result.threads === undefined) { 
                        return [];
                    }
                    const requests = response.result.threads.map(thread => {
                        return gapi.client["gmail"].users.messages.get({ userId: 'me', id: thread.id })
                            .then(response => {
                                let message = response.result;
                                return {
                                    id: message.id,
                                    from: message.payload.headers.find(header => header.name === 'From').value,
                                    subject: message.payload.headers.find(header => header.name === 'Subject').value,
                                    body: thread.snippet
                                };
                            });
                    });

                    return this.$q.all(requests);
                });
        }
    }

    angular.module("app").service("GmailService", GmailService);
}