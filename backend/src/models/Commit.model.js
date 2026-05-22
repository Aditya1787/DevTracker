import mongoose from 'mongoose';

const CommitSchema = new mongoose.Schema({
  repoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Repository',
    required: true
  },
  sha: {
    type: String,
    required: true,
    unique: true
  },
  contributor: {
    type: String,
    required: true
  },
  contributorAvatar: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    required: true
  },
  commitDate: {
    type: Date,
    required: true
  },
  additions: {
    type: Number,
    default: 0
  },
  deletions: {
    type: Number,
    default: 0
  },
  url: {
    type: String,
    default: ''
  }
});

// Indices for analytics performance
CommitSchema.index({ repoId: 1, commitDate: -1 });

const Commit = mongoose.model('Commit', CommitSchema);

export default Commit;
