import { Header } from "../components/Header";
import { Dashboard } from "../components/Dashboard";
import { LendingInterface } from "../components/LendingInterface";
import { Marketplace } from "../components/Marketplace";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <Dashboard />
        <LendingInterface />
        <Marketplace />
      </main>
    </div>
  );
}
