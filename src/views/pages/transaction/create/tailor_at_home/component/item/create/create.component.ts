import {
    Component,
    ViewEncapsulation,
    OnInit,
    Input,
    Output,
    EventEmitter,
    OnChanges
} from '@angular/core';
import { includes } from 'loadsh';
import swal from 'sweetalert2';

import { ProductService, CategoryService, InventoryService } from 'src/common/services';
import { DesignConfig } from 'src/config';

@Component({
    selector: 'dunnio-item-tailor-at-home',
    templateUrl: './create.component.html',
    styleUrls: ['./style.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        ProductService,
        CategoryService,
        InventoryService
    ]
})

export class ItemTailorAtHomeComponent implements OnInit, OnChanges {
    constructor(
        private productService: ProductService,
        private categoryService: CategoryService,
        private designConfig: DesignConfig,
        private inventoryService: InventoryService
    ) {
        this.onLoadModel();
    }

    /** public variable */
    @Input() data;
    @Input() metricsHistory;
    @Input() bodyNoteHistory;
    @Input() dataConfig;
    @Output() callback = new EventEmitter<object>();
    @Output() callbackLoadDesign = new EventEmitter<object>();

    /** private variable */
    keypress: any;
    loading = false;
    model: any = {};

    bodyNote: any;
    bodyNotesub: any;
    metrics: any;
    metricsSub: any;

    /** detail attribute */
    categories: any[];
    fabrics: any[];
    genders: [];
    units: [];

    /** design attribute */
    designExtras: any[];
    designConfigs: any[];
    designAdvances: any[];

