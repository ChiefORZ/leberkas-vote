export function TypographyH1({ children }: React.PropsWithChildren<unknown>) {
  return (
    <h1 className="scroll-m-20 font-extrabold text-4xl tracking-tight lg:text-3xl">
      {children}
    </h1>
  );
}

export function TypographyH2({ children }: React.PropsWithChildren<unknown>) {
  return (
    <h2 className="mt-10 scroll-m-20 font-semibold text-2xl tracking-tight transition-colors first:mt-0 dark:border-b-slate-700">
      {children}
    </h2>
  );
}

export function TypographyH3({ children }: React.PropsWithChildren<unknown>) {
  return (
    <h3 className="mt-8 scroll-m-20 font-semibold text-2xl tracking-tight">
      {children}
    </h3>
  );
}

export function TypographyH4({ children }: React.PropsWithChildren<unknown>) {
  return (
    <h4 className="mt-8 scroll-m-20 font-semibold text-xl tracking-tight">
      {children}
    </h4>
  );
}

export function TypographyP({ children }: React.PropsWithChildren<unknown>) {
  return <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>;
}

export function TypographyBlockquote({
  children,
}: React.PropsWithChildren<unknown>) {
  return (
    <blockquote className="mt-6 border-slate-300 border-l-2 pl-6 text-slate-800 italic dark:border-slate-600 dark:text-slate-200">
      {children}
    </blockquote>
  );
}

export function TypographyLead({ children }: React.PropsWithChildren<unknown>) {
  return (
    <p className="text-slate-700 lg:text-lg dark:text-slate-400">{children}</p>
  );
}

export function TypographySubtle({
  children,
}: React.PropsWithChildren<unknown>) {
  return (
    <p className="text-slate-500 text-sm dark:text-slate-400">{children}</p>
  );
}
