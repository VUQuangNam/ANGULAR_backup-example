export class AttributeModel {
    id: string;
    name: string;
    values: [
        {
            id: string,
            name: string
        }
    ];

    constructor(state) {
        this.id = state.id;
        this.name = state.name;
    }
}
