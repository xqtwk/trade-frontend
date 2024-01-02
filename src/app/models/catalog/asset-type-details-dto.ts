import {GameDetailsDto} from "./game-details-dto";

export interface AssetTypeDetailsDto {
  id: number;
  name: string;
  game: GameDetailsDto;
  type: AssetTypeType;
}

export enum AssetTypeType {
  ITEM = "ITEM",
  SERVICE = "SERVICE"
}
