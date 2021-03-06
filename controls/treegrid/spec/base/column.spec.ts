import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from './treegridutil.spec';
import { sampleData, projectData } from './datasource.spec';
import { PageEventArgs, QueryCellInfoEventArgs, doesImplementInterface, RowDataBoundEventArgs, ColumnModel } from '@syncfusion/ej2-grids';
import { Column } from '../../src';
import { profile, inMB, getMemoryProfile } from '../common.spec';

/**
 * Grid Column spec 
 */
describe('TreeGrid Column Module', () => {
  beforeAll(() => {
    const isDef = (o: any) => o !== undefined && o !== null;
    if (!isDef(window.performance)) {
        console.log("Unsupported environment, window.performance.memory is unavailable");
        this.skip(); //Skips test (in Chai)
        return;
    }
  });

  describe('conditional formatting - queryCellInfo and rowdatabound', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
          queryCellInfo: (args: QueryCellInfoEventArgs) => {
            if (args.column.field === 'taskID') {
              (<HTMLTableCellElement>args.cell).style.color = 'red';
            }
          },
          rowDataBound: (args: RowDataBoundEventArgs) => {
              (<HTMLTableRowElement>args.row).cells[2].style.color = 'yellow';
          }
        },
        done
      );
    });
    it('querycell', () => {
      rows = gridObj.getRows();
      expect((rows[1] as HTMLTableRowElement).cells[0].style.color).toBe('red');
      expect((rows[1] as HTMLTableRowElement).cells[2].style.color).toBe('yellow');
        });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Autogenerate columns - Hierarchy', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          dataBound: (args: Object) => {
            rows = this.getRows();
            expect(rows.length).toBeGreaterThan(0);
            expect(this.columns.length).toBe(8);
            done();
          }
        },
        done
      );
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Autogenerate columns - SelfReference', () => {
    let gridInstance: TreeGrid;
    let rows: Element[];
    beforeAll((done: Function) => {
      gridInstance = createGrid(
        {
          dataSource: projectData,
          childMapping: 'subtasks',
          idMapping: 'TaskID',
          parentIdMapping: 'parentID'
        },
        done
      );
    });
    it('empty columns', () => {
      rows = gridInstance.getRows();
      expect(rows.length).toBeGreaterThan(0);
      expect(gridInstance.columns.length).toBe(5);
    });
    afterAll(() => {
      destroy(gridInstance);
      gridInstance = null;
    });
  });
  describe('columns method', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          columns: [{field: 'taskID', headerText: 'Task ID'},
          {field: 'taskName', headerText: 'Task Name'},
          {field: 'startDate', headerText: 'Start Date'},
          {field: 'progress', headerText: 'Progress'}
        ]
        },
        done
      );
    });
    it('column methods', () => {
      expect(gridObj.getCellFromIndex(2, 1).querySelector('.e-treecell').textContent).toBe('Plan budget');
      expect(gridObj.getColumnByField('taskName').headerText).toBe('Task Name');
      let uid: string = gridObj.getHeaderContent().querySelectorAll('.e-headercelldiv')[1].getAttribute('e-mappinguid');
      expect(gridObj.getColumnByUid(uid).headerText).toBe('Task Name');
      expect(gridObj.getColumnFieldNames()[2]).toBe('startDate');
      expect(gridObj.getColumnHeaderByField('startDate').querySelector('.e-headertext').textContent).toBe('Start Date');
      expect(gridObj.getColumnHeaderByIndex(2).querySelector('.e-headertext').textContent).toBe('Start Date');
      expect(gridObj.getColumnHeaderByUid(uid).querySelector('.e-headertext').textContent).toBe('Task Name');
      expect(gridObj.getColumnIndexByField('progress')).toBe(3);
      expect(gridObj.getColumnIndexByUid(uid)).toBe(1);
      expect(gridObj.getColumns().length).toBe(4);
      expect(gridObj.getContent().classList.contains('e-gridcontent')).toBe(true);
      expect(gridObj.getContentTable().classList.contains('e-table')).toBe(true);
      expect(gridObj.getHeaderContent().classList.contains('e-gridheader')).toBe(true);
      expect(gridObj.getHeaderTable().classList.contains('e-table')).toBe(true);
      expect(gridObj.getRowByIndex(1).children[0].textContent).toBe('' + gridObj.flatData[1][gridObj.getColumns()[0].field]);
      expect(gridObj.getUidByColumnField('taskName')).toMatch(uid);
      (<Column>gridObj.columns[2]).visible = false;
      gridObj.refreshColumns();
      expect(gridObj.getVisibleColumns().length).toBe(3);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  it('memory leak', () => {
    profile.sample();
    let average: any = inMB(profile.averageChange)
    //Check average change in memory samples to not be over 10MB
    expect(average).toBeLessThan(10);
    let memory: any = inMB(getMemoryProfile())
    //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
    expect(memory).toBeLessThan(profile.samples[0] + 0.25);
});
});

