import { useState } from 'react'

export default (initialValue = false) => {
  const [isOpenOnMobile, setOpenOnMobile] = useState(false)

  return {
    isOpenOnMobile,
    toggleSidebar: () => setOpenOnMobile(!isOpenOnMobile)
  }
}
