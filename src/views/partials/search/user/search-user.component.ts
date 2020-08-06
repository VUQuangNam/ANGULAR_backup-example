import { Component, ViewEncapsulation, Output, EventEmitter, Input } from '@angular/core';

// Modules
import { Customer } from 'src/common/models';
import { CustomerService } from 'src/common/services';

@Component({
    selector: 'app-search-user',
    templateUrl: './search-user.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [CustomerService]
})

export class SearchUserComponent {
    // Input
    @Input() members: any = [];
    @Output() callback = new EventEmitter<Customer[]>();

    // $search
    keypress: any;
    loading: boolean;
    searchData: any = [];

    constructor(
        private service: CustomerService
    ) { }


    /**
     * Search customers
     * @param {*} $event
     */
    onSearch($event) {
        this.loading = true;
        clearTimeout(this.keypress);
        this.keypress = setTimeout(() => {
            const params = {
                skip: 0,
                limit: 20,
                keyword: $event.term
            };
            this.service.list(
                params as any
            ).then(res => {
                this.searchData = !res.code
                    ? [...res.data]
                    : [];
            }).catch(ex => {
                this.members = [];
                throw Error(ex);
            }).finally(() => {
                this.loading = false;
            });
        }, 500);
    }

    /**
     * Select member
     * @param {*} member
     */
    onSelectMember(member) {
        try {
            const data = [...this.members];
            data.push(member);
            this.members = data;
            return this.callback.emit(
                this.members
            );
        } catch (ex) {
            throw Error(ex);
        }
    }

    /**
     * Remove member
     * @param {*} memberId
     */
    onRemoveMember(memberId) {
        try {
            const index = this.members.findIndex(
                x => x.id === memberId
            );
            this.members.splice(
                index, 1
            );
            return this.callback.emit(
                this.members
            );
        } catch (ex) {
            throw Error(ex);
        }
    }
}
