type Align = 'left' | 'center';

const alignClasses: Record<Align, string> = {
  left: '',
  center: 'mx-auto max-w-3xl text-center',
};

const themeEyeClasses: Record<'light' | 'dark', string> = {
  light: 'text-brand-primary',
  dark: 'text-brand-primary-light',
};

const themeTitleClasses: Record<'light' | 'dark', string> = {
  light: 'text-brand-neutral-900',
  dark: 'text-white',
};

const themeDescClasses: Record<'light' | 'dark', string> = {
  light: 'text-brand-neutral-600',
  dark: 'text-white/75',
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  theme = 'light',
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: Align;
  theme?: 'light' | 'dark';
}) {
  return (
    <div className={`${alignClasses[align]} ${theme === 'dark' ? 'text-white' : ''}`}>
      <span
        className={`text-sm font-semibold uppercase tracking-[0.24em] ${themeEyeClasses[theme]}`}
      >
        {eyebrow}
      </span>
      <h2
        className={`mt-4 text-4xl font-bold tracking-tight sm:text-5xl ${themeTitleClasses[theme]}`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-5 text-lg leading-8 ${themeDescClasses[theme]}`}>
          {description}
        </p>
      )}
    </div>
  );
}
