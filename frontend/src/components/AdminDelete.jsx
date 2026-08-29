import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient'
import toast from 'react-hot-toast';

const AdminDelete = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/getAllProblem');
      setProblems(data);
    } catch (err) {
      toast.error('Failed to fetch problems');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this problem?')) return;
    
    try {
      await axiosClient.delete(`/problem/delete/${id}`);
      setProblems(problems.filter(problem => problem._id !== id));
      toast.success('Problem deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete problem');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--color-brand-dark)] text-[var(--color-brand-text-primary)] p-4 pt-10">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold font-outfit">Delete Problems</h1>
        </div>

      <div className="overflow-x-auto bg-[var(--color-brand-surface)] rounded-xl border border-[var(--color-brand-border)]">
        <table className="table w-full">
          <thead>
            <tr className="border-b border-[var(--color-brand-border)] text-[var(--color-brand-text-secondary)]">
              <th className="w-1/12 font-medium">#</th>
              <th className="w-4/12 font-medium">Title</th>
              <th className="w-2/12 font-medium">Difficulty</th>
              <th className="w-3/12 font-medium">Tags</th>
              <th className="w-2/12 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem, index) => (
              <tr key={problem._id} className="border-b border-[var(--color-brand-border)]/50 hover:bg-[var(--color-brand-dark)]/50 transition-colors">
                <th className="font-mono text-[var(--color-brand-text-secondary)]">{index + 1}</th>
                <td className="font-semibold">{problem.title}</td>
                <td>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider border shadow-sm ${
                    problem.difficulty === 'Easy' 
                      ? 'bg-[#00D26A]/10 text-[#00D26A] border-[#00D26A]/30' 
                      : problem.difficulty === 'Medium' 
                        ? 'bg-[var(--color-brand-orange)]/10 text-[var(--color-brand-orange)] border-[var(--color-brand-orange)]/30' 
                        : 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30'
                  }`}>
                    {problem.difficulty}
                  </span>
                </td>
                <td>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-[var(--color-brand-dark)] text-[var(--color-brand-text-secondary)] border border-[var(--color-brand-border)] shadow-sm">
                    {problem.tags}
                  </span>
                </td>
                <td>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleDelete(problem._id)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-md bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30 hover:bg-[#EF4444] hover:text-white transition-all shadow-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
};

export default AdminDelete;