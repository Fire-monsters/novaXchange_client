import { useEffect, useState } from 'react'

/**
 * Hook to detect device type (mobile/tablet/desktop) for conditional rendering
 * Useful for animations optimization on mobile
 */
export const useDeviceDetect = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase()
    const mobile = /mobile|android|iphone|ipad|phone/i.test(userAgent)
    const tablet = /ipad|tablet|android(?!.*mobile)/i.test(userAgent)
    setIsMobile(mobile && !tablet)
    setIsTablet(tablet)
  }, [])

  return { isMobile, isTablet }
}