export class GetAllUserEvent {
    constructor(
        public readonly id: string
    ) { }

            toString() {
        return JSON.stringify({
            id: this.id
        })
    }
}
