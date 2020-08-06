import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

// Plugins
import swal from 'sweetalert2';
import { ProductionService, CategoryService, ModalService } from 'src/common/services';

// Modules
import { Helpers, TypesUtilsService } from 'src/common/utils';
import { Storage, Product } from 'src/common/models';
import { ProcessDetailItemComponent } from './detail/detail-item.component';

@Component({
    selector: '.c-body',
    templateUrl: 'process.component.html',
    styleUrls: ['style.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        ProductionService,
        CategoryService,
        ModalService
    ]
})

export class ProcessComponent implements OnInit {
    // Variables
    queryParams: any = {};
    stores: any = [];
    products: any = [];
    statuses: any = {};
    categories: any = [];

    // filters
    filters: any = [];

    // config
    itemActive: any = {
        status: '',
        location: '',
        products: []
    };
    isFirstLoad = true;
    pageTotal = 0;
    selected = [];
    collums: any = [];
    dataCollums: any = [];

    constructor(
        private route: ActivatedRoute,
        private service: ProductionService,
        private helper: Helpers,
        private categoryService: CategoryService,
        private router: Router,
        private typeService: TypesUtilsService,
        private modalService: ModalService
    ) {
        /** load default store from client */
        this.stores = JSON.parse(
            localStorage.getItem(
                Storage.STORES
            )
        );
        const model = new Product();
        this.collums = [...model.collumsProcess] as [];
        this.dataCollums = this.collums;
        this.filters = [...model.filtersProcess] as [];
        this.statuses = this.service.statuses;
    }

    ngOnInit() {
        this.route.queryParamMap.subscribe(async (queryParams: Params) => {
            this.helper.openLoading();
            if (this.isFirstLoad) {
                this.isFirstLoad = false;
                // load config
                const innertHeight = window.innerHeight;
                const headerHeight = $('.c-right__header').height() * 5;
                $('.c-datatable').css({ height: innertHeight - headerHeight });
                const categories = await this.categoryService.list({});
                this.categories = categories.data || [];

                this.router.navigate(['process']);
            }
            this.selected = [];
            // Perpare parmas
            const { params } = queryParams;
            const limit = params.limit || 20;
            const page = parseInt(params.page || 0, 10);
            const skip = limit * (page <= 0 ? 0 : page - 1);
            this.queryParams = Object.assign({ skip, limit }, params);
            if (!this.queryParams.statuses) {
                this.queryParams.statuses = Object.keys(this.statuses).join(',');
            }
            this.itemActive = {
                status: '',
                location: '',
                products: []
            };
            // submit request
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
                    el.complete_process.complete_at = this.typeService.formatDate(
                        el.complete_process.complete_at,
                        'DD/MM/YYYY hh:mm'
                    );

                    el.cut_process.complete_at = this.typeService.formatDate(
                        el.cut_process.complete_at,
                        'DD/MM/YYYY hh:mm'
                    );

                    el.kcs_one_process.complete_at = this.typeService.formatDate(
                        el.kcs_one_process.complete_at,
                        'DD/MM/YYYY hh:mm'
                    );

                    el.prepare_process.complete_at = this.typeService.formatDate(
                        el.prepare_process.complete_at,
                        'DD/MM/YYYY hh:mm'
                    );

                    el.kcs_two_process.one = this.typeService.formatDate(
                        el.kcs_two_process.one,
                        'DD/MM/YYYY hh:mm'
                    );

                    el.kcs_two_process.two = this.typeService.formatDate(
                        el.kcs_two_process.two,
                        'DD/MM/YYYY hh:mm'
                    );

                    el.preview_process.complete_at = this.typeService.formatDate(
                        el.preview_process.complete_at,
                        'DD/MM/YYYY hh:mm'
                    );

                    el.sew_process.complete_at = this.typeService.formatDate(
                        el.sew_process.complete_at,
                        'DD/MM/YYYY hh:mm'
                    );

                    el.storage_process.complete_at = this.typeService.formatDate(
                        el.storage_process.complete_at,
                        'DD/MM/YYYY hh:mm'
                    );

                    el.status_name = this.statuses[el.status].name;

                    const categoryName = this.categories.find(x => x.id === el.category_id);
                    el.category_name = categoryName.name;
                    return el;
                });
            }).catch(ex => {
                throw ex;
            }).finally(() => {
                this.helper.closeLoading();
            });
        });

    }

    openModal = (row) => {
        let component = null;
        let initialState = null;
        const params = this.helper.parseParams(document.location.search);
        initialState = { row: row, queryParams: params };
        component = ProcessDetailItemComponent;
        this.modalService.open(
            component,
            { class: 'modal-xl-90', initialState }
        );
    }

    onRowSelected = (event) => {
        if (!event.length) return;
        const checkStatus = event[0].status;
        const value = event.find(x => x.status !== checkStatus);
        if (value) {
            this.itemActive.products = [];
        } else {
            switch (checkStatus) {
                case 'pending':
                    this.itemActive.status = 'cutting';
                    break;
                case 'cutting':
                    this.itemActive.status = 'preparing';
                    break;
                case 'preparing':
                    this.itemActive.status = 'sewing';
                    break;
                case 'sewing':
                    this.itemActive.status = 'kcs_one';
                    break;
                case 'kcs_one':
                    this.itemActive.status = 'completing';
                    break;
                case 'completing':
                    this.itemActive.status = 'kcs_two';
                    break;
                case 'kcs_two':
                    this.itemActive.status = 'storage';
                    break;
                case 'storage':
                    this.itemActive.status = 'back';
                    break;
            }
            this.itemActive.products = event.map(x => {
                return {
                    order_id: x.order_id,
                    product_id: x.id
                };
            });
        }
    }

    onCompleteItemProcess = async () => {
        try {
            if (this.itemActive.status === 'storage' && !this.itemActive.location) {
                return ($('#dunnio_select_store_ksc2') as any).modal('show');
            }
            if (this.itemActive.status === 'back') {
                return ($('#dunnio_select_status_storage') as any).modal('show');
            }
            if (this.itemActive.products.length) {
                const respone = await this.service.process(this.itemActive);
                if (respone.code) return swal.fire('Hệ Thống', respone.message, 'warning');
                swal.fire('Hệ Thống', respone.message, 'success');
                this.ngOnInit();
            } else {
                swal.fire('Hệ Thống', 'Vui lòng chọn sản phẩm cùng trạng thái để thực hiện chức năng này!', 'warning');
            }
        } catch (ex) {
            console.log(ex);
        }
    }

    onChangeCollum(collumId: string) {
        const collums = this.collums;
        collums.map(
            x => x.id === collumId
                ? x.active = !x.active
                : x.active = x.active
        );
        this.collums = [...collums];
        this.dataCollums = this.collums.filter(x => x.active);
    }
}
