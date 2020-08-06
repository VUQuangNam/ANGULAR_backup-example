import { Component, ViewEncapsulation, OnInit } from '@angular/core';

// Plugins
import { ToastrService } from 'ngx-toastr';

// Modules
import { Helpers } from 'src/common/utils';
import { ErrorModel, Rank } from 'src/common/models';
import { RankService } from 'src/common/services';

@Component({
    selector: '.c-body',
    templateUrl: './create.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        RankService
    ]
})

export class CreateRankComponent implements OnInit {
    // Variables
    model: any = {};
    stores: any = [];

    // $search
    keypress: any;
    loading: boolean;

    constructor(
        private toastrService: ToastrService,
        private service: RankService,
        private helpers: Helpers
    ) { }

    ngOnInit() {
        // transform data
        this.model.customers = [];

        // final page load
        this.helpers.closeLoading();
    }

    /**
     * Search customers
     * @param {*} customers
     */
    handleSeachChange(customers) {
        const selected = [];
        customers.map(x => selected.push(x.id));
        this.model.customers = selected;
    }

    /**
     * Create customer
     * @param {*} f
     */
    onCreate() {
        this.helpers.openLoading();
        this.service.create(
            new Rank(this.model)
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
