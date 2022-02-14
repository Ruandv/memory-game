import { ILocationData } from '../interfaces/ILocationData';
import FireBaseGeoService from './fb_GeoService';
class GeoLocationService {
  private static _instance: GeoLocationService | undefined;
  private static _uniqueId: string;
  static _db: FireBaseGeoService;
  public static getInstance = (uniqueId: string) => {
    this._uniqueId = uniqueId;
    if (!navigator.geolocation) {
      console.log('GeoLocation not permitted by user');
    } else {
      if (this._instance === undefined) {
        this._instance = new GeoLocationService();
        this._db = new FireBaseGeoService();
      }
      const options = {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000
      };
      navigator.geolocation.getCurrentPosition(this.updateLocation, this.error, options);
    }
    return this._instance;
  }

  private static updateLocation = (position: any) => {
    console.log('Update Location (' + this._uniqueId + ')' + JSON.stringify(position.coords.latitude));
    this._db.createSave({ lat: position.coords.latitude, lng: position.coords.longitude, accuracy: position.coords.accuracy } as ILocationData, this._uniqueId);
  }

  private static error = (err: any) => {
    switch (err.code) {
      case 1:
        // user denied permission
        console.info('(' + this._uniqueId + ') ' + err.message);
        this._db.createSave({ lat: 0, lng: 0, accuracy: 0 } as ILocationData, this._uniqueId);
        break;
      default:
        console.error(err);
        break;
    }
  }
}

export default GeoLocationService;
