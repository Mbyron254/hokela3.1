export interface ICoordinate {
  id?: number;
  lat: number;
  lng: number;
}

export interface IAreaCreate {
  name?: string;
  color?: string;
  coordinates?: ICoordinate[];
}

export interface IAreaUpdate {
  id?: string;
  name?: string;
  color?: string;
  coordinates?: ICoordinate[];
}

export interface IPolygon {
  color: string;
  coords: ICoordinate[];
}
