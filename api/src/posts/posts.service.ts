import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class PostsService {
  private firestore: admin.firestore.Firestore;

  constructor(@Inject('FIRESTORE_DATABASE') firestore: admin.firestore.Firestore) {
    this.firestore = firestore;
  }

  async findAll(): Promise<any[]> {
    const snapshot = await this.firestore.collection('posts').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async findOne(id: string): Promise<any> {
    const doc = await this.firestore.collection('posts').doc(id).get();
    if (!doc.exists) {
      throw new NotFoundException(`Post with ID ${id} not found.`);
    }
    return { id: doc.id, ...doc.data() };
  }

  async create(post: any): Promise<any> {
    const newPost = { ...post, createdAt: admin.firestore.FieldValue.serverTimestamp() };
    const docRef = await this.firestore.collection('posts').add(newPost);
    const createdPost = await docRef.get();
    return { id: createdPost.id, ...createdPost.data() };
  }

  async update(id: string, post: any): Promise<any> {
    const postRef = this.firestore.collection('posts').doc(id);
    const doc = await postRef.get();
    if (!doc.exists) {
      throw new NotFoundException(`Post with ID ${id} not found.`);
    }
    await postRef.update({ ...post, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    return { id, ...post };
  }

  async remove(id: string): Promise<void> {
    const postRef = this.firestore.collection('posts').doc(id);
    const doc = await postRef.get();
    if (!doc.exists) {
      throw new NotFoundException(`Post with ID ${id} not found.`);
    }
    await postRef.delete();
  }
}