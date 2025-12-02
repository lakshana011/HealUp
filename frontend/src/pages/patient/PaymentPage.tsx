import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { CreditCard, Lock, ArrowLeft } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { processPayment } from '@/api/appointmentApi';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { appointment, doctor } = location.state || {};
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });

  // Redirect if no appointment or doctor data
  if (!appointment || !doctor) {
    return (
      <DashboardLayout role="patient" title="Payment">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No appointment data found</p>
          <button
            onClick={() => navigate('/patient/doctors')}
            className="btn-primary"
          >
            Back to Doctors
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const handlePayment = async () => {
    // Basic validation
    if (paymentMethod === 'card') {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
        alert('Please fill in all card details');
        return;
      }
    }

    setIsProcessing(true);
    try {
      const response = await processPayment(appointment.id, doctor.consultationFee || 500);
      if (response.success) {
        navigate(`/patient/confirmation/${appointment.id}`, {
          state: { appointment, doctor }
        });
      } else {
        alert('Payment failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Payment failed:', error);
      alert(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <DashboardLayout role="patient" title="Payment">
      <Link to="/patient/doctors" className="inline-flex items-center gap-2 text-primary mb-6 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      <div className="grid lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Payment Form */}
        <div className="card-elevated p-6">
          <h2 className="font-semibold text-foreground mb-6">Payment Details</h2>
          
          {/* Payment Method */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                  paymentMethod === 'card'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/50'
                }`}
              >
                Credit/Debit Card
              </button>
              <button
                onClick={() => setPaymentMethod('paypal')}
                className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                  paymentMethod === 'paypal'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/50'
                }`}
              >
                PayPal
              </button>
            </div>
          </div>

          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <CreditCard className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="input-field pl-10"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="input-field"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="input-field"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="input-field"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 mt-6 text-sm text-muted-foreground">
            <Lock className="w-4 h-4" />
            <span>Your payment information is secure and encrypted</span>
          </div>
        </div>

        {/* Order Summary */}
        <div className="card-elevated p-6">
          <h2 className="font-semibold text-foreground mb-4">Order Summary</h2>
          
          {doctor && (
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-14 h-14 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-semibold text-foreground">{doctor.name}</h3>
                <p className="text-sm text-primary">{doctor.specialty}</p>
              </div>
            </div>
          )}

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Consultation Fee</span>
              <span className="text-foreground">₹{doctor?.consultationFee || 500}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Service Fee</span>
              <span className="text-foreground">₹50</span>
            </div>
            <div className="flex justify-between font-semibold pt-3 border-t border-border">
              <span className="text-foreground">Total</span>
              <span className="text-foreground">₹{(doctor?.consultationFee || 500) + 50}</span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="btn-primary w-full justify-center"
          >
            {isProcessing ? 'Processing...' : `Pay ₹${(doctor?.consultationFee || 500) + 50}`}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PaymentPage;
