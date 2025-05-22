export class User {
    /*id: user.id,
        type: 'login', // אפשר להוסיף עוד פעילויות כאן, כמו העלאת קבצים, יצירת קולאז'ים וכו'
        userName: user.name,
        description: `${user.name} התחבר למערכת`,
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 100000)) // זמן אקראי לפעולה */
        constructor(
            public id: number,
            public type: string,
            public userName: string,
            public description: string,
            public timestamp: Date,
        ){}
}