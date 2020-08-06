import { FilterModel, FilterInputTypes } from './filter.module';

export class ProductType {
    id: string;
    name: string;
    description: string;
    'created_by': object;
    'created_at': Date;
    'updated_at': Date;

    constructor(state?: ProductType) {
        if (state) {
            if (state.id) this.id = state.id;
            if (state.name) this.name = state.name;
            if (state.description) this.description = state.description;
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
                width: 200,
                active: true,
                type: 'modal',
                to: 'setting/product-types'
            },
            {
                id: 'name',
                name: 'Tên hiển thị',
                width: 150,
                active: true,
                type: 'text'
            },
            {
                id: 'description',
                name: 'Mô tả',
                width: 200,
                active: true,
                type: 'text'
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
            }
        ] as FilterModel[];
    }
}
