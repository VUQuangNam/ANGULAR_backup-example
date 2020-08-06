import { Component, ViewEncapsulation, OnInit } from '@angular/core';

// Plugins
import { ToastrService } from 'ngx-toastr';

// Modules
import { Helpers } from 'src/common/utils';
import { ErrorModel, Import, Storage } from 'src/common/models';
import { ImportService } from 'src/common/services';

@Component({
    selector: '.c-body',
    templateUrl: './create.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        ImportService
    ]
})

export class CreateImportComponent implements OnInit {
    // Variables
    model: any = {};
    stores: any = [];

    constructor(
        private toastrService: ToastrService,
        private service: ImportService,
        private helpers: Helpers
    ) {
        // Load configuration
        this.stores = JSON.parse(
            localStorage.getItem(Storage.STORES)
        );
    }

    ngOnInit() {
        // transform data
        this.model.items = [];
        this.model.source = {};
        this.model.store = this.stores[0];

        // final page load
        this.helpers.closeLoading();
    }

    /**
     * Search items
     * @param {*} items
     */
    handleSeachChange(items) {
        this.model.total_price = 0;
        this.model.total_quantity = 0;
        this.model.items = [...items];
        this.model.items.map(x => {
            this.model.total_price += x.total_price;
            this.model.total_quantity += x.total_quantity;
        });
    }

    /**
     * Create customer
     * @param {*} f
     */
    onCreate() {
        this.helpers.openLoading();
        this.service.create(
            new Import(this.model)
        ).then(res => {
            if (res.code) {
                const error = new ErrorModel(res);
                this.toastrService.warning(error.getMessage);
                return false;
            }

            // TODO:: Success
            this.model.items = [];
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
