import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useChaos } from '../context/ChaosContext';
import { CookieWallModal } from '../components/CookieWallModal';
import { StrobeWarning } from '../components/StrobeWarning';
import { Shield, BookOpen, FileCheck, ArrowRight } from 'lucide-react';

export const Landing: React.FC = () => {
  const { vowelFilter, startDialUp, isDialUpPlaying, recordRageClick, toggleMosquito, isMosquitoDroning } = useChaos();
  const [fleeOffset, setFleeOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleFlee = () => {
    const randomX = Math.floor(Math.random() * 240) - 120;
    const randomY = Math.floor(Math.random() * 140) - 70;
    setFleeOffset({ x: randomX, y: randomY });
    recordRageClick('cta_flee_seed');
  };

  return (
    <div className="min-h-screen bg-forester-dark text-parchment-drab relative overflow-hidden select-none pb-20">
      <CookieWallModal />

      {/* Top Gazette Bulletin */}
      <div className="bg-peat-dark text-lichen-stone font-mono text-[11px] py-1.5 px-4 overflow-hidden border-b border-bureau-green">
        <div className="animate-slow-marquee whitespace-nowrap">
          OFFICIAL GAZETTE: ANNUAL ARABLE LAND INVENTORY COMMISSION // SEED COMPLIANCE AUDITS MANDATORY UNDER EXECUTIVE STATUTE 14-B // ALL AGRICULTURAL DATA VERIFIED VIA GOOGLE GEMINI 2.5 FLASH SDK
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-8">
        <StrobeWarning />

        {/* Hero Section */}
        <div className="border border-bureau-green p-6 md:p-12 my-6 bg-peat-dark relative shadow-md">
          <div className="inline-block bg-forester-dark text-regulatory-gold font-mono text-xs px-3 py-1 border border-regulatory-gold/60 mb-4 tracking-wider">
            § {vowelFilter('OFFICIAL CASE STUDY IN ADVERSARIAL ENVIRONMENTAL COMPLIANCE')}
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-parchment-drab mb-5 tracking-tight leading-tight">
            <span>{vowelFilter('DEPARTMENT OF AGRONOMIC STANDARDS')}</span>
            <span className="block text-xl sm:text-3xl md:text-4xl text-regulatory-gold mt-2 font-mono font-normal">
              {vowelFilter('CROP ADVISORY & PUNITIVE ENVIRONMENTAL AUDIT')}
            </span>
          </h1>

          <p className="text-parchment-muted font-mono text-xs sm:text-sm max-w-3xl leading-relaxed mb-8 border-l-2 border-regulatory-gold pl-4 bg-forester-dark/70 py-3">
            {vowelFilter(
              'A production-grade, state-supervised agronomy infrastructure executing scientifically certified crop diagnosis and soil nutrient remediation via Google Gemini 2.5 Flash—while subjecting the agricultural applicant to strict administrative latency, evasive controls, and exhausting regulatory dark patterns.'
            )}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="relative">
              <Link
                to="/advisory/new"
                onMouseEnter={handleFlee}
                style={{
                  transform: `translate(${fleeOffset.x}px, ${fleeOffset.y}px)`,
                  transition: 'transform 0.12s ease-out',
                }}
                className="inline-block bg-bureau-green hover:bg-officer-moss text-parchment-drab font-mono font-bold text-sm px-7 py-3.5 border border-regulatory-gold shadow-sm cursor-pointer"
              >
                {vowelFilter('Submit Crop Parameters for Audit (Form 14)')} →
              </Link>
            </div>

            <Link
              to="/dashboard"
              className="bg-forester-dark hover:bg-peat-dark text-parchment-drab font-mono text-xs sm:text-sm px-5 py-3.5 border border-bureau-green"
            >
              {vowelFilter('Access Soil Telemetry Hub')}
            </Link>

            <button
              onClick={toggleMosquito}
              className="bg-forester-dark hover:bg-peat-dark text-lichen-stone font-mono text-xs px-3.5 py-3 border border-bureau-green/60"
            >
              {isMosquitoDroning ? '🦟 Silence Field Ambience' : '🦟 Enable Field Ambience'}
            </button>
          </div>
        </div>

        {/* Bureaucratic Metrics Table */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6">
          {[
            { label: 'Erosion Runoff Probability', val: '98.4%', code: 'REG-14' },
            { label: 'Topsoil Leaching Index', val: '24.2 t/ha', code: 'ANNEX-IX' },
            { label: 'Administrative Empathy Index', val: '0.00%', code: 'STATUTE-0' },
            { label: 'Gemini AI Advisory Status', val: 'ACTIVE', code: 'SDK-2.5' },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-peat-dark border border-bureau-green p-3.5 font-mono shadow-sm"
            >
              <div className="text-[10px] text-lichen-stone flex justify-between">
                <span>{stat.code}</span>
                <span>AUDIT</span>
              </div>
              <div className="text-xl md:text-2xl font-serif font-bold text-parchment-drab my-1">
                {stat.val}
              </div>
              <div className="text-[11px] text-parchment-muted/80 uppercase">
                {vowelFilter(stat.label)}
              </div>
            </div>
          ))}
        </div>

        {/* Regulatory Testimonials */}
        <div className="my-8 border border-bureau-green p-6 bg-peat-dark">
          <h2 className="text-base font-serif font-bold text-regulatory-gold mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            {vowelFilter('FILED TESTIMONY & GRIEVANCE LOGS')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs text-parchment-muted">
            <div className="p-3.5 bg-forester-dark border border-bureau-green/60">
              <p className="italic leading-relaxed">
                "{vowelFilter('The soil pH corrective schedule was mathematically rigorous and averted crop failure, but navigating the 7 annexes caused severe cognitive exhaustion.')}"
              </p>
              <span className="block mt-2 text-regulatory-gold text-[11px]">— Extension Inspector H. Vance, District 4</span>
            </div>
            <div className="p-3.5 bg-forester-dark border border-bureau-green/60">
              <p className="italic leading-relaxed">
                "{vowelFilter('I spent forty-five minutes completing the core sample grid to obtain my urea dosage. The system noted my lack of patience on my permanent file.')}"
              </p>
              <span className="block mt-2 text-regulatory-gold text-[11px]">— Agronomist M. Sterling, Plains Division</span>
            </div>
            <div className="p-3.5 bg-forester-dark border border-bureau-green/60">
              <p className="italic leading-relaxed">
                "{vowelFilter('Silencing the meteorological alert locked my station for 15 seconds under Statute 41. Severe adherence to protocol.')}"
              </p>
              <span className="block mt-2 text-regulatory-gold text-[11px]">— Agronomic Officer K. Lindqvist, North Sector</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
