export class CategoryModel {
    id: string;
    type: string;
    name: string;
    slug: string;
    logo: string;
    image: string;
    path: [string];
    'parent_id': string;

    // manger
    'is_public': string;
    'is_active': boolean;
    'created_by': object;
    'created_at': Date;
    'updated_at': Date;

    constructor(state) {
        this.id = state.id;
        this.type = state.type;
        this.name = state.name;
        this.slug = state.slug || state.name.replace(/\s/g, '-');
        this.logo = state.logo;
        this.image = state.image;
        this.path = state.path;
        this.parent_id = state.parent_id;
    }

}
