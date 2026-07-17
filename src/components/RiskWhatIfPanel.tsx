"use client";

import { useState } from "react";
import type { Customer, RiskCategory } from "@/lib/mockData";
import { riskColors } from "@/lib/risk";

function categoryForScore(score: number): RiskCategory {
  if (score >= 65) return "At-risk";
  if (score >= 35) return "Under-utilized";
  return "Healthy";
}

const RING_COLOR: Record<RiskCategory, string> = {
  Healthy: "#10b981",
  "Under-utilized": "#f59e0b",
  "At-risk": "#ef4444",
};

export default function RiskWhatIfPanel({ customer }: { customer: Customer }) {
  const [discountPct, setDiscountPct] = useState(0);
  const [ticketResolution, setTicketResolution] = useState(0);

  // TODO: replace this mock arithmetic with a real call to the churn
  // prediction model (POST /api/predict) once it exists.
  const adjustedRisk = Math.max(
    0,
    Math.min(100, Math.round(customer.churnRisk - discountPct * 0.4 - ticketResolution * 0.15))
  );
  const category = categoryForScore(adjustedRisk);
  const colors = riskColors[category];

  const circumference = 2 * Math.PI * 54;
  const offset = circumference * (1 - adjustedRisk / 100);

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h2 className="text-sm font-medium text-neutral-500">Churn Risk Score</h2>

      <div className="mt-4 flex flex-col items-center">
        <div className="relative h-36 w-36">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle cx="60" cy="60" r="54" fill="none" stroke="#f0f0f0" strokeWidth="10" />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke={RING_COLOR[category]}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-semibold tracking-tight text-neutral-900">
              {adjustedRisk}
            </span>
            <span className="text-xs text-neutral-400">/ 100</span>
          </div>
        </div>
        <span
          className={`mt-3 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${colors.bg} ${colors.text} ${colors.ring}`}
        >
          {category}
        </span>
      </div>

      <div className="mt-6 space-y-5 border-t border-neutral-100 pt-5">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
          What-if simulator
        </p>

        <div>
          <div className="flex items-center justify-between text-sm">
            <label htmlFor="discount-slider" className="text-neutral-600">
              Offer discount
            </label>
            <span className="font-medium text-neutral-800">{discountPct}%</span>
          </div>
          <input
            id="discount-slider"
            type="range"
            min={0}
            max={50}
            step={5}
            value={discountPct}
            onChange={(e) => setDiscountPct(Number(e.target.value))}
            className="mt-2 w-full accent-neutral-900"
          />
        </div>

        <div>
          <div className="flex items-center justify-between text-sm">
            <label htmlFor="ticket-slider" className="text-neutral-600">
              Resolve support ticket
            </label>
            <span className="font-medium text-neutral-800">{ticketResolution}%</span>
          </div>
          <input
            id="ticket-slider"
            type="range"
            min={0}
            max={100}
            step={10}
            value={ticketResolution}
            onChange={(e) => setTicketResolution(Number(e.target.value))}
            className="mt-2 w-full accent-neutral-900"
          />
        </div>

        <p className="text-xs leading-relaxed text-neutral-400">
          These sliders adjust the score using simple placeholder arithmetic for demo purposes
          only — they do not reflect real model predictions yet.
        </p>
      </div>
    </div>
  );
}
