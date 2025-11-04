import mongoose from 'mongoose';

export const connectDatabase = async (uri) => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri, { autoIndex: true });
    console.log('MongoDB conectado');
  } catch (err) {
    console.error('Erro ao conectar no MongoDB:', err.message);
    process.exit(1);
  }
};
