import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Plus, Loader2, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import PlaceCard from '@/components/PlaceCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import api from '@/api/axios';

interface Place {
  _id: string;
  name: string;
  image: string;
  rating: number;
  openHours: string;
  address: string;
  area: string;
}

const PlaceList = () => {
  const [searchParams] = useSearchParams();
  const area = searchParams.get('area') || '';
  const { toast } = useToast();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlaces();
  }, [area]);

  const fetchPlaces = async () => {
    try {
      const response = await api.get(`/places?area=${area}`);
      setPlaces(response.data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Gagal memuat data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Tempat Makan di {area}
              </h1>
              <p className="text-muted-foreground mt-2">
                {places.length} tempat makan ditemukan
              </p>
            </div>
          </div>
          
          <Link to={`/places/new?area=${area}`}>
            <Button className="bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Tempat
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : places.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground mb-4">
              Belum ada tempat makan di area ini
            </p>
            <Link to={`/places/new?area=${area}`}>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Tambah Tempat Pertama
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {places.map((place) => (
              <PlaceCard
                key={place._id}
                id={place._id}
                name={place.name}
                image={place.image}
                rating={place.rating}
                openHours={place.openHours}
                address={place.address}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PlaceList;
