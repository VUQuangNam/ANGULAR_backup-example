import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

// Modules
import { Helpers, TypesUtilsService } from 'src/common/utils';
import { StoreService, ModalService } from 'src/common/services';
import { Store } from 'src/common/models';

// Components
import { CreateStoreComponent } from './create/create.component';


@Component({
    selector: '.c-body',
    templateUrl: './store.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        StoreService
    ]
})

export class StoreComponent implements OnInit {
    // Variable
    stores: any = [];
    filters: any = [];
    collums: any = [];
    queryParams: any = {};
    isFirstLoad = true;
    pageTotal = 0;

    constructor(
        private helper: Helpers,
        private service: StoreService,
        private typeService: TypesUtilsService,
        private modalService: ModalService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        // TODO: Load Configuration
        const model = new Store();
        this.collums = [...model.collums] as [];
        this.filters = [...model.filters] as [];
    }

    ngOnInit() {
        this.route.queryParamMap.subscribe(async (queryParams: Params) => {
            this.helper.openLoading();
            if (this.isFirstLoad) {
                this.isFirstLoad = false;
                this.router.navigate(['setting/stores']);
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
                    this.stores = [];
                    alert(respone.message);
                    return null;
                }
                this.pageTotal = respone.count;
                this.stores = respone.data.map(el => {
                    // Pipe date
                    el.created_at = this.typeService.formatDate(
                        el.created_at,
                        'DD/MM/YYYY hh:mm'
                    );
                    el.updated_at = this.typeService.formatDate(
                        el.updated_at,
                        'DD/MM/YYYY hh:mm'
                    );
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
     * Show modal
     * @param {*} null
     */
    opendModal() {
        const initialState = {
            queryParams: this.queryParams
        };
        this.modalService.open(
            CreateStoreComponent,
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
