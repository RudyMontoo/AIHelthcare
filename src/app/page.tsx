"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TamboProvider } from "@tambo-ai/react";
import { useMcpServers } from "@/components/tambo/mcp-config-modal";
import { LandingChat } from "@/components/landing-chat";
import { components } from "@/lib/tambo";
import { z } from "zod";

export default function Home() {
  const router = useRouter();
  const mcpServers = useMcpServers();
  const apiKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY;
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [targetPortal, setTargetPortal] = useState<string | null>(null);

  const universalTools = React.useMemo(() => [
    {
      name: "accessPortal",
      description: "Route the user to the correct healthcare portal based on their role or intent.",
      tool: async (input: { role: 'doctor' | 'patient' | 'lab' | 'pharmacy' }) => {
        setIsRedirecting(true);
        setTargetPortal(input.role === 'doctor' ? "Doctor (EHR)" : input.role);

        // Simulate a brief delay for effect before continuous routing
        setTimeout(() => {
          if (input.role === 'doctor') router.push('/demos/ehr');
          else if (input.role === 'patient') router.push('/demos/patient');
          else if (input.role === 'lab') router.push('/demos/lab');
          else if (input.role === 'pharmacy') router.push('/demos/pharmacy');
        }, 1500);

        return {
          action: "redirect",
          target: input.role,
          message: `Redirecting you to the ${input.role === 'doctor' ? 'Electronic Health Records' : input.role} portal...`
        };
      },
      inputSchema: z.object({
        role: z.enum(['doctor', 'patient', 'lab', 'pharmacy'])
          .describe("The target portal. Rules:\n- 'doctor': for EHR, providers, analysis.\n- 'patient': for SYMPTOMS, pain, appointments, or personal health questions.\n- 'lab': for test results.\n- 'pharmacy': for medications.")
      }),
      outputSchema: z.any()
    }
  ], [router]);

  if (!apiKey) return <div className="p-4 text-red-500">Missing API Key</div>;

  return (
    <TamboProvider
      apiKey={apiKey}
      components={components}
      tools={universalTools}
      tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
      mcpServers={mcpServers}
    >
      <div className="min-h-screen bg-slate-950 flex flex-col relative overflow-hidden font-[family-name:var(--font-geist-sans)]">

        {/* Background Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black"></div>
          <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-emerald-500/10 rounded-full blur-3xl opacity-50"></div>
        </div>

        <main className="flex-1 flex flex-col items-center justify-center p-4 z-10 w-full h-full min-h-screen">
          {isRedirecting ? (
            <div className="flex flex-col items-center justify-center text-center p-8 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full mb-6 animate-spin" />
              <h3 className="text-2xl font-bold text-white mb-2">Generating Interface...</h3>
              <p className="text-slate-400">Configuring the {targetPortal} portal for your session.</p>
            </div>
          ) : (
            <LandingChat />
          )}
        </main>

        <footer className="absolute bottom-6 w-full text-center text-slate-600 text-sm z-10 pointer-events-none opacity-50">
          Powered by Tambo AI & Next.js
        </footer>
      </div>
    </TamboProvider>
  );
}
