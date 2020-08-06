import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { includes } from 'loadsh';
import swal from 'sweetalert2';

import { Helpers, TypesUtilsService } from 'src/common/utils';
import {
    ProductService,
    DesignService,
    OrderService,
    StaffService,
    ExportService,
    MetricService,
    BodyNoteService,
    ProductionService,
    CategoryService,
    InventoryService
} from 'src/common/services';
import { Storage } from 'src/common/models';
import { DesignConfig } from 'src/config';

@Component({
    selector: '.dunnio-container .dunnio-body .dunnio-grid .dunnio-grid--ver',
    templateUrl: 'detail.component.html',
    styleUrls: ['style.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        ProductionService,
        ProductService,
        DesignService,
        OrderService,
        StaffService,
        ExportService,
        MetricService,
        BodyNoteService,
        CategoryService,
        TypesUtilsService,
        InventoryService
    ]
})

export class AssignComponent implements OnInit {
    constructor(
        private productionService: ProductionService,
        private productService: ProductService,
        private invenService: InventoryService,
        private designService: DesignService,
        private orderService: OrderService,
        private staffService: StaffService,
        private route: ActivatedRoute,
        private exportService: ExportService,
        private metricService: MetricService,
        private bodyNoteService: BodyNoteService,
        private helper: Helpers,
        private categoryService: CategoryService,
        private designConfig: DesignConfig,
        private typeService: TypesUtilsService
    ) {
        this.stores = JSON.parse(
            localStorage.getItem(
                Storage.STORES
            )
        );
        this.statuses = this.productionService.statuses;
        this.onLoadModel();
        this.onLoadModelProduct();
    }

    model: any;
    modelProduct: any;
    stores: any = [];
    keypress: any;
    loading = false;
    statuses: any;
    fabrics: any = [];
    categories: any = [];
    bodyNote: any;
    bodyNotesub: any;
    metrics: any = [];
    metricsSub: any = [];
    employees: any = [];
    materials: any = [];
    valueBodyNote: any = '';
    valueDesignStyle: any = '';
    dataConfig = {
        advances: [],
        designs: [],
        extras: []
    };
    designs: any;
    loadding: any = {
        material: false
    };

    notesHistory: any = [];
    metricsHistory: any = [];

    async ngOnInit() {
        try {
            this.helper.openLoading();
            const categories = await this.categoryService.list({});
            this.categories = categories.data || [];
            const orderId = this.route.snapshot.params.id;
            const respone = await this.orderService.detail(orderId);
            if (respone.code) return swal.fire('Hệ Thống', respone.message, 'warning');
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
            const res = await this.staffService.list({
                skip: 0,
                limit: 500,
            });
            this.onSearchMaterial('');
            this.employees = res.data || [];
            this.bodyNote = await this.designConfig.bodyNotes;
            this.bodyNote.forEach(bodynote => {
                bodynote.name = bodynote.name.vi;
                bodynote.values.forEach(value => {
                    value.name = value.name.vi;
                });
            });
            this.model = respone.data;
            this.model.products.forEach(product => {
                product.hide = false;
            });
        } catch (ex) {
            /*begin:: write log ex here: break*/
            throw new Error(ex);
        } finally {
            this.helper.closeLoading();
        }

    }

    onLoadModel = () => {
        this.model = {
            id: '',
            name: '',
            type: '',
            images: [],
            note: {
                customer: '',
                system: ''
            },

            // owner and customer
            store: this.stores[0],
            customer: {
                id: '',
                name: '',
                phone: '',
                address: ''
            },
            products: [],

            // process management
            status: '',
            deadline: null,
            receive_process: {
                address: '',
                date: null
            },
            preview_process: {
                one: null,
                two: null,
                address: ''
            },
            measure_process: {
                complete_by: '',
                complete_at: null, // Ngày đo
                scheduled_at: null, // Ngày hẹn đo
                point: 0
            },
            consult_process: {
                complete_by: '',
                complete_at: null,
                point: 0
            },

            // payment management
            currency: '',
            total_price: 0,
            total_discount: 0,
            total_price_discount: 0,
            payment_method: 0,
            total_unpaid: 0,
            total_paid: 0,

            // row management
            source: '',
            device: '',
            is_active: true,
            created_by: {
                id: '',
                name: ''
            },
            created_at: null,
            updated_at: null,
        };
    }

