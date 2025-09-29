import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Shield, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/50 to-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg"></div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                DivulgaMais
              </h1>
            </div>
            
            {session ? (
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">
                  Bem-vindo, {session.user.email}!
                </span>
                <Button 
                  variant="outline" 
                  onClick={() => supabase.auth.signOut()}
                >
                  Sair
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/auth/user">
                  <Button variant="outline">Login Usuário</Button>
                </Link>
                <Link to="/auth/company">
                  <Button variant="gradient">Login Empresa</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
            Conecte usuários e empresas
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A melhor plataforma de divulgação digital para conectar pessoas e negócios de forma simples e eficaz.
          </p>
          
          {!session && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/auth/user">
                <Button size="lg" variant="hero" className="w-full sm:w-auto">
                  <Users className="mr-2 h-5 w-5" />
                  Cadastrar como Usuário
                </Button>
              </Link>
              <Link to="/auth/company">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <Building2 className="mr-2 h-5 w-5" />
                  Cadastrar como Empresa
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-border/50 shadow-elegant hover:shadow-glow transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                Para Usuários
              </CardTitle>
              <CardDescription>
                Descubra novos serviços e oportunidades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Acesse uma ampla gama de serviços e produtos divulgados por empresas verificadas.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-elegant hover:shadow-glow transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-accent" />
                Para Empresas
              </CardTitle>
              <CardDescription>
                Amplie seu alcance e encontre novos clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Divulgue seus produtos e serviços para uma audiência qualificada e engajada.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-elegant hover:shadow-glow transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                Segurança
              </CardTitle>
              <CardDescription>
                Ambiente seguro e confiável
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Todas as empresas são verificadas e os dados dos usuários são protegidos.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      {!session && (
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Pronto para começar?
            </h2>
            <p className="text-muted-foreground mb-8">
              Escolha o tipo de conta que melhor se adequa ao seu perfil.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/user">
                <Button size="lg" variant="gradient" className="w-full sm:w-auto">
                  <Zap className="mr-2 h-5 w-5" />
                  Começar como Usuário
                </Button>
              </Link>
              <Link to="/auth/company">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <Building2 className="mr-2 h-5 w-5" />
                  Começar como Empresa
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2024 DivulgaMais. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;