    async ngOnChanges() {
        this.onLoadDesign();
        if (this.metricsHistory) {
            this.metrics = this.designConfig.metrics;
            this.metrics = this.metrics.map(x => {
                if (x.input.total === 1) {
                    return {
                        key: x.id,
                        short_key: x.key,
                        name: x.name.vi,
                        total_input: x.input.total,
                        categories: x.categories,
                        genders: x.genders,
                        value: !this.metricsHistory[x.id] ? 0 : this.metricsHistory[x.id][0].value
                    };
                } else {
                    return {
                        key: x.id,
                        key1: !this.metricsHistory[x.id] ? 0 : this.metricsHistory[x.id][0].value.split('/')[0],
                        key2: !this.metricsHistory[x.id] || !this.metricsHistory[x.id][0].value.split('/')[1]
                            ? 0 : this.metricsHistory[x.id][0].value.split('/')[1],
                        short_key: x.key,
                        name: x.name.vi,
                        total_input: x.input.total,
                        categories: x.categories,
                        genders: x.genders,
                        value: !this.metricsHistory[x.id] ? 0 : this.metricsHistory[x.id][0].value
                    };
                }
            });
            this.metricsSub = this.metrics.filter(x =>
                includes(x.categories, this.model.category_id) &&
                includes(x.genders, this.model.properties.gender)
            );
        }

        if (this.bodyNoteHistory) {
            this.bodyNote = this.designConfig.bodyNotes;
            this.bodyNote = this.bodyNote.map(x => {
                return {
                    categories: x.categories,
                    key: x.key,
                    name: x.name.vi,
                    values: !this.bodyNoteHistory[x.key] ? x.values.map(v => {
                        return {
                            id: v.id,
                            name: v.name.vi,
                            checked: false,
                        };
                    }) : x.values.map(v => {
                        const checked = this.bodyNoteHistory[x.key].find(c => c.value === v.id);
                        return {
                            id: v.id,
                            name: v.name.vi,
                            checked: checked ? true : false,
                        };
                    })
                };
            });
            this.bodyNotesub = this.bodyNote.filter(x =>
                includes(x.categories, this.model.category_id)
            );
        }
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
        this.metrics = await this.designConfig.metrics;
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
            includes(x.categories, this.model.category_id) &&
            includes(x.genders, this.model.properties.gender)
        );
    }


    onLoadDesign = () => {
        const designData = this.handleEventLoadDesigns();
        this.designAdvances = designData.advances;
        this.designConfigs = designData.designs;
        this.designExtras = designData.extras;
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
            design_styles: {},
            design_extras: {},
            design_advances: {},
            materials: [],
            body_notes: {},
            metrics: {},
            parts: [],
            metricsHistory: [],
            bodyNotesHistory: []
        };
    }

    onChangeCategory = (categoryId: string) => {
        const { id } = this.categories.find(x => x.id === categoryId);
        this.model.category_id = id;
        this.model.fabric = null;
        this.fabrics = [];
        this.onLoadDesign();
        this.metricsSub = this.metrics.filter(x =>
            includes(x.categories, this.model.category_id) &&
            includes(x.genders, this.model.properties.gender)
        );
        this.bodyNotesub = this.bodyNote.filter(x =>
            includes(x.categories, this.model.category_id)
        );
        return this.model.category_id;
    }

    onChangeGender = (genderId: string) => {
        this.model.properties.gender = genderId;
        /** load design for new category */
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

    onCreateItem = async () => {
        try {
            if (!this.model.fabric || !this.model.fabric.id) {
                return swal.fire(
                    'Hệ Thống',
                    'Để hoàn thành vui lòng chọn vải cho khách hàng.!',
                    'warning'
                );
            }
            this.model.name = 'May đo tại nhà ' + this.model.category_id;
            this.model.id = 'M' + this.model.category_id + (this.data.products.length + 1);
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
            this.designExtras.forEach(design => {
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
            advances.values.forEach(advance => {
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

            /** create item */
            const respone = await this.productService.create(this.model);
            if (respone.code) {
                return swal.fire('Hệ thống', respone.message, 'warning');
            }
            this.model.id = respone.data.id;
            this.callback.emit({
                item: this.model,
                name: this.data.name
            });
            this.onLoadDesign();
            this.onLoadModel();
            $('input[name=initials__text]').val('');
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
            return ($('#dunnio_create_item_tailor_at_home') as any).modal('hide');
        } catch (ex) {
            console.log(ex);
        }
    }


    /**
     * Xử  lý sự kiện nguyên phụ liệu
     */
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

    handleEventLoadDesigns = () => {
        const categoryId = this.model.category_id;
        const gender = this.model.properties.gender;
        const dataHides = [];
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

    onSelectBodyNote = (note, item) => {
        try {
            const data = this.bodyNotesub.find(x => x.key === note.key);
            const valueItem = data.values.find(x => x.id === item.id);
            valueItem.checked = !valueItem.checked;
            const checked = this.model.bodyNotesHistory.find(x => x.key === note.key);
            if (!checked) {
                this.model.bodyNotesHistory.push({
                    customer_id: this.data.customer.id,
                    key: note.key,
                    values: note.values.map(x => {
                        if (x.checked) return x.id;
                    }).filter(c => c !== undefined)
                });
            } else {
                this.model.bodyNotesHistory = this.model.bodyNotesHistory.filter(x => x.key !== checked.key);
                this.model.bodyNotesHistory.push({
                    customer_id: this.data.customer.id,
                    key: note.key,
                    values: note.values.map(x => {
                        if (x.checked) return x.id;
                    }).filter(c => c !== undefined)
                });
            }
        } catch (ex) {
            console.log(ex);
        }
    }

    onChangeTextMetrics = (value, ix, input?) => {
        try {
            const checked = this.model.metricsHistory.find(x => x.key === this.metricsSub[ix].key);
            if (!input) {
                if (value) {
                    if (!checked) {
                        this.model.metricsHistory.push({
                            customer_id: this.data.customer.id,
                            key: this.metricsSub[ix].key,
                            value: value
                        });
                    } else {
                        this.model.metricsHistory = this.model.metricsHistory.filter(x => x.key !== checked.key);
                        this.model.metricsHistory.push({
                            customer_id: this.data.customer.id,
                            key: this.metricsSub[ix].key,
                            value: value
                        });
                    }
                    return this.metricsSub[ix].value = value;
                }
                if (!checked) {
                    this.model.metricsHistory.push({
                        customer_id: this.data.customer.id,
                        key: this.metricsSub[ix].key,
                        value: ''
                    });
                } else {
                    this.model.metricsHistory = this.model.metricsHistory.filter(x => x.key !== checked.key);
                    this.model.metricsHistory.push({
                        customer_id: this.data.customer.id,
                        key: this.metricsSub[ix].key,
                        value: ''
                    });
                }
                return this.metricsSub[ix].value = '';
            } else {
                if (input === 1) {
                    this.metricsSub[ix].key1 = value || '';
                }
                if (input === 2) {
                    this.metricsSub[ix].key2 = value || '';
                }
                this.metricsSub[ix].value = this.metricsSub[ix].key1 + '/' + this.metricsSub[ix].key2;
                if (!checked) {
                    this.model.metricsHistory.push({
                        customer_id: this.data.customer.id,
                        key: this.metricsSub[ix].key,
                        value: this.metricsSub[ix].key1 + '/' + this.metricsSub[ix].key2
                    });
                } else {
                    this.model.metricsHistory = this.model.metricsHistory.filter(x => x.key !== checked.key);
                    this.model.metricsHistory.push({
                        customer_id: this.data.customer.id,
                        key: this.metricsSub[ix].key,
                        value: this.metricsSub[ix].key1 + '/' + this.metricsSub[ix].key2
                    });
                }
            }
        } catch (ex) {
            console.log(ex);
            return this.metricsSub[ix].value = '';
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
}
