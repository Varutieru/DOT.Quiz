"use client";

import Image from "next/image";
import { useAuthContext } from "@/contexts/AuthContext";

export default function Header() {
    const { user, logout, isAuthenticated } = useAuthContext();

    return (
        <header className="w-full h-fit flex justify-between items-center gap-full">
            <Image
                src="/assets/logo/dark-mode.svg"
                alt="Dot Quiz Logo Dark Mode"
                width={1685}
                height={1294}
                className="w-[10vw] sm:w-[8vw] md:w-[6vw] object-contain"
                priority
            />
            
            <nav className="flex items-center gap-4">
                {isAuthenticated && user && (
                    <div className="flex items-center gap-3 bg-[#F2F2F9]/10 backdrop-blur-lg rounded-full px-6 py-3">
                        <span className="text-[#F2F2F9] font-chillax text-sm md:text-base">
                            Hi, {user.name}!
                        </span>
                        <button
                            onClick={logout}
                            className="px-4 py-2 bg-[#EF767A] text-[#F2F2F9] font-chillax text-sm md:text-base rounded-full hover:bg-[#EF767A]/80 transition-colors duration-200"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </nav>
        </header>
    );
}