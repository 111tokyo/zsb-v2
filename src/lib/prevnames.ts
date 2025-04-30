import ZsbPrev from '../classes/ZsbPrev';
import config from '../config';
import { Prevname } from '../types/prevnames';
const api = new ZsbPrev(config.libs.prevnameKey);

const prevnamesRequest = async (userId: string): Promise<Prevname[] | null> => {
  try {
    const prevnames = await api.allPrevnames(userId)
    return (prevnames as any).names
  } catch {
    return null;
  }
};

export { prevnamesRequest };

