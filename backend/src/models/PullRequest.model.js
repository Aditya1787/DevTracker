import mongoose from 'mongoose';

const PullRequestSchema = new mongoose.Schema({
  repoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Repository',
    required: true
  },
  prNumber: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'merged'],
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  merged: {
    type: Boolean,
    default: false
  },
  mergedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    required: true
  },
  closedAt: {
    type: Date,
    default: null
  },
  reviewers: [{
    type: String
  }]
});

// Uniqueness per repository and PR number
PullRequestSchema.index({ repoId: 1, prNumber: 1 }, { unique: true });
PullRequestSchema.index({ repoId: 1, status: 1 });

const PullRequest = mongoose.model('PullRequest', PullRequestSchema);

export default PullRequest;
