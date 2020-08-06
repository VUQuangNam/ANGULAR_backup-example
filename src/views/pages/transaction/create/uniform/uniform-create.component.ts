import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

import { ProductService, OrderService, DesignService, StoreService, VoucherService } from 'src/common/services';
import { Helpers, TypesUtilsService } from 'src/common/utils';
import { Storage, Order } from 'src/common/models';
import { DesignConfig, BaseConfig } from 'src/config';

@Component({
    selector: '.dunnio-warpper .dunnio-body .dunnio-grid .dunnio-grid--ver',
    templateUrl: './uniform-create.component.html',
    styleUrls: ['./style.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        ProductService,
        OrderService,
        DesignService,
        StoreService,
        TypesUtilsService,
        VoucherService
    ]
})

export class OrderCreateUniformComponent implements OnInit {
    constructor(
        private prorductServive: ProductService,
        private helper: Helpers,
        private router: Router,
        private orderService: OrderService,
        private designService: DesignService,
        private storeService: StoreService,
        private designConfig: DesignConfig,
        private typeService: TypesUtilsService,
        private baseConfig: BaseConfig,
        private voucherService: VoucherService
    ) {
        this.storeLocal = JSON.parse(
            localStorage.getItem(
                Storage.STORES
            )
        );
        this.onLoadModel();
    }

    /** variable */
    carts = [];
    serviceStores: any = [];
    keypress: any;
    loading = {
        customer: false,
        giftcode: false,
        employee: false,
        item: false
    };

    model: any = {};
    itemId: string;
    storeLocal: any[];
    dataConfig = {
        advances: [],
        designs: [],
        extras: []
    };
    metrics: any = [];
    items: any = [];
    discountRank = 0;
    isVoucher = false;
    cardsPayment: any[];
    isDiscount = false;
    rank: any = {
        point: true,
        value: 0,
        price: 0
    };
    async ngOnInit() {
        const stores = await this.storeService.list({
            skip: 0,
            limit: 100
        });
        this.serviceStores = stores.data || [];
        this.cardsPayment = this.baseConfig.cardConfig;
        await this.onLoadDesign();
        const user = await JSON.parse(localStorage.getItem('user'));
        this.model.store = this.storeLocal[0];
        this.model.created_by = {
            id: user.id,
            name: user.name
        };
        await this.generateCart();
        this.metrics = await this.designConfig.metrics;
    }

    onLoadModel = () => {
        this.model = {
            name: '',
            type: 'uniform',
            images: [],
            note: {
                customer: '',
                system: ''
            },

            // owner and customer
            store: this.storeLocal[0],
            customer: null,
            products: [],

            // process management
            status: '',
            deadline: null,
            receive_process: {
                date: null,
                id: this.storeLocal[0].id
            },
            preview_process: {
                one: null,
                two: null,
                address: this.storeLocal[0].id
            },
            measure_process: {
                complete_by: null,
                complete_at: null,
                scheduled_at: null,
                point: 0
            },
            consult_process: {
                complete_by: null,
                complete_at: null,
                point: 0
            },

            // payment management
            currency: 'VND',
            total_price: 0,
            total_discount: 0,
            total_price_discount: 0,
            payment_method: 1,
            total_unpaid: 0,
            total_paid: 0,
            source: 'store',
            discount_type: 1,
            promotion_type: '1',
            discount_value: 0,
            discounts: [],
            parts: [],
            created_by: {
                id: '',
                name: ''
            },
            total_quantity: 0,
            created_at: Date.now(),
            updated_at: Date.now(),
            metricsHistory: [],
            itemsLocal: [],
            itemsMale: [],
            itemsFemale: [],
            giftcode: {
                id: '',
                key: '',
                discount_type: 1,
                value: 0
            },
            isValueGiftCode: '',
            discount: {
                discount: true,
                value: 0,
                price: 0
            },
            point: {
                value: 0
            },
            payments: {
                price: {
                    method: 1,
                    value: 0,
                    value2: 0,
                    active: false,
                    cart: {}
                },
                point: {
                    value: 0,
                    active: false
                }
            },
        };
    }

