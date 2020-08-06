import { BaseConfig } from 'src/config';
import { FilterModel, FilterInputTypes } from './filter.module';
import { Storage } from './storage.model';

export enum ProductTypes {
    TAILOR = 'tailor',
    AVAILABLE = 'available',
    WARRANTY = 'warranty',
    REPAIR = 'repair',
    UNIFORM = 'uniform'
}

export enum ProductStatuses {
    PICKING = 'picking',
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    PRODUCTION = 'production',
    DELIVERED = 'delivered',
    DELIVERING = 'delivering',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    CUTTING = 'cutting',
    PREPARING = 'preparing',
    SEWING = 'sewing',
    KCS_ONE = 'kcs_one',
    COMPLETING = 'completing',
    KCS_TWO = 'kcs_two',
    STORAGE = 'storage'
}

export enum ProductNormalStatuses {
    PICKING = 'Đặt hàng',
    PENDING = 'Chờ sản xuất',
    CONFIRMED = 'Đã duyệt',
    PRODUCTION = 'Đã hủy',
    DELIVERED = 'Đã giao hàng',
    DELIVERING = 'Vận chuyển',
    COMPLETED = 'Đã hoàn thành',
    CANCELLED = 'Đã hủy',
    CUTTING = 'Đang cắt',
    PREPARING = 'Chuẩn bị may',
    SEWING = 'Đang may',
    KCS_ONE = 'KCS1',
    COMPLETING = 'Hoàn thiện',
    KCS_TWO = 'KCS2',
    STORAGE = 'Lưu kho'
}


export class Product {
    // attributes
    id: string;
    name: string;
    type: ProductTypes;
    group: string;
    barcode: string;
    description: string;
    'category_id': string;
    'category_two_id': string;
    'category_three_id': string;
    properties: {
        unit: string;
        brand: string;
        gender: string;
        season: string;
    };
    relates: [string];
    images: [string];

    // price
    price: number;
    currency: string;
    'origin_price': number;
    'service_price': object;

    // design
    fabric: {
        id: string,
        name: string,
        content: string,
        image: string,
        price: number
    };
    'design_styles': object;
    'design_extras': object;
    'design_advances': object;

    // website
    metadata: {
        og_url: string,
        og_title: string,
        og_image: string,
        og_description: string
    };
    statistic: {
        view_count: number,
        like_count: number,
        order_count: number
    };

    // additional
    parts: [
        {
            id: string;
            total_quantity: number;
        }
    ];
    inventories: [
        {
            id: string;
            total_quantity: number;
        }
    ];

    // manager
    'is_hot_trend': boolean;
    'is_public': boolean;
    'is_active': boolean;
    'created_by': object;
    'warranty_expired_at': Date;
    'created_at': Date;
    'updated_at': Date;

    constructor(state?: Product) {
        if (state) {
            // default value
            this.group = 'product';

            // attribute
            if (state.id) this.id = state.id;
            if (state.type) this.type = state.type;
            if (state.name) this.name = state.name;
            if (state.barcode) this.barcode = state.barcode;
            if (state.description) this.description = state.description;
            if (state.properties) this.properties = state.properties;
            if (state.relates) this.relates = state.relates;
            if (state.images) this.images = state.images;

            // category
            if (state.category_id) this.category_id = state.category_id;
            if (state.category_two_id) this.category_two_id = state.category_two_id;
            if (state.category_three_id) this.category_three_id = state.category_three_id;

            // price
            if (state.currency) this.currency = state.currency;
            if (state.service_price) this.service_price = state.service_price;
            if (state.origin_price) this.origin_price = state.origin_price;
            if (state.price) this.price = state.price;


            // design
            if (state.fabric) this.fabric = state.fabric;
            if (state.design_styles) this.design_styles = state.design_styles;
            if (state.design_extras) this.design_extras = state.design_extras;
            if (state.design_advances) this.design_advances = state.design_advances;

            // website
            if (state.metadata) this.metadata = state.metadata;

            // additional
            if (state.parts) this.parts = state.parts;

            // manager
            if (state.is_public) this.is_public = state.is_public;
            if (state.is_hot_trend) this.is_hot_trend = state.is_hot_trend;
        }
    }

    /**
     * Parse Data
     * @public
     */
    public parseItem(item): Product {
        // transform data
        item.properties.unit = item.unit;
        item.properties.brand = item.brand;
        item.properties.gender = item.gender;
        item.properties.season = item.season;
        return new Product(item);
    }

    /**
     * Calculate total
     * @param {*} cells
     */
    private calTotalQuantity(cells) {
        let totalQuantity = 0;
        cells.map(number => totalQuantity += number || 0);
        return totalQuantity;
    }

