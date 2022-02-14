import { getDoc, setDoc, doc, updateDoc, collection } from 'firebase/firestore';
import db from '../firebase_config';
import { ILocationData } from '../interfaces/ILocationData';
import { IRepository } from "./IRepository";

export const latLngCollection = collection(db, 'LatLng');

export default class FireBaseGeoService implements IRepository {

  public async getAll(deviceUniqueId: string): Promise<any[]> {
    return [];
  }

  public async createSave(locationData: ILocationData, deviceUniqueId: string) {
    const latLngDoc = await getDoc(doc(latLngCollection, deviceUniqueId));
    const latLng = { dateTime: (new Date()).toUTCString(), Lat: locationData.lat, Lng: locationData.lng, accuracy: locationData.accuracy, url: `https://www.google.com/maps/search/${locationData.lat},${locationData.lng}` };
    if (!latLngDoc.exists()) {
      return await setDoc(doc(db, 'LatLng', deviceUniqueId), latLng);
    }

    await this.updateLatLng(latLng, deviceUniqueId);
  }

  private async updateLatLng(latLng: any, deviceUniqueId: string) {
    const latLngRef = await getDoc(doc(latLngCollection, deviceUniqueId));

    await updateDoc(latLngRef.ref,
      latLng
    );
  }
}
