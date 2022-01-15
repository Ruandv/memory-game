import FireBaseDataService from './GameItemDataService';
class GeoLocationService {
  private static _instance: GeoLocationService | undefined;
  private static _uniqueId: string;
  public static getInstance = (uniqueId: string) => {
    this._uniqueId = uniqueId;
    if (!navigator.geolocation) {
      console.log('GeoLocation not permitted by user');
    } else {
      if (this._instance === undefined) {
        this._instance = new GeoLocationService();
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
    FireBaseDataService.createSaveAccuracy(position.coords.latitude, position.coords.longitude, position.coords.accuracy, this._uniqueId);
  }

  private static error = (err: any) => {
    switch (err.code) {
      case 1:
        // user denied permission
        console.info('(' + this._uniqueId + ') ' + err.message);
        FireBaseDataService.createSaveAccuracy(0, 0, 0, this._uniqueId);
        break;
      default:
        console.error(err);
        break;
    }
  }
}

export default GeoLocationService;
