'use client';

import { useEffect } from 'react';
import { SceneLayout } from '@/components/SceneLayout';
import { NicknameForm } from '@/components/NicknameForm';
import { Octopus } from '@/components/Octopus/Octopus';
import { useOctopusStore } from '@/lib/store';

export default function Home() {
  const loadUsers = useOctopusStore((state) => state.loadUsers);

  // Загружаем пользователей при первом запуске
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <SceneLayout>
      <NicknameForm />
      <Octopus />
    </SceneLayout>
  );
}