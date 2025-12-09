<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-4 sm:p-8">
    <div class="max-w-7xl mx-auto">
      <div class="mb-6 sm:mb-8 flex items-center justify-between">
        <div>
          <h2 class="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p class="text-sm text-slate-600 dark:text-slate-400">Manage ROK listings and middlemen</p>
        </div>
        <button 
          @click="navigateTo('/')" 
          class="rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm font-medium bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          ← Back to Marketplace
        </button>
      </div>

      <div v-if="notAuthorized" class="rounded-lg border border-slate-300 dark:border-slate-700 p-8 text-center bg-white dark:bg-slate-800">
        <div class="text-5xl mb-4">🔒</div>
        <h3 class="text-xl font-semibold mb-2">Admin access required</h3>
        <p class="text-sm text-slate-600 dark:text-slate-400">You don't have permission to view this page.</p>
        <button 
          @click="navigateTo('/')"
          class="mt-4 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-500"
        >
          Go Home
        </button>
      </div>
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div class="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
            <div class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Pending</div>
            <div class="text-2xl font-bold">{{ pendingCount }}</div>
          </div>
          <div class="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
            <div class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Approved</div>
            <div class="text-2xl font-bold">{{ approvedCount }}</div>
          </div>
          <div class="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
            <div class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Middlemen</div>
            <div class="text-2xl font-bold">{{ middlemenCount }}</div>
          </div>
          <div class="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
            <div class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Sold</div>
            <div class="text-2xl font-bold">{{ soldCount }}</div>
          </div>
        </div>

        <div class="mb-6 flex flex-col sm:flex-row items-center gap-3">
          <div class="inline-flex rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-1">
            <button
              type="button"
              @click="activeSection = 'pending'"
              :class="[
                'px-4 py-2 text-sm font-semibold rounded-md',
                activeSection === 'pending' ? 'border border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-300'
              ]"
            >
              Pending
            </button>
            <button
              type="button"
              @click="activeSection = 'approved'"
              :class="[
                'px-4 py-2 text-sm font-semibold rounded-md',
                activeSection === 'approved' ? 'border border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-300'
              ]"
            >
              Approved
            </button>
            <button
              type="button"
              @click="activeSection = 'sold'"
              :class="[
                'px-4 py-2 text-sm font-semibold rounded-md',
                activeSection === 'sold' ? 'border border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-300'
              ]"
            >
              Sold
            </button>
            <button
              type="button"
              @click="activeSection = 'middlemen'"
              :class="[
                'px-4 py-2 text-sm font-semibold rounded-md',
                activeSection === 'middlemen' ? 'border border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-300'
              ]"
            >
              Middlemen
            </button>
          </div>
          <div v-if="activeSection !== 'middlemen'" class="w-full sm:max-w-xs sm:ml-auto">
            <input v-model="rokSearch" type="search" placeholder="Search VIP, focus, power..." class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm" />
          </div>
          <div class="sm:ml-auto">
            <button type="button" @click="refreshActive" class="rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm font-medium bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700">Refresh</button>
          </div>
        </div>
        <section v-show="activeSection === 'pending'" class="mb-10">
          <div v-if="loadingPendingRokListings" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="n in 6" :key="n" class="rounded-lg border border-slate-300 dark:border-slate-700 p-4 animate-pulse">
              <div class="h-40 rounded bg-slate-200 dark:bg-slate-700 mb-4"></div>
              <div class="h-4 rounded bg-slate-200 dark:bg-slate-700 w-2/3 mb-2"></div>
              <div class="h-4 rounded bg-slate-200 dark:bg-slate-700 w-1/2"></div>
            </div>
          </div>
          <div v-else-if="pendingRokListingsError" class="py-6 text-red-600">{{ pendingRokListingsError }}</div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="item in filteredPendingRokListings" :key="item.id" class="rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
              <div class="aspect-video bg-slate-100 dark:bg-slate-700">
                <img v-if="item.images && item.images.length" :src="item.images[0]" alt="Listing image" class="w-full h-full object-cover" />
              </div>
              <div class="p-4">
                <div class="flex items-start justify-between mb-3">
                  <h4 class="font-bold">Rise of Kingdoms</h4>
                  <div class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">${{ item.askingPrice }}</div>
                </div>
                <div class="text-sm grid grid-cols-2 gap-2">
                  <div>
                    <div class="text-slate-500 dark:text-slate-400">Focus</div>
                    <div class="font-medium">{{ item.focusType || 'N/A' }}</div>
                  </div>
                  <div>
                    <div class="text-slate-500 dark:text-slate-400">VIP</div>
                    <div class="font-medium">{{ item.vipLevel || 'N/A' }}</div>
                  </div>
                  <div>
                    <div class="text-slate-500 dark:text-slate-400">Power</div>
                    <div class="font-medium">{{ item.currentPower || 'N/A' }}</div>
                  </div>
                </div>
                <div class="mt-4 flex items-center gap-2">
                  <button type="button" @click="openDetails(item)" class="inline-flex items-center rounded-xl px-3 py-1.5 text-xs font-semibold border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">View</button>
                  <button type="button" @click="approveRokListing(item.id)" class="inline-flex items-center rounded-xl px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500">Approve</button>
                  <button type="button" @click="rejectRokListing(item.id)" class="inline-flex items-center rounded-xl px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500">Reject</button>
                </div>
              </div>
            </div>
            <div v-if="!filteredPendingRokListings.length" class="col-span-full text-center text-sm text-slate-600 dark:text-slate-400">No pending listings found.</div>
          </div>
        </section>

        <section v-show="activeSection === 'sold'" class="mb-10">
          <div v-if="loadingSoldRokListings" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="n in 6" :key="n" class="rounded-lg border border-slate-300 dark:border-slate-700 p-4 animate-pulse">
              <div class="h-40 rounded bg-slate-200 dark:bg-slate-700 mb-4"></div>
              <div class="h-4 rounded bg-slate-200 dark:bg-slate-700 w-2/3 mb-2"></div>
              <div class="h-4 rounded bg-slate-200 dark:bg-slate-700 w-1/2"></div>
            </div>
          </div>
          <div v-else-if="soldRokListingsError" class="py-6 text-red-600">{{ soldRokListingsError }}</div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="item in filteredSoldRokListings" :key="item.id" class="rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
              <div class="aspect-video bg-slate-100 dark:bg-slate-700 relative">
                <img v-if="item.images && item.images.length" :src="item.images[0]" alt="Listing image" class="w-full h-full object-cover" />
                <span class="absolute top-2 left-2 inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold bg-slate-800 text-white">Sold</span>
              </div>
              <div class="p-4">
                <div class="flex items-start justify-between mb-3">
                  <h4 class="font-bold">Rise of Kingdoms</h4>
                  <div class="inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200">${{ item.askingPrice }}</div>
                </div>
                <div class="text-sm grid grid-cols-2 gap-2">
                  <div>
                    <div class="text-slate-500 dark:text-slate-400">Focus</div>
                    <div class="font-medium">{{ item.focusType || 'N/A' }}</div>
                  </div>
                  <div>
                    <div class="text-slate-500 dark:text-slate-400">VIP</div>
                    <div class="font-medium">{{ item.vipLevel || 'N/A' }}</div>
                  </div>
                  <div>
                    <div class="text-slate-500 dark:text-slate-400">Power</div>
                    <div class="font-medium">{{ item.currentPower || 'N/A' }}</div>
                  </div>
                </div>
                <div class="mt-4 flex items-center gap-2">
                  <button type="button" @click="openDetails(item)" class="inline-flex items-center rounded-xl px-3 py-1.5 text-xs font-semibold border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">View</button>
                </div>
              </div>
            </div>
            <div v-if="!filteredSoldRokListings.length" class="col-span-full text-center text-sm text-slate-600 dark:text-slate-400">No sold listings found.</div>
          </div>
        </section>

        <section v-show="activeSection === 'approved'" class="mb-10">
          <div v-if="loadingApprovedRokListings" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="n in 6" :key="n" class="rounded-lg border border-slate-300 dark:border-slate-700 p-4 animate-pulse">
              <div class="h-40 rounded bg-slate-200 dark:bg-slate-700 mb-4"></div>
              <div class="h-4 rounded bg-slate-200 dark:bg-slate-700 w-2/3 mb-2"></div>
              <div class="h-4 rounded bg-slate-200 dark:bg-slate-700 w-1/2"></div>
            </div>
          </div>
          <div v-else-if="approvedRokListingsError" class="py-6 text-red-600">{{ approvedRokListingsError }}</div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="item in filteredApprovedRokListings" :key="item.id" class="rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
              <div class="aspect-video bg-slate-100 dark:bg-slate-700">
                <img v-if="item.images && item.images.length" :src="item.images[0]" alt="Listing image" class="w-full h-full object-cover" />
              </div>
              <div class="p-4">
                <div class="flex items-start justify-between mb-3">
                  <h4 class="font-bold">Rise of Kingdoms</h4>
                  <div class="flex items-center gap-2">
                    <div class="inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">${{ item.askingPrice }}</div>
                    <span v-if="item.status === 'sold'" class="inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200">Sold</span>
                  </div>
                </div>
                <div class="text-sm grid grid-cols-2 gap-2">
                  <div>
                    <div class="text-slate-500 dark:text-slate-400">Focus</div>
                    <div class="font-medium">{{ item.focusType || 'N/A' }}</div>
                  </div>
                  <div>
                    <div class="text-slate-500 dark:text-slate-400">VIP</div>
                    <div class="font-medium">{{ item.vipLevel || 'N/A' }}</div>
                  </div>
                  <div>
                    <div class="text-slate-500 dark:text-slate-400">Power</div>
                    <div class="font-medium">{{ item.currentPower || 'N/A' }}</div>
                  </div>
                </div>
                <div class="mt-4 space-y-2 text-sm">
                  <div v-if="item.contactLink || item.contactNumber" class="flex items-center gap-2">
                    <span>Seller</span>
                    <a v-if="item.contactLink" :href="item.contactLink" target="_blank" rel="noopener" class="text-emerald-600 underline">Contact Link</a>
                    <span v-if="item.contactNumber">{{ item.contactNumber }}</span>
                  </div>
                  <div v-if="item.middleman && (item.middleman.email || item.middleman.link)" class="flex items-center gap-2">
                    <span>Middleman</span>
                    <a v-if="item.middleman?.link" :href="item.middleman.link" target="_blank" rel="noopener" class="text-blue-600 underline">Link</a>
                    <a v-else :href="`mailto:${item.middleman?.email}`" class="text-blue-600 underline">{{ item.middleman?.email }}</a>
                  </div>
                </div>
                <div class="mt-4 flex items-center gap-2">
                  <button type="button" @click="openDetails(item)" class="inline-flex items-center rounded-xl px-3 py-1.5 text-xs font-semibold border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">View</button>
                  <button 
                    type="button" 
                    @click="markRokAsSold(item.id)" 
                    :disabled="item.status === 'sold'"
                    :class="[
                      'inline-flex items-center rounded-xl px-3 py-1.5 text-xs font-semibold text-white',
                      item.status === 'sold' ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500'
                    ]"
                  >
                    {{ item.status === 'sold' ? 'Sold' : 'Mark as Sold' }}
                  </button>
                </div>
              </div>
            </div>
            <div v-if="!filteredApprovedRokListings.length" class="col-span-full text-center text-sm text-slate-600 dark:text-slate-400">No approved listings found.</div>
          </div>
        </section>

        <section v-show="activeSection === 'middlemen'">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-semibold">Middlemen Management</h3>
            <button type="button" @click="loadMiddlemen" class="rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm font-medium bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700">Refresh</button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <input v-model="newMiddleman.name" type="text" placeholder="Name" class="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2" />
            <input v-model="newMiddleman.email" type="email" placeholder="Email" class="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2" />
            <input v-model="newMiddleman.link" type="url" placeholder="Link (optional)" class="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2" />
          </div>
          <div class="flex items-center gap-3 mb-4">
            <button type="button" :disabled="addingMiddleman" @click="addMiddleman" class="px-4 py-2 rounded-lg bg-emerald-600 text-white">{{ addingMiddleman ? 'Adding...' : 'Add Middleman' }}</button>
            <span v-if="middlemanError" class="text-red-600 text-sm">{{ middlemanError }}</span>
          </div>
          <div v-if="loadingMiddlemen" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="n in 6" :key="n" class="rounded-lg border border-slate-300 dark:border-slate-700 p-4 animate-pulse">
              <div class="h-5 w-1/3 rounded bg-slate-200 dark:bg-slate-700 mb-2"></div>
              <div class="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700 mb-2"></div>
              <div class="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-700"></div>
            </div>
          </div>
          <div v-else-if="middlemenError" class="py-6 text-red-600">{{ middlemenError }}</div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="m in middlemen" :key="m.id" class="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
              <div class="font-semibold mb-1">{{ m.name }}</div>
              <div class="text-sm mb-2">{{ m.email }}</div>
              <a v-if="m.link" :href="m.link" target="_blank" rel="noopener" class="text-sm text-blue-600 underline mb-2 inline-block">{{ m.link }}</a>
              <button type="button" @click="deleteMiddleman(m.id)" class="px-3 py-1 rounded bg-red-600 text-white">Delete</button>
            </div>
          </div>
        </section>
      
      <div v-if="showDetailsModal && selectedListing" class="fixed inset-0 z-50">
        <div class="absolute inset-0 bg-black/60" @click="closeDetails"></div>
        <div class="relative w-full max-w-2xl sm:max-w-3xl mx-auto mt-10 sm:mt-16 rounded-2xl border px-6 sm:px-7 py-5 shadow-2xl max-h-[90vh] overflow-y-auto" :class="'border-slate-300 dark:border-slate-700 bg-white/95 dark:bg-slate-900/85'">
          <div class="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h3 class="text-xl font-bold">Rise of Kingdoms</h3>
              <p class="text-xs mt-1 text-slate-500 dark:text-slate-400">Posted {{ formattedCreatedAt }}</p>
              <div class="mt-2 flex items-center gap-2 text-xs">
                <span class="text-slate-500 dark:text-slate-400">Code ID</span>
                <span class="font-mono">{{ selectedListing.id }}</span>
                <button type="button" @click="copyCodeId" class="inline-flex items-center rounded px-2 py-1 border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">{{ copied ? 'Copied' : 'Copy' }}</button>
              </div>
            </div>
            <button type="button" @click="closeDetails" class="inline-flex items-center rounded-xl px-3 py-1.5 text-xs font-semibold border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">Close</button>
          </div>
          <div class="pt-5 space-y-5">
            <div class="aspect-video bg-slate-100 dark:bg-slate-800 rounded overflow-hidden">
              <img v-if="selectedListing.images && selectedListing.images.length" :src="selectedListing.images[0]" class="w-full h-full object-cover" />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
              <div>
                <div class="text-slate-500 dark:text-slate-400">Price</div>
                <div class="font-semibold">${{ selectedListing.askingPrice }}</div>
              </div>
              <div>
                <div class="text-slate-500 dark:text-slate-400">Focus</div>
                <div class="font-semibold">{{ selectedListing.focusType || 'N/A' }}</div>
              </div>
              <div>
                <div class="text-slate-500 dark:text-slate-400">VIP</div>
                <div class="font-semibold">{{ selectedListing.vipLevel || 'N/A' }}</div>
              </div>
              <div>
                <div class="text-slate-500 dark:text-slate-400">Power</div>
                <div class="font-semibold">{{ selectedListing.currentPower || 'N/A' }}</div>
              </div>
              <div>
                <div class="text-slate-500 dark:text-slate-400">Top Commanders</div>
                <div class="font-semibold">{{ selectedListing.topCommanders || 'N/A' }}</div>
              </div>
              <div>
                <div class="text-slate-500 dark:text-slate-400">Equipment</div>
                <div class="font-semibold">{{ selectedListing.equipment || 'N/A' }}</div>
              </div>
              <div>
                <div class="text-slate-500 dark:text-slate-400">KVK Season</div>
                <div class="font-semibold">{{ selectedListing.kvkSeason || 'N/A' }}</div>
              </div>
              <div>
                <div class="text-slate-500 dark:text-slate-400">Gold Heads</div>
                <div class="font-semibold">{{ selectedListing.currentGoldHeads || 'N/A' }}</div>
              </div>
              <div>
                <div class="text-slate-500 dark:text-slate-400">Speedups</div>
                <div class="font-semibold">{{ selectedListing.universalSpeedupsDays || 'N/A' }}</div>
              </div>
              <div>
                <div class="text-slate-500 dark:text-slate-400">Passport Ready</div>
                <div class="font-semibold">{{ selectedListing.passportReady || 'N/A' }}</div>
              </div>
              <div>
                <div class="text-slate-500 dark:text-slate-400">Ready to Migrate</div>
                <div class="font-semibold">{{ selectedListing.readyToMigrate || 'N/A' }}</div>
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
              <div v-if="selectedListing.contactLink || selectedListing.contactNumber" class="space-y-1">
                <div class="text-slate-500 dark:text-slate-400">Seller Contact</div>
                <a v-if="selectedListing.contactLink" :href="selectedListing.contactLink" target="_blank" rel="noopener" class="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-500">
                  <span>💬</span>
                  <span>Contact Seller</span>
                </a>
                <div v-if="selectedListing.contactNumber">{{ selectedListing.contactNumber }}</div>
              </div>
              <div v-if="selectedListing.middleman && (selectedListing.middleman.email || selectedListing.middleman.link)" class="space-y-1">
                <div class="text-slate-500 dark:text-slate-400">Middleman</div>
                <a v-if="selectedListing.middleman?.link" :href="selectedListing.middleman.link" target="_blank" rel="noopener" class="text-blue-600 underline">Link</a>
                <a v-else :href="`mailto:${selectedListing.middleman?.email}`" class="text-blue-600 underline">{{ selectedListing.middleman?.email }}</a>
              </div>
            </div>
            <div class="flex items-center justify-end gap-2 pt-2">
              <button type="button" @click="closeDetails" class="inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">Close</button>
              <template v-if="selectedListing.status === 'pending'">
                <button type="button" :disabled="actionLoading" @click="approveSelected" class="inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500">{{ actionLoading ? 'Approving...' : 'Approve' }}</button>
                <button type="button" :disabled="actionLoading" @click="rejectSelected" class="inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500">{{ actionLoading ? 'Rejecting...' : 'Reject' }}</button>
              </template>
              <template v-else-if="selectedListing.status === 'approved'">
                <button type="button" :disabled="actionLoading" @click="markSelectedAsSold" class="inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500">{{ actionLoading ? 'Marking...' : 'Mark as Sold' }}</button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'

