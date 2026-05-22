/**
 * Application constants and configuration values.
 */

export const APP_NAME = 'DevTrackr';

export const GITHUB_OAUTH_URL = `https://github.com/login/oauth/authorize?client_id=${
  import.meta.env.VITE_GITHUB_CLIENT_ID || 'dummy_github_client_id'
}&redirect_uri=${
  encodeURIComponent(window.location.origin + '/github/callback')
}&scope=repo,user`;

export const CHART_COLORS = {
  primary: '#6366F1',   // Indigo
  secondary: '#8B5CF6', // Violet
  accent: '#06B6D4',    // Cyan
  success: '#10B981',   // Emerald
  warning: '#F59E0B',   // Amber
  danger: '#EF4444',    // Rose/Red
  slate: '#64748B',     // Cool slate
};

export const REPOS_PER_PAGE = 9;

export const TEAM_ROLES = {
  LEAD: 'Tech Lead',
  SENIOR: 'Senior Engineer',
  DEVELOPER: 'Software Engineer',
  CONTRIBUTOR: 'External Contributor',
};
