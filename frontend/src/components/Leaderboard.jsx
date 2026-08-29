import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';

function Leaderboard() {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await axiosClient.get('/user/leaderboard');
        setLeaderboard(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="glass-card mt-6 p-6 border border-[var(--color-brand-border)] bg-[var(--color-brand-surface)] rounded-xl">
      <h3 className="text-xl font-bold text-[var(--color-brand-text-primary)] mb-4 font-outfit flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--color-brand-orange)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        Leaderboard
      </h3>
      
      {loading ? (
        <div className="flex justify-center py-4">
          <span className="loading loading-spinner text-[var(--color-brand-orange)]"></span>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="text-center text-[var(--color-brand-text-secondary)] text-sm py-4">
          No data available.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-[var(--color-brand-border)]">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--color-brand-dark)] text-[var(--color-brand-text-secondary)] border-b border-[var(--color-brand-border)] uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3 px-4 w-16 text-center">Rank</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4 text-center">Solved</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user, idx) => (
                <tr key={user._id} className={`border-b border-[var(--color-brand-border)] transition-colors ${currentUser && currentUser._id === user._id ? 'bg-[#00D26A]/20 hover:bg-[#00D26A]/30' : 'hover:bg-[var(--color-brand-orange)]/10'}`}>
                  <td className="py-3 px-4 text-center font-bold text-[var(--color-brand-text-secondary)]">
                    {idx === 0 ? <span className="text-yellow-500 text-base">🥇</span> : 
                     idx === 1 ? <span className="text-gray-400 text-base">🥈</span> : 
                     idx === 2 ? <span className="text-yellow-700 text-base">🥉</span> : 
                     idx + 1}
                  </td>
                  <td className="py-3 px-4 font-medium text-[var(--color-brand-text-primary)] truncate max-w-[120px]">
                    {user.name}
                  </td>
                  <td className="py-3 px-4 text-center text-[var(--color-brand-orange)] font-bold">
                    {user.totalQuestionsSolved}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
