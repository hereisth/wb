import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface FooterProps {
  onClick: () => void;
  isFavorite: boolean;
  title: string;
  authorLable: string;
  craetedAtLabel: string;
  disabled: boolean;
}

export const Footer = ({
  isFavorite,
  title,
  authorLable,
  craetedAtLabel,
  onClick,
  disabled,
}: FooterProps) => {

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();
    onClick();
  };

  return (
    <div className="relative bg-white p-3">
      <p className="text-[13px] truncate max-w-[calc(100%-20px)]">{title}</p>
      <p className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-muted-foreground text-[11px] truncate">
        {authorLable}, {craetedAtLabel}
      </p>
      <button
        onClick={handleClick}
        disabled={disabled}
        className={cn(
          "absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition hover:text-blue-600 text-muted-foreground ",
          disabled && "cursor-not-allowed opacity-75"
        )}
      >
        <Star
          className={cn("w-4 h-4", isFavorite && "text-blue-600 fill-blue-600")}
        />
      </button>
    </div>
  );
};
