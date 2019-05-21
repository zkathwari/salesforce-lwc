import { LightningElement, track } from 'lwc';

export default class CheckList extends LightningElement {
    lastTodoId = 0;

    @track todos = [];

    @track description = undefined;

    @track priority = false;

    @track dropdownValue = 'new';

    get dropdownOptions() {
        return [
            { label: 'New wizard in the loom', value: 'new' },
            { label: 'Wizard In Progress', value: 'inProgress' },
            { label: 'Wizard did Finished', value: 'finished' },
        ];
    }

    handlePicklistChange(event) {
        this.dropdownValue = event.detail.value;
    }

    addPicklistItemToCheckist(){ 
        for (let i = 0; i < this.dropdownOptions.length; i += 1) {
            if(this.dropdownOptions[i].value === this.dropdownValue) {
                console.log('this.dropdownOptions[i].value: ', this.dropdownOptions[i].label);
                this.description = this.dropdownOptions[i].label;
                break;
            } 
        }

        this.handleSave() 
    }

    updateChecklist(prop) {
        for (let i = 0; i < this.todos.length; i += 1) {
            if (this.todos[i].id === Number(prop.detail.id)) {
                this.todos.splice(i, 1);
                this.todos = [
                    ...this.todos,
                    {
                        id: prop.detail.id, 
                        description: prop.detail.description, 
                        priority: prop.detail.isChecked
                    }
                ]
                this.todos.sort((a, b) => { 
                    return a.id - b.id;
                });
                break;
            }
        }   
    }

    handleSave() {
        let islistValid = this.description !== undefined;

        if (islistValid) {
            //check duplicate description
            for (let i = 0; i < this.todos.length; i += 1) {
                if (this.todos[i].description === this.description) {
                    islistValid = false;
                    break;
                }
            }
            if(this.description !== '') {
                if(islistValid) {
                    this.lastTodoId = this.lastTodoId + 1;
                    this.todos = [
                        ...this.todos,
                        {
                            id: this.lastTodoId,
                            description: this.description,
                            priority: this.priority
                        }
                    ]
                }
            }
        }
    }
}