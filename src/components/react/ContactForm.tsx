// src/components/react/ContactForm.tsx
// React island — use client:load in parent .astro
// GHL webhook URL from import.meta.env.PUBLIC_GHL_WEBHOOK_URL
// If GHL CORS probe failed, PUBLIC_GHL_WEBHOOK_URL should be the Cloudflare Worker URL
// (see workers/ghl-proxy/index.ts for the ready-to-deploy proxy)

import { useState, useCallback } from 'react';
import { NAP } from '../../lib/constants';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface FormData {
  name: string;
  address: string;
  phone: string;
  service: string;
}

const SERVICE_OPTIONS = [
  'Weekly Mowing',
  'Trimming',
  'Mulch & Bed Maintenance',
  'Seasonal Cleanup',
  'Other',
] as const;

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '', address: '', phone: '', service: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [status, setStatus] = useState<FormStatus>('idle');

  const validate = useCallback((): boolean => {
    const next: Partial<FormData> = {};
    if (!formData.name.trim()) next.name = 'Name is required';
    if (!formData.address.trim()) next.address = 'Address is required';
    if (!formData.phone.trim()) next.phone = 'Phone number is required';
    if (!formData.service) next.service = 'Please select a service';
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');
    try {
      const nameParts = formData.name.trim().split(' ');
      const response = await fetch(import.meta.env.PUBLIC_GHL_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: nameParts[0],
          lastName: nameParts.slice(1).join(' ') || '',
          phone: formData.phone,
          address1: formData.address,
          tags: ['website-form'],
          customField: {
            service_requested: formData.service,
          },
        }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  // Success state — replaces form entirely (locked decision)
  if (status === 'success') {
    return (
      <div role="alert" className="text-center py-12">
        <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="font-heading font-bold text-2xl text-forest-green dark:text-light-green mt-4">
          Thank you! We'll be in touch within 24 hours.
        </p>
      </div>
    );
  }

  // Error state — always shows phone fallback (locked decision)
  if (status === 'error') {
    return (
      <div role="alert" className="text-center py-12 space-y-4">
        <p className="text-gray-700 dark:text-gray-300">
          Something went wrong. Please{' '}
          <a href={NAP.phoneHref} className="text-redbird-red font-semibold underline">
            call us at {NAP.phone}
          </a>
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="text-sm text-gray-500 dark:text-gray-400 underline hover:text-gray-700 dark:hover:text-gray-200"
        >
          Try again
        </button>
      </div>
    );
  }

  const fieldClass = (hasError: boolean) =>
    `w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
     focus:outline-none focus:ring-2 transition-colors ${
      hasError
        ? 'border-red-500 focus:ring-red-300'
        : 'border-gray-300 dark:border-gray-700 focus:ring-redbird-red/30 focus:border-redbird-red'
    }`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 max-w-xl mx-auto">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Full Name <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          value={formData.name}
          onChange={handleChange}
          aria-describedby={errors.name ? 'name-error' : undefined}
          aria-invalid={!!errors.name}
          className={fieldClass(!!errors.name)}
          placeholder="Alberto Murillo"
        />
        {errors.name && (
          <p id="name-error" role="alert" className="mt-1 text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      {/* Address */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Property Address <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <input
          id="address"
          name="address"
          type="text"
          autoComplete="street-address"
          value={formData.address}
          onChange={handleChange}
          aria-describedby={errors.address ? 'address-error' : undefined}
          aria-invalid={!!errors.address}
          className={fieldClass(!!errors.address)}
          placeholder="123 Main St, Wentzville, MO 63385"
        />
        {errors.address && (
          <p id="address-error" role="alert" className="mt-1 text-sm text-red-500">{errors.address}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Phone Number <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={formData.phone}
          onChange={handleChange}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
          aria-invalid={!!errors.phone}
          className={fieldClass(!!errors.phone)}
          placeholder="(314) 555-0100"
        />
        {errors.phone && (
          <p id="phone-error" role="alert" className="mt-1 text-sm text-red-500">{errors.phone}</p>
        )}
      </div>

      {/* Service Requested */}
      <div>
        <label htmlFor="service" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Service Requested <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <select
          id="service"
          name="service"
          value={formData.service}
          onChange={handleChange}
          aria-describedby={errors.service ? 'service-error' : undefined}
          aria-invalid={!!errors.service}
          className={fieldClass(!!errors.service)}
        >
          <option value="">Select a service…</option>
          {SERVICE_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        {errors.service && (
          <p id="service-error" role="alert" className="mt-1 text-sm text-red-500">{errors.service}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-redbird-red text-white font-bold py-4 px-8 rounded-lg
          hover:bg-[#a01830] hover:scale-[1.02] hover:shadow-lg
          disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100
          transition-all duration-200 text-lg"
      >
        {status === 'submitting' ? 'Sending…' : 'Get a Free Quote'}
      </button>
    </form>
  );
}
