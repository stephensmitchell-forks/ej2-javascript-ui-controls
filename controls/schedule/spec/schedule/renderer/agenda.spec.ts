/**
 * Schedule agenda view spec 
 */
import { createElement, remove, EmitType, closest } from '@syncfusion/ej2-base';
import { Schedule, ScheduleModel, Day, Week, WorkWeek, Month, Agenda } from '../../../src/schedule/index';
import { triggerScrollEvent, createSchedule, destroy } from '../util.spec';
import { resourceData, generateObject, defaultData, cloneDataSource } from '../base/datasource.spec';
import * as util from '../../../src/schedule/base/util';
import { profile, inMB, getMemoryProfile } from '../../common.spec';

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda);

describe('Agenda View', () => {
    beforeAll(() => {
        // tslint:disable-next-line:no-any
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // tslint:disable-next-line:no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            this.skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Checking without datasource', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                height: '500px',
                currentView: 'Agenda',
                views: [{ option: 'Agenda', allowVirtualScrolling: true }],
                selectedDate: new Date(2017, 10, 1),
                dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
        }, 4000);
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('Checking view class name in container', () => {
            expect(schObj.element.querySelector('.e-agenda-view')).toBeTruthy();
        });

        it('Checking hideEmptyAgendaDays default value', () => {
            expect(schObj.hideEmptyAgendaDays).toEqual(true);
        });

        it('Checking agendaDaysCount default value', () => {
            expect(schObj.agendaDaysCount).toEqual(7);
        });

        it('Checking Agenda elements count', () => {
            expect(schObj.element.querySelectorAll('.e-agenda-parent').length).toEqual(0);
        });

        it('Checking selected Date', () => {
            expect(util.resetTime(schObj.selectedDate)).toEqual(util.resetTime(new Date(2017, 10, 1)));
        });

        it('Checking Virtual Scrolling default value', () => {
            expect(schObj.activeViewOptions.allowVirtualScrolling).toEqual(true);
        });

        it('Checking Header text', () => {
            expect(schObj.element.querySelector('.e-date-range').firstElementChild.textContent).toEqual('November 2017');
        });

        it('Checking prev next icon disabled', () => {
            expect(schObj.element.querySelector('.e-prev').classList.contains('e-hidden')).toEqual(true);
            expect(schObj.element.querySelector('.e-next').classList.contains('e-hidden')).toEqual(true);
        });

        it('Checking Header text', () => {
            let element: HTMLElement = schObj.element.querySelector('.e-empty-event') as HTMLElement;
            expect(element.innerHTML).toEqual('No events');
            expect(schObj.element.querySelector('.e-date-range').firstElementChild.textContent).toEqual('November 2017');
            schObj.views = [{ option: 'Day' }, { option: 'Week' }, { option: 'WorkWeek' }, { option: 'Month' },
            { option: 'Agenda', allowVirtualScrolling: false }];
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range').firstElementChild.textContent).toEqual('November 01 - 07, 2017');
        });

        it('Checking previous navigation', () => {
            let prevEle: HTMLElement = schObj.element.querySelector('.e-prev') as HTMLElement;
            prevEle.click();
            expect(schObj.element.querySelector('.e-date-range').firstElementChild.textContent).toEqual('Oct 31 - Nov 06, 2017');
        });

        it('Checking next navigation', () => {
            let nextEle: HTMLElement = schObj.element.querySelector('.e-next') as HTMLElement;
            nextEle.click();
            expect(schObj.element.querySelector('.e-date-range').firstElementChild.textContent).toEqual('November 01 - 07, 2017');
        });

        it('Checking hideEmptyAgendaDays', (done: Function) => {
            schObj.hideEmptyAgendaDays = false;
            schObj.dataBind();
            let dataBound: (args: Object) => void = (args: Object) => {
                expect(schObj.element.querySelectorAll('.e-agenda-parent').length).toEqual(7);
                done();
            };
            schObj.dataBound = dataBound;
        });

        it('Checking virtual scrolling with hideEmptyAgendaDays', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                let scrollUp: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
                triggerScrollEvent(scrollUp, 0);
                expect(schObj.element.querySelectorAll('.e-agenda-parent').length).toEqual(14);
                let patentTd: Element = closest((schObj.element.querySelectorAll('.e-agenda-parent')[0] as Element), 'td');
                expect(patentTd.getAttribute('data-date')).toEqual(new Date(2017, 9, 25).getTime().toString());
                done();
            };
            expect(schObj.element.querySelectorAll('.e-agenda-parent').length).toEqual(7);
            let td: Element = closest((schObj.element.querySelectorAll('.e-agenda-parent')[0] as Element), 'td');
            expect(td.getAttribute('data-date')).toEqual(new Date(2017, 10, 1).getTime().toString());
            schObj.views = [{ option: 'Day' }, { option: 'Week' }, { option: 'WorkWeek' }, { option: 'Month' },
            { option: 'Agenda', allowVirtualScrolling: true }];
            schObj.dataBind();
            schObj.dataBound = dataBound;
        });

        it('Checking without headerbar', () => {
            expect(schObj.headerModule).not.toBeNull();
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar').length).toEqual(1);
            expect(schObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(10);
            schObj.showHeaderBar = false;
            schObj.dataBind();
            expect(schObj.headerModule).toBeNull();
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar-container').length).toEqual(0);
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar').length).toEqual(0);
        });

        it('Checking Dateheader color', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                let dateString: string = new Date().setHours(0, 0, 0, 0).toString();
                expect(schObj.element.querySelector('.e-current-day').parentElement.getAttribute('data-date')).toEqual(dateString);
                done();
            };
            schObj.selectedDate = new Date();
            schObj.dataBind();
            schObj.dataBound = dataBound;
        });
    });

    describe('Checking with datasource', () => {
        let schObj: Schedule;
        // tslint:disable-next-line:no-any
        let keyModule: any;
        beforeAll((done: Function) => {
            let schOptions: ScheduleModel = {
                height: '500px',
                currentView: 'Agenda',
                views: [{ option: 'Day' }, { option: 'Agenda', allowVirtualScrolling: true }],
                selectedDate: new Date(2017, 9, 30)
            };
            schObj = createSchedule(schOptions, generateObject(), done);
            schObj.appendTo('#Schedule');
            keyModule = schObj.keyboardInteractionModule;
        });
        afterAll(() => {
            destroy(schObj);
        });

        it('Checking list elements', () => {
            let agendaEle: Element = schObj.element.querySelector('.e-content-wrap tr');
            expect(agendaEle.getAttribute('role')).toEqual('row');
            expect(agendaEle.childElementCount).toEqual(2);
            let agendaDate: HTMLElement = agendaEle.children[0] as HTMLElement;
            expect(agendaDate.className).toEqual('e-agenda-cells');
            expect(agendaDate.getAttribute('role')).toEqual('gridcell');
            expect(agendaDate.childElementCount).toEqual(1);
            expect(agendaDate.children[0].classList[0]).toEqual('e-day-date-header');
            expect(agendaDate.children[0].childElementCount).toEqual(2);
            expect(agendaDate.children[0].children[0].className).toEqual('e-m-date');
            expect(agendaDate.children[0].children[1].className).toEqual('e-m-day');
            let agendaListApp: HTMLElement = agendaEle.children[1] as HTMLElement;
            expect(agendaListApp.className).toEqual('e-agenda-cells e-day-border');
            expect(agendaListApp.getAttribute('role')).toEqual('gridcell');
            expect(agendaListApp.childElementCount).toEqual(1);
            expect(agendaListApp.children[0].className).toEqual('e-agenda-parent e-ul e-agenda-view');
            expect(agendaListApp.children[0].childElementCount).toBeGreaterThanOrEqual(1);
            expect(agendaListApp.children[0].children[0].className).toEqual('e-agenda-item e-agenda-view e-level-1');
            expect(agendaListApp.children[0].children[0].childElementCount).toEqual(1);
            expect(agendaListApp.children[0].children[0].children[0].className).toEqual('e-appointment');
            expect(agendaListApp.children[0].children[0].children[0].childElementCount).toEqual(2);
            expect(agendaListApp.children[0].children[0].children[0].children[0].className).toEqual('e-subject-wrap');
            expect(agendaListApp.children[0].children[0].children[0].children[1].className).toEqual('e-date-time');

            let scrollElement: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            let scrollUp: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            expect(scrollElement.querySelectorAll('tr').length).toEqual(7);
            triggerScrollEvent(scrollUp, 0);
            let scrollElement1: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            expect(scrollElement1.querySelectorAll('tr').length).toBeLessThanOrEqual(15);
        });

        it('Checking virtual scrolling with hideEmptyAgendaDays', (done: Function) => {
            schObj.hideEmptyAgendaDays = false;
            schObj.dataBind();
            let dataBound: (args: Object) => void = (args: Object) => {
                let scrollUp: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
                triggerScrollEvent(scrollUp, 0);
                expect(schObj.element.querySelectorAll('.e-agenda-parent').length).toEqual(14);
                let patentTd: Element = closest((schObj.element.querySelectorAll('.e-agenda-parent')[0] as Element), 'td');
                expect(patentTd.getAttribute('data-date')).toEqual(new Date(2017, 9, 23).getTime().toString());
                done();
            };
            schObj.dataBound = dataBound;
        });

        it('First date checking', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                (<HTMLElement>schObj.element.querySelector('.e-appointment')).click();
                let scrollElement: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
                triggerScrollEvent(scrollElement, 0);
                done();
            };
            schObj.selectedDate = new Date(2017, 0, 1);
            schObj.hideEmptyAgendaDays = true;
            schObj.dataBind();
            schObj.dataBound = dataBound;
        });

        it('Last date checking', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                let scrollElement: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
                let scrollHeight: number = scrollElement.scrollHeight;
                triggerScrollEvent(scrollElement, scrollHeight);
                done();
            };
            schObj.selectedDate = new Date(2018, 11, 28);
            schObj.dataBind();
            schObj.dataBound = dataBound;
        });

        it('home key', () => {
            let scrollElement: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            triggerScrollEvent(scrollElement, 150);
            keyModule.keyActionHandler({ action: 'home' });
            let target: Element = schObj.element.querySelector('.e-content-wrap table tr td[tabindex="0"]');
            expect(target.getAttribute('data-date')).toEqual(new Date('Fri Dec 28 2018').getTime().toString());
        });

        it('Tab key functionality checking', () => {
            let target: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            keyModule.keyActionHandler({ action: 'tab', target: target[0], shiftKey: false, preventDefault: (): void => { /** Null */ } });
            expect(target[0].classList.contains('e-appointment-border')).toEqual(false);
            keyModule.keyActionHandler({ action: 'tab', target: target[2], shiftKey: true, preventDefault: (): void => { /** Null */ } });
            expect(target[0].getAttribute('data-guid')).toEqual(document.activeElement.getAttribute('data-guid'));
        });

        it('Day view navigation checking', () => {
            let firstDateHeader: HTMLElement = schObj.element.querySelector('.e-m-date') as HTMLElement;
            firstDateHeader.click();
            expect(schObj.currentView).toEqual('Day');
        });
    });

    describe('Checking Virtual scrolling with events after long days from initial date navigation', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let schOptions: ScheduleModel = {
                width: '100%',
                height: '650px',
                views: [{ option: 'Month' }, { option: 'Agenda', allowVirtualScrolling: true }],
                selectedDate: new Date(2017, 11, 1),
                currentView: 'Agenda',
            };
            let scheduleDatas: Object[] = [
                {
                    Id: 44,
                    Subject: 'Paris',
                    StartTime: new Date(2018, 0, 8, 10, 0),
                    EndTime: new Date(2018, 0, 8, 11, 30),
                    IsAllDay: false
                }, {
                    Id: 45,
                    Subject: 'Conference - 1',
                    StartTime: new Date(2018, 2, 8, 22, 0),
                    EndTime: new Date(2018, 2, 8, 2, 30),
                    IsAllDay: false
                }, {
                    Id: 46,
                    Subject: 'Conference - 2',
                    StartTime: new Date(2018, 4, 14, 22, 0),
                    EndTime: new Date(2018, 4, 15, 0, 0),
                    IsAllDay: false
                }, {
                    Id: 47,
                    Subject: 'Conference - 3',
                    StartTime: new Date(2018, 6, 15, 9, 30),
                    EndTime: new Date(2018, 6, 15, 11, 45),
                    IsAllDay: false
                }, {
                    Id: 48,
                    Subject: 'Conference - 4',
                    StartTime: new Date(2018, 8, 15, 10, 30),
                    EndTime: new Date(2018, 8, 15, 12, 45),
                    IsAllDay: false
                }, {
                    Id: 49,
                    Subject: 'Travelling',
                    StartTime: new Date(2018, 10, 15, 11, 30),
                    EndTime: new Date(2018, 10, 15, 13, 45),
                    IsAllDay: false
                }, {
                    Id: 50,
                    Subject: 'Vacation',
                    StartTime: new Date(2019, 0, 16, 10, 0),
                    EndTime: new Date(2019, 0, 16, 12, 30),
                    IsAllDay: false
                }, {
                    Id: 51,
                    Subject: 'Conference',
                    StartTime: new Date(2019, 2, 16, 15, 30),
                    EndTime: new Date(2019, 2, 16, 18, 45),
                    IsAllDay: false
                }, {
                    Id: 52,
                    Subject: 'Vacation',
                    StartTime: new Date(2019, 4, 17, 10, 15),
                    EndTime: new Date(2019, 4, 17, 14, 45),
                    IsAllDay: false
                }, {
                    Id: 53,
                    Subject: 'Conference',
                    StartTime: new Date(2019, 6, 18, 9, 30),
                    EndTime: new Date(2019, 6, 18, 10, 45),
                    IsAllDay: false
                }, {
                    Id: 54,
                    Subject: 'Conference-5',
                    StartTime: new Date(2029, 9, 13, 9, 30),
                    EndTime: new Date(2029, 9, 13, 10, 45),
                    IsAllDay: false
                }];
            let data: Object[] = cloneDataSource(defaultData).concat(scheduleDatas);
            schObj = createSchedule(schOptions, data, done);
            schObj.appendTo('#Schedule');
        });
        afterAll(() => {
            destroy(schObj);
        });

        it('Checking virtual scrolling with hideEmptyAgendaDays', () => {
            let eventWraps: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-agenda-parent'));
            expect(eventWraps.length).toEqual(16);
            let firstEventTd: Element = closest((eventWraps[0] as Element), 'td');
            expect(parseInt(firstEventTd.getAttribute('data-date'), 10)).toEqual(new Date(2017, 10, 10).getTime());
            expect(firstEventTd.getAttribute('aria-colindex')).toEqual('-21');
            let lastEventTd: Element = closest((eventWraps[eventWraps.length - 1] as Element), 'td');
            expect(parseInt(lastEventTd.getAttribute('data-date'), 10)).toEqual(new Date(2019, 0, 16).getTime());
            expect(lastEventTd.getAttribute('aria-colindex')).toEqual('411');
        });
    });

    describe('Agenda view rendering with templates', () => {
        let schObj: Schedule;
        let dateTmpl: string = '<span>${date.toLocaleDateString()}</span>';
        let appTmpl: string = '<div>SUbject: ${Subject}</div><div>StartTime: ${StartTime.toLocaleString()}</div>' +
            '<div>EndTime: ${EndTime.toLocaleString()</div>';
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                height: '500px',
                currentView: 'Agenda',
                dateFormat: 'dd MMM yyyy',
                dateHeaderTemplate: dateTmpl,
                selectedDate: new Date(2017, 9, 30),
                eventSettings: {
                    dataSource: generateObject(),
                    template: appTmpl
                },
                dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('Checking date template', () => {
            let agendaEle: Element = schObj.element.querySelector('.e-content-wrap').children[0].children[0].children[0];
            expect(agendaEle.getAttribute('role')).toEqual('row');
            expect(agendaEle.childElementCount).toEqual(2);
            let agendaDate: HTMLElement = agendaEle.children[0] as HTMLElement;
            expect(agendaDate.className).toEqual('e-agenda-cells');
            expect(agendaDate.getAttribute('role')).toEqual('gridcell');
            expect(agendaDate.childElementCount).toEqual(1);
            expect(agendaDate.children[0].classList[0]).toEqual('e-day-date-header');
            expect(agendaDate.children[0].childElementCount).toEqual(1);
        });

        it('Checking appointment template', () => {
            schObj.eventSettings.template = appTmpl;
            schObj.dataBind();
            let agendaEle: Element = schObj.element.querySelector('.e-content-wrap').children[0].children[0].children[0];
            expect(agendaEle.getAttribute('role')).toEqual('row');
            expect(agendaEle.childElementCount).toEqual(2);
            let agendaListApp: HTMLElement = agendaEle.children[1] as HTMLElement;
            expect(agendaListApp.className).toEqual('e-agenda-cells e-day-border');
            expect(agendaListApp.getAttribute('role')).toEqual('gridcell');
            expect(agendaListApp.childElementCount).toEqual(1);
            expect(agendaListApp.children[0].className).toEqual('e-agenda-parent e-ul e-agenda-view');
            expect(agendaListApp.children[0].childElementCount).toBeGreaterThanOrEqual(1);
            expect(agendaListApp.children[0].children[0].className).toEqual('e-agenda-item e-agenda-view e-level-1');
            expect(agendaListApp.children[0].children[0].childElementCount).toEqual(1);
            expect(agendaListApp.children[0].children[0].children[0].className).toEqual('e-appointment e-template');
            expect(agendaListApp.children[0].children[0].children[0].children[0].className).toEqual('e-icons e-recurrence-icon');
            expect(agendaListApp.children[0].children[0].children[0].childElementCount).toEqual(4);
        });
    });

    describe('Agenda view spanned events checking', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                height: '500px',
                currentView: 'Agenda',
                selectedDate: new Date(2018, 3, 1),
                eventSettings: {
                    dataSource: [{
                        Id: 1,
                        Subject: 'Event',
                        StartTime: new Date(2018, 3, 1),
                        EndTime: new Date(2018, 3, 5),
                        IsAllDay: true
                    }]
                },
                dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
            schObj.quickPopup.quickPopup.showAnimation = null;
            schObj.quickPopup.quickPopup.hideAnimation = null;
            schObj.quickPopup.quickPopup.dataBind();
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('Checking spanned events', () => {
            let agendaAppointment: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(agendaAppointment.length).toEqual(4);
            agendaAppointment[0].click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
        });
    });

    describe('Checking Event loading on current view', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                height: '500px',
                currentView: 'Agenda',
                selectedDate: new Date(2018, 3, 8),
                eventSettings: {
                    dataSource: [{
                        Id: 1,
                        Subject: 'Event',
                        StartTime: new Date(2018, 3, 7),
                        EndTime: new Date(2018, 3, 7),
                        IsAllDay: true
                    }]
                },
                dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('test current page event loading', () => {
            let agendaAppointment: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(agendaAppointment.length).toEqual(0);
            let element: HTMLElement = schObj.element.querySelector('.e-empty-event') as HTMLElement;
            expect(element.innerHTML).toEqual('No events');
            expect(schObj.element.querySelector('.e-date-range').firstElementChild.textContent).toEqual('April 08 - 14, 2018');
        });

        it('test check event loading on previous click', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                let agendaAppointments: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(agendaAppointments.length).toEqual(1);
                expect(schObj.element.querySelector('.e-date-range').firstElementChild.textContent).toEqual('April 07 - 13, 2018');
                done();
            };
            let prevEle: HTMLElement = schObj.element.querySelector('.e-prev') as HTMLElement;
            prevEle.click();
            schObj.dataBound = dataBound;
        });


        it('test check event loading on next click', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                let agendaAppointment: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(agendaAppointment.length).toEqual(0);
                let element: HTMLElement = schObj.element.querySelector('.e-empty-event') as HTMLElement;
                expect(element.innerHTML).toEqual('No events');
                expect(schObj.element.querySelector('.e-date-range').firstElementChild.textContent).toEqual('April 08 - 14, 2018');
                done();
            };
            let nextEle: HTMLElement = schObj.element.querySelector('.e-next') as HTMLElement;
            nextEle.click();
            schObj.dataBound = dataBound;
        });
    });

    describe('Checking Event loading on view specific agenda view', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                height: '500px',
                currentView: 'Agenda',
                views: [{ option: 'Agenda', allowVirtualScrolling: false }],
                selectedDate: new Date(2018, 3, 8),
                eventSettings: {
                    dataSource: [{
                        Id: 1,
                        Subject: 'Event',
                        StartTime: new Date(2018, 3, 7),
                        EndTime: new Date(2018, 3, 7),
                        IsAllDay: true
                    }]
                },
                dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('test current page event loading', () => {
            let agendaAppointment: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(agendaAppointment.length).toEqual(0);
            let element: HTMLElement = schObj.element.querySelector('.e-empty-event') as HTMLElement;
            expect(element.innerHTML).toEqual('No events');
            expect(schObj.element.querySelector('.e-date-range').firstElementChild.textContent).toEqual('April 08 - 14, 2018');
        });

        it('test check event loading on previous click', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                let agendaAppointments: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(agendaAppointments.length).toEqual(1);
                expect(schObj.element.querySelector('.e-date-range').firstElementChild.textContent).toEqual('April 07 - 13, 2018');
                done();
            };
            let prevEle: HTMLElement = schObj.element.querySelector('.e-prev') as HTMLElement;
            prevEle.click();
            schObj.dataBound = dataBound;
        });

        it('test check event loading on next click', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                let agendaAppointment: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(agendaAppointment.length).toEqual(0);
                let element: HTMLElement = schObj.element.querySelector('.e-empty-event') as HTMLElement;
                expect(element.innerHTML).toEqual('No events');
                expect(schObj.element.querySelector('.e-date-range').firstElementChild.textContent).toEqual('April 08 - 14, 2018');
                done();
            };
            let nextEle: HTMLElement = schObj.element.querySelector('.e-next') as HTMLElement;
            nextEle.click();
            schObj.dataBound = dataBound;
        });
    });

    describe('Agenda view recurrence spanned events checking', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                height: '500px',
                currentView: 'Agenda',
                selectedDate: new Date(2018, 3, 1),
                eventSettings: {
                    dataSource: [{
                        Id: 1,
                        Subject: 'Spanned Event',
                        StartTime: new Date(2018, 3, 1, 10, 0),
                        EndTime: new Date(2018, 3, 2, 11, 0),
                        RecurrenceRule: 'FREQ=DAILY;INTERVAL=2;COUNT=2',
                        RecurrenceID: 2
                    }]
                },
                dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
            schObj.quickPopup.quickPopup.showAnimation = null;
            schObj.quickPopup.quickPopup.hideAnimation = null;
            schObj.quickPopup.quickPopup.dataBind();
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('Checking spanned events', () => {
            let agendaAppointment: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(agendaAppointment.length).toEqual(2);
            agendaAppointment[0].click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
        });
    });

    describe('Agenda view rendering with multiple resource', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        let restemplate: string = '<div class="template-wrap"></div><div style="background:pink">${getResourceName(data)}</div>';
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                width: '100%',
                height: '550px',
                selectedDate: new Date(2018, 3, 1),
                resourceHeaderTemplate: restemplate,
                currentView: 'Agenda',
                group: {
                    resources: ['Rooms', 'Owners']
                },
                resources: [
                    {
                        field: 'RoomId', title: 'Room',
                        name: 'Rooms', allowMultiple: false,
                        dataSource: [
                            { RoomText: 'ROOM 1', Id: 1, RoomColor: '#cb6bb2' },
                            { RoomText: 'ROOM 2', Id: 2, RoomColor: '#56ca85' }
                        ],
                        textField: 'RoomText', idField: 'Id', colorField: 'RoomColor'
                    }, {
                        field: 'OwnerId', title: 'Owner',
                        name: 'Owners', allowMultiple: true,
                        dataSource: [
                            { OwnerText: 'Nancy', Id: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                            { OwnerText: 'Steven', Id: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                            { OwnerText: 'Michael', Id: 3, OwnerGroupId: 1, OwnerColor: '#7499e1' }
                        ],
                        textField: 'OwnerText', idField: 'Id', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
                    }
                ],
                eventSettings: {
                    dataSource: resourceData
                },
                dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('Checking resource rendering with EmptyAgendaDays as true', () => {
            let row1: Element = schObj.element.querySelector('.e-content-wrap').children[0].children[0].children[0];
            expect(row1.getAttribute('role')).toEqual('row');
            expect(row1.childElementCount).toEqual(4);
            let parElem1: HTMLElement = row1.children[0] as HTMLElement;
            expect(parElem1.getAttribute('rowspan')).toEqual('7');
            let parElem2: HTMLElement = row1.children[1] as HTMLElement;
            expect(parElem2.getAttribute('rowspan')).toEqual('4');
            let row2: Element = schObj.element.querySelector('.e-content-wrap').children[0].children[0].children[1];
            expect(row2.getAttribute('role')).toEqual('row');
            expect(row2.childElementCount).toEqual(2);
        });

        it('Checking resource template', () => {
            let row1: Element = schObj.element.querySelector('.e-content-wrap').children[0].children[0].children[0];
            let parTd: HTMLElement = row1.children[0] as HTMLElement;
            let childDiv: HTMLElement = parTd.children[0] as HTMLElement;
            expect(childDiv.className).toEqual('template-wrap');
        });

        it('Checking resource rendering with EmptyAgendaDays as false', (done: Function) => {
            schObj.hideEmptyAgendaDays = false;
            schObj.dataBind();
            let dataBound: (args: Object) => void = (args: Object) => {
                let row1: Element = schObj.element.querySelector('.e-content-wrap').children[0].children[0].children[0];
                expect(row1.getAttribute('role')).toEqual('row');
                expect(row1.childElementCount).toEqual(4);
                let parElem1: HTMLElement = row1.children[0] as HTMLElement;
                expect(parElem1.getAttribute('rowspan')).toEqual('14');
                let parElem2: HTMLElement = row1.children[1] as HTMLElement;
                expect(parElem2.getAttribute('rowspan')).toEqual('7');
                let row2: Element = schObj.element.querySelector('.e-content-wrap').children[0].children[0].children[1];
                let emptyTd: HTMLElement = row2.children[1] as HTMLElement;
                let emptyDiv: HTMLElement = emptyTd.children[0].children[0].children[0] as HTMLElement;
                expect(emptyDiv.className).toEqual('e-no-event');
                done();
            };
            schObj.dataBound = dataBound;
        });

        it('Checking resource rendering without headerbar', () => {
            expect(schObj.headerModule).not.toBeNull();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('April 01 - 07, 2018');
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar').length).toEqual(1);
            expect(schObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(10);
            schObj.showHeaderBar = false;
            schObj.dataBind();
            expect(schObj.headerModule).toBeNull();
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar-container').length).toEqual(0);
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar').length).toEqual(0);
        });

        it('Checking resource rendering with empty agenda collection', (done: Function) => {
            schObj.hideEmptyAgendaDays = true;
            schObj.selectedDate = new Date(2020, 3, 1);
            schObj.dataBind();
            let dataBound: (args: Object) => void = (args: Object) => {
                let row1: Element = schObj.element.querySelector('.e-content-wrap').children[0].children[0].children[0];
                expect(row1.getAttribute('role')).toEqual('row');
                let emptyDiv: HTMLElement = row1.children[0].children[0] as HTMLElement;
                expect(emptyDiv.className).toEqual('e-empty-event');
                done();
            };
            schObj.dataBound = dataBound;
        });
    });

    describe('Agenda view rendering with single level resource Date-wise grouping', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        let restemplate: string = '<div class="template-wrap"></div><div style="background:pink">${getResourceName(data)}</div>';
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                width: '100%',
                height: '550px',
                selectedDate: new Date(2018, 3, 1),
                currentView: 'Agenda',
                resourceHeaderTemplate: restemplate,
                group: {
                    byDate: true,
                    resources: ['Owners']
                },
                resources: [
                    {
                        field: 'OwnerId', title: 'Owner',
                        name: 'Owners', allowMultiple: true,
                        dataSource: [
                            { OwnerText: 'Nancy', Id: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                            { OwnerText: 'Steven', Id: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                            { OwnerText: 'Michael', Id: 3, OwnerGroupId: 1, OwnerColor: '#7499e1' }
                        ],
                        textField: 'OwnerText', idField: 'Id', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
                    }
                ],
                eventSettings: {
                    dataSource: resourceData
                },
                dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('Checking resource rendering with EmptyAgendaDays as true', () => {
            let row1: Element = schObj.element.querySelector('.e-content-wrap').children[0].children[0].children[0];
            expect(row1.getAttribute('role')).toEqual('row');
            expect(row1.childElementCount).toEqual(3);
            let parElem1: HTMLElement = row1.children[0] as HTMLElement;
            expect(parElem1.getAttribute('rowspan')).toEqual('3');
            let parElem2: HTMLElement = row1.children[1] as HTMLElement;
            expect(parElem2.getAttribute('rowspan')).toEqual('1');
            let row2: Element = schObj.element.querySelector('.e-content-wrap').children[0].children[0].children[1];
            expect(row2.getAttribute('role')).toEqual('row');
            expect(row2.childElementCount).toEqual(2);
        });

        it('Checking resource template', () => {
            let row1: Element = schObj.element.querySelector('.e-content-wrap').children[0].children[0].children[0];
            let parTd: HTMLElement = row1.children[1] as HTMLElement;
            let childDiv: HTMLElement = parTd.children[0] as HTMLElement;
            expect(childDiv.className).toEqual('template-wrap');
        });

        it('Checking resource rendering with EmptyAgendaDays as false', (done: Function) => {
            schObj.hideEmptyAgendaDays = false;
            schObj.dataBind();
            let dataBound: (args: Object) => void = (args: Object) => {
                let row1: Element = schObj.element.querySelector('.e-content-wrap').children[0].children[0].children[3];
                expect(row1.getAttribute('role')).toEqual('row');
                expect(row1.childElementCount).toEqual(3);
                let parElem1: HTMLElement = row1.children[0] as HTMLElement;
                expect(parElem1.getAttribute('rowspan')).toEqual('3');
                let parElem2: HTMLElement = row1.children[1] as HTMLElement;
                expect(parElem2.getAttribute('rowspan')).toEqual('1');
                let parElem3: HTMLElement = row1.children[0] as HTMLElement;
                expect(parElem3.className).toContain('e-date-column');
                let emptyTd: HTMLElement = row1.children[2] as HTMLElement;
                let emptyDiv: HTMLElement = emptyTd.children[0].children[0].children[0] as HTMLElement;
                expect(emptyDiv.className).toEqual('e-no-event');
                done();
            };
            schObj.dataBound = dataBound;
        });
    });

    describe('Agenda view rendering with multiple resource Date-wise grouping', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        let restemplate: string = '<div class="template-wrap"></div><div style="background:pink">${getResourceName(data)}</div>';
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                width: '100%',
                height: '550px',
                selectedDate: new Date(2018, 3, 1),
                currentView: 'Agenda',
                resourceHeaderTemplate: restemplate,
                group: {
                    byDate: true,
                    resources: ['Rooms', 'Owners']
                },
                resources: [
                    {
                        field: 'RoomId', title: 'Room',
                        name: 'Rooms', allowMultiple: false,
                        dataSource: [
                            { RoomText: 'ROOM 1', Id: 1, RoomColor: '#cb6bb2' },
                            { RoomText: 'ROOM 2', Id: 2, RoomColor: '#56ca85' }
                        ],
                        textField: 'RoomText', idField: 'Id', colorField: 'RoomColor'
                    },
                    {
                        field: 'OwnerId', title: 'Owner',
                        name: 'Owners', allowMultiple: true,
                        dataSource: [
                            { OwnerText: 'Nancy', Id: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                            { OwnerText: 'Steven', Id: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                            { OwnerText: 'Michael', Id: 3, OwnerGroupId: 1, OwnerColor: '#7499e1' }
                        ],
                        textField: 'OwnerText', idField: 'Id', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
                    }
                ],
                eventSettings: {
                    dataSource: resourceData
                },
                dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('Checking resource rendering with EmptyAgendaDays as true', () => {
            let row1: Element = schObj.element.querySelector('.e-content-wrap').children[0].children[0].children[0];
            expect(row1.getAttribute('role')).toEqual('row');
            expect(row1.childElementCount).toEqual(4);
            let parElem1: HTMLElement = row1.children[0] as HTMLElement;
            expect(parElem1.getAttribute('rowspan')).toEqual('3');
            let parElem2: HTMLElement = row1.children[1] as HTMLElement;
            expect(parElem2.getAttribute('rowspan')).toEqual('2');
            let row2: Element = schObj.element.querySelector('.e-content-wrap').children[0].children[0].children[1];
            expect(row2.getAttribute('role')).toEqual('row');
            expect(row2.childElementCount).toEqual(2);
        });

        it('Checking resource template', () => {
            let row1: Element = schObj.element.querySelector('.e-content-wrap').children[0].children[0].children[0];
            let parTd: HTMLElement = row1.children[1] as HTMLElement;
            let childDiv: HTMLElement = parTd.children[0] as HTMLElement;
            expect(childDiv.className).toEqual('template-wrap');
        });

        it('Checking resource rendering with EmptyAgendaDays as false', (done: Function) => {
            schObj.hideEmptyAgendaDays = false;
            schObj.dataBind();
            let dataBound: (args: Object) => void = (args: Object) => {
                let row1: Element = schObj.element.querySelector('.e-content-wrap').children[0].children[0].children[3];
                expect(row1.getAttribute('role')).toEqual('row');
                expect(row1.childElementCount).toEqual(4);
                let parElem1: HTMLElement = row1.children[0] as HTMLElement;
                expect(parElem1.getAttribute('rowspan')).toEqual('3');
                let parElem2: HTMLElement = row1.children[1] as HTMLElement;
                expect(parElem2.getAttribute('rowspan')).toEqual('2');
                let parElem3: HTMLElement = row1.children[0] as HTMLElement;
                expect(parElem3.className).toContain('e-date-column');
                let emptyTd: HTMLElement = row1.children[3] as HTMLElement;
                let emptyDiv: HTMLElement = emptyTd.children[0].children[0].children[0] as HTMLElement;
                expect(emptyDiv.className).toEqual('e-no-event');
                done();
            };
            schObj.dataBound = dataBound;
        });
    });

    describe('Agenda view rendering with multiple resource individual view config test', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                width: '100%',
                height: '550px',
                selectedDate: new Date(2018, 3, 1),
                currentView: 'WorkWeek',
                resources: [
                    {
                        field: 'RoomId', title: 'Room',
                        name: 'Rooms', allowMultiple: false,
                        dataSource: [
                            { RoomText: 'ROOM 1', Id: 1, RoomGroupId: 1, RoomColor: '#cb6bb2' },
                            { RoomText: 'ROOM 2', Id: 2, RoomGroupId: 1, RoomColor: '#56ca85' }
                        ],
                        textField: 'RoomText', idField: 'Id', groupIDField: 'RoomGroupId', colorField: 'RoomColor'
                    }, {
                        field: 'OwnerId', title: 'Owner',
                        name: 'Owners', allowMultiple: true,
                        dataSource: [
                            { OwnerText: 'Nancy', Id: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                            { OwnerText: 'Steven', Id: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                            { OwnerText: 'Michael', Id: 3, OwnerGroupId: 1, OwnerColor: '#7499e1' }
                        ],
                        textField: 'OwnerText', idField: 'Id', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
                    }
                ],
                views: [
                    { option: 'Day', group: { byGroupID: false, resources: ['Rooms', 'Owners'] } },
                    { option: 'Week', group: { resources: ['Rooms', 'Owners'] } },
                    { option: 'WorkWeek', group: { byDate: true, resources: ['Owners'] } },
                    { option: 'Month' },
                    { option: 'Agenda', group: { resources: ['Rooms', 'Owners'] } },
                    { option: 'MonthAgenda' }],
                eventSettings: {
                    dataSource: resourceData
                },
                dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('Checking workweek view to agenda view', (done: Function) => {
            expect(schObj.element.querySelector('.e-work-week')).toBeTruthy();
            expect(schObj.getCurrentViewEvents().length).toEqual(5);
            (schObj.element.querySelector('.e-agenda') as HTMLElement).click();
            let dataBound: (args: Object) => void = (args: Object) => {
                expect(schObj.element.querySelector('.e-agenda-view')).toBeTruthy();
                expect(schObj.getCurrentViewEvents().length).toEqual(11);
                let row1: Element = schObj.element.querySelector('.e-content-wrap').children[0].children[0].children[0];
                expect(row1.getAttribute('role')).toEqual('row');
                expect(row1.childElementCount).toEqual(4);
                let parElem1: HTMLElement = row1.children[0] as HTMLElement;
                expect(parElem1.getAttribute('rowspan')).toEqual('7');
                let parElem2: HTMLElement = row1.children[1] as HTMLElement;
                expect(parElem2.getAttribute('rowspan')).toEqual('4');
                let parElem3: HTMLElement = row1.children[0] as HTMLElement;
                expect(parElem3.className).toContain('e-resource-column');
                done();
            };
            schObj.dataBound = dataBound;
        });
    });

    describe('EJ2-26070-Event not rendered properly in agenda view when we give datasource and date format as string', () => {
        let schObj: Schedule;
        let datas: Object[] = [{
            'From': '2020-01-01T00:00:00',
            'Reason': 'Birthday',
            'To': '2020-01-02T23:59:59',
            'Name': 'Wish Luke Hill a happy birthday!',
            'Pending': false,
            'Cancelled': false,
            'AllDay': true
        }];
        beforeAll((done: Function) => {
            let schOptions: ScheduleModel = {
                height: '500px', selectedDate: new Date(2020, 0, 1),
                currentView: 'Agenda',
                eventSettings: {
                    dataSource: datas,
                    fields: {
                        subject: { name: 'Name' },
                        startTime: { name: 'From' },
                        endTime: { name: 'To' },
                        isAllDay: { name: 'AllDay' },
                        description: { name: 'Reason' }
                    }
                }
            };
            schObj = createSchedule(schOptions, datas, done);
        });
        afterAll(() => {
            destroy(schObj);
        });

        it('Checking event rendered or not using string datasource', () => {
            let eventElements: NodeListOf<Element> = schObj.element.querySelectorAll('.e-appointment');
            expect(eventElements.length).toEqual(2);
            expect(eventElements[0].querySelector('.e-date-time').textContent).toEqual('All day (Day 1/2)');
            expect(eventElements[1].querySelector('.e-date-time').textContent).toEqual('12:00 AM - 11:59 PM (Day 2/2)');
        });
    });

    it('memory leak', () => {
        profile.sample();
        // tslint:disable:no-any
        let average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        // tslint:enable:no-any
    });
});