    onCheckEvent = async (value) => {
        switch (value.type) {
            case 'onChangeTab':
                await this.onChangeTab(value.data);
                break;
            case 'generateCart':
                await this.generateCart();
                break;
            case 'onRemoveCart':
                await this.onRemoveCart(value.data);
                break;
            case 'onConfirmCartInfo':
                await this.onConfirmCartInfo();
                break;
            case 'onUpdateItem':
                await this.onOpenUpdateItem(value.data);
                break;
            case 'handleEventReloadCartPayment':
                await this.handleEventReloadCartPayment(value.data);
                break;
            default:
                break;
        }

    }

    generateCart = async () => {
        try {
            this.helper.openLoading();
            /** when open view we'll auto create default one cart */
            let nameCart;
            if (this.carts.length > 3) {
                return swal.fire(
                    'Hệ thống',
                    'Chỉ được tạo tối đa 4 đơn hàng cùng lúc.',
                    'warning'
                );
            }
            if (!this.carts.length) {
                nameCart = 'Đơn hàng 1';
            } else {
                const name = this.carts[this.carts.length - 1].name;
                const value = + name.split(' ')[2] + 1;
                nameCart = 'Đơn hàng ' + value;
            }
            const defaultData = {
                name: nameCart,
                type: 'uniform',
                payment_method: 1,
                source: 'store',
                created_by: {
                    id: this.model.created_by.id,
                    name: this.model.created_by.name
                },
                note: {
                    system: '',
                    customer: ''
                },
                store: this.storeLocal[0],
                device: 'chrome',
                promotion_type: '1',
                measure_process: {
                    complete_by: null,
                    complete_at: null,
                    scheduled_at: null,
                    point: 0
                },
                consult_process: {
                    complete_by: null,
                    complete_at: null,
                    point: 0
                },
                preview_process: {
                    one: null,
                    two: null,
                    address: this.storeLocal[0].id
                },
                receive_process: {
                    date: null,
                    id: this.storeLocal[0].id
                },
                discounts: [],
                isValueDiscount: 0,
                discountsparts: [],
                total_quantity: 0,
                dataImport: [],
                itemsLocal: [],
                itemsMale: [],
                itemsFemale: [],
                giftcode: {
                    id: '',
                    key: '',
                    discount_type: 1,
                    value: 0
                },
                isValueGiftCode: '',
                discount: {
                    discount: true,
                    value: 0,
                    price: 0
                },
                point: {
                    value: 0
                },
                payments: {
                    price: {
                        method: 1,
                        value: 0,
                        value2: 0,
                        active: false,
                        cart: {}
                    },
                    point: {
                        value: 0,
                        active: false
                    }
                },
            };

            this.carts.push(defaultData);
            return await this.onChangeTab(nameCart);
        } catch (ex) {
            console.log(ex);
        } finally {
            this.helper.closeLoading();
        }
    }

    onChangeTab = async (name) => {
        try {
            /** set defafult cart on first load */
            this.model = this.carts.find(
                x => x.name === name
            ) as Order;

            this.model.products = this.model.products || [];

            return await this.model;
        } catch (ex) {
            console.log(ex);
        }
    }

    onRemoveCart = async (name: string) => {
        swal.fire({
            title: 'Cảnh Báo',
            text: 'Tất cả dữ liệu của đơn hàng sẽ không được lưu lại. Bạn có chắc chắn muốn đóng không?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Tôi đồng ý!',
            cancelButtonText: 'Từ bỏ!'
        }).then(async result => {
            try {
                if (result.value) {
                    this.helper.openLoading();

                    /** remove cart in client */
                    const lastIndexOf = this.carts.lastIndexOf(
                        this.carts.find(x => x.name === name)
                    );
                    this.carts = this.carts.filter(
                        x => x.name !== this.model.name
                    );
                    const totalOrders = this.carts.length;

                    if (lastIndexOf || totalOrders) {
                        this.model = lastIndexOf
                            ? this.carts[lastIndexOf - 1]
                            : this.carts[lastIndexOf];
                    } else {
                        await this.generateCart();
                    }
                }
            } catch (ex) {
                /*begin:: write log ex here: break*/
                return console.log(ex),
                    swal.fire('Hệ Thống', 'Có lỗi xảy ra. Xin vui lòng kiểm tra lại kết nối mạng.!', 'warning');
            } finally {
                this.helper.closeLoading();
            }
        });
    }

