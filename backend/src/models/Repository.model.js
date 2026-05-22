import mongoose from 'mongoose';

const ContributorSchema = new mongoose.Schema({
  login: { type: String, required: true },
  avatarUrl: { type: String, default: '' },
  contributions: { type: Number, default: 0 }
}, { _id: false });

const RepositorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  repoName: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  stars: {
    type: Number,
    default: 0
  },
  forks: {
    type: Number,
    default: 0
  },
  language: {
    type: String,
    default: 'Unknown'
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  githubUrl: {
    type: String,
    default: ''
  },
  lastSynced: {
    type: Date,
    default: null
  },
  contributors: [ContributorSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to guarantee uniqueness of repositories per user
RepositorySchema.index({ userId: 1, fullName: 1 }, { unique: true });

const Repository = mongoose.model('Repository', RepositorySchema);

export default Repository;
