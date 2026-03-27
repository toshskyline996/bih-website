import type { SVGProps } from 'react';

interface BIHLogoProps extends SVGProps<SVGSVGElement> {
  /** Logo 显示尺寸：sm=导航栏, md=页面内, lg=首页展示 */
  size?: 'sm' | 'md' | 'lg';
  /** 配色方案：yellow=黄底蓝字, navy=蓝底黄字, white=白底蓝字 */
  variant?: 'yellow' | 'navy' | 'white';
  /** 是否显示副标题 tagline */
  showTagline?: boolean;
}

/**
 * BIH Stencil 风格 Logo
 * 
 * 设计意图：倾斜 15° 的平行四边形，模拟机械喷码/镂空模板质感
 * - 适配属具侧面狭窄空间
 * - 20px 高度下 "BIH" 仍清晰可辨（验收标准）
 * - 三种配色方案适配不同背景
 */
export function BIHLogo({
  size = 'md',
  variant = 'yellow',
  showTagline = true,
  ...props
}: BIHLogoProps) {
  /* 尺寸映射：根据使用场景调整 SVG viewBox 缩放 */
  const sizeMap = {
    sm: { width: 120, height: 32 },
    md: { width: 200, height: 54 },
    lg: { width: 320, height: 86 },
  };

  /* 配色映射：不同场景的前景/背景色 */
  const colorMap = {
    yellow: { bg: '#FFC500', text: '#003366', tagline: '#003366' },
    navy: { bg: '#003366', text: '#FFC500', tagline: '#FFC500' },
    white: { bg: 'transparent', text: '#003366', tagline: '#737373' },
  };

  const { width, height } = sizeMap[size];
  const colors = colorMap[variant];

  /*
   * 平行四边形坐标计算：
   * 倾斜 15° ≈ tan(15°) ≈ 0.268
   * 顶边向右偏移 skewOffset，形成力量感倾斜
   */
  const skewOffset = 12;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 54"
      width={width}
      height={height}
      role="img"
      aria-label="BIH - Boreal Iron Heavy"
      {...props}
    >
      {/* 平行四边形外框：15° 倾斜，模拟机械铭牌 */}
      <polygon
        points={`${skewOffset},2 188,2 ${188 - skewOffset},${showTagline ? 38 : 52} ${2},${showTagline ? 38 : 52}`}
        fill={colors.bg}
        stroke={variant === 'white' ? '#003366' : 'none'}
        strokeWidth={variant === 'white' ? 2 : 0}
      />

      {/* 主文字 "BIH"：Stencil 粗体风格，确保 20px 高度可读 */}
      <text
        x="100"
        y={showTagline ? 29 : 36}
        textAnchor="middle"
        fill={colors.text}
        fontFamily="'Inter', 'Arial Black', 'Roboto', sans-serif"
        fontWeight="900"
        fontSize="30"
        letterSpacing="8"
        style={{ textTransform: 'uppercase' }}
      >
        BIH
      </text>

      {/* 副标题 tagline：小字置于平行四边形下方 */}
      {showTagline && (
        <text
          x="100"
          y="50"
          textAnchor="middle"
          fill={colors.tagline}
          fontFamily="'Inter', 'Roboto', sans-serif"
          fontWeight="600"
          fontSize="7.5"
          letterSpacing="3"
          style={{ textTransform: 'uppercase' }}
        >
          Northern Heavy Equipment
        </text>
      )}
    </svg>
  );
}
