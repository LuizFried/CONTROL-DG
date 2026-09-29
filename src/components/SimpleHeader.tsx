'use client';

import React from 'react';
import { Swords, RefreshCw, AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react';

interface SimpleHeaderProps {
  isMock: boolean;
  isLoading: boolean;
  onRefresh: () => void;
  onOpenGuide: () => void;
}

export function SimpleHeader({
  isMock,
  isLoading,
  onRefresh,
  onOpenGuide,
}: SimpleHeaderProps) {
  return (
    <header className="border-b border-slate-800 bg-[#0d1322]/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Logo & Título */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              DG Tracker
              <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                0/35 DGs
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Progresso dos Personagens & Pilotos
            </p>
          </div>
        </div>

        {/* Status e Ações */}
        <div className="flex items-center gap-2.5">
          {/* Status do Airtable */}
          {isMock ? (
            <button
              onClick={onOpenGuide}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
              title="Clique para ver como vincular sua base do Airtable"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Modo Exemplo</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Airtable Conectado</span>
            </div>
          )}

          {/* Guia */}
          <button
            onClick={onOpenGuide}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750 transition-colors"
            title="Como configurar o Airtable"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Atualizar */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Carregando...' : 'Atualizar'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
