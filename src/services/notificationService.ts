export default class NotificationService {

    private static classInstance: NotificationService;
    private static _serviceWorkerRegistration: ServiceWorkerRegistration;

    public static register(registration: ServiceWorkerRegistration) {
        Notification.requestPermission().then((result) => {
            if (result === "granted") {
                this._serviceWorkerRegistration = registration;
                this.classInstance = new NotificationService();
            }
        })
    }

    public static getInstance(): NotificationService | null {
        if (this._serviceWorkerRegistration && this.classInstance) {
            return this.classInstance;
        }
        return null;
    }

    showMyNotification(message: string) {
        while (NotificationService._serviceWorkerRegistration === null || NotificationService._serviceWorkerRegistration === undefined) {
            console.log('Waiting for NS...');
        }
        NotificationService._serviceWorkerRegistration.showNotification("Memory Game", {
            body: message
        });
    }
}