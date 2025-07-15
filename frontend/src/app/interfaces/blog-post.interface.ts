export interface IBlogPost {
  id?: string; // O ID é opcional ao criar, mas existe ao buscar
  title: string;
  content: string;
  createdAt: any; // Tipo Timestamp do Firestore ou Date
  authorId: string;
  authorName?: string; // Nome do autor, se armazenado
  authorEmail?: string;
}
