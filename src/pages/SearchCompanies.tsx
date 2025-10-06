import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, Star, LogOut } from "lucide-react";
import { toast } from "sonner";

interface Company {
  id: string;
  companyName: string;
  cnpj: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  description?: string;
  photos?: string[];
  rating?: number;
  reviewCount?: number;
}

const SearchCompanies = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (!user) {
      toast.error("Você precisa fazer login primeiro");
      navigate("/auth/user");
      return;
    }

    // Load companies from localStorage
    const storedCompanies = localStorage.getItem("companies");
    if (storedCompanies) {
      const parsedCompanies = JSON.parse(storedCompanies);
      setCompanies(parsedCompanies);
      setFilteredCompanies(parsedCompanies);
    }
  }, [navigate]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCompanies(companies);
    } else {
      const filtered = companies.filter(
        (company) =>
          company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.state.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCompanies(filtered);
    }
  }, [searchTerm, companies]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    toast.success("Logout realizado com sucesso");
    navigate("/");
  };

  const handleCompanyClick = (companyId: string) => {
    navigate(`/company/${companyId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">DivulgaMais</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4">Encontre Empresas</h2>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, cidade ou estado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">
                {searchTerm ? "Nenhuma empresa encontrada" : "Nenhuma empresa cadastrada ainda"}
              </p>
            </div>
          ) : (
            filteredCompanies.map((company) => (
              <Card
                key={company.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleCompanyClick(company.id)}
              >
                <CardHeader>
                  <CardTitle>{company.companyName}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-4 w-4" />
                      {company.city}, {company.state}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {company.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {company.description}
                    </p>
                  )}
                  {company.rating !== undefined && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{company.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({company.reviewCount || 0} avaliações)
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchCompanies;