type RokListingResponse = {
  id: string
  userId?: string
  middlemanId?: string
  middleman?: { id: string; name: string; email: string; link?: string }
  askingPrice: string
  passportReady?: string
  passportNeeded?: string
  readyToMigrate?: string
  focusType?: string
  vipLevel?: string
  currentGoldHeads?: string
  troopCount?: string
  currentPower?: string
  firstPurchaseReceipt?: string
  hasVipSupport?: string
  kvkSeason?: string
  universalSpeedupsDays?: string
  equipment?: string
  topCommanders?: string
  contactLink?: string
  contactNumber: string
  farmAccounts?: string
  images: string[]
  status: 'pending' | 'approved' | 'rejected' | 'sold'
  createdAt: string
}

type MiddlemanResponse = { id: string; name: string; email: string; link?: string; createdAt: string }

const CURRENT_USER_STORAGE_KEY = 'phl_current_user'
const currentUser = ref<{ id: string | number; email: string; fullName?: string; isAdmin?: boolean } | null>(null)

const pendingRokListings = ref<RokListingResponse[]>([])
const approvedRokListings = ref<RokListingResponse[]>([])
const soldRokListings = ref<RokListingResponse[]>([])
const loadingPendingRokListings = ref(false)
const loadingApprovedRokListings = ref(false)
const loadingSoldRokListings = ref(false)
const pendingRokListingsError = ref('')
const approvedRokListingsError = ref('')
const soldRokListingsError = ref('')
const middlemanError = ref('')
const middlemen = ref<MiddlemanResponse[]>([])
const loadingMiddlemen = ref(false)
const middlemenError = ref('')
const addingMiddleman = ref(false)
const newMiddleman = reactive({ name: '', email: '', link: '' })
const notAuthorized = ref(false)
const PUBLIC_LISTINGS_CACHE_KEY = 'phl_listings_cache_v1'
const showDetailsModal = ref(false)
const selectedListing = ref<RokListingResponse | null>(null)
const actionLoading = ref(false)

