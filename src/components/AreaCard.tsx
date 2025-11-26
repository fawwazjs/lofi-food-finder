import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AreaCardProps {
  name: string;
  image: string;
  color: string;
}

const AreaCard = ({ name, image, color }: AreaCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer bg-card"
      onClick={() => navigate(`/places?area=${name}`)}
    >
      <div className="aspect-[4/3] relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${color} opacity-60 group-hover:opacity-40 transition-opacity`} />
      </div>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
        <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-border">
          <MapPin className="w-8 h-8 mx-auto mb-3 text-primary" />
          <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            {name}
          </h3>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg">
            Lihat Tempat Makan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AreaCard;
