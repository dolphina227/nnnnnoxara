import revaBox from '@/assets/reva-box.png';

export function MysteryBox() {
  return (
    <div className="relative">
      {/* Glow effect */}
      <div className="absolute inset-0 blur-3xl opacity-50">
        <div className="w-full h-full bg-gradient-to-br from-neon-purple via-transparent to-neon-cyan rounded-full" />
      </div>

      {/* Box */}
      <div className="relative animate-float">
        <img
          src={revaBox}
          alt="REVA Mystery Box"
          className="w-80 h-80 object-contain drop-shadow-2xl"
        />
      </div>

      {/* Circular text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg
          viewBox="0 0 200 200"
          className="w-[400px] h-[400px] animate-rotate-text opacity-30"
        >
          <defs>
            <path
              id="circlePath"
              d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0"
            />
          </defs>
          <text className="fill-current text-xs uppercase tracking-[0.5em]">
            <textPath href="#circlePath">
              NFT MYSTERY BOX • EXCLUSIVE ACCESS • EARLY ADOPTER • 
            </textPath>
          </text>
        </svg>
      </div>
    </div>
  );
}
