import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    tmdbId: { type: Number, required: true },
    titulo: { type: String, required: true },
    posterPath: { type: String, default: null },
    overview: { type: String, default: '' },
    releaseDate: { type: String, default: '' },
    assistido: { type: Boolean, default: false },
    adicionadoEm: { type: Date, default: Date.now }
  },
  { _id: false }
);

const watchlistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
    itens: { type: [itemSchema], default: [] }
  },
  { timestamps: true }
);

watchlistSchema.index({ user: 1 }, { unique: true });
watchlistSchema.index({ user: 1, 'itens.tmdbId': 1 }, { unique: false });

export default mongoose.model('Watchlist', watchlistSchema);
