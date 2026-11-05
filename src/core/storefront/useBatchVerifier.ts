'use client';

import { useState, useCallback } from 'react';
import { AuthenticityComparisonData } from '@/modules/blocks/types';

export interface BatchVerificationDetails {
  isVerified: boolean;
  brand?: string;
  productName?: string;
  batchCode?: string;
  manufactureDate?: string;
  shelfLife?: string;
  statusNotes?: string;
  inspectionChecklist?: string[];
}

export interface BatchVerificationResult {
  success: boolean;
  verification?: BatchVerificationDetails;
  guide?: AuthenticityComparisonData;
  message?: string;
}

export function useBatchVerifier(options?: { apiEndpoint?: string }) {
  const apiEndpoint = options?.apiEndpoint || '/api/store/authenticity';

  const [batchCode, setBatchCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<BatchVerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setBatchCode('');
    setResult(null);
    setError(null);
    setIsVerifying(false);
  }, []);

  const verify = useCallback(
    async (codeToVerify?: string): Promise<BatchVerificationResult | null> => {
      const code = (codeToVerify !== undefined ? codeToVerify : batchCode).trim();
      if (!code) {
        setError('يرجى كتابة اسم المستحضر للتحقق من علامات الأصلي');
        return null;
      }

      setIsVerifying(true);
      setError(null);

      try {
        const res = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ batchCode: code, query: code, productName: code }),
        });
        const data = await res.json();

        if (data.success && data.verification) {
          const resObj: BatchVerificationResult = {
            success: true,
            verification: data.verification,
          };
          setResult(resObj);
          return resObj;
        } else {
          const resObj: BatchVerificationResult = {
            success: false,
            message: data.message || 'المستحضر غير مسجل أو يرجى التأكد من كتابة الاسم بشكل صحيح',
          };
          setResult(resObj);
          return resObj;
        }
      } catch (err) {
        const errMsg = 'تعذر الاتصال بمركز فحص الأصالة، يرجى المحاولة لاحقاً';
        setError(errMsg);
        return null;
      } finally {
        setIsVerifying(false);
      }
    },
    [batchCode, apiEndpoint]
  );

  return {
    batchCode,
    setBatchCode,
    verify,
    isVerifying,
    result,
    error,
    reset,
  };
}
