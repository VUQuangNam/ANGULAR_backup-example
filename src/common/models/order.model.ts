import { FilterModel, FilterInputTypes } from './filter.module';
import { Storage } from './storage.model';

export enum OrderStatuses {
    PENDING = 'pending',
    PROCESSING = 'processing',
    REJECTED = 'rejected',
    CANCELLED = 'cancelled',
    CONFIRMED = 'confirmed',
    COMPLETED = 'completed'
}

export enum OrderNormalStatuses {
    PENDING = 'Chờ duyệt',
    CONFIRMED = 'Đã duyệt',
    PROCESSING = 'Đang sản xuất',
    COMPLETED = 'Đã hoàn thành',
    CANCELLED = 'Đã hủy'
}

export enum PaymentStatuses {
    UNPAID = 'Chưa thanh toán hết',
    PAID = 'Đã thanh toán hết'
}

export class Order {
    // attributes
    id: string;
    name: string;
    type: string;
    images: [string];
    note: {
        system: string,
        customer: string,
        body: string
    };

    // owner and customer
    store: {
        id: string,
        name: string,
        phone: string,
        address: string
    };
    customer: {
        id: string,
        name: string,
        phone: string,
        address: string
    };

    // process management
    status: string;
    deadline: Date;
    'measure_process': {
        complete_by: string,
        complete_at: Date,
        scheduled_at: Date,
        point: number
    };
    'consult_process': {
        complete_by: string,
        complete_at: Date,
        point: number
    };
    'receive_process': {
        date: string,
        address: string,
    };
    'preview_process': {
        one: Date,
        two: Date,
        three: Date,
        address: string,
    };

    // payment management
    currency: string;
    'total_before_discount': number;
    'total_coin': number;
    'total_point': number;
    'total_price': number;
    'total_discount': number;
    'total_paid': number;
    'total_unpaid': number;
    'payment_method': number;
    'shipping_method': number;

    // addintional
    products: [object];
    payments: [object];
    deliveries: [object];
    discounts: [object];

    // manager
    source: string;
    device: string;
    'is_active': boolean;
    'created_by': {
        id: string,
        name: string
    };
    'created_at': Date;
    'updated_at': Date;


    /**
     * Get table collums
     * @public
     */
    public get collums(): Array<any> {
        return [
            {
                id: 'id',
                name: 'Mã đơn hàng',
                width: 200,
                active: true,
                type: 'link',
                to: 'orders',
            },
            {
                id: 'created_at',
                name: 'Ngày tạo đơn',
                width: 150,
                active: true,
                type: 'text',
            },
            {
                id: 'customer',
                name: 'Tên khách hàng',
                width: 150,
                active: true,
                type: 'object',
                index: 'name',
            },
            {
                id: 'total_price',
                name: 'Tổng tiền',
                width: 150,
                active: true,
                type: 'number',
            },
            {
                id: 'total_discount',
                name: 'Giảm giá',
                width: 150,
                active: true,
                type: 'number',
            },
            {
                id: 'total_paid',
                name: 'Đã thanh toán',
                width: 150,
                active: true,
                type: 'number',
            },
            {
                id: 'total_unpaid',
                name: 'Còn lại',
                width: 150,
                active: true,
                type: 'number',
            },
            {
                id: 'status_payment',
                name: 'Thu ngân',
                width: 200,
                active: true,
                type: 'text',
            },
            {
                id: 'total_point',
                name: 'Điểm tích lũy',
                width: 200,
                active: true,
                type: 'number',
            },
            {
                id: 'status_name',
                name: 'Trạng thái',
                width: 120,
                active: true,
                type: 'text',
            },
            {
                id: 'created_by',
                name: 'Người tạo',
                width: 200,
                active: false,
                type: 'object',
                index: 'name',
            },
            {
                id: 'updated_at',
                name: 'Cập nhật cuối',
                width: 200,
                active: false,
                type: 'text',
            }
        ];
    }

