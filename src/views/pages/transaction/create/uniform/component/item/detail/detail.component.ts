import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { includes } from 'loadsh';
import swal from 'sweetalert2';

import { ProductService, CategoryService, DesignService } from 'src/common/services';

@Component({
    selector: 'dunnio-item-detail-uniform',
    templateUrl: 'detail.component.html',
    styleUrls: ['./style.component.scss'],
    providers: [
        ProductService,
        CategoryService,
        DesignService
    ]
})


export class ItemDetailUniformComponent implements OnInit, OnChanges {
    @Input() data;
    @Input() itemId: string;
    @Input() dataConfig;
    @Output() callback = new EventEmitter<object>();

    serviceDesign: any = [];
    categories: any = [];
    products: any = [];
    height: number;
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
        fabric: {
            id: null
        },
        design_styles: {},
        design_extras: {},
        design_advances: {},
        materials: [],
        serviceNote: []
    };

    /** design attribute */
    designExtras: any[];
    designConfigs: any[];
    designAdvances: any[];
    fabrics: any[];

    constructor(
        private productService: ProductService,
        private categoryService: CategoryService,
        private designService: DesignService
    ) { }

    async ngOnChanges() {
        if (!this.itemId) return false;
        this.model = this.data.itemsLocal.find(x => x.id === this.itemId);
        if (this.model) {
            this.onLoadDesign();
            this.designConfigs.forEach(x => {
                const check = includes(Object.keys(this.model.design_styles), x.id);
                if (check) {
                    x.values.forEach(value => {
                        if (value.id === this.model.design_styles[x.id][0].value) {
                            value.selected = true;
                        } else {
                            value.selected = false;
                        }
                    });
                }
            });
            if (!this.model.design_extras) {
                if (this.model.design_extras.initials__text.length === 3) {
                    this.model.design_extras.initials__text = this.designExtras.find(x => x.id === 'initials__text').values;
                }
            } else {
                if (this.designExtras.length) {
                    const data = this.designExtras.find(x => x.id === 'initials__text');
                    const value = data.values[0].values.find(x => x.selected);
                    value.text = this.model.design_extras.initials__text[2].value;
                    data.initials__text = value.text;
                }
            }

            this.designExtras = this.designExtras.map((x) => {
                /** check lv1 */
                const designExtrasKey = Object.keys(this.model.design_extras);
                const checkLV1 = designExtrasKey.find(keylv1 => keylv1 === x.id);
                const valueTmps = {
                    /** level 1 */
                    id: x.id,
                    name: x.name,
                    icon: x.icon,
                    genders: x.genders,
                    categories: x.categories,
                    initials__text: x.initials__text,
                    selected: false,
                    values: x.values.map((v) => {
                        /** check lv2 */
                        const checkLV2 = this.model.design_extras[checkLV1].find(keylv2 => keylv2.id === v.id);
                        if (checkLV2) x.values[0].selected = false;
                        return {
                            /** level 2 */
                            id: v.id,
                            name: v.name,
                            icon: v.icon,
                            price: v.price,
                            selected: checkLV2 ? true : false,
                            values: v.values.map((sv) => {
                                let checkLV3 = false;
                                const value = this.model.design_extras[checkLV1].find(f => f.id === v.id);
                                if (value) {
                                    if (value.value === sv.id) {
                                        checkLV3 = true;
                                    }
                                }
                                /** check lv3 */
                                return {
                                    /** level 3 */
                                    id: sv.id,
                                    name: sv.name,
                                    price: sv.price,
                                    image: sv.image,
                                    selected: checkLV3
                                };
                            })
                        };
                    })
                };
                if (!valueTmps.values.find(c => c.selected)) valueTmps.values[0].selected = true;
                return valueTmps;
            });

            this.designAdvances[0].values.forEach(advance => {
                const check = includes(Object.keys(this.model.design_advances), advance.id);
                advance.checked = check ? true : false;
            });
        }
    }

    async ngOnInit() {
        /** load default config */
        const categories = await this.categoryService.list({ skip: 0, limit: 100 } as any);
        this.categories = categories.data || [];
        const serviceDesign = await this.designService.listStyles();
        this.serviceDesign = serviceDesign.data || [];
        if (innerHeight <= 768) {
            this.height = innerHeight * 0.59;
        } else if (innerHeight > 1070) {
            this.height = innerHeight * 0.75;
        } else {
            this.height = innerHeight * 0.67;
        }
    }

    onSearchFabric = (keyword: string) => {
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
                            stores: this.data.store.id,
                            groups: 'material',
                            types: '38'
                        }
                    );
                    const data = respone.code ? [] : respone.data;
                    this.fabrics = data.map(x => {
                        let price = 0;
                        if (x.price_books.length) {
                            price = x.price_books[0].categories.find(c => c.id === this.model.category_id).price;
                        }
                        return {
                            id: x.id,
                            name: x.name,
                            type: x.type,
                            properties: x.properties,
                            category_id: x.category_id,
                            price_books: x.price_books,
                            price: x.price_books.length ? price : 'Chưa cập nhật',
                            fullText: x.id + ' ' + x.name,
                            total_quantity: x.inventories.length
                                ? x.inventories[0].total_quantity
                                : 0
                        };
                    });
                } catch (ex) {
                    return this.fabrics = this.fabrics || [];
                } finally {
                    this.loading = false;
                }
            }, 500);
    }

    onSelectFabric = (item) => {
        try {
            if (item.price_books.length === 0) {
                return swal.fire(
                    'Hệ Thống',
                    'Vải không được hỗ trợ cho sản phẩm này.!',
                    'warning'
                ),
                    this.model.fabric = {
                        id: null,
                        name: null,
                        price: 0
                    };
            } else {
                this.model.fabric = {
                    id: item.id,
                    name: item.name,
                    price: item.price
                };
                this.model.parts.push({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    total_quantity: 0
                });
            }
        } catch (ex) {
            console.log(ex);
        }
    }

    handleEventLoadDesigns = () => {
        const categoryId = this.model.category_id;
        const gender = this.model.properties.gender;
        const dataHides = [];

        /** load hides data */
        this.dataConfig.designs.filter(x =>
            includes(x.categories, categoryId) &&
            includes(x.genders, gender)
        ).map(x => {
            x.values.map(v => {
                if (v.selected) {
                    v.hides.map(value => dataHides.push(value));
                }
            });
        });

        const designConfigs = this.dataConfig.designs.filter(x =>
            includes(x.categories, categoryId) &&
            includes(x.genders, gender) &&
            !includes(dataHides, x.id)
        ).map(data => {
            return {
                id: data.id,
                name: data.name,
                icon: data.icon,
                genders: data.genders,
                categories: data.categories,
                selected: data.selected,
                values: data.values.filter(v => !includes(dataHides, v.id))
            };
        });

        const designExtras = this.dataConfig.extras.filter(x =>
            includes(x.categories, categoryId) &&
            includes(x.genders, gender) &&
            !includes(dataHides, x.id)
        ).map(data => {
            if (!data.values.find(x => x.selected)) {
                data.values[0].selected = true;
            }
            return {
                id: data.id,
                name: data.name,
                icon: data.icon,
                genders: data.genders,
                categories: data.categories,
                selected: data.selected,
                values: data.values.filter(v => !includes(dataHides, v.id))
            };
        });

        const advances = this.dataConfig.advances.filter(x =>
            includes(x.categories, categoryId)
        );

        return {
            designs: designConfigs.sort(() => -1),
            extras: designExtras.sort(() => -1),
            advances: advances.sort(() => -1)
        };
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

    onChangeDesign = (designId: string, valueId: string) => {
        this.designConfigs.map(x =>
            x.id === designId &&
            x.values.map(v => v.selected = v.id === valueId ? true : false)
        );
        this.onLoadDesign();
        return this.designConfigs;
    }

    onSelectAdvance = (advanceId: string, optionId: string) => {
        this.designAdvances.map(x =>
            x.id === advanceId &&
            x.values.map(
                v => v.checked = v.id === optionId
                    ? !v.checked
                    : v.checked
            )
        );
    }

    onLoadDesign = () => {
        const designData = this.handleEventLoadDesigns();
        this.designAdvances = designData.advances;
        this.designConfigs = designData.designs;
        this.designExtras = designData.extras;
    }


    onUpdateItemWarranties = async () => {
        try {
            if (!this.model.fabric) {
                return swal.fire(
                    'Hệ Thống',
                    'Để hoàn thành vui lòng chọn vải cho khách hàng.!',
                    'warning'
                );
            }
            /** set default value */
            this.model.price = 0;
            this.model.total_service_price = 0;

            /** begin:: load design & advance */
            this.model.design_styles = {};
            this.designConfigs.map(design => {
                this.model.design_styles[design.id] = [];
                /** level 1 */
                const value = design.values.find(
                    x => x.selected === true
                );
                this.model.design_styles[design.id].push({
                    id: design.id,
                    value: value ? value.id : null
                });
            });

            this.model.design_extras = {};
            this.designExtras.map(design => {
                this.model.design_extras[design.id] = [];
                /** level 1 */
                const value = design.values.find(x =>
                    x.selected === true
                );
                this.model.design_extras[design.id].push({
                    id: design.id,
                    value: value ? value.id : null
                });

                /** level 2 */
                if (value.values.length) {
                    const subValue = value.values.find(x =>
                        x.selected === true
                    );
                    if (subValue) {
                        /** tinh toan gia san pham */
                        this.model.price += subValue.price || 0;

                        this.model.design_extras[design.id].push({
                            id: value.id,
                            value: subValue ? subValue.id : null,
                            price: subValue ? subValue.price : 0
                        });

                        /** level 3 */
                        if (design.id === 'initials__text') {
                            this.model.design_extras[design.id].push({
                                id: subValue.id,
                                value: subValue.text,
                            });
                            if (!subValue.text) {
                                delete this.model.design_extras[design.id];
                            }
                        }
                    }
                }
            });

            this.model.service_price = {};
            this.model.design_advances = {};
            const advances = this.designAdvances[0];
            advances.values.map(advance => {
                if (advance.checked) {
                    this.model.design_advances[advance.id] = [];
                    this.model.design_advances[advance.id].push({
                        id: advance.id,
                        value: advance.id || null,
                        price: advance.price
                    });

                    /** tinh toan gia san pham */
                    this.model.price += advance.price || 0;
                    this.model.total_service_price += advance.price;
                    this.model.service_price[advance.id] = advance.price;
                }
            });
            Object.values(this.model.design_extras).forEach((x: any) => {
                if (x.length > 1) {
                    if (x[1].price) {
                        this.model.service_price[x[0].id] = x[1].price;
                        this.model.total_service_price += x[1].price;
                    }
                }
            });
            this.model.total_price = this.model.price + this.model.fabric.price;
            this.model.total_price_discount = this.model.total_price - this.model.total_discount;
            this.callback.emit({
                item: this.model,
                id: this.itemId
            });

            return ($('#dunnio_detail_item_uniform') as any).modal('hide');
        } catch (error) {
            console.log(error);
        }
    }

    onChangeExtra = (extraId: string, valueId: string, subValueId?: string) => {
        this.designExtras.map(x =>
            x.id === extraId &&
            x.values.map(v => {
                v.selected = v.id === valueId ? true : false;
                if (v.values.length) {
                    if (!subValueId) v.values[0].selected = true;
                    else v.values.map(sub => sub.selected = sub.id === subValueId ? true : false);
                }
            })
        );

        /** remove initial text if exist */
        // $('input[name=initials__text]').val('');

        return this.designExtras;
    }

    onChangeInitialText = ($event: any) => {
        clearTimeout(this.keypress);
        this.keypress = setTimeout(() => {
            const extraId = $event.target.name;
            this.designExtras.filter(x =>
                x.id === extraId &&
                x.values.filter(v =>
                    v.selected === true &&
                    v.values.filter(sub =>
                        sub.text = sub.selected ? $event.target.value : null
                    )
                )
            );
        }, 500);
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
