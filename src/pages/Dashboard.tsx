import Navbar from '@/components/Navbar';
import AreaCard from '@/components/AreaCard';

const areas = [
  {
    name: 'Keputih',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop',
    color: 'from-primary/60 to-transparent',
  },
  {
    name: 'Mulyosari',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop',
    color: 'from-secondary/60 to-transparent',
  },
  {
    name: 'Gebang',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&auto=format&fit=crop',
    color: 'from-accent/60 to-transparent',
  },
  {
    name: 'Manyar',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop',
    color: 'from-primary/60 to-transparent',
  },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Pilih Area
          </h1>
          <p className="text-xl text-muted-foreground">
            Temukan tempat makan favorit di area kampus ITS
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {areas.map((area) => (
            <AreaCard
              key={area.name}
              name={area.name}
              image={area.image}
              color={area.color}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
