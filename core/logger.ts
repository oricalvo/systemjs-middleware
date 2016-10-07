export class MiddlewareLogger {
    logs: string[];

    constructor() {
        this.logs = [];
    }

    log(message: string) {
        this.logs.push(message);
    }
}
