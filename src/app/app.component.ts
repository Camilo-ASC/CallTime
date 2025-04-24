import { Component } from '@angular/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { Platform } from '@ionic/angular';
import { PushNotificationService } from './core/services/push-notification.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false
})
export class AppComponent {
  constructor(private platform: Platform, private PushNotificationService: PushNotificationService) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();
    try {
      console.log('[App] Platform ready. Initializing push notifications...');
      this.PushNotificationService.initPush();
    } catch (error) {
      console.error('[App] Error initializing push notifications:', error);
    }
  }
}
