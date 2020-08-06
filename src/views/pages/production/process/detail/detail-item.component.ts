import { Component, ViewEncapsulation, OnInit, Input } from '@angular/core';
import { includes } from 'loadsh';
import swal from 'sweetalert2';
import { DesignService, ProductService, ProductionService, CategoryService } from 'src/common/services';
import { Helpers, TypesUtilsService } from 'src/common/utils';
import { DesignConfig } from 'src/config';
import { ToastrService } from 'ngx-toastr';
import { ErrorModel } from 'src/common/models';

@Component({
    selector: 'dunnio-create-customer-page',
    templateUrl: 'detail-item.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['style.component.scss'],
    providers: [
        DesignService,
        ProductService,
        ProductionService,
        CategoryService
    ]
})

export class ProcessDetailItemComponent implements OnInit {
    constructor(
        private designService: DesignService,
        private service: ProductionService,
        private helpers: Helpers,
        private toastrService: ToastrService,
        private productService: ProductService,
        private categoryService: CategoryService,
        private designConfig: DesignConfig,
        private typeService: TypesUtilsService
    ) {
        this.statuses = this.service.statuses;
        /** load process id */
    }

    statuses: any = {};
    loading = false;
    categories: any = [];
    model: any = {
        id: '',
        name: '',
        type: '',
        properties: {
            unit: '',
            brand: '',
            gender: ''
        },
        category_id: '',
        category_two_id: '',
        category_three_id: '',
        description: null,
        images: [],
        display: {
            ios: false,
            web: false,
            android: false
        },
        regions: [
            'VI'
        ],
        note: {
            system: null,
            customer: null,
            body_note: null
        },
        relates: [],
        currency: 'VND',
        origin_price: 0,
        service_price: {},
        price: 0,
        fabric: {
            id: '',
            name: '',
            type: '',
            price: 0,
            fullText: '',
            properties: {
                unit: '',
                gender: '',
                season: null
            },
            category_id: null,
            total_quantity: 0
        },
        design_styles: {},
        design_extras: {},
        design_advances: {},
        metadata: {
            og_url: null,
            og_image: null,
            og_title: null,
            og_description: null
        },
        statistic: {
            like_count: 0,
            view_count: 0,
            order_count: 0
        },
        is_active: true,
        created_by: {
            id: '',
            name: ''
        },
        body_notes: {},
        warranted_at: null,
        created_at: Date,
        updated_at: Date
    };
    itemId: any;
    /** design attribute */
    designExtras: any[];
    designConfigs: any[];
    designAdvances: any[];
    dataConfig = {
        advances: [],
        designs: [],
        extras: []
    };
    bodyNote: any[];
    metrics: any[];
    keyHistories: any[];
    histories = [];
    row: any;
    src = '';

