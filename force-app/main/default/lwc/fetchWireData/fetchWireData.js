import { LightningElement, wire, track, api } from 'lwc';
// import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import CHECKLIST_OBJECT from '@salesforce/schema/Checklist2__c';
import PICKLIST_1 from '@salesforce/schema/Checklist2__c.Picklist1__c';
import DESCRIPTION_FIELD from '@salesforce/schema/Checklist2__c.description__c';
import STATUS_FIELD from '@salesforce/schema/Checklist2__c.status__c';
import NAME_FIELD from '@salesforce/schema/Checklist2__c.Name';

import getRecordIds from '@salesforce/apex/FetchMultipleItems.search';

export default class FetchWireData extends LightningElement {
    
    @track objectInfo;

    @api rerender = 0;

    @api recordId = [];

    @track isVisible = true;

    @track objectApiName = CHECKLIST_OBJECT.objectApiName;

    @track status;

    createItemfields = [DESCRIPTION_FIELD, STATUS_FIELD, PICKLIST_1, NAME_FIELD];

    fields = [DESCRIPTION_FIELD, STATUS_FIELD, PICKLIST_1];

    @track accounts;
    @track error;

    @wire(getRecordIds)
    wiredAccounts({ error, data }) {
        if (data) {
            this.recordId = data;
            this.error = undefined;
            this.recordId.length === 0 && this.showInfoToast();
        } else if (error) {
            this.error = error;
            this.accounts = undefined;
            this.showErrorToast();
        }
    }

    // @wire(getObjectInfo, { objectApiName: CHECKLIST_OBJECT })
    // objectInfo;//in parent object

    // @wire(getRecord, { recordId: 'a016D000000NqWn', fields:['Checklist2__c.status__c'] })
    // status;

    // @wire(getRecord, { recordId: '012000000000000AAA', fields: [NAME_FIELD] })
    // data

    // get checklistName() {
    //     return CHECKLIST_OBJECT.objectApiName;
    // }

    // get recordId() {
    //     return this.objectInfo.data.defaultRecordTypeId;
    // }

    // get fieldNames() {
    //     const clName = this.checklistName;
    //     return [
    //         `${clName}.Name`, 
    //         `${clName}.Picklist1__c`, 
    //         `${clName}.Picklist2__c`, 
    //         `${clName}.description__c`,
    //         `${clName}.status__c`
    //     ]
    // }

    // @wire(getRecord, { recordId: '012000000000000AAA', fields })
    // data;

    // wiredRecord({ error, data }) {
    //     if (error) {
    //         this.dispatchEvent(
    //             new ShowToastEvent({
    //                 title: 'Error loading data',
    //                 message: error.message,
    //                 variant: 'error',
    //             }),
    //         );
    //     } else if (data) {
    //         this.data = data.fields;
    //     }
    // }

    // @wire(getPicklistValues, {
    //     recordTypeId: '012000000000000AAA',
    //     fieldApiName: PICKLIST_1
    // })
    // picklist1Values;

    // @wire(getPicklistValues, {
    //     recordTypeId: '012000000000000AAA',
    //     fieldApiName: PICKLIST_2
    // })
    // picklist2Values;

    // @wire(getListUi, {
    //     objectApiName: CHECKLIST_OBJECT,
    //     listViewApiName: 'Checklist2__c',
    // })
    // listView;
    showErrorToast() {
        const evt = new ShowToastEvent({
            title: 'Application Error',
            message: 'Something went wrong ',
            variant: 'error',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }

    showInfoToast() {
            const evt = new ShowToastEvent({
                title: 'Application Info',
                message: 'Empty checklist, Please add items',
                variant: 'info',
                mode: 'dismissable'
            });
            this.dispatchEvent(evt);
        }

    showSuccessToast(event) {
        const evt = new ShowToastEvent({
            title: "New checklist item created",
            message: "Record ID: "+ event.detail.id,
            variant: "success",
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    } 

    handleCreateItemVisibility() {
        this.isVisible = false;
    }

    handleCreateChecklistItem(event) {
        this.showSuccessToast(event);
        this.isVisible = true;
        this.rerender = this.rerender + 1;
    }

     picklistValuesMethod() {
         
        console.log('this.picklist1Values, this.picklist1Values, this.objectInfo, this.status: ', this.picklist1Values, this.picklist1Values, this.objectInfo, this.status.data.fields.status__c.value, this.listView);
    }
}