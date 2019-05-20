import { Injectable, EventEmitter } from '@angular/core';
import { OneSignal, OSNotification, OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  mensajes: OSNotificationPayload[];

  pushListener = new EventEmitter<OSNotificationPayload>();

  constructor(private oneSignal: OneSignal, private storage:Storage) { 
    this.cargarMensajes();
  }

  async getMensajes(){
    await this.cargarMensajes();
    return [...this.mensajes];
  }

  configuraciónInicial(){
    this.oneSignal.startInit('0af4b726-f3c3-4d99-8672-7f10dea936ce', '317555251089');

    this.oneSignal.inFocusDisplaying( this.oneSignal.OSInFocusDisplayOption.Notification );

    this.oneSignal.handleNotificationReceived().subscribe((noti) => {
    // do something when notification is received
      console.log('Notifricación recibida',noti);
      this.notificacionRecibida( noti )
    });

    this.oneSignal.handleNotificationOpened().subscribe( async (noti) => {
      // do something when a notification is opened
      console.log('Notifricación abierta',noti);
      await this.notificacionRecibida( noti.notification );
    });

    this.oneSignal.endInit();
  }

  async notificacionRecibida(noti:OSNotification){

    await this.cargarMensajes();

    const payload = noti.payload;

    const existePush = this.mensajes.find( mensaje => mensaje.notificationID === payload.notificationID );

    if( existePush) {
      return
    }

    this.mensajes.unshift(payload);
    this.pushListener.emit(payload);

    await this.guardarMensajes();

    
  }

  guardarMensajes(){
    this.storage.set('mensajes', this.mensajes);
  }

  async cargarMensajes(){
    this.mensajes = await this.storage.get('mensajes') || [];
    return this.mensajes;
  }
}