const copied = ref(false)
const formattedCreatedAt = computed(() => {
  const dt = selectedListing.value?.createdAt
  if (!dt) return ''
  try {
    const date = new Date(dt)
    return new Intl.DateTimeFormat('en-US', {
      month: '2-digit', day: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).format(date)
  } catch {
    try { return new Date(dt).toLocaleString() } catch { return '' }
  }
})

const activeSection = ref<'pending' | 'approved' | 'sold' | 'middlemen'>('pending')
const rokSearch = ref('')

const filteredPendingRokListings = computed(() => {
  const q = rokSearch.value.trim().toLowerCase()
  if (!q) return pendingRokListings.value
  return pendingRokListings.value.filter(i =>
    String(i.vipLevel || '').toLowerCase().includes(q) ||
    String(i.focusType || '').toLowerCase().includes(q) ||
    String(i.currentPower || '').toLowerCase().includes(q)
  )
})

const filteredApprovedRokListings = computed(() => {
  const q = rokSearch.value.trim().toLowerCase()
  if (!q) return approvedRokListings.value
  return approvedRokListings.value.filter(i =>
    String(i.vipLevel || '').toLowerCase().includes(q) ||
    String(i.focusType || '').toLowerCase().includes(q) ||
    String(i.currentPower || '').toLowerCase().includes(q)
  )
})

const filteredSoldRokListings = computed(() => {
  const q = rokSearch.value.trim().toLowerCase()
  if (!q) return soldRokListings.value
  return soldRokListings.value.filter(i =>
    String(i.vipLevel || '').toLowerCase().includes(q) ||
    String(i.focusType || '').toLowerCase().includes(q) ||
    String(i.currentPower || '').toLowerCase().includes(q)
  )
})

const pendingCount = computed(() => pendingRokListings.value.length)
const approvedCount = computed(() => approvedRokListings.value.length)
const soldCount = computed(() => soldRokListings.value.length)
const middlemenCount = computed(() => middlemen.value.length)

const refreshActive = () => {
  if (activeSection.value === 'pending') loadPendingRokListings()
  else if (activeSection.value === 'approved') loadApprovedRokListings()
  else if (activeSection.value === 'sold') loadSoldRokListings()
  else loadMiddlemen()
}

const openDetails = (item: RokListingResponse) => {
  selectedListing.value = item
  showDetailsModal.value = true
}

const closeDetails = () => {
  showDetailsModal.value = false
  selectedListing.value = null
}

const copyCodeId = async () => {
  const id = selectedListing.value?.id
  if (!id) return
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(String(id))
    }
    copied.value = true
    setTimeout(() => { copied.value = false }, 1500)
  } catch {
    copied.value = true
    setTimeout(() => { copied.value = false }, 1500)
  }
}

