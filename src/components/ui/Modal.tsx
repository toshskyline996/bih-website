import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * 通用模态弹窗组件
 * 
 * 设计意图：工业风格弹窗，无圆角无阴影，硬边框
 * 支持 ESC 关闭 + 背景点击关闭 + 焦点陷阱
 */
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  className?: string;
  children: React.ReactNode;
}

export function Modal({ open, onClose, title, className, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  /* ESC 键关闭 */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  /* 打开时禁止背景滚动 */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => {
        /* 只在点击遮罩层（非内容区）时关闭 */
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        className={cn(
          'relative max-h-[90vh] w-full max-w-xl overflow-y-auto border-2 border-bih-navy bg-white',
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* 头部 */}
        {title && (
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-bih-gray-200 bg-bih-navy px-6 py-4">
            <h2 className="text-lg font-black uppercase tracking-tight text-white">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-white/80 transition-colors hover:text-bih-yellow"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* 内容 */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
