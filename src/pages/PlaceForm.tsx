import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import api from '@/api/axios';

const areas = ['Keputih', 'Mulyosari', 'Gebang', 'Manyar'];

const PlaceForm = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = Boolean(id);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState(searchParams.get('area') || '');
  const [openHours, setOpenHours] = useState('');
  const [rating, setRating] = useState('');
  const [menu, setMenu] = useState<string[]>(['']);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchPlace();
    }
  }, [id]);

  const fetchPlace = async () => {
    try {
      const response = await api.get(`/places/${id}`);
      const data = response.data;
      setName(data.name);
      setAddress(data.address);
      setArea(data.area);
      setOpenHours(data.openHours);
      setRating(data.rating.toString());
      setMenu(data.menu.length > 0 ? data.menu : ['']);
      setImagePreview(data.image);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Gagal memuat data',
        variant: 'destructive',
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMenuChange = (index: number, value: string) => {
    const newMenu = [...menu];
    newMenu[index] = value;
    setMenu(newMenu);
  };

  const addMenuItem = () => {
    setMenu([...menu, '']);
  };

  const removeMenuItem = (index: number) => {
    setMenu(menu.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !address || !area || !openHours || !rating) {
      toast({
        title: 'Error',
        description: 'Semua field harus diisi',
        variant: 'destructive',
      });
      return;
    }

    const filteredMenu = menu.filter((item) => item.trim() !== '');
    if (filteredMenu.length === 0) {
      toast({
        title: 'Error',
        description: 'Minimal satu menu harus diisi',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('address', address);
      formData.append('area', area);
      formData.append('openHours', openHours);
      formData.append('rating', rating);
      formData.append('menu', JSON.stringify(filteredMenu));
      if (image) {
        formData.append('image', image);
      }

      if (isEdit) {
        await api.put(`/places/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast({
          title: 'Success',
          description: 'Tempat makan berhasil diupdate',
        });
        navigate(`/places/${id}`);
      } else {
        const response = await api.post('/places', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast({
          title: 'Success',
          description: 'Tempat makan berhasil ditambahkan',
        });
        navigate(`/places/${response.data._id}`);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Gagal menyimpan data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <Link to={isEdit ? `/places/${id}` : `/places?area=${area}`}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </Link>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            {isEdit ? 'Edit Tempat Makan' : 'Tambah Tempat Makan'}
          </h1>

          <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 shadow-2xl border border-border space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Tempat Makan</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-background border-border"
                placeholder="Warung Makan Pak Slamet"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Alamat</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-background border-border"
                placeholder="Jl. Contoh No. 123"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Area</Label>
              <Select value={area} onValueChange={setArea}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Pilih area" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="openHours">Jam Buka</Label>
              <Input
                id="openHours"
                value={openHours}
                onChange={(e) => setOpenHours(e.target.value)}
                className="bg-background border-border"
                placeholder="08:00 - 22:00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Rating (0-5)</Label>
              <Input
                id="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="bg-background border-border"
                placeholder="4.5"
              />
            </div>

            <div className="space-y-2">
              <Label>Menu</Label>
              <div className="space-y-2">
                {menu.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={item}
                      onChange={(e) => handleMenuChange(index, e.target.value)}
                      className="bg-background border-border"
                      placeholder="Nama menu"
                    />
                    {menu.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeMenuItem(index)}
                        className="border-destructive text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={addMenuItem}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Menu
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Gambar</Label>
              {imagePreview && (
                <div className="mb-3 relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full rounded-lg"
                  />
                </div>
              )}
              <input
                type="file"
                id="place-image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label htmlFor="place-image">
                <Button type="button" variant="outline" className="w-full cursor-pointer" asChild>
                  <span>
                    <ImageIcon className="w-4 h-4 mr-2" />
                    {image || imagePreview ? 'Ganti Gambar' : 'Upload Gambar'}
                  </span>
                </Button>
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary via-secondary to-accent text-primary-foreground hover:opacity-90"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                isEdit ? 'Update' : 'Simpan'
              )}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default PlaceForm;