    onAddProduct = () => {
        try {
            const finallyProduct = [];
            const dataImportMale = this.model.dataImport.filter(x => x.GT === 'Nam');
            const dataImportFemale = this.model.dataImport.filter(x => x.GT === 'Nu');
            if (dataImportMale.length && this.model.itemsMale.length) {
                dataImportMale.forEach(x => {
                    for (let index = 0; index < x.total_quantity; index++) {
                        this.model.itemsMale.forEach((item) => {
                            const value = item;
                            value.metrics = x.metrics;
                            value.owner = {
                                id: x.id,
                                name: x.HO_TEN,
                                phone: x.SDT
                            };
                            if (x.GHI_CHU_CO_THE) {
                                value.note.body_note = x.GHI_CHU_CO_THE;
                            }
                            switch (item.category_id) {
                                case 'V':
                                    value.note.system = x.GHI_CHU_VEST;
                                    break;
                                case 'Q':
                                    value.note.system = x.GHI_CHU_QUAN;
                                    break;
                                case 'G':
                                    value.note.system = x.GHI_CHU_GILE;
                                    break;
                                case 'S':
                                    value.note.system = x.GHI_CHU_SOMI;
                                    break;
                                case 'Z':
                                    value.note.system = x.GHI_CHU_ZUYP;
                                    break;
                                case 'ZV':
                                    value.note.system = x.GHI_CHU_VAY;
                                    break;
                                case 'M':
                                    value.note.system = x.GHI_CHU_MANGTO;
                                    break;
                                case 'D':
                                    value.note.system = x.GHI_CHU_DAM;
                                    break;
                                default:
                                    break;
                            }
                            value.group = 'product';
                            finallyProduct.push(value);
                        });
                    }
                });
            }

            if (dataImportFemale.length && this.model.itemsFemale.length) {
                dataImportFemale.forEach(x => {
                    for (let index = 0; index < x.total_quantity; index++) {
                        this.model.itemsFemale.forEach(item => {
                            const value = item;
                            value.metrics = x.metrics;
                            value.owner = {
                                id: x.id,
                                name: x.HO_TEN,
                                phone: x.SDT
                            };
                            if (x.GHI_CHU_CO_THE) {
                                value.note.body_note = x.GHI_CHU_CO_THE;
                            }
                            switch (item.category_id) {
                                case 'V':
                                    value.note.system = x.GHI_CHU_VEST;
                                    break;
                                case 'Q':
                                    value.note.system = x.GHI_CHU_QUAN;
                                    break;
                                case 'G':
                                    value.note.system = x.GHI_CHU_GILE;
                                    break;
                                case 'S':
                                    value.note.system = x.GHI_CHU_SOMI;
                                    break;
                                case 'Z':
                                    value.note.system = x.GHI_CHU_ZUYP;
                                    break;
                                case 'ZV':
                                    value.note.system = x.GHI_CHU_VAY;
                                    break;
                                case 'M':
                                    value.note.system = x.GHI_CHU_MANGTO;
                                    break;
                                case 'D':
                                    value.note.system = x.GHI_CHU_DAM;
                                    break;
                                default:
                                    break;
                            }
                            value.group = 'product';
                            finallyProduct.push(value);
                        });
                    }
                });
            }

            return finallyProduct;
        } catch (ex) {
            console.log(ex);

        }
    }

    async parseItems(items) {
        const promies = items.map((item, ix) => this.createItem(item, ix));
        return Promise.all(promies);
    }

