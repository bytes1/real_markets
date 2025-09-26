import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const LandingPage = () => {
  return (
    <div className="pt-[80px] bg-white">
      <div className="relative md:min-h-[956px] overflow-hidden">
        {/* Main Content */}
        <div className="h-full flex flex-col items-center justify-center pt-[45px]">
          <div className="md:relative z-[2] md:top-[40px]">
            {/* Heading Text */}
            <div className="mb-4">
              <div>
                <h1 className="font-extrabold text-4xl md:text-8xl text-center leading-tight md:leading-snug">
                  <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    The Ultimate Place <br className="md:hidden" />
                    To Predict and Earn <br className="md:hidden" />
                    on Moca
                  </span>
                </h1>
              </div>
            </div>

            {/* Sub-heading Text */}
            <div>
              <p className="md:text-[24px] md:leading-8 leading-[16px] text-[12px] font-medium md:mt-[28px] text-center bg-gradient-to-r from-[#A66342] to-[#8C4522] bg-clip-text text-transparent">
                protocol on Moca
              </p>
              <p className="md:text-[24px] md:leading-8 leading-[16px] text-[12px] font-medium text-center bg-gradient-to-r from-[#A66342] to-[#8C4522] bg-clip-text text-transparent">
                {/* yield with automated vaults and more DeFi initiatives. */}
              </p>
            </div>

            {/* Mobile Launch App Button */}
            <Link to="/home">
              <Button
                variant="outline"
                className="flex md:hidden items-center justify-center mx-auto border border-solid border-[#8C4522] rounded-[58px] p-[2px] cursor-pointer max-w-[115px] mt-10 text-[#8C4522] hover:text-[#A66342]"
              >
                <div className="flex items-center justify-center w-[24px] h-[24px] rounded-full bg-[linear-gradient(175deg,_#A66342_0%,_#8C4522_100%)]">
                  <img
                    src="/images/home/right.png"
                    className="w-[6px] h-[10px]"
                    alt="arrow"
                  />
                </div>
                <span className="font-semibold text-[12px] bg-gradient-to-r from-[#A66342] to-[#8C4522] bg-clip-text text-transparent whitespace-nowrap ml-1">
                  Launch APP
                </span>
              </Button>
            </Link>

            {/* Desktop Launch App Button */}
            <Link to="/home">
              <div className="hidden md:block mx-auto overflow-hidden border-2 border-solid border-[#8C4522] mt-20 rounded-[58px] p-2 pr-[24px] cursor-pointer w-[370px]">
                <div className="relative w-[350px] h-[74px]">
                  {/* Background and Marquee setup. Actual animation would require JS/CSS animation implementation */}
                  <div className="absolute inset-0 rounded-full w-[74px] overflow-hidden bg-[linear-gradient(175deg,_#A66342_0%,_#8C4522_100%)]"></div>
                  <div className="absolute inset-0 flex items-center overflow-hidden w-[74px] rounded-[58px] z-[12] opacity-0">
                    {/* Marquee is a complex component, showing static structure here */}
                    <div className="flex">
                      {[...Array(14)].map((_, i) => (
                        <div key={i} className="px-2">
                          <img
                            src="/images/home/right.png"
                            height="30"
                            width="18"
                            alt="arrow"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Visible Content */}
                  <div className="absolute inset-0 w-full flex items-center justify-between z-10">
                    <div className="flex items-center justify-center w-[74px] h-[74px] rounded-full">
                      <img
                        src="/images/home/right.png"
                        className="w-[18px] h-[30px]"
                        alt="arrow"
                      />
                    </div>
                    <span className="font-semibold text-[40px] bg-gradient-to-r from-[#A66342] to-[#8C4522] bg-clip-text text-transparent whitespace-nowrap mr-4">
                      Launch APP
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Mobile Background Image */}
            <img
              src="/images/home/first-bg-mobile-zip.png"
              className="md:hidden block w-full mt-4"
              alt=""
            />
          </div>
        </div>

        {/* Desktop Decorative Images */}
        <div className="md:block hidden">
          <img
            src="/images/home/first-screen-bg-zip.png"
            className="absolute top-[150px] left-1/2 -translate-x-1/2 min-w-[1920px] z-[1]"
            alt=""
          />
          <img
            src="/images/home/referee.png"
            className="absolute left-[0px] top-[334px] w-[280px] z-[2]"
            alt="referee"
          />
          <div className="absolute left-[150px] top-[344px]">
            <img
              src="/images/home/referee-hand.png"
              className="w-[84px] z-[1]"
              alt="referee hand"
              style={{ transformOrigin: "0% 70%" }}
            />
          </div>

          {/* Sunglasses with reflection effect */}
          <div className="absolute top-[608px] overflow-hidden right-[301px] z-[3] bg-cover bg-[url(/images/home/sunglasses-left.png)] w-[55px] h-[37.04px] [mask-image:url(/images/home/sunglasses-left.png)] [mask-size:cover]">
            <div
              className="w-[70px] h-[70px] bg-[url(/images/home/reflective-strip.png)] absolute left-[-60px] top-[-10px] bg-cover"
              style={{ transform: "translateX(43.85px)" }}
            ></div>
          </div>
          <div className="absolute top-[628px] overflow-hidden right-[240px] z-[3] bg-cover bg-[url(/images/home/sunglasses-right.png)] w-[49px] h-[43px] [mask-image:url(/images/home/sunglasses-right.png)] [mask-size:cover]">
            <div
              className="w-[70px] h-[70px] bg-[url(/images/home/reflective-strip.png)] absolute left-[-70px] top-[-10px] bg-cover"
              style={{ transform: "translateX(48.72px)" }}
            ></div>
          </div>

          {/* Floating assets */}
          <img
            src="/images/home/gold1.png"
            className="absolute left-[60px] top-[707px] w-[115px] z-[1]"
            alt="gold coin"
          />
          <img
            src="/images/home/gold2.png"
            className="absolute left-[61px] top-[914px] w-[161px] z-[1]"
            alt="gold coin"
          />
          <img
            src="/images/home/gold3.png"
            className="absolute left-[298px] top-[778px] w-[135px] z-[1]"
            alt="gold coin"
          />
          <img
            src="/images/home/gold4.png"
            className="absolute left-[512px] top-[805px] w-[39px] z-[1]"
            alt="gold coin"
          />
          <img
            src="/images/home/gold5.png"
            className="absolute left-[770px] top-[878px] w-[133px] z-[1]"
            alt="gold coin"
          />
          <img
            src="/images/home/blue-star.png"
            className="absolute left-[220px] top-[675px] w-[64px] z-[1]"
            alt="star"
          />

          <img
            src="/images/home/yellow-star.png"
            className="absolute left-[614px] top-[939px] w-[70px] z-[1]"
            alt="star"
          />
          <img
            src="/images/home/shell.png"
            className="absolute right-[111px] top-[195px] w-[131px] z-[1]"
            alt="shell"
          />

          {/* Audio player and notes */}
          <img
            src="/images/home/audio.png"
            className="absolute right-[60px] top-[850px] z-[4] w-[111px] origin-bottom"
            alt="audio"
          />
          <img
            src="/images/home/new-note1.png"
            className="absolute right-[90px] top-[805px] z-[3] w-[18px]"
            alt="music note"
            style={{
              transform: "translateX(-44px) translateY(-56px) scale(1)",
              opacity: 0.51,
            }}
          />
          <img
            src="/images/home/new-note2.png"
            className="absolute right-[90px] top-[805px] z-[3] w-[24px]"
            alt="music note"
            style={{
              transform: "translateX(-80px) translateY(-120px) scale(0.8)",
              opacity: 0,
            }}
          />
          <img
            src="/images/home/new-note3.png"
            className="absolute right-[90px] top-[805px] z-[3] w-[41px]"
            alt="music note"
            style={{
              transform: "translateX(-60px) translateY(-120px) scale(0.8)",
              opacity: 0,
            }}
          />

          <img
            src="/images/home/gold9.png"
            className="absolute right-[82px] top-[657px] w-[50px] z-[1]"
            alt="gold coin"
          />
          <img
            src="/images/home/gold8.png"
            className="absolute right-[417px] top-[954px] w-[100px] z-[1]"
            alt="gold coin"
          />
          <img
            src="/images/home/gold7.png"
            className="absolute right-[400px] top-[854px] w-[49px] z-[1]"
            alt="gold coin"
          />
          <img
            src="/images/home/gold6.png"
            className="absolute right-[586px] top-[956px] w-[55px] z-[1]"
            alt="gold coin"
          />
        </div>
      </div>
    </div>
  );
};
