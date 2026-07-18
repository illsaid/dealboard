import { EmailCapture } from '../components/EmailCapture';

export function SubscribePage() {
  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-16">
      <p className="kicker mb-2 text-center">Subscribe</p>
      <h1 className="text-3xl font-extrabold text-ink-900 font-display text-center mb-4">Subscribe to The Pickup</h1>
      <p className="text-sm text-ink-600 text-center mb-8">
        Get the weekly intelligence briefing. Know where entertainment money
        is moving before the rest of the industry.
      </p>
      <EmailCapture />
    </div>
  );
}
