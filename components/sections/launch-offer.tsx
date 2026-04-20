import Image from "next/image"
import { Button } from "@/components/common/button"
import { storeUrl } from "@/content/site"
import { volynxCardIcons } from "@/content/volynx-card-icons"

const items = [
  { label: "Premium kit ecosystem" },
  { label: "Commercial-ready structure" },
  { label: "Launchable today" }
]

export function LaunchOffer() {
  return (
    <section className="py-8">
      <div className="container-shell">
        <div className="surface grid gap-5 p-5 md:grid-cols-[1fr_auto] md:items-center">
          <div className="grid gap-4 md:grid-cols-3">
            {items.map((item, index) => {
              const icon = volynxCardIcons.launch[index % volynxCardIcons.launch.length]

              return (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-black/30">
                    <Image src={icon} alt="" width={72} height={72} className="h-9 w-9 object-contain" />
                  </div>
                  <p className="text-sm font-medium text-white">{item.label}</p>
                </div>
              )
            })}
          </div>
          <Button href={storeUrl}>Open product store</Button>
        </div>
      </div>
    </section>
  )
}
