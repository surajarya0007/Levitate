import { getAccessToken } from './supabase';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

interface Project {
  id: string;
  user_id: string;
  job_id: string;
  prompt: string;
  status: string;
  deploy_url?: string;
  created_at: string;
  updated_at?: string;
}

const authorizedFetch = async (path: string, init?: RequestInit) => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Authentication required. Please sign in.');
  }

  const headers = new Headers(init?.headers);
  if (!headers.has('Content-Type') && init?.body) {
    headers.set('Content-Type', 'application/json');
  }
  headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }

  return response;
};

export const createJob = async (prompt: string) => {
  const response = await authorizedFetch('/generate', {
    method: 'POST',
    body: JSON.stringify({ prompt }),
  });
  return response.json();
};

export const getJobStatus = async (jobId: string) => {
  const response = await authorizedFetch(`/status/${jobId}`);
  return response.json();
};

export const getProjects = async (): Promise<Project[]> => {
  const response = await authorizedFetch('/projects');
  return response.json();
};

export const deleteProject = async (projectId: string): Promise<void> => {
  await authorizedFetch(`/projects/${projectId}`, {
    method: 'DELETE',
  });
};
