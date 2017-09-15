namespace AppDomain {

    export class GmailMessage {
        id: string;
        from: string;
        subject: string;
        snippet: string;
    }

    export class CalendarEvent {
        id: string;
        summary: string;
        htmlLink: string;
        start?: Date;
        end?: Date;
    }

    export class NewsHeadline {
        title: string;
        link: string;
        description: string;
        icon: string;
    }

    export class WeatherForecast {
        day: string;
        condition: string;
        icon: string;
        low: string;
        high: string;
    }

    export class GoogleService {

        static $inject: string[] = ['$q', '$http'];

        constructor(private $q: ng.IQService, private $http: ng.IHttpService) {
            console.log('GoogleService');
        }

        getGmailMessages() {
            let params = { userId: 'me', labelIds: ['INBOX', 'UNREAD'] };
            return gapi.client['gmail'].users.threads.list(params)
                .then(response => {
                    if (response.result.threads === undefined) return [];
                    let requests = response.result.threads.map(thread => {
                        let params = { userId: 'me', id: thread.id };
                        return gapi.client['gmail'].users.messages.get(params)
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


        // getCalendarEvents() {
        //     // calendarId: 'primary, slishnevsky@gmail.com, vlishnevsky@gmail.com, #contacts@group.v.calendar.google.com',
        //     return gapi.client.calendar.calendarList.list().then(response => {
        //         if (response.result.items === undefined) return [];
        //         let requests = response.result.items.map(calendar => {
        //             let params = { calendarId: calendar.id, timeMin: (new Date()).toISOString(), showDeleted: false, singleEvents: true, maxResults: 10 };
        //             return gapi.client.calendar.events.list(params).then(response => {
        //                 let events: any = response.result.items;
        //                 return events.map(event => {
        //                     let calendarEvent: CalendarEvent = {
        //                         id: event.id,
        //                         summary: event.summary,
        //                         htmlLink: event.htmlLink,
        //                         start: new Date(event.start.date == undefined ? event.start.dateTime == undefined ? '' : event.start.dateTime : event.start.date),
        //                         end: new Date(event.end.date == undefined ? event.end.dateTime == undefined ? '' : event.end.dateTime : event.end.date)
        //                     };
        //                     return calendarEvent;
        //                 });
        //             });

        //         });
        //         return this.$q.all(requests);
        //     })
        //         .then(events => {
        //             let allEvents = [];
        //             events.forEach((e: any) => {
        //                 allEvents = allEvents.concat(e);
        //             });
        //             return allEvents;
        //         });
        // }

        getCalendarEvents(): ng.IPromise<CalendarEvent[]> {
            const defer = this.$q.defer<CalendarEvent[]>();

            gapi.client.calendar.calendarList.list().then(response => {
                const promises: any = [];
                response.result.items.map(calendar => {
                    const params = { calendarId: calendar.id, timeMin: (new Date()).toISOString(), showDeleted: false, singleEvents: true, maxResults: 10 };
                    const promise = gapi.client.calendar.events.list(params).then(response => response.result.items);
                    promises.push(promise);
                });
                return this.$q.all(promises);
            }).then(events => {
                let allEvents = [];
                events.forEach((e: any) => {
                    allEvents = allEvents.concat(e);
                });
                return allEvents;
            }).then((events: gapi.client.calendar.Event[]) => {
                return events.map(event => {
                    const calendarEvent: CalendarEvent = {
                        id: event.id,
                        summary: event.summary,
                        htmlLink: event.htmlLink,
                        start: new Date(event.start.date == undefined ? event.start.dateTime == undefined ? '' : event.start.dateTime : event.start.date),
                        end: new Date(event.end.date == undefined ? event.end.dateTime == undefined ? '' : event.end.dateTime : event.end.date)
                    };
                    return calendarEvent;
                });
            }).then(events => defer.resolve(events));

            return defer.promise;
        }

        // getCalendarEvents2() {
        //     let deferred = this.$q.defer();
        //     let params = {
        //         calendarId: 'primary, slishnevsky@gmail.com, vlishnevsky@gmail.com, #contacts@group.v.calendar.google.com',
        //         timeMin: (new Date()).toISOString(),
        //         showDeleted: false,
        //         singleEvents: true,
        //         maxResults: 10
        //     };
        //     gapi.client.calendar.events.list(params).then(response => {
        //         let events = response.result.items;
        //         let results: CalendarEvent[] = [];
        //         events.forEach(event => {
        //             let calendarEvent: CalendarEvent = {
        //                 id: event.id,
        //                 summary: event.summary,
        //                 htmlLink: event.htmlLink,
        //                 start: new Date(event.start.date == undefined ? event.start.dateTime == undefined ? '' : event.start.dateTime : event.start.date),
        //                 end: new Date(event.end.date == undefined ? event.end.dateTime == undefined ? '' : event.end.dateTime : event.end.date)
        //             };
        //             results.push(calendarEvent);
        //         });
        //         deferred.resolve(results);
        //     });
        //     return deferred.promise;
        // }

        getNewsHeadlines(feed: string): ng.IHttpPromise<any> {
            let deferred = this.$q.defer();
            const url = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(feed);
            this.$http.get(url).then((response: any) => {
                let items = response.data.items;
                let results: NewsHeadline[] = [];
                items.forEach(item => {
                    let newsHeadline: NewsHeadline = {
                        title: item.title,
                        link: item.link,
                        description: item.description,
                        icon: ''
                    };
                    results.push(newsHeadline);
                });
                deferred.resolve(results);
            });
            return deferred.promise;
        };

        getWeatherForecast(feed) {
            let deferred = this.$q.defer();
            const url = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(feed);
            this.$http.get(url).then((response: any) => {
                let items = response.data.items;
                let results: WeatherForecast[] = [];
                items.forEach(item => {
                    let weatherForecast: WeatherForecast = {
                        day: item.title.split(',')[0],
                        condition: item.description.split(',')[0],
                        icon: 'http://rss.theweathernetwork.com/common/images/web/wicons/b.gif',
                        high: item.description.split(',')[1],
                        low: item.description.split(',')[2],
                    };
                    results.push(weatherForecast);
                });
                deferred.resolve(results);
            });
            return deferred.promise;
        }
    }

    angular.module('app').service('GoogleService', GoogleService);
}

