"use client";
import { useRouter } from "next/navigation";
import type { MouseEvent, JSX } from "react";

export default function Home(): JSX.Element {
  const router = useRouter();

  const goToSpells = (event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    const params = new URLSearchParams({
      spell: "true",
    });

    router.push(`/Spells?${params.toString()}`);
  };

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
      {/* NAVBAR */}
      <header className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
        <h1 className="text-xl font-semibold">BrandName</h1>
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="hover:text-gray-600">
            Tab1
          </a>
          <a href="#" className="hover:text-gray-600">
            Tab2
          </a>
          <a href="#" className="hover:text-gray-600">
            Tab3
          </a>
          <a href="#" className="hover:text-gray-600">
            Tab4
          </a>
        </nav>
        <button className="md:hidden px-3 py-2 border rounded-lg">Menu</button>
      </header>

      {/* HERO SECTION */}
      <section className="px-8 py-24 text-center bg-gradient-to-b from-white to-gray-100 flex-grow"></section>

      {/* FEATURES */}
      <section className="px-8 py-20">
        <h3 className="text-3xl font-bold text-center mb-12">Features</h3>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <button
            onClick={goToSpells}
            className="p-6 bg-white rounded-2xl shadow group hover:bg-blue-500 transition-colors duration-300"
          >
            <h4 className="text-xl font-semibold mb-2 text-black group-hover:text-white">
              Spell Creation
            </h4>
            <p className="text-gray-600 group-hover:text-white">
              Make a spell from one of the 15 schools of magic
            </p>
          </button>
          <div className="p-6 bg-white rounded-2xl shadow">
            <h4 className="text-xl font-semibold mb-2">Enemy Bestiary</h4>
            <p className="text-gray-600">
              Assemble enemy roster with quick-look-up stats
            </p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow">
            <h4 className="text-xl font-semibold mb-2">HIPPO!</h4>
            <p className="text-gray-600">Shin Nah is lame...</p>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="px-8 py-20 bg-blue-600 text-white text-center">
        <button className="px-8 py-3 bg-white text-blue-600 rounded-xl hover:bg-gray-100">
          Join Now
        </button>
      </section>

      {/* FOOTER */}
      <footer className="px-8 py-6 text-center text-gray-500 text-sm">
        © 2025 J.Herrera — All rights reserved.
      </footer>
    </div>
  );
}