    async createItem(v, ix) {
        v.service_price = {};
        if (v.design_advances) {
            let dataServicePrice;
            dataServicePrice = Object.values(v.design_advances).map(a => {
                return a[0];
            });
            dataServicePrice.forEach(value => {
                v.service_price[value.id] = value.price;
            });
        }
        if (v.design_extras) {
            let designExtras;
            designExtras = Object.values(v.design_extras).map(a => {
                return a[1];
            });
            designExtras.filter(de => de).forEach(value => {
                v.service_price[value.id] = value.price;
            });
        }
        v.id = v.id.slice(0, 3) + ix;
        const result = await this.prorductServive.create(v);
        result.data.metrics = v.metrics;
        result.data.owner = v.owner;
        result.data.total_quantity = v.total_quantity;
        result.data.total_before_discount = v.total_price;
        result.data.note = v.note;
        result.data.total_price = v.total_price;
        return result.data;
    }

    onConfirmCartInfo = async () => {
        if (!this.model.customer) {
            return swal.fire(
                'Cảnh Báo',
                'Vui lòng chọn khách hàng',
                'warning'
            );
        }
        if (!this.model.total_quantity) {
            return swal.fire(
                'Cảnh Báo',
                'Vui lòng chọn sản phẩm',
                'warning'
            );
        }
        try {
            /** confirm order */
            this.helper.openLoading();
            const product = await this.onAddProduct();
            const data = await this.parseItems(product);
            this.model.products = data;
            const respone = await this.orderService.create(this.model);
            if (respone.code) {
                return swal.fire(
                    'Hệ thống',
                    respone.message,
                    'warning'
                );
            }
            /** redirect */
            swal.fire({
                title: 'Chuyển Thanh Toán',
                text: 'Bạn có muốn chuyển sang màn hình chi tiết bây giờ?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Chuyển Luôn!',
                cancelButtonText: 'Để Sau!'
            }).then(async result => {
                if (result.value) {
                    return this.router.navigateByUrl(
                        `/orders/${respone.data.id}`
                    );
                } else {
                    /** remove cart in client */
                    const lastIndexOf = this.carts.lastIndexOf(
                        this.carts.find(x => x.id === this.model.id)
                    );
                    this.carts = this.carts.filter(
                        x => x.id !== this.model.id
                    );
                    const totalOrders = this.carts.length;

                    if (lastIndexOf || totalOrders) {
                        this.model = lastIndexOf
                            ? this.carts[lastIndexOf - 1]
                            : this.carts[lastIndexOf];
                    } else {
                        await this.generateCart();
                    }
                }

            });
        } catch (ex) {
            /*begin:: write log ex here: break*/
            throw new Error(ex);
        } finally {
            this.helper.closeLoading();
        }
    }

