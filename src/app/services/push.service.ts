import { Injectable } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal/ngx';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  mensajes: any[] = [
    {
      title: 'Turilo de la push',
      body: 'Este es el body de la push',
      date: new Date()
    }
  ];

  constructor(private oneSignal: OneSignal) { }

  configuraciónInicial(){
    this.oneSignal.startInit('0af4b726-f3c3-4d99-8672-7f10dea936ce', '317555251089');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

    this.oneSignal.handleNotificationReceived().subscribe((noti) => {
    // do something when notification is received
      console.log('Notifricación recibida',noti);
    });

    this.oneSignal.handleNotificationOpened().subscribe((noti) => {
      // do something when a notification is opened
      console.log('Notifricación abierta',noti);
    });

    this.oneSignal.endInit();
  }
}
