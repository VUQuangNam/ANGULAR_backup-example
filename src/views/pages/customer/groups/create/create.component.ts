import { Component, ViewEncapsulation, OnInit } from '@angular/core';

// Plugins
import { ToastrService } from 'ngx-toastr';

// Modules
import { Helpers } from 'src/common/utils';
import { ErrorModel, CustomerGroup, Storage } from 'src/common/models';
import { CustomerGroupService } from 'src/common/services';

@Component({
    selector: '.c-body',
    templateUrl: './create.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        CustomerGroupService
    ]
})

export class CreateCustomerGroupComponent implements OnInit {
    // Variables
    model: any = {};
    stores: any = [];

    // $search
    keypress: any;
    loading: boolean;

    constructor(
        private toastrService: ToastrService,
        private service: CustomerGroupService,
        private helpers: Helpers
    ) { }

    ngOnInit() {

        // transform data
        this.stores = JSON.parse(
            localStorage.getItem(Storage.STORES)
        );
        this.model.store = this.stores[0];
        this.model.customers = [];

        // final page load
        this.helpers.closeLoading();
    }

    /**
     * Search customers
     * @param {*} customers
     */
    handleSeachChange(customers) {
        this.model.customers = [...customers];
    }

    /**
     * Create customer
     * @param {*} f
     */
    onCreate() {
        this.helpers.openLoading();
        this.service.create(
            new CustomerGroup(this.model)
        ).then(res => {
            if (res.code) {
                const error = new ErrorModel(res);
                this.toastrService.warning(error.getMessage);
                return false;
            }

            // TODO:: Success
            $('form').trigger('reset');
            this.toastrService.success('Thêm mới thành công!');
            return true;
        }).catch(ex => {
            throw (ex);
        }).finally(() => {
            this.helpers.closeLoading();
        });
    }
}
