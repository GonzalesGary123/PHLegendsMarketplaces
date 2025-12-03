import { createError, defineEventHandler, getQuery, setResponseHeader } from "h3";
import { getListingsFromDB, getRokListingsFromDB } from "../utils/db";
let cacheYmir: any[] = [];
let cacheRok: any[] = [];
let cacheTs = 0;
const TTL_MS = 300000;

export default defineEventHandler(async (event) => {
  const { game, force } = getQuery(event) as any;
  const now = Date.now();
  const fresh = !force && now - cacheTs < TTL_MS;
  setResponseHeader(event, 'Cache-Control', 'public, max-age=60, stale-while-revalidate=600');
  try {
    if ((game === 'ymir' || game === 'rok') && fresh) {
      if (game === 'ymir') return cacheYmir;
      if (game === 'rok') return cacheRok;
    }

    if (game === 'ymir') {
      const [a, b] = await Promise.allSettled([
        getListingsFromDB(event, 'approved', { limit: 120, slim: true }),
        getListingsFromDB(event, 'sold', { limit: 60, slim: true }),
      ]);
      const ymirApproved = a.status === 'fulfilled' ? a.value : [];
      const ymirSold = b.status === 'fulfilled' ? b.value : [];
      let ymir = [...ymirApproved, ...ymirSold].map((item) => {
        const { images, ...rest } = item;
        return { ...rest, images: [], game: 'ymir' as const };
      });
      if (!ymir.length && fresh) ymir = cacheYmir;
      cacheYmir = ymir;
      cacheTs = now;
      return ymir;
    }

    if (game === 'rok') {
      const [c, d] = await Promise.allSettled([
        getRokListingsFromDB(event, 'approved', { limit: 120, slim: true }),
        getRokListingsFromDB(event, 'sold', { limit: 60, slim: true }),
      ]);
      const rokApproved = c.status === 'fulfilled' ? c.value : [];
      const rokSold = d.status === 'fulfilled' ? d.value : [];
      let rok = [...rokApproved, ...rokSold].map((item: any) => ({
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
        images: [],
        status: item.status,
        approvedBy: undefined,
        approvedAt: undefined,
        createdAt: item.createdAt,
        middleman: item.middleman || undefined,
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
      }));
      if (!rok.length && fresh) rok = cacheRok;
      cacheRok = rok;
      cacheTs = now;
      return rok;
    }

    if (fresh) {
      return [...cacheYmir, ...cacheRok];
    }

    const [s0, s1, s2, s3] = await Promise.allSettled([
      getListingsFromDB(event, 'approved', { limit: 60, slim: true }),
      getListingsFromDB(event, 'sold', { limit: 30, slim: true }),
      getRokListingsFromDB(event, 'approved', { limit: 60, slim: true }),
      getRokListingsFromDB(event, 'sold', { limit: 30, slim: true }),
    ]);

    const ymirApproved = s0.status === 'fulfilled' ? s0.value : [];
    const ymirSold = s1.status === 'fulfilled' ? s1.value : [];
    const rokApproved = s2.status === 'fulfilled' ? s2.value : [];
    const rokSold = s3.status === 'fulfilled' ? s3.value : [];

    let ymir = [...ymirApproved, ...ymirSold].map((item) => {
      const { images, ...rest } = item;
      return { ...rest, images: [], game: 'ymir' as const };
    });
    let rok = [...rokApproved, ...rokSold].map((item: any) => ({
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
      images: [],
      status: item.status,
      approvedBy: undefined,
      approvedAt: undefined,
      createdAt: item.createdAt,
      middleman: item.middleman || undefined,
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
    }));

    if (!ymir.length && cacheYmir.length && fresh) ymir = cacheYmir;
    if (!rok.length && cacheRok.length && fresh) rok = cacheRok;
    cacheYmir = ymir;
    cacheRok = rok;
    cacheTs = now;
    return [...ymir, ...rok];
  } catch (err: any) {
    console.error('Failed to fetch listings:', err);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch listings. Please try again.",
    });
  }
});
