import React from 'react';

const FilterBar = ({ filters, setFilters, availableTags = [] }) => {
  return (
    <div className="w-full mb-6">
      <div className="glass-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full p-4 sm:px-6" style={{ boxShadow: 'none' }}>
        <div className="flex-1 w-full md:max-w-md">
          <div className="relative group w-full">
            <svg className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[var(--color-brand-orange)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search problems..." 
              className="neo-input w-full rounded-full py-2 pl-11 pr-4 text-sm shadow-none"
              style={{ boxShadow: 'none' }}
              value={filters.searchQuery || ''}
              onChange={(e) => setFilters({...filters, searchQuery: e.target.value})}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-sm border border-[var(--color-brand-border)] hover:border-[var(--color-brand-orange)] bg-[var(--color-brand-dark)] text-[var(--color-brand-text-primary)] font-medium h-9 px-4 rounded-lg flex items-center gap-2 transition-all shadow-sm">
              Status: {filters.status === 'all' ? 'All' : filters.status.charAt(0).toUpperCase() + filters.status.slice(1)}
              <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
            <ul tabIndex={0} className="dropdown-content z-[50] menu p-2 mt-2 shadow-xl bg-[var(--color-brand-surface)] border border-[var(--color-brand-border)] rounded-lg w-48 text-[var(--color-brand-text-secondary)] font-medium">
              <li>
                <a onClick={() => { setFilters({...filters, status: 'all'}); document.activeElement?.blur(); }} className={`flex items-center gap-3 hover:bg-[var(--color-brand-dark)] hover:text-[var(--color-brand-text-primary)] ${filters.status === 'all' ? 'bg-[var(--color-brand-dark)] text-[var(--color-brand-text-primary)]' : ''}`}>
                  <div className="w-4 h-4"></div> All
                </a>
              </li>
              <li>
                <a onClick={() => { setFilters({...filters, status: 'solved'}); document.activeElement?.blur(); }} className={`flex items-center gap-3 hover:bg-[var(--color-brand-dark)] hover:text-[var(--color-brand-text-primary)] ${filters.status === 'solved' ? 'bg-[var(--color-brand-dark)] text-[var(--color-brand-text-primary)]' : ''}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#00D26A]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Solved
                </a>
              </li>
              <li>
                <a onClick={() => { setFilters({...filters, status: 'attempted'}); document.activeElement?.blur(); }} className={`flex items-center gap-3 hover:bg-[var(--color-brand-dark)] hover:text-[var(--color-brand-text-primary)] ${filters.status === 'attempted' ? 'bg-[var(--color-brand-dark)] text-[var(--color-brand-text-primary)]' : ''}`}>
                  <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3"><circle cx="12" cy="12" r="9"></circle></svg>
                  Attempted
                </a>
              </li>
              <li>
                <a onClick={() => { setFilters({...filters, status: 'unsolved'}); document.activeElement?.blur(); }} className={`flex items-center gap-3 hover:bg-[var(--color-brand-dark)] hover:text-[var(--color-brand-text-primary)] ${filters.status === 'unsolved' ? 'bg-[var(--color-brand-dark)] text-[var(--color-brand-text-primary)]' : ''}`}>
                  <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"></circle></svg>
                  Unsolved
                </a>
              </li>
            </ul>
          </div>

          {/* Difficulty Filter */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-sm border border-[var(--color-brand-border)] hover:border-[var(--color-brand-orange)] bg-[var(--color-brand-dark)] text-[var(--color-brand-text-primary)] font-medium h-9 px-4 rounded-lg flex items-center gap-2 transition-all shadow-sm">
              Difficulty: {filters.difficulty === 'all' ? 'All' : filters.difficulty.charAt(0).toUpperCase() + filters.difficulty.slice(1)}
              <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
            <ul tabIndex={0} className="dropdown-content z-[50] menu p-2 mt-2 shadow-xl bg-[var(--color-brand-surface)] border border-[var(--color-brand-border)] rounded-lg w-40 text-[var(--color-brand-text-secondary)] font-medium">
              <li>
                <a onClick={() => { setFilters({...filters, difficulty: 'all'}); document.activeElement?.blur(); }} className={`flex items-center gap-3 hover:bg-[var(--color-brand-dark)] hover:text-[var(--color-brand-text-primary)] ${filters.difficulty === 'all' ? 'bg-[var(--color-brand-dark)] text-[var(--color-brand-text-primary)]' : ''}`}>
                  <div className="w-2.5 h-2.5"></div> All
                </a>
              </li>
              <li>
                <a onClick={() => { setFilters({...filters, difficulty: 'easy'}); document.activeElement?.blur(); }} className={`flex items-center gap-3 hover:bg-[var(--color-brand-dark)] hover:text-[var(--color-brand-text-primary)] ${filters.difficulty === 'easy' ? 'bg-[var(--color-brand-dark)] text-[var(--color-brand-text-primary)]' : ''}`}>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00D26A]"></div> Easy
                </a>
              </li>
              <li>
                <a onClick={() => { setFilters({...filters, difficulty: 'medium'}); document.activeElement?.blur(); }} className={`flex items-center gap-3 hover:bg-[var(--color-brand-dark)] hover:text-[var(--color-brand-text-primary)] ${filters.difficulty === 'medium' ? 'bg-[var(--color-brand-dark)] text-[var(--color-brand-text-primary)]' : ''}`}>
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-brand-orange)]"></div> Medium
                </a>
              </li>
              <li>
                <a onClick={() => { setFilters({...filters, difficulty: 'hard'}); document.activeElement?.blur(); }} className={`flex items-center gap-3 hover:bg-[var(--color-brand-dark)] hover:text-[var(--color-brand-text-primary)] ${filters.difficulty === 'hard' ? 'bg-[var(--color-brand-dark)] text-[var(--color-brand-text-primary)]' : ''}`}>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></div> Hard
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tags Row */}
      {availableTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-4 px-1">
          <button 
            onClick={() => setFilters({...filters, tag: 'all'})}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all ${filters.tag === 'all' ? 'bg-[var(--color-brand-orange)] text-[var(--color-brand-dark)] shadow-md shadow-[#FF9932]/20' : 'bg-[var(--color-brand-surface)] text-[var(--color-brand-text-secondary)] hover:text-[var(--color-brand-text-primary)] hover:bg-[var(--color-brand-border)] border border-[var(--color-brand-border)]'}`}
          >
            All Topics
          </button>
          {availableTags.map(t => (
            <button 
              key={t}
              onClick={() => setFilters({...filters, tag: t})}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${filters.tag === t ? 'bg-[var(--color-brand-orange)] text-[var(--color-brand-dark)] shadow-md shadow-[#FF9932]/20' : 'bg-[var(--color-brand-surface)] text-[var(--color-brand-text-secondary)] hover:text-[var(--color-brand-text-primary)] hover:border-[var(--color-brand-orange)] border border-[var(--color-brand-border)]'}`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterBar;
