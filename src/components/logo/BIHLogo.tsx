/**
 * BIH Logo — Boreal Iron Heavy
 *
 * 品牌识别：
 *   图标  → 黄色对角右上箭头（品牌核心标识符）
 *   字标  → BIH 粗体 + BOREAL IRON HEAVY 副标
 *
 * 尺寸：
 *   sm → Header（图标 + BIH，无副标）
 *   md → Footer / 通用（图标 + BIH + 副标）
 *   lg → Hero 首屏（大尺寸全展示）
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
  const bihColor = variant === 'navy' ? '#FFFFFF' : '#003366';
  const subColor = variant === 'navy' ? 'rgba(255,255,255,0.60)' : 'rgba(0,51,102,0.55)';

  /* ── 尺寸系统 ── */
  const cfg = {
    sm: { iconSize: 28, bihClass: 'text-xl',    gap: 'gap-2.5', showSub: false },
    md: { iconSize: 36, bihClass: 'text-2xl',   gap: 'gap-3',   showSub: true  },
    lg: { iconSize: 52, bihClass: 'text-[2.6rem]', gap: 'gap-4', showSub: true },
  }[size];

  /*
   * 对角箭头图标 (↗)
   * 参考 Gemini 品牌素材：平面风格，指向右上角
   * viewBox 48×48，用 polygon 组合：主干 + 箭头三角
   */
  const s = cfg.iconSize;

  return (
    <div
      className={`inline-flex items-center ${cfg.gap} ${className}`}
      aria-label="Boreal Iron Heavy"
    >
      {/* ── 箭头图标 ── */}
      <svg
        width={s}
        height={s}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        {/*
         * ↗ 箭头：仿 bih-icon-flat.png 的品牌箭头
         *
         * 路径说明（顺时针）：
         *   (4,32)  → 箭杆尾部左上角
         *   (4,36)  → 尾部缺口外凸点（形成尾部 V 形凹槽）
         *   (12,44) → 尾部右下角
         *   (38,18) → 箭杆右侧顶端（进入箭头区域）
         *   (48,24) → 箭头右侧基底
         *   (48,0)  → 右上角箭尖
         *   (24,0)  → 箭头左侧顶端
         *   (30,6)  → 箭头内角（与箭杆左侧连接）
         *   CLOSE   → 回到 (4,32)，左侧边与右侧边平行 ✓
         */}
        <path
          d="M4,32 L4,36 L12,44 L38,18 L48,24 L48,0 L24,0 L30,6 Z"
          fill="#FFC500"
        />
      </svg>

      {/* ── 文字区域 ── */}
      <div className="flex flex-col leading-none">
        {/* BIH 主字标 */}
        <span
          className={`${cfg.bihClass} font-black uppercase tracking-wide`}
          style={{ color: bihColor, fontFamily: "'Impact', 'Arial Black', sans-serif" }}
        >
          BIH
        </span>

        {/* BOREAL IRON HEAVY 副标（md / lg） */}
        {cfg.showSub && (
          <span
            className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.18em]"
            style={{ color: subColor }}
          >
            BOREAL IRON HEAVY
          </span>
        )}
      </div>

      {/* showTagline 向后兼容（lg 尺寸右侧扩展标语） */}
      {showTagline && size === 'lg' && (
        <div className="ml-4 border-l border-white/20 pl-4">
          <span className="block text-[10px] font-bold uppercase tracking-[0.15em] text-yellow-400">
            Northern Heavy Equipment
          </span>
          <span className="block text-[9px] text-white/50 tracking-wider">
            Coast-to-Coast Canada
          </span>
        </div>
      )}
    </div>
  );
};
