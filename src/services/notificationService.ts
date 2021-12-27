export default class NotificationService {

    private static classInstance: NotificationService;
    private static _serviceWorkerRegistration: ServiceWorkerRegistration;

    public static register(registration: ServiceWorkerRegistration) {
        Notification.requestPermission().then((result) => {
            if (result === "granted") {
                this._serviceWorkerRegistration = registration;
            }
        })
    }

    public static getInstance(): NotificationService | null {
        if (!NotificationService.classInstance) {
            Notification.requestPermission().then((result) => {
                if (result === "granted") {
                    return NotificationService.classInstance = new NotificationService();
                }
            });
        }
        return null;
    }

    showNotification(message: string){
        NotificationService._serviceWorkerRegistration.showNotification("Memory  Game", {
            body: message
        });
    }
}