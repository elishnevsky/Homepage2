declare namespace gapi.client.Request { };

namespace AppDomain {


    export interface GmailMessage {
        from: string;
        subject: string;
        body: string;
    }

    export interface Gmail {
        labels: Label[];
        threads: Thread[];
    }

    export interface Label {
        id: string;
        name: string;
        type: string;
    }

    export interface Thread {
        id: string;
        snippet: string;
        historyId: string;
    }

    export class GmailService {

        static $inject: string[] = ["$q"];

        constructor(private $q: ng.IQService) {

            console.log('GmailService');

        }

        // Get gmail labels
        getLabels() {
            const deferred = this.$q.defer();

            gapi.client["gmail"].users.labels.list({ 'userId': 'me' }).then(response => {
                deferred.resolve(response.result.labels);
            }, response => {
                deferred.reject(response);
            });

            return deferred.promise;
        }

        // getThreads(): any {
        //     const deferred = this.$q.defer();
        //     gapi.client["gmail"].users.threads.list({ userId: 'me', labelIds: ['INBOX', 'UNREAD'] })
        //         .then(response => {
        //             deferred.resolve(response.result.threads);
        //         }, response => {
        //             deferred.reject(response);
        //         });

        //     return deferred.promise;
        // }

        getGmailMessages() {
            return gapi.client["gmail"].users.threads.list({ userId: 'me', labelIds: ['INBOX', 'UNREAD'] })
                .then(response => {
                    const requests = response.result.threads.map(thread => {
                        return gapi.client["gmail"].users.messages.get({ userId: 'me', id: thread.id })
                            .then(response => {
                                let message = response.result;
                                return {
                                    from: message.payload.headers[17].value,
                                    subject: message.payload.headers[21].value,
                                    body: thread.snippet
                                };
                            });
                    });

                    return this.$q.all(requests);
                });
        }

        // getGmailMessages(): any {
        //     const deferred = this.$q.defer();
        //     let gmailMessages: GmailMessage[] = [];
        //     console.log('getGmailMessages');
        //     gapi.client["gmail"].users.threads.list({ userId: 'me', labelIds: ['INBOX', 'UNREAD'] }).then(response => {
        //         let threads = response.result.threads;
        //         angular.forEach(threads, thread => {
        //             gapi.client["gmail"].users.messages.get({ userId: 'me', id: thread.id }).then(response => {
        //                 let message = response.result;
        //                 var gmailMessage = {
        //                     from: message.payload.headers[17].value,
        //                     subject: message.payload.headers[21].value,
        //                     body: thread.snippet
        //                 };
        //                 gmailMessages.push(gmailMessage);
        //             });
        //         });

        //         deferred.resolve(gmailMessages);
        //     });

        //     return deferred.promise;
        // }
    }

    angular.module("app").service("GmailService", GmailService);
}