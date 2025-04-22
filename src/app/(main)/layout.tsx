import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen">
      <div className="flex w-full h-full">
        {children}
      </div>
    </div>
  )
}

export default MainLayout