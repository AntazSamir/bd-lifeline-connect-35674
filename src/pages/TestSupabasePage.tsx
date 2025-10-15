import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TestSupabaseConnection from "@/components/TestSupabaseConnection";

const TestSupabasePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">Supabase Connection Test</h1>
          <TestSupabaseConnection />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TestSupabasePage;