export interface InputClockInOut {
  runId?: string;
  agentId?: string;
  pointId?: string;
  directionId?: string;
  areaId?: string;
  clockPhotoId?: string;
  clockMode?: string;
  clockInAt?: Date;
  clockOutAt?: Date;
  lat?: number;
  lng?: number;
}
