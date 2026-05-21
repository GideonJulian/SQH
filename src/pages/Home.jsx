import Hero from "../components/Hero";
import FeaturedProducts from "../components/FeaturedProducts";
import MobileFeaturedCarousel from "../components/MobileFeaturedCarousel";
import BottomNav from "../components/BottomNav";

export default function Home() {
  return (
    <div className="font-body-md text-on-surface bg-background antialiased overflow-x-hidden">
      
      <main className="pb-32 md:pb-0">

        {/* HERO */}
        <Hero />

        {/* ========================= */}
        {/* MOBILE FEATURED CAROUSEL */}
        {/* ========================= */}
        <MobileFeaturedCarousel />

        {/* ========================= */}
        {/* DESKTOP CATEGORY STRIP */}
        {/* ========================= */}
        <section className="hidden md:block border-b-2 border-black bg-white">
          <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 divide-x-2 divide-black border-x-2 border-black md:border-x-0">
            {[
              {
                title: "JERSEYS",
                src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYes7-NkBiO_q_OC5Mgpf6IlDuzXMtRUBt6DJxHMXWIakwVkWz3kPc59p4K3e7732P4Q1SMyjeXdIYXJeDtLT7MHrwp6Gvkt3Q2qA4heoQoFFzgB-S8nU9Iqoz8gTM4l3tPW36M4Ct_NAjQADHs-4TYd4haWA5suRB_9z5hSs9bIUsQACt6zqrkC5rQNnT1cO_m3cwpNYuy_dDaLEU92QluWGwrC8p6xr5k10hdptzUMRVPUTRnKlvKQo_wzsHyQ4Efg26CXQBF_c",
              },
              {
                title: "HOODIES",
                src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCev6BmyVol9r5tOyeMbDlquYIN4ZWQj1h8J6UD8pRG1IFQXPDBdoSj78lL1q1mdLtTDzutmy-Ea5vegFOK93B2v4sXOokaHL8uhs0zxqtv1I9Wn2GI82psBikAXOTWaKzP3SmoEXIygP1IvntDzTrvW3xsA12XeI3AW_hLaBCWF1yGON-jZZdISOaS7quixHTXNMuunoSa1Z6PqgYLf_leqXg4oWqxPDuEgRqW4OadNRlUZf874XzBcQvPlucpmptrlH_H74bVyAM",
              },
              {
                title: "CAPS",
                src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcvpxesKI3kJZAcyUFcIeYEISsr9YOkHxknoi_7fCERqRh4NsL2xR3EGazrFXXQwoRz-nI-0khyTSfYRJeizfLtUaRa1OhBTQKu_yrM0ZliPLvD9trGYrElQrLMd6b4mGaD-DIaWQQ1SZ2ZybxC5KmR5N62o3uetYo8xqyel3yEcN-w1kEIqqxz9x9WfgVcpoI6tqR9V9ukwBVJjW4PP5DWYftcTPSg-NDritpOgQ77T8CO4SRaZU3_Ew6hDqkz8zcQak661Vuvzg",
              },
              {
                title: "ACCESSORIES",
                src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-SlwbRxXhF7MuzlGMbLNBf2jANx4F23M5UerVoR55kr4S_lAduxb2cNfXVDu9pNkFToOXSW9AMdB9QitF3vkMXe_81ys-iENJI9bj0IZBCgKmyjtMVlB19gG6doxAjBf9PDIRDAEMlT8XiXyogBDw3aCeEFbaVFkecrv2IXVHyzdKMOKobfg51mIZJWv2TpxasWUaTGu3-c5x6eWH3Plonaebsz-gLDZu5bX2Sxzf46zBTc4Ugso9_dC6EFmOGiR05VQhKhsNNRE",
              },
            ].map((item) => (
              <a
                key={item.title}
                className="group relative aspect-square md:aspect-[4/3] flex items-center justify-center overflow-hidden"
                href="#"
              >
                <img
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                  src={item.src}
                  alt={item.title}
                />

                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />

                <span className="relative z-10 font-headline-md text-headline-md text-white uppercase group-hover:tracking-[0.2em] transition-all">
                  {item.title}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* ========================= */}
        {/* DESKTOP FEATURED PRODUCTS */}
        {/* ========================= */}
        <FeaturedProducts />

        {/* ========================= */}
        {/* MOBILE ESSENTIAL GRID */}
        {/* ========================= */}
        <section className="md:hidden mt-16 px-6">

          <div className="mb-6">
            <h2 className="text-2xl font-black uppercase tracking-tight">
              Essential Gear
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-10">

            {[
              {
                title: "Stealth Pack 24L",
                price: "$180",
                src: "https://lh3.googleusercontent.com/aida-public/AB6AXuArfCwI62DWBw0JiSEWbPNNSsFK5c5T3TCnFOv4AN2abggBZ7M0xM751UfFatZAu-BEUeYXVV9Pjwqxq-crpuLUNTYpQLNBF8ByffhPIGByHfov3o8LcMKsIwziyNTiUlf-VTs9DaNpGK5vr92KQ9FSKLxDuSllBUkGkQDsVkdx3ZmXSgrTC04aQ1VaYJo9SNpt3nATDZisxbkH2mEPhmN5bZsC3VhAY-t-URGI-JAaUt66iknnDesOzGexywMXlJ-k9gtLxkszNi0",
              },

              {
                title: "Velocity Trainer",
                price: "$145",
                src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCBEMjzByYp-NNzdN-u_40zuwfCX_R4tigoG5zhngh92B2iWcz7-QFBveNgTILscAAYCAVAcRUUw2qoybzD79cJJqYDIHSjyXFb2JiMeu6dz1jyIVo-JA3fdu2OFFWWr-xWemHF6-JdG0eCmnT1uO64E_M2Ar6M5Wdd6rqGXOAcWJUfwtuIRkVeiG90yPEInTjLANcCDLGpwVibplQ_hv-SNByDNC1pMEV-GyHL7AFr_YkfC7B0XBnHpLR0SBS7eMwIXvQOuMUO7IQ",
              },

              {
                title: "Hero Graphic Tee",
                price: "$45",
                src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPo0rVu_o4tmrohoka-5kqtCNgbT8XY0mF4zNnCfwVFiCT43F84vN2jubmAiqWKXN-CC3DHWH10RH5A6QzsAZc-_O5kU3d8ITfLtAPlU22EEa45I-WAhzB6rWNeJ3LDFDNZogPU5luASZPO18_BeacqcUs8gH74e5KTNrb0bK4kSdEJAs1pIRcyZlkkDXPauYzuifdz4jdJTvqjBQc8DeNPNnS0ve31Z87cfZgoAKh4AeixU5WtLr6vONJC-Y9dovknjEdCWjnfkA",
              },

              {
                title: "Utility Shorts",
                price: "$85",
                src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBiqW5VXnyL0e_LsLGbJLT7DBnZcfAlILAwc0v9OdHWL59OsvKG6zHXO074fhS5kvof48_c1vwy3D-dtn7a_8lJCdIx0x2TSsUG2X2bG_gpWR5fxkXLap4ivJVLV8fqMf10Sg_6z_q_TclcEuiaLTFi6cIs3oFjUsaEKnyMYqJFP_CUfP5YC36QkdU3K7TsWd4jwdvzFyYcL_AOMgkMVryaRL7VTCrpoZboWabe82jd-H4rvsB2BOa60frBbNEe4sbWUlnfPv8GWIA",
              },
            ].map((item) => (
              <div key={item.title}>
                <div className="aspect-[4/5] bg-zinc-100 mb-4 overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={item.src}
                    alt={item.title}
                  />
                </div>

                <p className="font-bold uppercase tracking-tight">
                  {item.title}
                </p>

                <p className="mt-1 font-semibold">
                  {item.price}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ========================= */}
        {/* NEWSLETTER */}
        {/* ========================= */}
        <section className="hidden md:block bg-black text-white py-32 border-y-2 border-white">
          <div className="max-w-[1440px] mx-auto px-8 grid md:grid-cols-2 items-center gap-16">

            <div>
              <h2 className="font-display-xl text-display-xl uppercase leading-none mb-8">
                JOIN THE HEROES.
              </h2>

              <p className="font-body-lg text-white/60 mb-12 max-w-md">
                No spam. Only elite drops, training discipline, and community achievements.
              </p>

              <form className="flex border-b-2 border-white max-w-md">
                <input
                  className="bg-transparent border-none text-white font-label-bold flex-grow uppercase py-4 placeholder:text-white/30"
                  placeholder="ENTER YOUR EMAIL"
                  type="email"
                />

                <button className="font-label-bold uppercase hover:tracking-widest transition-all">
                  JOIN
                </button>
              </form>
            </div>

            <div className="relative group">
              <img
                className="w-full h-[500px] object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWFOZuPG5snfTcyGuWynYTr5N-dmGPQMQ_nQ1qtfiFUJ46rUD3FiM6mS6TmeR1xvZxPTC5fQVWSS2bsqWnPQ9mry19MK5JksKEx5TXuFkM_SZKJLN5l2cvvmv48ClvByYuk88FcCxA8hNTcQ8fUx76oNeS43E6J_c6eko5K24LKyx6Q-Lip56JRQNVBUm8cwQ9lvXTUabBmoPyolbTVQC_e_KEDrm1YoSia8WFOnxWwoYxnjej6Z56T-wzVZEeE564bwUvB76jN-w"
                alt="community"
              />

              <div className="absolute inset-0 border-2 border-white m-4 flex items-center justify-center">
                <span className="bg-white text-black px-6 py-3 font-label-bold uppercase">
                  COMMUNITY
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* MOBILE BOTTOM NAV */}
      <BottomNav />
    </div>
  );
}