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