    handleEventReloadCartPayment = (discount?) => {
        this.model.total_before_discount = 0;
        this.model.total_coin = 0;
        this.model.total_point = 0;
        this.model.total_price = 0;
        this.model.total_paid = this.model.total_paid || 0;
        this.model.total_unpaid = 0;
        this.model.total_discount_point = 0;
        this.model.total_discount = 0;
        this.model.total_quantity = 0;
        if (discount) {
            if (discount.type === 'rank') {
                this.discountRank = discount.value;
                console.log('ok rank');
            }
        }
        const male = this.model.dataImport.filter(x => x.GT === 'Nam');
        const female = this.model.dataImport.filter(x => x.GT === 'Nu');
        let totalQuantityMale = 0;

        male.map(x => {
            totalQuantityMale += x.total_quantity;
        });

        let priceQuantityMale = 0;
        this.model.itemsMale.map(x => {
            priceQuantityMale += x.total_price_discount;
        });

        let totalQuantityFemale = 0;
        female.map(x => {
            totalQuantityFemale += x.total_quantity;
        });

        let priceQuantityFemale = 0;
        this.model.itemsFemale.map(x => {
            priceQuantityFemale += x.total_price_discount;
        });

        this.model.total_quantity = totalQuantityFemale * this.model.itemsFemale.length + totalQuantityMale * this.model.itemsMale.length;
        this.model.total_before_discount = priceQuantityMale * totalQuantityMale + priceQuantityFemale * totalQuantityFemale;
        this.model.total_point = Math.round(this.model.total_before_discount * 0.15 / 100);

        this.model.total_price = this.model.total_before_discount;

        if (this.model.discount.discount === false && this.model.promotion_type === '1') {
            this.model.total_discount = this.model.total_before_discount * this.model.discount.value / 100;
            this.model.discount_type = 1;
            this.model.total_price = this.model.total_before_discount - this.model.total_discount;
            this.model.discount.price = this.model.total_before_discount * this.model.discount.value / 100;
        }

        if (this.model.discount.discount === true && this.model.promotion_type === '1') {
            this.model.total_discount = this.model.discount.value;
            this.model.discount_type = 2;
            this.model.total_price = this.model.total_before_discount - this.model.total_discount;
            this.model.discount.price = this.model.discount.value;
        }
        if (this.isVoucher) {
            if (this.model.giftcode.discount_type === 1) {
                this.model.total_discount = this.model.total_before_discount * this.model.giftcode.discount_value / 100;
                this.model.discount_type = 1;
                this.model.total_price = this.model.total_before_discount - this.model.total_discount;
                this.model.discount.price = Math.round(this.model.total_before_discount * this.model.giftcode.discount_value / 100);
            }

            if (this.model.giftcode.discount_type === 2) {
                this.model.total_discount = this.model.giftcode.discount_value;
                this.model.discount_type = 2;
                this.model.total_price = this.model.total_before_discount - this.model.total_discount;
                this.model.discount.price = this.model.giftcode.discount_value;
            }
        }
        this.model.total_discount_point = this.model.point.value * 10;

        this.model.total_coin = this.model.point.value;
        this.model.total_discount = this.model.total_discount + this.model.total_before_discount * this.discountRank / 100;
        this.rank.price = Math.round(this.model.total_price * this.discountRank / 100);
        this.model.total_price = this.model.total_price
            - (this.model.total_price * this.discountRank / 100)
            - this.model.total_discount_point;

        this.model.total_unpaid = this.model.total_paid - this.model.total_price;

        if (this.model.total_unpaid < 0) {
            this.model.total_unpaid = -this.model.total_unpaid;
        } else {
            this.model.total_unpaid = 0;
        }
        return this.model;
    }


    handleEventCheckGitcode = (giftcode) => {
        try {
            const newDate = new Date().getTime();
            if (giftcode.apply_started_at) {
                if (newDate < giftcode.apply_started_at * 1000) {
                    swal.fire('Thông báo',
                        'Voucher chưa được áp dụng từ ngày ' + this.typeService.formatDate(
                            giftcode.apply_started_at,
                            'DD/MM/YYYY hh:mm'
                        ),
                        'warning');
                    return false;
                }
            }
            if (giftcode.apply_expired_at) {
                if (newDate > giftcode.apply_expired_at * 1000) {
                    swal.fire('Thông báo',
                        'Voucher đã hết hạn từ ngày ' + this.typeService.formatDate(
                            giftcode.apply_started_at,
                            'DD/MM/YYYY hh:mm'
                        ),
                        'warning');
                    return false;
                }
            }
            // if (!giftcode.apply_max_quantity) {
            //     swal.fire('Thông báo',
            //         'Số lượng phát hành ra đã sử dụng hết ',
            //         'warning');
            //     return false;
            // }
            // if (!giftcode.apply_maximal_usage) {
            //     swal.fire('Thông báo',
            //         'Số lần sử dụng Voucher này của bạn đã hết',
            //         'warning');
            //     return false;
            // }
            // if (giftcode.apply_min_price) {
            //     if (giftcode.apply_min_price > this.model.total_before_discount) {
            //         swal.fire('Thông báo',
            //             'Voucher áp dụng cho đơn hàng tối thiểu ' + this.currencyConfig.transform(giftcode.apply_min_price),
            //             'warning');
            //         return false;
            //     }
            // }
            // if (giftcode.apply_max_price) {
            //     if (giftcode.apply_max_price > this.model.total_before_discount) {
            //         swal.fire('Thông báo',
            //             'Voucher áp dụng cho đơn hàng tối đa ' + this.currencyConfig.transform(giftcode.apply_max_price),
            //             'warning');
            //         return false;
            //     }
            // }
            // if (!giftcode.apply_for_store || !giftcode.apply_for_store.length) {
            //     return true;
            // }
            // if (giftcode.apply_for_store.length) {
            //     const store = giftcode.apply_for_store.find(x => x === this.model.store.id);
            //     if (store) return true;
            //     swal.fire('Thông báo',
            //         'Voucher không áp dụng cho chi nhánh ' + this.model.store.name,
            //         'warning');
            //     return false;
            // }
            // if (!giftcode.apply_for_customer || !giftcode.apply_for_customer.length) {
            //     return true;
            // }
            // if (!giftcode.apply_for_customer || !giftcode.apply_for_customer.length) {
            //     const customer = giftcode.apply_for_customer.find(x => x === this.model.customer.id);
            //     if (customer) return true;
            //     swal.fire('Thông báo',
            //         'Voucher không áp dụng cho chi nhánh ' + this.model.customer.name,
            //         'warning');
            //     return false;
            // }
            return true;
        } catch (ex) {
            console.log(ex);
        }

    }

