import { Component, ViewEncapsulation, OnInit } from '@angular/core';

// Plugins
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

// Modules
import { Helpers } from 'src/common/utils';
import { ErrorModel, Export, Storage } from 'src/common/models';
import { ExportService, StoreService } from 'src/common/services';

@Component({
    selector: '.c-body',
    templateUrl: './create.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        StoreService,
        ExportService
    ]
})

export class CreateExportComponent implements OnInit {
    // Variables
    model: any = {};
    privateStores: any = [];
    publicStores: any = [];

    constructor(
        private toastrService: ToastrService,
        private storeService: StoreService,
        private service: ExportService,
        private helpers: Helpers
    ) {
        // Load configuration
        this.privateStores = JSON.parse(
            localStorage.getItem(Storage.STORES)
        );

        // Load default data
        this.reloadData();
    }

    async ngOnInit() {
        try {
            // Load store services
            const respone = await this.storeService.list({ skip: 0, limit: 50 } as any);
            this.publicStores = respone.code ? [] : respone.data;
        } catch (ex) {
            throw Error(ex);
        } finally {
            // final page load
            this.helpers.closeLoading();
        }
    }

    /**
     * Reload default data
     * @private
     */
    reloadData() {
        // transform data
        this.model = {};
        this.model.type = 1; // chuyển kho
        this.model.store = {}; // chi nhánh nhận
        this.model.items = []; // hàng hóa
        this.model.source = this.privateStores[0]; // chi nhánh xuất
    }

    /**
     * Change Source
     * @param {*} $event
     */
    onChangeSource($event) {
        const sourceId = $event.target.value;
        const source = this.privateStores.find(
            x => x.id === sourceId
        );
        if (source) {
            this.model.source = { ...source };
        }
    }

    /**
     * Create customer
     * @param {*} f
     */
    onCreate() {
        this.helpers.openLoading();

        // transform data
        if (this.model.type === 2) {
            this.model.store.id = 'normal';
        }

        // submit data
        this.service.create(
            new Export(this.model)
        ).then(res => {
            if (res.code) {
                const error = new ErrorModel(res);
                this.toastrService.warning(error.getMessage);
                return false;
            }

            // TODO:: Success
            this.reloadData();
            this.toastrService.success('Thêm mới thành công!');
            return true;
        }).catch(ex => {
            throw (ex);
        }).finally(() => {
            this.helpers.closeLoading();
        });
    }

    /**
     * Search items
     * @param {*} items
     */
    handleSeachChange(items) {
        this.model.total_price = 0;
        this.model.total_quantity = 0;
        this.model.items = [...items];
        this.model.items.map(x => {
            this.model.total_price += x.total_price;
            this.model.total_quantity += x.total_quantity;
        });
    }

}
