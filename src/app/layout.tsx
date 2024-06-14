import React, { ReactNode } from 'react';
import Providers from 'store/Providers';
import AppWrappers from './AppWrappers';
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import '@asseinfo/react-kanban/dist/styles.css';
// import '/public/styles/Plugins.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <Providers
    >
      {/* hell */}
       <html lang="en">
      <body id={'root'}>
        <AppWrappers>{children}</AppWrappers>
        <ToastContainer />
      </body>
    </html>
    </Providers>
   
  );
}
