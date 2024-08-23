import { saveState, removeState, loadState } from '@/utils/Localstorage';
import { api } from './FrontAPI';

export interface User {
  [key: string]: any;
}

export interface UserDto {
  [key: string]: any;
}

const basePath = '/user';

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get(`${basePath}/query`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getUserById = async (userId: number): Promise<User> => {
  try {
    const response = await api.get(`${basePath}/${userId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.error('User not found:', error);
    } else {
      console.error('Error fetching user:', error);
    }
    throw error;
  }
};

export const registerUser = async (userDto: UserDto): Promise<string> => {
  try {
    const response = await api.post(`${basePath}/register`, userDto);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const updateUser = async (
  userId: number,
  userDto: UserDto
): Promise<string> => {
  try {
    const response = await api.put(`${basePath}/${userId}`, userDto);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.error('User not found:', error);
    } else {
      console.error('Error updating user:', error);
    }
    throw error;
  }
};

export const setUserId = (id: number | null) => {
  saveState('userId', id);
};

export const getUserId = (): number | null => {
  const id = loadState<string>('userId');
  return id ? parseInt(id, 10) : null;
};

export const removeUserId = () => {
  removeState('userId');
};

export const setUsername = (name: string | null) => {
  saveState('username', name);
};

export const getUsername = (): string | null => {
  return loadState<string>('username') || null;
};

export const removeUsername = () => {
  removeState('username');
};