    /**
     * Get table collums
     * @public
     */
    public get collums(): Array<any> {
        return [
            {
                id: 'id',
                name: 'Mã sản phẩm',
                width: 200,
                active: true,
                type: 'link',
                to: 'setting/products'
            },
            {
                id: 'name',
                name: 'Tên sản phẩm',
                width: 200,
                active: true,
                type: 'text'
            },
            {
                id: 'category_id',
                name: 'Danh mục',
                width: 150,
                active: true,
                type: 'text'
            },
            {
                id: 'properties',
                name: 'Đơn vị',
                width: 150,
                active: true,
                type: 'object',
                index: 'unit'
            },
            {
                id: 'origin_price',
                name: 'Giá nhập',
                width: 150,
                active: true,
                type: 'number'
            },
            {
                id: 'price',
                name: 'Giá bán',
                width: 150,
                active: true,
                type: 'number'
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
                active: false,
                type: 'text'
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
     * Get process table collums
     * @public
     */
    public get collumsProcess(): Array<any> {
        return [
            {
                id: 'id',
                name: 'Mã sản phẩm',
                width: 200,
                active: true,
                type: 'modal',
                to: 'process'
            },
            {
                id: 'order_id',
                name: 'Mã đơn hàng',
                width: 200,
                active: true,
                type: 'text'
            },
            {
                id: 'name',
                name: 'Tên sản phẩm',
                width: 150,
                active: true,
                type: 'text'
            },
            {
                id: 'category_name',
                name: 'Danh mục',
                width: 150,
                active: true,
                type: 'text'
            },
            {
                id: 'status_name',
                name: 'Trạng thái',
                width: 200,
                active: true,
                type: 'text',
            },
            {
                id: 'note',
                name: 'Ghi chú',
                width: 250,
                active: true,
                type: 'object',
                index: 'customer'
            }
        ];
    }

    /**
     * Get list filters
     * @public
     */
    public get filters(): Array<FilterModel> {
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
                title: 'Hiển thị website',
                conditions: [
                    {
                        key: 'is_public',
                        type: FilterInputTypes.RADIO,
                        lable: null,
                        value: null,
                        options: [
                            { id: true, name: 'Hiển thị' },
                            { id: false, name: 'Không hiển thị' }
                        ],
                        checked: false,
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
                title: 'Danh mục',
                conditions: [
                    {
                        key: 'categories',
                        type: FilterInputTypes.CHECKBOX,
                        lable: null,
                        value: null,
                        options: null,
                        checked: false,
                        service: {
                            uri: '/v1/categories?skip=0&limit=50',
                            respone: 'data',
                        },
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

    /**
     * Get list process filters
     * @public
     */
    public get filtersProcess(): Array<FilterModel> {
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
                title: 'Trạng thái',
                conditions: [
                    {
                        key: 'statuses',
                        type: FilterInputTypes.RADIO,
                        lable: null,
                        value: null,
                        options: [
                            { id: 'pending', name: 'Chờ sản xuất' },
                            { id: 'cutting', name: 'Đang cắt' },
                            { id: 'preparing', name: 'Chuẩn bị may' },
                            { id: 'sewing', name: 'Đang may' },
                            { id: 'kcs_one', name: 'Đang KCS1' },
                            { id: 'completing', name: 'Đang Hoàn Thiện' },
                            { id: 'kcs_two', name: 'Đang KCS2' },
                            { id: 'storage', name: 'Đang Lưu kho' }
                        ],
                        service: null,
                        checked: false,
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


    /**
     * Get list product filters
     * @public
     */
    public get productFilters(): Array<FilterModel> {
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
                title: 'Danh mục',
                conditions: [
                    {
                        key: 'categories',
                        type: FilterInputTypes.CHECKBOX,
                        lable: null,
                        value: null,
                        options: null,
                        checked: false,
                        service: {
                            uri: '/v1/categories?skip=0&limit=50',
                            respone: 'data',
                        },
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

    /**
     * Get list product  service filters
     * @public
     */
    public get serviceFilters(): Array<FilterModel> {
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
                title: 'Loại sản phẩm',
                conditions: [
                    {
                        key: 'types',
                        type: FilterInputTypes.CHECKBOX,
                        lable: null,
                        value: null,
                        options: [
                            { id: 'tailor', name: 'May đo' },
                            { id: 'repair', name: 'Sửa chữa' },
                            { id: 'warranty', name: 'Bảo hành' }
                        ],
                        checked: false,
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
                title: 'Danh mục',
                conditions: [
                    {
                        key: 'categories',
                        type: FilterInputTypes.CHECKBOX,
                        lable: null,
                        value: null,
                        options: null,
                        checked: false,
                        service: {
                            uri: '/v1/categories?skip=0&limit=50',
                            respone: 'data',
                        },
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

    /**
     * Get list material filters
     * @public
     */
    public get materialFilters(): Array<FilterModel> {
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
                title: 'Loại phụ liệu',
                conditions: [
                    {
                        key: 'types',
                        type: FilterInputTypes.CHECKBOX,
                        lable: null,
                        value: null,
                        options: null,
                        checked: false,
                        service: {
                            uri: '/v1/product-types?skip=0&limit=50',
                            respone: 'data',
                        },
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

    /**
     * Get inventory table collums
     * @public
     */
    public get stockCollums(): Array<any> {
        const stores = JSON.parse(
            localStorage.getItem(
                Storage.STORES
            )
        );
        return [
            {
                id: 'id',
                name: 'Mã sản phẩm',
                width: 200,
                active: true,
                type: 'text'
            },
            {
                id: 'name',
                name: 'Tên sản phẩm',
                width: 200,
                active: true,
                type: 'text'
            },
            {
                id: 'category_id',
                name: 'Danh mục',
                width: 150,
                active: true,
                type: 'text'
            },
            {
                id: 'properties',
                name: 'Đơn vị',
                width: 150,
                active: true,
                type: 'object',
                index: 'unit'
            },
            {
                id: 'created_at',
                name: 'Ngày tạo',
                width: 200,
                active: true,
                type: 'text'
            },
            {
                id: 'updated_at',
                name: 'Cập nhật cuối',
                width: 200,
                active: false,
                type: 'text'
            },
            ...stores.map(store => {
                return {
                    id: store.id.toLowerCase(),
                    name: 'Tồn kho: ' + store.id,
                    width: 100,
                    active: true,
                    type: 'text',
                    summaryFunc: cells => this.calTotalQuantity(cells)
                };
            })
        ];
    }

}