const approveSelected = async () => {
  if (!selectedListing.value) return
  actionLoading.value = true
  try {
    await approveRokListing(selectedListing.value.id)
    closeDetails()
  } finally {
    actionLoading.value = false
  }
}

const rejectSelected = async () => {
  if (!selectedListing.value) return
  actionLoading.value = true
  try {
    await rejectRokListing(selectedListing.value.id)
    closeDetails()
  } finally {
    actionLoading.value = false
  }
}

const markSelectedAsSold = async () => {
  if (!selectedListing.value) return
  actionLoading.value = true
  try {
    await markRokAsSold(selectedListing.value.id)
    closeDetails()
  } finally {
    actionLoading.value = false
  }
}

const loadPendingRokListings = async () => {
  if (!currentUser.value?.id) return
  loadingPendingRokListings.value = true
  pendingRokListingsError.value = ''
  try {
    const data = await $fetch<RokListingResponse[]>('/api/admin/rok/pending-listings', {
      query: { userId: currentUser.value.id, status: 'pending', ts: Date.now() },
    })
    pendingRokListings.value = data
  } catch (err: any) {
    pendingRokListingsError.value = err?.data?.statusMessage || err?.message || 'Failed to load pending listings.'
  } finally {
    loadingPendingRokListings.value = false
  }
}