    async ngOnInit() {
        try {
            this.helpers.openLoading();
            /** load default config */
            const categories = await this.categoryService.list({
                skip: 0,
                limit: 500
            });
            this.categories = categories.data || [];
            await this.service.detail(
                this.row.id, this.row.order_id
            ).then(res => {
                if (res.code) {
                    const error = new ErrorModel(res);
                    this.toastrService.warning(error.getMessage);
                    return false;
                }

                // TODO:: Success
                this.model = res.data;
            }).catch(ex => {
                throw Error(ex);
            });
            this.dataConfig.designs = await this.onLoadDesignConfig();
            this.dataConfig.extras = await this.onLoadDesignExtraConfig();
            if (this.model.type === 'tailor' || this.model.type === 'tailor_at_home') {
                this.dataConfig.advances = await this.onLoadDesignAdvances('tailor');
            } else {
                this.dataConfig.advances = await this.onLoadDesignAdvances('warranty');
            }

            this.keyHistories = await this.productService.keyHistories();
            // transform histories
            const resHistory = await this.productService.histories(this.model.id);

            const dataHistories = resHistory.data || [];
            for (const key in dataHistories) {
                if (dataHistories.hasOwnProperty(key)) {
                    const element = dataHistories[key];
                    element.histories = [];
                    this.keyHistories.map(el => {
                        const value = element.data.new[el.key];
                        if (value) {
                            element.histories.push({
                                name: el.text,
                                type: el.type,
                                value: el.sub_key ? value[el.sub_key] : value
                            });
                        }
                    });
                    this.histories.push(element);
                }
            }
            const designData = this.handleEventLoadDesigns();
            // loading data default
            this.designConfigs = designData.designs;

            this.designAdvances = designData.advances;
            this.designExtras = designData.extras;

            this.bodyNote = await this.designConfig.bodyNotes;
            this.bodyNote.forEach(bodynote => {
                bodynote.name = bodynote.name.vi;
                bodynote.values.forEach(value => {
                    value.name = value.name.vi;
                    let check = false;
                    if (this.model.body_notes) {
                        check = includes(this.model.body_notes[bodynote.key], value.id);
                    }
                    value.checked = check ? true : false;
                });
            });
            this.bodyNote = this.bodyNote.map(x => {
                return {
                    key: x.key,
                    categories: x.categories,
                    name: x.name,
                    values: x.values,
                    hide: false,
                    textValue: x.values.map(v => {
                        if (v.checked) return v.name;
                    }).filter(c => c).toString()
                };
            });
            this.metrics = await this.designConfig.metrics;

            this.metrics = this.metrics.filter(x =>
                includes(x.categories, this.model.category_id) &&
                includes(x.genders, this.model.properties.gender)
            ).map(metric => {
                const check = !this.model.metrics ? false : includes(Object.keys(this.model.metrics), metric.id);
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
                            total_input: metric.input.total,
                            categories: metric.categories,
                            genders: metric.genders,
                            value: ''
                        };
                    }
                }
            });
            this.designConfigs.forEach(x => {
                const check = !this.model.design_styles ? false : includes(Object.keys(this.model.design_styles), x.id);
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
            const dsc = this.designConfigs[0].values.find(x => x.selected);
            this.onChangeDesign(dsc.hides[0], dsc.id);

            // if (this.model.design_extras) {
            //     if (this.model.design_extras.initials__text) {
            //         if (this.model.design_extras.initials__text.length < 3) {
            //             this.model.design_extras.initials__text = this.designExtras.find(x => x.id === 'initials__text').values;
            //         }
            //     }
            // } else {
            //     if (this.designExtras.length) {
            //         const data = this.designExtras.find(x => x.id === 'initials__text');
            //         const value = data.values[0].values.find(x => x.selected);
            //         value.text = !this.model.design_extras.initials__text
            //             ? ''
            //             : this.model.design_extras.initials__text[2].value;
            //         data.initials__text = value.text;
            //     }
            // }
            if (this.model.design_extras) {
                if (!this.model.design_extras.initials__text || this.model.design_extras.initials__text.length < 3) {
                    this.model.design_extras.initials__text = this.designExtras.find(x => x.id === 'initials__text').values;
                } else {
                    const data = this.designExtras.find(x => x.id === 'initials__text');
                    const value = data.values[0].values.find(x => x.selected);
                    value.text = this.model.design_extras.initials__text[2].value;
                    data.initials__text = value.text;

                }
            }
            if (this.model.type === 'tailor' || this.model.type === 'tailor_at_home') {
                this.designExtras = this.designExtras.map((x) => {
                    /** check lv1 */
                    const designExtrasKey = !this.model.design_extras ? [] : Object.keys(this.model.design_extras);
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
                            let checkLV2 = false;
                            if (this.model.design_extras[checkLV1]) {
                                checkLV2 = !this.model.design_extras
                                    ? false
                                    : this.model.design_extras[checkLV1].find(keylv2 => keylv2.id === v.id);
                            }
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
                                    const value = !this.model.design_extras || !checkLV1
                                        ? false
                                        : this.model.design_extras[checkLV1].find(f => f.id === v.id);
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
                this.designExtras = this.designExtras.filter(
                    x => x.id !== 'initials__text'
                ).concat(
                    this.designExtras.filter(x => x.id === 'initials__text')
                );
            }
            this.designAdvances[0].values.forEach(advance => {
                const check = includes(Object.keys(this.model.design_advances), advance.id);
                advance.checked = check ? true : false;
            });

            switch (this.model.category_id) {
                case 'V':
                    switch (this.model.properties.gender) {
                        case 'male':
                            this.src = './assets/media/icons/v-1.svg';
                            break;
                        case 'female':
                            this.src = './assets/media/icons/vw-1.svg';
                            break;
                        default:
                            break;
                    }
                    break;
                case 'S':
                    switch (this.model.properties.gender) {
                        case 'male':
                            this.src = './assets/media/icons/s-1.svg';
                            break;
                        case 'female':
                            this.src = './assets/media/icons/sw-1.svg';
                            break;
                        default:
                            break;
                    }
                    break;
                case 'G':
                    switch (this.model.properties.gender) {
                        case 'male':
                            this.src = './assets/media/icons/g-1.svg';
                            break;
                        default:
                            break;
                    }
                    break;
                case 'D':
                    switch (this.model.properties.gender) {
                        case 'female':
                            this.src = './assets/media/icons/dw-1.svg';
                            break;
                        default:
                            break;
                    }
                    break;
                case 'Q':
                    switch (this.model.properties.gender) {
                        case 'male':
                            this.src = './assets/media/icons/q-1.svg';
                            break;
                        case 'female':
                            this.src = './assets/media/icons/q-1.svg';
                            break;
                        default:
                            break;
                    }
                    break;
                case 'Z':
                    switch (this.model.properties.gender) {
                        case 'female':
                            this.src = './assets/media/icons/zw-1.svg';
                            break;
                        default:
                            break;
                    }
                    break;
                case 'M':
                    switch (this.model.properties.gender) {
                        case 'male':
                            this.src = './assets/media/icons/m-1.svg';
                            break;
                        case 'female':
                            this.src = './assets/media/icons/m-1.svg';
                            break;
                        default:
                            break;
                    }
                    break;
                default:
                    break;
            }
        } catch (ex) {
            console.log(ex);
            return swal.fire('Hệ thống', 'Có lỗi xảy ra trong quá trình xử lý.!', 'warning');
        } finally {
            this.helpers.closeLoading();
        }
    }

    onChangeDesign = (designId: string, valueId: string) => {
        this.designConfigs.map(x =>
            x.id === designId &&
            x.values.map(v => v.selected = v.id === valueId ? true : false)
        );

        /** load design for new category */
        const designData = this.handleEventLoadDesigns();
        this.designConfigs = designData.designs;
        this.designExtras = designData.extras;
        return this.designConfigs;
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
                    v.hides.map((value: any) => dataHides.push(value));
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
                values: data.values.filter((v: { id: any; }) => !includes(dataHides, v.id))
            };
        });

        const designExtras = this.dataConfig.extras.filter(x =>
            includes(x.categories, categoryId) &&
            includes(x.genders, gender) &&
            !includes(dataHides, x.id)
        ).map(data => {
            if (!data.values.find((x: { selected: any; }) => x.selected)) {
                data.values[0].selected = true;
            }
            return {
                id: data.id,
                name: data.name,
                icon: data.icon,
                genders: data.genders,
                categories: data.categories,
                selected: data.selected,
                values: data.values.filter((v: { id: any; }) => !includes(dataHides, v.id))
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

    onLoadDesignConfig = async () => {
        try {
            /** load design config */
            const respone = await this.designService.listStyles();
            const designs = !respone.code
                ? respone.designs.map((x, index) => {
                    return {
                        id: x.id,
                        name: x.name,
                        icon: x.icon,
                        genders: x.genders,
                        categories: x.categories,
                        selected: index === 0 ? true : false,
                        values: x.values.map((v, subIndex) => {
                            return {
                                id: v.id,
                                name: v.name,
                                icon: v.icon,
                                hides: v.hides,
                                selected: subIndex === 0 ? true : false,
                            };
                        })
                    };
                })
                : [];

            return designs;
        } catch (ex) {
            /*begin:: write log ex here: break*/
            console.log(ex);
            return [];
        }
    }

    onLoadDesignExtraConfig = async () => {
        try {
            /** load design extra config */
            const respone = await this.designService.listExtras();
            const extras = !respone.code
                ? respone.extras.map(x => {
                    return {
                        /** level 1 */
                        id: x.id,
                        name: x.name,
                        icon: x.icon,
                        genders: x.genders,
                        categories: x.categories,
                        selected: false,
                        values: x.values.map((v, parentIndex) => {
                            return {
                                /** level 2 */
                                id: v.id,
                                name: v.name,
                                icon: v.icon,
                                price: v.price,
                                selected: parentIndex === 0 ? true : false,
                                values: v.values.map((sv, childIndex) => {
                                    return {
                                        /** level 3 */
                                        id: sv.id,
                                        name: sv.name,
                                        price: sv.price,
                                        image: sv.image,
                                        selected: childIndex === 0 ? true : false
                                    };
                                })
                            };
                        })
                    };
                })
                : [];

            return extras;
        } catch (ex) {
            /*begin:: write log ex here: break*/
            console.log(ex);
            return [];
        }
    }

    onLoadDesignAdvances = async (type) => {
        try {
            /** load design advances config */
            const respone = await this.designService.listAdvances({ types: type });
            const advances = respone.code ? [] : respone.advances;
            return advances;
        } catch (ex) {
            /*begin:: write log ex here: break*/
            console.log(ex);
            return [];
        }
    }

    transformDate = (date: any) => {
        return this.typeService.formatDate(date, 'DD/MM/YYYY hh:mm');
    }
}
