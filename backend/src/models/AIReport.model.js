import mongoose from 'mongoose';

const AIReportSchema = new mongoose.Schema({
  repoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Repository',
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  sprintAnalysis: {
    type: String,
    required: true
  },
  contributorInsights: {
    type: String,
    required: true
  },
  bottlenecks: [{
    type: String
  }],
  recommendations: [{
    type: String
  }],
  productivityScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  generatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index to retrieve reports for a specific repository sorted by date
AIReportSchema.index({ repoId: 1, generatedAt: -1 });

const AIReport = mongoose.model('AIReport', AIReportSchema);

export default AIReport;
