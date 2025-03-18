import React from 'react';

interface MainMenuTitleProps {
  title: string;
  subtitle?: string;
}

export function MainMenuTitle({ title, subtitle }: MainMenuTitleProps) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-primary mb-2">{title}</h1>
      {subtitle && <p className="text-xl text-gray-600">{subtitle}</p>}
    </div>
  );
}
