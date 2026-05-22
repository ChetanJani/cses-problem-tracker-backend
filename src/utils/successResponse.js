class successResponse {
    constructor(statusCode, message = "Success", data = {}) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.isSuccess = true;
    }
}

export default successResponse;
