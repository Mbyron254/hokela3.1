export interface IDirectionCreate {
  name?: string;
  startLat?: number;
  startLng?: number;
  stopLat?: number;
  stopLng?: number;
  travelMode?: string;
}

export interface IDirectionUpdate {
  id?: string;
  name?: string;
  startLat?: number;
  startLng?: number;
  stopLat?: number;
  stopLng?: number;
  travelMode?: string;
}
