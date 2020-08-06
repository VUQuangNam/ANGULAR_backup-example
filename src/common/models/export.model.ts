import { FilterModel, FilterInputTypes } from './filter.module';
import { Storage } from './storage.model';

export enum ExportStatuses {
    PENDING = 'pending',
    DELIVERY = 'delivery',
    CANCELLED = 'cancelled',
    CONFIRMED = 'confirmed'
}

export enum ExportTypes {
    TRANSFER = 1,
    EXPORT = 2
}

export enum ExportNormalStatuses {
    PENDING = 'Chờ duyệt phiếu',
    DELIVERY = 'Đang vận chuyển',
    CONFIRMED = 'Đã hoàn thành',
    CANCELLED = 'Đã hủy phiếu'
}

export class Export {
    id: string;
    type: number;
    note: string;
    reason: string;

    // detail
    source: {
        id: string,
        name: string,
        phone: string,
        address: string
    };
    store: {
        id: string,
        name: string,
        phone: string,
        address: string
    };
    status: string;
    'total_price': number;
    'total_quantity': number;

    // additional
    items: [];

    // manager
    'is_active': boolean;
    'created_by': object;
    'created_at': Date;
    'updated_at': Date;

    constructor(state?: Export) {
        if (state) {
            if (state.id) this.id = state.id;
            if (state.type) this.type = state.type;
            if (state.note) this.note = state.note;
            if (state.reason) this.reason = state.reason;

            // address
            if (state.source) this.source = state.source;
            if (state.store) this.store = state.store;

            // target
            if (state.items) this.items = state.items;
            if (state.total_price) this.total_price = state.total_price;
            if (state.total_quantity) this.total_quantity = state.total_quantity;

            // manager
            if (state.status) this.status = state.status;
        }
    }

    /**
     * Get table collums
     * @public
     */
    public get collums(): Array<any> {
        return [
            {
                id: 'id',
                name: 'Mã đơn',
                width: 100,
                active: true,
                type: 'link',
                to: 'inventory/exports'
            },
            {
                id: 'created_by',
                name: 'Người tạo',
                width: 200,
                active: true,
                type: 'object',
                index: 'name'
            },
            {
                id: 'source',
                name: 'Từ chi nhánh',
                width: 200,
                active: true,
                type: 'object',
                index: 'name'
            },
            {
                id: 'store',
                name: 'Đến chi nhánh',
                width: 200,
                active: true,
                type: 'object',
                index: 'name'
            },
            {
                id: 'created_at',
                name: 'Ngày chuyển',
                width: 200,
                active: true,
                type: 'text'
            },
            {
                id: 'received_at',
                name: 'Ngày nhận',
                width: 200,
                active: true,
                type: 'text'
            },
            {
                id: 'status_name',
                name: 'Trạng thái',
                width: 200,
                active: true,
                type: 'text'
            },
            {
                id: 'total_quantity',
                name: 'Số lượng',
                width: 100,
                active: false,
                type: 'text'
            },
            {
                id: 'total_price',
                name: 'Tổng tiền',
                width: 150,
                active: false,
                type: 'number'
            },
            {
                id: 'note',
                name: 'Ghi chú',
                width: 200,
                active: false,
                type: 'text',
            },
            {
                id: 'updated_at',
                name: 'Cập nhật cuối',
                width: 200,
                active: false,
                type: 'text'
            }
        ];
    }


    /**
     * Get table collums
     * @public
     */
    public get productionCollums(): Array<any> {
        return [
            {
                id: 'id',
                name: 'Mã đơn',
                width: 100,
                active: true,
                type: 'link',
                to: 'inventory/productions'
            },
            {
                id: 'created_by',
                name: 'Người tạo',
                width: 200,
                active: true,
                type: 'object',
                index: 'name'
            },
            {
                id: 'source',
                name: 'Từ chi nhánh',
                width: 200,
                active: true,
                type: 'object',
                index: 'name'
            },
            {
                id: 'store',
                name: 'Đến chi nhánh',
                width: 200,
                active: true,
                type: 'object',
                index: 'name'
            },
            {
                id: 'created_at',
                name: 'Ngày chuyển',
                width: 200,
                active: true,
                type: 'text'
            },
            {
                id: 'received_at',
                name: 'Ngày nhận',
                width: 200,
                active: true,
                type: 'text'
            },
            {
                id: 'status_name',
                name: 'Trạng thái',
                width: 200,
                active: true,
                type: 'text'
            },
            {
                id: 'total_quantity',
                name: 'Số lượng',
                width: 100,
                active: false,
                type: 'text'
            },
            {
                id: 'total_price',
                name: 'Tổng tiền',
                width: 150,
                active: false,
                type: 'number'
            },
            {
                id: 'note',
                name: 'Ghi chú',
                width: 200,
                active: false,
                type: 'text',
            },
            {
                id: 'updated_at',
                name: 'Cập nhật cuối',
                width: 200,
                active: false,
                type: 'text'
            }
        ];
    }

    /**
     * Get list filters
     * @public
     */
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
                    info: false,
                    create: false,
                    modalRef: null
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
                            { id: 'received', name: 'Ngày chuyển' },
                            { id: 'delivery', name: 'Ngày nhập' }
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
                title: 'Trạng thái',
                conditions: [
                    {
                        key: 'statuses',
                        type: FilterInputTypes.CHECKBOX,
                        lable: null,
                        value: null,
                        checked: false,
                        options: [
                            { id: 'confirmed', name: 'Đã hoàn thành' },
                            { id: 'checking', name: 'Đã kiểm phiếu' },
                            { id: 'cancelled', name: 'Đã hủy phiếu' }
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
                        key: 'sources',
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
