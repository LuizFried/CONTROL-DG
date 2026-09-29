'use client';

import React, { useEffect } from 'react';
import { X, Database, Copy, Check, ExternalLink } from 'lucide-react';

interface AirtableGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AirtableGuideModal({ isOpen, onClose }: AirtableGuideModalProps) {
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-750 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Como Vincular seu Airtable
              </h2>
              <p className="text-xs text-slate-400">
                Guia rápido com seus personagens e pilotos
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo com scroll */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
          {/* Passo 1 */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-750 space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-500 text-white font-bold flex items-center justify-center text-[11px]">
                1
              </span>
              <h3 className="font-bold text-white text-sm">
                Sua Tabela no Airtable
              </h3>
            </div>
            <p className="text-slate-400">
              Crie uma tabela chamada <code className="text-indigo-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-750">DGs</code> no{' '}
              <a
                href="https://airtable.com"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 hover:underline inline-flex items-center gap-0.5"
              >
                airtable.com <ExternalLink className="w-3 h-3" />
              </a>{' '}
              com apenas estas 3 colunas:
            </p>

            <div className="rounded-lg border border-slate-700 bg-slate-950 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/70 text-slate-400 font-semibold border-b border-slate-700">
                  <tr>
                    <th className="py-2 px-3">Coluna (Field)</th>
                    <th className="py-2 px-3">Tipo</th>
                    <th className="py-2 px-3">Valores permitidos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  <tr>
                    <td className="py-2 px-3 text-indigo-300 font-bold">Personagem</td>
                    <td className="py-2 px-3 text-slate-400 font-sans">Texto</td>
                    <td className="py-2 px-3 text-slate-300 font-sans">
                      <strong>Soulreaper</strong>, <strong>Crash</strong>, <strong>Romero</strong> ou <strong>Piratex</strong>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-indigo-300 font-bold">Quem Fez</td>
                    <td className="py-2 px-3 text-slate-400 font-sans">Texto</td>
                    <td className="py-2 px-3 text-slate-300 font-sans">
                      <strong>Hell</strong>, <strong>Velax</strong>, <strong>Beats</strong> ou <strong>Tuzão</strong>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-indigo-300 font-bold">Quantidade</td>
                    <td className="py-2 px-3 text-slate-400 font-sans">Número</td>
                    <td className="py-2 px-3 text-slate-300 font-sans">Quantas DGs foram feitas (ex: <i>1</i>, <i>5</i>)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Passo 2 */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-750 space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-500 text-white font-bold flex items-center justify-center text-[11px]">
                2
              </span>
              <h3 className="font-bold text-white text-sm">
                Pegar seu Token e Base ID
              </h3>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
              <li>
                <strong>Token:</strong> Acesse{' '}
                <a
                  href="https://airtable.com/create/tokens"
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-400 hover:underline"
                >
                  airtable.com/create/tokens
                </a>
                , clique em <i>Create new token</i>, adicione o scope <code>data.records:read</code> e selecione sua base.
              </li>
              <li>
                <strong>Base ID:</strong> Olhe a URL da sua base aberta no navegador (ex:{' '}
                <code className="text-amber-300">https://airtable.com/appXXXXXXXXXXXXXX/...</code>). O código <code className="text-amber-300">app...</code> é o Base ID.
              </li>
            </ul>
          </div>

          {/* Passo 3 */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-750 space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-500 text-white font-bold flex items-center justify-center text-[11px]">
                3
              </span>
              <h3 className="font-bold text-white text-sm">
                Colar as Variáveis no .env.local ou na Vercel
              </h3>
            </div>
            <div className="relative rounded-lg bg-slate-950 p-3 font-mono text-xs border border-slate-800 text-slate-300">
              <pre>
{`AIRTABLE_API_KEY=patSeuToken...
AIRTABLE_BASE_ID=appSeuBaseId...
AIRTABLE_TABLE_NAME=DGs`}
              </pre>
              <button
                onClick={() =>
                  copyToClipboard(
                    'AIRTABLE_API_KEY=patSeuToken...\nAIRTABLE_BASE_ID=appSeuBaseId...\nAIRTABLE_TABLE_NAME=DGs',
                    'env'
                  )
                }
                className="absolute top-2 right-2 p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Copiar"
              >
                {copiedKey === 'env' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
