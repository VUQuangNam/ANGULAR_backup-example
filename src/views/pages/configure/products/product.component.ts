import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

// Plugins
import { cloneDeep } from 'lodash';

// Modules
import { Helpers, TypesUtilsService } from 'src/common/utils';
import { ProductService, ModalService } from 'src/common/services';
import { Product, ProductTypes } from 'src/common/models';

// Components
// import { CreateMaterialComponent } from './create/create.component';

// Components


@Component({
    selector: '.c-body',
    templateUrl: './product.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        ProductService
    ]
})

export class ProductComponent implements OnInit {
    // Variable
    products: any = [];
    filters: any = [];
    collums: any = [];
    queryParams: any = {};
    isFirstLoad = true;
    pageTotal = 0;

    constructor(
        private helper: Helpers,
        private service: ProductService,
        private typeService: TypesUtilsService,
        private modalService: ModalService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        // TODO: Load Configuration
        const model = new Product();
        this.collums = [...model.collums] as [];
        this.filters = [...model.filters] as [];
    }

    ngOnInit() {
        this.route.queryParamMap.subscribe(async (queryParams: Params) => {
            this.helper.openLoading();
            if (this.isFirstLoad) {
                this.isFirstLoad = false;
                this.router.navigate(['setting/products']);
            }

            // Perpare parmas
            const params = cloneDeep(queryParams.params);
            params.types = ProductTypes.AVAILABLE;
            const limit = params.limit || 20;
            const page = parseInt(params.page || 0, 10);
            const skip = limit * (page <= 0 ? 0 : page - 1);
            this.queryParams = Object.assign({ skip, limit }, params);

            // TODO: Get list
            await this.service.list(
                this.queryParams
            ).then(respone => {
                if (respone.code) {
                    this.products = [];
                    alert(respone.message);
                    return null;
                }
                this.pageTotal = respone.count;
                this.products = respone.data.map(el => {
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
                throw Error(ex);
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
     * Show modal
     * @param {*} null
     */
    opendModal() {
        // this.modalService.open(
        //     CreateMaterialComponent,
        //     { class: 'modal-xl' }
        // );
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
