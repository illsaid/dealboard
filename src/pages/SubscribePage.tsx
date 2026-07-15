import { EmailCapture } from '../components/EmailCapture';
import { PrototypeNotice } from '../components/PrototypeNotice';

export function SubscribePage() {
  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-16">
      <PrototypeNotice />
      <div className="mt-8">
        <h1 className="text-2xl font-bold text-ink-900 mb-4 text-center">Subscribe to The Deal Board</h1>
        <p className="text-sm text-ink-600 text-center mb-8">
          Get the weekly intelligence briefing delivered every Monday. Know where entertainment money
          is moving before the rest of the industry.
        </p>
        <EmailCapture />
      </div>
    </div>
  );
}
