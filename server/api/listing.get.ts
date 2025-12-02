import { createError, defineEventHandler, getQuery } from 'h3'
import { getListingById, getRokListingById } from '../utils/db'
import { sanitizeString } from '../utils/security'

export default defineEventHandler(async (event) => {
  const { id, game } = getQuery(event) as any

  let listingId = ''
  let gameKey: 'ymir' | 'rok' = 'ymir'

  try {
    listingId = sanitizeString(String(id || ''), 50)
    const g = sanitizeString(String(game || 'ymir'), 10).toLowerCase()
    gameKey = g === 'rok' ? 'rok' : 'ymir'
  } catch (err: any) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid query.' })
  }

  if (!listingId) {
    throw createError({ statusCode: 400, statusMessage: 'Listing ID is required.' })
  }

  try {
    if (gameKey === 'rok') {
      const item = await getRokListingById(event, listingId)
      if (!item) {
        throw createError({ statusCode: 404, statusMessage: 'Listing not found.' })
      }
      return {
        id: item.id,
        userId: item.userId,
        middlemanId: item.middlemanId,
        nickname: 'Rise of Kingdoms',
        server: '',
        growthPower: '',
        classesList: [],
        askingPrice: item.askingPrice,
        contactLink: item.contactLink || '',
        contactNumber: item.contactNumber,
        images: item.images || [],
        status: item.status,
        approvedBy: undefined,
        approvedAt: undefined,
        createdAt: item.createdAt,
        middleman: (item as any).middleman || undefined,
        game: 'rok' as const,
        passportReady: item.passportReady,
        passportNeeded: item.passportNeeded,
        readyToMigrate: item.readyToMigrate,
        focusType: item.focusType,
        vipLevel: item.vipLevel,
        currentGoldHeads: item.currentGoldHeads,
        troopCount: item.troopCount,
        currentPower: item.currentPower,
        firstPurchaseReceipt: item.firstPurchaseReceipt,
        hasVipSupport: item.hasVipSupport,
        kvkSeason: item.kvkSeason,
        universalSpeedupsDays: item.universalSpeedupsDays,
        equipment: item.equipment,
        topCommanders: item.topCommanders,
        farmAccounts: item.farmAccounts,
      }
    }

    const item = await getListingById(event, listingId)
    if (!item) {
      throw createError({ statusCode: 404, statusMessage: 'Listing not found.' })
    }
    return { ...item, game: 'ymir' as const }
  } catch (err: any) {
    if (err.statusCode) {
      throw err
    }
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch listing details.' })
  }
})
