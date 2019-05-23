import { LightningElement, wire, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import CHECKLIST_OBJECT from '@salesforce/schema/Checklist2__c';
import CHECKLIST_TITLE_OBJECT from '@salesforce/schema/ChecklistTitle__c';

import PICKLIST_1 from '@salesforce/schema/Checklist2__c.Picklist1__c';
import DESCRIPTION_FIELD from '@salesforce/schema/Checklist2__c.description__c';
import STATUS_FIELD from '@salesforce/schema/Checklist2__c.status__c';
import NAME_FIELD from '@salesforce/schema/Checklist2__c.Name';
import TITLE_NAME_FIELD from '@salesforce/schema/ChecklistTitle__c.Name';

import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

import getRecordIds from '@salesforce/apex/FetchMultipleItems.search';
import getUserDetails from '@salesforce/apex/UserInfoDetails.getUserDetails';
import getUserId from '@salesforce/apex/UserInfoDetails.getUserId';

const TITLE_RECORD_ID = 'a026D000001FOsPQAW';
const SYSTEM_ADMIN = 'System Administrator';
const TITLE_UPDATE_SUCCESS = 'Title updated successfully';
const CHECKLIST_CREATED_SUCCESS ="Checklist item created successfully";
const EMPTY_CHECKLIST_INFO = 'Empty checklist, Please add items';
const ERROR_MESSAGE = 'Something went wrong';
export default class Checklist extends LightningElement {
    @track titleRecord;
    @track title = 'Checklist';//default

    _titleChanged;

    @track objectInfo;

    objectTitleInfo;

    @track isVisible = true;

    ChecklistObjectApiName = CHECKLIST_OBJECT.objectApiName;
    titleObjectApi = CHECKLIST_TITLE_OBJECT.objectApiName;

    createChecklistItemfields = [DESCRIPTION_FIELD, STATUS_FIELD, PICKLIST_1, NAME_FIELD];

    titleField = [TITLE_NAME_FIELD]

    renderChecklistfields = [DESCRIPTION_FIELD, STATUS_FIELD, PICKLIST_1];

    @track error;

    @track isAdminUser;

    @track userError;

    recordOwnerId = [];
    userOwnerId;

    @track filteredRecords;
    @track areRecordsThere = false;

    renderCount = 0;//guard wasted render

    set changedTitle(value) {
        this._titleChanged = value;
    }

    get changedTitle() {
        return this._titleChanged;
    }

    @wire(getRecord, {
        recordId: TITLE_RECORD_ID,
        fields: [TITLE_NAME_FIELD]
    })
    titleRecord;

    renderedCallback() {
        let currentRecords = [];
        this.renderCount += 1;

        if (this.renderCount < 3) {
            if (this.titleRecord.data) {
                this.title = getFieldValue(this.titleRecord.data, TITLE_NAME_FIELD);
            } else {
                this.title = 'Checklist';
            }

            if (this.recordOwnerId.length > 0 && typeof this.userOwnerId === 'string') {
                currentRecords = this.recordOwnerId.filter((selectedOwnerId) => {
                    return selectedOwnerId.OwnerId === this.userOwnerId;
                });
                this.areRecordsThere = currentRecords.length > 0 ? true : false;
                this.filteredRecords = currentRecords;
            }
        }
    }

    @wire(getUserId)
    wiredUserId({ data, error }) {
        if (data) {
            this.userOwnerId = data.Id;
        } else if (error) {
            console.log('user error', error);
            this.showErrorToast();
        }
    }

    @wire(getUserDetails)
    wiredUser({ error, data }) {
        if (data) {
            this.isAdminUser = data.Name === SYSTEM_ADMIN;
        } else if (error) {
            console.log(error);
            this.showErrorToast();
        }
    }

    @wire(getRecordIds)
    wiredAccounts({ error, data }) {
        if (data) {
            this.recordOwnerId = data;
            this.error = undefined;
            this.recordOwnerId.length === 0 && this.showInfoToast();
        } else if (error) {
            this.error = error;
            this.recordOwnerId = undefined;
            this.showErrorToast();
        }
    }

    showErrorToast() {
        const evt = new ShowToastEvent({
            title: 'Application Error',
            message: ERROR_MESSAGE,
            variant: 'error',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }

    showInfoToast() {
        const evt = new ShowToastEvent({
            title: 'Application Info',
            message: EMPTY_CHECKLIST_INFO,
            variant: 'info',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }

    showSuccessToast({ event, title }) {
        const evt = new ShowToastEvent({
            title,
            message: "Record ID: " + event.detail.id,
            variant: "success",
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }

    handleCreateItemVisibility() {
        this.isVisible = !this.isVisible;
    }

    handleSuccessTitleChange(event) {
        this.showSuccessToast({ event, title: TITLE_UPDATE_SUCCESS })
        this.title = this._titleChanged;
    }

    handleTitleChange(event) {
        this._titleChanged = event.target.value;
    }

    handleCreateChecklistItem(event) {
        this.showSuccessToast({ event, title: CHECKLIST_CREATED_SUCCESS });
        this.isVisible = true;
    }
}