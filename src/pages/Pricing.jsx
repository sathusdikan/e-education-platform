import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePayment } from '../context/PaymentContext';
import styled from 'styled-components';
import { FaCheck, FaStar, FaCreditCard } from 'react-icons/fa';
import { toast } from 'react-toastify';
import PaymentModal from '../components/Student/PaymentModal';

const PricingContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: #333;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
`;

const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const PlanCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2.5rem;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;
  border: 2px solid ${({ featured, selected }) => 
    featured ? '#667eea' : selected ? '#4CAF50' : 'transparent'};
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.15);
  }
  
  ${({ featured }) => featured && `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    
    * {
      color: white !important;
    }
  `}
`;

const PopularBadge = styled.div`
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  background: #FF9800;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
`;

const PlanHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const PlanName = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
`;

const PlanPrice = styled.div`
  font-size: 3rem;
  font-weight: bold;
  margin: 1rem 0;
`;

const PlanPeriod = styled.div`
  font-size: 1rem;
  opacity: 0.8;
  margin-bottom: 1rem;
`;

const PlanDescription = styled.p`
  text-align: center;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 2rem 0;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 1rem;
`;

const SubscribeButton = styled.button`
  width: 100%;
  background: ${({ featured }) => featured ? 'white' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: ${({ featured }) => featured ? '#667eea' : 'white'};
  border: none;
  padding: 1rem 2rem;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: opacity 0.3s;
  
  &:hover {
    opacity: 0.9;
  }
`;

const BenefitsSection = styled.section`
  margin: 6rem 0;
  text-align: center;
`;

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const BenefitCard = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
`;

const BenefitIcon = styled.div`
  font-size: 3rem;
  color: #667eea;
  margin-bottom: 1rem;
`;

function Pricing() {
  const { user, hasActiveSubscription } = useAuth();
  const { getSubscriptionPlans } = usePayment();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  const plans = getSubscriptionPlans();
  const benefits = [
    { icon: <FaStar />, title: 'Premium Content', desc: 'Access to all video lectures and materials' },
    { icon: <FaCheck />, title: 'Interactive Quizzes', desc: 'Practice with quizzes and final exams' },
    { icon: <FaCreditCard />, title: 'Flexible Plans', desc: 'Choose monthly, quarterly, or yearly plans' }
  ];

  const handleSubscribe = (planId) => {
    if (!user) {
      toast.info('Please login to subscribe');
      return;
    }
    setShowPaymentModal(true);
  };

  return (
    <PricingContainer>
      <Header>
        <Title>Choose Your Plan</Title>
        <Subtitle>
          Unlock unlimited access to all courses, videos, and quizzes. 
          Select the plan that works best for you.
        </Subtitle>
      </Header>

      <PlansGrid>
        {plans.map((plan, index) => {
          const isFeatured = index === 1; // Middle plan is featured
          return (
            <PlanCard key={plan.id} featured={isFeatured}>
              {isFeatured && <PopularBadge>Most Popular</PopularBadge>}
              
              <PlanHeader>
                <PlanName>{plan.name}</PlanName>
                <PlanPrice>${plan.price}</PlanPrice>
                <PlanPeriod>per {plan.period}</PlanPeriod>
                {plan.discount && (
                  <div style={{ color: isFeatured ? '#FFD700' : '#4CAF50', fontWeight: 'bold' }}>
                    {plan.discount}
                  </div>
                )}
              </PlanHeader>

              <PlanDescription>
                {plan.name === 'Monthly Plan' && 'Perfect for trying out our platform'}
                {plan.name === 'Quarterly Plan' && 'Best value with premium features'}
                {plan.name === 'Yearly Plan' && 'Maximum savings and all features'}
              </PlanDescription>

              <FeaturesList>
                {plan.features.map((feature, idx) => (
                  <FeatureItem key={idx}>
                    <FaCheck size={20} />
                    <span>{feature}</span>
                  </FeatureItem>
                ))}
              </FeaturesList>

              <SubscribeButton 
                featured={isFeatured}
                onClick={() => handleSubscribe(plan.id)}
              >
                <FaCreditCard />
                {hasActiveSubscription() ? 'Upgrade Plan' : 'Subscribe Now'}
              </SubscribeButton>
            </PlanCard>
          );
        })}
      </PlansGrid>

      <BenefitsSection>
        <Title>Why Subscribe?</Title>
        <BenefitsGrid>
          {benefits.map((benefit, index) => (
            <BenefitCard key={index}>
              <BenefitIcon>{benefit.icon}</BenefitIcon>
              <h3>{benefit.title}</h3>
              <p>{benefit.desc}</p>
            </BenefitCard>
          ))}
        </BenefitsGrid>
      </BenefitsSection>

      {showPaymentModal && (
        <PaymentModal onClose={() => setShowPaymentModal(false)} />
      )}
    </PricingContainer>
  );
}

export default Pricing;

