import React, { createContext, useState, useContext } from 'react';
import { paymentService } from '../services/paymentService';

const PaymentContext = createContext({});

export const usePayment = () => useContext(PaymentContext);

export const PaymentProvider = ({ children }) => {
  const [paymentLoading, setPaymentLoading] = useState(false);

  const initiatePayment = async (planId) => {
    setPaymentLoading(true);
    try {
      const response = await paymentService.initiatePayment(planId);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setPaymentLoading(false);
    }
  };

  const verifyPayment = async (paymentId) => {
    try {
      const response = await paymentService.verifyPayment(paymentId);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const getSubscriptionPlans = () => {
    return [
      {
        id: 'basic_monthly',
        name: 'Monthly Plan',
        price: 19.99,
        period: 'month',
        features: [
          'Access to all subjects',
          'Unlimited video lectures',
          'Practice quizzes',
          'Final exams',
          'Progress tracking'
        ]
      },
      {
        id: 'premium_quarterly',
        name: 'Quarterly Plan',
        price: 49.99,
        period: '3 months',
        discount: '17% off',
        features: [
          'Everything in Monthly Plan',
          'Priority support',
          'Downloadable resources',
          'Certificate of completion'
        ]
      },
      {
        id: 'ultimate_yearly',
        name: 'Yearly Plan',
        price: 179.99,
        period: 'year',
        discount: '25% off',
        features: [
          'Everything in Quarterly Plan',
          'One-on-one doubt sessions',
          'Advanced content access',
          'Career guidance'
        ]
      }
    ];
  };

  return (
    <PaymentContext.Provider value={{
      paymentLoading,
      initiatePayment,
      verifyPayment,
      getSubscriptionPlans
    }}>
      {children}
    </PaymentContext.Provider>
  );
};