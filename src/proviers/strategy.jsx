import { api } from '@/lib/utils'
import { createContext, useEffect, useState } from 'react'

const StrategyContext = createContext()

function StrategyProvider({ children }) {
  // make into light/dark theme post co-locating
  const [seed, setSeed] = useState(-1)

  useEffect(() => {
    let pastSeed = null
    try {
      pastSeed = JSON.parse(localStorage.getItem('strategy'))
    } finally {}

    if (seed === pastSeed) return // Prevent infinite loops

    if (!(pastSeed === null) && pastSeed != -1) {
      setSeed(pastSeed)
      return
    }

    ;(async () =>
      await api
        .get('/seed')
        .then(({ data }) => data)
        .then((newSeed) => {
          localStorage.setItem('strategy', newSeed)
          setSeed(newSeed)
        }))()
  })

  return <StrategyContext.Provider value={seed}>{children}</StrategyContext.Provider>
}

export { StrategyContext, StrategyProvider }
