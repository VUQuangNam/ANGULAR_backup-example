import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

// Modules
import { Helpers, TypesUtilsService } from 'src/common/utils';
import { StaffService } from 'src/common/services';
import { Staff } from 'src/common/models';



@Component({
    selector: '.c-body',
    templateUrl: './staff.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        StaffService
    ]
})

export class StaffComponent implements OnInit {
    // Variable
    staffs: any = [];
    filters: any = [];
    collums: any = [];
    queryParams: any = {};
    isFirstLoad = true;
    pageTotal = 0;

    constructor(
        private helper: Helpers,
        private service: StaffService,
        private typeService: TypesUtilsService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        // TODO: Load Configuration
        const model = new Staff();
        this.collums = [...model.collums] as [];
        this.filters = [...model.filters] as [];
    }

    ngOnInit() {
        this.route.queryParamMap.subscribe(async (queryParams: Params) => {
            this.helper.openLoading();
            if (this.isFirstLoad) {
                this.isFirstLoad = false;
                this.router.navigate(['setting/staffs']);
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
                    this.staffs = [];
                    alert(respone.message);
                    return null;
                }
                this.pageTotal = respone.count;
                this.staffs = respone.data.map(el => {
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
