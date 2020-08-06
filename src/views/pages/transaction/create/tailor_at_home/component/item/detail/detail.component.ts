import {
    Component,
    ViewEncapsulation,
    Input,
    Output,
    EventEmitter,
    OnChanges,
    OnInit
} from '@angular/core';
import { includes } from 'loadsh';
import swal from 'sweetalert2';

import { ProductService, CategoryService } from 'src/common/services';
import { DesignConfig } from 'src/config';

@Component({
    selector: 'dunnio-item-tailor-at-home-update',
    templateUrl: 'detail.component.html',
    styleUrls: ['./style.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        ProductService,
        CategoryService
    ]
})

export class ItemTailorAtHomeDetailComponent implements OnChanges, OnInit {

    constructor(
        private productService: ProductService,
        private designConfig: DesignConfig,
        private categoryService: CategoryService
    ) { }

    /** public variable */
    @Input() data;
    @Input() itemId: string;
    @Input() metricsHistory;
    @Input() bodyNoteHistory;
    @Input() dataConfig;

    @Output() callback = new EventEmitter<object>();
    /** private variable */
    keypress: any;
    loading = false;
    model: any = {
        id: '',
        name: '',
        note: {
            customer: '',
            system: '',
        },
        type: 'tailor',
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
        metricsHistory: [],
        bodyNotesHistory: [],
        parts: []
    };

    bodyNote: any;
    bodyNotesub: any;
    metrics: any;

    /** detail attribute */
    categories: any[];
    fabrics: any = [];

    /** design attribute */
    designExtras: any[];
    designConfigs: any[];
    designAdvances: any[];

    metricsSub: any;

    async ngOnInit() {
        const categories = await this.categoryService.list({ skip: 0, limit: 100 } as any);
        this.categories = categories.data || [];
    }

    async ngOnChanges() {
        try {
            if (!this.itemId) return false;
            this.model = this.data.products.find(x => x.id === this.itemId);
            if (this.model) {
                this.onLoadDesign();
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
                    includes(x.categories, this.model.category_id));

                this.metrics = await this.designConfig.metrics;
                this.metrics = this.metrics.map(metric => {
                    const check = includes(Object.keys(this.model.metrics), metric.id);
                    if (check) {
                        if (metric.input.total === 1) {
                            return {
                                key: metric.id,
                                short_key: metric.key,
                                name: metric.name.vi,
                                total_input: metric.input.total,
                                categories: metric.categories,
                                genders: metric.genders,
                                value: this.model.metrics[metric.id]
                            };
                        }
                        if (metric.input.total === 2) {
                            const key = this.model.metrics[metric.id].split('/');
                            return {
                                key: metric.id,
                                key1: key[0] || 0,
                                key2: key[1] || 0,
                                short_key: metric.key,
                                name: metric.name.vi,
                                total_input: metric.input.total,
                                categories: metric.categories,
                                genders: metric.genders,
                                value: key.length === 1 ? key[0] + '/' : key[0] + '/' + key[1]
                            };
                        }
                    } else {
                        if (metric.input.total === 1) {
                            return {
                                key: metric.id,
                                short_key: metric.key,
                                name: metric.name.vi,
                                total_input: metric.input.total,
                                categories: metric.categories,
                                genders: metric.genders,
                                value: ''
                            };
                        }
                        if (metric.input.total === 2) {
                            return {
                                key: metric.id,
                                key1: '',
                                key2: '',
                                short_key: metric.key,
                                name: metric.name.vi,
                                total_input: metric.total_input,
                                categories: metric.categories,
                                genders: metric.genders,
                                value: ''
                            };
                        }
                    }
                });
                this.metricsSub = this.metrics.filter(x =>
                    includes(x.categories, this.model.category_id) &&
                    includes(x.genders, this.model.properties.gender)
                );

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
        } catch (ex) {
            console.log(ex);
            return swal.fire('Hệ thống', 'Có lỗi xảy ra trong quá trình xử lý.!', 'warning');
        }
    }

    onLoadDesign = () => {
        const designData = this.handleEventLoadDesigns();
        this.designAdvances = designData.advances;
        this.designConfigs = designData.designs;
        this.designExtras = designData.extras;
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
                this.model.parts = [];
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
                    console.log(this.fabrics);
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

    onChangeGender = (genderId: string) => {
        this.model.properties.gender = genderId;
        /** load design for new category */
        this.onLoadDesign();
        this.model.fabric = null;
        return this.model.properties.gender;
    }

    onChangeCategory = (categoryId: string) => {
        const { id } = this.categories.find(x => x.id === categoryId);
        this.model.category_id = id;
        this.onLoadDesign();
        return this.model.categories;
    }

    onUpdateItem = async () => {
        if (!this.model.fabric || !this.model.fabric.id) {
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
        this.bodyNotesub.forEach(bodynote => {
            this.model.body_notes[bodynote.key] = [];
            bodynote.values.forEach(value => {
                if (value.checked) this.model.body_notes[bodynote.key].push(value.id);
            });
        });

        this.metrics.map(x => {
            if (x.value) {
                this.model.metrics[x.key] = x.value;
            }
        });
        this.model.total_price = this.model.price;
        this.model.total_price_discount = this.model.total_price - this.model.total_discount + this.model.fabric.price;
        /** update item */
        const respone = await this.productService.update(this.itemId, this.model);
        if (respone.code) {
            return swal.fire('Hệ thống', respone.message, 'warning');
        }
        console.log(this.model);
        this.callback.emit({
            item: this.model,
            id: this.itemId
        });
        return ($('#dunnio_update_item') as any).modal('hide');
    }

    onChangeDesign = (designId: string, valueId: string) => {
        this.designConfigs.map(x =>
            x.id === designId &&
            x.values.map(v => v.selected = v.id === valueId ? true : false)
        );
        this.onLoadDesign();
        return this.designConfigs;
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

    onChangeTextBodyNote = (event, key) => {
        try {
            if (event) return this.model.body_notes[key] = event;
            return this.model.body_notes[key] = '';
        } catch (ex) {
            console.log(ex);
            return this.model.body_notes[key] = '';
        }
    }

    onChangeFabric = async () => {
        try {
            if (!this.model.fabric || !this.model.fabric.id) return false;
            this.model.origin_price = 0;
            return this.model.origin_price;
        } catch (ex) {
            console.log(ex);
        }

    }
}
