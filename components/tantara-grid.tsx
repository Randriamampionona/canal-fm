export function TantaraGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-in fade-in duration-700">
      {children}
    </div>
  );
}
