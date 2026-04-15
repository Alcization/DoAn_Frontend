import React from "react";
import { X } from "lucide-react";

type BaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
  animate?: boolean;
};

export const BaseModal: React.FC<BaseModalProps> = ({ 
  isOpen, 
  onClose, 
  children, 
  maxWidth = "max-w-2xl",
  animate = true 
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md ${animate ? 'animate-in fade-in duration-300' : ''}`}
      onClick={onClose}
    >
      <div 
        className={`relative w-full ${maxWidth} rounded-[32px] border border-(--color-border) bg-(--color-surface) shadow-2xl ${animate ? 'animate-in zoom-in-95 duration-300' : ''} overflow-hidden max-h-[92vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

type ModalHeaderProps = {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  onClose: () => void;
  iconBgColor?: string;
};

export const ModalHeader: React.FC<ModalHeaderProps> = ({ 
  title, 
  subtitle, 
  icon, 
  onClose,
  iconBgColor = "bg-(--color-primary-bg)"
}) => (
  <div className="flex items-center justify-between p-7 border-b border-(--color-border)">
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-2xl ${iconBgColor}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-2xl font-black text-(--color-text-primary) tracking-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-(--color-text-secondary) mt-1 font-medium italic">
            {subtitle}
          </p>
        )}
      </div>
    </div>
    <button 
      onClick={onClose}
      className="p-3 rounded-full hover:bg-(--color-bg-secondary) text-(--color-text-muted) hover:text-(--color-text-primary) transition-all active:scale-90"
    >
      <X size={24} />
    </button>
  </div>
);

export const ModalBody: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = "" }) => (
  <div className={`p-8 space-y-7 overflow-y-auto flex-1 scrollbar-hide ${className}`}>
    {children}
  </div>
);

export const ModalFooter: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = "" }) => (
  <div className={`p-7 border-t border-(--color-border) bg-(--color-bg-secondary)/40 flex gap-4 ${className}`}>
    {children}
  </div>
);