    public get collumsPayments(): Array<any> {
        return [
            {
                id: 'id',
                name: 'Mã đơn hàng',
                width: 200,
                active: true,
                type: 'link',
                to: 'orders',
            },
            {
                id: 'created_at',
                name: 'Ngày tạo đơn',
                width: 150,
                active: true,
                type: 'text',
            },
            {
                id: 'customer',
                name: 'Tên khách hàng',
                width: 200,
                active: true,
                type: 'object',
                index: 'name',
            },
            {
                id: 'payment_method_name',
                name: 'Hình thức thanh toán',
                width: 150,
                active: true,
                type: 'text',
            },
            {
                id: 'total_price',
                name: 'Tổng tiền',
                width: 150,
                active: true,
                type: 'number',
            },
            {
                id: 'total_discount',
                name: 'Giảm giá',
                width: 150,
                active: true,
                type: 'number',
            },
            {
                id: 'total_paid',
                name: 'Đã thanh toán',
                width: 150,
                active: true,
                type: 'number',
            },
            {
                id: 'total_unpaid',
                name: 'Còn lại',
                width: 150,
                active: true,
                type: 'number',
            },
            {
                id: 'status_payment',
                name: 'Thu ngân',
                width: 200,
                active: true,
                type: 'text',
            }
        ];
    }

    public get collumsAvailable(): Array<any> {
        return [
            {
                id: 'id',
                name: 'Mã đơn hàng',
                width: 200,
                active: true,
                type: 'link',
                to: 'orders',
            },
            {
                id: 'created_at',
                name: 'Ngày tạo đơn',
                width: 150,
                active: true,
                type: 'text',
            },
            {
                id: 'customer',
                name: 'Tên khách hàng',
                width: 150,
                active: true,
                type: 'object',
                index: 'name',
            },
            {
                id: 'total_price',
                name: 'Tổng tiền',
                width: 150,
                active: true,
                type: 'number',
            },
            {
                id: 'total_discount',
                name: 'Giảm giá',
                width: 150,
                active: true,
                type: 'number',
            },
            {
                id: 'total_paid',
                name: 'Đã thanh toán',
                width: 150,
                active: true,
                type: 'number',
            },
            {
                id: 'total_unpaid',
                name: 'Còn lại',
                width: 150,
                active: true,
                type: 'number',
            },
            {
                id: 'status_payment',
                name: 'Thu ngân',
                width: 200,
                active: true,
                type: 'text',
            },
            {
                id: 'total_point',
                name: 'Điểm tích lũy',
                width: 200,
                active: true,
                type: 'text',
            },
            {
                id: 'status_name',
                name: 'Trạng thái',
                width: 120,
                active: true,
                type: 'text',
            },
            {
                id: 'created_by',
                name: 'Người tạo',
                width: 200,
                active: false,
                type: 'object',
                index: 'name',
            },
            {
                id: 'updated_at',
                name: 'Cập nhật cuối',
                width: 200,
                active: false,
                type: 'text',
            }
        ];
    }

    public get collumsTailor(): Array<any> {
        return [
            {
                id: 'id',
                name: 'Mã đơn hàng',
                width: 200,
                active: true,
                type: 'link',
                to: 'orders',
            },
            {
                id: 'created_at',
                name: 'Ngày tạo đơn',
                width: 150,
                active: true,
                type: 'text',
            },
            {
                id: 'customer',
                name: 'Tên khách hàng',
                width: 150,
                active: true,
                type: 'object',
                index: 'name',
            },
            {
                id: 'total_price',
                name: 'Tổng tiền',
                width: 150,
                active: true,
                type: 'number',
            },
            {
                id: 'total_discount',
                name: 'Giảm giá',
                width: 150,
                active: true,
                type: 'number',
            },
            {
                id: 'total_paid',
                name: 'Đã thanh toán',
                width: 150,
                active: true,
                type: 'number',
            },
            {
                id: 'total_unpaid',
                name: 'Còn lại',
                width: 150,
                active: true,
                type: 'number',
            },
            {
                id: 'status_payment',
                name: 'Thu ngân',
                width: 200,
                active: true,
                type: 'text',
            },
            {
                id: 'total_point',
                name: 'Điểm tích lũy',
                width: 200,
                active: true,
                type: 'text',
            },
            {
                id: 'preview_process',
                name: 'Ngày thử 1',
                width: 200,
                active: true,
                type: 'object',
                index: 'one',
            },
            {
                id: 'preview_process',
                name: 'Ngày thử 2',
                width: 200,
                active: true,
                type: 'object',
                index: 'two',
            },
            {
                id: 'deadline',
                name: 'Ngày lấy',
                width: 200,
                active: true,
                type: 'text',
            },
            {
                id: 'status_name',
                name: 'Trạng thái',
                width: 120,
                active: true,
                type: 'text',
            },
            {
                id: 'created_by',
                name: 'Người tạo',
                width: 200,
                active: false,
                type: 'object',
                index: 'name',
            },
            {
                id: 'updated_at',
                name: 'Cập nhật cuối',
                width: 200,
                active: false,
                type: 'text',
            }
        ];
    }

