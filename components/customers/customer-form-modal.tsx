// components/customers/customer-form-modal.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { SquishyButton } from '@/components/ui/squishy-button';
import { SquishyInput } from '@/components/ui/squishy-input';
import { useCustomerStore } from '@/store';
import { Customer } from '@/types';
import { toast } from '@/components/ui/toast-provider';

// SA ID: exactly 13 digits, valid date, valid Luhn checksum
function validateSAID(id: string): boolean {
  if (!/^\d{13}$/.test(id)) return false;
  const month = parseInt(id.substring(2, 4));
  const day = parseInt(id.substring(4, 6));
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    let digit = parseInt(id[i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  const check = (10 - (sum % 10)) % 10;
  return check === parseInt(id[12]);
}

function validateSAPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-]/g, '');
  return /^0[6-8]\d{8}$/.test(cleaned) ||
         /^0[1-5]\d{8}$/.test(cleaned) ||
         /^\+27[6-8]\d{8}$/.test(cleaned);
}

export function CustomerFormModal({ isOpen, onClose, customer }: { isOpen: boolean; onClose: () => void; customer?: Customer }) {
  const addCustomer = useCustomerStore((state) => state.addCustomer);
  const updateCustomer = useCustomerStore((state) => state.updateCustomer);

  const [name, setName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      timer = setTimeout(() => {
        if (customer) {
          setName(customer.name);
          setIdNumber(customer.idNumber || '');
          setPhone(customer.phone || '');
          setEmail(customer.email || '');
          setNotes(customer.notes || '');
        } else {
          setName('');
          setIdNumber('');
          setPhone('');
          setEmail('');
          setNotes('');
        }
        setErrors({});
      }, 0);
    }
    return () => clearTimeout(timer);
  }, [isOpen, customer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Duplicate detection (only on new customers, not edits)
    if (!customer) {
      const allCustomers = useCustomerStore.getState().customers;
      const phoneMatch = phone.trim()
        ? allCustomers.find(c => c.phone?.replace(/[\s\-]/g, '') === phone.trim().replace(/[\s\-]/g, ''))
        : undefined;
      const idMatch = idNumber.trim()
        ? allCustomers.find(c => c.idNumber === idNumber.trim())
        : undefined;
      const existing = phoneMatch ?? idMatch;
      if (existing) {
        const field = phoneMatch ? 'phone number' : 'ID number';
        if (!window.confirm(
          `A customer with this ${field} already exists: "${existing.name}". Create anyway?`
        )) return;
      }
    }

    if (!name.trim()) {
      newErrors.name = 'Full Name is required.';
    }
    if (idNumber.trim() && !/^\d{13}$/.test(idNumber.trim())) {
      newErrors.idNumber = 'Must be exactly 13 digits.';
    } else if (idNumber.trim() && !validateSAID(idNumber.trim())) {
      newErrors.idNumber = 'Invalid SA ID number. Check the digits and try again.';
    }
    if (phone.trim() && !validateSAPhone(phone.trim())) {
      newErrors.phone = 'Enter a valid SA number (e.g. 0821234567 or +27821234567).';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the errors below.');
      return;
    }

    const now = new Date().toISOString();
    if (customer) {
      updateCustomer(customer.id, {
        name: name.trim(), idNumber: idNumber.trim() || undefined,
        phone: phone.trim() || undefined, email: email.trim() || undefined,
        notes: notes.trim() || undefined, updatedAt: now,
      });
      toast.success('Customer details updated.');
    } else {
      addCustomer({
        id: crypto.randomUUID(), name: name.trim(),
        idNumber: idNumber.trim() || undefined, phone: phone.trim() || undefined,
        email: email.trim() || undefined, notes: notes.trim() || undefined,
        createdAt: now, updatedAt: now,
      });
      toast.success('Customer added successfully.');
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-lg bg-ps-bg-elevated border border-white/10 rounded-2xl flex flex-col pointer-events-auto overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5 shrink-0">
                <h2 className="text-xl font-bold text-white">
                  {customer ? 'Edit Customer' : 'Add Customer'}
                </h2>
                <SquishyButton variant="ghost" size="sm" onClick={onClose} className="w-8 h-8 p-0 rounded-full">
                  <X className="w-5 h-5" />
                </SquishyButton>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <form id="customer-form" onSubmit={handleSubmit} className="space-y-4">
                  <SquishyInput
                    label="Full Name *"
                    value={name}
                    error={errors.name}
                    onChange={(e) => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })); }}
                    placeholder="e.g. Jane Doe"
                    autoFocus
                  />

                  <div>
                    <SquishyInput
                      label="ID / Passport Number"
                      value={idNumber}
                      error={errors.idNumber}
                      onChange={(e) => { setIdNumber(e.target.value); setErrors(p => ({ ...p, idNumber: '' })); }}
                      placeholder="e.g. 8501015026082"
                    />
                    <p className="text-[10px] text-ps-text-muted mt-1 ml-1 uppercase tracking-wider">Used for loan agreements</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SquishyInput
                      label="Phone Number"
                      type="tel"
                      value={phone}
                      error={errors.phone}
                      onChange={(e) => { setPhone(e.target.value); setErrors(p => ({ ...p, phone: '' })); }}
                      placeholder="e.g. 0821234567"
                    />
                    <SquishyInput
                      label="Email Address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. jane@example.com"
                    />
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-ps-text-muted">Notes</label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-ps-bg-base border border-white/10 rounded-xl py-3 px-4 text-sm text-white transition-all focus:outline-none focus:ring-2 focus:ring-ps-primary focus:border-ps-primary/50 resize-none"
                      placeholder="Additional information..."
                    />
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-white/5 flex items-center justify-end gap-3 shrink-0">
                <SquishyButton variant="ghost" onClick={onClose}>Cancel</SquishyButton>
                <SquishyButton type="submit" form="customer-form">
                  {customer ? 'Save Changes' : 'Add Customer'}
                </SquishyButton>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
