
export class Role {
    id: string;
    name: string;
    note: string;
    permissions: [
        {
            id: string;
            name: string;
            group: string;
        }
    ];
    'created_by': object;
    'created_at': Date;
    'updated_at': Date;

    constructor(state?: Role) {
        if (state) {
            if (state.id) this.id = state.id;
            if (state.name) this.name = state.name;
            if (state.note) this.note = state.note;
            if (state.permissions) this.permissions = state.permissions;
        }
    }

    /**
     * Get table collums
     * @public
     */
    public get collums(): Array<any> {
        return [
            {
                id: 'name',
                name: 'Tên chức vụ',
                width: 200,
                active: true,
                type: 'link',
                to: 'setting/roles'
            },
            {
                id: 'note',
                name: 'Ghi chú',
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
}
