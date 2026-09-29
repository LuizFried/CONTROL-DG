'use client';

import React, { useState } from 'react';
import { CharacterProgress } from '../types/dungeon';
import { ChevronDown, ChevronUp, CheckCircle2, Shield, User } from 'lucide-react';

interface SimpleCharacterCardProps {
  character: CharacterProgress;
  defaultExpanded?: boolean;
}

export function SimpleCharacterCard({ character, defaultExpanded = false }: SimpleCharacterCardProps) {
  const [isOpen, setIsOpen] = useState(defaultExpanded);
  const isCompleted = character.totalDgs >= character.maxDgs;

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-lg ${
        isCompleted
          ? 'bg-slate-900/90 border-emerald-500/40 shadow-emerald-500/5'
          : 'bg-slate-900/90 border-slate-800 hover:border-indigo-500/40 shadow-black/40'
      }`}
    >
      {/* Top Accent Line */}
      <div
        className={`h-1.5 w-full ${
          isCompleted
            ? 'bg-emerald-500'
            : 'bg-gradient-to-r from-indigo-500 to-purple-500'
        }`}
      />

      {/* Card Header (Clicável para abrir/fechar) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 text-left flex flex-col gap-4 focus:outline-none cursor-pointer group"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg border transition-transform group-hover:scale-105 ${
                isCompleted
                  ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                  : 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400'
              }`}
            >
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                {character.name}
              </h3>
              <p className="text-xs text-slate-400">
                {isCompleted ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Meta concluída (35/35)
                  </span>
                ) : (
                  <span>Restam {character.remaining} DGs para completar</span>
                )}
              </p>
            </div>
          </div>

          {/* Contador de DGs */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="flex items-baseline gap-1 justify-end">
                <span className="text-2xl font-black text-white font-mono">
                  {character.totalDgs}
                </span>
                <span className="text-sm font-semibold text-slate-400">/ 35</span>
              </div>
              <span className="text-[11px] font-medium text-slate-400">DGs feitas</span>
            </div>

            <div className="p-1.5 rounded-lg bg-slate-800 text-slate-400 group-hover:text-white transition-colors">
              {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>
        </div>

        {/* Barra de Progresso até 35 DGs */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Progresso</span>
            <span className="font-mono font-semibold text-slate-300">
              {character.percentage}%
            </span>
          </div>
          <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-750">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isCompleted
                  ? 'bg-emerald-500'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500'
              }`}
              style={{ width: `${Math.min(100, (character.totalDgs / 35) * 100)}%` }}
            />
          </div>
        </div>
      </button>

      {/* Conteúdo Expansível: Pilotos e Quantidade de cada um */}
      {isOpen && (
        <div className="px-5 pb-5 pt-1 border-t border-slate-800/80 bg-slate-950/40 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="pt-3 pb-2 flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-400">
              Pilotos que fizeram DGs
            </span>
            <span>Total: <strong className="text-white">{character.totalDgs}</strong> DGs</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
            {character.pilots.map((pilot) => {
              const pilotPercentage =
                character.totalDgs > 0
                  ? Math.round((pilot.count / character.totalDgs) * 100)
                  : 0;

              return (
                <div
                  key={pilot.pilotName}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                    pilot.count > 0
                      ? 'bg-slate-800/70 border-slate-700/80'
                      : 'bg-slate-800/20 border-slate-800/60 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <p className="font-bold text-sm text-white truncate">
                        {pilot.pilotName}
                      </p>
                      {pilot.count > 0 ? (
                        <p className="text-[10px] text-slate-400 font-mono">
                          {pilotPercentage}% do char
                        </p>
                      ) : (
                        <p className="text-[10px] text-slate-400">0 feitas</p>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-base font-extrabold font-mono ${
                        pilot.count > 0 ? 'text-indigo-300' : 'text-slate-400'
                      }`}
                    >
                      {pilot.count}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">DGs</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
