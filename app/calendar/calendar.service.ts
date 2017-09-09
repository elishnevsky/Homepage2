//declare namespace gapi.client.Request { };

namespace AppDomain {

    export interface CalendarEvent {
        id: string;
        summary: string;
        htmlLink: string;
        start: Date;
        end: Date;
    }

    export class CalendarService {

        static $inject: string[] = ['$q', '$http'];

        constructor(private $q: ng.IQService, private $http: ng.IHttpService) {
            console.log('CalendarService');
        }

        getCalendarEvents() {
            let deferred = this.$q.defer();
            let params = {
                calendarId: 'primary',
                timeMin: (new Date()).toISOString(),
                showDeleted: false,
                singleEvents: true,
                maxResults: 10,
                //orderBy: 'startTime'
            };
            gapi.client.calendar.events.list(params).then(response => {
                let events = response.result.items;
                let results: CalendarEvent[] = [];
                events.forEach(event => {
                    let calendarEvent: CalendarEvent = {
                        id: event.id,
                        summary: event.summary,
                        htmlLink: event.htmlLink,
                        start: new Date(event.start.date == undefined ? event.start.dateTime == undefined ? '' : event.start.dateTime : event.start.date),
                        end: new Date(event.end.date == undefined ? event.end.dateTime == undefined ? '' : event.end.dateTime : event.end.date)
                    };
                    results.push(calendarEvent);
                });
                deferred.resolve(results);
            });
            return deferred.promise;
        }

    }

    angular.module('app').service('CalendarService', CalendarService);
}

