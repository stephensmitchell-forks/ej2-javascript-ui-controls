/**
 * Schedule Week view spec 
 */
import { createElement, remove, EmitType } from '@syncfusion/ej2-base';
import {
    Schedule, ScheduleModel, CellClickEventArgs, NavigatingEventArgs, ActionEventArgs,
    SelectEventArgs, PopupOpenEventArgs
} from '../../../src/schedule/index';
import { Day, Week, WorkWeek, Month, Agenda } from '../../../src/schedule/index';
import { triggerMouseEvent, triggerScrollEvent } from '../util.spec';
import { DateTimePicker } from '@syncfusion/ej2-calendars';
import { blockData } from '../base/datasource.spec';
import * as cls from '../../../src/schedule/base/css-constant';
import * as util from '../util.spec';
import { profile, inMB, getMemoryProfile } from '../../common.spec';

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda);

describe('Schedule Week view', () => {
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

    describe('Initial load', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll(() => {
            document.body.appendChild(elem);
            schObj = new Schedule({ currentView: 'Week', selectedDate: new Date(2017, 9, 4) });
            schObj.appendTo('#Schedule');
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });
        it('view class on container', () => {
            expect(schObj.element.querySelector('.e-week-view')).toBeTruthy();
        });

        it('check active view class on toolbar views', () => {
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-week');
        });

        it('check work cell elements count', () => {
            expect(schObj.getWorkCellElements().length).toEqual(48 * 7);
        });

        it('check all day row element', () => {
            expect(schObj.getAllDayRow()).toBeTruthy();
        });

        it('check date header cells text', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-container .e-header-cells').length).toEqual(1 * 7);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Sun</div><div class="e-header-date e-navigate" role="link">1</div>');
        });

        it('time cells', () => {
            expect(schObj.element.querySelectorAll('.e-time-cells-wrap .e-schedule-table tr').length).
                toEqual(schObj.element.querySelectorAll('.e-content-wrap .e-content-table tbody tr').length);
            expect(schObj.element.querySelector('.e-time-cells-wrap .e-schedule-table tr td').innerHTML).
                toEqual('<span>12:00 AM</span>');
        });

        it('work cells', () => {
            let firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.parentElement.getAttribute('role')).toEqual('row');
            expect(firstWorkCell.getAttribute('role')).toEqual('gridcell');
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
            expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2017, 9, 1).getTime().toString());
            expect(firstWorkCell.innerHTML).toEqual('');
        });

        it('navigate next date', () => {
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-date-header-container .e-header-cells').length).toEqual(1 * 7);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Sun</div><div class="e-header-date e-navigate" role="link">8</div>');
        });

        it('navigate previous date', () => {
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-date-header-container .e-header-cells').length).toEqual(1 * 7);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Sun</div><div class="e-header-date e-navigate" role="link">1</div>');
        });

        it('work hours highlight', () => {
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(18 * 5);
        });
    });

    describe('Dependent properties', () => {
        let schObj: Schedule;
        beforeEach((): void => {
            schObj = undefined;
            let elem: HTMLElement = createElement('div', { id: 'Schedule' });
            document.body.appendChild(elem);
        });
        afterEach((): void => {
            if (schObj) {
                schObj.destroy();
            }
            remove(document.querySelector('#Schedule'));
        });

        it('width and height', () => {
            schObj = new Schedule({ height: '600px', width: '500px', currentView: 'Week', selectedDate: new Date(2017, 9, 4) });
            schObj.appendTo('#Schedule');
            expect(document.getElementById('Schedule').style.width).toEqual('500px');
            expect(document.getElementById('Schedule').style.height).toEqual('600px');
            expect(document.getElementById('Schedule').offsetWidth).toEqual(500);
            expect(document.getElementById('Schedule').offsetHeight).toEqual(600);
        });

        it('start and end hour', () => {
            schObj = new Schedule({
                currentView: 'Week', selectedDate: new Date(2017, 9, 4),
                startHour: '04:00', endHour: '11:00',
            });
            schObj.appendTo('#Schedule');
            expect(schObj.getWorkCellElements().length).toEqual(14 * 7);
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(4 * 5);
            expect(schObj.element.querySelectorAll('.e-time-cells-wrap .e-schedule-table tr').length).
                toEqual(schObj.element.querySelectorAll('.e-content-wrap .e-content-table tbody tr').length);
            expect(schObj.element.querySelector('.e-time-cells-wrap .e-schedule-table tr td').innerHTML).
                toEqual('<span>4:00 AM</span>');

            schObj.startHour = '08:00';
            schObj.endHour = '16:00';
            schObj.dataBind();
            expect(schObj.element.querySelectorAll('.e-time-cells-wrap .e-schedule-table tr').length).
                toEqual(schObj.element.querySelectorAll('.e-content-wrap .e-content-table tbody tr').length);
            expect(schObj.element.querySelector('.e-time-cells-wrap .e-schedule-table tr td').innerHTML).
                toEqual('<span>8:00 AM</span>');
            expect(schObj.getWorkCellElements().length).toEqual(16 * 7);
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(14 * 5);
        });

        it('work hours start and end', () => {
            schObj = new Schedule({
                currentView: 'Week', selectedDate: new Date(2017, 9, 4),
                workHours: { highlight: true, start: '10:00', end: '16:00' }
            });
            schObj.appendTo('#Schedule');
            expect(schObj.getWorkCellElements().length).toEqual(48 * 7);
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(12 * 5);

            schObj.workHours = { highlight: true, start: '08:00', end: '15:00' };
            schObj.dataBind();
            expect(schObj.getWorkCellElements().length).toEqual(48 * 7);
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(14 * 5);

            schObj.workHours = { highlight: false };
            schObj.dataBind();
            expect(schObj.getWorkCellElements().length).toEqual(48 * 7);
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(0);
        });

        it('show weekend', () => {
            schObj = new Schedule({
                currentView: 'Week', selectedDate: new Date(2017, 9, 5),
                showWeekend: false
            });
            schObj.appendTo('#Schedule');
            expect(schObj.getWorkCellElements().length).toEqual(48 * 5);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Mon</div><div class="e-header-date e-navigate" role="link">2</div>');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Mon</div><div class="e-header-date e-navigate" role="link">9</div>');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).
                toEqual('<div class="e-header-day">Mon</div><div class="e-header-date e-navigate" role="link">16</div>');
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Mon</div><div class="e-header-date e-navigate" role="link">9</div>');

            schObj.showWeekend = true;
            schObj.dataBind();
            expect(schObj.getWorkCellElements().length).toEqual(48 * 7);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Sun</div><div class="e-header-date e-navigate" role="link">8</div>');
        });

        it('work days', () => {
            schObj = new Schedule({
                currentView: 'Week', selectedDate: new Date(2017, 9, 5),
                workDays: [0, 1, 3, 4]
            });
            schObj.appendTo('#Schedule');
            expect(schObj.getWorkCellElements().length).toEqual(48 * 7);
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(18 * 4);
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(18 * 4);

            schObj.workDays = [0, 2, 3];
            schObj.dataBind();
            expect(schObj.getWorkCellElements().length).toEqual(48 * 7);
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(18 * 3);

            schObj.showWeekend = false;
            schObj.dataBind();
            expect(schObj.getWorkCellElements().length).toEqual(48 * 3);
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(18 * 3);
        });

        it('first day of Week', () => {
            schObj = new Schedule({
                currentView: 'Week', selectedDate: new Date(2017, 9, 5), firstDayOfWeek: 2
            });
            schObj.appendTo('#Schedule');
            expect(schObj.getWorkCellElements().length).toEqual(48 * 7);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Tue</div><div class="e-header-date e-navigate" role="link">3</div>');

            schObj.firstDayOfWeek = 1;
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Mon</div><div class="e-header-date e-navigate" role="link">2</div>');
        });

        it('date format', () => {
            schObj = new Schedule({
                currentView: 'Week', selectedDate: new Date(2017, 9, 5),
                dateFormat: 'MMM dd yyyy'
            });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('Oct 01 2017 - Oct 07 2017');

            schObj.dateFormat = 'dd MMM yyyy';
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('01 Oct 2017 - 07 Oct 2017');
        });

        it('date header template', () => {
            schObj = new Schedule({
                currentView: 'Week', selectedDate: new Date(2017, 9, 5),
                dateHeaderTemplate: '<span>${getDateHeaderText(data.date)}</span>'
            });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>Sun, 10/1</span>');

            schObj.dateHeaderTemplate = '<span>${getShortDateTime(data.date)}</span>';
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).
                toEqual('<span>10/1/17, 12:00 AM</span>');
        });

        it('cell template', () => {
            let templateEle: HTMLElement = createElement('div', {
                innerHTML: '<span class="custom-element"></span>'
            });
            schObj = new Schedule({
                currentView: 'Week', selectedDate: new Date(2017, 9, 5),
                cellTemplate: templateEle.innerHTML
            });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelectorAll('.custom-element').length).toEqual(49 * 7);
            expect(schObj.element.querySelector('.e-date-header-container .e-all-day-cells').innerHTML).
                toEqual(templateEle.innerHTML);

            schObj.cellTemplate = '<span>${getShortDateTime(data.date)}</span>';
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-header-container .e-all-day-cells').innerHTML).
                toEqual('<span>10/1/17, 12:00 AM</span>');
            expect(schObj.element.querySelectorAll('.e-work-cells')[3].innerHTML).toEqual('<span>10/4/17, 12:00 AM</span>');
        });

        it('check current date class', () => {
            schObj = new Schedule({
                currentView: 'Week'
            });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelector('.e-date-header-container .e-current-day').classList).toContain('e-header-cells');
        });

        it('work cell click', () => {
            schObj = new Schedule({
                currentView: 'Week', selectedDate: new Date(2017, 9, 5)
            });
            schObj.appendTo('#Schedule');
            let firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.classList).not.toContain('e-selected-cell');
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
            firstWorkCell.click();
            expect(firstWorkCell.classList).toContain('e-selected-cell');
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('true');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
        });

        it('header cell click day view navigation', () => {
            let navFn: jasmine.Spy = jasmine.createSpy('navEvent');
            schObj = new Schedule({
                navigating: navFn,
                currentView: 'Week', selectedDate: new Date(2017, 9, 5)
            });
            schObj.appendTo('#Schedule');
            expect(navFn).toHaveBeenCalledTimes(0);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Sun</div><div class="e-header-date e-navigate" role="link">1</div>');
            (schObj.element.querySelector('.e-date-header-container .e-header-cells .e-navigate') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Sun</div><div class="e-header-date e-navigate" role="link">1</div>');
            expect(navFn).toHaveBeenCalledTimes(1);
        });
    });

    describe('Client side events', () => {
        let schObj: Schedule;
        beforeEach((): void => {
            schObj = undefined;
            let elem: HTMLElement = createElement('div', { id: 'Schedule' });
            document.body.appendChild(elem);
        });
        afterEach((): void => {
            if (schObj) {
                schObj.destroy();
            }
            remove(document.querySelector('#Schedule'));
        });

        it('events call confirmation', () => {
            let createdFn: jasmine.Spy = jasmine.createSpy('createdEvent');
            let clickFn: jasmine.Spy = jasmine.createSpy('clickEvent');
            let dblClickFn: jasmine.Spy = jasmine.createSpy('dblClickEvent');
            let beginFn: jasmine.Spy = jasmine.createSpy('beginEvent');
            let endFn: jasmine.Spy = jasmine.createSpy('endEvent');
            let navFn: jasmine.Spy = jasmine.createSpy('navEvent');
            let renderFn: jasmine.Spy = jasmine.createSpy('renderEvent');
            schObj = new Schedule({
                created: createdFn,
                cellClick: clickFn,
                cellDoubleClick: dblClickFn,
                actionBegin: beginFn,
                actionComplete: endFn,
                navigating: navFn,
                renderCell: renderFn,
                currentView: 'Week', selectedDate: new Date(2017, 9, 5)
            });
            schObj.appendTo('#Schedule');
            expect(createdFn).toHaveBeenCalledTimes(1);
            expect(beginFn).toHaveBeenCalledTimes(1);
            expect(endFn).toHaveBeenCalledTimes(1);
            (schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement).click();
            expect(clickFn).toHaveBeenCalledTimes(1);
            expect(renderFn).toHaveBeenCalledTimes(400);
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(renderFn).toHaveBeenCalledTimes(800);
            expect(beginFn).toHaveBeenCalledTimes(2);
            expect(endFn).toHaveBeenCalledTimes(2);
            expect(navFn).toHaveBeenCalledTimes(1);
        });

        it('cell select', () => {
            let eventName1: string;
            let eventName2: string;
            let eventName3: string;
            schObj = new Schedule({
                select: (args: SelectEventArgs) => {
                    eventName1 = args.name;
                },
                cellClick: (args: CellClickEventArgs) => {
                    eventName2 = args.name;
                },
                popupOpen: (args: PopupOpenEventArgs) => {
                    eventName3 = args.name;
                },
                currentView: 'Week', selectedDate: new Date(2017, 9, 5)
            });
            schObj.appendTo('#Schedule');
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(0);
            triggerMouseEvent(workCells[3], 'mousedown');
            triggerMouseEvent(workCells[3], 'mouseup');
            (schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement).click();
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(eventName1).toEqual('select');
            expect(eventName2).toEqual('cellClick');
            expect(eventName3).toEqual('popupOpen');
        });

        it('single and multiple cell click and selection', () => {
            let eventName: string;
            schObj = new Schedule({
                select: (args: SelectEventArgs) => {
                    eventName = args.name;
                },
                cellClick: (args: CellClickEventArgs) => {
                    eventName = args.name;
                },
                currentView: 'Week', selectedDate: new Date(2017, 9, 5)
            });
            schObj.appendTo('#Schedule');
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            expect(schObj.getSelectedElements().length).toEqual(0);
            triggerMouseEvent(workCells[135], 'mousedown');
            triggerMouseEvent(workCells[149], 'mousemove');
            triggerMouseEvent(workCells[149], 'mouseup');
            expect(eventName).toEqual('select');
            expect(schObj.getSelectedElements().length).toEqual(3);
            eventName = null;
            triggerMouseEvent(workCells[136], 'click');
            expect(eventName).toEqual('cellClick');
            expect(schObj.getSelectedElements().length).toEqual(1);
        });

        it('multi cell select', () => {
            let eventName: string;
            schObj = new Schedule({
                select: (args: SelectEventArgs) => {
                    eventName = args.name;
                },
                currentView: 'Week', selectedDate: new Date(2017, 9, 5)
            });
            schObj.appendTo('#Schedule');
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(0);
            triggerMouseEvent(workCells[135], 'mousedown');
            triggerMouseEvent(workCells[149], 'mousemove');
            triggerMouseEvent(workCells[149], 'mouseup');
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(3);
            expect(eventName).toEqual('select');
        });

        it('cell click', () => {
            let cellStartTime: number;
            let cellEndTime: number;
            let eventName: string;
            schObj = new Schedule({
                cellClick: (args: CellClickEventArgs) => {
                    cellStartTime = args.startTime.getTime();
                    cellEndTime = args.endTime.getTime();
                    eventName = args.name;
                },
                currentView: 'Week', selectedDate: new Date(2017, 9, 5)
            });
            schObj.appendTo('#Schedule');
            (schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement).click();
            expect(cellStartTime).toEqual(new Date(2017, 9, 4).getTime());
            expect(cellEndTime).toEqual(new Date(2017, 9, 4, 0, 30).getTime());
            expect(eventName).toEqual('cellClick');
        });

        it('cancel cell click', () => {
            schObj = new Schedule({
                cellClick: (args: CellClickEventArgs) => {
                    args.cancel = true;
                },
                currentView: 'Week', selectedDate: new Date(2017, 9, 5)
            });
            schObj.appendTo('#Schedule');
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement;
            expect(workCell.classList).not.toContain('e-selected-cell');
            expect(workCell.getAttribute('aria-selected')).toEqual('false');
            workCell.click();
            expect(workCell.classList).not.toContain('e-selected-cell');
            expect(workCell.getAttribute('aria-selected')).toEqual('false');
        });

        it('cell double click', () => {
            let cellStartTime: number;
            let cellEndTime: number;
            let eventName: string;
            schObj = new Schedule({
                cellDoubleClick: (args: CellClickEventArgs) => {
                    cellStartTime = args.startTime.getTime();
                    cellEndTime = args.endTime.getTime();
                    eventName = args.name;
                },
                currentView: 'Week', selectedDate: new Date(2017, 9, 5)
            });
            schObj.appendTo('#Schedule');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement, 'dblclick');
            expect(cellStartTime).toEqual(new Date(2017, 9, 4).getTime());
            expect(cellEndTime).toEqual(new Date(2017, 9, 4, 0, 30).getTime());
            expect(eventName).toEqual('cellDoubleClick');
        });

        it('cancel cell double click', () => {
            schObj = new Schedule({
                cellDoubleClick: (args: CellClickEventArgs) => {
                    args.cancel = true;
                },
                currentView: 'Week', selectedDate: new Date(2017, 9, 5)
            });
            schObj.appendTo('#Schedule');
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement;
            triggerMouseEvent(workCell, 'click');
            triggerMouseEvent(workCell, 'dblclick');
        });

        it('date navigating', () => {
            let actionBeginArgs: ActionEventArgs = {
                cancel: false, name: 'actionBegin',
                requestType: 'dateNavigate'
            };
            let actionCompleteArgs: ActionEventArgs = {
                cancel: false, name: 'actionComplete',
                requestType: 'dateNavigate'
            };
            let navArgs: NavigatingEventArgs = {
                action: 'date', cancel: false, name: 'navigating',
                currentDate: new Date(2017, 9, 12), previousDate: new Date(2017, 9, 5)
            };
            let args: NavigatingEventArgs; let beginArgs: ActionEventArgs; let completeArgs: ActionEventArgs;
            schObj = new Schedule({
                navigating: (e: NavigatingEventArgs) => {
                    args = e;
                },
                actionBegin: (e: ActionEventArgs) => {
                    beginArgs = e;
                },
                actionComplete: (e: ActionEventArgs) => {
                    completeArgs = e;
                },
                currentView: 'Week', selectedDate: new Date(2017, 9, 5)
            });
            schObj.appendTo('#Schedule');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(args).toEqual(jasmine.objectContaining(navArgs));
            expect(beginArgs).toEqual(jasmine.objectContaining(actionBeginArgs));
            expect(completeArgs).toEqual(jasmine.objectContaining(actionCompleteArgs));
        });

        it('cancel date navigate in action begin', () => {
            schObj = new Schedule({
                actionBegin: (e: ActionEventArgs) => {
                    e.cancel = true;
                },
                currentView: 'Week', selectedDate: new Date(2017, 9, 5)
            });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Sun</div><div class="e-header-date e-navigate" role="link">1</div>');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Sun</div><div class="e-header-date e-navigate" role="link">1</div>');
        });

        it('cancel date navigating', () => {
            schObj = new Schedule({
                navigating: (e: NavigatingEventArgs) => {
                    e.cancel = true;
                },
                currentView: 'Week', selectedDate: new Date(2017, 9, 5)
            });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Sun</div><div class="e-header-date e-navigate" role="link">1</div>');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Sun</div><div class="e-header-date e-navigate" role="link">1</div>');
        });

        it('view navigating', () => {
            let actionBeginArgs: ActionEventArgs = {
                cancel: false, name: 'actionBegin',
                requestType: 'viewNavigate'
            };
            let actionCompleteArgs: ActionEventArgs = {
                cancel: false, name: 'actionComplete',
                requestType: 'viewNavigate'
            };
            let navArgs: NavigatingEventArgs = {
                action: 'view', cancel: false, name: 'navigating',
                currentView: 'Day', previousView: 'Week'
            };
            let args: NavigatingEventArgs; let beginArgs: ActionEventArgs; let completeArgs: ActionEventArgs;
            schObj = new Schedule({
                navigating: (e: NavigatingEventArgs) => {
                    args = e;
                },
                actionBegin: (e: ActionEventArgs) => {
                    beginArgs = e;
                },
                actionComplete: (e: ActionEventArgs) => {
                    completeArgs = e;
                },
                currentView: 'Week', selectedDate: new Date(2017, 9, 5)
            });
            schObj.appendTo('#Schedule');
            (schObj.element.querySelector('.e-schedule-toolbar .e-day') as HTMLElement).click();
            expect(args).toEqual(jasmine.objectContaining(navArgs));
            expect(beginArgs).toEqual(jasmine.objectContaining(actionBeginArgs));
            expect(completeArgs).toEqual(jasmine.objectContaining(actionCompleteArgs));
        });

        it('cancel view navigate in action begin', () => {
            schObj = new Schedule({
                actionBegin: (e: ActionEventArgs) => {
                    e.cancel = true;
                },
                currentView: 'Week', selectedDate: new Date(2017, 9, 5)
            });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-week');
            (schObj.element.querySelector('.e-schedule-toolbar .e-day') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-week');
        });

        it('cancel view navigating', () => {
            schObj = new Schedule({
                navigating: (e: NavigatingEventArgs) => {
                    e.cancel = true;
                },
                currentView: 'Week', selectedDate: new Date(2017, 9, 5)
            });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-week');
            (schObj.element.querySelector('.e-schedule-toolbar .e-day') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-week');
        });
    });

    describe('method for interval count', () => {
        let schObj: Schedule;
        beforeEach((): void => {
            schObj = undefined;
            let elem: HTMLElement = createElement('div', { id: 'Schedule' });
            document.body.appendChild(elem);
        });
        afterEach((): void => {
            if (schObj) {
                schObj.destroy();
            }
            remove(document.querySelector('#Schedule'));
        });
        it('interval count', () => {
            schObj = new Schedule({
                height: '550px', width: '500px', currentView: 'Week',
                views: [{ option: 'Week', interval: 2 }], selectedDate: new Date(2017, 9, 4)
            });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelectorAll('.e-date-header-container .e-header-cells').length).toEqual(2 * 7);
            expect(schObj.getWorkCellElements().length).toEqual(48 * 7 * 2);
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML)
                .toEqual('October 01 - 14, 2017');
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Sun</div><div class="e-header-date e-navigate" role="link">1</div>');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML)
                .toEqual('October 15 - 28, 2017');
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Sun</div><div class="e-header-date e-navigate" role="link">15</div>');
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML)
                .toEqual('October 01 - 14, 2017');
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Sun</div><div class="e-header-date e-navigate" role="link">1</div>');
        });
    });

    describe('Resources with group', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            schObj = new Schedule({
                width: '100%',
                height: '550px',
                currentView: 'Week',
                selectedDate: new Date(2018, 3, 1),
                group: {
                    resources: ['Rooms', 'Owners']
                },
                resources: [
                    {
                        field: 'RoomId',
                        title: 'Room',
                        name: 'Rooms', allowMultiple: false,
                        dataSource: [
                            { text: 'ROOM 1', id: 1, color: '#cb6bb2' },
                            { text: 'ROOM 2', id: 2, color: '#56ca85' }
                        ],
                        textField: 'text', idField: 'id', colorField: 'color'
                    }, {
                        field: 'OwnerId',
                        title: 'Owner',
                        name: 'Owners', allowMultiple: true,
                        dataSource: [
                            { text: 'Nancy', id: 1, groupId: 1, color: '#ffaa00' },
                            { text: 'Steven', id: 3, groupId: 2, color: '#f8a398' },
                            { text: 'Michael', id: 5, groupId: 1, color: '#7499e1' }
                        ],
                        textField: 'text', idField: 'id', groupIDField: 'groupId', colorField: 'color'
                    }],
                eventSettings: { dataSource: [] },
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

        it('header rows count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-schedule-table tbody tr').length).toBe(4);
        });

        it('resource cells count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-resource-cells').length).toBe(5);
        });

        it('date header cells count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-header-cells').length).toBe(21);
        });
    });

    describe('Custom work days of Resources in group', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            schObj = new Schedule({
                width: '100%',
                height: '550px',
                currentView: 'Week',
                selectedDate: new Date(2018, 3, 1),
                group: {
                    resources: ['Rooms', 'Owners']
                },
                resources: [
                    {
                        field: 'RoomId',
                        title: 'Room',
                        name: 'Rooms', allowMultiple: false,
                        dataSource: [
                            { text: 'ROOM 1', id: 1, color: '#cb6bb2' },
                            { text: 'ROOM 2', id: 2, color: '#56ca85' }
                        ],
                        textField: 'text', idField: 'id', colorField: 'color'
                    }, {
                        field: 'OwnerId',
                        title: 'Owner',
                        name: 'Owners', allowMultiple: true,
                        dataSource: [
                            { text: 'Nancy', id: 1, groupId: 1, color: '#ffaa00', workDays: [1, 2] },
                            { text: 'Steven', id: 3, groupId: 2, color: '#f8a398' },
                            { text: 'Michael', id: 5, groupId: 1, color: '#7499e1' }
                        ],
                        textField: 'text', idField: 'id', groupIDField: 'groupId', colorField: 'color', workDaysField: 'workDays'
                    }],
                eventSettings: { dataSource: [] },
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

        it('header rows count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-schedule-table tbody tr').length).toBe(4);
        });

        it('resource cells count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-resource-cells').length).toBe(5);
        });

        it('date header cells count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-header-cells').length).toBe(21);
        });
    });

    describe('Resources with group by date', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            schObj = new Schedule({
                width: '100%',
                height: '550px',
                currentView: 'Week',
                selectedDate: new Date(2018, 3, 1),
                group: {
                    byDate: true,
                    resources: ['Rooms', 'Owners']
                },
                resources: [
                    {
                        field: 'RoomId',
                        title: 'Room',
                        name: 'Rooms', allowMultiple: false,
                        dataSource: [
                            { text: 'ROOM 1', id: 1, color: '#cb6bb2' },
                            { text: 'ROOM 2', id: 2, color: '#56ca85' }
                        ],
                        textField: 'text', idField: 'id', colorField: 'color'
                    }, {
                        field: 'OwnerId',
                        title: 'Owner',
                        name: 'Owners', allowMultiple: true,
                        dataSource: [
                            { text: 'Nancy', id: 1, groupId: 1, color: '#ffaa00' },
                            { text: 'Steven', id: 3, groupId: 2, color: '#f8a398' },
                            { text: 'Michael', id: 5, groupId: 1, color: '#7499e1' }
                        ],
                        textField: 'text', idField: 'id', groupIDField: 'groupId', colorField: 'color'
                    }],
                eventSettings: { dataSource: [] },
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

        it('header rows count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-schedule-table tbody tr').length).toBe(4);
        });

        it('resource cells count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-resource-cells').length).toBe(35);
        });

        it('date header cells count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-header-cells').length).toBe(7);
        });
    });


    describe('Default schedule block events', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let schOptions: ScheduleModel = { width: '500px', height: '500px', currentView: 'Week', selectedDate: new Date(2017, 9, 30) };
            schObj = util.createSchedule(schOptions, blockData.slice(0, 14), done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('block event initial rendering testing', () => {
            expect(schObj.element.querySelectorAll('.e-block-appointment').length).toEqual(4);
            let blockEvent: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(blockEvent.offsetTop).toEqual(720);
            expect(blockEvent.offsetWidth).toEqual(57);
            expect(blockEvent.offsetHeight).toEqual(108);
        });

        it('add event', (done: Function) => {
            let contentArea: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            let timeCellsArea: HTMLElement = schObj.element.querySelector('.e-time-cells-wrap') as HTMLElement;
            triggerScrollEvent(contentArea, 648);
            expect(contentArea.scrollTop).toEqual(648);
            expect(timeCellsArea.scrollTop).toEqual(648);
            expect(schObj.blockData.length).toEqual(7);
            triggerMouseEvent(schObj.element.querySelector('.e-work-cells') as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelector('.e-work-cells') as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let startObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startObj.value = new Date(2017, 9, 30, 10, 30);
            startObj.dataBind();
            let endObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endObj.value = new Date(2017, 9, 30, 11, 30);
            endObj.dataBind();
            let saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
            let alertDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            expect(schObj.quickPopup.quickDialog.visible).toBe(true);
            expect(alertDialog.querySelector('.e-dlg-content').innerHTML)
                .toEqual('Events cannot be scheduled within the blocked time range.');
            let okButton: HTMLElement = alertDialog.querySelector('.e-quick-alertok') as HTMLElement;
            okButton.click();
            expect(schObj.quickPopup.quickDialog.visible).toBe(false);
            let startRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startRevisedObj.value = new Date(2017, 9, 30, 1, 0);
            startRevisedObj.dataBind();
            let endRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endRevisedObj.value = new Date(2017, 9, 30, 2, 0);
            endRevisedObj.dataBind();
            saveButton.click();
            triggerScrollEvent(contentArea, 648);
            schObj.dataBound = (args: Object) => {
                expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
                let addedEvent: HTMLElement = schObj.element.querySelector('[data-id="Appointment_15"]') as HTMLElement;
                expect(addedEvent.offsetTop).toEqual(72);
                expect(addedEvent.offsetWidth).toEqual(53);
                expect(addedEvent.offsetHeight).toEqual(72);
                done();
            };
            schObj.dataBind();
        });

        it('edit event', (done: Function) => {
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            triggerMouseEvent(schObj.element.querySelector('.e-appointment') as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelector('.e-appointment') as HTMLElement, 'dblclick');
            let startObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startObj.value = new Date(2017, 9, 30, 10, 30);
            startObj.dataBind();
            let endObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endObj.value = new Date(2017, 9, 30, 11, 30);
            endObj.dataBind();
            let saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
            let alertDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            expect(schObj.quickPopup.quickDialog.visible).toBe(true);
            expect(alertDialog.querySelector('.e-dlg-content').innerHTML)
                .toEqual('Events cannot be scheduled within the blocked time range.');
            let okButton: HTMLElement = alertDialog.querySelector('.e-quick-alertok') as HTMLElement;
            okButton.click();
            expect(schObj.quickPopup.quickDialog.visible).toBe(false);
            let startRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startRevisedObj.value = new Date(2017, 9, 31, 9, 30);
            startRevisedObj.dataBind();
            let endRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endRevisedObj.value = new Date(2017, 9, 31, 11, 30);
            endRevisedObj.dataBind();
            saveButton.click();
            schObj.dataBound = (args: Object) => {
                expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
                let editedEvent: HTMLElement = schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement;
                expect(editedEvent.offsetTop).toEqual(684);
                expect(editedEvent.offsetWidth).toEqual(26);
                expect(editedEvent.offsetHeight).toEqual(144);
                done();
            };
            schObj.dataBind();
        });

        it('appointments rendering on block events on next week', (done: Function) => {
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            triggerMouseEvent(schObj.element.querySelector('.e-appointment') as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelector('.e-appointment') as HTMLElement, 'dblclick');
            let startObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startObj.value = new Date(2017, 10, 13, 10, 30);
            startObj.dataBind();
            let endObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endObj.value = new Date(2017, 10, 13, 11, 30);
            endObj.dataBind();
            let saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
            let alertDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            expect(schObj.quickPopup.quickDialog.visible).toBe(true);
            expect(alertDialog.querySelector('.e-dlg-content').innerHTML)
                .toEqual('Events cannot be scheduled within the blocked time range.');
            let okButton: HTMLElement = alertDialog.querySelector('.e-quick-alertok') as HTMLElement;
            okButton.click();
            expect(schObj.quickPopup.quickDialog.visible).toBe(false);
            let startRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startRevisedObj.value = new Date(2017, 10, 12, 9, 30);
            startRevisedObj.dataBind();
            let endRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endRevisedObj.value = new Date(2017, 10, 12, 11, 30);
            endRevisedObj.dataBind();
            saveButton.click();
            schObj.selectedDate = new Date(2017, 10, 12);
            schObj.dataBound = (args: Object) => {
                expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
                let editedEvent: HTMLElement = schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement;
                expect(editedEvent.offsetTop).toEqual(684);
                expect(editedEvent.offsetWidth).toEqual(53);
                expect(editedEvent.offsetHeight).toEqual(144);
                done();
            };
            schObj.dataBind();
        });

        it('Presence of data in popup test', () => {
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            triggerMouseEvent(schObj.element.querySelector('.e-appointment') as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelector('.e-appointment') as HTMLElement, 'dblclick');
            let startObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startObj.value = new Date(2017, 10, 13, 10, 30);
            startObj.dataBind();
            let endObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endObj.value = new Date(2017, 10, 13, 11, 30);
            endObj.dataBind();
            schObj.popupOpen = (args: PopupOpenEventArgs) => {
                expect(args.type).toEqual('ValidationAlert');
                expect(args.data).toBeTruthy();
            };
            let saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
            let alertDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            expect(schObj.quickPopup.quickDialog.visible).toBe(true);
            expect(alertDialog.querySelector('.e-dlg-content').innerHTML)
                .toEqual('Events cannot be scheduled within the blocked time range.');
            let okButton: HTMLElement = alertDialog.querySelector('.e-quick-alertok') as HTMLElement;
            okButton.click();
            expect(schObj.quickPopup.quickDialog.visible).toBe(false);
            let startRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startRevisedObj.value = new Date(2017, 10, 12, 9, 30);
            startRevisedObj.dataBind();
            let endRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endRevisedObj.value = new Date(2017, 10, 12, 11, 30);
            endRevisedObj.dataBind();
            saveButton.click();
        });
    });

    describe('Multi level resource rendering  in block events', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let schOptions: ScheduleModel = {
                height: '500px',
                width: '500px',
                currentView: 'Week',
                selectedDate: new Date(2017, 9, 30),
                group: {
                    resources: ['Rooms', 'Owners']
                },
                resources: [
                    {
                        field: 'RoomId', title: 'Room',
                        name: 'Rooms', allowMultiple: false,
                        dataSource: [
                            { RoomText: 'ROOM 1', RoomId: 1, RoomGroupId: 1, RoomColor: '#cb6bb2' },
                            { RoomText: 'ROOM 2', RoomId: 2, RoomGroupId: 1, RoomColor: '#56ca85' }
                        ],
                        textField: 'RoomText', idField: 'RoomId', groupIDField: 'RoomGroupId', colorField: 'RoomColor'
                    }, {
                        field: 'OwnerId', title: 'Owner',
                        name: 'Owners', allowMultiple: true,
                        dataSource: [
                            { OwnerText: 'Nancy', OwnerId: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                            { OwnerText: 'Steven', OwnerId: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                            { OwnerText: 'Michael', OwnerId: 3, OwnerGroupId: 1, OwnerColor: '#7499e1' }
                        ],
                        textField: 'OwnerText', idField: 'OwnerId', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
                    }
                ]
            };
            schObj = util.createSchedule(schOptions, blockData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('resource add event', (done: Function) => {
            let contentArea: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            let timeCellsArea: HTMLElement = schObj.element.querySelector('.e-time-cells-wrap') as HTMLElement;
            triggerScrollEvent(contentArea, 648);
            expect(contentArea.scrollTop).toEqual(648);
            expect(timeCellsArea.scrollTop).toEqual(648);
            expect(schObj.blockData.length).toEqual(10);
            triggerMouseEvent(schObj.element.querySelector('.e-work-cells') as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelector('.e-work-cells') as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let startObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startObj.value = new Date(2017, 9, 30, 10, 30);
            startObj.dataBind();
            let endObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endObj.value = new Date(2017, 9, 30, 11, 30);
            endObj.dataBind();
            let saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
            let alertDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            expect(schObj.quickPopup.quickDialog.visible).toBe(true);
            expect(alertDialog.querySelector('.e-dlg-content').innerHTML)
                .toEqual('Events cannot be scheduled within the blocked time range.');
            let okButton: HTMLElement = alertDialog.querySelector('.e-quick-alertok') as HTMLElement;
            okButton.click();
            expect(schObj.quickPopup.quickDialog.visible).toBe(false);
            let startRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startRevisedObj.value = new Date(2017, 9, 30, 1, 0);
            startRevisedObj.dataBind();
            let endRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endRevisedObj.value = new Date(2017, 9, 30, 2, 0);
            endRevisedObj.dataBind();
            saveButton.click();
            triggerScrollEvent(contentArea, 648);
            schObj.dataBound = (args: Object) => {
                expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
                let addedEvent: HTMLElement = schObj.element.querySelector('[data-id="Appointment_22"]') as HTMLElement;
                expect(addedEvent.offsetTop).toEqual(72);
                expect(addedEvent.offsetWidth).toEqual(33);
                expect(addedEvent.offsetHeight).toEqual(72);
                done();
            };
            schObj.dataBind();
        });

        it('resource edit event', (done: Function) => {
            triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let startObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startObj.value = new Date(2017, 9, 30, 10, 0);
            startObj.dataBind();
            let endObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endObj.value = new Date(2017, 9, 30, 11, 30);
            endObj.dataBind();
            let saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
            let alertDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            expect(schObj.quickPopup.quickDialog.visible).toBe(true);
            expect(alertDialog.querySelector('.e-dlg-content').innerHTML)
                .toEqual('Events cannot be scheduled within the blocked time range.');
            let okButton: HTMLElement = alertDialog.querySelector('.e-quick-alertok') as HTMLElement;
            okButton.click();
            expect(schObj.quickPopup.quickDialog.visible).toBe(false);
            let startRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startRevisedObj.value = new Date(2017, 9, 31, 9, 30);
            startRevisedObj.dataBind();
            let endRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endRevisedObj.value = new Date(2017, 9, 31, 11, 30);
            endRevisedObj.dataBind();
            saveButton.click();
            schObj.dataBound = (args: Object) => {
                expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
                let editedEvent: HTMLElement = schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement;
                expect(editedEvent.offsetTop).toEqual(684);
                expect(editedEvent.offsetWidth).toEqual(33);
                expect(editedEvent.offsetHeight).toEqual(144);
                done();
            };
            schObj.dataBind();
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
