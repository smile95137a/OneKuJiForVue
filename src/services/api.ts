import axios from 'axios';

const loginJwt = axios.create({
  baseURL: 'http://localhost:8080/api', // 替換成你的後端地址
  headers: {
    'Content-Type': 'application/json'
  }
});

export function setAuthToken(token: string) {
  if (token) {
    loginJwt.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete loginJwt.defaults.headers.common['Authorization'];
  }
}

export { loginJwt };

