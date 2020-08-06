import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

// Plugins
import { cloneDeep } from 'lodash';

// Modules
import { Helpers, TypesUtilsService } from 'src/common/utils';
import { ExportService } from 'src/common/services';
import { Export, ExportNormalStatuses, Storage } from 'src/common/models';

@Component({
    selector: '.c-body',
    templateUrl: './production.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        ExportService
    ]
})

export class ExportProductionComponent implements OnInit {
    // Variable
    stores: any = [];
    exports: any = [];
    filters: any = [];
    collums: any = [];
    queryParams: any = {};
    isFirstLoad = true;
    pageTotal = 0;

    constructor(
        private helper: Helpers,
        private service: ExportService,
        private typeService: TypesUtilsService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        // Load Configuration
        const model = new Export();
        this.filters = [...model.filters] as [];
        this.collums = [...model.productionCollums] as [];

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
                this.router.navigate(['inventory/productions']);
            }

            // Perpare parmas
            const params = cloneDeep(queryParams.params);
            params.types = [3]; // chuyển kho và xuất kho
            const limit = params.limit || 20;
            const page = parseInt(params.page || 0, 10);
            const skip = limit * (page <= 0 ? 0 : page - 1);
            this.queryParams = Object.assign({ skip, limit }, params);

            // send request
            await this.service.list(
                this.queryParams
            ).then(respone => {
                if (respone.code) {
                    this.exports = [];
                    alert(respone.message);
                    return null;
                }
                this.pageTotal = respone.count;
                this.exports = respone.data.map(el => {
                    // Pipe status
                    el.status_name = ExportNormalStatuses[el.status.toUpperCase()];

                    // Pipe date
                    el.created_at = this.typeService.formatDate(
                        el.created_at,
                        'DD/MM/YYYY hh:mm'
                    );
                    el.updated_at = this.typeService.formatDate(
                        el.updated_at,
                        'DD/MM/YYYY hh:mm'
                    );
                    el.received_at = el.received_at
                        ? this.typeService.formatDate(
                            el.received_at,
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
