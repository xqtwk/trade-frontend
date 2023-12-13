import {GameDetailsDto} from "./game-details-dto";
import {AssetTypeDetailsDto} from "./asset-type-details-dto";
import {UserPublicDataResponse} from "../user-public-data-response";

export interface AssetDetailsDto {
  id: number;
  game: GameDetailsDto;
  assetType: AssetTypeDetailsDto;
  user: UserPublicDataResponse;
  name: string;
  description: string;
  price: number;
  amount?: number | null;
}
