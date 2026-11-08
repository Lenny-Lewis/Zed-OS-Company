import TechLandingHero from '@/components/sections/TechLandingHero'
import HomeHowWeWork from '@/components/sections/HomeHowWeWork'
import HomeChrome from '@/components/home/HomeChrome'
import HomeCards from '@/components/home/HomeCards'
import HomeWhoWeAre from '@/components/home/HomeWhoWeAre'
import HomeFeatured from '@/components/home/HomeFeatured'
import HomeStandards from '@/components/home/HomeStandards'
import HomeFaq from '@/components/home/HomeFaq'
import HomeContact from '@/components/home/HomeContact'
import Footer from '@/components/Footer'

// After good-fella.com's home page: dark hero, then light (cards, who we are), the factory, dark
// (what we do), light (standards), dark (questions), light (start a project). The hero and the
// factory are our own and stay as they are.
export default function Home() {
  return (
    <>
      <HomeChrome />
      <TechLandingHero />
      <HomeCards />
      <HomeWhoWeAre />
      <HomeHowWeWork />
      <HomeFeatured />
      <HomeStandards />
      <HomeFaq />
      <HomeContact />
      <Footer />
    </>
  )
}
