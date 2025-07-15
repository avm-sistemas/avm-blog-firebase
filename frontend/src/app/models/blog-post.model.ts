import { IBlogPost } from "../interfaces/blog-post.interface";

export class BlogPost implements IBlogPost {
    id?: string | undefined;
    title: string;
    content: string;
    createdAt: any | Date;
    authorId: string;
    authorName?: string | undefined;
    authorEmail?: string | undefined;

    constructor() {
        this.title = '';
        this.content = '';
        this.authorId = '';
    }
}