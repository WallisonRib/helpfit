"use client";

import { Mail, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function SupportPage() {
    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <header className="flex flex-col gap-2 mb-8">
                <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
                    <HelpCircle className="w-8 h-8" />
                    Suporte HelpFit
                </h1>
                <p className="text-zinc-400">Como podemos ajudar você hoje?</p>
            </header>

            <div className="grid gap-8 md:grid-cols-3">
                {/* FAQ Section */}
                <div className="md:col-span-2 space-y-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Perguntas Frequentes (FAQ)</h2>

                    <div className="space-y-4">
                        <FaqItem
                            question="Como faço para alterar minha senha?"
                            answer="Você pode alterar sua senha acessando a página de Perfil no menu lateral e clicando em 'Alterar Senha' ou entrando em contato com o suporte."
                        />
                        <FaqItem
                            question="Como vejo meu treino do dia?"
                            answer="Na página inicial (Dashboard), você verá os cards com os dias da semana. Clique no dia correspondente para ver os detalhes do treino."
                        />
                        <FaqItem
                            question="O que fazer se eu perder uma avaliação?"
                            answer="Entre em contato com seu treinador para reagendar uma nova avaliação física. O histórico de avaliações anteriores permanece salvo."
                        />
                        <FaqItem
                            question="O aplicativo funciona offline?"
                            answer="Atualmente, o HelpFit requer uma conexão com a internet para carregar seus treinos e salvar seu progresso."
                        />
                    </div>
                </div>

                {/* Contact Section */}
                <div className="md:col-span-1">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sticky top-8">
                        <h3 className="text-lg font-bold text-white mb-4">Ainda precisa de ajuda?</h3>
                        <p className="text-zinc-400 text-sm mb-6">
                            Nossa equipe de suporte está disponível para ajudar com qualquer problema técnico ou dúvida.
                        </p>

                        <div className="flex items-center gap-3 text-zinc-300 mb-2">
                            <div className="bg-primary/10 p-2 rounded-full">
                                <Mail className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <span className="block text-xs text-zinc-500">E-mail de Suporte</span>
                                <a href="mailto:suporte@helpfit.com.br" className="font-medium hover:text-primary transition-colors">
                                    suporte@helpfit.com.br
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FaqItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-800/50 transition-colors"
            >
                <span className="font-medium text-zinc-200">{question}</span>
                {isOpen ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-zinc-500" />}
            </button>
            {isOpen && (
                <div className="p-4 pt-0 text-zinc-400 text-sm border-t border-zinc-800/50 mt-2">
                    {answer}
                </div>
            )}
        </div>
    );
}
