import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Gantt } from '../base/gantt';
import * as cls from '../base/css-constants';
import { Splitter as SplitterLayout, ResizeEventArgs, ResizingEventArgs } from '@syncfusion/ej2-layouts';
import { SplitterSettingsModel } from '../models/models';
import { ISplitterResizedEventArgs } from '../base/interface';
/**
 * Splitter related goes here
 */
export class Splitter {
    private parent: Gantt;
    public splitterObject: SplitterLayout;
    public splitterPreviousPositionGrid: string;
    public splitterPreviousPositionChart: string;
    constructor(ganttObj?: Gantt) {
        this.parent = ganttObj;
        this.parent.on('destroy', this.destroy, this);
    }
    /**
     * @private
     */
    public renderSplitter(): void {
        let toolbarHeight: number = 0;
        if (!isNullOrUndefined(this.parent.toolbarModule) && !isNullOrUndefined(this.parent.toolbarModule.element)) {
            toolbarHeight = this.parent.toolbarModule.element.offsetHeight;
        }
        let splitterPosition: string = this.calculateSplitterPosition(this.parent.splitterSettings);
        this.parent.splitterElement = createElement('div', { className: cls.splitter });
        this.parent.treeGridPane = createElement('div', { className: cls.treeGridPane });
        this.parent.chartPane = createElement('div', { className: cls.ganttChartPane });
        this.parent.splitterElement.appendChild(this.parent.treeGridPane);
        this.parent.splitterElement.appendChild(this.parent.chartPane);

        this.splitterObject = new SplitterLayout({
            height: (this.parent.ganttHeight - toolbarHeight).toString(),
            width: this.parent.ganttWidth.toString(),
            separatorSize: this.parent.splitterSettings.separatorSize,
            paneSettings: [
                {
                    resizable: true,
                    size: splitterPosition,
                    min: this.getSpliterPositionInPercentage(this.parent.splitterSettings.minimum)
                },
                {
                    resizable: true
                }
            ],
            orientation: 'Horizontal',
            resizeStart: (args: ResizeEventArgs) => {
                this.splitterPreviousPositionGrid = args.pane[0].scrollWidth + 1 + 'px';
                this.splitterPreviousPositionChart = args.pane[1].scrollWidth + 1 + 'px';
                this.parent.trigger('splitterResizeStart', args);
            },
            resizing: (args: ResizingEventArgs) => {
                this.parent.trigger('splitterResizing', args);
            },
            resizeStop: (args: ISplitterResizedEventArgs) => {
                this.parent.trigger('splitterResized', args);
                if (args.cancel === true) {
                    this.splitterObject.paneSettings[0].size = null;
                    this.splitterObject.paneSettings[0].size = this.getSpliterPositionInPercentage(this.splitterPreviousPositionGrid);
                    this.splitterObject.paneSettings[1].size = null;
                    this.splitterObject.paneSettings[1].size = this.getSpliterPositionInPercentage(this.splitterPreviousPositionChart);
                }
            }
        });
        this.parent.element.appendChild(this.parent.splitterElement);
        this.splitterObject.appendTo(this.parent.splitterElement);
    }
    /**
     * @private
     */
    public calculateSplitterPosition(splitter: SplitterSettingsModel, isDynamic?: boolean): string {
        if (splitter.view === 'Grid') {
            return '100%';
        } else if (splitter.view === 'Chart') {
            return '0%';
        } else {
            if (!isNullOrUndefined(splitter.position) && splitter.position !== '') {
                return this.getSpliterPositionInPercentage(splitter.position);
            } else if (!isNullOrUndefined(splitter.columnIndex) && splitter.columnIndex >= 0) {
                return isDynamic ? this.getSpliterPositionInPercentage(
                    this.getTotalColumnWidthByIndex(splitter.columnIndex).toString() + 'px') :
                    this.getSpliterPositionInPercentage((splitter.columnIndex * 150) + 'px');
            } else {
                return this.getSpliterPositionInPercentage('250px');
            }
        }
    }
    /**
     * 
     */
    private getSpliterPositionInPercentage(position: string): string {
        let value: string = !isNullOrUndefined(position) && position !== '' ? position : null;
        if (!isNullOrUndefined(value)) {
            if (position.indexOf('px') !== -1) {
                let intValue: number = parseInt(position, 10);
                value = (((intValue / this.parent.ganttWidth) * 100) <= 100 ? ((intValue / this.parent.ganttWidth) * 100) + '%' :
                    '100%');
            } else {
                value = position.indexOf('%') === -1 ?
                    position + '%' : position;
            }
        }
        return value;
    }
    /**
     * 
     */
    private getTotalColumnWidthByIndex(index: number): number {
        let width: number = 0;
        let tr: NodeList = this.parent.treeGrid.element.querySelectorAll('.e-headercell');
        index = tr.length > index ? index : tr.length;
        for (let column: number = 0; column < index; column++) {
            width = width + (tr[column] as HTMLElement).offsetWidth;
        }
        return width;
    }
    /**
     * @private
     */
    public updateSplitterPosition(): void {
        this.splitterObject.separatorSize = this.parent.splitterSettings.separatorSize >= 4 ?
            this.parent.splitterSettings.separatorSize : 4;
        let splitterPosition: string = this.calculateSplitterPosition(this.parent.splitterSettings, true);
        this.splitterObject.paneSettings[0].min = this.getSpliterPositionInPercentage(this.parent.splitterSettings.minimum);
        this.splitterObject.dataBind();
        this.splitterObject.paneSettings[0].size = splitterPosition;
    }
    /**
     * @private
     */
    public triggerCustomResizedEvent(): void {
        let pane1: HTMLElement = this.splitterObject.element.querySelectorAll('.e-pane')[0] as HTMLElement;
        let pane2: HTMLElement = this.splitterObject.element.querySelectorAll('.e-pane')[1] as HTMLElement;
        let eventArgs: ISplitterResizedEventArgs = {
            event: null,
            element: this.splitterObject.element as HTMLElement,
            pane: [pane1, pane2],
            index: [0, 1],
            separator: this.splitterObject.element.querySelector('.e-split-bar') as HTMLElement,
            paneSize: [pane1.offsetWidth, pane2.offsetWidth]
        };
        this.parent.trigger('splitterResized', eventArgs);
        if (eventArgs.cancel === true) {
            this.splitterObject.paneSettings[0].size = this.getSpliterPositionInPercentage(this.splitterPreviousPositionGrid);
            this.splitterObject.paneSettings[1].size = this.getSpliterPositionInPercentage(this.splitterPreviousPositionChart);
        }
    }
    private destroy(): void {
        this.splitterObject.destroy();
        this.parent.off('destroy', this.destroy);
    }
}