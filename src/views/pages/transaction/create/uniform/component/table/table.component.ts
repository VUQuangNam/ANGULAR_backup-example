import {
    Component,
    ViewEncapsulation,
    OnInit,
    Input,
    OnChanges,
    Output,
    EventEmitter
} from '@angular/core';
import * as XLSX from 'xlsx';
import { includes } from 'loadsh';
import swal from 'sweetalert2';

import { CustomerService, MetricService, CategoryService } from 'src/common/services';
import { Helpers } from 'src/common/utils';
import { Storage, CustomerTypes, CustomerGenders } from 'src/common/models';

@Component({
    selector: 'dunnio-table-data-order-uniform',
    templateUrl: './table.component.html',
    styleUrls: ['./style.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        CustomerService,
        MetricService,
        CategoryService
    ]
})

export class OrderTableDataUniformComponent implements OnInit, OnChanges {
    constructor(
        private customerService: CustomerService,
        private metricService: MetricService,
        private helper: Helpers,
        private categoryService: CategoryService
    ) {
        this.storeLocal = JSON.parse(
            localStorage.getItem(
                Storage.STORES
            )
        );

    }

    @Input() data;
    @Input() metrics;
    @Output() callback = new EventEmitter<object>();

    promotions: any = [];
    keypress: any;
    storeLocal: any = [];
    hide = false;
    categories: any = [];
    metricsSub: any;

    async ngOnInit() {
        const categories = await this.categoryService.list({ skip: 0, limit: 100 } as any);
        this.categories = categories.data || [];
        this.metricsSub = {
            male: [],
            female: []
        };
        this.metricsSub.male = await this.metrics.filter(v =>
            includes(v.genders, 'Nam')
        );

        this.metricsSub.female = await this.metrics.filter(v =>
            includes(v.genders, 'Nu')
        );
    }

    ngOnChanges() { }

    onChangeQuantity = (itemId: string, quantity: string) => {
        const itemQuantity = parseInt(quantity, 10);
        const item = this.data.dataImport.find(x => x.SDT === itemId);
        if (!itemQuantity || itemQuantity <= 0) {
            $(event.target).val(item.total_quantity);
        }
        item.total_quantity = !itemQuantity || itemQuantity <= 0 ? 1 : itemQuantity;
        this.callback.emit({
            data: null,
            type: 'handleEventReloadCartPayment'
        });
    }

    onRemoveItem = (itemId) => {
        try {
            swal.fire({
                title: 'Thông báo',
                text: 'Bạn chắc chắn rằng mình muốn xóa sản phẩm này không?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Tôi đồng ý!',
                cancelButtonText: 'Từ bỏ!'
            }).then(async (result) => {
                if (result.value) {
                    this.data.itemsLocal = this.data.itemsLocal.filter(x => x.id !== itemId);
                    return this.callback.emit({
                        data: null,
                        type: 'handleEventReloadCartPayment'
                    });
                }
            });
        } catch (ex) {
            console.log(ex);
        }
    }

    onUpdateItem = (itemId) => {
        this.callback.emit({
            data: {
                itemId: itemId,
                type: this.data.type
            },
            type: 'onUpdateItem'
        });
    }

    onFileChange(ev) {
        try {
            this.helper.openLoading();
            let workBook = null;
            let jsonData = null;
            const reader = new FileReader();
            const file = ev.target.files[0];
            const checkFile = ev.target.value.search('.xlsx');
            if (checkFile === -1) return swal.fire('Cảnh Báo', 'Vui lòng chọn đúng file có dạng .XLSX', 'warning');
            reader.onload = (event) => {
                const data = reader.result;
                workBook = XLSX.read(data, { type: 'binary' });
                jsonData = workBook.SheetNames.reduce((initial, name) => {
                    const sheet = workBook.Sheets[name];
                    initial[name] = XLSX.utils.sheet_to_json(sheet);
                    return initial;
                }, {});
                if (jsonData.Sheet1) {
                    let _break = false;
                    jsonData.Sheet1.filter(col => {
                        if (
                            !col.GT
                            || !col.HO_TEN
                            || !col.SDT
                        ) _break = true;
                    });
                    if (_break) {
                        return swal.fire(
                            'Cảnh Báo',
                            'Vui lòng nhập đầy đủ các trường bắt buộc trong file excel',
                            'warning'
                        );
                    }
                    this.data.dataImport = jsonData.Sheet1 || [];
                    this.data.dataImport.forEach(async (x) => {
                        x.metrics = {};
                        x.total_quantity = 1;
                        let checkCustomer = await this.customerService.detail(x.SDT);
                        if (checkCustomer.code) {
                            checkCustomer = await this.customerService.create({
                                name: x.HO_TEN,
                                phone: x.SDT,
                                stores: [this.storeLocal[0]],
                                type: CustomerTypes.INDIVIDUAL,
                                gender: x.GT === 'Nam' ? CustomerGenders.MALE : CustomerGenders.FEMALE,
                            });
                            x.id = checkCustomer.data.id;
                            const keys = Object.keys(x);
                            keys.forEach(key => {
                                const a = this.metrics.find(sub => sub.key === key);
                                if (a) {
                                    this.metricService.create({
                                        customer_id: x.id,
                                        key: a.id,
                                        value: x[key].toString()
                                    });
                                    x.metrics[a.id] = x[key].toString();
                                }
                            });
                        } else {
                            x.id = checkCustomer.data.id;
                            const keys = Object.keys(x);
                            keys.forEach(key => {
                                const a = this.metrics.find(sub => sub.key === key);
                                if (a) {
                                    this.metricService.create({
                                        customer_id: x.id,
                                        key: a.id,
                                        value: x[key].toString()
                                    });
                                    x.metrics[a.id] = x[key].toString();
                                }
                            });
                        }
                    });
                    if (this.data.dataImport.length) {
                        this.callback.emit({
                            data: null,
                            type: 'handleEventReloadCartPayment'
                        });
                    }
                    return this.data.dataImport;
                }
            };
            reader.readAsBinaryString(file);
        } catch (ex) {
            console.log(ex);
        } finally {
            this.helper.closeLoading();
        }
    }

    onRemoveCustomer = (id) => {
        try {
            swal.fire({
                title: 'Thông báo',
                text: 'Bạn chắc chắn rằng mình muốn nhân viên này không?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Tôi đồng ý!',
                cancelButtonText: 'Từ bỏ!'
            }).then(async (result) => {
                if (result.value) {
                    this.data.dataImport = this.data.dataImport.filter(x => x.id !== id);
                    return this.callback.emit({
                        data: null,
                        type: 'handleEventReloadCartPayment'
                    });
                }
            });
        } catch (ex) {
            console.log(ex);
        }
    }

    onChangeGenderCustomer = async (item) => {
        try {
            const customer = this.data.dataImport.find(x => x.SDT === item.SDT);
            customer.GT = customer.GT === 'Nam' ? 'Nu' : 'Nam';
            return this.callback.emit({
                data: null,
                type: 'handleEventReloadCartPayment'
            });
        } catch (ex) {
            console.log(ex);
        }
    }

    transformCategories = (value) => {
        return this.categories.find(x => x.id === value).name;
    }
}