const loadApprovedRokListings = async () => {
  if (!currentUser.value?.id) return
  loadingApprovedRokListings.value = true
  approvedRokListingsError.value = ''
  try {
    const approved = await $fetch<RokListingResponse[]>('/api/admin/rok/pending-listings', {
      query: { userId: currentUser.value.id, status: 'approved', ts: Date.now() },
    })
    approvedRokListings.value = approved
  } catch (err: any) {
    approvedRokListingsError.value = err?.data?.statusMessage || err?.message || 'Failed to load approved listings.'
  } finally {
    loadingApprovedRokListings.value = false
  }
}

const loadSoldRokListings = async () => {
  if (!currentUser.value?.id) return
  loadingSoldRokListings.value = true
  soldRokListingsError.value = ''
  try {
    const sold = await $fetch<RokListingResponse[]>('/api/admin/rok/pending-listings', {
      query: { userId: currentUser.value.id, status: 'sold', ts: Date.now() },
    })
    soldRokListings.value = sold
  } catch (err: any) {
    soldRokListingsError.value = err?.data?.statusMessage || err?.message || 'Failed to load sold listings.'
  } finally {
    loadingSoldRokListings.value = false
  }
}

const approveRokListing = async (listingId: string | number) => {
  if (!currentUser.value?.isAdmin) return
  try {
    await $fetch('/api/admin/rok/approve', { method: 'POST', body: { listingId, userId: currentUser.value.id } })
    pendingRokListings.value = pendingRokListings.value.filter(l => l.id !== String(listingId))
    loadApprovedRokListings()
    try { if (typeof window !== 'undefined') window.localStorage.removeItem(PUBLIC_LISTINGS_CACHE_KEY) } catch {}
  } catch (err: any) {
    alert(err?.data?.statusMessage || err?.message || 'Failed to approve listing.')
  }
}

