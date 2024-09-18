export interface News {
    newsUid: string;
    title: string;
    content: string;
    imageUrls: string[];
    status: 'AVAILABLE' | 'UNAVAILABLE';
    createdAt?: string;
    updatedAt?: string;
  }
  
  export enum NewsStatus {
    AVAILABLE = 'AVAILABLE',
    UNAVAILABLE = 'UNAVAILABLE'
  }