    public get collumsProduction(): Array<any> {
        return [
            {
                id: 'id',
                name: 'Mã đơn hàng',
                width: 200,
                active: true,
                type: 'link',
                to: 'productions',
            },
            {
                id: 'created_at',
                name: 'Ngày tạo đơn',
                width: 150,
                active: true,
                type: 'text',
            },
            {
                id: 'preview_process_one',
                name: 'Ngày thử 1',
                width: 200,
                active: true,
                type: 'text',
                index: 'one',
            },
            {
                id: 'preview_process_two',
                name: 'Ngày thử 2',
                width: 200,
                active: true,
                type: 'text',
                index: 'two',
            },
            {
                id: 'deadline',
                name: 'Ngày lấy',
                width: 200,
                active: true,
                type: 'text',
            },
            {
                id: 'status_name',
                name: 'Trạng thái',
                width: 120,
                active: true,
                type: 'text',
            }
        ];
    }

    public get filters(): Array<FilterModel> {
        const stores = JSON.parse(
            localStorage.getItem(
                Storage.STORES
            )
        );
        return [
            {
                active: true,
                title: 'Tìm kiếm',
                conditions: [
                    {
                        key: 'keyword',
                        type: FilterInputTypes.INPUT_TEXT,
                        lable: 'Tìm kiếm...',
                        value: null,
                        checked: false,
                        options: null,
                        service: null,
                        config: null
                    }
                ],
                config: {
                    show: true,
                    info: false
                }
            },
            {
                active: true,
                title: 'Loại đơn hàng',
                types: [],
                conditions: [
                    {
                        key: 'types',
                        type: FilterInputTypes.CHECKBOX,
                        lable: null,
                        value: null,
                        checked: false,
                        options: [
                            { id: 'sale_available', name: 'Đơn sản phẩm bán sẵn' },
                            { id: 'tailor', name: 'Đơn may đo' },
                            { id: 'service', name: 'Đơn bảo hành sửa chữa' },
                            { id: 'uniform', name: 'Đơn đồng phục' },
                            { id: 'tailor_at_home', name: 'Đơn may đo tại nhà' }
                        ],
                        service: null,
                        config: null
                    }
                ],
                config: {
                    show: true,
                    info: false,
                    create: false,
                    modalRef: null
                }
            },
            {
                active: true,
                title: 'Tìm theo giá',
                conditions: [
                    {
                        key: 'min_total_price',
                        type: FilterInputTypes.INPUT_NUMBER,
                        lable: 'Từ giá',
                        value: null,
                        checked: false,
                        options: null,
                        service: null,
                        config: null
                    },
                    {
                        key: 'max_total_price',
                        type: FilterInputTypes.INPUT_NUMBER,
                        lable: 'Tới giá',
                        value: null,
                        checked: false,
                        options: null,
                        service: null,
                        config: null
                    }
                ],
                config: {
                    show: true,
                    info: false
                }
            },
            {
                active: true,
                title: 'Đã thanh toán',
                conditions: [
                    {
                        key: 'min_total_paid',
                        type: FilterInputTypes.INPUT_NUMBER,
                        lable: 'Từ số tiền',
                        value: null,
                        checked: false,
                        options: null,
                        service: null,
                        config: null
                    },
                    {
                        key: 'max_total_paid',
                        type: FilterInputTypes.INPUT_NUMBER,
                        lable: 'Tới số tiền',
                        value: null,
                        checked: false,
                        options: null,
                        service: null,
                        config: null
                    }
                ],
                config: {
                    show: true,
                    info: false
                }
            },
            {
                active: true,
                title: 'Chưa thanh toán',
                conditions: [
                    {
                        key: 'min_total_unpaid',
                        type: FilterInputTypes.INPUT_NUMBER,
                        lable: 'Từ số tiền',
                        value: null,
                        checked: false,
                        options: null,
                        service: null,
                        config: null
                    },
                    {
                        key: 'max_total_unpaid',
                        type: FilterInputTypes.INPUT_NUMBER,
                        lable: 'Tới số tiền',
                        value: null,
                        checked: false,
                        options: null,
                        service: null,
                        config: null
                    }
                ],
                config: {
                    show: true,
                    info: false
                }
            },
            {
                active: true,
                title: 'Nguồn đơn hàng',
                conditions: [
                    {
                        key: 'sources',
                        type: FilterInputTypes.CHECKBOX,
                        lable: null,
                        value: null,
                        checked: false,
                        options: [
                            { id: 'sms', name: 'SMS' },
                            { id: 'call', name: 'CALL' },
                            { id: 'email', name: 'EMAIL' },
                            { id: 'social', name: 'SOCIAL' },
                            { id: 'website', name: 'WEBSITE' },
                            { id: 'voucher', name: 'VOUCHER' }
                        ],
                        service: null,
                        config: null
                    }
                ],
                config: {
                    show: true,
                    info: false,
                    create: false,
                    modalRef: null
                }
            },
            {
                active: true,
                title: 'Chi nhánh',
                conditions: [
                    {
                        key: 'stores',
                        type: FilterInputTypes.CHECKBOX,
                        lable: null,
                        value: null,
                        checked: false,
                        options: stores.map(store => {
                            return {
                                id: store.id,
                                name: store.name,
                                width: 100,
                                active: true,
                                type: 'text'
                            };
                        }),
                        service: null,
                        config: null
                    }
                ],
                config: {
                    show: true,
                    info: false,
                    create: false,
                    modalRef: null
                }
            }
        ] as FilterModel[];
    }

