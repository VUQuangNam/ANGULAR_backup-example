import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { includes } from 'loadsh';
import swal from 'sweetalert2';

import { ProductService, CategoryService, InventoryService } from 'src/common/services';
import { DesignConfig } from 'src/config';

@Component({
    selector: 'dunnio-create-item-uniform',
    templateUrl: 'create.component.html',
    providers: [
        CategoryService,
        InventoryService
    ]
})


export class ItemUniformComponent implements OnInit, OnChanges {
    @Input() data;
    @Input() dataConfig;
    @Input() metrics;
    @Output() callback = new EventEmitter<object>();
    @Output() callbackLoadDesign = new EventEmitter<object>();

    serviceDesign: any = [];
    categories: any = [];
    products: any = [];
    height: number;
    loading = false;
    keypress: any;
    model: any = {};
    bodyNote: any;
    bodyNotesub: any;
    metricsSub: any;
    /** design attribute */
    designExtras: any[];
    designConfigs: any[];
    designAdvances: any[];
    fabrics: any = [];

    constructor(
        private categoryService: CategoryService,
        private designConfig: DesignConfig,
        private inventoryService: InventoryService
    ) {
        this.onLoadModel();
    }

    async ngOnChanges() {
        this.onLoadDesign();
    }

    onLoadModel = () => {
        this.model = {
            id: '',
            name: '',
            note: {
                customer: '',
                system: '',
                body_note: ''
            },
            type: 'tailor',
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
            price: 0,

            /** item design */
            fabric: {
                id: null,
                name: null,
                price: 0
            },
            design_styles: {},
            design_extras: {},
            design_advances: {},
            materials: [],
            body_notes: {},
            metrics: {},
            parts: []
        };
    }

    async ngOnInit() {
        const categories = await this.categoryService.list({ skip: 0, limit: 100 } as any);
        this.categories = categories.data || [];
        this.bodyNote = await this.designConfig.bodyNotes;
        this.bodyNote.forEach(bodynote => {
            bodynote.name = bodynote.name.vi;
            bodynote.values.forEach(value => {
                value.name = value.name.vi;
                const check = includes(this.model.body_notes[bodynote.key], value.id);
                value.checked = check ? true : false;
            });
        });

        this.bodyNotesub = this.bodyNote.filter(x =>
            includes(x.categories, this.model.category_id)
        );
        this.metrics = this.metrics.map(x => {
            if (x.input.total === 1) {
                return {
                    key: x.id,
                    short_key: x.key,
                    name: x.name.vi,
                    total_input: x.input.total,
                    categories: x.categories,
                    genders: x.genders,
                    value: ''
                };
            }
            if (x.input.total === 2) {
                return {
                    key: x.id,
                    key1: '',
                    key2: '',
                    short_key: x.key,
                    name: x.name.vi,
                    total_input: x.input.total,
                    categories: x.categories,
                    genders: x.genders,
                    value: ''
                };
            }
        });

        this.metricsSub = this.metrics.filter(x =>
            includes(x.genders, this.model.properties.gender)
        );
    }

    onSearchFabric = (keyword: string) => {
        this.loading = true;
        clearTimeout(this.keypress);
        this.keypress = setTimeout(
            async () => {
                try {
                    if (!keyword) return;
                    const respone = await this.inventoryService.list(
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
                    return [];
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

    onChangeCategory = (categoryId: string) => {
        const { id } = this.categories.find(x => x.id === categoryId);
        this.model.category_id = id;
        this.onLoadDesign();
        return this.model.categories;
    }

    onLoadDesign = () => {
        const designData = this.handleEventLoadDesigns();
        this.designAdvances = designData.advances;
        this.designConfigs = designData.designs;
        this.designExtras = designData.extras;
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

    onCreateItemUniform = async () => {
        try {
            if (!this.model.fabric || !this.model.fabric.id) {
                return swal.fire(
                    'Hệ Thống',
                    'Để hoàn thành vui lòng chọn vải cho khách hàng.!',
                    'warning'
                );
            }
            this.model.name = 'Đồng phục ' + this.model.category_id;
            this.model.id = 'M' + this.model.category_id + (this.data.itemsLocal.length + 1);
            /** set default value */
            this.model.currency = 'VND';
            this.model.price = this.model.origin_price + this.model.fabric.price;
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
            this.bodyNotesub.forEach(bodynote => {
                this.model.body_notes[bodynote.key] = [];
                bodynote.values.forEach(value => {
                    if (value.checked) this.model.body_notes[bodynote.key].push(value.id);
                });
            });

            this.metricsSub.map(x => {
                if (x.value) {
                    this.model.metrics[x.key] = x.value;
                }
            });

            this.model.total_discount = this.model.total_discount || 0;
            this.model.total_service_price = this.model.total_service_price || 0;
            $('input[name=initials__text]').val('');
            this.callback.emit({
                item: this.model,
                name: this.data.name
            });
            return ($('#dunnio-create-item-uniform') as any).modal('hide');
        } catch (ex) {
            console.log(ex);
        } finally {
            this.onResetForm();
        }
    }

    onResetForm = async () => {
        this.onLoadModel();
        this.callbackLoadDesign.emit();
        this.designAdvances[0].values.forEach(x => {
            x.checked = false;
        });
        this.designConfigs.forEach(x => {
            x.values.forEach((v, ix) => {
                v.selected = ix === 0 ? true : false;
            });
        });
        this.designExtras.forEach(x => {
            x.values.forEach((v, ix) => {
                v.selected = ix === 0 ? true : false;
            });
        });
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

    onChangeGender = (genderId: string) => {
        this.model.properties.gender = genderId;
        this.onLoadDesign();
        return this.model.properties.gender;
    }

    onChangeDesign = (designId: string, valueId: string) => {
        this.designConfigs.map(x =>
            x.id === designId &&
            x.values.map(v => v.selected = v.id === valueId ? true : false)
        );

        this.onLoadDesign();
        return this.designConfigs;
    }
}
