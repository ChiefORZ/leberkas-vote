interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <div className="border-styria bg-white py-8 px-4 sm:rounded-lg sm:px-10">
        {children}
      </div>
    </div>
  );
}
