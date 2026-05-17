export function DashboardStats({
  stats,
}: {
  stats: {
    snippetCount: number;
    likesReceived: number;
    bookmarksReceived: number;
  };
}) {
  const items = [
    { label: "Snippets", value: stats.snippetCount },
    { label: "Likes", value: stats.likesReceived },
    { label: "Bookmarks", value: stats.bookmarksReceived },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
        >
          <p className="text-sm font-medium text-zinc-500">{item.label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
            {item.value}
          </p>
        </div>
      ))}
    </section>
  );
}
