import {AssetDetailsDto} from "./asset-details-dto";
import {AssetTypeDetailsDto} from "./asset-type-details-dto";

export interface GameDetailsDto {
  id: number;
  name: string;
  assetTypes: AssetTypeDetailsDto[];
  assets: AssetDetailsDto[];
}
