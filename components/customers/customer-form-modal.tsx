import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { SquishyButton } from '@/components/ui/squishy-button';
import { SquishyInput } from '@/components/ui/squishy-input';
import { useCustomerStore } from '@/store';
import { Customer } from '@/types';

export function CustomerFormModal({ isOpen, onClose, customer }: { isOpen: boolean; onClose: () => void; customer?: Customer }) {
  const addCustomer = useCustomerStore((state) => state.addCustomer);
  const updateCustomer = useCustomerStore((state) => state.updateCustomer);

  const [name, setName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
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
      setError('');
    }
  }, [isOpen, customer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Full Name is required');
      return;
    }

    const now = new Date().toISOString();
    
    if (customer) {
      updateCustomer(customer.id, {
        name: name.trim(),
        idNumber: idNumber.trim() || undefined,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        notes: notes.trim() || undefined,
        updatedAt: now,
      });
    } else {
      addCustomer({
        id: crypto.randomUUID(),
        name: name.trim(),
        idNumber: idNumber.trim() || undefined,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        notes: notes.trim() || undefined,
        createdAt: now,
        updatedAt: now,
      });
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
                    onChange={(e) => { setName(e.target.value); setError(''); }}
                    error={error}
                    placeholder="e.g. Jane Doe"
                    autoFocus
                  />
                  
                  <div>
                    <SquishyInput
                      label="ID / Passport Number"
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                      placeholder="e.g. AB123456"
                    />
                    <p className="text-[10px] text-ps-text-muted mt-1 ml-1 uppercase tracking-wider">Used for loan agreements</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SquishyInput
                      label="Phone Number"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 555-0123"
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
