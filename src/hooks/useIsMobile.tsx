import { useEffect, useState } from 'react'

const useIsMobile = (breakpoint: number = 1024) => {
  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    // Set the initial value
    handleResize()

    // Add the event listener for window resize
    window.addEventListener('resize', handleResize)

    return () => {
      // Clean up the event listener
      window.removeEventListener('resize', handleResize)
    }
  }, [breakpoint])

  return isMobile
}

export default useIsMobile
