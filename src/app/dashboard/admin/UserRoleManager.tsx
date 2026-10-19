'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Search, ShieldAlert, Check, RefreshCw } from 'lucide-react';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  affiliation: string;
  role: string;
  created_at: string;
}

const ROLES = [
  { value: 'author', label: 'Author / Researcher', color: 'bg-slate-100 text-slate-800' },
  { value: 'reviewer', label: 'Peer Reviewer', color: 'bg-emerald-100 text-emerald-800' },
  { value: 'editor', label: 'Section Editor', color: 'bg-blue-100 text-blue-800' },
  { value: 'editor_in_chief', label: 'Editor-in-Chief', color: 'bg-amber-100 text-amber-800' },
  { value: 'admin', label: 'Administrator', color: 'bg-indigo-100 text-indigo-800' },
];

export default function UserRoleManager({
  users,
  currentUserId,
}: {
  users: UserProfile[];
  currentUserId: string;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const supabase = createClient();
  const router = useRouter();

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (userId === currentUserId && newRole !== 'admin') {
      alert('You cannot remove the admin role from your own active session.');
      return;
    }

    setUpdatingId(userId);
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) {
      alert(`Failed to update role: ${error.message}`);
    } else {
      setSuccessId(userId);
      setTimeout(() => setSuccessId(null), 2500);
      router.refresh();
    }
    setUpdatingId(null);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.affiliation?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or institution..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-600 bg-slate-50 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">Filter Role:</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
          >
            <option value="all">All Roles ({users.length})</option>
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 text-slate-700 uppercase tracking-wider text-[11px] border-b border-slate-200 font-bold">
              <th className="py-3 px-4">Researcher Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Affiliation</th>
              <th className="py-3 px-4">Current Role</th>
              <th className="py-3 px-4 text-right">Assign 5-Tier Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => {
                const isUpdating = updatingId === u.id;
                const isSuccess = successId === u.id;

                return (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {u.full_name}
                      {u.id === currentUserId && (
                        <span className="ml-2 text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                          You
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                      {u.email}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {u.affiliation || 'Not specified'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          ROLES.find((r) => r.value === u.role)?.color || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {u.role?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        {isSuccess && (
                          <span className="text-emerald-600 text-[11px] font-semibold flex items-center gap-1 animate-fade-in">
                            <Check className="w-3.5 h-3.5" />
                            Saved
                          </span>
                        )}
                        <select
                          disabled={isUpdating}
                          value={u.role || 'author'}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="px-2.5 py-1 text-xs border border-slate-300 rounded font-semibold text-slate-800 bg-white hover:border-slate-400 focus:ring-2 focus:ring-indigo-600 outline-none transition disabled:opacity-50"
                        >
                          {ROLES.map((r) => (
                            <option key={r.value} value={r.value}>
                              {r.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                  No users found matching the filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
