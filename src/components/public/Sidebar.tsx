import { ReactNode } from 'react';

interface FieldProps {
  label: string;
  hint?: string;
  children: ReactNode;
}

export function Field({ label, hint, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-text">{label}</label>
      {children}
      {hint && <p className="text-xs text-text-dim">{hint}</p>}
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent transition ${props.className ?? ''}`}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent transition resize-y min-h-[88px] ${props.className ?? ''}`}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent transition ${props.className ?? ''}`}
    />
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (c: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-6 rounded-full transition ${checked ? 'bg-accent' : 'bg-bg-elevated'}`}
        role="switch"
        aria-checked={checked}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition ${checked ? 'translate-x-4' : ''}`} />
      </button>
      <span className="text-sm">{label}</span>
    </label>
  );
}

export function PrimaryButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`bg-accent hover:bg-accent/80 transition rounded-xl px-5 py-2.5 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed ${props.className ?? ''}`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`bg-bg-elevated hover:bg-bg-card border border-border transition rounded-xl px-5 py-2.5 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed ${props.className ?? ''}`}
    >
      {children}
    </button>
  );
}

export function DangerButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`bg-accent-red/20 hover:bg-accent-red/30 text-accent-red transition rounded-xl px-5 py-2.5 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed ${props.className ?? ''}`}
    >
      {children}
    </button>
  );
}

export function Section({ title, description, children, action }: { title: string; description?: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div className="bg-bg-card rounded-2xl border border-border p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {description && <p className="text-sm text-text-muted mt-1">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}