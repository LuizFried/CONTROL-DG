'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SimpleHeader } from '@/components/SimpleHeader';
import { SimpleCharacterCard } from '@/components/SimpleCharacterCard';
import { AirtableGuideModal } from '@/components/AirtableGuideModal';
import { SimpleDashboardData } from '@/types/dungeon';
import { CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export default function SimpleDashboardPage() {
  const [data, setData] = useState<SimpleDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Função para carregar os dados
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/dungeons');
      if (!res.ok) throw new Error('Falha ao obter dados');
      const json: SimpleDashboardData = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    // Busca assíncrona inicial
    const fetchData = async () => {
      try {
        const res = await fetch('/api/dungeons');
        if (!res.ok) throw new Error('Falha');
        const json: SimpleDashboardData = await res.json();
        if (isMounted) setData(json);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();

    // Sincronização periódica a cada 30s
    const interval = setInterval(fetchData, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const totalDgs = data?.totalDgs || 0;
  const maxTotalDgs = data?.maxTotalDgs || 140; // 4 * 35 = 140
  const totalPercentage = Math.round((totalDgs / maxTotalDgs) * 100);

  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col text-slate-100">
      {/* Header Minimalista */}
      <SimpleHeader
        isMock={data?.isMock ?? true}
        isLoading={isLoading}
        onRefresh={loadData}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Aviso de Modo Demonstração (Se o Airtable ainda não estiver conectado) */}
        {data?.isMock && !isLoading && (
          <div className="rounded-xl p-3.5 bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-300">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>
                Visualizando dados de exemplo para <strong>Soulreaper, Crash, Romero e Mardovik</strong>.
              </span>
            </div>
            <button
              onClick={() => setIsGuideOpen(true)}
              className="text-xs font-semibold text-amber-300 hover:text-white underline inline-flex items-center gap-1 shrink-0"
            >
              <span>Vincular com meu Airtable</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Barra de Progresso Geral das 140 DGs (35 x 4) */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Progresso Geral da Equipe
              </span>
              {totalDgs >= maxTotalDgs && (
                <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> 100% Concluído
                </span>
              )}
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono">
                {totalDgs}
              </span>
              <span className="text-sm font-semibold text-slate-400">
                / {maxTotalDgs} DGs
              </span>
              <span className="text-xs text-indigo-400 font-mono ml-1 font-semibold">
                ({totalPercentage}%)
              </span>
            </div>
          </div>

          <div className="w-full sm:w-64 space-y-1.5">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Restantes</span>
              <span className="font-mono text-slate-200">
                {Math.max(0, maxTotalDgs - totalDgs)} DGs
              </span>
            </div>
            <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-750">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, totalPercentage)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Instrução Simples */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>Clique em qualquer personagem para ver a quantidade de cada piloto:</span>
          <span className="text-[11px] text-slate-400">Pilotos: Hell • Velax • Beats • Tuzão</span>
        </div>

        {/* Grid dos Cards de Personagens (Soulreaper, Crash, Romero, Piratex) */}
        {!data && isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
            <div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs">Carregando personagens...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data?.characters.map((char, index) => (
              <SimpleCharacterCard
                key={char.name}
                character={char}
                defaultExpanded={index === 0}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal Guia Airtable */}
      <AirtableGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Footer Minimalista */}
      <footer className="border-t border-slate-800/80 bg-[#090d16] py-4 text-center text-xs text-slate-400">
        <p>DG Tracker • 35 DGs por Personagem • Sincronizado com Airtable</p>
      </footer>
    </div>
  );
}