    public get filtersPayments(): Array<FilterModel> {
        const stores = JSON.parse(
            localStorage.getItem(
                Storage.STORES
            )
        );
        return [
            {
                active: true,
                title: 'Tìm kiếm',
                conditions: [
                    {
                        key: 'keyword',
                        type: FilterInputTypes.INPUT_TEXT,
                        lable: 'Tìm kiếm...',
                        value: null,
                        checked: false,
                        options: null,
                        service: null,
                        config: null
                    }
                ],
                config: {
                    show: true,
                    info: false
                }
            },
            {
                active: true,
                title: 'Tìm theo giá',
                conditions: [
                    {
                        key: 'min_total_price',
                        type: FilterInputTypes.INPUT_NUMBER,
                        lable: 'Từ giá',
                        value: null,
                        checked: false,
                        options: null,
                        service: null,
                        config: null
                    },
                    {
                        key: 'max_total_price',
                        type: FilterInputTypes.INPUT_NUMBER,
                        lable: 'Tới giá',
                        value: null,
                        checked: false,
                        options: null,
                        service: null,
                        config: null
                    }
                ],
                config: {
                    show: true,
                    info: false
                }
            },
            {
                active: true,
                title: 'Hình thức thanh toán',
                types: [],
                conditions: [
                    {
                        key: 'methods',
                        type: FilterInputTypes.CHECKBOX,
                        lable: null,
                        value: null,
                        checked: false,
                        options: [
                            { id: '1', name: 'Tiền mặt' },
                            { id: '2', name: 'Quẹt thẻ' },
                            { id: '3', name: 'Chuyển khoản' }
                        ],
                        service: null,
                        config: null
                    }
                ],
                config: {
                    show: true,
                    info: false,
                    create: false,
                    modalRef: null
                }
            },
            {
                active: true,
                title: 'Nguồn đơn hàng',
                conditions: [
                    {
                        key: 'sources',
                        type: FilterInputTypes.CHECKBOX,
                        lable: null,
                        value: null,
                        checked: false,
                        options: [
                            { id: 'sms', name: 'SMS' },
                            { id: 'call', name: 'CALL' },
                            { id: 'email', name: 'EMAIL' },
                            { id: 'social', name: 'SOCIAL' },
                            { id: 'website', name: 'WEBSITE' },
                            { id: 'voucher', name: 'VOUCHER' }
                        ],
                        service: null,
                        config: null
                    }
                ],
                config: {
                    show: true,
                    info: false,
                    create: false,
                    modalRef: null
                }
            },
            {
                active: true,
                title: 'Chi nhánh',
                conditions: [
                    {
                        key: 'stores',
                        type: FilterInputTypes.CHECKBOX,
                        lable: null,
                        value: null,
                        checked: false,
                        options: stores.map(store => {
                            return {
                                id: store.id,
                                name: store.name,
                                width: 100,
                                active: true,
                                type: 'text'
                            };
                        }),
                        service: null,
                        config: null
                    }
                ],
                config: {
                    show: true,
                    info: false,
                    create: false,
                    modalRef: null
                }
            }
        ] as FilterModel[];
    }