    onLoadModelProduct = () => {
        this.modelProduct = {
            id: '',
            name: '',
            type: '',
            images: [],
            properties: {
                unit: '',
                brand: '',
                gender: ''
            },
            category_id: '',
            category_two_id: '',
            category_three_id: '',
            fabric: {
                id: '',
                name: '',
                content: '',
                image: '',
                price: 0
            },
            display: {
                ios: false,
                web: false,
                android: false
            },
            design_styles: {},
            design_extras: {},
            design_advances: {},
            owner: {
                id: '',
                name: '',
                phone: '',
                address: ''
            },
            note: {
                customer: '',
                system: '',
                body_note: ''
            },
            metrics: {},
            body_notes: {},
            currency: 'VND',
            price: 0,
            total_price: 0,
            total_discount: 0,
            total_service_price: 0,
            total_price_discount: 0,
            total_quantity: 0,
            status: '',
            deadline: null,

            regions: [
                'VI'
            ],
            relates: [],
            origin_price: 0,
            service_price: {},
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
            receive_process: {
                date: null,
                id: ''
            },
            preview_process: {
                one: null,
                two: null,
                three: null,
                id: ''
            },
            created_at: null,
            updated_at: null, measure_process: {
                complete_by: null,
                complete_at: new Date(),
                point: 0
            },
            cut_process: {
                complete_by: null,
                complete_at: new Date(),
                point: 0
            },
            prepare_process: {
                complete_by: null,
                complete_at: new Date(),
                point: 0
            },
            sew_process: {
                complete_by: null,
                complete_at: new Date(),
                point: 0
            },
            kcs_one_process: {
                complete_by: null,
                complete_at: new Date(),
                point: 0
            },
            complete_process: {
                complete_by: null,
                complete_at: new Date(),
                point: 0
            },
            kcs_two_process: {
                complete_by: null,
                complete_at: new Date(),
                point: 0
            },
            storage_process: {
                complete_by: null,
                complete_at: new Date(),
                location: null
            }
        };
    }

