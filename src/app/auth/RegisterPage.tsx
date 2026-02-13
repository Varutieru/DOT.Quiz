"use client";

import { RegisterForm } from "@/components/ui/auth/RegisterForm";
import Image from "next/image";

interface RegisterPageProps {
    onSwitchToLogin: () => void;
}

export default function RegisterPage({ onSwitchToLogin }: RegisterPageProps) {
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
            <RegisterForm onSwitchToLogin={onSwitchToLogin} />
        </main>
    )
}