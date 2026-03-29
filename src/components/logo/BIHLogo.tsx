/**
 * BIH 2.0 重工 Logo
 * 特色：斗齿剪影 + 金属焊接感边框 + 工业 stencil 喷码
 * 保持对 Header/Footer 的接口兼容性
 */
export const BIHLogo = ({ 
  className = "w-48 h-20", 
  variant = "navy",
  size = "md",           // 保持兼容
  showTagline = false    // 保持兼容
}: { 
  className?: string,
  variant?: 'navy' | 'yellow',
  size?: 'sm' | 'md',
  showTagline?: boolean
}) => {
  const sizeClasses = size === 'sm' ? "w-24 h-8" : "w-48 h-20";
  
  return (
    <div className={`flex flex-col ${className}`}>
      <svg 
        viewBox="0 0 200 80" 
        className={`${sizeClasses} transition-all duration-300`}
      >
        <g transform="skewX(-15)">
          {/* 金属厚度感底框 */}
          <rect x="0" y="0" width="180" height="60" fill={variant === 'navy' ? '#003366' : '#FFC500'} />
          {/* 工业剪影：挖掘机斗齿抽象 */}
          <path d="M140 0 L180 0 L160 60 L120 60 Z" fill={variant === 'navy' ? '#FFC500' : '#003366'} />
          {/* 喷码 BIH */}
          <text 
            x="15" 
            y="45" 
            fontFamily="Impact, sans-serif" 
            fontWeight="900" 
            fontSize="45" 
            fill={variant === 'navy' ? 'white' : '#003366'}
            letterSpacing="-2"
          >
            BIH
          </text>
        </g>
      </svg>
      {showTagline && (
        <span className="text-[10px] uppercase tracking-widest text-bih-yellow mt-1">
          North American Heavy
        </span>
      )}
    </div>
  );
};
