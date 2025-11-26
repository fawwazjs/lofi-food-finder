import { User } from 'lucide-react';

interface CommentCardProps {
  username: string;
  text: string;
  image?: string;
  createdAt: string;
}

const CommentCard = ({ username, text, image, createdAt }: CommentCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-card rounded-xl p-4 border border-border shadow-md hover:shadow-lg transition-all">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold">
            {getInitials(username)}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-foreground">{username}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(createdAt).toLocaleDateString('id-ID')}
            </span>
          </div>
          
          <p className="text-foreground mb-3">{text}</p>
          
          {image && (
            <div className="rounded-lg overflow-hidden max-w-sm">
              <img
                src={image}
                alt="Comment"
                className="w-full h-auto object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
