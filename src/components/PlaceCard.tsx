import { useNavigate } from 'react-router-dom';
import { Star, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlaceCardProps {
  id: string;
  name: string;
  image: string;
  rating: number;
  openHours: string;
  address: string;
}

const PlaceCard = ({ id, name, image, rating, openHours, address }: PlaceCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-border">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-3 text-foreground">{name}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Star className="w-4 h-4 text-secondary fill-secondary" />
            <span>{rating.toFixed(1)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4 text-accent" />
            <span className="text-sm">{openHours}</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm">{address}</span>
          </div>
        </div>
        
        <Button
          onClick={() => navigate(`/places/${id}`)}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Lihat Detail
        </Button>
      </div>
    </div>
  );
};

export default PlaceCard;
