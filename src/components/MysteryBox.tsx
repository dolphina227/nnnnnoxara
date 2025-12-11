import revaBox from '@/assets/reva-box.png';

export function MysteryBox() {
  return (
    <div className="relative">
      {/* Gradient halo ring */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-br from-neon-purple/20 via-transparent to-neon-cyan/20 blur-3xl animate-pulse-glow" />
      </div>

      {/* Secondary glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[350px] h-[350px] rounded-full bg-neon-purple/10 blur-2xl animate-glow-pulse" />
      </div>

      {/* Box */}
      <div className="relative animate-float">
        <img
          src={revaBox}
          alt="REVA Mystery Box"
          className="w-80 h-80 md:w-96 md:h-96 object-contain drop-shadow-2xl"
          style={{
            filter: 'drop-shadow(0 20px 60px hsl(261 100% 62% / 0.3)) drop-shadow(0 10px 30px hsl(187 100% 42% / 0.2))'
          }}
        />
      </div>

      {/* Circular rotating text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg
          viewBox="0 0 200 200"
          className="w-[450px] h-[450px] md:w-[500px] md:h-[500px] animate-rotate-text opacity-20"
        >
          <defs>
            <path
              id="circlePath"
              d="M100,100 m-85,0 a85,85 0 1,1 170,0 a85,85 0 1,1 -170,0"
            />
          </defs>
          <text className="fill-current text-[8px] uppercase tracking-[0.4em] font-medium">
            <textPath href="#circlePath">
              NFT MYSTERY BOX • POWERED BY REVA • EXCLUSIVE ACCESS • EARLY ADOPTER • 
            </textPath>
          </text>
        </svg>
      </div>

      {/* Reflection effect */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-64 h-16 bg-gradient-to-t from-transparent to-neon-cyan/5 blur-xl rounded-full" />
    </div>
  );
}
