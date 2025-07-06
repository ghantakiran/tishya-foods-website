'use client';
import React from 'react';
import Link from 'next/link';

export default function ProductsError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#fff8f0' }}>
        <h1 style={{ color: '#b91c1c', fontSize: '2rem', marginBottom: '1rem' }}>Product Page Error</h1>
        <p style={{ color: '#333', marginBottom: '2rem' }}>{error.message || 'An error occurred while loading products.'}</p>
        <button onClick={reset} style={{ background: '#f59e42', color: '#fff', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '0.5rem', fontSize: '1rem', cursor: 'pointer', marginBottom: '1rem' }}>
          Try Again
        </button>
        <Link href="/products">
          <span style={{ color: '#2563eb', textDecoration: 'underline', cursor: 'pointer' }}>Back to Products</span>
        </Link>
      </body>
    </html>
  );
} 