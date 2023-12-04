export function TypographyH1({ children }: React.PropsWithChildren<unknown>) {
  return (
    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-3xl">{children}</h1>
  );
}

export function TypographyH2({ children }: React.PropsWithChildren<unknown>) {
  return (
    <h2 className="mt-10 scroll-m-20 text-2xl font-semibold tracking-tight transition-colors first:mt-0 dark:border-b-slate-700">
      {children}
    </h2>
  );
}

export function TypographyH3({ children }: React.PropsWithChildren<unknown>) {
  return <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">{children}</h3>;
}

export function TypographyH4({ children }: React.PropsWithChildren<unknown>) {
  return <h4 className="mt-8 scroll-m-20 text-xl font-semibold tracking-tight">{children}</h4>;
}

export function TypographyP({ children }: React.PropsWithChildren<unknown>) {
  return <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>;
}

export function TypographyBlockquote({ children }: React.PropsWithChildren<unknown>) {
  return (
    <blockquote className="mt-6 border-l-2 border-slate-300 pl-6 italic text-slate-800 dark:border-slate-600 dark:text-slate-200">
      {children}
    </blockquote>
  );
}

export function TypographyLead({ children }: React.PropsWithChildren<unknown>) {
  return <p className=" text-slate-700 dark:text-slate-400 lg:text-lg">{children}</p>;
}

export function TypographySubtle({ children }: React.PropsWithChildren<unknown>) {
  return <p className="text-sm text-slate-500 dark:text-slate-400">{children}</p>;
}
