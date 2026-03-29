/**
 * BIH Logo — Boreal Iron Heavy
 *
 * 品牌识别系统 v2：
 *   图标  → 圆角方块徽章（navy/yellow 双色）+ ↗ 方向性箭头
 *   字标  → BIH 超粗体 + BOREAL IRON HEAVY 小型大写副标
 *
 * 尺寸规格：
 *   sm → Header（32px 图标 + BIH，不显示副标）
 *   md → Footer / 通用（44px 图标 + BIH + 副标）
 *   lg → Hero 首屏（64px 图标 + 全展示）
 *
 * 变体说明：
 *   navy  → 深蓝底 × 黄色箭头 × 白色文字（用于深色背景）
 *   yellow → 黄色底 × 深蓝箭头 × 深蓝文字（用于浅色背景）
 */
export const BIHLogo = ({
  className = '',
  variant = 'navy',
  size = 'md',
  showTagline = false,
}: {
  className?: string;
  variant?: 'navy' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}) => {
  /* ── 色彩 ── */
  const isNavy = variant === 'navy';
  const badgeBg    = isNavy ? '#003366' : '#FFC500';
  const arrowFill  = isNavy ? '#FFC500' : '#003366';
  const bihColor   = isNavy ? '#FFFFFF' : '#003366';
  const subColor   = isNavy ? 'rgba(255,255,255,0.60)' : 'rgba(0,51,102,0.55)';

  /* ── 尺寸系统 ── */
  const cfg = {
    sm: { iconSize: 32, bihPx: 18, subShow: false, gap: 10 },
    md: { iconSize: 44, bihPx: 24, subShow: true,  gap: 12 },
    lg: { iconSize: 64, bihPx: 36, subShow: true,  gap: 18 },
  }[size];

  const s = cfg.iconSize;

  return (
    <div
      className={`inline-flex items-center ${className}`}
      style={{ gap: cfg.gap }}
      aria-label="Boreal Iron Heavy"
    >
      {/* ────────────────────────────────────────
          图标徽章
          viewBox 48×48：
            背景 → 圆角矩形 rx=10，品牌色
            箭头 → 由 7 点多边形构成 ↗ 方向箭头
              - 箭杆：左边 (6,35)→(28,12)，右边 (14,40)→(36,17)
              - 箭头：(24,5)→(43,5)→(43,24) 等腰直角三角形
              - 两侧均衡，杆宽约 9.4px，箭头 19×19px
      ─────────────────────────────────────────── */}
      <svg
        width={s}
        height={s}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        {/* 背景徽章 */}
        <rect width="48" height="48" rx="10" fill={badgeBg} />

        {/* ↗ 方向箭头
            坐标（顺时针）：
              (6,35)  箭杆左侧尾端
              (28,12) 箭杆左侧顶端
              (24,5)  箭头左翼外角（向左展开）
              (43,5)  箭尖（右上角）
              (43,24) 箭头下翼外角
              (36,17) 箭杆右侧顶端
              (14,40) 箭杆右侧尾端
        */}
        <polygon
          points="6,35 28,12 24,5 43,5 43,24 36,17 14,40"
          fill={arrowFill}
        />
      </svg>

      {/* ── 文字区域 ── */}
      <div className="flex flex-col leading-none" style={{ gap: 3 }}>
        {/* BIH 主字标：Inter ExtraBold，紧凑字距 */}
        <span
          style={{
            color: bihColor,
            fontSize: cfg.bihPx,
            fontFamily: "'Inter', 'Roboto', system-ui, sans-serif",
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}
        >
          BIH
        </span>

        {/* 副标：小型大写，宽字距 */}
        {cfg.subShow && (
          <span
            style={{
              color: subColor,
              fontSize: 7.5,
              fontFamily: "'Inter', 'Roboto', system-ui, sans-serif",
              fontWeight: 600,
              letterSpacing: '0.20em',
              textTransform: 'uppercase',
              lineHeight: 1,
            }}
          >
            BOREAL IRON HEAVY
          </span>
        )}
      </div>

      {/* showTagline：lg 尺寸右侧品牌延伸文案（向后兼容） */}
      {showTagline && size === 'lg' && (
        <div style={{ marginLeft: 16, paddingLeft: 16, borderLeft: '1px solid rgba(255,255,255,0.20)' }}>
          <span style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: '#FFC500' }}>
            Northern Heavy Equipment
          </span>
          <span style={{ display: 'block', fontSize: 9, color: 'rgba(255,255,255,0.50)', letterSpacing: '0.10em' }}>
            Coast-to-Coast Canada
          </span>
        </div>
      )}
    </div>
  );
};
