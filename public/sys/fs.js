// if (!('indexedDB' in window)) {
//     console.log("This browser doesn't support IndexedDB");
//     return;
// }

async function createDatabase(name, version = 1) {
    return await new Promise((resolve, reject) => {
        let openRequest = indexedDB.open(name, version);

        openRequest.onerror = ({ error }) => {
            reject(error);
        }
        
        openRequest.onsuccess = ({ target }) => {
            resolve(target.result);
        }
    })
}

class Database {
    constructor(db) {
        this.db = db;
    }

    getDatabase() {
        return this.db;
    }
}

const db = await createDatabase("test");
const data = new Database(db);

console.log("data", data)
console.log("data", data.getDatabase)

export default db;