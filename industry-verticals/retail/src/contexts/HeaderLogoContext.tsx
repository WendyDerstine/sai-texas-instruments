'use client';

import React, { createContext, useContext } from 'react';

const HeaderLogoContext = createContext<boolean>(false);

export function HeaderLogoProvider({
  children,
  value = true,
}: {
  children: React.ReactNode;
  value?: boolean;
}): React.ReactElement {
  return <HeaderLogoContext.Provider value={value}>{children}</HeaderLogoContext.Provider>;
}

export function useHeaderLogo(): boolean {
  return useContext(HeaderLogoContext);
}
