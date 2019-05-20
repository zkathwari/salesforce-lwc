import { LightningElement, api, track } from 'lwc';

export default class TodoList extends LightningElement {
    @track filteredTodos = [];

    _todos = [];

    priorityFilter = false;//if filter based on status is required is required 

    @api
    get todos() {
        return this._todos;
    }
    set todos(value) {
        this._todos = value;
        this.filterTodos();
    }

    
    filterTodos() {
        //incase filter based on status is required
        if (this.priorityFilter) {
            this.filteredTodos = this._todos.filter(
                todo => todo.priority === true
            );
        } else {
            this.filteredTodos = this._todos.filter(
                todo => todo.description !== undefined
            );
        }
    }

    handleStatusCheckboxChange(event) {
        const checkboxChangeEvent = new CustomEvent('checkboxchange', {
            detail: {
                isChecked: event.target.checked, 
                id: event.target.dataset.id, 
                description: event.target.dataset.description
            }
        });
      
        this.dispatchEvent(checkboxChangeEvent);
    }
}
