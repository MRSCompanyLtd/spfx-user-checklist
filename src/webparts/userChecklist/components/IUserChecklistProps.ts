import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IUserChecklistProps {
  title: string;
  description: string;
  checklist: string;
  progress: string;
  userId: number;
  context: WebPartContext;
}
