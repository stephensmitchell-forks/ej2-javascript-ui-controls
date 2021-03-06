/**
 * Rte module spec document
 */
import { select, selectAll } from '@syncfusion/ej2-base';
import { InPlaceEditor } from '../../src/inplace-editor/base/index';
import { Rte } from '../../src/inplace-editor/modules/index';
import * as classes from '../../src/inplace-editor/base/classes';
import { renderEditor, triggerKeyBoardEvent, destroy } from './../render.spec';
import { profile, inMB, getMemoryProfile } from './../common.spec';

InPlaceEditor.Inject(Rte);

describe('Rte module', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Basic testing', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        beforeAll((done: Function): void => {
            editorObj = renderEditor({
                type: 'RTE',
                name: 'TextEditor',
                value: 'test',
                mode: 'Inline'
            });
            ele = editorObj.element;
            done();
        });
        afterAll((): void => {
            destroy(editorObj);
        });
        it('element availability testing', () => {
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', ele).length === 1).toEqual(true);
        });
        it('Initial focus testing', () => {
            expect(document.activeElement.tagName === 'DIV').toEqual(true);
        });
        it('Value property testing', () => {
            expect(editorObj.rteModule.compObj.value === '<p>test</p>').toEqual(true);
            expect(editorObj.value === 'test').toEqual(true);
        });
        it('Name property testing', () => {
            expect(select('#TextEditor_editor-value', editorObj.element).getAttribute('name')).toEqual('TextEditor');
        });
        it('save method with value property testing', () => {
            editorObj.rteModule.compObj.value = 'testing';
            editorObj.rteModule.compObj.dataBind();
            editorObj.save();
            expect(valueEle.innerHTML === '<p>testing</p>').toEqual(true);
        });
        it('Without compObj data to update value method testing', () => {
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', ele).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('<p>testing</p>');
            expect(editorObj.rteModule.compObj.value).toEqual('<p>testing</p>');
            editorObj.rteModule.compObj.value = 'Tested';
            expect(editorObj.rteModule.compObj.value).toEqual('Tested');
            editorObj.rteModule.compObj = undefined;
            editorObj.save();
            expect(editorObj.value).toEqual('<p>testing</p>');
        });
    });
    describe('Duplicate ID availability testing', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        afterEach((): void => {
            destroy(editorObj);
        });
        it('Inline - ID testing', () => {
            editorObj = renderEditor({
                mode: 'Inline',
                type: 'RTE'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', ele).length === 1).toEqual(true);
            expect(selectAll('#' + ele.id, document.body).length === 1).toEqual(true);
        });
        it('Popup - ID testing', () => {
            editorObj = renderEditor({
                mode: 'Popup',
                type: 'RTE'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(true);
            expect(selectAll('#' + ele.id, document.body).length === 1).toEqual(true);
        });
    });
    describe('Value formatting related testing', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        afterEach((): void => {
            destroy(editorObj);
        });
        it('Default value with initial render testing', () => {
            editorObj = renderEditor({
                type: 'RTE',
                mode: 'Inline'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Empty');
            editorObj.emptyText = 'Enter some text';
            editorObj.dataBind();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLElement>select('.e-content', document.body)).innerText.trim()).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = 'Welcome';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('Welcome');
            expect(valueEle.innerHTML).toEqual('Welcome');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('Welcome');
            expect((<HTMLElement>select('.e-content', document.body)).innerText.trim()).toEqual('Welcome');
            editorObj.save();
            expect(editorObj.value).toEqual('<p>Welcome</p>');
            expect(valueEle.innerHTML).toEqual('<p>Welcome</p>');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLElement>select('.e-content', document.body)).innerText.trim()).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
        });
        it('Value as "null" with initial render testing', () => {
            editorObj = renderEditor({
                type: 'RTE',
                mode: 'Inline',
                value: null
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Empty');
            editorObj.emptyText = 'Enter some text';
            editorObj.dataBind();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLElement>select('.e-content', document.body)).innerText.trim()).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = 'Welcome';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('Welcome');
            expect(valueEle.innerHTML).toEqual('Welcome');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('Welcome');
            expect((<HTMLElement>select('.e-content', document.body)).innerText.trim()).toEqual('Welcome');
            editorObj.save();
            expect(editorObj.value).toEqual('<p>Welcome</p>');
            expect(valueEle.innerHTML).toEqual('<p>Welcome</p>');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLElement>select('.e-content', document.body)).innerText.trim()).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
        });
        it('Value as "undefined" string with initial render testing', () => {
            editorObj = renderEditor({
                type: 'RTE',
                mode: 'Inline',
                value: undefined
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Empty');
            editorObj.emptyText = 'Enter some text';
            editorObj.dataBind();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLElement>select('.e-content', document.body)).innerText.trim()).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = 'Welcome';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('Welcome');
            expect(valueEle.innerHTML).toEqual('Welcome');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('Welcome');
            expect((<HTMLElement>select('.e-content', document.body)).innerText.trim()).toEqual('Welcome');
            editorObj.save();
            expect(editorObj.value).toEqual('<p>Welcome</p>');
            expect(valueEle.innerHTML).toEqual('<p>Welcome</p>');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLElement>select('.e-content', document.body)).innerText.trim()).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
        });
        it('Value as empty string with initial render testing', () => {
            editorObj = renderEditor({
                type: 'RTE',
                mode: 'Inline',
                value: ''
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Empty');
            editorObj.emptyText = 'Enter some text';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLElement>select('.e-content', document.body)).innerText.trim()).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = 'Welcome';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('Welcome');
            expect(valueEle.innerHTML).toEqual('Welcome');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('Welcome');
            expect((<HTMLElement>select('.e-content', document.body)).innerText.trim()).toEqual('Welcome');
            editorObj.save();
            expect(editorObj.value).toEqual('<p>Welcome</p>');
            expect(valueEle.innerHTML).toEqual('<p>Welcome</p>');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLElement>select('.e-content', document.body)).innerText.trim()).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
        });
        it('Defined value with initial render testing', () => {
            editorObj = renderEditor({
                type: 'RTE',
                mode: 'Inline',
                value: 'RichText'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(editorObj.value).toEqual('RichText');
            expect(valueEle.innerHTML).toEqual('RichText');
            editorObj.emptyText = 'Enter some text';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('RichText');
            expect(valueEle.innerHTML).toEqual('RichText');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('RichText');
            editorObj.save();
            expect(editorObj.value).toEqual('<p>RichText</p>');
            expect(valueEle.innerHTML).toEqual('<p>RichText</p>');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLElement>select('.e-content', document.body)).innerText.trim()).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = 'RichTextEditor';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('RichTextEditor');
            expect(valueEle.innerHTML).toEqual('RichTextEditor');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('RichTextEditor');
            expect((<HTMLElement>select('.e-content', document.body)).innerText.trim()).toEqual('RichTextEditor');
            editorObj.save();
            expect(editorObj.value).toEqual('<p>RichTextEditor</p>');
            expect(valueEle.innerHTML).toEqual('<p>RichTextEditor</p>');
        });
    });

    // Enter key action not working inside RTE
    describe('Enter key action testing inside RTE', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        afterAll((): void => {
            destroy(editorObj);
        });
        it('Enter key testing', () => {
            editorObj = renderEditor({
                type: 'RTE',
                mode: 'Inline',
                value: 'RichText'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(editorObj.value).toEqual('RichText');
            expect(valueEle.innerHTML).toEqual('RichText');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(true);
            triggerKeyBoardEvent(select('.e-rte-content .e-content', ele) as HTMLElement, 13);
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(true);
            (<HTMLElement>select('.e-btn-save', ele)).focus();
            triggerKeyBoardEvent(select('.e-btn-save', ele) as HTMLElement, 13);
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(false);
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(false);
        });
    });

    // inplce editor text is not saved in RTE
    describe('inplce editor RTE text Save', () => {
        let editorObj: any;
        let ele: HTMLElement;
        beforeAll((done: Function): void => {
            editorObj = renderEditor({
                type: 'RTE',
                name: 'TextEditor',
                value: 'testValue',
                mode: 'Inline'
            });
            ele = editorObj.element;
            done();
        });
        afterAll((): void => {
            destroy(editorObj);
        });
        it('Value property testing', () => {
            expect(editorObj.element.innerText === 'testValue').toEqual(true);
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