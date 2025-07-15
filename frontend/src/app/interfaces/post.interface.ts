export interface IPost {
  id?: string;
  title: string;
  content: string;
  authorUid?: string;
  authorEmail?: string;
  createdAt?: Date; // O NestJS irá preencher isso
  updatedAt?: Date; // O NestJS irá preencher isso
}