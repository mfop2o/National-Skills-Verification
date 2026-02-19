"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-700 text-white p-4 shadow-md">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <h1 className="text-xl font-bold">SkillTrust</h1>
        <div className="space-x-6">
          <Link href="/">Home</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/search">Search</Link>
          <Link href="/admin">Admin</Link>
        </div>
      </div>
    </nav>
  );
}
