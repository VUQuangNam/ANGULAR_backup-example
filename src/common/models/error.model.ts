export class ErrorModel {
    data: any;
    code: number;
    message: string;
    errors: [
        {
            field: string;
            location: string;
            messages: [string];
            types: [string];
        }
    ];

    constructor(error) {
        this.data = null;
        this.code = error.code;
        this.message = error.message;
        this.errors = error.errors;
    }


    /**
     * Get error message
     */
    public get getMessage(): string {
        try {
            if (this.errors && this.errors[0].messages) {
                return this.errors[0].messages[0];
            } else {
                return this.message;
            }
        } catch (ex) {
            console.log(ex);
            return 'server buys!';
        }
    }
}
