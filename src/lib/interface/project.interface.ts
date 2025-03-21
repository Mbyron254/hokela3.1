export interface IProjectCreate {
  clientTier2Id?: string;
  managerId?: string;
  name?: string;
  dateStart?: Date;
  dateStop?: Date;
  description?: string;
}

export interface IProjectUpdate {
  id?: string;
  clientTier2Id?: string;
  managerId?: string;
  name?: string;
  dateStart?: Date;
  dateStop?: Date;
  description?: string;
}

export interface IProjectCreate {
  clientTier2Id?: string;
  managerId?: string;
  name?: string;
  dateStart?: Date;
  dateStop?: Date;
  description?: string;
}

export interface IProjectUpdate {
  id?: string;
  clientTier2Id?: string;
  managerId?: string;
  name?: string;
  dateStart?: Date;
  dateStop?: Date;
  description?: string;
}

export interface IProject {
  id: string;
  name: string;
  clientTier2?: {
    id: string;
    name: string;
  };
  manager?: {
    id: string;
    name: string;
  };
  dateStart: Date;
  dateStop: Date;
  status?: string;
}
