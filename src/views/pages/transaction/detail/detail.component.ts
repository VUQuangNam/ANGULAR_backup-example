import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { includes } from 'loadsh';
import swal from 'sweetalert2';

import { Helpers, TypesUtilsService } from 'src/common/utils';
import { OrderService, ProductService, DesignService, CategoryService } from 'src/common/services';
import { DesignConfig, BaseConfig } from 'src/config';
import { ProductNormalStatuses, OrderNormalStatuses, Storage } from 'src/common/models';
import { DecimalPipe } from '@angular/common';

@Component({
    selector: '.dunnio-container .dunnio-body .dunnio-grid .dunnio-grid--ver',
    templateUrl: './detail.component.html',
    styleUrls: ['style.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        OrderService,
        ProductService,
        DesignService,
        CategoryService
    ]
})

export class OrderDetailComponent implements OnInit {
    model: any = {
        id: '',
        name: '',
        type: '',
        images: [],
        note: {
            customer: '',
            system: ''
        },

        // owner and customer
        store: {
            id: '',
            name: '',
            phone: '',
            address: ''
        },
        customer: {
            id: '',
            name: '',
            phone: '',
            address: ''
        },
        products: [],

        // process management
        status: '',
        deadline: Date,
        receive_process: {
            address: '',
            date: Date
        },
        preview_process: {
            one: Date,
            two: Date,
            address: ''
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
        created_at: Date,
        updated_at: Date
    };
    categories: any = [];
    loading = false;
    modelProduct: any = {
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
        warranted_at: null,
        created_at: Date,
        updated_at: Date
    };
    itemId: any;
    bodyNote: any;
    partBodyNotes: any = {};
    paymentorder: any = {
        method: '1',
        paid: 0,
        store: {},
        excess_cash: 0,
        card: {}
    };
    deliveredorder: any = {
        order_id: '',
        store: {},
        customer: {},
        method: 'receive_at_store',
        products: [],
        total_price: 0,
        total_quantity: 0
    };
    storeLocal: any = [];
    metrics: any;
    metricSub: any = [];
    bodyNotesub: any;
    /** design attribute */
    designExtras: any[];
    designConfigs: any[];
    designAdvances: any[];
    dataConfig = {
        advances: [],
        designs: [],
        extras: []
    };
    checkedAll = false;
    productDelivered: any = [];
    keyHistories: any[];
    histories = [];
    cardsConfig: any = [];
    src = './assets/media/icons/v-1.svg';

    constructor(
        private orderService: OrderService,
        private productService: ProductService,
        private route: ActivatedRoute,
        private designService: DesignService,
        private helpers: Helpers,
        private designConfig: DesignConfig,
        private dateConfig: TypesUtilsService,
        private categoryService: CategoryService,
        private typeService: TypesUtilsService,
        private decimalPipe: DecimalPipe,
        private baseConfig: BaseConfig
    ) { }

    async ngOnInit() {
        try {
            this.helpers.openLoading();
            const orderId = this.route.snapshot.params.id;
            this.deliveredorder.order_id = orderId;
            const respone = await this.orderService.detail(orderId);
            if (respone.code) return swal.fire('Hệ Thống', respone.message, 'warning');
            this.storeLocal = JSON.parse(
                localStorage.getItem(
                    Storage.STORES
                )
            );
            this.cardsConfig = this.baseConfig.cardConfig;
            this.paymentorder.store = this.storeLocal[0];
            this.deliveredorder.store = this.storeLocal[0];
            this.model = respone.data;
            this.dataConfig.designs = await this.onLoadDesignConfig();
            this.dataConfig.advances = await this.onLoadDesignAdvances();
            this.dataConfig.extras = await this.onLoadDesignExtraConfig();
            const res = await this.categoryService.list({ skip: 0, limit: 100 } as any);
            this.categories = res.data || [];
            if (this.model.preview_process.two) {
                this.model.preview_process.two = new Date(this.model.preview_process.two * 1000);
            }
            if (this.model.preview_process.one) {
                this.model.preview_process.one = new Date(this.model.preview_process.one * 1000);
            }

            if (this.model.deadline) {
                this.model.deadline = new Date(this.model.deadline * 1000);
            }
            this.deliveredorder.customer = this.model.customer;
            this.model.products.forEach(product => {
                product.total_service_price = 0;
                if (product.service_price) {
                    Object.values(product.service_price).forEach(x => {
                        product.total_service_price += x;
                    });
                }
                product.hide = false;
                product.checked = false;
            });
            this.productDelivered = this.model.products.filter(x => x.status !== 'delivered');
            return this.model;
        } catch (ex) {
            /*begin:: write log ex here: break*/
            throw new Error(ex);
        } finally {
            this.helpers.closeLoading();
        }
    }

    onLoadDetailProduct = async (product) => {
        this.model.products.forEach(x => {
            if (x.id === product.id) {
                x.hide = !x.hide;
            } else {
                x.hide = false;
            }
        });
        const res = await this.productService.detail(product.id);
        if (res.code) return swal.fire('Hệ Thống', res.message, 'warning');
        this.modelProduct = res.data;
        this.modelProduct.note = product.note;
        this.modelProduct.category_name = await this.categories.find(x => x.id === this.modelProduct.category_id).name;
        this.histories = [];

        this.modelProduct.metrics = product.metrics;
        this.modelProduct.body_notes = product.body_notes;
        switch (this.modelProduct.category_id) {
            case 'V':
                switch (this.modelProduct.properties.gender) {
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
                switch (this.modelProduct.properties.gender) {
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
                switch (this.modelProduct.properties.gender) {
                    case 'male':
                        this.src = './assets/media/icons/g-1.svg';
                        break;
                    default:
                        break;
                }
                break;
            case 'D':
                switch (this.modelProduct.properties.gender) {
                    case 'female':
                        this.src = './assets/media/icons/dw-1.svg';
                        break;
                    default:
                        break;
                }
                break;
            case 'Q':
                switch (this.modelProduct.properties.gender) {
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
                switch (this.modelProduct.properties.gender) {
                    case 'female':
                        this.src = './assets/media/icons/zw-1.svg';
                        break;
                    default:
                        break;
                }
                break;
            case 'M':
                switch (this.modelProduct.properties.gender) {
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
        if (this.modelProduct) {
            const designData = this.handleEventLoadDesigns();
            // loading data default
            this.designConfigs = designData.designs;
            this.designAdvances = designData.advances;
            this.designExtras = designData.extras;
            if (this.model.type !== 'sale_available') {
                this.keyHistories = await this.productService.keyHistories();
                // transform histories
                const resHistory = await this.productService.histories(this.modelProduct.id);
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
                this.bodyNote = await this.designConfig.bodyNotes;
                this.bodyNote.forEach(bodynote => {
                    bodynote.values.forEach(value => {
                        let check = false;
                        if (this.modelProduct.body_notes) {
                            check = includes(this.modelProduct.body_notes[bodynote.key], value.id);
                        }
                        value.checked = check ? true : false;
                    });
                });
                this.bodyNotesub = this.bodyNote.map(x => {
                    return {
                        key: x.key,
                        categories: x.categories,
                        name: x.name,
                        values: x.values,
                        hide: false,
                        textValue: x.values.map(v => {
                            if (v.checked) return v.name.vi;
                        }).filter(c => c).toString()
                    };
                });
                this.metrics = await this.designConfig.metrics;

                this.metricSub = this.metrics.filter(x =>
                    includes(x.categories, this.modelProduct.category_id) &&
                    includes(x.genders, this.modelProduct.properties.gender)
                ).map(metric => {
                    let check = false;
                    if (this.modelProduct.metrics) {
                        check = includes(Object.keys(this.modelProduct.metrics), metric.id);
                    }
                    if (check) {
                        if (metric.input.total === 1) {
                            return {
                                key: metric.id,
                                short_key: metric.key,
                                name: metric.name.vi,
                                total_input: metric.input.total,
                                categories: metric.categories,
                                genders: metric.genders,
                                value: this.modelProduct.metrics[metric.id]
                            };
                        }
                        if (metric.input.total === 2) {
                            const key = this.modelProduct.metrics[metric.id].split('/');
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
            }
            this.designConfigs.forEach(x => {
                let check = false;
                if (this.modelProduct.design_styles) {
                    check = includes(Object.keys(this.modelProduct.design_styles), x.id);
                }
                if (check) {
                    x.values.forEach(value => {
                        if (value.id === this.modelProduct.design_styles[x.id][0].value) {
                            value.selected = true;
                        } else {
                            value.selected = false;
                        }
                    });
                }
            });
            const dsc = this.designConfigs[0].values.find(x => x.selected);
            this.onChangeDesign(dsc.hides[0], dsc.id);
            if (this.modelProduct.design_extras) {
                if (!this.modelProduct.design_extras.initials__text || this.modelProduct.design_extras.initials__text.length < 3) {
                    this.modelProduct.design_extras.initials__text = this.designExtras.find(x => x.id === 'initials__text').values;
                } else {
                    const data = this.designExtras.find(x => x.id === 'initials__text');
                    const value = data.values[0].values.find(x => x.selected);
                    value.text = this.modelProduct.design_extras.initials__text[2].value;
                    data.initials__text = value.text;

                }
            }

            this.designExtras = this.designExtras.map((x) => {
                /** check lv1 */
                const designExtrasKey = !this.modelProduct.design_extras ? [] : Object.keys(this.modelProduct.design_extras);
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
                        if (this.modelProduct.design_extras[checkLV1]) {
                            checkLV2 = !this.modelProduct.design_extras
                                ? false
                                : this.modelProduct.design_extras[checkLV1].find(keylv2 => keylv2.id === v.id);
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
                                const value = !this.modelProduct.design_extras || !checkLV1
                                    ? false
                                    : this.modelProduct.design_extras[checkLV1].find(f => f.id === v.id);
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

            this.designAdvances[0].values.forEach(advance => {
                const check = !this.modelProduct.design_advances
                    ? false
                    : includes(Object.keys(this.modelProduct.design_advances), advance.id);
                advance.checked = check ? true : false;
            });
        }
    }

    onRemoveProduct = (id) => {
        console.log(id);
    }

    onCancelledOrder = async () => {
        try {
            swal.fire({
                title: 'Thông báo',
                text: 'Bạn chắc chắn rằng mình hủy đơn hàng này không?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Tôi đồng ý!',
                cancelButtonText: 'Từ bỏ!'
            }).then(async (result) => {
                if (result.value) {
                    const res = await this.orderService.cancel(this.model.id);
                    if (res.code) return swal.fire('Hệ Thống', res.message, 'warning');
                    return swal.fire('Thành Công', 'Hủy đơn hàng thành công!', 'success'),
                        this.model.status = 'cancelled';
                }
            });
        } catch (ex) {
            console.log(ex);
        }
    }

    onUpdateDetailOrder = async () => {
        try {
            swal.fire({
                title: 'Thông báo',
                text: 'Bạn chắc chắn rằng mình muốn cập nhật đơn hàng này không?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Tôi đồng ý!',
                cancelButtonText: 'Từ bỏ!'
            }).then(async (result) => {
                if (result.value) {
                    const res = await this.orderService.update(this.model.id, this.model);
                    if (res.code) return swal.fire('Hệ Thống', res.message, 'warning');
                    return swal.fire('Thành Công', 'Cập nhật đơn hàng thành công!', 'success');
                }
            });
        } catch (ex) {
            console.log(ex);
        }
    }

    onChangeTotalPaid = (event) => {
        try {
            this.paymentorder.paid = event;
            this.paymentorder.excess_cash = this.paymentorder.paid - this.model.total_unpaid;
        } catch (ex) {
            console.log(ex);
        }
    }

    onPaymentOrder = async () => {
        try {
            if (this.paymentorder.paid <= 0) return swal.fire('Hệ Thống', 'Vui lòng kiểm tra số tiền thanh toán', 'warning');
            if (!this.paymentorder.store.id) return swal.fire('Hệ Thống', 'Vui lòng chọn cửa hàng thanh toán', 'warning');
            swal.fire({
                title: 'Thông báo',
                text: 'Xác nhận thanh toán?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Tôi đồng ý!',
                cancelButtonText: 'Từ bỏ!'
            }).then(async (result) => {
                if (result.value) {
                    if (this.paymentorder.paid > this.model.total_unpaid) {
                        this.paymentorder.paid = this.model.total_unpaid;
                    }
                    this.paymentorder.card = this.cardsConfig.find(x => x.name === this.paymentorder.card);
                    if (this.paymentorder.method !== '1' && !this.paymentorder.card) {
                        return swal.fire('Hệ Thống', 'Vui lòng chọn thẻ ngân hàng', 'warning');
                    }
                    const res = await this.orderService.payment(this.model.id, this.paymentorder);
                    if (res.code) return swal.fire('Hệ Thống', res.message, 'warning');
                    return swal.fire('Thành Công', res.message, 'success'),
                        this.ngOnInit();
                }
            });
        } catch (ex) {
            console.log(ex);
        }
    }

    printOrderDetail = async (model) => {
        try {
            let items = '';
            let totalPrice = '';
            let note = '';
            const rawFile = await $.get('./assets/template/k-print.html');
            model.products.forEach((item) => {
                items += `
            <tr>
                <td style="border:0.5px solid;border-top:none;border-right:none ;padding:1.5% 0;text-align: center;">
                    ${item.id}
                </td>
                <td style="border:0.5px solid;border-top:none;border-right:none ; text-align: center;padding:1.5% 0">
                    ${item.name}
                    </td>
                <td style="border:0.5px solid;border-top:none;border-right:none ; text-align: center;padding:1.5% 0">
                    ${this.decimalPipe.transform(item.total_before_discount)}
                    </td>
                <td style="border:0.5px solid;border-top:none;border-right:none ; text-align: center;padding:1.5% 0">
                    ${this.decimalPipe.transform(item.total_discount)}
                    </td>
                <td style="border:0.5px solid;border-top:none;border-right:none ; text-align: center;padding:1.5% 0">
                    ${item.total_quantity}
                    </td>
                <td style="border:0.5px solid;border-top:none;border-right:none ; text-align: center;padding:1.5% 0">
                    ${this.decimalPipe.transform(item.total_service_price)}
                    </td>
                <td style="border:0.5px solid;border-top:none; text-align: center;padding:1.5% 0">
                ${this.decimalPipe.transform(item.total_price)}
                    </td>
            </tr>`;
                note += `<li>
                ${item.order_id} / MV : ${item.id}
                <ul>
                    <li>
                        <p>${item.note.system || 'Không có ghi chú'}.</p>
                    </li>
                </ul>
            </li>`;

            });

            totalPrice = `
                <tr>
                <td><b>Tổng tiền hàng:</b></td>
                <td style="text-align:right; padding:10px"><b>${this.decimalPipe.transform(model.total_before_discount)}</b></td>
            </tr>
            <tr>
                <td><b>Giảm giá:</b></td>
                <td style="text-align:right; padding:10px"><b>${this.decimalPipe.transform(model.total_discount)}</b></td>
            </tr>
            <tr>
                <td><b>Đã thanh toán: </b></td>
                <td style="text-align:right; padding:10px"><b>${this.decimalPipe.transform(model.total_paid)}</b></td>
            </tr>
            <tr>
                <td><b>Còn lại: </b></td>
                <td style="text-align:right; padding:10px"><b>${this.decimalPipe.transform(model.total_unpaid)}</b></td>
            </tr>`;

            const PrintOrrder = `<div style="padding: 1%; font-size:0.8em;font-family:tahoma;">
            <div cellpadding="0" cellspacing="0" style="width:100%;border-bottom: 5px solid;">
                <div cellpadding="0" cellspacing="0" style="width: 70%;margin: 0 auto;margin-bottom: 15px;">
                    <img width="250" style="width: 100%;
                    margin: 0 auto" height="50" src="../../../../../assets/media/images/imgpsh_fullsize.png"
                        alt="Responsive image">
                </div>
            </div>
            <div style="width:100%; text-align:center">
            <h2>${model.type === 'sale_available' ? 'ĐƠN HÀNG BÁN LẺ' :
                    model.type === 'tailor' ? 'ĐƠN HÀNG MAY ĐO' :
                        model.type === 'tailor_at_home' ? 'ĐƠN HÀNG MAY ĐO TẠI NHÀ' :
                            model.type === 'service' ? 'ĐƠN HÀNG BẢO HÀNH SỬA CHỮA' :
                                model.type === 'uniform' ? 'ĐƠN ĐỒNG PHỤC' : 'CHƯA CẬP NHẬT'}</h2>
            </div>
            <div style="height: 10px;"></div>
            <table style="width:100%">
                <tr>
                    <td><b>${model.customer.name}</b></td>
                    <td style="text-align:right; padding-right:20px">
                    ${this.typeService.formatDate(model.created_at, 'DD/MM/YYYY hh:mm')}
                    </td>
                </tr>
                <tr>
                    <td><b>${model.customer.phone}</b></td>
                    <td style="text-align:right; padding-right:20px"><b>${model.id}</b></td>
                </tr>
            </table>
            <div style="height: 20px;"></div>
            <div style="text-align: center;width: 100%;">
            <table cellpadding="0" cellspacing="0" style="width:100%;font-size:0.7em">
                <tbody>
            <tr>
                <td style="width: 15%; text-align: center; border:0.8px solid ;border-right:none; padding:1.5% 0;"><strong>ID</strong></td>
                <td style="width: 20%; border:0.8px solid ;border-right:none; text-align: center;padding:1.5% 0"><strong>SP</strong></td>
                <td style="width: 20%; border:0.8px solid ;border-right:none; text-align: center;padding:1.5% 0"><strong>ĐG</strong></td>
                <td style="width: 15%; border:0.8px solid ;border-right:none; text-align: center;padding:1.5% 0"><strong>CK</strong></td>
                <td style="width: 5%; border:0.8px solid ;border-right:none; text-align: center;padding:1.5% 0"><strong>SL</strong></td>
                <td style="width: 15%; border:0.8px solid ;border-right:none; text-align: center;padding:1.5% 0"><strong>DV</strong></td>
                <td style="border:0.8px solid;text-align: center;padding:1.5% 0"><strong>TT</strong></td>
            </tr>
                    ${items}
                </tbody>
            </table>
        </div>
        <div style="height: 10px;"></div>
        <table style="width:100%;font-size:0.8em; border-bottom-width: 2px;">
            ${totalPrice}
        </table>
        <div style="height: 20px; width:100%;border-top-style: dotted"></div>
        <b>Chú thích sản phẩm</b>
        <ul style="width:100%;font-size:0.9em ;border-bottom-style: dotted;">
            ${note}
        </ul>
    </div>
    <div style="width:100%;border-bottom-style: dotted;padding-bottom:20px">
        <table>
            <tr>
                <td><b>Lịch hẹn: ${model.store.id}</b></td>
            </tr>
            <tr>
                <td>Lần 1: ${!model.preview_process ||
                    !model.preview_process.one
                    ? 'Chưa có'
                    : this.typeService.formatDate(model.preview_process.one, 'DD/MM/YYYY hh:mm')}</td>
            </tr>
        </table>
    </div>
    <div style="width:100%;padding-bottom:20px; padding-top:20px">
    <table>
            <tr>
                <td>
                    <b>
                        Đia chỉ: ${model.customer.address ? model.customer.address : 'Chưa cập nhật'}
                    </b>
                </td>
            </tr>
            <tr>
                <td>
                    <b>
                        Điện thoại : ${model.customer.phone ? model.customer.phone : 'Chưa cập nhật'}
                    </b>
                </td>
            </tr>
            <tr>
                <td>
                    <b>
                        Tư vấn : ${model.measure_process.complete_by ? model.measure_process.complete_by : 'Chưa cập nhật'}
                    </b>
                </td>
            </tr>
            <tr>
                <td>
                    <b>
                        Tài khoản: ${model.customer.phone
                    ? model.customer.phone
                    : 'Chưa cập nhật'}
                        / ${model.customer.phone ?
                    model.customer.phone.slice(model.customer.phone.length - 6, model.customer.phone.length)
                    : 'Chưa cập nhật'}
                    </b>
                </td>
            </tr>
        </table>
    </div>
    <div style="text-align:center">
        <hr style="border-top: 5px black solid ;">
        <i><b> Cám ơn quý khách. Hẹn gặp lại! </b></i>
    </div>
    `;
            const template = rawFile.replace(/{{PRINT}}/g, PrintOrrder);
            this.helpers.print(template);
        } catch (ex) {
            /*begin:: write log ex here: break*/
            throw new Error(ex);
        }
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
                ? respone.extras.map((x) => {
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

    onLoadDesignAdvances = async () => {
        try {
            let params;
            switch (this.model.type) {
                case 'tailor':
                    params = {
                        types: ['tailor']
                    };
                    break;
                case 'uniform':
                    params = {
                        types: ['tailor']
                    };
                    break;
                case 'service':
                    params = {
                        types: ['warranty']
                    };
                    break;
                default:
                    break;
            }
            /** load design advances config */
            const respone = await this.designService.listAdvances(params);
            const advances = respone.code ? [] : respone.advances;
            return advances;
        } catch (ex) {
            /*begin:: write log ex here: break*/
            console.log(ex);
            return [];
        }
    }

    handleEventLoadDesigns = () => {
        const categoryId = this.modelProduct.category_id;
        const gender = this.modelProduct.properties.gender;
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

    onConfirmOrder = async () => {
        try {
            swal.fire({
                title: 'Thông báo',
                text: 'Bạn muốn cập nhật trạng thái đơn hàng này không?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Tôi đồng ý!',
                cancelButtonText: 'Từ bỏ!'
            }).then(async (result) => {
                if (result.value) {
                    this.loading = true;
                    const res = await this.orderService.confirm(this.model.id, {});
                    if (res.code) return swal.fire('Hệ Thống', res.message, 'warning');
                    return swal.fire('Thành Công', 'Cập nhật đơn hàng thành công!', 'success'),
                        this.model.status = 'confirmed';
                }
            });
        } catch (ex) {
            console.log(ex);
        } finally {
            this.loading = false;
        }
    }

    onCompleteOrder = async () => {
        try {
            swal.fire({
                title: 'Thông báo',
                text: 'Bạn muốn hoàn thành đơn hàng này không?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Tôi đồng ý!',
                cancelButtonText: 'Từ bỏ!'
            }).then(async (result) => {
                if (result.value) {
                    if (this.model.total_unpaid > 0) return swal.fire('Hệ Thống', 'Đơn hàng chưa được thanh toán hết', 'warning');
                    if (this.productDelivered.length) return swal.fire('Hệ Thống', 'Sản phẩm chưa được giao hàng', 'warning');
                    const res = await this.orderService.complete(this.model.id, {});
                    if (res.code) return swal.fire('Hệ Thống', res.message, 'warning');
                    return swal.fire('Thành Công', 'Cập nhật đơn hàng thành công!', 'success'),
                        this.model.status = 'completed';
                }
            });
        } catch (ex) {
            console.log(ex);
        }
    }

    onCheckPaymentHistory = (value) => {
        try {
            switch (value) {
                case 1:
                    return 'Thanh toán tiền mặt';
                    break;
                case 2:
                    return 'Thanh toán quẹt thẻ';
                    break;
                case 3:
                    return 'Thanh toán thẻ nội địa';
                    break;
                case 4:
                    return 'Thanh toán thẻ VISA MASTER CARD';
                    break;
                default:
                    break;
            }
        } catch (ex) {
            console.log(ex);
        }
    }

    onCheckDeliveryHistory = (value) => {
        switch (value) {
            case 'receive_at_store':
                return 'Nhận tại cửa hàng';
                break;
            case 'ship_cod':
                return 'SHIP COD';
                break;
            default:
                break;
        }
    }

    onSelectProductDelivered = (value) => {
        try {
            const item = this.model.products.find(x => x.id === value.id);
            item.checked = !item.checked;
            const check = this.model.products.filter(x => x.checked === false);
            if (check.length !== 0) {
                this.checkedAll = false;
            } else {
                this.checkedAll = true;
            }
        } catch (ex) {
            console.log(ex);
        }
    }

    onSelectAllProduct = () => {
        try {
            this.checkedAll = !this.checkedAll;
            this.model.products.forEach(product => {
                product.checked = this.checkedAll;
            });
        } catch (ex) {
            console.log(ex);
        }
    }

    onDeliveredOrder = async () => {
        try {
            if (!this.deliveredorder.store.id) return swal.fire('Hệ Thống', 'Vui lòng chọn cửa hàng giao hàng', 'warning');
            this.deliveredorder.total_price = 0;
            this.model.products.forEach(x => {
                if (x.checked) this.deliveredorder.products.push(x.id);
                this.deliveredorder.total_price += x.total_price;
                this.deliveredorder.total_quantity += x.total_quantity;
            });
            if (this.deliveredorder.products.length === 0) {
                return swal.fire('Hệ Thống', 'Vui lòng chọn sản phẩm cần giao cho khác.', 'warning');
            }
            swal.fire({
                title: 'Thông báo',
                text: 'Xác nhận gửi hàng?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Tôi đồng ý!',
                cancelButtonText: 'Từ bỏ!'
            }).then(async (result) => {
                if (result.value) {
                    const res = await this.orderService.delivered(this.deliveredorder);
                    if (res.code) return swal.fire('Hệ Thống', res.message, 'warning');
                    return swal.fire('Thành Công', res.message, 'success'), this.ngOnInit();
                }
            });
        } catch (ex) {
            console.log(ex);
        }
    }

    onChangeStoreType = (value, type?) => {
        try {
            if (type === 'payment') {
                this.paymentorder.store = this.storeLocal.find(x => x.id === value);
            }
            if (type === 'delivered') {
                this.deliveredorder.store = this.storeLocal.find(x => x.id === value);
            }
        } catch (ex) {
            console.log(ex);
        }
    }

    transformDate = (date: any) => {
        return this.dateConfig.formatDate(date, 'DD/MM/YYYY hh:mm');
    }

    transformStatusOrder = (status: any) => {
        return OrderNormalStatuses[status.toUpperCase()];
    }

    transformStatusProduct = (status: any) => {
        return ProductNormalStatuses[status.toUpperCase()];
    }

    onPrintOrder = async () => {
        this.printOrderDetail(this.model);
    }

    onSelectAdvance = (advanceId: string, optionId: string) => { };

    onChangeTextMetrics = (value, ix, input?) => { };

    onSelectBodyNote = (event) => { };

    onChangeExtra = (extraId: string, valueId: string, subValueId?: string) => { };

    onChangeInitialText = (event) => { };
}
