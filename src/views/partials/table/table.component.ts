import { Component, ViewEncapsulation, Input, EventEmitter, OnChanges, OnInit, Output } from '@angular/core';
import * as $ from 'jquery';

// Modules
import { Helpers } from 'src/common/utils';
import { ModalService } from 'src/common/services';

// Components
import { DetailStoreComponent } from 'src/views/pages/configure/stores/detail/detail.component';
import { DetailPriceBookComponent } from 'src/views/pages/configure/price-books/detail/detail.component';
import { DetailProductTypeComponent } from 'src/views/pages/configure/product-types/detail/detail.component';
import { DetailMaterialComponent } from 'src/views/pages/configure/materials/detail/detail.component';
import { ProcessDetailItemComponent } from 'src/views/pages/production/process/detail/detail-item.component';

@Component({
    selector: 'app-table-layout',
    templateUrl: './table.component.html',
    encapsulation: ViewEncapsulation.None
})

export class TableComponent implements OnInit, OnChanges {
    // data and collum
    @Input() rows: any = [];
    @Input() collums: any = [];
    @Input() queryParams?: object;
    @Input() uri?: string;

    // pagination
    @Input() pageTotal = 0;
    @Input() pageLimit = 20;
    @Input() pageCurrent = 0;

    // config table
    @Input() checkbox = false;
    @Input() columnMode = 'force';
    @Input() summaryPosition = 'top';
    @Input() summaryRow = false;

    // event
    @Output() callback = new EventEmitter();

    // data parse
    dataRows: any = [];
    dataCollums: any = [];
    isFirstLoad = true;

    constructor(
        private helpers: Helpers,
        private modalService: ModalService
    ) { }

    ngOnInit() {
        // check table height
        const innertHeight = window.innerHeight;
        const headerHeight = $('.c-right__header').height() * 5;
        $('.c-datatable').css({ height: innertHeight - headerHeight });
    }

    ngOnChanges() {
        if (this.rows) {
            // reload table data
            this.dataRows = [...this.rows];
        }
        if (this.collums) {
            // reload collums
            this.dataCollums = this.collums.filter(
                x => x.active === true
            );
        }
    }

    /**
     * Row selected
     * @param {*} $event
     */
    onRowSelected($event): void {
        console.log($event);
        this.callback.emit($event.selected);
    }


    /**
     * Page navigation
     * @param {*} $event
     */
    onChangePage = ($event) => {
        this.callback.emit($event);
    }

    /**
     * On open modal
     * @param {*} to
     * @param {*} id
     */
    openModal = (to: string, id: string) => {
        let component = null;
        let initialState = null;
        const params = this.helpers.parseParams(document.location.search);
        switch (to) {
            case 'setting/stores':
                component = DetailStoreComponent;
                initialState = { storeId: id, queryParams: params };
                break;
            case 'setting/price-books':
                initialState = { priceId: id, queryParams: params };
                component = DetailPriceBookComponent;
                break;
            case 'setting/product-types':
                initialState = { typeId: id, queryParams: params };
                component = DetailProductTypeComponent;
                break;
            case 'setting/materials':
                initialState = { materialId: id, queryParams: params };
                component = DetailMaterialComponent;
                break;
            case 'process':
                initialState = { orderId: 'A1000000', processId: id, queryParams: params };
                component = ProcessDetailItemComponent;
                break;
            default:
                break;
        }
        this.modalService.open(
            component,
            { class: 'modal-xl', initialState }
        );
    }
}
