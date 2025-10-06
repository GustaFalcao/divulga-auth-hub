import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Building2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const companySignUpSchema = z.object({
  companyName: z.string().trim().min(2, "Nome da empresa deve ter pelo menos 2 caracteres").max(100, "Nome muito longo"),
  cnpj: z.string().trim().min(14, "CNPJ deve ter 14 dígitos").max(18, "CNPJ inválido"),
  address: z.string().trim().min(10, "Endereço deve ser mais detalhado").max(200, "Endereço muito longo"),
  city: z.string().trim().min(2, "Cidade é obrigatória").max(100, "Cidade muito longa"),
  state: z.string().trim().min(2, "Estado é obrigatório").max(2, "Use a sigla do estado (ex: SP)"),
  companyPhone: z.string().trim().min(10, "Telefone deve ter pelo menos 10 dígitos").max(20, "Telefone muito longo"),
  companyEmail: z.string().trim().email("Email inválido").max(255, "Email muito longo"),
  responsibleName: z.string().trim().min(2, "Nome do responsável deve ter pelo menos 2 caracteres").max(100, "Nome muito longo"),
  responsibleRole: z.string().trim().min(2, "Cargo deve ter pelo menos 2 caracteres").max(50, "Cargo muito longo"),
  responsiblePhone: z.string().trim().min(10, "Telefone deve ter pelo menos 10 dígitos").max(20, "Telefone muito longo"),
  responsibleEmail: z.string().trim().email("Email inválido").max(255, "Email muito longo"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres").max(100, "Senha muito longa"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

const companySignInSchema = z.object({
  cnpj: z.string().trim().min(1, "CNPJ é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

const CompanyAuth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [signUpData, setSignUpData] = useState({
    companyName: "",
    cnpj: "",
    address: "",
    city: "",
    state: "",
    companyPhone: "",
    companyEmail: "",
    responsibleName: "",
    responsibleRole: "",
    responsiblePhone: "",
    responsibleEmail: "",
    password: "",
    confirmPassword: "",
  });
  const [signInData, setSignInData] = useState({
    cnpj: "",
    password: "",
  });

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validatedData = companySignUpSchema.parse(signUpData);
      
      // Mock: salvar no localStorage
      const companies = JSON.parse(localStorage.getItem('companies') || '[]');
      
      // Verificar se empresa já existe
      if (companies.find((c: any) => c.cnpj === validatedData.cnpj)) {
        toast.error("CNPJ já cadastrado. Tente fazer login.");
        setIsLoading(false);
        return;
      }

      // Adicionar nova empresa
      const newCompany = {
        id: Date.now().toString(),
        ...validatedData,
      };
      companies.push(newCompany);
      localStorage.setItem('companies', JSON.stringify(companies));
      
      // Store current company
      localStorage.setItem("currentCompany", JSON.stringify(newCompany));

      toast.success("Cadastro realizado com sucesso!");
      navigate("/company/dashboard");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast.error(firstError.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validatedData = companySignInSchema.parse(signInData);
      
      // Mock: verificar no localStorage
      const companies = JSON.parse(localStorage.getItem('companies') || '[]');
      const company = companies.find(
        (c: any) => c.cnpj === validatedData.cnpj && c.password === validatedData.password
      );

      if (!company) {
        toast.error("CNPJ ou senha incorretos.");
        setIsLoading(false);
        return;
      }

      // Store current company
      localStorage.setItem("currentCompany", JSON.stringify(company));
      
      toast.success("Login realizado com sucesso!");
      navigate("/company/dashboard");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast.error(firstError.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/50 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao início
          </Link>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Building2 className="h-8 w-8 text-accent" />
            <h1 className="text-2xl font-bold">Acesso Empresarial</h1>
          </div>
          <p className="text-muted-foreground">Cadastre sua empresa ou faça login</p>
        </div>

        <Card className="shadow-elegant">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">DivulgaMais Empresas</CardTitle>
            <CardDescription>Sua conta empresarial</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Cadastrar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-cnpj">CNPJ</Label>
                    <Input
                      id="signin-cnpj"
                      type="text"
                      placeholder="00.000.000/0000-00"
                      value={signInData.cnpj}
                      onChange={(e) => setSignInData({ ...signInData, cnpj: formatCNPJ(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Senha</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Sua senha"
                      value={signInData.password}
                      onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" variant="gradient" disabled={isLoading}>
                    {isLoading ? "Entrando..." : "Entrar"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company-name">Nome da Empresa</Label>
                      <Input
                        id="company-name"
                        type="text"
                        placeholder="Empresa LTDA"
                        value={signUpData.companyName}
                        onChange={(e) => setSignUpData({ ...signUpData, companyName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cnpj">CNPJ</Label>
                      <Input
                        id="cnpj"
                        type="text"
                        placeholder="00.000.000/0000-00"
                        value={signUpData.cnpj}
                        onChange={(e) => setSignUpData({ ...signUpData, cnpj: formatCNPJ(e.target.value) })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço Completo</Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder="Rua, número, bairro e CEP"
                      value={signUpData.address}
                      onChange={(e) => setSignUpData({ ...signUpData, address: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        type="text"
                        placeholder="São Paulo"
                        value={signUpData.city}
                        onChange={(e) => setSignUpData({ ...signUpData, city: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">Estado (Sigla)</Label>
                      <Input
                        id="state"
                        type="text"
                        placeholder="SP"
                        maxLength={2}
                        value={signUpData.state}
                        onChange={(e) => setSignUpData({ ...signUpData, state: e.target.value.toUpperCase() })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company-phone">Telefone da Empresa</Label>
                      <Input
                        id="company-phone"
                        type="tel"
                        placeholder="(11) 3333-3333"
                        value={signUpData.companyPhone}
                        onChange={(e) => setSignUpData({ ...signUpData, companyPhone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company-email">Email da Empresa</Label>
                      <Input
                        id="company-email"
                        type="email"
                        placeholder="contato@empresa.com"
                        value={signUpData.companyEmail}
                        onChange={(e) => setSignUpData({ ...signUpData, companyEmail: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-3">Informações do Responsável</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="responsible-name">Nome do Responsável</Label>
                        <Input
                          id="responsible-name"
                          type="text"
                          placeholder="João Silva"
                          value={signUpData.responsibleName}
                          onChange={(e) => setSignUpData({ ...signUpData, responsibleName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="responsible-role">Cargo</Label>
                        <Input
                          id="responsible-role"
                          type="text"
                          placeholder="Diretor, Gerente, etc."
                          value={signUpData.responsibleRole}
                          onChange={(e) => setSignUpData({ ...signUpData, responsibleRole: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="responsible-phone">Telefone do Responsável</Label>
                        <Input
                          id="responsible-phone"
                          type="tel"
                          placeholder="(11) 99999-9999"
                          value={signUpData.responsiblePhone}
                          onChange={(e) => setSignUpData({ ...signUpData, responsiblePhone: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="responsible-email">Email do Responsável</Label>
                        <Input
                          id="responsible-email"
                          type="email"
                          placeholder="joao@empresa.com"
                          value={signUpData.responsibleEmail}
                          onChange={(e) => setSignUpData({ ...signUpData, responsibleEmail: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={signUpData.password}
                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar Senha</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirme sua senha"
                        value={signUpData.confirmPassword}
                        onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" variant="gradient" disabled={isLoading}>
                    {isLoading ? "Cadastrando..." : "Cadastrar Empresa"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-muted-foreground">
            É um usuário?{" "}
            <Link to="/auth/user" className="text-primary hover:underline">
              Clique aqui para acessar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyAuth;