import { IGameItem } from '../interfaces/IGameItem';

export interface IRepository {
  getAll: (deviceId: string) => Promise<IGameItem[]>;
  createSave: (object: IGameItem | any, deviceId: string) => void;
}
