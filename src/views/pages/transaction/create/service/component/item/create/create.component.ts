import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import swal from 'sweetalert2';

import { DesignService, ProductService, CategoryService } from 'src/common/services';

@Component({
    selector: 'dunnio-item-warranties-partial',
    templateUrl: 'create.component.html',
    providers: [
        DesignService,
        ProductService,
        CategoryService
    ]
})


export class ItemWarrantiesPartialComponent implements OnInit {
    @Input() data;
    @Output() callback = new EventEmitter<object>();

    serviceDesign: any = [];
    categories: any = [];
    products: any = [];
    loading = false;
    keypress: any;
    model: any = {};

    constructor(
        private productService: ProductService,
        private designService: DesignService,
        private categoryService: CategoryService
    ) {
        this.onLoadModel();
    }

    async ngOnInit() {
        const categories = await this.categoryService.list({ skip: 0, limit: 100 } as any);
        this.categories = categories.data || [];
        this.serviceDesign = await this.designService.listStyles();
        await this.onChangeCategory();
    }

    onLoadModel = () => {
        this.model = {
            id: '',
            idproduct: null,
            name: '',
            note: {
                customer: '',
                system: '',
            },
            type: 'service',
            group: 'product',
            properties: {
                unit: 'cái',
                gender: 'male',
                brand: 'dunnio'
            },
            category_id: 'V',
            category_two_id: '',
            category_three_id: '',

            /** price */
            currency: 'VND',
            origin_price: 0,
            service_price: {},
            total_service_price: 0,
            price: 0,

            /** item design */
            fabric: null,
            design_styles: {},
            design_extras: {},
            design_advances: {},
            materials: [],
            serviceNote: []
        };
    }

    onChangeCategory = async () => {
        try {
            const respone = await this.designService.listAdvances({
                types: 'warranty',
                categories: this.model.category_id
            });
            this.serviceDesign = respone.advances ? respone.advances : [];
            this.model.serviceDesignSub = this.serviceDesign[0].values;
        } catch (ex) {
            console.log(ex);
        } finally {
            this.model.serviceDesignSub = this.model.serviceDesignSub.map(x => {
                return {
                    id: x.id,
                    name: x.name,
                    price: x.price,
                    checked: false,
                    note: null,
                };
            });
            this.products = [];
            this.model.idproduct = null;
            this.handleEventTotalPrice();
        }
    }

    handleChangeDesign = async (event) => {
        const value = this.model.serviceDesignSub.find(x => x.id === event);
        value.checked = !value.checked;
        await this.handleEventTotalPrice();
    }

    onSearchProducts = (keyword: string) => {
        this.loading = true;
        clearTimeout(this.keypress);
        this.keypress = setTimeout(
            async () => {
                try {
                    if (!keyword) return;
                    const respone = await this.productService.list(
                        {
                            skip: 0,
                            limit: 20,
                            keyword: keyword,
                            types: 'tailor',
                            categories: this.model.category_id
                        }
                    );
                    this.products = respone.code ? [] : respone.data;
                    return this.products;
                } catch (ex) {
                    return this.products = this.products || [];
                } finally {
                    this.loading = false;
                }
            }, 500);
    }

    handleEventTotalPrice = () => {
        this.model.price = 0;
        const values = this.model.serviceDesignSub.filter(x => x.checked);
        if (values.length) {
            values.forEach(value => {
                this.model.price += value.price;
            });
        }
    }

    onCreateItemWarranties = async () => {
        try {
            const res = await this.productService.detail(this.model.idproduct);
            if (this.model.idproduct && (res.data.warranty_expired_at * 1000) > Date.now()) {
                this.model.id = 'BH' + this.model.category_id + (this.data.products.length + 1);
                this.model.name = 'Bảo hành ' + this.model.category_id;
                this.model.type = 'warranty';
            } else {
                this.model.id = 'SC' + this.model.category_id + (this.data.products.length + 1);
                this.model.name = 'Sửa chữa ' + this.model.category_id;
                this.model.type = 'repair';
            }
            this.model.total_service_price = this.model.price || 0;
            this.model.service_price = {};
            this.model.design_advances = {};

            this.model.serviceDesignSub.map(x => {
                if (x.checked) this.model.service_price[x.id] = x.price;
                if (x.checked) {
                    this.model.serviceNote.push({
                        id: x.id,
                        note: x.note,
                        price: x.price
                    });
                    this.model.design_advances[x.id] = {
                        id: x.id,
                        value: x.note,
                        price: x.price
                    };
                }
            });
            const respone = await this.productService.create(this.model);
            if (respone.code) {
                return swal.fire('Hệ thống', respone.message, 'warning');
            }
            this.model.id = respone.data.id;
            this.model.service_price = respone.data.service_price;
            this.callback.emit({
                item: this.model,
                name: this.data.name
            });
            return ($('#dunnio_create_item_warranties') as any).modal('hide'),
                this.onLoadModel(),
                this.onChangeCategory();
        } catch (ex) {
            console.log(ex);
        }
    }

    onChangeTextWarranty = (value, id) => {
        try {
            const data = this.model.serviceDesignSub.find(x => x.id === id);
            data.note = value;
        } catch (ex) {
            console.log(ex);
        }
    }

    onResetForm = () => {
        $('form-create-item-warranty-repair').trigger('reset');
        this.model.properties.gender = 'male';
        this.onChangeCategory();
    }
}
