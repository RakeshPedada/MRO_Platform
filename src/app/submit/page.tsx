'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface Journal {
  id: string;
  title: string;
}

interface Category {
  id: string;
  name: string;
}

export default function SubmitManuscriptPage() {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [keywords, setKeywords] = useState('');
  const [journalId, setJournalId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadMeta() {
      const { data: jData } = await supabase.from('journals').select('id, title');
      const { data: cData } = await supabase.from('categories').select('id, name');
      if (jData) setJournals(jData);
      if (cData) setCategories(cData);
      if (jData && jData.length > 0) setJournalId(jData[0].id);
      if (cData && cData.length > 0) setCategoryId(cData[0].id);
    }
    loadMeta();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMsg('Please select a PDF file to upload.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be logged in to submit a manuscript.');

      // 1. Upload manuscript file to private storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}_manuscript.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('manuscripts')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Insert record into manuscripts table
      const keywordsArray = keywords.split(',').map((k) => k.trim()).filter(Boolean);

      const { error: insertError } = await supabase.from('manuscripts').insert({
        author_id: user.id,
        journal_id: journalId,
        category_id: categoryId,
        title,
        abstract,
        keywords: keywordsArray,
        file_url: filePath,
        status: 'submitted',
      });

      if (insertError) throw insertError;

      router.push('/dashboard/author');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('An unexpected error occurred during submission.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Submit New Manuscript</h1>
            <p className="text-sm text-slate-500">Provide manuscript details and upload your PDF</p>
          </div>
          <Link href="/dashboard/author" className="text-sm text-blue-700 font-medium hover:underline">
            &larr; Back to Dashboard
          </Link>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Target Journal</label>
            <select
              value={journalId}
              onChange={(e) => setJournalId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
            >
              {journals.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Research Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Manuscript Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Robust High-Voltage Transmission Line Fault Detection"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Abstract</label>
            <textarea
              required
              rows={5}
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              placeholder="Provide a comprehensive summary of your research..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Keywords (Comma separated)</label>
            <input
              type="text"
              required
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Wavelets, Fault Classification, Machine Learning"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Manuscript PDF File</label>
            <input
              type="file"
              required
              accept=".pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg shadow transition disabled:opacity-50"
          >
            {loading ? 'Uploading & Submitting...' : 'Confirm Submission'}
          </button>
        </form>
      </div>
    </div>
  );
}