import { SubscriptionPlan } from '../types';

// Configuration for Real Banking
const BANK_ID = "MB"; // Military Bank
const ACCOUNT_NO = "86869999269999"; 
const ACCOUNT_NAME = "SAM BA VUONG"; 
const TEMPLATE = "compact2"; // VietQR Template

export const generateVietQRUrl = (plan: SubscriptionPlan, randomCode: string): string => {
  // Extract numeric amount from string like "99.000 đ" -> 99000
  const amountStr = plan.priceVND.replace(/\D/g, '');
  const amount = parseInt(amountStr, 10);
  
  // Content syntax for auto-reconciliation (if backend existed)
  const content = `MF PAY ${plan.code} ${randomCode}`;
  
  // Construct API URL
  // Encode content to handle spaces
  const encodedContent = encodeURIComponent(content);
  
  return `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-${TEMPLATE}.png?amount=${amount}&addInfo=${encodedContent}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;
};

export const formatCurrency = (vndString: string): string => {
  return vndString;
};