import { LightningElement, wire, track, api } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import CHECKLIST_OBJECT from '@salesforce/schema/Checklist2__c';
import PICKLIST_1 from '@salesforce/schema/Checklist2__c.Picklist1__c';
import DESCRIPTION_FIELD from '@salesforce/schema/Checklist2__c.description__c';
import STATUS_FIELD from '@salesforce/schema/Checklist2__c.status__c';
import NAME_FIELD from '@salesforce/schema/Checklist2__c.Name';

import getRecordIds from '@salesforce/apex/FetchMultipleItems.search';
import getUserDetails from '@salesforce/apex/UserInfoDetails.getUserDetails';

export default class FetchWireData extends LightningElement {
    @track title = 'ChecklistTitle';

    @track objectInfo;

    @api recordId = [];

    @track isVisible = true;

    @track objectApiName = CHECKLIST_OBJECT.objectApiName;

    createItemfields = [DESCRIPTION_FIELD, STATUS_FIELD, PICKLIST_1, NAME_FIELD];

    fields = [DESCRIPTION_FIELD, STATUS_FIELD, PICKLIST_1];

    @track accounts;
    @track error;

    @track user;
    
    @track userError;

    @wire(getUserDetails)
    wiredUser({ error, data }) {
        if (data) {
            this.user = data;
            console.log(this.user.Name === 'System Administrator');
        } else if (error) {
            this.userError = error;
        }
    }

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

    setChecklistTitle(event) {
        this.title = event.detail.value;
    }
   
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
        this.isVisible = !this.isVisible;
    }

    handleCreateChecklistItem(event) {
        this.showSuccessToast(event);
        this.isVisible = true;
    }
}