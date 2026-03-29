import svgPaths from "./svg-8pseo28zg1";

function Cub() {
  return (
    <div className="absolute inset-[14.08%_18.22%]" data-name="Cub">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 38.3099 43.0986">
        <g id="Cub">
          <path d={svgPaths.pb8eff00} fill="var(--fill-0, #1A1A1A)" id="Rectangle 107" />
          <path clipRule="evenodd" d={svgPaths.p1b234070} fill="var(--fill-0, #1A1A1A)" fillRule="evenodd" id="Vector 12 (Stroke)" />
        </g>
      </svg>
    </div>
  );
}

function Logo2() {
  return (
    <div className="absolute contents inset-[14.08%_18.22%]" data-name="Logo">
      <Cub />
    </div>
  );
}

function Logo1() {
  return (
    <div className="absolute bg-[#9eff00] inset-[0_66.08%_0_0] overflow-clip rounded-[9.377px]" data-name="Logo">
      <Logo2 />
    </div>
  );
}

function Logo() {
  return (
    <div className="h-[60px] relative shrink-0 w-[177.722px]" data-name="Logo">
      <Logo1 />
      <div className="-translate-y-1/2 absolute h-[19.054px] left-[39.71%] right-0 top-[calc(50%-0.47px)]" data-name="SquareUp">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 107.154 19.0543">
          <g id="SquareUp">
            <path d={svgPaths.p29b7bb80} fill="var(--fill-0, white)" />
            <path d={svgPaths.p3db3b80} fill="var(--fill-0, white)" />
            <path d={svgPaths.pb5871c0} fill="var(--fill-0, white)" />
            <path d={svgPaths.p343a5300} fill="var(--fill-0, white)" />
            <path d={svgPaths.p3bc34f00} fill="var(--fill-0, white)" />
            <path d={svgPaths.p3df870f0} fill="var(--fill-0, white)" />
            <path d={svgPaths.p29f07b80} fill="var(--fill-0, white)" />
            <path d={svgPaths.p2dfa3670} fill="var(--fill-0, white)" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#9eff00] content-stretch flex items-center px-[24px] py-[16px] relative rounded-[8px] shrink-0" data-name="Button">
      <p className="font-['Barlow:Medium',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#262626] text-[18px] whitespace-nowrap">Contact Us</p>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#262626] content-stretch flex items-start px-[28px] py-[14px] relative rounded-[8px] shrink-0" data-name="Button">
      <p className="font-['Barlow:SemiBold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[18px] text-white whitespace-nowrap">Home</p>
    </div>
  );
}

function ButtonsContainer() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex gap-[30px] items-center left-[calc(50%+0.5px)] top-[21px]" data-name="Buttons Container">
      <Button1 />
      <p className="font-['Barlow:Medium',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#e6e6e6] text-[18px] whitespace-nowrap">Services</p>
      <p className="font-['Barlow:Medium',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#e6e6e6] text-[18px] whitespace-nowrap">Work</p>
      <p className="font-['Barlow:Medium',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#e6e6e6] text-[18px] whitespace-nowrap">Process</p>
      <p className="font-['Barlow:Medium',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#e6e6e6] text-[18px] whitespace-nowrap">About</p>
      <p className="font-['Barlow:Medium',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#e6e6e6] text-[18px] whitespace-nowrap">Careers</p>
    </div>
  );
}

export default function Navbar() {
  return (
    <div className="content-stretch flex items-center justify-between px-[162px] py-[20px] relative size-full" data-name="Navbar">
      <div aria-hidden="true" className="absolute border-[#262626] border-b border-solid inset-0 pointer-events-none" />
      <Logo />
      <Button />
      <ButtonsContainer />
    </div>
  );
}