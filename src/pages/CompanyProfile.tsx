import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, X, Star, MapPin } from "lucide-react";
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
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

const CompanyProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const currentCompany = localStorage.getItem("currentCompany");
    
    if (id) {
      // Viewing a specific company (from search)
      const companies = JSON.parse(localStorage.getItem("companies") || "[]");
      const foundCompany = companies.find((c: Company) => c.id === id);
      if (foundCompany) {
        setCompany(foundCompany);
        setDescription(foundCompany.description || "");
        setPhotos(foundCompany.photos || []);
        setIsOwner(currentCompany && JSON.parse(currentCompany).id === id);
      }
    } else if (currentCompany) {
      // Owner viewing their own profile
      const parsedCompany = JSON.parse(currentCompany);
      setCompany(parsedCompany);
      setDescription(parsedCompany.description || "");
      setPhotos(parsedCompany.photos || []);
      setIsOwner(true);
    } else {
      toast.error("Empresa não encontrada");
      navigate("/");
      return;
    }

    // Load reviews
    const storedReviews = localStorage.getItem(`reviews_${id || JSON.parse(currentCompany || "{}").id}`);
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    }
  }, [id, navigate]);

  const handleSave = () => {
    if (!company || !isOwner) return;

    const updatedCompany = {
      ...company,
      description,
      photos,
    };

    // Update in localStorage
    localStorage.setItem("currentCompany", JSON.stringify(updatedCompany));

    // Update in companies list
    const companies = JSON.parse(localStorage.getItem("companies") || "[]");
    const updatedCompanies = companies.map((c: Company) =>
      c.id === company.id ? updatedCompany : c
    );
    localStorage.setItem("companies", JSON.stringify(updatedCompanies));

    setCompany(updatedCompany);
    toast.success("Informações atualizadas com sucesso!");
  };

  const handleAddPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhotos = [...photos, reader.result as string];
        setPhotos(newPhotos);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  if (!company) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate(isOwner ? "/company/dashboard" : "/search")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl">{company.companyName}</CardTitle>
            <CardDescription>
              <div className="flex items-center gap-2 mt-2">
                <MapPin className="h-4 w-4" />
                {company.address}, {company.city} - {company.state}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{calculateAverageRating().toFixed(1)}</span>
                <span className="text-sm">({reviews.length} avaliações)</span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="description">Descrição da Empresa</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Conte sobre sua empresa..."
                rows={5}
                disabled={!isOwner}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Fotos da Empresa</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    {isOwner && (
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemovePhoto(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {isOwner && (
                  <label className="border-2 border-dashed rounded-lg h-32 flex items-center justify-center cursor-pointer hover:bg-muted transition-colors">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleAddPhoto}
                      className="hidden"
                    />
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </label>
                )}
              </div>
            </div>

            {isOwner && (
              <Button onClick={handleSave} className="w-full">
                Salvar Alterações
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avaliações e Comentários</CardTitle>
          </CardHeader>
          <CardContent>
            {reviews.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhuma avaliação ainda
              </p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{review.userName}</span>
                      <span className="text-sm text-muted-foreground">{review.date}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CompanyProfile;
