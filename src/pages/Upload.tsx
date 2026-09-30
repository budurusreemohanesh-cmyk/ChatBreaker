import React from 'react';
import { Dropzone } from '@/components/upload/Dropzone';
import { PrivacyNotice } from '@/components/upload/PrivacyNotice';

export const Upload: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase font-mono font-semibold tracking-wider text-neutral-500">
          SECURE IMPORT
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900">
          Upload WhatsApp Export
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
          Drag and drop your exported <code>.txt</code> file to analyze messages instantly in your browser.
        </p>
      </div>

      <Dropzone />
      <PrivacyNotice />
    </div>
  );
};
