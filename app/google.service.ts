//declare namespace gapi.client.Request { };

namespace AppDomain {

    export interface GmailMessage {
        id: string;
        from: string;
        subject: string;
        snippet: string;
    }

    export class CalendarEvent {
        id: string;
        summary: string;
        htmlLink: string;
        start: Date;
        end: Date;
    }

    export class GoogleService {

        static $inject: string[] = ['$q', '$http'];

        constructor(private $q: ng.IQService, private $http: ng.IHttpService) {
            console.log('GoogleService');
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

                                // return {
                                //     id: message.id,
                                //     from: message.payload.headers.find(header => header.name === 'From').value,
                                //     subject: message.payload.headers.find(header => header.name === 'Subject').value,
                                //     body: thread.snippet
                                // };
                            });
                    });

                    return this.$q.all(requests);
                });
        }

        getCalendarEvents() {
            return gapi.client['calendar'].events.list({
                calendarId: 'primary',
                timeMin: (new Date()).toISOString(),
                showDeleted: false,
                singleEvents: true,
                maxResults: 10,
                orderBy: 'startTime'
            }).then(response => {
                let events = response.result.items;
                let results = events.map(event => {
                    let calendarEvent: CalendarEvent = {
                        id: event.id,
                        summary: event.summary,
                        htmlLink: event.htmlLink,
                        start: new Date(event.start.date == undefined ? event.start.dateTime == undefined ? '' : event.start.dateTime : event.start.date),
                        end: new Date(event.end.date == undefined ? event.end.dateTime == undefined ? '' : event.end.dateTime  : event.end.date)
                    };
                    return calendarEvent;
                });
                return this.$q.all(results);
            });
        }



        getWeatherForecast() {
            //let url = 'https://weather.gc.ca/city/pages/on-143_metric_e.html';
            const url = 'http://rss.newsru.com/top/big/';
            return this.$http.jsonp(url);
            // return this.$resource('http://ajax.googleapis.com/ajax/services/feed/load', {}, {
            //     fetch: { method: 'JSONP', params: { v: '1.0', callback: 'JSON_CALLBACK' } }
            // });
        }
    }

    angular.module('app').service('GoogleService', GoogleService);
}