'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOctopusStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Check, AlertCircle, Loader2, Share2 } from 'lucide-react';

export function NicknameForm() {
  const [nickname, setNickname] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const { addNickname, nicknames, clearError, isLoading, getUserStatus, userStatuses } = useOctopusStore();

  // Проверяем дубликаты в реальном времени
  const isDuplicate = nicknames.some(n => n.toLowerCase() === nickname.trim().toLowerCase());
  
  // Проверяем статус пользователя
  const userStatus = getUserStatus(nickname.trim());
  const isRegistered = userStatus?.status === 'registered';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || isSubmitting) return;

    // Валидация и санитизация входных данных
    const sanitizedNickname = nickname.trim().slice(0, 50);
    if (sanitizedNickname.length === 0) return;

    setIsSubmitting(true);
    setShowError(false);
    clearError();

    const result = await addNickname(sanitizedNickname);
    
    if (!result.success) {
      setErrorMessage(result.error || 'Failed to add nickname');
      setShowError(true);
    }
    
    setTimeout(() => setIsSubmitting(false), 800);
  };

  // Скрываем ошибку при изменении никнейма
  useEffect(() => {
    if (showError) {
      setShowError(false);
    }
  }, [nickname]);

  // Автозаполняем поле последним зарегистрированным никнеймом из localStorage
  useEffect(() => {
    if (nickname.trim()) return;
    const lastRegistered = [...userStatuses]
      .filter((s) => s.status === 'registered')
      .sort((a, b) => b.timestamp - a.timestamp)[0]?.nickname;
    if (lastRegistered) {
      setNickname(lastRegistered);
    }
  }, [userStatuses]);

  const handleShareToTwitter = () => {
    const lastRegistered = [...userStatuses]
      .filter((s) => s.status === 'registered')
      .sort((a, b) => b.timestamp - a.timestamp)[0]?.nickname || '';
    const nameForShare = (nickname.trim() || lastRegistered).slice(0, 50);
    if (!nameForShare) return;
    const text = `gRE! Just connected to the @re Octopus! 🐙 My nickname: @${nameForShare}. Go to https://www.re-connect.xyz and claim your sweet spot!`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      className="absolute top-6 right-6 md:top-8 md:right-8 z-20 max-md:left-1/2 max-md:right-auto max-md:top-4 max-md:-translate-x-1/2"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.6 }}
    >
      <div className="bg-black border border-gray-800 rounded-2xl p-4 shadow-2xl">
        {/* Logo and Connect text */}
        <div className="flex items-end mb-3">
          <img 
            src="/logo.jpg" 
            alt="Logo" 
            className="w-12 h-12"
          />
          <span className="text-white font-black font-bold text-xl pb-[7px] tracking-wider">
            CONNECT
          </span>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-3 items-center">
            <div className="relative">
              <Input
                type="text"
                placeholder="X handle(without @)..."
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className={`w-48 max-md:w-full bg-gray-900 border-gray-700 focus:border-white text-white placeholder:text-gray-400 rounded-xl ${
                  isDuplicate && !isRegistered ? 'border-red-500 focus:border-red-400' : ''
                }`}
                aria-label="Nickname input"
              />
            </div>
            {isRegistered ? (
              <Button
                type="button"
                onClick={handleShareToTwitter}
                className="bg-black hover:bg-gray-800 border border-gray-600 text-white rounded-xl px-4 py-2 transition-colors font-semibold"
                aria-label="Share to Twitter"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!nickname.trim() || isSubmitting || isDuplicate || isLoading}
                className="bg-white hover:bg-gray-200 disabled:bg-gray-600 text-black rounded-xl px-4 py-2 transition-colors font-semibold"
                aria-label="Add nickname"
              >
                <AnimatePresence mode="wait">
                  {isSubmitting || isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="plus"
                      initial={{ scale: 0, rotate: 90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: -90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Plus className="w-4 h-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            )}
          </div>
          
          {/* Уведомления */}
          <AnimatePresence>
            {isRegistered && nickname.trim() && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 text-green-400 text-sm"
              >
                <Check className="w-4 h-4" />
                <span>You're already registered! Share your connection.</span>
              </motion.div>
            )}
            
            {isDuplicate && !isRegistered && nickname.trim() && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 text-red-400 text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                <span>Your nickname is already in the database</span>
              </motion.div>
            )}
            
            {showError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 text-red-400 text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </motion.div>
  );
}