import { injectable } from 'inversify';
import provider from '../../utils/provider-selector';
import { Blocks } from './dataprovider-types';
import { IBlockDataProvider } from './Models';

@injectable()
export class ApiBlockDataProvider implements IBlockDataProvider {
  getMinMaxBlocksByEpoch(epoch: number, fork: number): Promise<{ min: number; max: number }> {
    return provider.getMinMaxBlocksByEpoch(epoch, fork);
  }
  async getLatestHeight(): Promise<number> {
    return await provider.getLatestHeight();
  }
  async getBlocks(key: string, minHeight: number, maxHeight: number): Promise<Blocks> {
    return await provider.getBlocks(key, minHeight, maxHeight);
  }
}
