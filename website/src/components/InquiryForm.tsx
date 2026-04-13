'use client';
import { useState } from 'react';

interface Props {
  vehicleId: string;
  vehicleName: string;
}

export default function InquiryForm({ vehicleId, vehicleName }: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.get('firstName'),
          lastName: form.get('lastName'),
          email: form.get('email'),
          phone: form.get('phone'),
          message: form.get('message'),
          vehicleId,
          vehicleName,
          type: form.get('type'),
        }),
      });
      setStatus(res.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
        <p className="text-lg font-medium text-green-800">Inquiry sent!</p>
        <p className="mt-1 text-sm text-green-600">
          Our team will contact you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border p-6">
      <h2 className="text-lg font-semibold">Inquire about this vehicle</h2>
      <div className="grid grid-cols-2 gap-3">
        <input name="firstName" placeholder="First name" required
          className="rounded-lg border px-3 py-2 text-sm w-full" />
        <input name="lastName" placeholder="Last name" required
          className="rounded-lg border px-3 py-2 text-sm w-full" />
      </div>
      <input name="email" type="email" placeholder="Email address" required
        className="rounded-lg border px-3 py-2 text-sm w-full" />
      <input name="phone" placeholder="Phone number (optional)"
        className="rounded-lg border px-3 py-2 text-sm w-full" />
      <select name="type" className="rounded-lg border px-3 py-2 text-sm w-full">
        <option value="General Inquiry">General inquiry</option>
        <option value="Test Drive">Request a test drive</option>
        <option value="Finance">Finance questions</option>
      </select>
      <textarea name="message" placeholder="Any questions about this vehicle?"
        className="rounded-lg border px-3 py-2 text-sm w-full h-24 resize-none" />
      <button type="submit" disabled={status === 'sending'}
        className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
        {status === 'sending' ? 'Sending...' : 'Send inquiry'}
      </button>
      {status === 'error' && (
        <p className="text-sm text-red-600 text-center">
          Something went wrong. Please call us directly.
        </p>
      )}
    </form>
  );
}
