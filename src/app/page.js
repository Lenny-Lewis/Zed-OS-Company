import HomeHero from '@/components/sections/HomeHero'
import HomeAbout from '@/components/sections/HomeAbout'
import HomeServices from '@/components/sections/HomeServices'
import HomeWhyUs from '@/components/sections/HomeWhyUs'
import HomeVisionMission from '@/components/sections/HomeVisionMission'
import HomeCTA from '@/components/sections/HomeCTA'

export default function Home() {
  return (
    <>
      <HomeHero />
      <HomeAbout />
      <HomeServices />
      <HomeWhyUs />
      <HomeVisionMission />
      <HomeCTA />
    </>
  )
}
