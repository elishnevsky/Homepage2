//declare namespace gapi.client.Request { };

namespace AppDomain {

    export interface GmailMessage {
        id: string;
        from: string;
        subject: string;
        snippet: string;
    }

    export interface CalendarEvent {
        id: string;
        summary: string;
        htmlLink: string;
        start: Date;
        end: Date;
    }

    export interface NewsHeadline {
        title: string;
        content: string;
        description: string;
        link: string;
    }

    export class GoogleService {

        //static $inject: string[] = ['$q', '$http', '$sce'];
        static $inject: string[] = ['$q', '$http'];

        //constructor(private $q: ng.IQService, private $http: ng.IHttpService, private $sce: ng.ISCEService) {
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
                            });
                    });

                    return this.$q.all(requests);
                });
        }

        getCalendarEvents() {
            return gapi.client.calendar.events.list({
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
                        end: new Date(event.end.date == undefined ? event.end.dateTime == undefined ? '' : event.end.dateTime : event.end.date)
                    };
                    return calendarEvent;
                });
                return this.$q.all(results);
            });
        }

        getNewsHeadlines() {
            const feed = 'http://rss.newsru.com/top/big/';
            const url = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(feed);
            return this.$http.get(url).then((response: any) => {
                let items = response.data.items;
                let results = items.map(result => {
                    let newsHeadline: NewsHeadline = {
                        title: 'string',
                        content: 'string',
                        description: 'string',
                        link: 'string'
                    };
                    return newsHeadline;
                });
                return this.$q.all(results);
            });
        };

        // getWeatherForecast() {
        //     // //const url = 'https://weather.gc.ca/city/pages/on-143_metric_e.html';
        //     // //const url = 'http://rss.newsru.com/top/big/';
        //     // //return this.$http.get(url);
        //     // // const url = 'http://samples.openweathermap.org/data/2.5/forecast?q=London,us&mode=xml&appid=b1b15e88fa797225412429c1c50c122a1';
        //     // // const trustedUrl = this.$sce.trustAsResourceUrl(url);
        //     // // return this.$http.jsonp(trustedUrl);
        //     // const url = 'https://api.rss2json.com/v1/api.json?rss_url=http%3A%2F%2Frss.newsru.com%2Ftop%2Fbig%2F';
        //     // return this.$http.get(url).then((response) => {
        //     //     debugger;
        //     //     var sss = response;

        //     // });
        //     return Promise.resolve();
        // }
    }

    angular.module('app').service('GoogleService', GoogleService);
}

