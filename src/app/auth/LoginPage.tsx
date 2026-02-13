"use client";

import { LoginForm } from "@/components/ui/auth/LoginForm";
import Image from "next/image";

interface LoginPageProps {
    onSwitchToRegister: () => void;
}

export default function LoginPage({ onSwitchToRegister }: LoginPageProps) {
    return (
        <main className="w-screen h-screen flex items-center justify-center bg-[radial-gradient(circle_at_center,#191629,#141121)]">
            {/* BACKGROUND ORNAMENTS */}
            <section className="absolute inset-0 w-full h-full">
                <Image
                src="/assets/bg/bg-auth.png"
                alt="Auth BG"
                fill
                className="object-cover"
                priority
                />
            </section>
            <LoginForm onSwitchToRegister={onSwitchToRegister} />
        </main>
    )
}