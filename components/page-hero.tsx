export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string
  title: string
  description?: string
}) {
  return (
    <section className="border-b border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        {eyebrow ? (
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-sidebar-primary">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-3 max-w-3xl text-balance font-serif text-4xl font-bold sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-sidebar-foreground/75">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  )
}
