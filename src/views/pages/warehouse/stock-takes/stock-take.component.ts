import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

// Plugins
import { cloneDeep } from 'lodash';

// Modules
import { StockTakeService } from 'src/common/services';
import { Helpers, TypesUtilsService } from 'src/common/utils';
import { StockTakeNormalStatuses, Storage, StockTake } from 'src/common/models';

@Component({
    selector: '.c-body',
    templateUrl: './stock-take.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        StockTakeService
    ]
})

export class StockTakeComponent implements OnInit {
    // Variable
    stores: any = [];
    imports: any = [];
    filters: any = [];
    collums: any = [];
    queryParams: any = {};
    isFirstLoad = true;
    pageTotal = 0;

    constructor(
        private helper: Helpers,
        private service: StockTakeService,
        private typeService: TypesUtilsService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        // Load Configuration
        const model = new StockTake();
        this.collums = [...model.collums] as [];
        this.filters = [...model.filters] as [];

        // Load stores
        this.stores = JSON.parse(
            localStorage.getItem(
                Storage.STORES
            )
        );
    }

    ngOnInit() {
        this.route.queryParamMap.subscribe(async (queryParams: Params) => {
            this.helper.openLoading();
            if (this.isFirstLoad) {
                this.isFirstLoad = false;
                this.router.navigate(['inventory/stock-takes']);
            }

            // Perpare parmas
            const params = cloneDeep(queryParams.params);
            if (!params.stores || !params.stores.length) {
                params.stores = this.stores.map(x => x.id);
            }
            const limit = params.limit || 20;
            const page = parseInt(params.page || 0, 10);
            const skip = limit * (page <= 0 ? 0 : page - 1);
            this.queryParams = Object.assign({ skip, limit }, params);

            // send request
            await this.service.list(
                this.queryParams
            ).then(respone => {
                if (respone.code) {
                    this.imports = [];
                    alert(respone.message);
                    return null;
                }
                this.pageTotal = respone.count;
                this.imports = respone.data.map(el => {
                    // Pipe status
                    el.status_name = StockTakeNormalStatuses[el.status.toUpperCase()];

                    // Pipe date
                    el.created_at = this.typeService.formatDate(
                        el.created_at,
                        'DD/MM/YYYY hh:mm'
                    );
                    el.updated_at = this.typeService.formatDate(
                        el.updated_at,
                        'DD/MM/YYYY hh:mm'
                    );
                    el.confirmed_at = el.confirmed_at
                        ? this.typeService.formatDate(
                            el.confirmed_at,
                            'DD/MM/YYYY hh:mm'
                        )
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
     * Download File
     * @param {*} data
     */
    onDownLoadFile() {
        alert('Chức năng đang trong quá trình hoàn thành mẫu phiếu. Chúng tôi sẽ sớm cập chức năng này!');
        return true;
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
