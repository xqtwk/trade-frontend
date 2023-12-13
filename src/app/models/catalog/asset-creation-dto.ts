export interface AssetCreationDto {
  gameId: number;
  assetTypeId: number;
  userId: number;
  name: string;
  description: string;
  price: number;
  amount?: number | null;
}
