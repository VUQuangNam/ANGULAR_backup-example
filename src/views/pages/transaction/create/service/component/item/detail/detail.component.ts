import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import swal from 'sweetalert2';
import { ProductService, DesignService, CategoryService } from 'src/common/services';

@Component({
    selector: 'dunnio-item-detail-warranties-partial',
    templateUrl: 'detail.component.html',
    providers: [
        ProductService,
        DesignService,
        CategoryService
    ]
})


export class ItemDetailWarrantiesPartialComponent implements OnInit, OnChanges {
    @Input() data;
    @Input() itemId: string;
    @Output() callback = new EventEmitter<object>();

    serviceDesign: any = [];
    categories: any = [];
    products: any = [];
    loading = false;
    keypress: any;
    model: any = {
        id: '',
        idproduct: null,
        name: '',
        note: {
            customer: '',
            system: '',
        },
        type: '',
        properties: {
            unit: 'cái',
            gender: 'male',
            brand: 'dunnio'
        },
        category_id: 'G',
        category_two_id: '',
        category_three_id: '',

        /** price */
        currency: 'VND',
        origin_price: 0,
        service_price: {},
        price: 0,

        /** item design */
        fabric: null,
        design_styles: {},
        design_extras: {},
        design_advances: {},
        materials: [],
        serviceNote: []
    };

    constructor(
        private productService: ProductService,
        private designService: DesignService,
        private categoryService: CategoryService
    ) { }
    async ngOnChanges() {
        if (this.itemId) {
            const data = await this.data.products.find(x => x.id === this.itemId);
            this.model = data;
        }
    }

    async ngOnInit() {
        const categories = await this.categoryService.list({ skip: 0, limit: 100 } as any);
        this.categories = categories.data || [];
        this.serviceDesign = await this.designService.listStyles();
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
            this.model.id = null;
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
                    return this.products.map(x => x.fullText = x.id + ' ' + x.name);
                } catch (ex) {
                    return this.products = this.products || [];
                } finally {
                    this.loading = false;
                }
            }, 500);
    }

    handleEventTotalPrice = () => {
        try {
            this.model.price = 0;
            const values = this.model.serviceDesignSub.filter(x => x.checked);
            if (values.length) {
                values.forEach(value => {
                    this.model.price += value.price;
                });
            }
        } catch (error) {
            console.log(error);
        } finally {
            this.model.total_service_price = this.model.price || 0;
        }
    }

    onUpdateItemWarranties = async () => {
        try {
            this.model.service_price = {};
            this.model.serviceNote = [];
            this.model.serviceDesignSub.map(x => {
                if (x.checked) {
                    this.model.service_price[x.id] = x.price;
                    this.model.serviceNote.push({
                        id: x.id,
                        note: x.note
                    });
                }
            });

            this.model.serviceDesignSub.map(x => {
                if (x.checked) this.model.service_price[x.id] = x.price;
                if (x.checked) {
                    this.model.serviceNote.push({
                        id: x.id,
                        note: x.note
                    });
                }
            });
            this.model.total_price = this.model.price;
            this.model.total_price_discount = this.model.price;
            const respone = await this.productService.update(this.itemId, this.model);
            if (respone.code) {
                return swal.fire('Hệ thống', respone.message, 'warning');
            }
            this.callback.emit({
                item: this.model,
                id: this.itemId
            });

            return ($('#dunnio_detail_item_warranties') as any).modal('hide');
        } catch (error) {
            console.log(error);
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
}
