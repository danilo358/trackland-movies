 import api from './api';

 export const register = async (payload) => {
   const { data } = await api.post('/auth/register', payload);
   return data;
 };

 export const login = async (email, senha) => {
   const { data } = await api.post('/auth/login', { email, senha });
   return data;
 };

 export const me = async () => {
   const { data } = await api.get('/users/me');
   return data;
 };