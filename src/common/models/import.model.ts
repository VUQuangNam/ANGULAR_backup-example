import { FilterModel, FilterInputTypes } from './filter.module';
import { Storage } from './storage.model';

export enum ImportStatuses {
    CHECKING = 'checking',
    CANCELLED = 'cancelled',
    CONFIRMED = 'confirmed'
}

export enum ImportNormalStatuses {
    CHECKING = 'Chờ nhập hàng',
    CANCELLED = 'Đã hủy phiếu',
    CONFIRMED = 'Đã nhập hàng',
}

export class Import {
    id: string;
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

    constructor(state?: Import) {
        if (state) {
            if (state.id) this.id = state.id;
            if (state.note) this.note = state.note;
            if (state.reason) this.reason = state.reason;
            if (state.source) this.source = state.source;
            if (state.store) this.store = state.store;
            if (state.status) this.status = state.status;
            if (state.items) this.items = state.items;
            if (state.total_price) this.total_price = state.total_price;
            if (state.total_quantity) this.total_quantity = state.total_quantity;
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
                to: 'inventory/imports'
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
                id: 'source',
                name: 'Nguồn nhập',
                width: 200,
                active: true,
                type: 'object',
                index: 'name'
            },
            {
                id: 'store',
                name: 'Kho nhập',
                width: 200,
                active: true,
                type: 'object',
                index: 'name'
            },
            {
                id: 'note',
                name: 'Ghi chú',
                width: 200,
                active: true,
                type: 'text',
            },
            {
                id: 'status_name',
                name: 'Trạng thái',
                width: 200,
                active: true,
                type: 'text'
            },
            {
                id: 'updated_at',
                name: 'Cập nhật cuối',
                width: 200,
                active: true,
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
