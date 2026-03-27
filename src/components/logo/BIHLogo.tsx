interface BIHLogoProps {
  /** Logo 显示尺寸：sm=导航栏图标, md=页脚中等, lg=首页大横幅 */
  size?: 'sm' | 'md' | 'lg';
  /** 保留兼容性，图片本身已包含配色 */
  variant?: 'yellow' | 'navy' | 'white';
  /** sm时无效；md/lg时决定是否显示完整横幅 */
  showTagline?: boolean;
  className?: string;
}

/**
 * BIH 品牌 Logo 组件
 *
 * 图片映射策略：
 * - sm（导航栏）→ 3D 立体箭头图标，height 40px，简洁有力
 * - md / lg（页脚、首页）→ 完整品牌横幅 (BIH + BOREAL IRON HEAVY)
 */
export function BIHLogo({
  size = 'md',
  showTagline = true,
  className = '',
}: BIHLogoProps) {
  /* sm 尺寸：只显示 3D 图标，适合导航栏窄高度 */
  if (size === 'sm') {
    return (
      <img
        src="/bih-icon-3d.png"
        alt="Boreal Iron Heavy"
        height={40}
        className={`h-10 w-auto object-contain ${className}`}
      />
    );
  }

  /* md/lg 尺寸：显示完整品牌横幅 */
  const maxWidth = size === 'lg' ? 520 : 280;

  /* showTagline=false 时降级为图标，保持向下兼容 */
  if (!showTagline) {
    return (
      <img
        src="/bih-icon-3d.png"
        alt="Boreal Iron Heavy"
        height={size === 'lg' ? 64 : 48}
        className={`w-auto object-contain ${className}`}
        style={{ height: size === 'lg' ? 64 : 48 }}
      />
    );
  }

  return (
    <img
      src="/bih-banner.png"
      alt="Boreal Iron Heavy — Northern Heavy Equipment"
      style={{ maxWidth }}
      className={`w-full h-auto object-contain ${className}`}
    />
  );
}
