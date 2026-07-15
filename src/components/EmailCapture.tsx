export function EmailCapture() {
  return (
    <section className="border border-ink-100 rounded-lg p-6 sm:p-8 bg-white text-center">
      <h2 className="text-lg font-bold text-ink-900 mb-2">
        Know where the new entertainment money is moving.
      </h2>
      <p className="text-sm text-ink-600 mb-5 max-w-md mx-auto">
        Weekly briefing delivered every Monday. Free. No spam. Unsubscribe anytime.
      </p>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto"
      >
        <input
          type="email"
          placeholder="you@example.com"
          className="flex-1 px-3 py-2 text-sm border border-ink-200 rounded bg-cream-50 text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-burgundy-400 focus:ring-1 focus:ring-burgundy-200"
        />
        <button
          type="submit"
          className="px-5 py-2 text-sm font-semibold bg-ink-900 text-cream-50 rounded hover:bg-ink-800 transition-colors"
        >
          Subscribe
        </button>
      </form>
    </section>
  );
}
