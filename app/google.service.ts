//declare namespace gapi.client.Request { };

namespace AppDomain {

    export class GmailMessage {
        id: string;
        from: string;
        subject: string;
        body: string;
    }

    export class GoogleService {

        static $inject: string[] = ['$q', '$http', '$sce'];

        constructor(private $q: ng.IQService, private $http: ng.IHttpService, private $sce: ng.ISCEService) {
            console.log('GoogleService');
        }

        getGmailMessages() {
            return gapi.client['gmail'].users.threads.list({ userId: 'me', labelIds: ['INBOX', 'UNREAD'] })
                .then(response => {
                    if (response.result.threads === undefined) {
                        return [];
                    }
                    const requests = response.result.threads.map(thread => {
                        return gapi.client['gmail'].users.messages.get({ userId: 'me', id: thread.id })
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

        getCalendarEvents() {
            return gapi.client['gmail'].users.threads.list({ userId: 'me', labelIds: ['INBOX', 'UNREAD'] })
                .then(response => {
                    if (response.result.threads === undefined) {
                        return [];
                    }
                    const requests = response.result.threads.map(thread => {
                        return gapi.client['gmail'].users.messages.get({ userId: 'me', id: thread.id })
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

            getWeatherForecast() {
                let url = 'https://weather.gc.ca/city/pages/on-143_metric_e.html';
                this.$sce.trustAsResourceUrl(url);
                return this.$http.jsonp(url).then(response => {
                    var xxx = response;
                }, response => {
                    var yyy = response;
                })
            }
    }

    angular.module('app').service('GoogleService', GoogleService);
}