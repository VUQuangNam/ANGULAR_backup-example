import { Component, ViewEncapsulation, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

// Plugins
import { ToastrService } from 'ngx-toastr';

// Modules
import { Helpers } from 'src/common/utils';
import { ErrorModel, Customer, Storage, CustomerTypes, CustomerGenders } from 'src/common/models';
import { CustomerService, ModalService, RankService, CustomerGroupService } from 'src/common/services';

@Component({
    selector: 'modal-add-customer',
    templateUrl: './create.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        RankService,
        CustomerGroupService,
        CustomerService
    ]
})

export class CreateCustomerComponent implements OnInit {
    // Variables
    model: any = {};
    store: any = {};
    facebook: any = {};

    // Binding
    ranks: any = [];
    stores: any = [];
    sources: any = [];
    relations: any = [];
    customers: any = [];

    // Search
    keypress: any;
    loading: boolean;

    // Redirect
    queryParams: any = {};

    constructor(
        private modalService: ModalService,
        private toastrService: ToastrService,
        private rankService: RankService,
        private service: CustomerService,
        private helpers: Helpers,
        private router: Router
    ) { }

    async ngOnInit() {
        try {
            this.helpers.openLoading();

            // load default config
            const config = new Customer();
            this.sources = config.sources;
            this.relations = config.relations;

            // Load stores
            this.stores = JSON.parse(localStorage.getItem(Storage.STORES));

            // Load ranks
            const respone = await this.rankService.list({ skip: 0, limit: 20 } as any);
            this.ranks = respone.data ? respone.data : [];

            // Load default data
            this.model = {};
            this.store = {};
            this.facebook = {};
            this.model.gender = CustomerGenders.MALE;
            this.model.type = CustomerTypes.INDIVIDUAL;
            this.model.relation = this.relations[0].id;
            this.model.source = this.sources[0].id;
            this.model.rank_id = null;
        } catch (ex) {
            throw Error(ex);
        } finally {
            this.helpers.closeLoading();
        }
    }

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
                this.customers = !res.code
                    ? [...res.data]
                    : [];
            }).catch(ex => {
                this.customers = [];
                throw Error(ex);
            }).finally(() => {
                this.loading = false;
            });
        }, 500);
    }

    /**
     * Create customer
     * @param {*} f
     */
    onCreate() {
        this.helpers.openLoading();
        // transform data
        this.model.store = this.model.store;
        this.model.facebook = this.model.facebook;

        // submit
        this.service.create(
            new Customer(this.model)
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

    /**
     * Handle call back
     * @param {*} image
     */
    handleImageCallback = ($image) => this.model.avatar = $image;

    /**
     * Close modal
     * @private
     */
    onClose = () => {
        this.modalService.close(CreateCustomerComponent);
        const params = Object.assign(
            this.queryParams,
            { ref: Date.now() }
        );
        return this.router.navigate(
            ['customers'],
            { queryParams: params }
        );
    }

}