    public get filtersTailor(): Array<FilterModel> {
        const stores = JSON.parse(
            localStorage.getItem(
                Storage.STORES
            )
        );
        return [
            {
                active: true,
                title: 'Tìm kiếm',
                conditions: [
                    {
                        key: 'keyword',
                        type: FilterInputTypes.INPUT_TEXT,
                        lable: 'Tìm kiếm...',
                        value: null,
                        checked: false,
                        options: null,
                        service: null,
                        config: null
                    }
                ],
                config: {
                    show: true,
                    info: false
                }
            },
            {
                active: true,
                title: 'Tìm theo giá',
                conditions: [
                    {
                        key: 'min_total_price',
                        type: FilterInputTypes.INPUT_NUMBER,
                        lable: 'Từ giá',
                        value: null,
                        checked: false,
                        options: null,
                        service: null,
                        config: null
                    },
                    {
                        key: 'max_total_price',
                        type: FilterInputTypes.INPUT_NUMBER,
                        lable: 'Tới giá',
                        value: null,
                        checked: false,
                        options: null,
                        service: null,
                        config: null
                    }
                ],
                config: {
                    show: true,
                    info: false
                }
            },
            {
                active: true,
                title: 'Đã thanh toán',
                conditions: [
                    {
                        key: 'min_total_paid',
                        type: FilterInputTypes.INPUT_NUMBER,
                        lable: 'Từ số tiền',
                        value: null,
                        checked: false,
                        options: null,
                        service: null,
                        config: null
                    },
                    {
                        key: 'max_total_paid',
                        type: FilterInputTypes.INPUT_NUMBER,
                        lable: 'Tới số tiền',
                        value: null,
                        checked: false,
                        options: null,
                        service: null,
                        config: null
                    }
                ],
                config: {
                    show: true,
                    info: false
                }
            },
            {
                active: true,
                title: 'Chưa thanh toán',
                conditions: [
                    {
                        key: 'min_total_unpaid',
                        type: FilterInputTypes.INPUT_NUMBER,
                        lable: 'Từ số tiền',
                        value: null,
                        checked: false,
                        options: null,
                        service: null,
                        config: null
                    },
                    {
                        key: 'max_total_unpaid',
                        type: FilterInputTypes.INPUT_NUMBER,
                        lable: 'Tới số tiền',
                        value: null,
                        checked: false,
                        options: null,
                        service: null,
                        config: null
                    }
                ],
                config: {
                    show: true,
                    info: false
                }
            },
            {
                active: true,
                title: 'Loại ngày',
                conditions: [
                    {
                        key: 'by_date',
                        type: FilterInputTypes.RADIO,
                        lable: null,
                        value: null,
                        checked: false,
                        options: [
                            { id: 'create', name: 'Ngày tạo' },
                            { id: 'try_one', name: 'Ngày thử 1' },
                            { id: 'try_two', name: 'Ngày thử 2' }
                        ],
                        service: null,
                        config: null
                    }
                ],
                config: {
                    show: true,
                    info: false
                }
            },
            {
                active: true,
                title: 'Nguồn đơn hàng',
                conditions: [
                    {
                        key: 'sources',
                        type: FilterInputTypes.CHECKBOX,
                        lable: null,
                        value: null,
                        checked: false,
                        options: [
                            { id: 'sms', name: 'SMS' },
                            { id: 'call', name: 'CALL' },
                            { id: 'email', name: 'EMAIL' },
                            { id: 'social', name: 'SOCIAL' },
                            { id: 'website', name: 'WEBSITE' },
                            { id: 'voucher', name: 'VOUCHER' }
                        ],
                        service: null,
                        config: null
                    }
                ],
                config: {
                    show: true,
                    info: false,
                    create: false,
                    modalRef: null
                }
            },
            {
                active: true,
                title: 'Chi nhánh',
                conditions: [
                    {
                        key: 'stores',
                        type: FilterInputTypes.CHECKBOX,
                        lable: null,
                        value: null,
                        checked: false,
                        options: stores.map(store => {
                            return {
                                id: store.id,
                                name: store.name,
                                width: 100,
                                active: true,
                                type: 'text'
                            };
                        }),
                        service: null,
                        config: null
                    }
                ],
                config: {
                    show: true,
                    info: false,
                    create: false,
                    modalRef: null
                }
            }
        ] as FilterModel[];
    }

