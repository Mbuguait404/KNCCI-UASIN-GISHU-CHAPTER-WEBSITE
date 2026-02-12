"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import type { Partner } from "@shared/schema"

interface LogoColumnProps {
  partners: Partner[]
  index: number
  currentTime: number
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const distributePartners = (allPartners: Partner[], columnCount: number): Partner[][] => {
  const shuffled = shuffleArray(allPartners)
  const columns: Partner[][] = Array.from({ length: columnCount }, () => [])

  shuffled.forEach((partner, index) => {
    columns[index % columnCount].push(partner)
  })

  const maxLength = Math.max(...columns.map((col) => col.length))
  columns.forEach((col) => {
    while (col.length < maxLength) {
      col.push(shuffled[Math.floor(Math.random() * shuffled.length)])
    }
  })

  return columns
}

function PartnerLogoDisplay({ partner }: { partner: Partner }) {
  const initials = partner.name.split(" ").map(w => w[0]).join("").slice(0, 3)
  
  const tierColors = {
    platinum: "from-slate-300 to-slate-100",
    gold: "from-amber-300 to-amber-100",
    silver: "from-gray-300 to-gray-100",
    bronze: "from-orange-300 to-orange-100",
  }

  if (partner.logoUrl) {
    return (
      <div className="h-20 w-28 md:h-32 md:w-40 flex items-center justify-center p-2">
        <img
          src={partner.logoUrl}
          alt={partner.name}
          className="max-h-full max-w-full object-contain rounded-lg"
          loading="lazy"
        />
      </div>
    )
  }

  return (
    <div className={`h-16 w-16 md:h-24 md:w-24 rounded-lg bg-gradient-to-br ${tierColors[partner.tier]} flex items-center justify-center`}>
      <span className="text-lg md:text-xl font-bold text-slate-700 dark:text-slate-800">
        {initials}
      </span>
    </div>
  )
}

const LogoColumn: React.FC<LogoColumnProps> = React.memo(
  ({ partners, index, currentTime }) => {
    const cycleInterval = 3000
    const columnDelay = index * 200
    const adjustedTime = (currentTime + columnDelay) % (cycleInterval * partners.length)
    const currentIndex = Math.floor(adjustedTime / cycleInterval)
    const currentPartner = partners[currentIndex]

    return (
      <motion.div
        className="relative h-20 w-28 md:h-32 md:w-40 overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: index * 0.1,
          duration: 0.5,
          ease: "easeOut",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentPartner.id}-${currentIndex}`}
            className="absolute inset-0 flex items-center justify-center"
            initial={{ y: "10%", opacity: 0 }}
            animate={{
              y: "0%",
              opacity: 1,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
                mass: 1,
                bounce: 0.2,
                duration: 0.5,
              },
            }}
            exit={{
              y: "-20%",
              opacity: 0,
              transition: {
                type: "tween",
                ease: "easeIn",
                duration: 0.3,
              },
            }}
            style={{
              filter: "blur(0px)", // Static blur value to avoid negative interpolation
            }}
          >
            <PartnerLogoDisplay partner={currentPartner} />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    )
  }
)

LogoColumn.displayName = "LogoColumn"

interface LogoCarouselProps {
  columnCount?: number
  partners: Partner[]
  tier: "silver" | "bronze" | "combined"
}

export function LogoCarousel({ columnCount = 4, partners, tier }: LogoCarouselProps) {
  const [partnerSets, setPartnerSets] = useState<Partner[][]>([])
  const [currentTime, setCurrentTime] = useState(0)

  const updateTime = useCallback(() => {
    setCurrentTime((prevTime) => prevTime + 100)
  }, [])

  useEffect(() => {
    const intervalId = setInterval(updateTime, 100)
    return () => clearInterval(intervalId)
  }, [updateTime])

  useEffect(() => {
    const distributedPartners = distributePartners(partners, columnCount)
    setPartnerSets(distributedPartners)
  }, [partners, columnCount])

  // Combined background for silver and bronze
  const bgColor = "bg-gradient-to-r from-gray-100/80 via-white/50 to-orange-50/80 dark:from-gray-800/50 dark:via-gray-900/30 dark:to-orange-900/20"

  return (
    <div className={`py-8 px-4 rounded-xl border border-gray-200 dark:border-gray-700 ${bgColor}`}>
      <div className="flex justify-center items-center gap-4 md:gap-6 lg:gap-8 flex-wrap">
        {partnerSets.map((partners, index) => (
          <LogoColumn
            key={index}
            partners={partners}
            index={index}
            currentTime={currentTime}
          />
        ))}
      </div>
    </div>
  )
}
