import { FilterModel, FilterInputTypes } from './filter.module';

export class Material {
    id: string;
    name: string;
    type: string;
    group: string;
    images: [string];
    description: string;
    properties: {
        unit: string,
        brand: string;
        gender: string;
    };

    // amount
    currency: string;
    'origin_price': number;
    price: number;

    // additional
    inventories: [
        {
            id: string;
            total_quantity: number;
        }
    ];
    'price_books': []; // list price book id
    'price_groups': []; // list category id in price book

    // manager
    'is_public': boolean;
    'created_by': object;
    'created_at': Date;
    'updated_at': Date;

    constructor(state?: Material) {
        if (state) {
            // default value
            this.group = 'material';
            this.currency = 'VND';

            if (state.id) this.id = state.id;
            if (state.type) this.type = state.type;
            if (state.name) this.name = state.name;
            if (state.images) this.images = state.images;
            if (state.description) this.description = state.description;
            if (state.properties) this.properties = state.properties || null;

            // amount
            if (state.price_books) this.price_books = state.price_books || null;
            if (state.price_groups) this.price_groups = state.price_groups || null;
            if (state.origin_price) this.origin_price = state.origin_price || 0;
            if (state.price) this.price = state.price || 0;

            // manager
            if (state.is_public) this.is_public = state.is_public || false;
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
                name: 'Mã',
                width: 100,
                active: true,
                type: 'modal',
                to: 'setting/materials'
            },
            {
                id: 'name',
                name: 'Tên hiển thị',
                width: 150,
                active: true,
                type: 'text'
            },
            {
                id: 'type',
                name: 'Loại',
                width: 120,
                active: true,
                type: 'text'
            },
            {
                id: 'properties',
                name: 'Loại',
                width: 120,
                type: 'object',
                index: 'unit'
            },
            {
                id: 'price',
                name: 'Giá bán',
                width: 120,
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
        return [
            {
                active: true,
                title: 'Tìm kiếm',
                conditions: [
                    {
                        key: 'id',
                        type: FilterInputTypes.INPUT_TEXT,
                        lable: 'Tìm kiếm theo mã...',
                        value: null,
                        checked: false,
                        options: null,
                        service: null,
                        config: null
                    },
                    {
                        key: 'name',
                        type: FilterInputTypes.INPUT_TEXT,
                        lable: 'Tìm kiếm theo tên...',
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
                        checked: false,
                        options: null,
                        service: {
                            uri: '/v1/product-types',
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
}
