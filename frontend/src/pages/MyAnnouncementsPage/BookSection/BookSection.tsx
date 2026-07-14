export const BookSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <section className="space-y-5 px-4 sm:px-6 lg:px-8 xl:px-12">
      <h2 className="text-2xl font-bold text-slate-800">{title}</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">{children}</div>
    </section>
  );
};
