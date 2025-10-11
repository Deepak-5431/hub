export interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  name?: string;
  avatar?: string;
  bio?: string;
  username?: string;
}

export interface CreateUserInput {
  email: string;
  password: string;
  name?: string;
  username?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface MeQueryResult {
  me: User;
}

export interface LoginMutationResult {
  login: {
    user: User;
  };
}

export interface RegisterMutationResult {
  register: {
    user: User;

  };
}

// future
export interface Post {
  id: string;
  title?: string;
  content?: string;
  imageUrl: string;      
  author: User;
  createdAt: string;
  updatedAt: string;
  likes: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  postId: string;
  createdAt: string;
}

export interface CreatePostInput {
  title?: string;
  content?: string;
  imageUrl: string;       
}

export interface CreateCommentInput {
  content: string;
  postId: string;
}