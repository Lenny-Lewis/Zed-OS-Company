"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import {
  Package,
  Car,
  Building2,
  Laptop,
  BarChart3,
  Cpu,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  Star,
  Award,
  Users,
  Calendar,
  ArrowRight,
  Zap,
  TrendingUp,
} from "lucide-react"
import { motion, useScroll, useTransform, useInView, useSpring, type Variants } from "framer-motion"

export default function AboutUsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 })
  const isStatsInView = useInView(statsRef, { once: false, amount: 0.3 })

  // Parallax effect for decorative elements
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50])
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -20])

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  const services = [
    {
      icon: <Package className="w-6 h-6 text-white" />,
      secondaryIcon: <ShieldCheck className="w-4 h-4 absolute -top-1 -right-1 text-white/40" />,
      title: "General Supplies",
      description:
        "Reliable institutional procurement supplying certified stationery, ICT equipment, corporate furniture, cleaning essentials, and industrial gear with transparent timelines.",
      position: "left" as const,
      href: "/products",
    },
    {
      icon: <Car className="w-6 h-6 text-white" />,
      secondaryIcon: <CheckCircle className="w-4 h-4 absolute -top-1 -right-1 text-white/40" />,
      title: "Vehicle & Fleet Hire",
      description:
        "Well-maintained, licensed vehicles and professional drivers for corporate transport, executive travel, field research delegations, and institutional operations across Kenya.",
      position: "left" as const,
      href: "/services",
    },
    {
      icon: <Building2 className="w-6 h-6 text-white" />,
      secondaryIcon: <Star className="w-4 h-4 absolute -top-1 -right-1 text-white/40" />,
      title: "Conference & Facilities",
      description:
        "Full-service conference management, executive venues, and audiovisual coordination ensuring seamless institutional workshops, summits, and executive meetings.",
      position: "left" as const,
      href: "/services",
    },
    {
      icon: <Laptop className="w-6 h-6 text-white" />,
      secondaryIcon: <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-white/40" />,
      title: "Software & Systems",
      description:
        "Custom enterprise web platforms, secure portals, and operational management systems engineered for high performance, usability, and long-term scalability.",
      position: "right" as const,
      href: "/services",
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-white" />,
      secondaryIcon: <TrendingUp className="w-4 h-4 absolute -top-1 -right-1 text-white/40" />,
      title: "Data Analytics & BI",
      description:
        "Transforming raw institutional records into clean, interactive executive dashboards and business intelligence models for data-driven strategic decisions.",
      position: "right" as const,
      href: "/services",
    },
    {
      icon: <Cpu className="w-6 h-6 text-white" />,
      secondaryIcon: <Award className="w-4 h-4 absolute -top-1 -right-1 text-white/40" />,
      title: "AI & Strategic Advisory",
      description:
        "Practical Machine Learning solutions and supply chain consultancy helping organizations streamline workflows, optimize logistics, and eliminate operational waste.",
      position: "right" as const,
      href: "/services",
    },
  ]

  const stats = [
    { icon: <Award className="w-6 h-6" />, value: 100, label: "Deliveries & Projects", suffix: "+" },
    { icon: <Users className="w-6 h-6" />, value: 50, label: "Clients Served", suffix: "+" },
    { icon: <Calendar className="w-6 h-6" />, value: 5, label: "Years Experience", suffix: "+" },
    { icon: <TrendingUp className="w-6 h-6" />, value: 100, label: "Quality Assured", suffix: "%" },
  ]

  return (
    <section
      id="about-section"
      ref={sectionRef}
      className="w-full pt-32 pb-24 px-4 bg-black text-white overflow-hidden relative"
    >
      <motion.div
        className="absolute bottom-16 right-10 w-[28rem] h-[28rem] rounded-full bg-white/[0.02] blur-3xl pointer-events-none"
        style={{ y: y2, rotate: rotate2 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/4 w-2 h-2 rounded-full bg-white/25 pointer-events-none"
        animate={{
          y: [0, -12, 0],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-2.5 h-2.5 rounded-full bg-white/20 pointer-events-none"
        animate={{
          y: [0, 16, 0],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <motion.div
        className="container mx-auto max-w-6xl relative z-10"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div className="flex flex-col items-center mb-6" variants={itemVariants}>
          <motion.span
            className="text-white/50 font-mono text-xs uppercase tracking-widest mb-3 flex items-center gap-2"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Zap className="w-3.5 h-3.5 text-white/70" />
            ABOUT ZED OS TECHNOLOGIES · KISUMU &amp; EAST AFRICA
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light mb-4 text-center text-white tracking-tight font-sans">
            Built on <span className="font-serif italic font-normal text-white/90">Trust</span>, Driven by Excellence
          </h2>
          <motion.div
            className="w-16 h-px bg-white/30"
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
        </motion.div>

        <motion.p className="text-center max-w-2xl mx-auto mb-16 text-white/65 text-sm sm:text-base leading-relaxed font-sans" variants={itemVariants}>
          Zed OS Technologies Limited is a registered Kenyan company based in Kisumu Town West,
          delivering reliable general supplies, corporate vehicle hire, and conference facilities alongside
          modern custom software, data analytics, and AI/ML solutions across Kenya and East Africa.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative items-center">
          {/* Left Column */}
          <div className="space-y-12">
            {services
              .filter((service) => service.position === "left")
              .map((service, index) => (
                <ServiceItem
                  key={`left-${index}`}
                  icon={service.icon}
                  secondaryIcon={service.secondaryIcon}
                  title={service.title}
                  description={service.description}
                  variants={itemVariants}
                  delay={index * 0.15}
                  direction="left"
                  href={service.href}
                />
              ))}
          </div>

          {/* Center Image */}
          <div className="flex justify-center items-center order-first md:order-none mb-8 md:mb-0">
            <motion.div className="relative w-full max-w-xs" variants={itemVariants}>
              <motion.div
                className="rounded-lg overflow-hidden shadow-2xl border border-white/15 aspect-[4/5] relative bg-neutral-950"
                initial={{ scale: 0.94, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              >
                <img
                  src="/images/about-office.jpg"
                  alt="Zed OS Technologies Headquarters"
                  className="w-full h-full object-cover"
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent flex flex-col justify-end items-center p-5 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  <p className="text-[11px] font-mono uppercase tracking-widest text-white/60 mb-2.5">
                    Kisumu Town West, Kenya
                  </p>
                  <Link
                    href="/services"
                    className="bg-white hover:bg-neutral-200 text-black px-4 py-2 rounded-full flex items-center gap-2 text-xs font-medium font-sans transition-colors"
                  >
                    Our Capabilities <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              </motion.div>

              {/* Monochromatic subtle border outline */}
              <motion.div
                className="absolute inset-0 border border-white/20 rounded-lg -m-2.5 z-[-1] pointer-events-none"
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />

              {/* Floating accent elements in monochrome */}
              <motion.div
                className="absolute -top-4 -right-6 w-16 h-16 rounded-full bg-white/[0.04] pointer-events-none"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                style={{ y: y1 }}
              />
              <motion.div
                className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-white/[0.03] pointer-events-none"
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
                style={{ y: y2 }}
              />

              {/* Subtle pulsing dots */}
              <motion.div
                className="absolute -top-5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white/40"
                animate={{
                  y: [0, -6, 0],
                  opacity: [0.4, 0.9, 0.4],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/30"
                animate={{
                  y: [0, 6, 0],
                  opacity: [0.4, 0.9, 0.4],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              />
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-12">
            {services
              .filter((service) => service.position === "right")
              .map((service, index) => (
                <ServiceItem
                  key={`right-${index}`}
                  icon={service.icon}
                  secondaryIcon={service.secondaryIcon}
                  title={service.title}
                  description={service.description}
                  variants={itemVariants}
                  delay={index * 0.15}
                  direction="right"
                  href={service.href}
                />
              ))}
          </div>
        </div>

        {/* Stats Section */}
        <motion.div
          ref={statsRef}
          className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          animate={isStatsInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {stats.map((stat, index) => (
            <StatCounter
              key={index}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              suffix={stat.suffix}
              delay={index * 0.1}
            />
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="mt-20 bg-neutral-950 border border-white/10 text-white p-8 md:p-10 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6"
          initial={{ opacity: 0, y: 25 }}
          animate={isStatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="flex-1 text-center md:text-left">
            <span className="font-mono text-xs uppercase tracking-widest text-white/50 block mb-1">
              Connect With Our Team
            </span>
            <h3 className="text-2xl sm:text-3xl font-light text-white tracking-tight font-sans">
              Ready to elevate your operations?
            </h3>
            <p className="text-white/65 text-sm mt-2 max-w-xl font-sans">
              Partner with Zed OS Technologies for dependable institutional supplies, fleet hire, and intelligent digital systems.
            </p>
          </div>
          <Link
            href="/contact"
            className="bg-white hover:bg-neutral-200 text-black px-6 py-3.5 rounded-lg flex items-center gap-2 font-medium font-sans transition-colors text-sm whitespace-nowrap cursor-pointer shadow-lg"
          >
            Request a Quote <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}

interface ServiceItemProps {
  icon: React.ReactNode
  secondaryIcon?: React.ReactNode
  title: string
  description: string
  variants: Variants
  delay: number
  direction: "left" | "right"
  href: string
}

function ServiceItem({ icon, secondaryIcon, title, description, variants, delay, direction, href }: ServiceItemProps) {
  return (
    <motion.div
      className="flex flex-col group"
      variants={variants}
      transition={{ delay }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
    >
      <motion.div
        className="flex items-center gap-3 mb-2"
        initial={{ x: direction === "left" ? -20 : 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: delay + 0.2 }}
      >
        <motion.div
          className="text-white bg-white/5 border border-white/10 p-3 rounded-lg transition-colors duration-300 group-hover:bg-white/10 group-hover:border-white/20 relative shrink-0"
          whileHover={{ rotate: [0, -6, 6, -3, 0], transition: { duration: 0.4 } }}
        >
          {icon}
          {secondaryIcon}
        </motion.div>
        <h3 className="text-lg sm:text-xl font-medium text-white group-hover:text-white/90 transition-colors duration-300 font-sans">
          {title}
        </h3>
      </motion.div>
      <motion.p
        className="text-xs sm:text-sm text-white/65 leading-relaxed pl-14 font-sans"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: delay + 0.35 }}
      >
        {description}
      </motion.p>
      <motion.div
        className="mt-2.5 pl-14 flex items-center text-white/60 group-hover:text-white text-xs font-mono tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <Link href={href} className="flex items-center gap-1.5 hover:underline">
          Learn more <ArrowRight className="w-3 h-3" />
        </Link>
      </motion.div>
    </motion.div>
  )
}

interface StatCounterProps {
  icon: React.ReactNode
  value: number
  label: string
  suffix: string
  delay: number
}

function StatCounter({ icon, value, label, suffix, delay }: StatCounterProps) {
  const countRef = useRef(null)
  const isInView = useInView(countRef, { once: false })
  const [hasAnimated, setHasAnimated] = useState(false)

  const springValue = useSpring(0, {
    stiffness: 50,
    damping: 10,
  })

  useEffect(() => {
    if (isInView && !hasAnimated) {
      springValue.set(value)
      setHasAnimated(true)
    } else if (!isInView && hasAnimated) {
      springValue.set(0)
      setHasAnimated(false)
    }
  }, [isInView, value, springValue, hasAnimated])

  const displayValue = useTransform(springValue, (latest) => Math.floor(latest))

  return (
    <motion.div
      className="bg-neutral-950 border border-white/10 backdrop-blur-sm p-6 rounded-xl flex flex-col items-center text-center group hover:border-white/20 transition-colors duration-300"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, delay },
        },
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <motion.div
        className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-white group-hover:bg-white/10 transition-colors duration-300"
        whileHover={{ rotate: 360, transition: { duration: 0.8 } }}
      >
        {icon}
      </motion.div>
      <motion.div ref={countRef} className="text-3xl sm:text-4xl font-light text-white flex items-center tracking-tight font-sans">
        <motion.span>{displayValue}</motion.span>
        <span>{suffix}</span>
      </motion.div>
      <p className="text-white/50 text-[11px] font-mono uppercase tracking-widest mt-2">{label}</p>
      <motion.div className="w-8 h-px bg-white/20 mt-3 group-hover:w-14 group-hover:bg-white/60 transition-all duration-300" />
    </motion.div>
  )
}