const rejectRokListing = async (listingId: string | number) => {
  if (!currentUser.value?.isAdmin) return
  if (!confirm('Reject this listing?')) return
  try {
    await $fetch('/api/admin/rok/reject', { method: 'POST', body: { listingId, userId: currentUser.value.id } })
    pendingRokListings.value = pendingRokListings.value.filter(l => l.id !== String(listingId))
    try { if (typeof window !== 'undefined') window.localStorage.removeItem(PUBLIC_LISTINGS_CACHE_KEY) } catch {}
  } catch (err: any) {
    alert(err?.data?.statusMessage || err?.message || 'Failed to reject listing.')
  }
}

const markRokAsSold = async (listingId: string | number) => {
  if (!currentUser.value?.isAdmin) return
  if (!confirm('Mark this listing as sold?')) return
  try {
    await $fetch('/api/admin/rok/mark-sold', { method: 'POST', body: { listingId, userId: currentUser.value.id } })
    const idx = approvedRokListings.value.findIndex(l => String(l.id) === String(listingId))
    if (idx !== -1) {
      const updated = { ...approvedRokListings.value[idx], status: 'sold' }
      approvedRokListings.value.splice(idx, 1)
      soldRokListings.value.unshift(updated)
    } else {
      // Fallback: reload sold list
      await loadSoldRokListings()
    }
    try { if (typeof window !== 'undefined') window.localStorage.removeItem(PUBLIC_LISTINGS_CACHE_KEY) } catch {}
  } catch (err: any) {
    alert(err?.data?.statusMessage || err?.message || 'Failed to mark as sold.')
  }
}

