export function EmailCapture() {
  return (
    <section className="border border-ink-100 rounded-lg p-6 sm:p-8 bg-white text-center">
      <div className="mx-auto max-w-[480px] overflow-hidden rounded">
        <iframe
          src="https://thepickupco.substack.com/embed"
          title="Subscribe to The Pickup"
          width="480"
          height="320"
          className="block max-w-full border border-[#EEE] bg-white"
          frameBorder="0"
          scrolling="no"
        />
      </div>
      <p className="mt-4 text-xs text-ink-500">Free weekly briefing, delivered through Substack.</p>
    </section>
  );
}
