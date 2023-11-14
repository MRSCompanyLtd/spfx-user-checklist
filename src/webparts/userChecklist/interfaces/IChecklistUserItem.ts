import { IChecklistItem } from './IChecklistItem';

export interface IChecklistUserItem {
  Id: number;
  EmployeeId: string;
  ChecklistId: number;
  Task: IChecklistItem;
  Complete: boolean;
  Completed: string;
}
