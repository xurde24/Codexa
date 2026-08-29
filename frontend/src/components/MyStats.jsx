import React from 'react';

const MyStats = ({ problems = [], solvedProblems = [], attemptedProblems = [] }) => {
  const total = problems.length;
  const solved = solvedProblems.length;
  const attempted = attemptedProblems.length; 

  const getDifficultyStats = (difficulty) => {
    const dTotal = problems.filter(p => p.difficulty?.toLowerCase() === difficulty.toLowerCase()).length;
    const dSolved = solvedProblems.filter(p => p.difficulty?.toLowerCase() === difficulty.toLowerCase()).length;
    return { total: dTotal, solved: dSolved };
  };

  const easy = getDifficultyStats('easy');
  const medium = getDifficultyStats('medium');
  const hard = getDifficultyStats('hard');

  return (
    <div className="bg-[var(--color-brand-surface)] rounded-xl border border-[var(--color-brand-border)] shadow-md p-6 flex flex-col w-full h-fit">
      <h2 className="text-lg font-bold text-[var(--color-brand-text-primary)] mb-6 flex items-center gap-2 tracking-wide font-outfit">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--color-brand-orange)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        MY STATS
      </h2>

      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-[var(--color-brand-dark)] rounded-lg p-4 border border-[var(--color-brand-border)] flex flex-col items-center justify-center">
          <div className="text-2xl font-black text-[#00D26A]">{solved} <span className="text-lg font-bold text-[var(--color-brand-text-secondary)]">/ {total}</span></div>
          <div className="text-[11px] text-[var(--color-brand-text-secondary)] font-bold uppercase tracking-wider mt-1">Solved</div>
        </div>
        <div className="bg-[var(--color-brand-dark)] rounded-lg p-4 border border-[var(--color-brand-border)] flex flex-col items-center justify-center">
          <div className="text-2xl font-black text-[var(--color-brand-orange)]">{attempted}</div>
          <div className="text-[11px] text-[var(--color-brand-text-secondary)] font-bold uppercase tracking-wider mt-1">Attempted</div>
        </div>
      </div>



      {/* Difficulty Breakdown */}
      <div className="space-y-5 mt-4">
        {/* Easy */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-bold text-[#00D26A]">Easy</span>
            <span className="text-xs font-bold text-[var(--color-brand-text-primary)]">{easy.solved} <span className="text-[var(--color-brand-text-secondary)] font-medium">/ {easy.total}</span></span>
          </div>
          <div className="w-full bg-[var(--color-brand-dark)] border border-[var(--color-brand-border)] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#00D26A] h-full rounded-full" style={{ width: `${easy.total === 0 ? 0 : (easy.solved / easy.total) * 100}%` }}></div>
          </div>
        </div>

        {/* Medium */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-bold text-[var(--color-brand-orange)]">Medium</span>
            <span className="text-xs font-bold text-[var(--color-brand-text-primary)]">{medium.solved} <span className="text-[var(--color-brand-text-secondary)] font-medium">/ {medium.total}</span></span>
          </div>
          <div className="w-full bg-[var(--color-brand-dark)] border border-[var(--color-brand-border)] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[var(--color-brand-orange)] h-full rounded-full" style={{ width: `${medium.total === 0 ? 0 : (medium.solved / medium.total) * 100}%` }}></div>
          </div>
        </div>

        {/* Hard */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-bold text-[#EF4444]">Hard</span>
            <span className="text-xs font-bold text-[var(--color-brand-text-primary)]">{hard.solved} <span className="text-[var(--color-brand-text-secondary)] font-medium">/ {hard.total}</span></span>
          </div>
          <div className="w-full bg-[var(--color-brand-dark)] border border-[var(--color-brand-border)] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#EF4444] h-full rounded-full" style={{ width: `${hard.total === 0 ? 0 : (hard.solved / hard.total) * 100}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyStats;
