import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

// Plugins
import { ToastrService } from 'ngx-toastr';

// Modules
import { ErrorModel } from 'src/common/models';
import { Helpers, TypesUtilsService } from 'src/common/utils';
import { CustomerService, RankService, CustomerGroupService } from 'src/common/services';

@Component({
    selector: '.c-body',
    templateUrl: './detail.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        RankService,
        CustomerGroupService,
        CustomerService
    ]
})

export class DetailCustomerComponent implements OnInit {
    // Variables
    model: any = {};
    component: number;

    constructor(
        private typeService: TypesUtilsService,
        private toastrService: ToastrService,
        private service: CustomerService,
        private route: ActivatedRoute,
        private helpers: Helpers
    ) { }

    async ngOnInit() {
        this.route.queryParamMap.subscribe(async (queryParams: Params) => {
            const { params } = queryParams;
            switch (params.tab) {
                case 'info': this.component = 1; break;
                case 'orders': this.component = 2; break;
                case 'metrics': this.component = 3; break;
                default: this.component = 1; break;
            }

            if (!this.model.id) {
                await this.service.detail(
                    this.route.snapshot.params.id
                ).then(res => {
                    if (res.code) {
                        const error = new ErrorModel(res);
                        this.toastrService.warning(error.getMessage);
                        return false;
                    }

                    // Handle Success
                    this.model = res.data;
                    // Pipe date
                    this.model.created_at = this.typeService.formatDate(
                        this.model.created_at,
                        'DD/MM/YYYY hh:mm'
                    );
                    this.model.updated_at = this.typeService.formatDate(
                        this.model.updated_at,
                        'DD/MM/YYYY hh:mm'
                    );
                    this.model.birthday = this.model.birthday
                        ? this.typeService.datePipe(this.model.birthday)
                        : null;
                }).catch(ex => {
                    throw Error(ex);
                }).finally(() => {
                    this.helpers.closeLoading();
                });
            }
        });
    }
}