    onSelectStore = () => {
        return true;
    }

    onSelectItem = async (target: any = {}) => {
        try {
            console.log(target.item);
            if (!target.name || !target.item) return;
            this.helper.openLoading();
            const detail = target.item;

            /** checking item not exist in model */
            const item = this.model.itemsLocal.find(
                x => x.id === detail.id
            );
            if (item) return false;
            this.model = this.carts.find(x => x.name === target.name);
            if (this.model) {
                this.model.itemsLocal.push({
                    id: detail.id,
                    name: detail.name,
                    type: detail.type,
                    images: detail.images || [],
                    properties: detail.properties,
                    category_id: detail.category_id,
                    category_two_id: detail.category_two_id,
                    category_three_id: detail.category_three_id,
                    fabric: detail.fabric,
                    design_styles: detail.design_styles,
                    design_extras: detail.design_extras,
                    design_advances: detail.design_advances,
                    owner: detail.owner,
                    note: detail.note,
                    metrics: detail.metrics || {},
                    body_notes: detail.body_notes || {},
                    // payment
                    price: detail.price,
                    currency: detail.currency,
                    total_price: detail.price,
                    total_discount: detail.total_discount || 0,
                    total_service_price: detail.total_service_price || 0,
                    total_price_discount: detail.price,
                    total_quantity: 1,
                    // process
                    status: 'pending',
                    deadline: new Date(),
                    parts: detail.parts,
                    measure_process: {
                        complete_by: this.model.measure ? this.model.measure.id : null,
                        complete_at: this.model.measure ? new Date() : null,
                        point: 0
                    },
                });
            }
        } catch (ex) {
            /*begin:: write log ex here: break*/
            throw new Error(ex);
        } finally {
            this.model.itemsMale = this.model.itemsLocal.filter(x => x.properties.gender === 'male');
            this.model.itemsFemale = this.model.itemsLocal.filter(x => x.properties.gender === 'female');
            if (this.model.dataImport.length !== 0 && this.model.itemsLocal.length) {
                this.handleEventReloadCartPayment();
            }
            this.helper.closeLoading();
        }
    }

