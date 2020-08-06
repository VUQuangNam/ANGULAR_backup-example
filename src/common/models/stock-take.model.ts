import { FilterModel, FilterInputTypes } from './filter.module';
import { Storage } from './storage.model';

export enum StockTakeStatuses {
    CHECKING = 'checking',
    CANCELLED = 'cancelled',
    CONFIRMED = 'confirmed'
}

export enum StockTakeNormalStatuses {
    CHECKING = 'Đang kiểm hàng',
    CANCELLED = 'Đã hủy phiếu',
    CONFIRMED = 'Đã kiểm hàng',
}

export class StockTake {
    id: string;
    note: string;
    reason: string;

    // detail
    store: {
        id: string,
        name: string,
        phone: string,
        address: string
    };
    status: string;
    'total_actual': number;
    'total_quantity': number;
    'total_adjustment': number;

    // additional
    items: [];

    // manager
    'is_active': boolean;
    'created_by': object;
    'confirmed_at': Date;
    'created_at': Date;
    'updated_at': Date;

    constructor(state?: StockTake) {
        if (state) {
            if (state.id) this.id = state.id;
            if (state.note) this.note = state.note;
            if (state.reason) this.reason = state.reason;
            if (state.store) this.store = state.store;
            if (state.status) this.status = state.status;
            if (state.items) this.items = state.items;
            if (state.total_actual) this.total_actual = state.total_actual;
            if (state.total_quantity) this.total_quantity = state.total_quantity;
            if (state.total_adjustment) this.total_adjustment = state.total_adjustment;
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
                to: 'inventory/stock-takes'
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
                id: 'created_at',
                name: 'Ngày tạo',
                width: 200,
                active: true,
                type: 'text'
            },
            {
                id: 'confirmed_at',
                name: 'Ngày cân bằng',
                width: 200,
                active: true,
                type: 'text'
            },
            {
                id: 'store',
                name: 'Kho kiểm',
                width: 200,
                active: true,
                type: 'object',
                index: 'name'
            },
            {
                id: 'status_name',
                name: 'Trạng thái',
                width: 200,
                active: true,
                type: 'text'
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
                title: 'Trạng thái',
                conditions: [
                    {
                        key: 'statuses',
                        type: FilterInputTypes.CHECKBOX,
                        lable: null,
                        value: null,
                        checked: false,
                        options: [
                            { id: 'checking', name: 'Đang kiểm hàng' },
                            { id: 'cancelled', name: 'Đã hủy phiếu' },
                            { id: 'confirmed', name: 'Đã kiểm hàng' },
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
}
