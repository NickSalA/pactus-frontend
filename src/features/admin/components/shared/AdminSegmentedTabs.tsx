import { Plus } from 'lucide-react';

type TabItem<T extends string> = {
  badge?: number;
  id: T;
  label: string;
};

type AdminSegmentedTabsProps<T extends string> = {
  activeTab: T;
  onChange: (tabId: T) => void;
  tabs: TabItem<T>[];
  activeCatalog?: any;
  openCreaterEditor?: any;
};

export function AdminSegmentedTabs<T extends string>({
  activeCatalog,
  openCreaterEditor,
  activeTab,
  onChange,
  tabs,
}: AdminSegmentedTabsProps<T>) {
  return (
    <div className="inline-flex justify-between flex-wrap items-center gap-1 rounded-2xl bg-slate-100 p-1">
      <div className="flex gap-1">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-white text-slate-900 shadow-sm shadow-slate-200/80'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <span>{tab.label}</span>
              {typeof tab.badge === 'number' && (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    isActive
                      ? 'bg-slate-100 text-slate-600'
                      : 'bg-white/70 text-slate-500'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {activeCatalog === 'services' && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={openCreaterEditor}
            className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25"
          >
            <Plus className="h-4 w-4" />
            Nuevo servicio
          </button>
        </div>
      )}
    </div>
  );
}
