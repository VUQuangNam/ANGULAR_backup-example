import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Helpers, TypesUtilsService } from 'src/common/utils';

import { Customer } from 'src/common/models';
import { CustomerService, ModalService } from 'src/common/services';
import { CreateCustomerComponent } from './create/create.component';


@Component({
    selector: '.c-body',
    templateUrl: './customer.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        CustomerService
    ]
})

export class CustomerComponent implements OnInit {
    // Variable
    filters: any = [];
    collums: any = [];
    customers: any = [];
    queryParams: any = {};
    isFirstLoad = true;
    pageTotal = 0;

    constructor(
        private helper: Helpers,
        private service: CustomerService,
        private typeService: TypesUtilsService,
        private modalService: ModalService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        // TODO: Load Configuration
        const defaultCollums = new Customer().collums;
        this.collums = [...defaultCollums] as [];

        const defaultFilters = new Customer().filters;
        this.filters = [...defaultFilters] as [];
    }

    async ngOnInit() {
        this.route.queryParamMap.subscribe(async (queryParams: Params) => {
            this.helper.openLoading();
            if (this.isFirstLoad) {
                this.isFirstLoad = false;
                this.router.navigate(['customers']);
            }

            // Perpare parmas
            const { params } = queryParams;
            const limit = params.limit || 20;
            const page = parseInt(params.page || 0, 10);
            const skip = limit * (page <= 0 ? 0 : page - 1);
            this.queryParams = Object.assign({ skip, limit }, params);

            // TODO: Get list
            await this.service.list(
                this.queryParams
            ).then(respone => {
                if (respone.code) {
                    this.customers = [];
                    alert(respone.message);
                    return null;
                }
                this.pageTotal = respone.count;
                this.customers = respone.data.map(el => {
                    // Pipe date
                    el.created_at = this.typeService.formatDate(
                        el.created_at,
                        'DD/MM/YYYY hh:mm'
                    );
                    el.updated_at = this.typeService.formatDate(
                        el.updated_at,
                        'DD/MM/YYYY hh:mm'
                    );
                    el.birthday = el.birthday
                        ? this.typeService.formatDate(el.birthday, 'DD/MM/YYYY')
                        : null;
                    el.last_purchase = el.last_purchase
                        ? this.typeService.formatDate(el.last_purchase, 'DD/MM/YYYY hh:mm')
                        : null;
                    return el;
                });
            }).catch(ex => {
                throw ex;
            }).finally(() => {
                this.helper.closeLoading();
            });
        });
    }

    /**
     * Search by keyword
     * @param {*} $event
     */
    onSearch($event) {
        this.router.navigate(
            ['customers'],
            {
                queryParams: Object.assign(
                    this.queryParams,
                    { keyword: $event.target.value }
                )
            }
        );
    }

    /**
     * Download File
     * @param {*} data
     */
    onDownLoadFile() {
        alert('Chức năng đang trong quá trình hoàn thành mẫu phiếu. Chúng tôi sẽ sớm cập chức năng này!');
        return true;
    }

    /**
     * Upload File
     * @param {*} data
     */
    onUpLoadFile() {
        alert('Chức năng đang trong quá trình hoàn thành mẫu phiếu. Chúng tôi sẽ sớm cập chức năng này!');
        return true;
    }

    /**
     * Show modal
     * @param {*} null
     */
    opendModal() {
        const initialState = {
            queryParams: this.queryParams
        };
        this.modalService.open(
            CreateCustomerComponent,
            { class: 'modal-xl', initialState }
        );
    }

    /**
     * Change Collum
     */
    onChangeCollum(collumId: string) {
        const collums = this.collums;
        collums.map(
            x => x.id === collumId
                ? x.active = !x.active
                : x.active = x.active
        );
        this.collums = [...collums];
    }
}