    onLoadDesignConfig = async () => {
        try {
            /** load design config */
            const respone = await this.designService.listStyles({
                skip: 0,
                limit: 500
            });
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

    onSearchMaterial = (keyword: string) => {
        try {
            this.loading = true;
            clearTimeout(this.keypress);
            this.keypress = setTimeout(
                async () => {
                    try {
                        const respone = await this.invenService.list(
                            {
                                skip: 0,
                                limit: 20,
                                keyword: keyword,
                                groups: 'material'
                            }
                        );
                        const data = respone.code ? [] : respone.data;
                        this.fabrics = data.map(x => {
                            return {
                                id: x.id,
                                name: x.name,
                                type: x.type,
                                properties: x.properties,
                                category_id: x.category_id,
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
        } catch (ex) {
            console.log(ex);
        }
    }

    onAddMaterial = async (item) => {
        try {
            const check = this.materials.find(x => x.id === item.id);
            if (check) return;
            const res = await this.productService.detail(item.id);
            const data = res.data;
            this.materials.push({
                id: data.id,
                quantity: 0,
                unit: data.properties.unit,
                image: data.images[0],
                price: data.price
            });
        } catch (ex) {
            console.log(ex);
        }
    }

    onRemoveMaterial = (item) => {
        try {
            swal.fire({
                title: 'Thông báo',
                text: 'Bạn chắc chắn rằng mình muốn xóa NPL này không?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Tôi đồng ý!',
                cancelButtonText: 'Từ bỏ!'
            }).then(async (result) => {
                if (result.value) {
                    this.materials = this.materials.filter(x => x.id !== item.id);
                }
            });
        } catch (ex) {
            console.log(ex);
        }
    }

    transformDate = (date: any) => {
        return this.typeService.formatDate(date, 'DD/MM/YYYY hh:mm');
    }

    onLoadDetailProduct = async (product) => {
        try {
            this.model.products.forEach(x => {
                if (x.id === product.id) {
                    x.hide = !x.hide;
                } else {
                    x.hide = false;
                }
            });
            const modelProduct = await this.model.products.find(x => x.id === product.id);

            this.dataConfig.designs = await this.onLoadDesignConfig();
            this.designs = this.dataConfig.designs.filter(x =>
                includes(x.categories, product.category_id) &&
                includes(x.genders, product.properties.gender)
            );
            const style = modelProduct.design_styles;
            if (style) {
                const dataStyles = [];
                this.designs.forEach(x => {
                    if (style[x.id]) {
                        x.values.forEach(v => {
                            if (v.id === style[x.id][0].value) {
                                dataStyles.push(v.name.vi);
                            }
                        });
                    }
                });

                this.valueDesignStyle = dataStyles.join(', ');
            }

            this.modelProduct = modelProduct;
            this.modelProduct.note = product.note;
            this.modelProduct.body_notes = product.body_notes;
            this.modelProduct.category_name = await this.categories.find(x => x.id === this.modelProduct.category_id).name;

            if (this.modelProduct.complete_process.complete_at) {
                this.modelProduct.complete_process.complete_at = new Date(this.modelProduct.complete_process.complete_at * 1000);
            }

            if (this.modelProduct.cut_process.complete_at) {
                this.modelProduct.cut_process.complete_at = new Date(this.modelProduct.cut_process.complete_at * 1000);
            }

            if (this.modelProduct.kcs_one_process.complete_at) {
                this.modelProduct.kcs_one_process.complete_at = new Date(this.modelProduct.kcs_one_process.complete_at * 1000);
            }

            if (this.modelProduct.kcs_two_process.complete_at) {
                this.modelProduct.kcs_two_process.complete_at = new Date(this.modelProduct.kcs_two_process.complete_at * 1000);
            }

            if (this.modelProduct.prepare_process.complete_at) {
                this.modelProduct.prepare_process.complete_at = new Date(this.modelProduct.prepare_process.complete_at * 1000);
            }

            if (this.modelProduct.preview_process.one) {
                this.modelProduct.preview_process.one = new Date(this.modelProduct.preview_process.one * 1000);
            }

            if (this.modelProduct.preview_process.two) {
                this.modelProduct.preview_process.two = new Date(this.modelProduct.preview_process.two * 1000);
            }

            if (this.modelProduct.preview_process.three) {
                this.modelProduct.preview_process.three = new Date(this.modelProduct.preview_process.three * 1000);
            }

            if (this.modelProduct.receive_process.date) {
                this.modelProduct.receive_process.date = new Date(this.modelProduct.receive_process.date * 1000);
            }

            if (this.modelProduct.sew_process.complete_at) {
                this.modelProduct.sew_process.complete_at = new Date(this.modelProduct.sew_process.complete_at * 1000);
            }

            if (this.modelProduct.storage_process.complete_at) {
                this.modelProduct.storage_process.complete_at = new Date(this.modelProduct.storage_process.complete_at * 1000);
            }

            this.materials = [];

            if (this.modelProduct.fabric) {
                const res = await this.productService.detail(this.modelProduct.fabric.id);
                const data = res.data;
                this.materials.push({
                    id: data.id,
                    quantity: 0,
                    unit: data.properties.unit,
                    image: data.images[0],
                    price: data.price
                });
            }

            const metrics = this.model.products.find(x => x.id === product.id);

            this.modelProduct.metrics = metrics.metrics;
            this.metrics = this.metrics.map(metric => {
                let check = false;
                if (this.modelProduct.metrics) {
                    check = includes(Object.keys(this.modelProduct.metrics), metric.key);
                }
                if (check) {
                    if (metric.total_input === 1) {
                        return {
                            key: metric.key,
                            short_key: metric.short_key,
                            name: metric.name,
                            total_input: metric.total_input,
                            categories: metric.categories,
                            genders: metric.genders,
                            value: this.modelProduct.metrics[metric.key]
                        };
                    }
                    if (metric.total_input === 2) {
                        const key = this.modelProduct.metrics[metric.key].split('/');
                        return {
                            key: metric.key,
                            key1: key[0] || '',
                            key2: key.length === 1 ? '' : key[1],
                            short_key: metric.short_key,
                            name: metric.name,
                            total_input: metric.total_input,
                            categories: metric.categories,
                            genders: metric.genders,
                            value: key.length === 1 ? key[0] + '/' : key[0] + '/' + key[1]
                        };
                    }
                } else {
                    if (metric.total_input === 1) {
                        return {
                            key: metric.key,
                            short_key: metric.short_key,
                            name: metric.name,
                            total_input: metric.total_input,
                            categories: metric.categories,
                            genders: metric.genders,
                            value: ''
                        };
                    }
                    if (metric.total_input === 2) {
                        return {
                            key: metric.key,
                            key1: '',
                            key2: '',
                            short_key: metric.short_key,
                            name: metric.name,
                            total_input: metric.total_input,
                            categories: metric.categories,
                            genders: metric.genders,
                            value: ''
                        };
                    }
                }
            });

            this.metricsSub = this.metrics.filter(x =>
                includes(x.categories, this.modelProduct.category_id) &&
                includes(x.genders, this.modelProduct.properties.gender));

            const note = [];

            this.bodyNote.forEach(bodynote => {
                bodynote.values.forEach(value => {
                    let check = false;
                    if (this.modelProduct.body_notes) {
                        check = includes(this.modelProduct.body_notes[bodynote.key], value.id);
                    }
                    value.checked = check ? true : false;
                    if (check) {
                        note.push(value.name);
                    }
                });
            });
            if (note.length) {
                this.valueBodyNote = note.join(', ');
            }

            this.bodyNotesub = this.bodyNote.filter(x =>
                includes(x.categories, this.modelProduct.category_id)
            );
        } catch (ex) {
            console.log(ex);
        }
    }

    transformCategories = (cat) => {
        try {
            const category = this.categories.find(x => x.id === cat);
            return category.name;
        } catch (ex) {
            console.log(ex);
            return 'Chưa cập nhật';
        }
    }

    onSearchEmployee = (keyword: string) => {
        try {
            this.loading = true;
            clearTimeout(this.keypress);
            this.keypress = setTimeout(
                async () => {
                    try {
                        if (!keyword) return;
                        return this.employees.map(x => x.fullText = x.phone + ' ' + x.name);
                    } catch (ex) {
                        return this.employees = this.employees || [];
                    } finally {
                        this.loading = false;
                    }
                }, 500);
        } catch (ex) {
            console.log(ex);
        }
    }

    onAssignProducition = () => {
        try {
            swal.fire({
                title: 'Thông báo',
                text: 'Bạn chắc chắn rằng mình muốn thực hiện thao tác này?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Tôi đồng ý!',
                cancelButtonText: 'Từ bỏ!'
            }).then(async (result) => {
                if (result.value) {
                    const dataAssign = {
                        receive_process: this.modelProduct.receive_process,
                        preview_process: this.modelProduct.preview_process,
                        measure_process: this.modelProduct.measure_process,
                        cut_process: this.modelProduct.cut_process,
                        prepare_process: this.modelProduct.prepare_process,
                        sew_process: this.modelProduct.sew_process,
                        kcs_one_process: this.modelProduct.kcs_one_process,
                        complete_process: this.modelProduct.complete_process,
                        kcs_two_process: this.modelProduct.kcs_two_process,
                        note: this.modelProduct.note
                    };
                    const respone = await this.productionService.assign(this.model.id, dataAssign, this.modelProduct.id);
                    if (respone.code) return swal.fire('Hệ Thống', respone.message, 'warning');
                    return swal.fire('Thành Công', respone.message, 'success');
                }
            });
        } catch (ex) {
            console.log(ex);
        }
    }

    handleRequestExport = async () => {
        try {
            console.log(this.materials);
            const data = this.materials.map(x => {
                return {
                    id: x.id,
                    total_quantity: x.quantity
                };
            });
            const chekcQuantity = this.materials.find(x => x.quantity <= 0);
            if (chekcQuantity) return swal.fire('Hệ thống', 'Vui lòng nhập số lượng NPL', 'warning');
            let totalQuantity = 0;
            let totalPrice = 0;
            this.materials.map(x => {
                totalQuantity += x.quantity;
                totalPrice += (x.quantity * x.price);
            });

            const dataExport = {
                note: 'xuất nguyên phụ liệu sản xuất cho sản phẩm' + this.modelProduct.id,
                type: 3,
                items: this.materials.map(x => {
                    return {
                        id: x.id,
                        total_quantity: x.quantity,
                        total_price: x.quantity * x.price
                    };
                }),
                total_quantity: totalQuantity,
                total_price: totalPrice
            };
            const res = await this.exportService.create(dataExport);
            if (res.code) return swal.fire('Hệ Thống', res.message, 'warning');
            await this.productService.update(this.modelProduct.id, { parts: data });
            return swal.fire('Thành Công', res.message, 'success');
        } catch (ex) {
            console.log(ex);
        }
    }

    onUpdateBodyNote = async () => {
        try {
            swal.fire({
                title: 'Thông báo',
                text: 'Bạn có muốn ghi đè thông tin số đo của khách hàng?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Tôi đồng ý!',
                cancelButtonText: 'Từ bỏ!'
            }).then(async (result) => {
                if (result.value) {
                    this.bodyNotesub.forEach(bodynote => {
                        this.modelProduct.body_notes[bodynote.key] = [];
                        bodynote.values.forEach(value => {
                            if (value.checked) this.modelProduct.body_notes[bodynote.key].push(value.id);
                        });
                    });
                    this.modelProduct.metrics = {};
                    this.metricsSub.map(x => {
                        if (x.value) {
                            this.modelProduct.metrics[x.key] = x.value;
                        }
                    });
                    const dataBodyNote = {
                        note: this.modelProduct.note,
                        body_notes: this.modelProduct.body_notes,
                        metrics: this.modelProduct.metrics
                    };
                    this.helper.openLoading();
                    if (this.metricsHistory.length) {
                        this.metricsHistory.forEach(async (x) => {
                            await this.metricService.create(x);
                        });
                    }
                    if (this.notesHistory.length) {
                        this.notesHistory.forEach(async (x) => {
                            await this.bodyNoteService.create(x);
                        });
                    }
                    this.helper.closeLoading();
                    const respone = await this.productionService.assign(this.model.id, dataBodyNote, this.modelProduct.id);
                    if (respone.code) {
                        return swal.fire('Hệ thống', respone.message, 'warning');
                    }
                    ($('#dunnio_update_bodynote') as any).modal('hide');
                    this.ngOnInit();
                    return swal.fire('Thành công', respone.message, 'success');
                }
            });
        } catch (ex) {
            console.log(ex);
        }
    }

    onSelectBodyNote = (note, item) => {
        try {
            const data = this.bodyNotesub.find(x => x.key === note.key);
            const valueItem = data.values.find(x => x.id === item.id);
            valueItem.checked = !valueItem.checked;
            const checked = this.notesHistory.find(x => x.key === note.key);
            if (!checked) {
                this.notesHistory.push({
                    customer_id: this.model.customer.id,
                    key: note.key,
                    values: note.values.map(x => {
                        if (x.checked) return x.id;
                    }).filter(c => c !== undefined)
                });
            } else {
                this.notesHistory = this.notesHistory.filter(x => x.key !== checked.key);
                this.notesHistory.push({
                    customer_id: this.model.customer.id,
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

    onLoadDesignAdvances = async () => {
        try {
            const respone = await this.designService.listAdvances({
                types: 'tailor',
                categories: this.modelProduct.category_id
            });
            const advances = respone.code ? [] : respone.advances;
            return advances;
        } catch (ex) {
            /*begin:: write log ex here: break*/
            console.log(ex);
            return [];
        }
    }

    onLoadDesignAdvancesWarranty = async () => {
        try {
            const respone = await this.designService.listAdvances({
                types: 'warranty',
                categories: this.modelProduct.category_id
            });
            const advances = respone.code ? [] : respone.advances;
            return advances;
        } catch (ex) {
            /*begin:: write log ex here: break*/
            console.log(ex);
            return [];
        }
    }

    printProductions = async () => {
        try {
            let noteExtra = [];
            if (this.modelProduct.type === 'tailor') {
                const advances = await this.onLoadDesignAdvances();
                advances[0].values = advances[0].values.map(x => {
                    const check = Object.keys(this.modelProduct.design_advances).find(v => v === x.id);
                    if (check) return x.name.vi;
                });
                noteExtra = noteExtra.concat(advances[0].values);
            } else {
                const advances2 = await this.onLoadDesignAdvancesWarranty();
                advances2[0].values = advances2[0].values.map(x => {
                    const check = Object.keys(this.modelProduct.design_advances).find(v => v === x.id);
                    if (check) return x.name.vi;
                });
                noteExtra = noteExtra.concat(advances2[0].values);
                noteExtra = noteExtra.filter(x => x);
            }
            if (this.modelProduct.design_extras) {
                let extras = Object.keys(this.modelProduct.design_extras);
                extras = extras.map(x => {
                    if (this.modelProduct.design_extras[x].length > 1) return this.modelProduct.design_extras[x][1];
                }).filter(x => x);
                noteExtra = noteExtra.concat(extras.map((x: any) => {
                    return x.value;
                }));
                noteExtra = noteExtra.filter(x => x);
            }
            const valueNoteExtra = noteExtra.join(', ');
            this.printProductions1(
                this.modelProduct,
                this.model,
                this.valueBodyNote,
                this.metricsSub,
                this.designs,
                valueNoteExtra
            );
        } catch (ex) {
            console.log(ex);
        }
    }

    printProductions1 = async (items, order, valueBodyNote?, metrics?, designs?, valueNoteExtra?) => {
        try {
            const rawFile = await $.get('./assets/template/k-print.html');
            let metric = '';
            let design = '';
            metrics.forEach((item) => {
                metric += `<div style = "width: 50%;" >
                ${item.short_key}:${item.value}
                </div>`;
            });
            designs.forEach((x) => {
                const value = x.values.find(a => a.selected);
                design += `<div style = "width: 100%; padding-top:10px; padding-left:10px" >
                ${x.name.vi}:${value.name.vi}
                </div>`;
            });

            const Production = `<style>
            .main {
                width: 478px;
                height: 372px;
                display: flex;
            }
            body {
                margin: 0 0 0 2px;
            }
            .m-rigth {
                width: 50%;
            }
            .m-left {
                width: 50%;
            }
            .m-l-top {
                width: 100%;
                height: 168px;
                border: 1px solid;
                border-top: none;
            }
            .m-l-bottom {
                width: 100%;
                height: 205px;
                border: 1px solid;
                border-bottom: none;
            }
            .m-r-top {
                width: 100%;
                height: 168px;
                border: 1px solid;
                border-top: none;
            }
            .m-r-bottom {
                width: 100%;
                height: 205px;
                border: 1px solid;
                border-bottom: none;
            }
            .fz10 {
                font-size: 12px
            }
            .fz9 {
                font-size: 12px
            }
            .txt-centre {
                text-align: center
            }
            .header-m-left {
                height: 28px;
                border-bottom: 1px solid #494848;
            }
            td {
                padding-left: 10px;
            }
            .m-l-t-table {
                width: 100%;
            }
            .conten-body {
                display: flex;
            }
            .m-left_top{
                width: 50%;
            }
        </style>
        <div class="main" style=" font-family: monospace; ">
            <div class="m-left">
                <div class="m-l-top">
                    <div class="header-m-left fz10 txt-centre" style="font-weight: bold;">
                    <a>
                    <span>${order.store.id} - ${items.id}</span>
                </a>
                <br>
                <a>
                    <span>${order.customer.name}</span> - <span>
                    ${order.customer.phone.slice(order.customer.phone.length - 6, order.customer.phone)}</span>
                </a>
                    </div>
                    <div class="body-m-left fz9" style="font-weight: bold;">
                        <div class="conten-body " style="height: 20px;">
                            <div class="c-b-left m-left_top"
                            style="border-bottom: 1px solid #494848;border-right: 1px solid #494848;padding-left: 10px;">
                            TV:${order.consult_process.complete_by ? order.consult_process.complete_by : 'Chưa cập nhật'}
                            </div>
                            <div class="c-b-rigth m-left_top"
                            style="border-bottom: 1px solid #494848;padding-left: 10px;padding-left: 5px;">
                            SC:${!order.measure_process.complete_by
                    ? ''
                    : order.measure_process.complete_by}
                            </div>
                        </div>
                        <div class="conten-body" style="height: 33px;">
                            <div class="c-b-left  m-left_top"
                            style="border-bottom: 1px solid #494848;border-right: 1px solid #494848;padding-left: 10px;">
                            <span>MV:${!items.fabric
                    || !items.fabric.id ? '' : items.fabric.id}</span><br/>
                            <span>SL:${!items.parts || !items.parts[0].total_quantity
                    ? '' : items.parts[0].total_quantity}</span>
                            </div>
                            <div class="c-b-rigth  m-left_top" style="border-bottom: 1px solid #494848;padding-left: 5px;">
                            <span>C:${!items.cut_process.complete_by
                    ? '' : items.cut_process.complete_by}</span><br/>
                            <span>${!items.cut_process.complete_at ? ''
                    : this.typeService.formatDate(items.cut_process.complete_at / 1000, 'DD/MM/YYYY')}</span>
                            </div>
                        </div>
                        <div class="conten-body" style="height: 33px;">
                            <div class="c-b-left  m-left_top"
                            style="border-bottom: 1px solid #494848;border-right: 1px solid #494848;padding-left: 10px;">
                            <span>M:${!items.sew_process.complete_by
                    ? '' : items.sew_process.complete_by}</span><br/>
                            <span>${!items.sew_process.complete_at
                    ? '' : this.typeService.formatDate(items.sew_process.complete_at / 1000, 'DD/MM/YYYY')}</span>
                            </div>
                            <div class="c-b-rigth  m-left_top" style="border-bottom: 1px solid #494848;padding-left: 5px;">
                            <span>K1:${!items.kcs_one_process.complete_by ? '' : items.kcs_one_process.complete_by}</span><br />
                            <span>${items.kcs_one_process
                    && !items.kcs_one_process.complete_at ? ''
                    : this.typeService.formatDate(items.kcs_one_process.complete_at / 1000, 'DD/MM/YYYY')}</span>
                            </div>
                        </div>
                        <div class="conten-body" style="height: 33px;">
                            <div class="c-b-left  m-left_top"
                             style="border-bottom: 1px solid #494848;border-right: 1px solid #494848;padding-left: 10px;">
                            <span>H:${!items.complete_process.complete_by ? '' : items.complete_process.complete_by}</span><br />
                            <span>${!items.complete_process.complete_at
                    ? '' : this.typeService.formatDate(items.complete_process.complete_at / 1000, 'DD/MM/YYYY')}</span>
                            </div>
                            <div class="c-b-rigth  m-left_top" style="border-bottom: 1px solid #494848;padding-left: 5px;">
                            <span>K2:${!items.kcs_two_process.complete_by ? '' : items.kcs_two_process.complete_by}</span><br />
                            <span>${!items.kcs_two_process.complete_at ? ''
                    : this.typeService.formatDate(items.kcs_two_process.complete_at / 1000, 'DD/MM/YYYY')}</span>
                            </div>
                        </div>
                        <div class="conten-body" style="height: 20px;">
                            <div class="c-b-left  m-left_top" style="border-right: 1px solid #494848;padding-left: 10px;">
                                T1:${!items.preview_process.one ? ''
                    : this.typeService.formatDate(items.preview_process.one / 1000, 'DD/MM/YYYY')}
                            </div>
                            <div class="c-b-rigth  m-left_top" style="padding-left: 5px">
                                T2:${!items.preview_process.two ? ''
                    : this.typeService.formatDate(items.order.preview_process.two / 1000, 'DD/MM/YYYY')}
                            </div>
                        </div>

                    </div>
                </div>
                <div class="m-r-bottom">

                    <div class="body" style="display: flex;flex-wrap: wrap;border-bottom:2px solid;height: 145px;padding: 5px 0 0 10px;">
                         <div class="fz9">
                         <label>${valueBodyNote} </label></br>
                <label > ${ valueNoteExtra ? valueNoteExtra : ''}</label></br >
                    <label>${ items.note.body_note ? 'Ghi chú: ' + items.note.body_note : ''} </label>
                        </div>
                        </div>

                        <div class="body fz9" style = " display: flex; flex-wrap: wrap;padding: 5px 0 0 10px; " >
                            <div class="fz9" >
                                <label>${ items.note.system ? 'Ghi chú: ' + items.note.system : ''}</label>
                                    </div>
                                    </div>
                                    </div>
                                    </div>
                                    <div class="m-rigth" >
                                        <div class="m-r-top" >
                                            <div class="body" style = "display: flex; flex-wrap: wrap; padding: 0px 0 0 10px; " >
                                            ${metric}
                                        </div>
                </div>
                <div class="m-l-bottom" >
                    ${design}
                </div>
                </div>
                </div>`;
            const template = rawFile.replace(/{{PRINT}}/g, Production);
            this.helper.print(template);
        } catch (ex) {
            /*begin:: write log ex here: break*/
            throw new Error(ex);
        }
    }

    onChangeTextMetrics = (value, ix, input?) => {
        try {
            const checked = this.metricsHistory.find(x => x.key === this.metricsSub[ix].key);
            if (!input) {
                if (value) {
                    if (!checked) {
                        this.metricsHistory.push({
                            customer_id: this.model.customer.id,
                            key: this.metricsSub[ix].key,
                            value: value
                        });
                    } else {
                        this.metricsHistory = this.metricsHistory.filter(x => x.key !== checked.key);
                        this.metricsHistory.push({
                            customer_id: this.model.customer.id,
                            key: this.metricsSub[ix].key,
                            value: value
                        });
                    }
                    return this.metricsSub[ix].value = value;
                }
                if (!checked) {
                    this.metricsHistory.push({
                        customer_id: this.model.customer.id,
                        key: this.metricsSub[ix].key,
                        value: ''
                    });
                } else {
                    this.metricsHistory = this.metricsHistory.filter(x => x.key !== checked.key);
                    this.metricsHistory.push({
                        customer_id: this.model.customer.id,
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
                    this.metricsHistory.push({
                        customer_id: this.model.customer.id,
                        key: this.metricsSub[ix].key,
                        value: this.metricsSub[ix].key1 + '/' + this.metricsSub[ix].key2
                    });
                } else {
                    this.metricsHistory = this.metricsHistory.filter(x => x.key !== checked.key);
                    this.metricsHistory.push({
                        customer_id: this.model.customer.id,
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
}
