'use client';

const TABS = ['hospitals', 'kindergartens', 'noise_level', 'stations', 'green_spaces'] as const;

type Tab = typeof TABS[number];

export default function Tabs({ selected, onSelect }: { selected: Tab; onSelect: (t: Tab) => void }) {
  return (
    <div className="mb-2 flex flex-row w-full border-t border-gray-300">
      {TABS.map((tab) => (
        <button
          key={tab}
          className={`py-2 w-1/4 text-center not-last:border-r-2 not-last:border-gray-300 ${selected === tab ? 'bg-blue-500 text-white' : 'bg-blue-100'}`}
          onClick={() => onSelect(tab)}
        >
          {tab.replace('_', ' ').charAt(0).toUpperCase() + tab.replace('_', ' ').slice(1)}
        </button>
      ))}
    </div>
  );
}