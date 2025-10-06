import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, LogOut, User, Star, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface Company {
  id: string;
  companyName: string;
  cnpj: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  responsibleName: string;
  responsibleEmail: string;
  description?: string;
  photos?: string[];
  rating?: number;
  reviewCount?: number;
}

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    const currentCompany = localStorage.getItem("currentCompany");
    if (!currentCompany) {
      toast.error("Você precisa fazer login primeiro");
      navigate("/auth/company");
      return;
    }

    const parsedCompany = JSON.parse(currentCompany);
    setCompany(parsedCompany);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentCompany");
    toast.success("Logout realizado com sucesso");
    navigate("/");
  };

  const handleGoToProfile = () => {
    navigate("/company/profile");
  };

  if (!company) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">DivulgaMais - Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Bem-vindo, {company.responsibleName}!</h2>
          <p className="text-muted-foreground">{company.companyName}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {company.rating ? company.rating.toFixed(1) : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">
                {company.reviewCount || 0} avaliações
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Comentários</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{company.reviewCount || 0}</div>
              <p className="text-xs text-muted-foreground">Total de comentários</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fotos</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{company.photos?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Fotos cadastradas</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Minha Empresa</CardTitle>
            <CardDescription>
              Atualize as informações, fotos e acompanhe as avaliações da sua empresa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleGoToProfile} className="w-full md:w-auto">
              <User className="mr-2 h-4 w-4" />
              Ir para o Perfil da Empresa
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CompanyDashboard;
