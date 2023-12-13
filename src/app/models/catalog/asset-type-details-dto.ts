import {GameDetailsDto} from "./game-details-dto";

export interface AssetTypeDetailsDto {
  id: number;
  name: string;
  game: GameDetailsDto;
}
