import mongoose from 'mongoose';

const IssueSchema = new mongoose.Schema({
  repoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Repository',
    required: true
  },
  issueNumber: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    required: true
  },
  assignedTo: {
    type: String,
    default: null
  },
  labels: [{
    type: String
  }],
  createdAt: {
    type: Date,
    required: true
  },
  closedAt: {
    type: Date,
    default: null
  }
});

// Ensure uniqueness per repo and issue number
IssueSchema.index({ repoId: 1, issueNumber: 1 }, { unique: true });
IssueSchema.index({ repoId: 1, status: 1 });

const Issue = mongoose.model('Issue', IssueSchema);

export default Issue;
