import React, { createContext, useContext, useState, useCallback } from 'react';

export type FeedbackType = 'trial' | 'enroll' | 'success';

export interface FeedbackNotice {
  id: string;
  type: FeedbackType;
  title: string;
  message: string;
  details?: string;
}

interface FeedbackContextType {
  activeFeedback: FeedbackNotice | null;
  triggerTrialFeedback: (productName?: string) => void;
  triggerEnrollFeedback: (courseTitle?: string) => void;
  showFeedback: (notice: Omit<FeedbackNotice, 'id'>) => void;
  dismissFeedback: () => void;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeFeedback, setActiveFeedback] = useState<FeedbackNotice | null>(null);

  const showFeedback = useCallback((notice: Omit<FeedbackNotice, 'id'>) => {
    const id = `feedback-${Date.now()}`;
    setActiveFeedback({ ...notice, id });

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setActiveFeedback((current) => (current?.id === id ? null : current));
    }, 4000);
  }, []);

  const triggerTrialFeedback = useCallback((productName: string = 'TecHisab Software') => {
    showFeedback({
      type: 'trial',
      title: 'Demo Walkthrough Requested',
      message: `Preparing onboarding inquiry details for ${productName}.`,
      details: 'Complete the consultation form or connect via WhatsApp for guided access.'
    });
  }, [showFeedback]);

  const triggerEnrollFeedback = useCallback((courseTitle: string = 'Professional Training') => {
    showFeedback({
      type: 'enroll',
      title: 'Enrollment Inquiry Prepared',
      message: `Application details initialized for: ${courseTitle}.`,
      details: 'Submit your preferred schedule to receive batch timings from our Chittagong academy.'
    });
  }, [showFeedback]);

  const dismissFeedback = useCallback(() => {
    setActiveFeedback(null);
  }, []);

  return (
    <FeedbackContext.Provider
      value={{
        activeFeedback,
        triggerTrialFeedback,
        triggerEnrollFeedback,
        showFeedback,
        dismissFeedback
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = (): FeedbackContextType => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};
