export interface AssetTypeCreationDto {
  name: string;
  gameId: number;
  type: AssetTypeType
}

export enum AssetTypeType {
  ITEM = "ITEM",
  SERVICE = "SERVICE"
}
