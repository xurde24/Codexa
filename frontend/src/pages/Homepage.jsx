import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router';
import axiosClient from '../utils/axiosClient';
import FilterBar from '../components/FilterBar';
import MyStats from '../components/MyStats';
import Leaderboard from '../components/Leaderboard';
import { Code2 } from 'lucide-react';
function Homepage() {
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [attemptedProblems, setAttemptedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all',
    searchQuery: ''
  });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/problemSolvedByUser');
        setSolvedProblems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching solved problems:', error);
      }
    };

    const fetchAttemptedProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/problemAttemptedByUser');
        setAttemptedProblems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching attempted problems:', error);
      }
    };

    fetchProblems();
    if (user) {
      fetchSolvedProblems();
      fetchAttemptedProblems();
    }
  }, [user]);

  const predefinedTags = ['Basics', 'Arrays', 'Strings', 'Loops', 'Conditionals', 'Math', 'Sorting', 'Searching', 'Two Pointers', 'Hashing', 'Heap', 'Stack', 'Sliding Window', 'Linked List', 'Greedy'];
  const dynamicTags = problems.flatMap(p => Array.isArray(p.tags) ? p.tags.map(t => t.replace(/[^\x00-\x7F]/g, "").trim()) : (p.tags ? p.tags.split(',').map(t => t.replace(/[^\x00-\x7F]/g, "").trim()).filter(Boolean) : []));
  const availableTags = Array.from(new Set([...predefinedTags, ...dynamicTags])).sort();

  const filteredProblems = problems.filter(problem => {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === 'all' || (Array.isArray(problem.tags) ? problem.tags.map(t => t.replace(/[^\x00-\x7F]/g, "").trim()).includes(filters.tag) : problem.tags.replace(/[^\x00-\x7F]/g, "").trim().includes(filters.tag));
    const isSolved = solvedProblems.some(sp => sp._id === problem._id);
    const isAttempted = attemptedProblems.some(ap => ap._id === problem._id);
    const statusMatch = filters.status === 'all' || 
                        (filters.status === 'solved' && isSolved) ||
                        (filters.status === 'unsolved' && !isSolved) ||
                        (filters.status === 'attempted' && isAttempted);
    const searchMatch = !filters.searchQuery || problem.title.toLowerCase().includes(filters.searchQuery.toLowerCase());
    return difficultyMatch && tagMatch && statusMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-ambient flex flex-col relative overflow-x-hidden">
      <div className="bg-grid absolute inset-0 z-0"></div>

      {/* Main Content Layout */}
      <div className="w-full px-4 sm:px-6 lg:px-8 flex-1 relative z-10 flex flex-col lg:flex-row gap-6 lg:gap-8 mt-6 sm:mt-8 pb-10">
        
        {/* Left Column: Problem List */}
        <div className="flex-1 flex flex-col min-w-0">


        {/* Unified Filter Component */}
        <FilterBar filters={filters} setFilters={setFilters} availableTags={availableTags} />

        {/* Problems Table Layout */}
        <div className="w-full pb-10 overflow-x-auto">
          {filteredProblems.length === 0 ? (
            <div className="card glass-card p-8 text-center bg-[var(--color-brand-surface)] border border-[var(--color-brand-border)] rounded-xl">
              <h3 className="text-lg font-bold text-[var(--color-brand-text-primary)] mb-1 font-outfit">No problems found</h3>
              <p className="text-[var(--color-brand-text-secondary)] font-medium text-sm">Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="glass-card min-w-[800px] overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--color-brand-surface)] border-b border-[var(--color-brand-border)] text-[10px] sm:text-xs font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-widest">
                    <th className="py-5 px-6 w-24">PROB NO.</th>
                    <th className="py-5 px-6">TITLE</th>
                    <th className="py-5 px-6 w-32">DIFFICULTY</th>
                    <th className="py-5 px-6">TAGS</th>
                    <th className="py-5 px-6 w-36">CREATED AT</th>
                    {user?.role === 'admin' && <th className="py-5 px-6 w-28 text-right">ACTIONS</th>}
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredProblems.map((problem, idx) => (
                    <tr key={problem._id} className="border-b border-[var(--color-brand-border)] hover:bg-[var(--color-brand-orange)]/5 transition-colors group">
                      <td className="py-4 px-6 text-[var(--color-brand-text-secondary)] font-bold group-hover:text-[var(--color-brand-orange)] transition-colors">
                        <div className="flex items-center">
                          <span>{idx + 1}</span>
                          {solvedProblems.some(sp => sp._id === problem._id) && (
                            <span className="ml-3 text-[#16A34A]" title="Solved">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <NavLink to={`/problem/${problem._id}`} className="font-semibold text-[var(--color-brand-text-primary)] group-hover:text-[var(--color-brand-orange)] transition-colors">
                            {problem.title}
                          </NavLink>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider border ${
                          problem.difficulty?.toLowerCase() === 'easy' ? 'bg-[var(--color-brand-surface)] text-[#00D26A] border-[#00D26A]/30' :
                          problem.difficulty?.toLowerCase() === 'medium' ? 'bg-[var(--color-brand-surface)] text-[var(--color-brand-orange)] border-[var(--color-brand-orange)]/30' :
                          'bg-[var(--color-brand-surface)] text-[#EF4444] border-[#EF4444]/30'
                        }`}>
                          {problem.difficulty ? problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1).toLowerCase() : 'Easy'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-2">
                          {(Array.isArray(problem.tags) ? problem.tags : (problem.tags ? problem.tags.split(',') : [])).map((tag, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-[var(--color-brand-surface)] text-[var(--color-brand-text-secondary)] border border-[var(--color-brand-border)] whitespace-nowrap">
                              {tag.trim ? tag.replace(/[^\x00-\x7F]/g, "").trim() : tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-[var(--color-brand-text-secondary)] text-[13px] font-medium leading-tight">
                        {problem._id 
                          ? new Date(parseInt(problem._id.substring(0, 8), 16) * 1000).toISOString().split('T')[0] 
                          : '2025-07-28'}
                      </td>
                      {user?.role === 'admin' && (
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-4">
                            <NavLink to={`/problem/${problem._id}`} className="text-[var(--color-brand-text-secondary)] hover:text-[var(--color-brand-orange)] transition-colors" title="Solve/Edit">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.89 1.14l-2.815.83.83-2.815a4.5 4.5 0 011.14-1.89l8.931-8.931zm0 0L19.5 7.125" />
                              </svg>
                            </NavLink>
                            <button className="text-gray-500 hover:text-red-400 transition-colors" title="Delete">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        </div>

        {/* Right Column: User Stats & Leaderboard */}
        <div className="w-full lg:w-[320px] flex-shrink-0">
          <MyStats problems={problems} solvedProblems={solvedProblems} attemptedProblems={attemptedProblems} />
          <Leaderboard />
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center py-5 pb-6 text-[10px] sm:text-[11px] text-[var(--color-brand-text-secondary)] font-semibold tracking-wider select-none z-20 mt-auto border-t border-[var(--color-brand-border)]">
        © {new Date().getFullYear()} CodeForge. All rights reserved. • Made with <span className="text-[var(--color-brand-orange)] inline-block">♥</span> by <a href="https://github.com/manishcodess" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-brand-text-primary)] transition-colors pointer-events-auto underline decoration-[var(--color-brand-text-secondary)] hover:decoration-[var(--color-brand-orange)] underline-offset-2">Manish Kr. Sharma</a>
      </footer>

    </div>
  );
}

const getDifficultyBadgeStyle = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy': return 'bg-success/10 text-success border-success/20 shadow-[0_0_8px_rgba(0,169,110,0.1)]';
    case 'medium': return 'bg-warning/10 text-warning border-warning/20 shadow-[0_0_8px_rgba(251,189,35,0.1)]';
    case 'hard': return 'bg-error/10 text-error border-error/20 shadow-[0_0_8px_rgba(248,114,114,0.1)]';
    default: return 'bg-gray-700/20 text-gray-400 border-gray-600/30';
  }
};

export default Homepage;