    onLoadDesign = async () => {
        this.dataConfig.designs = await this.onLoadDesignConfig();
        this.dataConfig.advances = await this.onLoadDesignAdvances();
        this.dataConfig.extras = await this.onLoadDesignExtraConfig();
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
            /** load design advances config */
            const respone = await this.designService.listAdvances({ types: 'tailor' });
            const advances = respone.code ? [] : respone.advances;
            return advances;
        } catch (ex) {
            /*begin:: write log ex here: break*/
            console.log(ex);
            return [];
        }
    }

    onOpenUpdateItem = (event) => {
        this.itemId = event.itemId;
        ($('#dunnio_detail_item_uniform') as any).modal('show');
    }

    onUpdateItem = async (event) => {
        try {
            this.helper.openLoading();
            let data = this.model.itemsLocal.find(x => x.id === event.id);
            data = event.item;
            return this.handleEventReloadCartPayment();
        } catch (ex) {
            /*begin:: write log ex here: break*/
            throw new Error(ex);
        } finally {
            this.helper.closeLoading();
        }
    }

    onChangecardsPayment = (card) => {
        this.model.payments.price.card = card;
    }

    onClickPayment = (method) => {
        try {
            this.model.payments.price.active = true;
            this.model.payments.price.method = method;
            this.model.payments.price.value = this.model.payments.price.value2;
            if (method !== 1) {
                this.model.payments.price.card = this.cardsPayment[0];
            } else {
                this.model.payments.price.card = {};
            }
        } catch (ex) {
            console.log(ex);
        }
    }
    onChangeTotalPaid = (value) => {
        try {
            if (value) {
                this.model.payments.price.value2 = + value;
            } else {
                this.model.payments.price.value2 = 0;
            }
        } catch (ex) {
            console.log(ex);
        }
    }

    handleEventPayment = () => {
        try {
            this.model.total_paid = this.model.payments.price.value;
            if (this.model.payments.point.active) {
                this.model.point.value = this.model.payments.point.value || 0;
            } else {
                this.model.point.value = 0;
            }
            this.handleEventReloadCartPayment();
        } catch (ex) {
            console.log(ex);
        }
    }

    onChangePointAction = () => {
        this.model.payments.point.active = !this.model.payments.point.active;
    }


    onChangeTextDiscount = (event) => {
        try {
            this.model.isValueDiscount = event;
            this.model.discount = {
                discount: this.isDiscount,
                value: event
            };
            this.handleEventReloadCartPayment();
        } catch (ex) {
            console.log(ex);
        }
    }

    handleEventRemoveMethod = () => {
        this.model.payments.price.active = false;
        this.model.payments.price.value = 0;
    }

    onChangeTextPoint = (event) => {
        try {
            if (event > this.model.customer.total_point) {
                swal.fire('Hệ thống', 'Điểm tích lũy không đủ', 'warning');
                this.model.payments.point.value = this.model.customer.total_point;
            } else {
                this.model.payments.point.value = event;
            }
        } catch (ex) {
            console.log(ex);
        } finally {
            console.log(this.model.payments.point.value);
        }
    }

    onSearchGiftCode = (value) => {
        try {
            clearTimeout(this.keypress);
            this.keypress = setTimeout(
                async () => {
                    try {
                        if (!value) return;
                        const respone = await this.voucherService.detail(value);
                        if (respone.code !== 0) return swal.fire('Hệ thống', 'Mã giftcode không tồn tại', 'warning');
                        this.model.giftcode = respone.code ? {} : respone.data;
                        if (this.model.giftcode) {
                            this.model.isValueGiftCode = this.model.giftcode.discount_value;
                            this.model.isValueGiftCode += this.model.giftcode.discount_type === 2 ? 'VNĐ' : '%';
                            this.isVoucher = this.handleEventCheckGitcode(this.model.giftcode);
                            if (!this.isVoucher) this.model.isValueGiftCode = '';
                            if (this.isVoucher) this.handleEventReloadCartPayment();
                        }
                    } catch (ex) {
                        console.log(ex);
                    }
                }, 1000);
        } catch (ex) {
            console.log(ex);
        }
    }

    onChangePromotionType = () => {
        this.model.discount.value = 0;
        this.model.discount.price = 0;
        this.model.giftcode.id = '';
        this.model.giftcode.key = '';
        this.model.giftcode.discount_value = 0;
        this.model.isValueGiftCode = '';
        this.isVoucher = false;
        this.handleEventReloadCartPayment();
    }
    onChangeDiscount = (value) => {
        try {
            this.model.isValueDiscount = 0;
            this.isDiscount = value;
            this.model.discount = {
                discount: value,
                value: 0
            };
            this.model.discount_value = 0;
            this.handleEventReloadCartPayment();
        } catch (ex) {
            console.log(ex);
        }
    }

}

