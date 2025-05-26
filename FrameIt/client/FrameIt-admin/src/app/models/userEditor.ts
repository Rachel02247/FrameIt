export class UserEditor {
    
        constructor(
            public id: number,
            public type: string,
            public userName: string,
            public description: string,
            public timestamp: Date,
        ){}
}