import React from 'react';

interface LearningModeSelectorProps {
  onModeSelect: (mode: string) => void;
}

const LearningModeSelector: React.FC<LearningModeSelectorProps> = ({ onModeSelect }) => {
  return (
    <div>
      {/*  Buttons removed, navigation handled by landing page */}
    </div>
  );
};

export default LearningModeSelector;
