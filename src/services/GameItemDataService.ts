import fb from '../firebase';
import { getFirestore, collection, getDocs, getDoc, setDoc, doc, updateDoc } from 'firebase/firestore/lite';
import { IGameItem } from '../redux/interfaces/GameItem';

const db = getFirestore(fb);
const gameCollection = collection(db, 'Games');
const latLngCollection = collection(db, 'LatLng');

class FireBaseDataService {
    private _gameItemService: FireBaseDataService | undefined;

    public getInstance (): FireBaseDataService {
      if (this._gameItemService === undefined) {
        this._gameItemService = new FireBaseDataService();
      }
      return this._gameItemService;
    }

    public async getAll (deviceUniqueId: string): Promise<IGameItem[]> {
      const gameSnapshot = await getDocs(gameCollection);
      const gameList = gameSnapshot.docs.map(doc => {
        if (doc.data().deviceUniqueId === deviceUniqueId) {
          return doc.data();
        }
        return null;
      });
      return gameList as IGameItem[];
    }

    public async createSaveGameItem (gameItem: IGameItem, deviceUniqueId: string) {
      const userDoc = await getDoc(doc(gameCollection, deviceUniqueId + '_' + gameItem.id.toString()));

      if (!userDoc.exists()) {
        return await setDoc(doc(db, 'Games', deviceUniqueId + '_' + gameItem.id.toString()), gameItem);
      }

      await this.update(deviceUniqueId + '_' + gameItem.id.toString(), gameItem);
    }

    private async update (id: string, value: IGameItem) {
      const gameRef = await getDoc(doc(gameCollection, id));
      if (value.validTiles === undefined) {
        value.validTiles = [];
      }
      await updateDoc(gameRef.ref, value as any);
    }

    public async createSaveAccuracy (lat: number, lng: number, accuracy: number, deviceUniqueId: string) {
      const latLngDoc = await getDoc(doc(latLngCollection, deviceUniqueId));
      const latLng = { dateTime: (new Date()).toUTCString(), Lat: lat, Lng: lng, accuracy: accuracy, url: `https://www.google.com/maps/search/${lat},${lng}` };
      if (!latLngDoc.exists()) {
        return await setDoc(doc(db, 'LatLng', deviceUniqueId), latLng);
      }

      await this.updateLatLng(latLng, deviceUniqueId);
    }

    private async updateLatLng (latLng: any, deviceUniqueId: string) {
      const latLngRef = await getDoc(doc(latLngCollection, deviceUniqueId));

      await updateDoc(latLngRef.ref,
        latLng
      );
    }
}

export default new FireBaseDataService();
