'use client'
import type { Metadata } from 'next';
import {QueryClient, QueryClientProvider} from "react-query";
import React from "react";


const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en">
    <QueryClientProvider client={queryClient}>
      <body>{children}</body>
    </QueryClientProvider>
    </html>
  );
}