    public get filtersAvailable(): Array<FilterModel> {
        const stores = JSON.parse(
            localStorage.getItem(
                Storage.STORES
            )
        );
        return [
            {
                active: true,
                title: 'Tìm kiếm',
                conditions: [
                    {
                        key: 'keyword',
                        type: FilterInputTypes.INPUT_TEXT,
                        lable: 'Tìm kiếm...',
                        value: null,
                        checked: false,
                        options: null,
                        service: null,
                        config: null
                    }
                ],
                config: {
                    show: true,
                    info: false
                }
            },
            {
                active: true,
                title: 'Tìm theo giá',
                conditions: [
                    {
                        key: 'min_total_price',
                        type: FilterInputTypes.INPUT_NUMBER,
                        lable: 'Từ giá',
                        value: null,
                        checked: false,
                        options: null,
                        service: null,
                        config: null
                    },
                    {
                        key: 'max_total_price',
                        type: FilterInputTypes.INPUT_NUMBER,
                        lable: 'Tới giá',
                        value: null,
                        checked: false,
                        options: null,
                        service: null,
                        config: null
                    }
                ],
                config: {
                    show: true,
                    info: false
                }
            },
            {
                active: true,
                title: 'Nguồn đơn hàng',
                conditions: [
                    {
                        key: 'sources',
                        type: FilterInputTypes.CHECKBOX,
                        lable: null,
                        value: null,
                        checked: false,
                        options: [
                            { id: 'sms', name: 'SMS' },
                            { id: 'call', name: 'CALL' },
                            { id: 'email', name: 'EMAIL' },
                            { id: 'social', name: 'SOCIAL' },
                            { id: 'website', name: 'WEBSITE' },
                            { id: 'voucher', name: 'VOUCHER' }
                        ],
                        service: null,
                        config: null
                    }
                ],
                config: {
                    show: true,
                    info: false,
                    create: false,
                    modalRef: null
                }
            },
            {
                active: true,
                title: 'Chi nhánh',
                conditions: [
                    {
                        key: 'stores',
                        type: FilterInputTypes.CHECKBOX,
                        lable: null,
                        value: null,
                        checked: false,
                        options: stores.map(store => {
                            return {
                                id: store.id,
                                name: store.name,
                                width: 100,
                                active: true,
                                type: 'text'
                            };
                        }),
                        service: null,
                        config: null
                    }
                ],
                config: {
                    show: true,
                    info: false,
                    create: false,
                    modalRef: null
                }
            }
        ] as FilterModel[];
    }

    public get filtersProduction(): Array<FilterModel> {
        const stores = JSON.parse(
            localStorage.getItem(
                Storage.STORES
            )
        );
        return [
            {
                active: true,
                title: 'Tìm kiếm',
                conditions: [
                    {
                        key: 'keyword',
                        type: FilterInputTypes.INPUT_TEXT,
                        lable: 'Tìm kiếm...',
                        value: null,
                        checked: false,
                        options: null,
                        service: null,
                        config: null
                    }
                ],
                config: {
                    show: true,
                    info: false
                }
            },
            {
                active: true,
                title: 'Loại ngày',
                conditions: [
                    {
                        key: 'by_date',
                        type: FilterInputTypes.RADIO,
                        lable: null,
                        value: null,
                        checked: false,
                        options: [
                            { id: 'create', name: 'Ngày tạo' },
                            { id: 'try_one', name: 'Ngày thử 1' },
                            { id: 'try_two', name: 'Ngày thử 2' },
                            { id: 'deadline', name: 'Ngày lấy' }
                        ],
                        service: null,
                        config: null
                    }
                ],
                config: {
                    show: true,
                    info: false
                }
            },
            {
                active: true,
                title: 'Chi nhánh',
                conditions: [
                    {
                        key: 'stores',
                        type: FilterInputTypes.CHECKBOX,
                        lable: null,
                        value: null,
                        checked: false,
                        options: stores.map(store => {
                            return {
                                id: store.id,
                                name: store.name,
                                width: 100,
                                active: true,
                                type: 'text'
                            };
                        }),
                        service: null,
                        config: null
                    }
                ],
                config: {
                    show: true,
                    info: false,
                    create: false,
                    modalRef: null
                }
            }
        ] as FilterModel[];
    }
}