const loadMiddlemen = async () => {
  loadingMiddlemen.value = true
  middlemenError.value = ''
  try {
    const data = await $fetch<MiddlemanResponse[]>('/api/middlemen', { query: { ts: Date.now() } })
    middlemen.value = data
  } catch (err: any) {
    middlemenError.value = err?.data?.statusMessage || err?.message || 'Failed to fetch middlemen.'
  } finally {
    loadingMiddlemen.value = false
  }
}

const addMiddleman = async () => {
  if (!currentUser.value?.isAdmin) { middlemenError.value = 'Only admins can add middlemen.'; return }
  if (!newMiddleman.name || !newMiddleman.email) { middlemenError.value = 'Name and email are required.'; return }
  addingMiddleman.value = true
  middlemenError.value = ''
  try {
    await $fetch('/api/admin/middlemen', { method: 'POST', body: { userId: currentUser.value.id, ...newMiddleman } })
    newMiddleman.name = ''; newMiddleman.email = ''; newMiddleman.link = ''
    loadMiddlemen()
  } catch (err: any) {
    middlemenError.value = err?.data?.statusMessage || err?.message || 'Failed to add middleman.'
  } finally {
    addingMiddleman.value = false
  }
}

const deleteMiddleman = async (middlemanId: string) => {
  if (!currentUser.value?.isAdmin) return
  if (!confirm('Delete this middleman?')) return
  try {
    await $fetch('/api/admin/middlemen/delete', { method: 'POST', body: { userId: currentUser.value.id, middlemanId } })
    loadMiddlemen()
  } catch (err: any) {
    alert(err?.data?.statusMessage || err?.message || 'Failed to delete middleman.')
  }
}

onMounted(() => {
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(CURRENT_USER_STORAGE_KEY) : null
    currentUser.value = raw ? JSON.parse(raw) : null
  } catch { currentUser.value = null }
  if (!currentUser.value?.isAdmin) { notAuthorized.value = true; return }
  loadPendingRokListings()
  loadApprovedRokListings()
  loadSoldRokListings()
  loadMiddlemen()
})
</script>

<style scoped>
.border { border-color: #e2e8f0 }
</style>
