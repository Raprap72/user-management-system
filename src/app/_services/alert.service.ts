import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Alert {
    type: string;
    message: string;
    autoClose?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AlertService {
    private subject = new Subject<Alert>();
    private defaultId = 'default-alert';

    // enable subscribing to alerts observable
    onAlert() {
        return this.subject.asObservable();
    }

    // convenience methods
    success(message: string, options?: any) {
        this.alert({ ...options, type: 'success', message });
    }

    error(message: string, options?: any) {
        this.alert({ ...options, type: 'error', message });
    }

    info(message: string, options?: any) {
        this.alert({ ...options, type: 'info', message });
    }

    warn(message: string, options?: any) {
        this.alert({ ...options, type: 'warning', message });
    }

    // main alert method    
    alert(alert: Alert) {
        alert.autoClose = (alert.autoClose === undefined ? true : alert.autoClose);
        this.subject.next(alert);
    }

    // clear alerts
    clear() {
        this.subject.next(null);
    }
}
