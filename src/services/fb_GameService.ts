import db from '../firebase_config';
import { collection, getDocs, getDoc, setDoc, doc, updateDoc } from 'firebase/firestore';
import { IGameItem } from '../interfaces/IGameItem';
import { IRepository } from './IRepository';

const gameCollection = collection(db, 'Games');

class FireBaseGameService implements IRepository {
  private _gameItemService: FireBaseGameService | undefined;

  public getInstance(): FireBaseGameService {
    if (this._gameItemService === undefined) {
      this._gameItemService = new FireBaseGameService();
    }
    return this._gameItemService;
  }

  public async getAll(deviceUniqueId: string): Promise<IGameItem[]> {
    const gameSnapshot = await getDocs(gameCollection);
    const gameList = gameSnapshot.docs.map(doc => {
      if (doc.data().deviceUniqueId === deviceUniqueId) {
        return doc.data();
      }
      return null;
    });
    return gameList as IGameItem[];
  }

  public async createSave(gameItem: IGameItem, deviceUniqueId: string) {
    const userDoc = await getDoc(doc(gameCollection, deviceUniqueId + '_' + gameItem.id.toString()));

    if (!userDoc.exists()) {
      return await setDoc(doc(db, 'Games', deviceUniqueId + '_' + gameItem.id.toString()), gameItem);
    }

    await this.update(deviceUniqueId + '_' + gameItem.id.toString(), gameItem);
  }

  private async update(id: string, value: IGameItem) {
    const gameRef = await getDoc(doc(gameCollection, id));
    if (value.validTiles === undefined) {
      value.validTiles = [];
    }
    await updateDoc(gameRef.ref, value as any);
  }
}

export default new FireBaseGameService();
