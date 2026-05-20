import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

interface CheckoutFormProps {
  total: number;
  onSuccess: (paymentIntentId: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export default function CheckoutForm({ total, onSuccess, loading, setLoading }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total }),
      });

      const { clientSecret, isMock, error: apiError } = await response.json();

      if (apiError) throw new Error(apiError);

      if (isMock) {
        console.warn("DEMO_MODE: Stripe key missing, simulating success.");
        setTimeout(() => {
          onSuccess(clientSecret);
          setLoading(false);
        }, 1500);
        return;
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (stripeError) {
        setError(stripeError.message || 'An unexpected error occurred.');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      if (!stripe) setLoading(false); // Only set loading false if we didn't succeed
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className="text-[10px] font-black uppercase tracking-widest italic text-white/60">Secure Alpha Gateway</div>
        <ShieldCheck size={18} className="text-white/40" />
      </div>

      <div className="p-4 border border-white/10 rounded-sm bg-black/20">
        <CardElement 
          options={{
            style: {
              base: {
                fontSize: '14px',
                color: '#fff',
                '::placeholder': { color: 'rgba(255,255,255,0.4)' },
                fontFamily: 'JetBrains Mono, monospace',
              },
              invalid: { color: '#ef4444' },
            },
          }}
        />
      </div>

      {error && (
        <div className="p-3 border border-red-500/30 bg-red-500/5 text-red-500 text-[10px] uppercase font-bold tracking-widest italic animate-pulse">
          PROTOCOL_ERROR: {error}
        </div>
      )}

      <button
        id="stripe-submit"
        type="button"
        onClick={handleSubmit}
        disabled={!stripe || loading}
        className="hidden" // We'll trigger this from the main checkout button
      >
        Submit
      </button>
    </div>
  );
}
