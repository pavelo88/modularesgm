'use client';

import React, { useState, useId } from 'react';
import Link from 'next/link';
import { ArrowRight, Calculator, Sparkles, TrendingUp, Users, DollarSign, CheckCircle2 } from 'lucide-react';
import { DEFAULT_AFFILIATE_SETTINGS } from '@/lib/affiliate-core';

interface CommissionSimulatorProps {
  initialTicket?: number;
  initialReferrals?: number;
}

export function CommissionSimulator({
  initialTicket = 3200,
  initialReferrals = 3,
}: CommissionSimulatorProps) {
  const [ticket, setTicket] = useState(initialTicket); // Promedio de venta por proyecto en USD
  const [referrals, setReferrals] = useState(initialReferrals); // Clientes referidos al mes
  const [networkReferrals, setNetworkReferrals] = useState(2); // Amigos que recomiendan en tu red (Nivel 2)

  const ticketInputId = useId();
  const referralsInputId = useId();
  const networkInputId = useId();

  // Tasas del Plan Oficial 10-3-2 de Modulares GM
  const directRate = DEFAULT_AFFILIATE_SETTINGS.sellerRate / 100; // 10%
  const parentRate = DEFAULT_AFFILIATE_SETTINGS.parentRate / 100; // 3%
  const customerDiscount = DEFAULT_AFFILIATE_SETTINGS.customerDiscount; // 5%

  // Cálculos matemáticos
  const directCommissionPerSale = ticket * directRate;
  const monthlyDirectIncome = directCommissionPerSale * referrals;
  const monthlyNetworkIncome = ticket * parentRate * (networkReferrals * 2); // Asumiendo 2 ventas promedio por persona en red
  const totalMonthlyEarnings = monthlyDirectIncome + monthlyNetworkIncome;
  const annualProjectedEarnings = totalMonthlyEarnings * 12;

  // Ejemplos contextuales según ticket
  const getProjectExample = (amount: number) => {
    if (amount < 1500) return 'Vanity de baño de lujo o mueble de TV';
    if (amount < 2800) return 'Clóset vestidor boutique o mesón de cuarzo';
    if (amount < 4500) return 'Cocina integral modular en Pelikano RH con isla';
    return 'Remodelación completa de cocina + mesones de cuarzo + clósets';
  };

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-amber-500/30 bg-gradient-to-b from-[#14181F] via-[#0E1116] to-[#0A0C0F] p-6 sm:p-10 lg:p-12 text-white shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
      {/* Glows ambientales sutiles */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />

      {/* Header del Simulador */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-amber-400 mb-2.5">
            <Calculator size={13} />
            <span>Simulador Interactivo de Ganancias</span>
          </div>
          <h3 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Calcula cuánto dinero puedes ganar al mes
          </h3>
          <p className="mt-1.5 text-xs sm:text-sm text-stone-300">
            Basado en el <strong className="text-amber-400 font-semibold">Plan Oficial 10-3-2</strong> de Modulares GM. Sin topes ni límites de retiro.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md">
          <Sparkles className="text-amber-400" size={18} />
          <div className="text-right sm:text-left">
            <span className="block text-[10px] uppercase tracking-wider text-stone-400 font-bold">Comisión Directa</span>
            <span className="font-headline text-lg font-extrabold text-amber-400">10% por venta</span>
          </div>
        </div>
      </div>

      {/* Cuerpo del Simulador en 2 Columnas */}
      <div className="relative z-10 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Columna Izquierda: Sliders Controles */}
        <div className="lg:col-span-7 space-y-6">
          {/* Slider 1: Ticket Promedio */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition-all hover:border-white/20">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor={ticketInputId} className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <DollarSign size={16} className="text-amber-400" />
                Valor promedio del proyecto recomendado
              </label>
              <span className="font-headline text-lg sm:text-xl font-extrabold text-amber-400">
                ${ticket.toLocaleString('es-EC')} <span className="text-xs text-stone-400 font-normal">USD</span>
              </span>
            </div>
            
            <p className="text-[11px] text-stone-400 mb-4 flex items-center gap-1.5">
              <span className="text-amber-400">↳</span> Proyecto típico: <strong className="text-stone-200">{getProjectExample(ticket)}</strong>
            </p>

            <input
              id={ticketInputId}
              type="range"
              min="800"
              max="8000"
              step="100"
              value={ticket}
              onChange={(e) => setTicket(Number(e.target.value))}
              className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-400 transition-all"
            />
            <div className="flex justify-between text-[10px] text-stone-500 mt-2 font-mono">
              <span>$800 (Baño/Mesón)</span>
              <span>$3,200 (Cocina)</span>
              <span>$8,000 (Casa Completa)</span>
            </div>
          </div>

          {/* Slider 2: Número de Clientes Recomendados al Mes */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition-all hover:border-white/20">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor={referralsInputId} className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp size={16} className="text-amber-400" />
                Clientes que compran con tu código / mes
              </label>
              <span className="font-headline text-lg sm:text-xl font-extrabold text-amber-400">
                {referrals} {referrals === 1 ? 'cliente' : 'clientes'}
              </span>
            </div>

            <p className="text-[11px] text-stone-400 mb-4">
              Cada cliente recibe <strong className="text-emerald-400">{customerDiscount}% de descuento</strong> inmediato por usar tu enlace.
            </p>

            <input
              id={referralsInputId}
              type="range"
              min="1"
              max="10"
              step="1"
              value={referrals}
              onChange={(e) => setReferrals(Number(e.target.value))}
              className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-400 transition-all"
            />
            <div className="flex justify-between text-[10px] text-stone-500 mt-2 font-mono">
              <span>1 venta/mes</span>
              <span>3 ventas/mes</span>
              <span>5 ventas/mes</span>
              <span>10 ventas/mes</span>
            </div>
          </div>

          {/* Slider 3: Equipo / Red Referidos Opcional (Nivel 2) */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition-all hover:border-white/20">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor={networkInputId} className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <Users size={16} className="text-amber-400" />
                Afiliados invitados a tu red (Ganas 3% de sus ventas)
              </label>
              <span className="font-headline text-lg sm:text-xl font-extrabold text-amber-400">
                {networkReferrals} {networkReferrals === 1 ? 'afiliado' : 'afiliados'}
              </span>
            </div>

            <input
              id={networkInputId}
              type="range"
              min="0"
              max="8"
              step="1"
              value={networkReferrals}
              onChange={(e) => setNetworkReferrals(Number(e.target.value))}
              className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-400 transition-all"
            />
            <div className="flex justify-between text-[10px] text-stone-500 mt-2 font-mono">
              <span>0 (Solo ventas tuyas)</span>
              <span>4 afiliados</span>
              <span>8 afiliados</span>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Tarjeta de Resultados Destacados (Luxury Card) */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl border border-amber-500/40 bg-gradient-to-b from-[#1E2530] via-[#161B22] to-[#10141A] p-6 sm:p-8 shadow-[0_20px_50px_rgba(245,158,11,0.15)]">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
                Tus Ganancias Estimadas
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                Retiros a tu banco
              </span>
            </div>

            {/* Total Mensual */}
            <div className="mt-6">
              <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold block">
                Ingreso Mensual Estimado
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-headline text-4xl sm:text-5xl font-black text-white tracking-tight">
                  ${Math.round(totalMonthlyEarnings).toLocaleString('es-EC')}
                </span>
                <span className="text-sm font-semibold text-amber-400">USD / mes</span>
              </div>
            </div>

            {/* Proyección Anual */}
            <div className="mt-4 rounded-xl bg-white/5 border border-white/10 p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-300">Proyección Anual:</span>
                <span className="font-headline text-base sm:text-lg font-bold text-amber-400">
                  ${Math.round(annualProjectedEarnings).toLocaleString('es-EC')} USD
                </span>
              </div>
            </div>

            {/* Desglose de Ganancias */}
            <div className="mt-6 space-y-2.5 text-xs text-stone-300">
              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-amber-400" />
                  Por cada cocina de ${ticket}:
                </span>
                <strong className="text-white">${Math.round(directCommissionPerSale)} USD</strong>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-amber-400" />
                  Tus {referrals} ventas directas (10%):
                </span>
                <strong className="text-white">${Math.round(monthlyDirectIncome)} USD</strong>
              </div>
              {networkReferrals > 0 && (
                <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-amber-400" />
                    Bono Red ({networkReferrals} afiliados x 3%):
                  </span>
                  <strong className="text-amber-300">+${Math.round(monthlyNetworkIncome)} USD</strong>
                </div>
              )}
            </div>
          </div>

          {/* Botón de Registro Rápido */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <Link
              href="/afiliados/acceso?tab=registro"
              className="group relative inline-flex w-full h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-extrabold text-sm uppercase tracking-wider shadow-[0_10px_25px_-5px_rgba(245,158,11,0.4)] transition-all duration-200 active:scale-95"
            >
              <span>Empezar a Ganar Ahora</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <p className="mt-2.5 text-center text-[10px] text-stone-400">
              Sin cuotas de inscripción ni compras mínimas. 100% gratuito.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
