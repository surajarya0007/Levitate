'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Navbar from '../../components/layout/Navbar';
import { getProjects, deleteProject } from '../../utils/api';
import { supabase } from '../../utils/supabase';

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

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/signin');
        return;
      }

      try {
        const projectData = await getProjects();
        setProjects(projectData);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load projects';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [router]);

  const handleDelete = async (projectId: string) => {
    setDeletingId(projectId);
    try {
      await deleteProject(projectId);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete project';
      setError(message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-background-dark">
      <Navbar />
      <main className="px-6 py-10 md:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-5xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Your projects</h1>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Resume your generated apps and deployments.</p>
            </div>
            <Link
              href="/"
              className="h-10 px-4 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-black text-sm font-semibold inline-flex items-center cursor-pointer hover:opacity-90 transition-opacity"
            >
              New project
            </Link>
          </div>

          {loading && <p className="mt-8 text-sm text-zinc-600 dark:text-zinc-400">Loading projects...</p>}
          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-3">
              <span className="material-symbols-outlined text-red-500 text-[18px]">error</span>
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600 cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          )}

          {!loading && !error && (
            <div className="mt-8 grid gap-4">
              {projects.length === 0 ? (
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 text-sm text-zinc-600 dark:text-zinc-400">
                  No projects yet. Generate your first app from the homepage.
                </div>
              ) : (
                projects.map((project) => (
                  <article key={project.id} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className={`text-xs uppercase tracking-wide ${project.status === 'FAILED' ? 'text-red-500' : project.status === 'DONE' ? 'text-emerald-500' : 'text-zinc-500'}`}>
                        {project.status}
                      </p>
                      <p className="text-xs text-zinc-500">{new Date(project.created_at).toLocaleString()}</p>
                    </div>
                    <p className="mt-2 text-sm text-zinc-800 dark:text-zinc-200">{project.prompt}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                      {project.deploy_url && (
                        <a
                          href={project.deploy_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                        >
                          Open deployment
                        </a>
                      )}
                      {['CREATED', 'PLANNING', 'GENERATING', 'BUILDING', 'DEPLOYING'].includes(project.status) && (
                        <Link
                          href={`/projects/build/${project.job_id}`}
                          className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer inline-flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                          View Build Progress
                        </Link>
                      )}
                      {project.status === 'FAILED' && (
                        <button
                          onClick={() => handleDelete(project.id)}
                          disabled={deletingId === project.id}
                          className="text-red-500 hover:text-red-700 dark:hover:text-red-300 cursor-pointer inline-flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                          {deletingId === project.id ? 'Deleting...' : 'Delete'}
                        </button>
                      )}
                    </div>
                  </article>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
