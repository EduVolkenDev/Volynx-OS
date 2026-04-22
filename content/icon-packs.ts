export type IconPack = {
  slug: string
  name: string
  plan: "free" | "premium"
  category: string
  count: number
  price: string
  priceDetail: string
  preview: string[]
  href: string
}

export const iconPacks: IconPack[] = [
  {
    slug: "chromed-premium",
    name: "Chromed Premium",
    plan: "premium",
    category: "Metal",
    count: 77,
    price: "$29",
    priceDetail: "77-piece chrome system",
    preview: [
      "/icons-store/packs/chromed-premium/chromed-premium1.webp",
      "/icons-store/packs/chromed-premium/chromed-premium2.webp",
      "/icons-store/packs/chromed-premium/chromed-premium3.webp",
      "/icons-store/packs/chromed-premium/chromed-premium4.webp",
      "/icons-store/packs/chromed-premium/chromed-premium5.webp",
      "/icons-store/packs/chromed-premium/chromed-premium6.webp"
    ],
    href: "https://volynx.world/products/"
  },
  {
    slug: "polygon-premium-complete",
    name: "Polygon Premium Complete",
    plan: "premium",
    category: "Daily OS",
    count: 111,
    price: "$39",
    priceDetail: "111-piece flagship set",
    preview: [
      "/assets/icons-store/Poligon-Premium/daily3D1.webp",
      "/assets/icons-store/Poligon-Premium/daily3D2.webp",
      "/assets/icons-store/Poligon-Premium/daily3D3.webp",
      "/assets/icons-store/Poligon-Premium/daily3D4.webp",
      "/assets/icons-store/Poligon-Premium/daily3D5.webp",
      "/assets/icons-store/Poligon-Premium/daily3D6.webp"
    ],
    href: "https://volynx.world/products/"
  },
  {
    slug: "volynx-master-webp-premium",
    name: "Volynx Master WebP Vault",
    plan: "premium",
    category: "Master Vault",
    count: 828,
    price: "$149",
    priceDetail: "828 final WebP icons",
    preview: [
      "/assets/icons-store/volynx-master-webp/icon_0001.webp",
      "/assets/icons-store/volynx-master-webp/icon_0002.webp",
      "/assets/icons-store/volynx-master-webp/icon_0003.webp",
      "/assets/icons-store/volynx-master-webp/icon_0004.webp",
      "/assets/icons-store/volynx-master-webp/icon_0005.webp",
      "/assets/icons-store/volynx-master-webp/icon_0006.webp"
    ],
    href: "https://volynx.world/products/"
  },
  {
    slug: "neon-refactored-free",
    name: "Neon Refactored Free",
    plan: "free",
    category: "Neon",
    count: 132,
    price: "Free",
    priceDetail: "132-icon launch drop",
    preview: [
      "/assets/icons-store/Neon-Icons-Free/icons-refactored1_12.webp",
      "/assets/icons-store/Neon-Icons-Free/icons-refactored1_13.webp",
      "/assets/icons-store/Neon-Icons-Free/icons-refactored1_14.webp",
      "/assets/icons-store/Neon-Icons-Free/icons-refactored1_15.webp",
      "/assets/icons-store/Neon-Icons-Free/icons-refactored1_22.webp",
      "/assets/icons-store/Neon-Icons-Free/icons-refactored1_23.webp"
    ],
    href: "/icons-store/downloads/neon-refactored-free.zip"
  },
  {
    slug: "purple-icons-premium",
    name: "Purple Icons Premium",
    plan: "premium",
    category: "Purple",
    count: 84,
    price: "$29",
    priceDetail: "84 polished icons",
    preview: [
      "/assets/icons-store/purple-icons-premium/purple-icons_11.png",
      "/assets/icons-store/purple-icons-premium/purple-icons_12.png",
      "/assets/icons-store/purple-icons-premium/purple-icons_13.png",
      "/assets/icons-store/purple-icons-premium/purple-icons_14.png",
      "/assets/icons-store/purple-icons-premium/purple-icons_15.png",
      "/assets/icons-store/purple-icons-premium/purple-icons_16.png"
    ],
    href: "https://volynx.world/products/"
  },
  {
    slug: "daily-common-free",
    name: "Daily Essentials Free",
    plan: "free",
    category: "Daily OS",
    count: 76,
    price: "Free",
    priceDetail: "76 everyday icons",
    preview: [
      "/icons-store/packs/daily-common-free/daily-common1.webp",
      "/icons-store/packs/daily-common-free/daily-common2-1.webp",
      "/icons-store/packs/daily-common-free/daily-common2-2.webp",
      "/icons-store/packs/daily-common-free/daily-common2-3.webp",
      "/icons-store/packs/daily-common-free/daily-common2-4.webp",
      "/icons-store/packs/daily-common-free/daily-common2-5.webp"
    ],
    href: "/icons-store/downloads/daily-common-free.zip"
  },
  {
    slug: "blue-sliced-iii-free",
    name: "Blue Sliced III Free",
    plan: "free",
    category: "Blue",
    count: 81,
    price: "Free",
    priceDetail: "81 sliced blue icons",
    preview: [
      "/assets/icons-store/icons-blue-sliced3/icons-blue-sliced3_22.webp",
      "/assets/icons-store/icons-blue-sliced3/icons-blue-sliced3_23.webp",
      "/assets/icons-store/icons-blue-sliced3/icons-blue-sliced3_24.webp",
      "/assets/icons-store/icons-blue-sliced3/icons-blue-sliced3_25.webp",
      "/assets/icons-store/icons-blue-sliced3/icons-blue-sliced3_26.webp",
      "/assets/icons-store/icons-blue-sliced3/icons-blue-sliced3_27.webp"
    ],
    href: "/icons-store/downloads/blue-sliced-iii-free.zip"
  },
  {
    slug: "hyper-icons-premium",
    name: "Hyper Icons Premium",
    plan: "premium",
    category: "Hyper",
    count: 43,
    price: "$24",
    priceDetail: "43 product UI icons",
    preview: [
      "/assets/icons-store/Hyper-Icons-Premium/33.png",
      "/assets/icons-store/Hyper-Icons-Premium/34.png",
      "/assets/icons-store/Hyper-Icons-Premium/35.png",
      "/assets/icons-store/Hyper-Icons-Premium/36.png",
      "/assets/icons-store/Hyper-Icons-Premium/37.png",
      "/assets/icons-store/Hyper-Icons-Premium/38.png"
    ],
    href: "https://volynx.world/products/"
  },
  {
    slug: "metal-premium-complete",
    name: "Metal Premium Complete",
    plan: "premium",
    category: "Metal",
    count: 44,
    price: "$24",
    priceDetail: "44 high-shine icons",
    preview: [
      "/assets/icons-store/Metal-Premium/icon-metal-premium6.png",
      "/assets/icons-store/Metal-Premium/icon-metal-premium7.png",
      "/assets/icons-store/Metal-Premium/icon-metal-premium8.png",
      "/assets/icons-store/Metal-Premium/icon-metal-premium9.png",
      "/assets/icons-store/Metal-Premium/icon-metal-premium10.png",
      "/assets/icons-store/Metal-Premium/icon-metal-premium11.png"
    ],
    href: "https://volynx.world/products/"
  },
  {
    slug: "glow-premium",
    name: "Glow Premium",
    plan: "premium",
    category: "Glow",
    count: 42,
    price: "$24",
    priceDetail: "42 luminous icons",
    preview: [
      "/assets/icons-store/glow-premium/glow-premium_17.webp",
      "/assets/icons-store/glow-premium/glow-premium_19.webp",
      "/assets/icons-store/glow-premium/glow-premium_21.webp",
      "/assets/icons-store/glow-premium/glow-premium_23.webp",
      "/assets/icons-store/glow-premium/glow-premium_25.webp",
      "/assets/icons-store/glow-premium/glow-premium_27.webp"
    ],
    href: "https://volynx.world/products/"
  },
  {
    slug: "vintage-premium",
    name: "Vintage Premium",
    plan: "premium",
    category: "Vintage",
    count: 44,
    price: "$24",
    priceDetail: "44 stylized icons",
    preview: [
      "/assets/icons-store/vintage-premium/vintage-premium9.webp",
      "/assets/icons-store/vintage-premium/vintage-premium10.webp",
      "/assets/icons-store/vintage-premium/vintage-premium47.webp",
      "/assets/icons-store/vintage-premium/vintage-premium48.webp",
      "/assets/icons-store/vintage-premium/vintage-premium49.webp",
      "/assets/icons-store/vintage-premium/vintage-premium50.webp"
    ],
    href: "https://volynx.world/products/"
  },
  {
    slug: "glass-icons-premium",
    name: "Glass Icons Premium",
    plan: "premium",
    category: "Glass",
    count: 41,
    price: "$19",
    priceDetail: "41 translucent icons",
    preview: [
      "/assets/icons-store/Icons-Glass-Premium/glass-premium1.webp",
      "/assets/icons-store/Icons-Glass-Premium/glass-premium2.webp",
      "/assets/icons-store/Icons-Glass-Premium/glass-premium3.webp",
      "/assets/icons-store/Icons-Glass-Premium/glass-premium4.webp",
      "/assets/icons-store/Icons-Glass-Premium/glass-premium5.webp",
      "/assets/icons-store/Icons-Glass-Premium/glass-premium6.webp"
    ],
    href: "https://volynx.world/products/"
  },
  {
    slug: "daily3Dpremium",
    name: "Daily 3D Premium",
    plan: "premium",
    category: "Daily OS",
    count: 40,
    price: "$19",
    priceDetail: "40 3D daily icons",
    preview: [
      "/icons-store/packs/daily3Dpremium/daily3D1.webp",
      "/icons-store/packs/daily3Dpremium/daily3D2.webp",
      "/icons-store/packs/daily3Dpremium/daily3D3.webp",
      "/icons-store/packs/daily3Dpremium/daily3D4.webp",
      "/icons-store/packs/daily3Dpremium/daily3D5.webp",
      "/icons-store/packs/daily3Dpremium/daily3D6.webp"
    ],
    href: "https://volynx.world/products/"
  },
  {
    slug: "metal-chrome-premium",
    name: "Metal Chrome Premium",
    plan: "premium",
    category: "Metal",
    count: 36,
    price: "$19",
    priceDetail: "36 chrome icons",
    preview: [
      "/assets/icons-store/metal-chrome-premium/metal-chrome-premium1.webp",
      "/assets/icons-store/metal-chrome-premium/metal-chrome-premium2.webp",
      "/assets/icons-store/metal-chrome-premium/metal-chrome-premium3.webp",
      "/assets/icons-store/metal-chrome-premium/metal-chrome-premium4.webp",
      "/assets/icons-store/metal-chrome-premium/metal-chrome-premium5.webp",
      "/assets/icons-store/metal-chrome-premium/metal-chrome-premium6.webp"
    ],
    href: "https://volynx.world/products/"
  },
  {
    slug: "soft-blue-premium",
    name: "Soft Blue Premium",
    plan: "premium",
    category: "Soft Color",
    count: 40,
    price: "$19",
    priceDetail: "40 soft blue icons",
    preview: [
      "/assets/icons-store/soft-blue/soft-blue_17.webp",
      "/assets/icons-store/soft-blue/soft-blue_19.webp",
      "/assets/icons-store/soft-blue/soft-blue_21.webp",
      "/assets/icons-store/soft-blue/soft-blue_23.webp",
      "/assets/icons-store/soft-blue/soft-blue_25.webp",
      "/assets/icons-store/soft-blue/soft-blue_27.webp"
    ],
    href: "https://volynx.world/products/"
  },
  {
    slug: "soft-dark-blue-premium",
    name: "Soft Dark Blue Premium",
    plan: "premium",
    category: "Soft Color",
    count: 40,
    price: "$19",
    priceDetail: "40 dark blue icons",
    preview: [
      "/assets/icons-store/soft-dark-blue/soft-dark-blue_18.webp",
      "/assets/icons-store/soft-dark-blue/soft-dark-blue_20.webp",
      "/assets/icons-store/soft-dark-blue/soft-dark-blue_22.webp",
      "/assets/icons-store/soft-dark-blue/soft-dark-blue_24.webp",
      "/assets/icons-store/soft-dark-blue/soft-dark-blue_26.webp",
      "/assets/icons-store/soft-dark-blue/soft-dark-blue_28.webp"
    ],
    href: "https://volynx.world/products/"
  },
  {
    slug: "soft-green-premium",
    name: "Soft Green Premium",
    plan: "premium",
    category: "Soft Color",
    count: 42,
    price: "$19",
    priceDetail: "42 soft green icons",
    preview: [
      "/assets/icons-store/soft-green/soft-green_17.webp",
      "/assets/icons-store/soft-green/soft-green_19.webp",
      "/assets/icons-store/soft-green/soft-green_21.webp",
      "/assets/icons-store/soft-green/soft-green_23.webp",
      "/assets/icons-store/soft-green/soft-green_25.webp",
      "/assets/icons-store/soft-green/soft-green_27.webp"
    ],
    href: "https://volynx.world/products/"
  },
  {
    slug: "soft-orange-premium",
    name: "Soft Orange Premium",
    plan: "premium",
    category: "Soft Color",
    count: 42,
    price: "$19",
    priceDetail: "42 soft orange icons",
    preview: [
      "/assets/icons-store/soft-orange/soft-orange_17.webp",
      "/assets/icons-store/soft-orange/soft-orange_19.webp",
      "/assets/icons-store/soft-orange/soft-orange_21.webp",
      "/assets/icons-store/soft-orange/soft-orange_23.webp",
      "/assets/icons-store/soft-orange/soft-orange_25.webp",
      "/assets/icons-store/soft-orange/soft-orange_27.webp"
    ],
    href: "https://volynx.world/products/"
  },
  {
    slug: "soft-red-premium",
    name: "Soft Red Premium",
    plan: "premium",
    category: "Soft Color",
    count: 42,
    price: "$19",
    priceDetail: "42 soft red icons",
    preview: [
      "/assets/icons-store/soft-red/soft-red_17.webp",
      "/assets/icons-store/soft-red/soft-red_19.webp",
      "/assets/icons-store/soft-red/soft-red_21.webp",
      "/assets/icons-store/soft-red/soft-red_23.webp",
      "/assets/icons-store/soft-red/soft-red_25.webp",
      "/assets/icons-store/soft-red/soft-red_27.webp"
    ],
    href: "https://volynx.world/products/"
  },
  {
    slug: "daily-iridescent-premium",
    name: "Daily Iridescent Premium",
    plan: "premium",
    category: "Daily OS",
    count: 33,
    price: "$15",
    priceDetail: "33 iridescent icons",
    preview: [
      "/icons-store/packs/daily-iridescent-premium/daily-iridescent-premium1.webp",
      "/icons-store/packs/daily-iridescent-premium/daily-iridescent-premium2.webp",
      "/icons-store/packs/daily-iridescent-premium/daily-iridescent-premium4.webp",
      "/icons-store/packs/daily-iridescent-premium/daily-iridescent-premium5.webp",
      "/icons-store/packs/daily-iridescent-premium/daily-iridescent-premium6.webp",
      "/icons-store/packs/daily-iridescent-premium/daily-iridescent-premium7.webp"
    ],
    href: "https://volynx.world/products/"
  },
  {
    slug: "daily-poligon-premium",
    name: "Daily Polygon Premium",
    plan: "premium",
    category: "Daily OS",
    count: 35,
    price: "$15",
    priceDetail: "35 polygon icons",
    preview: [
      "/icons-store/packs/daily-poligon-premium/daily-poligon-premium1.webp",
      "/icons-store/packs/daily-poligon-premium/daily-poligon-premium2.webp",
      "/icons-store/packs/daily-poligon-premium/daily-poligon-premium3.webp",
      "/icons-store/packs/daily-poligon-premium/daily-poligon-premium4.webp",
      "/icons-store/packs/daily-poligon-premium/daily-poligon-premium5.webp",
      "/icons-store/packs/daily-poligon-premium/daily-poligon-premium6.webp"
    ],
    href: "https://volynx.world/products/"
  },
  {
    slug: "moderncards-premium",
    name: "Modern Cards Premium",
    plan: "premium",
    category: "Cards",
    count: 28,
    price: "$15",
    priceDetail: "28 card-style icons",
    preview: [
      "/icons-store/packs/moderncards-premium/modern-card1.webp",
      "/icons-store/packs/moderncards-premium/modern-card2.webp",
      "/icons-store/packs/moderncards-premium/modern-card34.webp",
      "/icons-store/packs/moderncards-premium/modern-card35.webp",
      "/icons-store/packs/moderncards-premium/modern-card36.webp",
      "/icons-store/packs/moderncards-premium/modern-card37.webp"
    ],
    href: "https://volynx.world/products/"
  },
  {
    slug: "icons-neon-premium",
    name: "Neon Premium",
    plan: "premium",
    category: "Neon",
    count: 24,
    price: "$12",
    priceDetail: "24 neon icons",
    preview: [
      "/icons-store/packs/icons-neon-premium/icon-neon-premium1.webp",
      "/icons-store/packs/icons-neon-premium/icon-neon-premium2.webp",
      "/icons-store/packs/icons-neon-premium/icon-neon-premium3.webp",
      "/icons-store/packs/icons-neon-premium/icon-neon-premium4.webp",
      "/icons-store/packs/icons-neon-premium/icon-neon-premium5.webp",
      "/icons-store/packs/icons-neon-premium/icon-neon-premium6.webp"
    ],
    href: "https://volynx.world/products/"
  },
  {
    slug: "icons-metal-premium",
    name: "Metal Premium",
    plan: "premium",
    category: "Metal",
    count: 20,
    price: "$12",
    priceDetail: "20 metal icons",
    preview: [
      "/icons-store/packs/icons-metal-premium/icon-metal-premium31.webp",
      "/icons-store/packs/icons-metal-premium/icon-metal-premium32.webp",
      "/icons-store/packs/icons-metal-premium/icon-metal-premium33.webp",
      "/icons-store/packs/icons-metal-premium/icon-metal-premium34.webp",
      "/icons-store/packs/icons-metal-premium/icon-metal-premium35.webp",
      "/icons-store/packs/icons-metal-premium/icon-metal-premium36.webp"
    ],
    href: "https://volynx.world/products/"
  },
  {
    slug: "darkglass-premium",
    name: "Dark Glass Premium",
    plan: "premium",
    category: "Glass",
    count: 19,
    price: "$9",
    priceDetail: "19 glass icons",
    preview: [
      "/icons-store/packs/darkglass-premium/darkglass-premium1.webp",
      "/icons-store/packs/darkglass-premium/darkglass-premium2.webp",
      "/icons-store/packs/darkglass-premium/darkglass-premium3.webp",
      "/icons-store/packs/darkglass-premium/darkglass-premium4.webp",
      "/icons-store/packs/darkglass-premium/darkglass-premium5.webp",
      "/icons-store/packs/darkglass-premium/darkglass-premium6.webp"
    ],
    href: "https://volynx.world/products/"
  },
  {
    slug: "metal-blue-premium2",
    name: "Metal Blue Premium",
    plan: "premium",
    category: "Metal",
    count: 16,
    price: "$9",
    priceDetail: "16 blue metal icons",
    preview: [
      "/icons-store/packs/metal-blue-premium2/premium-water1.webp",
      "/icons-store/packs/metal-blue-premium2/premium-water2.webp",
      "/icons-store/packs/metal-blue-premium2/premium-water3.webp",
      "/icons-store/packs/metal-blue-premium2/premium-water4.webp",
      "/icons-store/packs/metal-blue-premium2/premium-water5.webp",
      "/icons-store/packs/metal-blue-premium2/premium-water6.webp"
    ],
    href: "https://volynx.world/products/"
  },
  {
    slug: "super-icons-premium",
    name: "Super Icons Premium",
    plan: "premium",
    category: "Core",
    count: 14,
    price: "$9",
    priceDetail: "14 hero icons",
    preview: [
      "/icons-store/packs/super-icons-premium/icon_0718.webp",
      "/icons-store/packs/super-icons-premium/icon_0722.webp",
      "/icons-store/packs/super-icons-premium/super-icons-premium7.webp",
      "/icons-store/packs/super-icons-premium/super-icons-premium8.webp",
      "/icons-store/packs/super-icons-premium/super-icons-premium9.webp",
      "/icons-store/packs/super-icons-premium/super-icons-premium10.webp"
    ],
    href: "https://volynx.world/products/"
  },
  {
    slug: "abstract-free",
    name: "Abstract Neon Free",
    plan: "free",
    category: "Abstract",
    count: 24,
    price: "Free",
    priceDetail: "24 abstract icons",
    preview: [
      "/assets/icons-store/Abstract-Free/icon-neon-premium1.webp",
      "/assets/icons-store/Abstract-Free/icon-neon-premium2.webp",
      "/assets/icons-store/Abstract-Free/icon-neon-premium3.webp",
      "/assets/icons-store/Abstract-Free/icon-neon-premium4.webp",
      "/assets/icons-store/Abstract-Free/icon-neon-premium5.webp",
      "/assets/icons-store/Abstract-Free/icon-neon-premium6.webp"
    ],
    href: "/icons-store/downloads/abstract-free.zip"
  },
  {
    slug: "day-by-day-free",
    name: "Day By Day Free",
    plan: "free",
    category: "Daily OS",
    count: 36,
    price: "Free",
    priceDetail: "36 daily icons",
    preview: [
      "/assets/icons-store/Day-By-Day-free/daily-common2-1.webp",
      "/assets/icons-store/Day-By-Day-free/daily-common2-2.webp",
      "/assets/icons-store/Day-By-Day-free/daily-common2-3.webp",
      "/assets/icons-store/Day-By-Day-free/daily-common2-4.webp",
      "/assets/icons-store/Day-By-Day-free/daily-common2-5.webp",
      "/assets/icons-store/Day-By-Day-free/daily-common2-6.webp"
    ],
    href: "/icons-store/downloads/day-by-day-free.zip"
  },
  {
    slug: "food-icons-free",
    name: "Food Icons Free",
    plan: "free",
    category: "Food",
    count: 42,
    price: "Free",
    priceDetail: "42 food icons",
    preview: [
      "/icons-store/packs/food-icons-free/food-icon1.webp",
      "/icons-store/packs/food-icons-free/food-icon2.webp",
      "/icons-store/packs/food-icons-free/food-icon3.webp",
      "/icons-store/packs/food-icons-free/food-icon4.webp",
      "/icons-store/packs/food-icons-free/food-icon5.webp",
      "/icons-store/packs/food-icons-free/food-icon6.webp"
    ],
    href: "/icons-store/downloads/food-icons-free.zip"
  },
  {
    slug: "green-simple-free2",
    name: "Green Simple Free",
    plan: "free",
    category: "Green",
    count: 75,
    price: "Free",
    priceDetail: "75 green icons",
    preview: [
      "/icons-store/packs/green-simple-free2/icon_0003.webp",
      "/icons-store/packs/green-simple-free2/icon_0004.webp",
      "/icons-store/packs/green-simple-free2/icon_0005.webp",
      "/icons-store/packs/green-simple-free2/icon_0006.webp",
      "/icons-store/packs/green-simple-free2/icon_0007.webp",
      "/icons-store/packs/green-simple-free2/icon_0008.webp"
    ],
    href: "/icons-store/downloads/green-simple-free2.zip"
  },
  {
    slug: "icons-pink-abstract-free",
    name: "Pink Abstract Free",
    plan: "free",
    category: "Abstract",
    count: 42,
    price: "Free",
    priceDetail: "42 pink abstract icons",
    preview: [
      "/icons-store/packs/icons-pink-abstract-free/icons-pink-sliced_03.webp",
      "/icons-store/packs/icons-pink-abstract-free/icons-pink-sliced_05.webp",
      "/icons-store/packs/icons-pink-abstract-free/icons-pink-sliced_06.webp",
      "/icons-store/packs/icons-pink-abstract-free/icons-pink-sliced_07.webp",
      "/icons-store/packs/icons-pink-abstract-free/icons-pink-sliced_09.webp",
      "/icons-store/packs/icons-pink-abstract-free/icons-pink-sliced_11.webp"
    ],
    href: "/icons-store/downloads/icons-pink-abstract-free.zip"
  },
  {
    slug: "normal-icons-free",
    name: "Core Simple Free",
    plan: "free",
    category: "Core",
    count: 27,
    price: "Free",
    priceDetail: "27 simple icons",
    preview: [
      "/icons-store/packs/normal-icons-free/icons-simple1.webp",
      "/icons-store/packs/normal-icons-free/icons-simple2.webp",
      "/icons-store/packs/normal-icons-free/icons-simple3.webp",
      "/icons-store/packs/normal-icons-free/icons-simple4.webp",
      "/icons-store/packs/normal-icons-free/icons-simple5.webp",
      "/icons-store/packs/normal-icons-free/icons-simple6.webp"
    ],
    href: "/icons-store/downloads/normal-icons-free.zip"
  },
  {
    slug: "pinkmetal-free",
    name: "Pink Metal Free",
    plan: "free",
    category: "Metal",
    count: 43,
    price: "Free",
    priceDetail: "43 pink metal icons",
    preview: [
      "/icons-store/packs/pinkmetal-free/pinkmetal-free1.webp",
      "/icons-store/packs/pinkmetal-free/pinkmetal-free2.webp",
      "/icons-store/packs/pinkmetal-free/pinkmetal-free3.webp",
      "/icons-store/packs/pinkmetal-free/pinkmetal-free4.webp",
      "/icons-store/packs/pinkmetal-free/pinkmetal-free5.webp",
      "/icons-store/packs/pinkmetal-free/pinkmetal-free6.webp"
    ],
    href: "/icons-store/downloads/pinkmetal-free.zip"
  }
]

export const iconPackStats = {
  packs: iconPacks.length,
  icons: iconPacks.reduce((total, pack) => total + pack.count, 0),
  free: iconPacks.filter((pack) => pack.plan === "free").length,
  premium: iconPacks.filter((pack) => pack.plan === "premium").length,
} as const
