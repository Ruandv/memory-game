import { IGameItem } from '../interfaces/GameItem';

export interface IRepository {
  getAll: (deviceId: string) => Promise<IGameItem[]>;
  createSave: (object: IGameItem | any, deviceId: string) => void;
}
