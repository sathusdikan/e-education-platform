import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { usePayment } from '../../context/PaymentContext';
import { 
  FaTimes, 
  FaCheck, 
  FaCreditCard,
  FaPaypal,
  FaStripe,
  FaLock,
  FaShieldAlt
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 15px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: #333;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const PlansGrid = styled.div`
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const PlanCard = styled.div`
  border: 2px solid ${({ selected }) => selected ? '#667eea' : '#eee'};
  border-radius: 10px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    border-color: #667eea;
  }
`;

const PlanHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
`;

const PlanTitle = styled.h3`
  margin: 0;
`;

const PlanPrice = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
`;

const PlanPeriod = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const PlanFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #666;
`;

const PaymentMethods = styled.div`
  margin: 2rem 0;
`;

const PaymentMethodTitle = styled.h4`
  margin-bottom: 1rem;
`;

const MethodOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
`;

const MethodButton = styled.button`
  background: ${({ selected }) => selected ? '#f0f7ff' : 'white'};
  border: 2px solid ${({ selected }) => selected ? '#667eea' : '#eee'};
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    border-color: #667eea;
  }
`;

const MethodIcon = styled.div`
  font-size: 2rem;
  color: #667eea;
`;

const PaymentButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: opacity 0.3s;
  
  &:hover:not(:disabled) {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SecurityNote = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 1rem;
  color: #666;
  font-size: 0.9rem;
`;

function PaymentModal({ onClose }) {
  const { updateSubscription } = useAuth();
  const { initiatePayment, getSubscriptionPlans, paymentLoading } = usePayment();
  
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  
  const plans = getSubscriptionPlans();

  const handlePayment = async () => {
    if (!selectedPlan) {
      toast.error('Please select a plan');
      return;
    }

    const result = await initiatePayment(selectedPlan.id);
    
    if (result.success) {
      // Simulate successful payment (in real app, this would come from payment gateway callback)
      const subscription = {
        status: 'active',
        plan: selectedPlan.id,
        startDate: new Date().toISOString(),
        expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        paymentMethod: paymentMethod
      };
      
      updateSubscription(subscription);
      toast.success('Payment successful! Subscription activated.');
      onClose();
    } else {
      toast.error(result.message || 'Payment failed');
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Upgrade Your Subscription</ModalTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <PlansGrid>
            {plans.map(plan => (
              <PlanCard
                key={plan.id}
                selected={selectedPlan?.id === plan.id}
                onClick={() => setSelectedPlan(plan)}
              >
                <PlanHeader>
                  <div>
                    <PlanTitle>{plan.name}</PlanTitle>
                    <PlanPeriod>{plan.period}</PlanPeriod>
                  </div>
                  <div>
                    <PlanPrice>${plan.price}</PlanPrice>
                    {plan.discount && (
                      <span style={{ color: '#4CAF50', fontSize: '0.9rem' }}>
                        {plan.discount}
                      </span>
                    )}
                  </div>
                </PlanHeader>
                
                <PlanFeatures>
                  {plan.features.map((feature, index) => (
                    <FeatureItem key={index}>
                      <FaCheck size={12} color="#4CAF50" />
                      {feature}
                    </FeatureItem>
                  ))}
                </PlanFeatures>
              </PlanCard>
            ))}
          </PlansGrid>

          <PaymentMethods>
            <PaymentMethodTitle>Select Payment Method</PaymentMethodTitle>
            <MethodOptions>
              <MethodButton
                selected={paymentMethod === 'stripe'}
                onClick={() => setPaymentMethod('stripe')}
              >
                <MethodIcon><FaStripe /></MethodIcon>
                <span>Stripe</span>
              </MethodButton>
              
              <MethodButton
                selected={paymentMethod === 'paypal'}
                onClick={() => setPaymentMethod('paypal')}
              >
                <MethodIcon><FaPaypal /></MethodIcon>
                <span>PayPal</span>
              </MethodButton>
              
              <MethodButton
                selected={paymentMethod === 'card'}
                onClick={() => setPaymentMethod('card')}
              >
                <MethodIcon><FaCreditCard /></MethodIcon>
                <span>Card</span>
              </MethodButton>
            </MethodOptions>
          </PaymentMethods>

          <PaymentButton 
            onClick={handlePayment}
            disabled={!selectedPlan || paymentLoading}
          >
            <FaLock />
            {paymentLoading ? 'Processing...' : `Pay $${selectedPlan?.price || '--'}`}
          </PaymentButton>

          <SecurityNote>
            <FaShieldAlt />
            Your payment is secure and encrypted
          </SecurityNote>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
}

export default PaymentModal;