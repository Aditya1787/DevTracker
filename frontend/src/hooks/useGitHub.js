import { useContext } from 'react';
import { GitHubContext } from '../contexts/GitHubContext';

export const useGitHub = () => {
  const context = useContext(GitHubContext);
  if (!context) {
    throw new Error('useGitHub must be used within a GitHubProvider');
  }
  return context;
};
