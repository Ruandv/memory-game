export default class StorageService {

    private static classInstance: StorageService;

    public static getInstance() {
        if (!this.classInstance) {
            this.classInstance = new StorageService();
        }
        return this.classInstance;
    }

    getValue(key: string, parse: boolean = false) {
        var data = localStorage.getItem(key);
        if (parse && data) {
            return JSON.parse(data);
        }
        return data;
    }

    save(key: string, value: string) {
        localStorage.setItem(key, JSON.stringify(value));
    }
}