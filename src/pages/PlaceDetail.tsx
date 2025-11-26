import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, Clock, MapPin, Edit, Trash2, Loader2, ArrowLeft, Send, Image as ImageIcon } from 'lucide-react';
import Navbar from '@/components/Navbar';
import CommentCard from '@/components/CommentCard';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
  menu: string[];
}

interface Comment {
  _id: string;
  username: string;
  text: string;
  image?: string;
  createdAt: string;
}

const PlaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [place, setPlace] = useState<Place | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [commentImage, setCommentImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPlace();
    fetchComments();
  }, [id]);

  const fetchPlace = async () => {
    try {
      const response = await api.get(`/places/${id}`);
      setPlace(response.data);
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

  const fetchComments = async () => {
    try {
      const response = await api.get(`/comments/${id}`);
      setComments(response.data);
    } catch (error) {
      console.error('Failed to fetch comments');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCommentImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('text', commentText);
      if (commentImage) {
        formData.append('image', commentImage);
      }

      await api.post(`/comments/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast({
        title: 'Success',
        description: 'Komentar berhasil ditambahkan',
      });

      setCommentText('');
      setCommentImage(null);
      setImagePreview('');
      fetchComments();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Gagal menambahkan komentar',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Yakin ingin menghapus tempat makan ini?')) return;

    try {
      await api.delete(`/places/${id}`);
      toast({
        title: 'Success',
        description: 'Tempat makan berhasil dihapus',
      });
      navigate(`/places?area=${place?.area}`);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Gagal menghapus',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">Tempat makan tidak ditemukan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <Link to={`/places?area=${place.area}`}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </Link>

        <div className="bg-card rounded-2xl overflow-hidden shadow-2xl border border-border">
          <div className="aspect-[21/9] relative overflow-hidden">
            <img
              src={place.image}
              alt={place.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
          </div>

          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold mb-3 text-foreground">{place.name}</h1>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Star className="w-5 h-5 text-secondary fill-secondary" />
                    <span className="text-lg">{place.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-5 h-5 text-accent" />
                    <span>{place.openHours}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span>{place.address}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Link to={`/places/${id}/edit`}>
                  <Button variant="outline" size="icon" className="border-primary text-primary hover:bg-primary/10">
                    <Edit className="w-4 h-4" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleDelete}
                  className="border-destructive text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Menu</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {place.menu.map((item, index) => (
                  <div key={index} className="bg-muted rounded-lg p-3 border border-border">
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 text-foreground">Komentar</h2>
              
              <form onSubmit={handleSubmitComment} className="bg-muted rounded-xl p-4 mb-6 border border-border">
                <Textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Tulis komentar Anda..."
                  className="mb-3 bg-background border-border"
                  rows={3}
                />
                
                {imagePreview && (
                  <div className="mb-3 relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-xs rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setCommentImage(null);
                        setImagePreview('');
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <input
                    type="file"
                    id="comment-image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label htmlFor="comment-image">
                    <Button type="button" variant="outline" size="icon" className="cursor-pointer" asChild>
                      <span>
                        <ImageIcon className="w-4 h-4" />
                      </span>
                    </Button>
                  </label>
                  
                  <Button
                    type="submit"
                    disabled={submitting || !commentText.trim()}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    Kirim
                  </Button>
                </div>
              </form>

              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Belum ada komentar
                  </p>
                ) : (
                  comments.map((comment) => (
                    <CommentCard key={comment._id} {...comment} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlaceDetail;
