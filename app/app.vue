<template>
  <div
    :class="[
      'min-h-screen transition-colors duration-500 ease-in-out',
      theme === 'dark'
        ? 'bg-slate-950 text-slate-100'
        : 'bg-slate-50 text-slate-900',
    ]"
  >
    <!-- Header -->
    <header class="border-b transition-colors duration-300 shadow-sm"
      :class="theme === 'dark' ? 'border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800' : 'border-slate-200 bg-gradient-to-r from-white via-slate-50 to-white'">
      <div class="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-12 h-12 rounded-xl"
              :class="theme === 'dark' ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-emerald-100 border border-emerald-200'">
              <span class="text-2xl">⚔️</span>
            </div>
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent transition-colors duration-300"
                 @click="showLandingPage = true"
                :class="theme === 'dark' 
                  ? 'from-emerald-400 to-teal-400 cursor-pointer' 
                  : 'from-emerald-600 to-teal-600 cursor-pointer'">
                PH Legends Marketplace
              </h1>
              <p class="mt-0.5 text-xs sm:text-sm font-medium transition-colors duration-300"
                :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
                Buy & Sell Game Accounts • Secure & Trusted
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3">
          <button
            type="button"
              @click="toggleTheme"
            :class="[
                'inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-300 ease-in-out',
                theme === 'dark'
                  ? 'border-slate-700 bg-slate-800 text-slate-200 hover:border-emerald-500 hover:bg-slate-700'
                  : 'border-slate-300 bg-white text-slate-700 hover:border-emerald-500 hover:bg-slate-50',
              ]"
            >
              <span>{{ theme === 'dark' ? '🌙' : '☀️' }}</span>
              <span>{{ theme === 'dark' ? 'Dark' : 'Light' }}</span>
          </button>
          
          <!-- Notifications -->
          <div v-if="currentUser" class="relative notification-container">
            <button
              type="button"
              @click="toggleNotifications"
              :class="[
                'relative inline-flex items-center justify-center rounded-lg p-2 text-sm font-medium transition-colors duration-300',
                theme === 'dark'
                  ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300',
              ]"
            >
              <span class="text-xl">🔔</span>
              <span
                v-if="unreadNotificationsCount > 0"
                class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white"
                :class="theme === 'dark' ? 'bg-red-500' : 'bg-red-600'"
              >
                {{ unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount }}
              </span>
            </button>
            <div
              v-if="showNotifications"
              :class="[
                'absolute right-0 mt-2 w-80 sm:w-96 rounded-lg border shadow-lg z-30 max-h-96 overflow-hidden',
                theme === 'dark'
                  ? 'border-slate-700 bg-slate-900 text-slate-100'
                  : 'border-slate-200 bg-white text-slate-800',
              ]"
            >
              <div class="flex items-center justify-between p-4 border-b"
                :class="theme === 'dark' ? 'border-slate-700' : 'border-slate-200'">
                <h3 class="text-sm font-bold">Notifications</h3>
                <button
                  v-if="unreadNotificationsCount > 0"
                  type="button"
                  @click="markAllNotificationsAsRead"
                  class="text-xs text-emerald-500 hover:text-emerald-400"
                >
                  Mark all as read
                </button>
              </div>
              <div class="max-h-80 overflow-y-auto">
                <div v-if="loadingNotifications" class="p-6 text-center">
                  <div class="inline-block animate-spin text-2xl mb-2">⏳</div>
                  <p class="text-xs" :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
                    Loading...
                  </p>
                </div>
                <div
                  v-else-if="!notifications.length"
                  class="p-8 text-center"
                >
                  <span class="text-3xl mb-2 block">📭</span>
                  <p class="text-xs" :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
                    No notifications
                  </p>
                </div>
                <div v-else>
                  <button
                    v-for="notif in notifications"
                    :key="notif.id"
                    type="button"
                    @click="markNotificationAsRead(notif.id)"
                    :class="[
                      'w-full px-4 py-3 text-left border-b transition-colors duration-200',
                      notif.isRead
                        ? theme === 'dark'
                          ? 'border-slate-800 bg-slate-900/50 hover:bg-slate-800'
                          : 'border-slate-100 bg-slate-50/50 hover:bg-slate-100'
                        : theme === 'dark'
                          ? 'border-slate-700 bg-emerald-500/5 hover:bg-emerald-500/10'
                          : 'border-slate-200 bg-emerald-50/50 hover:bg-emerald-100',
                    ]"
                  >
                    <div class="flex items-start gap-2">
                      <span class="text-lg">
                        {{ notif.type === 'approved' ? '✅' : notif.type === 'rejected' ? '❌' : notif.type === 'sold' ? '💰' : '⏳' }}
                      </span>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between gap-2 mb-1">
                          <p class="text-xs font-semibold truncate"
                            :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-900'">
                            {{ notif.title }}
                          </p>
                          <span
                            v-if="!notif.isRead"
                            class="h-2 w-2 rounded-full flex-shrink-0"
                            :class="theme === 'dark' ? 'bg-emerald-500' : 'bg-emerald-600'"
                          ></span>
                        </div>
                        <p class="text-xs leading-relaxed"
                          :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
                          {{ notif.message }}
                        </p>
                        <p class="text-xs mt-1"
                          :class="theme === 'dark' ? 'text-slate-500' : 'text-slate-500'">
                          {{ formatNotificationTime(notif.createdAt) }}
                        </p>
                      </div>
                    </div>
                  </button>
              </div>
          </div>
        </div>
    </div>

            <div v-if="currentUser" class="relative">
              <button
                type="button"
                @click="showUserMenu = !showUserMenu"
                :class="[
                  'hidden sm:inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition-colors duration-300',
                  theme === 'dark'
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100',
                ]"
              >
                <span>👤</span>
                <span>{{ currentUser.fullName || currentUser.email }}</span>
                <span>▾</span>
              </button>
              <div
                v-if="showUserMenu"
                :class="[
                  'absolute right-0 mt-2 w-44 rounded-lg border py-1 text-sm z-20 shadow-lg',
                  theme === 'dark'
                    ? 'border-slate-700 bg-slate-900 text-slate-100'
                    : 'border-slate-200 bg-white text-slate-800',
                ]"
              >
                <button
                  type="button"
                  @click="showUserMenu = false; setTab('auth')"
                  :class="[
                    'block w-full px-4 py-2 text-left hover:bg-emerald-500/10',
                    theme === 'dark' ? 'hover:text-emerald-300' : 'hover:text-emerald-700',
                  ]"
                >
                  Profile
                </button>
                <button
                  type="button"
                  @click="showUserMenu = false; logout()"
                  :class="[
                    'block w-full px-4 py-2 text-left hover:bg-red-500/10',
                    theme === 'dark' ? 'hover:text-red-300' : 'hover:text-red-700',
                  ]"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

      <main class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <AdminDashboard v-if="isAdminRoute" />
        <template v-else>
      <!-- Public Landing Page (shown to logged-out users by default) -->
      <section
        v-if="showLandingPage"
        class="space-y-12 max-w-6xl mx-auto"  
      >
        <!-- Hero -->
        <div
          class="relative overflow-hidden rounded-2xl border p-8 sm:p-10 mb-4"
          :class="theme === 'dark'
            ? 'border-slate-700 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
            : 'border-slate-200 bg-gradient-to-br from-white via-emerald-50/40 to-white'"
        >
          <div
            class="absolute inset-0 opacity-10"
            :style="theme === 'dark'
              ? { backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.12) 1px, transparent 0)', backgroundSize: '18px 18px' }
              : { backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.06) 1px, transparent 0)', backgroundSize: '18px 18px' }"
          ></div>
          <div class="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div class="space-y-4 max-w-xl">
              <p
                class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border"
                :class="theme === 'dark'
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                  : 'border-emerald-500/20 bg-emerald-50 text-emerald-700'"
              >
                <span>🛡️</span>
                <span>Secure Marketplace for Game Accounts</span>
              </p>
              <h2
                class="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight bg-gradient-to-r bg-clip-text text-transparent"
                :class="theme === 'dark'
                  ? 'from-emerald-300 via-teal-300 to-cyan-300'
                  : 'from-emerald-600 via-teal-600 to-cyan-600'"
              >
                Buy & Sell Trusted Game Accounts
              </h2>
              <p
                class="text-sm sm:text-base max-w-xl"
                :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'"
              >
                Discover a curated marketplace for your favorite online games. Browse listings, connect with verified middlemen, and trade with confidence.
              </p>
              <div class="flex flex-wrap items-center gap-3 mt-2">
                <!-- <button
                  type="button"
                  @click="goToGame('ymir')"
                  :class="[
                    'inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all duration-300 ease-in-out shadow-lg',
                    'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 hover:scale-[1.02] hover:shadow-xl',
                  ]"
                >
                  <span>🎮</span>
                  <span>Browse Ymir</span>
                </button> -->
                <button
                  type="button"
                  @click="goToGame('rok')"
                  :class="[
                    'inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all duration-300 ease-in-out shadow-lg',
                    'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:scale-[1.02] hover:shadow-xl',
                  ]"
                >
                  <span>🏰</span>
                  <span>Browse ROK</span>
                </button>
                <button
                  type="button"
                  @click="showLandingPage = false; setTab('auth')"
                  :class="[
                    'inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 ease-in-out',
                    theme === 'dark'
                      ? 'border border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-slate-800'
                      : 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50',
                  ]"
                >
                  <span>🔐</span>
                  <span>Login / Register</span>
                </button>
              </div>
            </div>
            <div class="w-full lg:w-auto flex-1 flex justify-center lg:justify-end">
              <div
                class="relative rounded-2xl border px-6 py-5 w-full max-w-md"
                :class="theme === 'dark'
                  ? 'border-slate-700 bg-slate-900/80'
                  : 'border-slate-200 bg-white/90 shadow-lg'"
              >
                <p
                  class="text-xs font-semibold mb-3 uppercase tracking-wide"
                  :class="theme === 'dark' ? 'text-emerald-300' : 'text-emerald-600'"
                >
                  Live Snapshot
                </p>
                <div class="space-y-3 text-sm">
                  <div class="flex items-center justify-between">
                    <span :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'">Total Listings</span>
                    <span :class="theme === 'dark' ? 'text-slate-100' : 'text-slate-900'" class="font-semibold">
                      {{ listings.length }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'">Available Accounts</span>
                    <span class="font-semibold" :class="theme === 'dark' ? 'text-emerald-300' : 'text-emerald-600'">
                      {{ listings.filter(l => l.status === 'approved').length }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'">Supported Games</span>
                    <span class="font-semibold" :class="theme === 'dark' ? 'text-slate-100' : 'text-slate-900'">
                      1
                    </span>
                  </div>
                  <p
                    class="text-xs mt-3"
                    :class="theme === 'dark' ? 'text-slate-500' : 'text-slate-500'"
                  >
                    More games coming soon. Start with Rise of Kingdoms today.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Game selection grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div
            :class="[
              'relative overflow-hidden rounded-2xl border p-6 flex flex-col justify-between gap-4 transition-all duration-300 ease-in-out cursor-pointer',
              theme === 'dark'
                ? 'border-emerald-500/40 bg-emerald-500/5 hover:border-emerald-400'
                : 'border-emerald-200 bg-emerald-50/60 hover:border-emerald-400',
            ]"
            @click="goToGame('rok')"
          >
            <img :src="rokDefaultImg" alt="ROK" class="absolute inset-0 w-full h-full object-cover opacity-20" />
            <div class="relative space-y-2">
              <p class="text-xs font-semibold tracking-wide uppercase"
                :class="theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700'">
                New
              </p>
              <h3 class="text-xl font-bold"
                :class="theme === 'dark' ? 'text-slate-50' : 'text-slate-900'">
                Rise of Kingdoms
              </h3>
              <p class="text-sm"
                :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'">
                Post detailed ROK account listings with screenshots and all required fields.
              </p>
            </div>
            <div class="flex items-center justify-between text-xs mt-2">
              <span :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
                Create and submit for review
              </span>
              <span class="inline-flex items-center gap-1 font-semibold"
                :class="theme === 'dark' ? 'text-emerald-300' : 'text-emerald-600'">
                <span>Browse</span>
                <span>➜</span>
              </span>
            </div>
          </div>

          <div
            :class="[
              'rounded-2xl border p-6 flex flex-col justify-between gap-4 transition-all duration-300 ease-in-out',
              theme === 'dark'
                ? 'border-slate-700 bg-slate-900/70'
                : 'border-slate-200 bg-white',
            ]"
          >
            <div class="space-y-2">
              <p class="text-xs font-semibold tracking-wide uppercase"
                :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-500'">
                Coming Soon
              </p>
              <h3 class="text-xl font-bold"
                :class="theme === 'dark' ? 'text-slate-50' : 'text-slate-900'">
                MMORPG & Mobile Games
              </h3>
              <p class="text-sm"
                :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'">
                Support for more popular titles will be added soon.
              </p>
            </div>
            <div class="flex items-center justify-between text-xs mt-2">
              <span :class="theme === 'dark' ? 'text-slate-500' : 'text-slate-500'">
                Stay tuned for multi-game support.
              </span>
              <span class="inline-flex items-center gap-1 font-semibold"
                :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-500'">
                <span>Soon</span>
              </span>
            </div>
          </div>
          
          

        </div>
        <div class="mt-8 rounded-2xl border p-6 sm:p-8"
          :class="theme === 'dark' ? 'border-slate-700 bg-slate-900/70' : 'border-slate-200 bg-white'">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold" :class="theme === 'dark' ? 'text-slate-100' : 'text-slate-900'">Recent Middleman Feedback</h3>
            <button type="button" @click="loadLandingFeedback" :disabled="landingFeedbackLoading"
              :class="[
                'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold',
                theme === 'dark'
                  ? 'border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800'
                  : 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50',
              ]">
              <span>🔄</span>
              <span>{{ landingFeedbackLoading ? 'Refreshing...' : 'Refresh' }}</span>
            </button>
          </div>
          <div v-if="landingFeedbackLoading" class="text-center py-8">
            <span class="inline-block animate-spin text-2xl mb-2">⏳</span>
            <p class="text-xs" :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">Loading feedback...</p>
          </div>
          <div v-else-if="landingFeedbackError" :class="[
            'rounded-lg border p-4 text-center',
            theme === 'dark' ? 'border-red-500/50 bg-red-500/10 text-red-300' : 'border-red-300 bg-red-50 text-red-700',
          ]">
            {{ landingFeedbackError }}
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="item in landingFeedback" :key="item.middleman.id" :class="[
              'rounded-xl border p-4 space-y-2',
              theme === 'dark' ? 'border-slate-700 bg-slate-900/60' : 'border-slate-200 bg-white',
            ]">
              <div class="flex items-center gap-2">
                <span>MM: </span>
                <div class="font-semibold">{{ item.middleman.name }}</div>
              </div>
              <p class="text-sm" :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'">“{{ item.feedback.comment }}”</p>
              <div class="flex items-center justify-between text-xs" :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
                <div class="flex items-center gap-1">
                  <span>⭐</span>
                  <span>{{ item.feedback.rating ?? 'N/A' }}</span>
                </div>
                <div>{{ new Date(item.feedback.createdAt).toLocaleDateString() }}</div>
              </div>
            </div>
            <div v-if="!landingFeedback.length" :class="[
              'rounded-xl border p-6 text-center',
              theme === 'dark' ? 'border-slate-700 bg-slate-900/60' : 'border-slate-200 bg-white',
            ]">
              <p class="text-sm" :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">No feedback yet. Check back soon.</p>
            </div>
          </div>
        </div>
      </section>
      <template v-else>
      <!-- Navigation Component -->
      <AppNavigation 
        :active-tab="activeTab"
        :theme="theme"
        :current-user="currentUser"
        @tab-change="setTab"
      />
      <br />
      <!-- Login Required Message -->
      <div
        v-if="activeTab === 'post' && !currentUser"
            :class="[
          'rounded-lg border p-8 text-center',
          theme === 'dark'
            ? 'border-slate-700 bg-slate-900'
            : 'border-slate-200 bg-white',
        ]"
      >
        <div class="max-w-md mx-auto">
          <div class="text-5xl mb-4">🔐</div>
          <h2 class="text-2xl font-bold mb-2"
            :class="theme === 'dark' ? 'text-slate-100' : 'text-slate-900'">
            Login Required
          </h2>
          <p class="text-sm mb-6"
            :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
            You need to be logged in to post listings on our marketplace.
          </p>
          <button
            type="button"
            @click="setTab('auth')"
            :class="[
              'inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-base font-semibold text-white transition-all duration-300 ease-in-out',
              'bg-emerald-600 hover:bg-emerald-500 hover:scale-[1.02]',
            ]"
          >
            Login or Register
          </button>
        </div>
      </div>

      <div v-if="activeTab === 'post' && currentUser" class="mb-4 flex items-center gap-2">
        <button
          type="button"
          @click="postingGame = 'rok'"
          :class="[
            'rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300 ease-in-out',
            postingGame === 'rok'
              ? 'bg-emerald-600 text-white hover:bg-emerald-500'
              : theme === 'dark'
                ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200',
          ]"
        >
          Rise of Kingdoms
        </button>
      </div>

      <form
        v-if="false"
        :class="[
          'space-y-8 p-8 rounded-lg border shadow-lg transition-all duration-300 ease-in-out',
          theme === 'dark'
            ? 'bg-slate-900/90 border-slate-700/50 shadow-slate-900/50'
            : 'bg-white/90 border-slate-200 shadow-slate-200/50',
        ]"
        @submit.prevent="onSubmit"
      >
        <div class="text-center mb-6">
          <h2 class="text-2xl font-bold mb-2"
            :class="theme === 'dark' ? 'text-slate-100' : 'text-slate-900'">
            Create Your Listing
          </h2>
          <p class="text-sm"
            :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
            Share your account details and connect with buyers
          </p>
          <p class="text-xs mt-2"
            :class="theme === 'dark' ? 'text-slate-500' : 'text-slate-500'">
            Logged in as: <span class="font-semibold text-emerald-400">{{ currentUser.fullName || currentUser.email }}</span>
          </p>
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm font-semibold"
              :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
              <span>Character Nickname *</span>
            </label>
            <input
              v-model="form.nickname"
              type="text"
              required
              placeholder="Enter character name"
              :class="[
                'w-full rounded-lg border px-4 py-3 text-sm transition-all duration-300 ease-in-out',
                theme === 'dark'
                  ? 'border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
              ]"
            />
          </div>

          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm font-semibold"
              :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
              <span>Server *</span>
            </label>
            <input
              v-model="form.server"
              type="text"
              required
              placeholder="e.g. Asia-1, Europe-2"
              :class="[
                'w-full rounded-lg border px-4 py-3 text-sm transition-all duration-300 ease-in-out',
                theme === 'dark'
                  ? 'border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
              ]"
            />
          </div>

          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm font-semibold"
              :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
              <span>Growth Power *</span>
            </label>
            <input
              v-model="form.growthPower"
              type="number"
              min="0"
              required
              placeholder="Enter GP value"
              :class="[
                'w-full rounded-lg border px-4 py-3 text-sm transition-all duration-300 ease-in-out',
                theme === 'dark'
                  ? 'border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
              ]"
            />
          </div>

          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm font-semibold"
              :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
              <span>Asking Price (USD) *</span>
            </label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
            <input
              v-model="form.askingPrice"
              type="number"
              min="0"
              step="0.01"
              required
                placeholder="0.00"
                :class="[
                  'w-full rounded-lg border pl-8 pr-4 py-3 text-sm transition-all duration-300 ease-in-out',
                  theme === 'dark'
                    ? 'border-slate-700 bg-slate-800/50 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                ]"
              />
            </div>
          </div>

        </div>

        <div class="space-y-3">
          <label class="flex items-center gap-2 text-sm font-semibold"
            :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
            <span>Character Class *</span>
          </label>
          <p class="text-xs"
            :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-500'">
            Choose your character's primary class
          </p>
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <label
              v-for="className in classOptions"
              :key="className"
              :class="[
                'group relative flex flex-col items-center justify-center gap-2 rounded-lg border px-4 py-4 text-sm font-medium cursor-pointer transition-all duration-300 ease-in-out hover:scale-[1.02]',
                selectedClass === className
                  ? theme === 'dark'
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 '
                    : 'border-emerald-500 bg-emerald-50 text-emerald-700 '
                  : theme === 'dark'
                    ? 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-emerald-500/50'
                    : 'border-slate-300 bg-white text-slate-700 hover:border-emerald-500/50',
              ]"
            >
              <input
                v-model="selectedClass"
                type="radio"
                name="class"
                :value="className"
                class="sr-only"
              />
              <span class="text-2xl">{{ getClassIcon(className) }}</span>
              <span>{{ className }}</span>
            </label>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm font-semibold"
              :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
              <span>Contact Link</span>
            </label>
            <input  
              v-model="form.contactLink"
              type="url"
              placeholder="Social media link"
              :class="[
                'w-full rounded-lg border px-4 py-3 text-sm transition-all duration-300 ease-in-out',
                theme === 'dark'
                  ? 'border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
              ]"
            />
          </div>

          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm font-semibold"
              :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
              <span>Contact Number *</span>
            </label>
            <input
              v-model="form.contactNumber"
              type="tel"
              inputmode="tel"
              pattern="^[0-9+()\s-]{7,20}$"
              required
              placeholder="+63 999-123-4567"
              :class="[
                'w-full rounded-lg border px-4 py-3 text-sm transition-all duration-300 ease-in-out',
                theme === 'dark'
                  ? 'border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
              ]"
            />
          </div>

          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm font-semibold"
              :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
              <span>Middleman *</span>
            </label>
            <select
              v-model="form.middlemanId"
              required
              :class="[
                'w-full rounded-lg border px-4 py-3 text-sm transition-all duration-300 ease-in-out',
                theme === 'dark'
                  ? 'border-slate-600 bg-slate-700 text-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  : 'border-slate-300 bg-white text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
              ]"
            >
              <option value="" disabled>Select a middleman</option>
              <option
                v-for="middleman in middlemen"
                :key="middleman.id"
                :value="middleman.id"
              >
                {{ middleman.name }} ({{ middleman.email }})
              </option>
            </select>
            <p v-if="middlemen.length === 0" class="text-xs text-amber-500">
              ⚠️ No middlemen available. Please contact an admin to add middlemen.
            </p>
          </div>
        </div>

        <div class="space-y-3">
          <label class="flex items-center gap-2 text-sm font-semibold"
            :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
            <span>Account Screenshots</span>
          </label>
          <p class="text-xs"
            :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-500'">
            Upload up to 5 screenshots (max 5MB each) of your character, inventory, stats, and other important details
          </p>
          <div
            :class="[
              'relative rounded-lg border-2 border-dashed p-6 transition-all duration-300 ease-in-out',
              theme === 'dark'
                ? 'border-slate-700 bg-slate-800/30 hover:border-emerald-500/50'
                : 'border-slate-300 bg-slate-50 hover:border-emerald-500/50',
            ]"
          >
          <input
            type="file"
            multiple
            accept="image/*"
              :class="[
                'block w-full text-sm cursor-pointer',
                theme === 'dark' ? 'text-slate-200' : 'text-slate-700',
                'file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-4 file:py-3',
                'file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-500',
                'file:transition-all file:duration-200 file:cursor-pointer',
              ]"
            @change="handleImagesChange"
          />
            <p class="mt-2 text-xs text-center"
              :class="theme === 'dark' ? 'text-slate-500' : 'text-slate-400'">
              PNG, JPG, WebP, GIF up to 5MB each (max 5 images)
            </p>
          </div>

          <div v-if="imagePreviews.length" class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            <div
              v-for="(src, index) in imagePreviews"
              :key="index"
              :class="[
                'group relative overflow-hidden rounded-lg border transition-all duration-300 ease-in-out hover:scale-[1.02]',
                theme === 'dark'
                  ? 'border-slate-700 bg-slate-800/50'
                  : 'border-slate-300 bg-white',
              ]"
            >
              <img :src="src" alt="Account image preview" class="h-40 w-full object-cover" />
              <button
                type="button"
                @click="removeImage(index)"
                :class="[
                  'absolute top-2 right-2 rounded-full p-1.5 opacity-0 transition-opacity group-hover:opacity-100',
                  theme === 'dark'
                    ? 'bg-red-600/80 text-white hover:bg-red-500'
                    : 'bg-red-500 text-white hover:bg-red-600',
                ]"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <div v-if="error" 
          :class="[
              'rounded-lg border p-4 transition-all duration-300 ease-in-out',
            theme === 'dark'
              ? 'border-red-500/50 bg-red-500/10 text-red-300'
              : 'border-red-300 bg-red-50 text-red-700',
          ]">
          <p class="text-sm font-medium flex items-center gap-2">
            <span>{{ error }}</span>
          </p>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t"
          :class="theme === 'dark' ? 'border-slate-700' : 'border-slate-200'">
          <button
            type="submit"
            :disabled="submitting"
            :class="[
              'inline-flex items-center justify-center gap-2 rounded-lg px-8 py-4 text-base font-bold text-white shadow-md transition-all duration-300 ease-in-out',
              'bg-emerald-600 hover:bg-emerald-500',
              'disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-emerald-600',
              'hover:scale-[1.02] active:scale-[0.98]',
            ]"
          >
            <span v-if="!submitting">Post Listing</span>
            <span v-else class="flex items-center gap-2">
              <span class="animate-spin">⏳</span>
              <span>Submitting...</span>
            </span>
          </button>

          <!-- <p class="text-xs text-center"
            :class="theme === 'dark' ? 'text-slate-500' : 'text-slate-400'">
            💾 Your listing will be saved securely
          </p> -->
        </div>
      </form>

      <form
        v-if="activeTab === 'post' && currentUser && postingGame === 'rok'"
        :class="[
          'space-y-8 p-8 rounded-lg border shadow-lg transition-all duration-300 ease-in-out',
          theme === 'dark'
            ? 'bg-slate-900/90 border-slate-700/50 shadow-slate-900/50'
            : 'bg-white/90 border-slate-200 shadow-slate-200/50',
        ]"
        @submit.prevent="onSubmitRok"
      >
        <div class="text-center mb-6">
          <h2 class="text-2xl font-bold mb-2"
            :class="theme === 'dark' ? 'text-slate-100' : 'text-slate-900'">
            Create Rise of Kingdoms Listing
          </h2>
          <p class="text-sm"
            :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
            Provide account details and connect with buyers
          </p>
          <p class="text-xs mt-2"
            :class="theme === 'dark' ? 'text-slate-500' : 'text-slate-500'">
            Logged in as: <span class="font-semibold text-emerald-400">{{ currentUser.fullName || currentUser.email }}</span>
          </p>
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm font-semibold"
              :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
              <span>Asking Price (USD) *</span>
            </label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
              <input
                v-model="rokForm.askingPrice"
                type="number"
                min="1"
                step="0.01"
                required
                placeholder="0.00"
                :class="[
                  'w-full rounded-lg border pl-8 pr-4 py-3 text-sm transition-all duration-300 ease-in-out',
                  theme === 'dark'
                    ? 'border-slate-700 bg-slate-800/50 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                ]"
              />
            </div>
          </div>

          
          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm font-semibold"
              :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
              <span>Farm Accounts *</span>
            </label>
            <input
              v-model="rokForm.farmAccounts"
              type="text"
              required
              placeholder="e.g. 10 x Farm Accounts ready migration"
              :class="[
                'w-full rounded-lg border px-4 py-3 text-sm transition-all duration-300 ease-in-out',
                theme === 'dark'
                  ? 'border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
              ]"
            />
          </div>

          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm font-semibold"
              :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
              <span>Passport Ready *</span>
            </label>
            <select v-model="rokForm.passportReady"
              required
              :class="[
                'w-full rounded-lg border px-4 py-3 text-sm transition-all duration-300 ease-in-out',
                theme === 'dark'
                  ? 'border-slate-600 bg-slate-700 text-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  : 'border-slate-300 bg-white text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
              ]"
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm font-semibold"
              :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
              <span>Passport Needed *</span>
            </label>
            <input
              v-model="rokForm.passportNeeded"
              type="number"
              min="1"
              max="10000"
              required
              placeholder="1-10000"
              :class="[
                'w-full rounded-lg border px-4 py-3 text-sm transition-all duration-300 ease-in-out',
                theme === 'dark'
                  ? 'border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
              ]"
            />
          </div>

          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm font-semibold"
              :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
              <span>Ready to Migrate *</span>
            </label>
            <select v-model="rokForm.readyToMigrate"
              required
              :class="[
                'w-full rounded-lg border px-4 py-3 text-sm transition-all duration-300 ease-in-out',
                theme === 'dark'
                  ? 'border-slate-600 bg-slate-700 text-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  : 'border-slate-300 bg-white text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
              ]"
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm font-semibold"
              :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
              <span>Focus Type *</span>
            </label>
            <select v-model="rokForm.focusType"
              required
              :class="[
                'w-full rounded-lg border px-4 py-3 text-sm transition-all duration-300 ease-in-out',
                theme === 'dark'
                  ? 'border-slate-600 bg-slate-700 text-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  : 'border-slate-300 bg-white text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
              ]"
            >
              <option value="">Select</option>
              <option value="Cavalry">Cavalry</option>
              <option value="Infantry">Infantry</option>
              <option value="Archer">Archer</option>
              <option value="Engineering">Engineering</option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm font-semibold"
              :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
              <span>VIP Level *</span>
            </label>
            <input
              v-model="rokForm.vipLevel"
              type="text"
              required
              placeholder="1-19 or SVIP"
              :class="[
                'w-full rounded-lg border px-4 py-3 text-sm transition-all duration-300 ease-in-out',
                theme === 'dark'
                  ? 'border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
              ]"
            />
          </div>

          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm font-semibold"
              :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
              <span>Current Gold Heads *</span>
            </label>
            <input
              v-model="rokForm.currentGoldHeads"
              type="number"
              min="1"
              max="100000"
              required
              placeholder="1-100000"
              :class="[
                'w-full rounded-lg border px-4 py-3 text-sm transition-all duration-300 ease-in-out',
                theme === 'dark'
                  ? 'border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
              ]"
            />
          </div>

          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm font-semibold"
              :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
              <span>Troop Count *</span>
            </label>
            <input
              v-model="rokForm.troopCount"
              type="text"
              required
              placeholder="e.g. 10,000,000"
              :class="[
                'w-full rounded-lg border px-4 py-3 text-sm transition-all duration-300 ease-in-out',
                theme === 'dark'
                  ? 'border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
              ]"
            />
          </div>

          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm font-semibold"
              :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
              <span>Current Power *</span>
            </label>
            <input
              v-model="rokForm.currentPower"
              type="text"
              required
              placeholder="e.g. 500M"
              :class="[
                'w-full rounded-lg border px-4 py-3 text-sm transition-all duration-300 ease-in-out',
                theme === 'dark'
                  ? 'border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
              ]"
            />
          </div>

          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm font-semibold"
              :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
              <span>First Purchase Receipt *</span>
            </label>
            <select v-model="rokForm.firstPurchaseReceipt"
              required
              :class="[
                'w-full rounded-lg border px-4 py-3 text-sm transition-all duration-300 ease-in-out',
                theme === 'dark'
                  ? 'border-slate-600 bg-slate-700 text-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  : 'border-slate-300 bg-white text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
              ]"
            >
              <option value="">Select</option>
              <option value="available">Available</option>
              <option value="not">Not</option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm font-semibold"
              :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
              <span>Has VIP Support? *</span>
            </label>
            <select v-model="rokForm.hasVipSupport"
              required
              :class="[
                'w-full rounded-lg border px-4 py-3 text-sm transition-all duration-300 ease-in-out',
                theme === 'dark'
                  ? 'border-slate-600 bg-slate-700 text-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  : 'border-slate-300 bg-white text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
              ]"
            >
              <option value="">Select</option>
              <option value="available">Available</option>
              <option value="not">Not</option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm font-semibold"
              :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
              <span>KvK Season *</span>
            </label>
            <select v-model="rokForm.kvkSeason"
              required
              :class="[
                'w-full rounded-lg border px-4 py-3 text-sm transition-all duration-300 ease-in-out',
                theme === 'dark'
                  ? 'border-slate-600 bg-slate-700 text-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  : 'border-slate-300 bg-white text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
              ]"
            >
              <option value="">Select</option>
              <option value="kvk1">kvk1</option>
              <option value="kvk2">kvk2</option>
              <option value="kvk3">kvk3</option>
              <option value="kvk4">kvk4</option>
              <option value="SOC">SOC</option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm font-semibold"
              :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
              <span>Universal Speedups (Days) *</span>
            </label>
            <input
              v-model="rokForm.universalSpeedupsDays"
              type="number"
              min="1"
              max="1000000"
              required
              placeholder="1-1000000"
              :class="[
                'w-full rounded-lg border px-4 py-3 text-sm transition-all duration-300 ease-in-out',
                theme === 'dark'
                  ? 'border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
              ]"
            />
          </div>

          <div class="space-y-2 sm:col-span-2">
            <label class="flex items-center gap-2 text-sm font-semibold"
              :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
              <span>Equipment *</span>
            </label>
            <textarea
              v-model="rokForm.equipment"
              rows="3"
              required
              placeholder="Describe key equipment"
              :class="[
                'w-full rounded-lg border px-4 py-3 text-sm transition-all duration-300 ease-in-out',
                theme === 'dark'
                  ? 'border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
              ]"
            />
          </div>

          <div class="space-y-2 sm:col-span-2">
            <label class="flex items-center gap-2 text-sm font-semibold"
              :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
              <span>Top Commanders *</span>
            </label>
            <textarea
              v-model="rokForm.topCommanders"
              rows="3"
              required
              placeholder="List top commanders"
              :class="[
                'w-full rounded-lg border px-4 py-3 text-sm transition-all duration-300 ease-in-out',
                theme === 'dark'
                  ? 'border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
              ]"
            />
          </div>

          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm font-semibold"
              :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
              <span>Contact Link</span>
            </label>
            <input
              v-model="rokForm.contactLink"
              type="url"
              placeholder="Social media link"
              :class="[
                'w-full rounded-lg border px-4 py-3 text-sm transition-all duration-300 ease-in-out',
                theme === 'dark'
                  ? 'border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
              ]"
            />
          </div>

          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm font-semibold"
              :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
              <span>Contact Number *</span>
            </label>
            <input
              v-model="rokForm.contactNumber"
              type="tel"
              inputmode="tel"
              pattern="^[0-9+()\s-]{7,20}$"
              required
              placeholder="+63 999-123-4567"
              :class="[
                'w-full rounded-lg border px-4 py-3 text-sm transition-all duration-300 ease-in-out',
                theme === 'dark'
                  ? 'border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
              ]"
            />
          </div>

                    <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm font-semibold"
              :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
              <span>Middleman *</span>
            </label>
            <select
              v-model="rokForm.middlemanId"
              required
              :class="[
                'w-full rounded-lg border px-4 py-3 text-sm transition-all duration-300 ease-in-out',
                theme === 'dark'
                  ? 'border-slate-600 bg-slate-700 text-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  : 'border-slate-300 bg-white text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
              ]"
            >
              <option value="" disabled>Select a middleman</option>
              <option
                v-for="middleman in middlemen"
                :key="middleman.id"
                :value="middleman.id"
              >
                {{ middleman.name }} ({{ middleman.email }})
              </option>
            </select>
          </div>

        </div>

        <div class="space-y-3">
          <label class="flex items-center gap-2 text-sm font-semibold"
            :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
            <span>Bag & Inventory Screenshots *</span>
          </label>
          <p class="text-xs"
            :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-500'">
            Upload up to 20 screenshots (max 5MB each)
          </p>
          <div
            :class="[
              'relative rounded-lg border-2 border-dashed p-6 transition-all duration-300 ease-in-out',
              theme === 'dark'
                ? 'border-slate-700 bg-slate-800/30 hover:border-emerald-500/50'
                : 'border-slate-300 bg-slate-50 hover:border-emerald-500/50',
            ]"
          >
            <input
              type="file"
              multiple
              accept="image/*"
              :class="[
                'block w-full text-sm cursor-pointer',
                theme === 'dark' ? 'text-slate-200' : 'text-slate-700',
                'file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-4 file:py-3',
                'file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-500',
                'file:transition-all file:duration-200 file:cursor-pointer',
              ]"
              @change="handleRokImagesChange"
            />
            <p class="mt-2 text-xs text-center"
              :class="theme === 'dark' ? 'text-slate-500' : 'text-slate-400'">
              PNG, JPG, WebP, GIF up to 5MB each (max 20 images)
            </p>
          </div>

          <div v-if="rokImagePreviews.length" class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            <div
              v-for="(src, index) in rokImagePreviews"
              :key="index"
              :class="[
                'group relative overflow-hidden rounded-lg border transition-all duration-300 ease-in-out hover:scale-[1.02]',
                theme === 'dark'
                  ? 'border-slate-700 bg-slate-800/50'
                  : 'border-slate-300 bg-white',
              ]"
            >
              <img :src="src" alt="Account image preview" class="h-40 w-full object-cover" />
              <button
                type="button"
                @click="removeRokImage(index)"
                :class="[
                  'absolute top-2 right-2 rounded-full p-1.5 opacity-0 transition-opacity group-hover:opacity-100',
                  theme === 'dark'
                    ? 'bg-red-600/80 text-white hover:bg-red-500'
                    : 'bg-red-500 text-white hover:bg-red-600',
                ]"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <div v-if="rokError"
          :class="[
            'rounded-lg border p-4 transition-all duration-300 ease-in-out',
            theme === 'dark'
              ? 'border-red-500/50 bg-red-500/10 text-red-300'
              : 'border-red-300 bg-red-50 text-red-700',
          ]"
        >
          <p class="text-sm font-medium flex items-center gap-2">
            <span>{{ rokError }}</span>
          </p>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t"
          :class="theme === 'dark' ? 'border-slate-700' : 'border-slate-200'">
          <button
            type="submit"
            :disabled="submittingRok"
            :class="[
              'inline-flex items-center justify-center gap-2 rounded-lg px-8 py-4 text-base font-bold text-white shadow-md transition-all duration-300 ease-in-out',
              'bg-emerald-600 hover:bg-emerald-500',
              'disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-emerald-600',
              'hover:scale-[1.02] active:scale-[0.98]',
            ]"
          >
            <span v-if="!submittingRok">Post Listing</span>
            <span v-else class="flex items-center gap-2">
              <span class="animate-spin">⏳</span>
              <span>Submitting...</span>
            </span>
          </button>
        </div>
      </form>

      <section
        v-if="activeTab === 'post' && submittedListing"
        :class="[
          'mt-8 rounded-lg border p-8 shadow-lg transition-all duration-300 ease-in-out',
          theme === 'dark'
            ? 'border-emerald-500/50 bg-emerald-500/10'
            : 'border-emerald-300 bg-emerald-50/80',
        ]"
      >
        <div class="flex items-center gap-3 mb-6">
          <span class="text-3xl">✅</span>
          <h2 class="text-2xl font-bold"
            :class="theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700'">
            Listing Submitted Successfully!
          </h2>
          <p class="text-sm mt-2"
            :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'">
            Your listing is pending approval and will appear in the marketplace once approved by an admin. You'll receive a notification when your listing is reviewed!
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div class="flex items-center gap-2">
            <span class="font-semibold"
              :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'">👤 Nickname:</span>
            <span :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-900'">{{ submittedListing.nickname }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-semibold"
              :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'">🌐 Server:</span>
            <span :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-900'">{{ submittedListing.server }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-semibold"
              :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'">⚡ Growth Power:</span>
            <span :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-900'">{{ submittedListing.growthPower }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-semibold"
              :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'">💰 Price:</span>
            <span class="text-emerald-400 font-bold">${{ submittedListing.askingPrice }}</span>
          </div>
          <div v-if="submittedListing.classesList.length" class="flex items-center gap-2">
            <span class="font-semibold"
              :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'">⚔️ Class:</span>
            <span :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-900'">{{ submittedListing.classesList.join(", ") }}</span>
          </div>
          <div v-if="submittedListing.contactLink" class="flex items-center gap-2">
            <span class="font-semibold"
              :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'">🔗 Contact:</span>
            <a
              :href="submittedListing.contactLink"
              target="_blank"
              rel="noopener noreferrer"
              class="text-emerald-400 underline hover:text-emerald-300 transition-colors"
            >
              View Link
            </a>
          </div>
        </div>

        <div v-if="submittedListing.images.length" class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div
            v-for="(src, index) in submittedListing.images"
            :key="index"
            :class="[
              'overflow-hidden rounded-lg border transition-all duration-300 ease-in-out',
              theme === 'dark'
                ? 'border-slate-700 bg-slate-800/50'
                : 'border-slate-300 bg-white',
            ]"
          >
            <img :src="src" alt="Listing image" class="h-40 w-full object-cover" />
          </div>
        </div>
        <div v-else class="mt-6">
          <div
            :class="[
              'overflow-hidden rounded-lg border transition-all duration-300 ease-in-out',
              theme === 'dark' ? 'border-slate-700 bg-slate-800/50' : 'border-slate-300 bg-white',
            ]"
          >
            <img :src="submittedDefaultImage" alt="Default image" class="h-40 w-full object-cover" />
          </div>
        </div>
      </section>
      
      </template>
      <br>
      <section
        v-if="!showLandingPage && activeTab === 'listings'"
        class="space-y-6"
      >
        <!-- Hero Section with Stats -->
        <div class="relative overflow-hidden rounded-2xl border p-8 sm:p-10 mb-8"
          :class="theme === 'dark' 
            ? 'border-slate-700 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
            : 'border-slate-200 bg-gradient-to-br from-white via-emerald-50/30 to-white'">
          <div 
            class="absolute inset-0 opacity-5"
            :style="theme === 'dark' 
              ? { backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '20px 20px' }
              : { backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0)', backgroundSize: '20px 20px' }"
          >
          </div>
          <div class="relative">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6">
              <div>
                <h2 class="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r bg-clip-text text-transparent"
                  :class="theme === 'dark' 
                    ? 'from-emerald-400 to-teal-400' 
                    : 'from-emerald-600 to-teal-600'">
                  Marketplace
                </h2>
                <p class="text-base"
                  :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'">
                  Browse premium Rise of Kingdoms accounts for sale
                </p>
              </div>
              <div class="flex items-center gap-3">
                <button
                  v-if="currentUser"
                  type="button"
                  @click="setTab('post')"
                  :class="[
                    'inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all duration-300 ease-in-out shadow-lg',
                    'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 hover:scale-[1.02] hover:shadow-xl',
                  ]"
                >
                  <span>➕</span>
                  <span>Post New Listing</span>
                </button>
                <button
                  v-else
                  type="button"
                  @click="setTab('auth')"
                  :class="[
                    'inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all duration-300 ease-in-out shadow-lg',
                    'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 hover:scale-[1.02] hover:shadow-xl',
                  ]"
                >
                  <span>🔐</span>
                  <span>Login to Sell</span>
                </button>
                <button
                  type="button"
                  @click="refreshListings"
                  :disabled="loadingListings"
                  :class="[
                    'inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 ease-in-out',
                    theme === 'dark'
                      ? 'border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800'
                      : 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50',
                  ]"
                >
                  <span>🔄</span>
                  <span>{{ loadingListings ? 'Refreshing...' : 'Refresh' }}</span>
                </button>
              </div>
            </div>
            
            <!-- Stats -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="rounded-xl p-4 border backdrop-blur-sm"
                :class="theme === 'dark' 
                  ? 'border-slate-700/50 bg-slate-800/50' 
                  : 'border-slate-200/50 bg-white/70'">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                    :class="theme === 'dark' 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-emerald-100 text-emerald-600'">
                    📦
                  </div>
                  <div>
                    <p class="text-2xl font-bold"
                      :class="theme === 'dark' ? 'text-slate-100' : 'text-slate-900'">
                      {{ listings.length }}
                    </p>
                    <p class="text-xs"
                      :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
                      Total Listings
                    </p>
                  </div>
                </div>
              </div>
              <div class="rounded-xl p-4 border backdrop-blur-sm"
                :class="theme === 'dark' 
                  ? 'border-slate-700/50 bg-slate-800/50' 
                  : 'border-slate-200/50 bg-white/70'">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                    :class="theme === 'dark' 
                      ? 'bg-teal-500/20 text-teal-400' 
                      : 'bg-teal-100 text-teal-600'">
                    ✅
                  </div>
                  <div>
                    <p class="text-2xl font-bold"
                      :class="theme === 'dark' ? 'text-slate-100' : 'text-slate-900'">
                      {{ listings.filter(l => l.status === 'approved').length }}
                    </p>
                    <p class="text-xs"
                      :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
                      Available Now
                    </p>
                  </div>
                </div>
              </div>
              <div class="rounded-xl p-4 border backdrop-blur-sm"
                :class="theme === 'dark' 
                  ? 'border-slate-700/50 bg-slate-800/50' 
                  : 'border-slate-200/50 bg-white/70'">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                    :class="theme === 'dark' 
                      ? 'bg-amber-500/20 text-amber-400' 
                      : 'bg-amber-100 text-amber-600'">
                    👥
                  </div>
                  <div>
                    <p class="text-2xl font-bold"
                      :class="theme === 'dark' ? 'text-slate-100' : 'text-slate-900'">
                      {{ currentUser ? 'Active' : 'Join' }}
                    </p>
                    <p class="text-xs"
                      :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
                      Community
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters Section -->
        <div
          v-if="!loadingListings && !listingsError"
          :class="[
            'mb-6 rounded-xl border p-5 sm:p-6 transition-all duration-300 ease-in-out shadow-sm',
            theme === 'dark'
              ? 'border-slate-700 bg-slate-800/60 backdrop-blur-sm'
              : 'border-slate-200 bg-white shadow-md',
          ]"
        >
          <div class="flex items-center justify-between gap-3 mb-4">
            <h3
              class="text-sm font-semibold"
              :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-800'"
            >
              Filters
            </h3>
            <button
              type="button"
              @click="resetFilters"
              class="text-xs font-medium underline decoration-dashed decoration-slate-500/60"
              :class="
                theme === 'dark'
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              "
            >
              Reset
            </button>
            <button
              v-if="hasMoreThanSixFilters"
              type="button"
              @click="filtersExpanded = !filtersExpanded"
              :class="[
                'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-300 ease-in-out',
                theme === 'dark'
                  ? 'border border-slate-700 bg-slate-900/50 text-slate-200 hover:bg-slate-800'
                  : 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50',
              ]"
            >
              <span>{{ filtersExpanded ? 'Show less' : 'Show more' }}</span>
              <span>{{ filtersExpanded ? '▲' : '▼' }}</span>
            </button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div class="space-y-2">
              <label
                class="flex items-center gap-2 text-xs font-semibold"
                :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'"
              >
                <span>Game</span>
              </label>
              <select
                v-model="filters.game"
                :class="[
                  'w-full rounded-lg border px-3 py-2 text-xs sm:text-sm transition-all duration-300 ease-in-out',
                  theme === 'dark'
                    ? 'border-slate-600 bg-slate-800 text-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    : 'border-slate-300 bg-white text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                ]"
              >
                <option value="rok">Rise of Kingdoms</option>
              </select>
            </div>
            <div class="space-y-2">
              <label
                class="flex items-center gap-2 text-xs font-semibold"
                :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'"
              >
                <span>Code</span>
              </label>
              <input
                v-model="filters.codeId"
                type="text"
                placeholder="Enter listing ID"
                :class="[
                  'w-full rounded-lg border px-3 py-2 text-xs sm:text-sm transition-all duration-300 ease-in-out',
                  theme === 'dark'
                    ? 'border-slate-600 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                ]"
              />
            </div>
            <div class="space-y-2" v-if="filters.game !== 'rok'">
              <label
                class="flex items-center gap-2 text-xs font-semibold"
                :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'"
              >
                <span>Server</span>
              </label>
              <input
                v-model="filters.server"
                type="text"
                placeholder="Any server"
                :class="[
                  'w-full rounded-lg border px-3 py-2 text-xs sm:text-sm transition-all duration-300 ease-in-out',
                  theme === 'dark'
                    ? 'border-slate-600 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                ]"
              />
            </div>

            <div class="space-y-2" v-if="filters.game !== 'rok'">
              <label
                class="flex items-center gap-2 text-xs font-semibold"
                :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'"
              >
                <span>Class</span>
              </label>
              <select
                v-model="filters.className"
                :class="[
                  'w-full rounded-lg border px-3 py-2 text-xs sm:text-sm transition-all duration-300 ease-in-out',
                  theme === 'dark'
                    ? 'border-slate-600 bg-slate-800 text-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    : 'border-slate-300 bg-white text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                ]"
              >
                <option value="">All classes</option>
                <option
                  v-for="className in classOptions"
                  :key="className"
                  :value="className"
                >
                  {{ className }}
                </option>
              </select>
            </div>

            <div class="space-y-2">
              <label
                class="flex items-center gap-2 text-xs font-semibold"
                :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'"
              >
                <span>Price (USD)</span>
              </label>
              <div class="flex items-center gap-2">
                <input
                  v-model="filters.minPrice"
                  type="number"
                  min="0"
                  placeholder="Min"
                  :class="[
                    'w-full rounded-lg border px-3 py-2 text-xs sm:text-sm transition-all duration-300 ease-in-out',
                    theme === 'dark'
                      ? 'border-slate-600 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                  ]"
                />
                <span
                  class="text-xs text-slate-500"
                  :class="theme === 'dark' ? 'text-slate-500' : 'text-slate-400'"
                >
                  -
                </span>
                <input
                  v-model="filters.maxPrice"
                  type="number"
                  min="0"
                  placeholder="Max"
                  :class="[
                    'w-full rounded-lg border px-3 py-2 text-xs sm:text-sm transition-all duration-300 ease-in-out',
                    theme === 'dark'
                      ? 'border-slate-600 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                  ]"
                />
              </div>
            </div>

            <div class="space-y-2" v-if="filters.game === 'rok'">
              <label
                class="flex items-center gap-2 text-xs font-semibold"
                :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'"
              >
                <span>VIP Level</span>
              </label>
              <div class="flex items-center gap-2">
                <input v-model="filters.rokVipMin" type="number" min="0" placeholder="Min"
                  :class="[
                    'w-full rounded-lg border px-3 py-2 text-xs sm:text-sm transition-all duration-300 ease-in-out',
                    theme === 'dark'
                      ? 'border-slate-600 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                  ]" />
                <span class="text-xs" :class="theme === 'dark' ? 'text-slate-500' : 'text-slate-400'">-</span>
                <input v-model="filters.rokVipMax" type="number" min="0" placeholder="Max"
                  :class="[
                    'w-full rounded-lg border px-3 py-2 text-xs sm:text-sm transition-all duration-300 ease-in-out',
                    theme === 'dark'
                      ? 'border-slate-600 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                  ]" />
              </div>
            </div>

            <div class="space-y-2" v-if="filters.game === 'rok'">
              <label class="flex items-center gap-2 text-xs font-semibold"
                :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'">
                <span>Current Power</span>
              </label>
              <div class="flex items-center gap-2">
                <input v-model="filters.rokPowerMin" type="number" min="0" placeholder="Min"
                  :class="[
                    'w-full rounded-lg border px-3 py-2 text-xs sm:text-sm transition-all duration-300 ease-in-out',
                    theme === 'dark'
                      ? 'border-slate-600 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                  ]" />
                <span class="text-xs" :class="theme === 'dark' ? 'text-slate-500' : 'text-slate-400'">-</span>
                <input v-model="filters.rokPowerMax" type="number" min="0" placeholder="Max"
                  :class="[
                    'w-full rounded-lg border px-3 py-2 text-xs sm:text-sm transition-all duration-300 ease-in-out',
                    theme === 'dark'
                      ? 'border-slate-600 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                  ]" />
              </div>
            </div>

            <div class="space-y-2" v-if="filters.game === 'rok'">
              <label class="flex items-center gap-2 text-xs font-semibold"
                :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'">
                <span>Troop Count</span>
              </label>
              <div class="flex items-center gap-2">
                <input v-model="filters.rokTroopMin" type="number" min="0" placeholder="Min"
                  :class="[
                    'w-full rounded-lg border px-3 py-2 text-xs sm:text-sm transition-all duration-300 ease-in-out',
                    theme === 'dark'
                      ? 'border-slate-600 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                  ]" />
                <span class="text-xs" :class="theme === 'dark' ? 'text-slate-500' : 'text-slate-400'">-</span>
                <input v-model="filters.rokTroopMax" type="number" min="0" placeholder="Max"
                  :class="[
                    'w-full rounded-lg border px-3 py-2 text-xs sm:text-sm transition-all duration-300 ease-in-out',
                    theme === 'dark'
                      ? 'border-slate-600 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                  ]" />
              </div>
            </div>

            <div class="space-y-2" v-if="filters.game === 'rok'">
              <label class="flex items-center gap-2 text-xs font-semibold"
                :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'"><span>Focus</span></label>
              <input v-model="filters.rokFocus" type="text" placeholder="e.g. Infantry"
                :class="[
                  'w-full rounded-lg border px-3 py-2 text-xs sm:text-sm transition-all duration-300 ease-in-out',
                  theme === 'dark'
                    ? 'border-slate-600 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                ]" />
            </div>

            <div class="space-y-2" v-if="filters.game === 'rok'">
              <label class="flex items-center gap-2 text-xs font-semibold"
                :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'"><span>KVK Season</span></label>
              <input v-model="filters.rokKvkSeason" type="text" placeholder="e.g. SOC"
                :class="[
                  'w-full rounded-lg border px-3 py-2 text-xs sm:text-sm transition-all duration-300 ease-in-out',
                  theme === 'dark'
                    ? 'border-slate-600 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                ]" />
            </div>

            <div class="space-y-2" v-if="filters.game === 'rok' && filtersExpanded">
              <label class="flex items-center gap-2 text-xs font-semibold"
                :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'"><span>Passport Ready</span></label>
              <select v-model="filters.rokPassportReady"
                :class="[
                  'w-full rounded-lg border px-3 py-2 text-xs sm:text-sm transition-all duration-300 ease-in-out',
                  theme === 'dark'
                    ? 'border-slate-600 bg-slate-800 text-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    : 'border-slate-300 bg-white text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                ]">
                <option value="">All</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div class="space-y-2" v-if="filters.game === 'rok' && filtersExpanded">
              <label class="flex items-center gap-2 text-xs font-semibold"
                :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'"><span>Passport Needed</span></label>
              <select v-model="filters.rokPassportNeeded"
                :class="[
                  'w-full rounded-lg border px-3 py-2 text-xs sm:text-sm transition-all duration-300 ease-in-out',
                  theme === 'dark'
                    ? 'border-slate-600 bg-slate-800 text-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    : 'border-slate-300 bg-white text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                ]">
                <option value="">All</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div class="space-y-2" v-if="filters.game === 'rok' && filtersExpanded">
              <label class="flex items-center gap-2 text-xs font-semibold"
                :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'"><span>Ready To Migrate</span></label>
              <select v-model="filters.rokReadyToMigrate"
                :class="[
                  'w-full rounded-lg border px-3 py-2 text-xs sm:text-sm transition-all duration-300 ease-in-out',
                  theme === 'dark'
                    ? 'border-slate-600 bg-slate-800 text-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    : 'border-slate-300 bg-white text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                ]">
                <option value="">All</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div class="space-y-2" v-if="filters.game === 'rok' && filtersExpanded">
              <label class="flex items-center gap-2 text-xs font-semibold"
                :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'"><span>VIP Support</span></label>
              <select v-model="filters.rokHasVipSupport"
                :class="[
                  'w-full rounded-lg border px-3 py-2 text-xs sm:text-sm transition-all duration-300 ease-in-out',
                  theme === 'dark'
                    ? 'border-slate-600 bg-slate-800 text-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    : 'border-slate-300 bg-white text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                ]">
                <option value="">All</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div class="space-y-2" v-if="filters.game === 'rok' && filtersExpanded">
              <label class="flex items-center gap-2 text-xs font-semibold"
                :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'"><span>Gold Heads ≥</span></label>
              <input v-model="filters.rokGoldHeadsMin" type="number" min="0" placeholder="e.g. 500"
                :class="[
                  'w-full rounded-lg border px-3 py-2 text-xs sm:text-sm transition-all duration-300 ease-in-out',
                  theme === 'dark'
                    ? 'border-slate-600 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                ]" />
            </div>

            <div class="space-y-2" v-if="filters.game === 'rok' && filtersExpanded">
              <label class="flex items-center gap-2 text-xs font-semibold"
                :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'"><span>Speedups Days ≥</span></label>
              <input v-model="filters.rokSpeedupsDaysMin" type="number" min="0" placeholder="e.g. 200"
                :class="[
                  'w-full rounded-lg border px-3 py-2 text-xs sm:text-sm transition-all duration-300 ease-in-out',
                  theme === 'dark'
                    ? 'border-slate-600 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                ]" />
            </div>

            <div class="space-y-2" v-if="filters.game === 'rok' && filtersExpanded">
              <label class="flex items-center gap-2 text-xs font-semibold"
                :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'"><span>Farm Accounts ≥</span></label>
              <input v-model="filters.rokFarmAccountsMin" type="number" min="0" placeholder="e.g. 3"
                :class="[
                  'w-full rounded-lg border px-3 py-2 text-xs sm:text-sm transition-all duration-300 ease-in-out',
                  theme === 'dark'
                    ? 'border-slate-600 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                ]" />
            </div>

            <div class="space-y-2" v-if="filters.game === 'rok' && filtersExpanded">
              <label class="flex items-center gap-2 text-xs font-semibold"
                :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'"><span>Top Commanders</span></label>
              <input v-model="filters.rokTopCommanders" type="text" placeholder="e.g. Guan, Nevsky"
                :class="[
                  'w-full rounded-lg border px-3 py-2 text-xs sm:text-sm transition-all duration-300 ease-in-out',
                  theme === 'dark'
                    ? 'border-slate-600 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                ]" />
            </div>

            <div class="space-y-2" v-if="filters.game === 'rok' && filtersExpanded">
              <label class="flex items-center gap-2 text-xs font-semibold"
                :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'"><span>Equipment</span></label>
              <input v-model="filters.rokEquipment" type="text" placeholder="e.g. Legendary set"
                :class="[
                  'w-full rounded-lg border px-3 py-2 text-xs sm:text-sm transition-all duration-300 ease-in-out',
                  theme === 'dark'
                    ? 'border-slate-600 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                ]" />
            </div>
            <div class="space-y-2" v-if="filters.game !== 'rok'">
              <label
                class="flex items-center gap-2 text-xs font-semibold"
                :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'"
              >
                <span>Growth Power</span>
              </label>
              <div class="flex items-center gap-2">
                <input
                  v-model="filters.minGrowthPower"
                  type="number"
                  min="0"
                  placeholder="Min"
                  :class="[
                    'w-full rounded-lg border px-3 py-2 text-xs sm:text-sm transition-all duration-300 ease-in-out',
                    theme === 'dark'
                      ? 'border-slate-600 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                  ]"
                />
                <span
                  class="text-xs text-slate-500"
                  :class="theme === 'dark' ? 'text-slate-500' : 'text-slate-400'"
                >
                  -
                </span>
                <input
                  v-model="filters.maxGrowthPower"
                  type="number"
                  min="0"
                  placeholder="Max"
                  :class="[
                    'w-full rounded-lg border px-3 py-2 text-xs sm:text-sm transition-all duration-300 ease-in-out',
                    theme === 'dark'
                      ? 'border-slate-600 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                  ]"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label
                class="flex items-center gap-2 text-xs font-semibold"
                :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'"
              >
                <span>Status</span>
              </label>
              <select
                v-model="filters.soldStatus"
                :class="[
                  'w-full rounded-lg border px-3 py-2 text-xs sm:text-sm transition-all duration-300 ease-in-out',
                  theme === 'dark'
                    ? 'border-slate-600 bg-slate-800 text-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    : 'border-slate-300 bg-white text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                ]"
              >
                <option value="">All (Sold & Unsold)</option>
                <option value="unsold">Available Only</option>
                <option value="sold">Sold Only</option>
              </select>
            </div>
          </div>
        </div>

        <div v-if="loadingListings" class="text-center py-12">
          <div class="inline-block animate-spin text-4xl mb-4">⏳</div>
          <p class="text-sm"
            :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
          Loading listings...
        </p>
        </div>

        <div v-if="listingsError"
          :class="[
            'rounded-lg border p-6 text-center transition-all duration-300 ease-in-out',
            theme === 'dark'
              ? 'border-red-500/50 bg-red-500/10 text-red-300'
              : 'border-red-300 bg-red-50 text-red-700',
          ]">
          <p class="text-sm font-medium">⚠️ {{ listingsError }}</p>
        </div>

        <div
          v-if="!loadingListings && !listingsError && !listings.length"
          :class="[
            'rounded-lg border p-12 text-center transition-all duration-300 ease-in-out',
            theme === 'dark'
              ? 'border-slate-700 bg-slate-800/50'
              : 'border-slate-300 bg-white',
          ]"
        >
          <span class="text-5xl mb-4 block">📭</span>
          <p class="text-sm font-medium"
            :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
            No listings available yet. Be the first to post!
          </p>
        </div>

        <div
          v-if="
            !loadingListings &&
            !listingsError &&
            listings.length &&
            !filteredListings.length
          "
          :class="[
            'rounded-lg border p-12 text-center transition-all duration-300 ease-in-out',
            theme === 'dark'
              ? 'border-slate-700 bg-slate-800/50'
              : 'border-slate-300 bg-white',
          ]"
        >
          <span class="text-5xl mb-4 block">🔎</span>
          <p
            class="text-sm font-medium"
            :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'"
          >
            No listings match your filters. Try adjusting or resetting them.
          </p>
        </div>

        <!-- Listing Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="item in filteredListings"
          :key="item.id"
          @click="openListingModal(item)"
          :class="[
              'group relative rounded-xl border overflow-hidden transition-all duration-300 ease-in-out',
              item.status === 'sold' 
                ? 'cursor-not-allowed opacity-75'
                : 'cursor-pointer hover:scale-[1.02] hover:shadow-2xl',
            theme === 'dark'
                ? item.status === 'sold'
                  ? 'border-slate-700/50 bg-slate-800/40'
                  : 'border-slate-700/50 bg-slate-800/60 hover:border-emerald-500/50 hover:shadow-emerald-500/10'
                : item.status === 'sold'
                  ? 'border-slate-200 bg-slate-50'
                  : 'border-slate-200 bg-white hover:border-emerald-500/50 hover:shadow-xl',
            ]"
          >
            <!-- Status Badge -->
            <div v-if="item.status === 'sold'" class="absolute top-3 right-3 z-10">
              <span class="text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
                :class="theme === 'dark' 
                  ? 'bg-red-600/90 text-white border border-red-500'
                  : 'bg-red-600 text-white border border-red-700'">
                SOLD
              </span>
            </div>

            <!-- Image Gallery -->
            <div
              v-if="item.images.length"
              class="relative h-48 overflow-hidden bg-gradient-to-br"
              :class="theme === 'dark' 
                ? 'from-slate-800 to-slate-900' 
                : 'from-slate-100 to-slate-200'">
              <img 
                :src="item.images[0]" 
                :alt="item.nickname"
                loading="lazy" decoding="async"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div v-if="item.images.length > 1" class="absolute bottom-2 right-2">
                <span class="px-2 py-1 text-xs font-semibold rounded backdrop-blur-sm"
                  :class="theme === 'dark' 
                    ? 'bg-black/50 text-white' 
                    : 'bg-white/80 text-slate-900'">
                  +{{ item.images.length - 1 }} more
                </span>
              </div>
            </div>
            <div
              v-else
              class="relative h-48 overflow-hidden bg-gradient-to-br"
              :class="theme === 'dark' 
                ? 'from-slate-800 to-slate-900' 
                : 'from-slate-100 to-slate-200'">
              <img 
                :src="item.game === 'rok' ? rokDefaultImg : ymirDefaultImg" 
                :alt="item.game === 'rok' ? 'Rise of Kingdoms' : 'Legends of Ymir'"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
            </div>

            <!-- Card Content -->
            <div class="p-5">
              <!-- Header -->
              <div class="mb-3">
                <h3 class="text-lg font-bold mb-2 line-clamp-1"
                  :class="theme === 'dark' ? 'text-slate-100' : 'text-slate-900'">
                  {{ item.nickname }}
                </h3>
              <div class="flex items-center gap-2 text-xs mb-2"
                :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
                <template v-if="item.game === 'rok'">
                  <span class="inline-flex items-center gap-1">
                    <span>🎮</span>
                    <span>Rise of Kingdoms</span>
                  </span>
                  <span>•</span>
                  <span class="inline-flex items-center gap-1">
                    <span>⭐</span>
                    <span>VIP {{ item.vipLevel }}</span>
                  </span>
                  <span>•</span>
                  <span class="inline-flex items-center gap-1">
                    <span>⚔️</span>
                    <span>{{ item.currentPower }}</span>
                  </span>
                </template>
                <template v-else>
                  <span class="inline-flex items-center gap-1">
                    <span>🎮</span>
                    <span>Legends of Ymir</span>
                  </span>
                  <span>•</span>
                  <span class="inline-flex items-center gap-1">
                    <span>🌐</span>
                    <span>{{ item.server }}</span>
                  </span>
                  <span>•</span>
                  <span class="inline-flex items-center gap-1">
                    <span>⚡</span>
                    <span>{{ item.growthPower }} GP</span>
                  </span>
                </template>
              </div>
              </div>

              <!-- Class badges -->
              <div v-if="item.classesList.length" class="flex flex-wrap gap-1.5 mb-4">
                <span
                  v-for="className in item.classesList.slice(0, 3)"
                  :key="className"
                  :class="[
                    'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
                    theme === 'dark'
                      ? 'bg-slate-700/60 text-slate-300 border border-slate-600/50'
                      : 'bg-slate-100 text-slate-700 border border-slate-300',
                  ]"
                >
                  <span>{{ getClassIcon(className) }}</span>
                  <span>{{ className }}</span>
                </span>
                <span
                  v-if="item.classesList.length > 3"
                  :class="[
                    'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
                    theme === 'dark'
                      ? 'bg-slate-700/60 text-slate-400 border border-slate-600/50'
                      : 'bg-slate-100 text-slate-600 border border-slate-300',
                  ]"
                >
                  +{{ item.classesList.length - 3 }}
                </span>
              </div>

              <!-- Price -->
              <div class="mb-4 pt-4 border-t"
                :class="theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200'">
                <div class="flex items-baseline justify-between">
                  <span class="text-xs font-medium"
                    :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
                    Price
                  </span>
                  <div class="flex items-baseline gap-1">
                    <span 
                      v-if="item.status === 'sold'"
                      class="text-base font-bold line-through"
                      :class="theme === 'dark' ? 'text-slate-500' : 'text-slate-400'">
                      ${{ item.askingPrice }}
                    </span>
                    <span 
                      v-else
                      class="text-2xl font-bold"
                      :class="theme === 'dark' 
                        ? 'bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent'">
                      ${{ item.askingPrice }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="mb-3 flex items-center gap-2 text-xs"
                :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
                <span>🆔</span>
                <span>Code: {{ item.id }}</span>
                <button
                  type="button"
                  @click.stop="copyCodeId(item.id)"
                  :class="[
                    'rounded px-2 py-1 font-semibold',
                    theme === 'dark' ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300',
                  ]"
                >
                  Copy
                </button>
                <span v-if="copiedId === String(item.id)" :class="theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700'">Copied</span>
              </div>

              <!-- Action Button -->
              <div class="space-y-2">
                <div
                  v-if="item.status === 'sold'"
                  :class="[
                    'w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold cursor-not-allowed',
                    theme === 'dark'
                      ? 'bg-slate-700/50 text-slate-500 border border-slate-700'
                      : 'bg-slate-200 text-slate-500 border border-slate-300',
                  ]"
                  @click.stop
                >
                  <span>❌</span>
                  <span>Sold Out</span>
                </div>
                <!-- Logged-out users see a login prompt instead of contact actions -->
                <button
                  v-else-if="!currentUser"
                  type="button"
                  @click.stop="setTab('auth')"
                  :class="[
                    'w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all duration-300 ease-in-out shadow-md',
                    'bg-slate-600 hover:bg-slate-500',
                  ]"
                >
                  <span>🔐</span>
                  <span>Login to view details</span>
                </button>
                <a
                  v-else-if="item.middlemanId && item.middleman && !shouldShowSellerContact(item)"
                  :href="item.middleman.link || `mailto:${item.middleman.email}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  @click.stop
                  :class="[
                    'w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all duration-300 ease-in-out shadow-md',
                    'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:shadow-lg hover:scale-[1.02]',
                  ]"
                >
                  <span>💼</span>
                  <span>Contact Middleman</span>
                </a>
                <button
                  v-else-if="item.middlemanId && !shouldShowSellerContact(item)"
                  type="button"
                  @click.stop="openListingModal(item)"
                  :class="[
                    'w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all duration-300 ease-in-out shadow-md',
                    'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:shadow-lg hover:scale-[1.02]',
                  ]"
                >
                  <span>💼</span>
                  <span>Contact Middleman</span>
                </button>
                <a
                  v-else-if="item.contactLink"
                  :href="item.contactLink"
                  target="_blank"
                  rel="noopener noreferrer"
                  @click.stop
                  :class="[
                    'w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all duration-300 ease-in-out shadow-md',
                    'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 hover:shadow-lg hover:scale-[1.02]',
                  ]"
                >
                  <span>💬</span>
                  <span>Contact Seller</span>
                </a>
                <button
                  v-else
                  type="button"
                  @click.stop="openListingModal(item)"
                  :class="[
                    'w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all duration-300 ease-in-out shadow-md',
                    'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 hover:shadow-lg hover:scale-[1.02]',
                  ]"
                >
                  <span>👁️</span>
                  <span>View Details</span>
                </button>
                <div 
                  v-if="currentUser && item.status !== 'sold' && item.middleman && !shouldShowSellerContact(item)"
                  class="flex items-center justify-center gap-2 text-xs pt-1"
                  :class="theme === 'dark' ? 'text-slate-500' : 'text-slate-600'">
                  <span>💼</span>
                  <span>{{ item.middleman.name }} - {{ item.middleman.email }}</span>
                </div>
                <div 
                  v-else-if="currentUser && item.status !== 'sold' && shouldShowSellerContact(item) && item.contactNumber"
                  class="flex flex-col items-center justify-center gap-1 text-xs pt-1"
                  :class="theme === 'dark' ? 'text-slate-500' : 'text-slate-600'">
                  <div class="flex items-center gap-2">
                    <span>📞</span>
                    <span>{{ item.contactNumber }}</span>
                  </div>
                  <div v-if="item.contactLink" class="flex items-center gap-2">
                    <span>🔗</span>
                    <a :href="item.contactLink" target="_blank" rel="noopener noreferrer"
                      class="text-emerald-500 hover:text-emerald-400 underline text-xs">
                      Contact Link
                    </a>
                  </div>
                </div>
                <div
                  v-if="currentUser?.isAdmin && item.status !== 'sold' && item.middleman"
                  class="flex items-center justify-center gap-2 text-xs pt-1"
                  :class="theme === 'dark' ? 'text-slate-500' : 'text-slate-600'">
                  <span>💼</span>
                  <span>{{ item.middleman.name }} - {{ item.middleman.email }}</span>
                </div>
                <div 
                  v-else-if="!currentUser && item.status !== 'sold'"
                  class="flex items-center justify-center gap-2 text-xs pt-1"
                  :class="theme === 'dark' ? 'text-slate-500' : 'text-slate-600'">
                  <span>🔐</span>
                  <span>Login to see contact details</span>
                </div>
                <div class="flex items-center justify-center gap-2 text-xs pt-1"
                  :class="theme === 'dark' ? 'text-slate-500' : 'text-slate-600'">
                  <span>🕒</span>
                  <span>{{ new Date(item.createdAt).toLocaleDateString() }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div
        v-if="showListingModal && selectedListing"
        class="fixed inset-0 z-40 flex items-center justify-center px-4 sm:px-6"
      >
        <div
          class="absolute inset-0 bg-black/60"
          @click="closeListingModal"
        ></div>
        <div
          :class="[
            'relative z-50 w-full max-w-2xl rounded-2xl shadow-2xl border p-6 sm:p-8 max-h-[90vh] overflow-y-auto',
            theme === 'dark'
              ? 'bg-slate-900 border-slate-700 text-slate-100'
              : 'bg-white border-slate-200 text-slate-900',
          ]"
        >
          <div class="flex items-start justify-between gap-4 mb-4">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <h3 class="text-2xl font-bold">
                  {{ selectedListing.nickname }}
                </h3>
                <span
                  v-if="selectedListing.status === 'sold'"
                  class="text-xs font-semibold px-3 py-1 rounded"
                  :class="theme === 'dark' 
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                    : 'bg-red-100 text-red-700 border border-red-200'">
                  SOLD
                </span>
              </div>
              <p
                class="text-xs"
                :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'"
              >
                Posted {{ new Date(selectedListing.createdAt).toLocaleString() }}
              </p>
            </div>
            <button
              type="button"
              @click="closeListingModal"
              :class="[
                'rounded-full p-2 text-sm font-semibold transition-colors',
                theme === 'dark'
                  ? 'bg-slate-800 hover:bg-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200',
              ]"
            >
              ✕
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm">
            <template v-if="selectedListing.game !== 'rok'">
              <div class="space-y-1">
                <div class="font-semibold">Server</div>
                <div
                  :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-800'"
                >
                  🌐 {{ selectedListing.server }}
                </div>
              </div>
              <div class="space-y-1">
                <div class="font-semibold">Growth Power</div>
                <div
                  :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-800'"
                >
                  ⚡ {{ selectedListing.growthPower }}
                </div>
              </div>
            </template>
            <template v-else>
              <div class="space-y-1">
                <div class="font-semibold">VIP Level</div>
                <div
                  :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-800'"
                >
                  ⭐ {{ selectedListing.vipLevel }}
                </div>
              </div>
              <div class="space-y-1">
                <div class="font-semibold">Current Power</div>
                <div
                  :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-800'"
                >
                  ⚔️ {{ selectedListing.currentPower }}
                </div>
              </div>
              <div class="space-y-1">
                <div class="font-semibold">Troop Count</div>
                <div
                  :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-800'"
                >
                  🛡️ {{ selectedListing.troopCount }}
                </div>
              </div>
              <div class="space-y-1">
                <div class="font-semibold">Gold Heads</div>
                <div
                  :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-800'"
                >
                  🟡 {{ selectedListing.currentGoldHeads }}
                </div>
              </div>
              <div class="space-y-1">
                <div class="font-semibold">Focus</div>
                <div
                  :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-800'"
                >
                  🎯 {{ selectedListing.focusType || 'N/A' }}
                </div>
              </div>
              <div class="space-y-1">
                <div class="font-semibold">KVK Season</div>
                <div
                  :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-800'"
                >
                  📅 {{ selectedListing.kvkSeason || 'N/A' }}
                </div>
              </div>
              <div class="space-y-1">
                <div class="font-semibold">Universal Speedups (days)</div>
                <div
                  :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-800'"
                >
                  ⏱️ {{ selectedListing.universalSpeedupsDays || 'N/A' }}
                </div>
              </div>
              <div class="space-y-1">
                <div class="font-semibold">Passport Status</div>
                <div
                  :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-800'"
                >
                  🛂 Ready: {{ selectedListing.passportReady || 'N/A' }} | Needed: {{ selectedListing.passportNeeded || 'N/A' }}
                </div>
              </div>
              <div class="space-y-1">
                <div class="font-semibold">Ready To Migrate</div>
                <div
                  :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-800'"
                >
                  🚚 {{ selectedListing.readyToMigrate || 'N/A' }}
                </div>
              </div>
              <div class="space-y-1">
                <div class="font-semibold">First Purchase Receipt</div>
                <div
                  :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-800'"
                >
                  🧾 {{ selectedListing.firstPurchaseReceipt || 'N/A' }}
                </div>
              </div>
              <div class="space-y-1">
                <div class="font-semibold">VIP Support</div>
                <div
                  :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-800'"
                >
                  🛎️ {{ selectedListing.hasVipSupport || 'N/A' }}
                </div>
              </div>
              <div class="space-y-1">
                <div class="font-semibold">Equipment</div>
                <div
                  :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-800'"
                >
                  ⚙️ {{ selectedListing.equipment || 'N/A' }}
                </div>
              </div>
              <div class="space-y-1">
                <div class="font-semibold">Top Commanders</div>
                <div
                  :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-800'"
                >
                  🧑‍✈️ {{ selectedListing.topCommanders || 'N/A' }}
                </div>
              </div>
              <div class="space-y-1">
                <div class="font-semibold">Farm Accounts</div>
                <div
                  :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-800'"
                >
                  🌾 {{ selectedListing.farmAccounts || 'N/A' }}
                </div>
              </div>
            </template>
            <div class="space-y-1">
              <div class="font-semibold">Asking Price</div>
              <div 
                :class="[
                  'font-bold text-lg',
                  selectedListing.status === 'sold'
                    ? theme === 'dark' 
                      ? 'text-slate-500 line-through'
                      : 'text-slate-400 line-through'
                    : 'text-emerald-400'
                ]">
                ${{ selectedListing.askingPrice }}
              </div>
            </div>
            <div v-if="selectedListing.classesList.length" class="space-y-1">
              <div class="font-semibold">Class</div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="className in selectedListing.classesList"
                  :key="className"
                  :class="[
                    'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold',
                    theme === 'dark'
                      ? 'bg-slate-800 text-slate-200 border border-slate-700'
                      : 'bg-slate-100 text-slate-800 border border-slate-300',
                  ]"
                >
                  <span>{{ getClassIcon(className) }}</span>
                  <span>{{ className }}</span>
                </span>
              </div>
            </div>
          </div>

          <div class="mt-3 flex items-center gap-2 text-sm"
            :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'">
            <span>🆔</span>
            <span>Code ID: {{ selectedListing.id }}</span>
            <button
              type="button"
              @click="copyCodeId(selectedListing.id)"
              :class="[
                'rounded px-2 py-1 text-xs font-semibold',
                theme === 'dark' ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300',
              ]"
            >
              Copy
            </button>
            <span v-if="copiedId === String(selectedListing.id)" :class="theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700'">Copied</span>
          </div>

          <div
            v-if="selectedListing.images.length"
            class="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3"
          >
            <div
              v-for="(src, index) in selectedListing.images"
              :key="index"
              :class="[
                'overflow-hidden rounded-lg border cursor-zoom-in',
                theme === 'dark'
                  ? 'border-slate-700 bg-slate-900'
                  : 'border-slate-200 bg-slate-50',
              ]"
              @click="openImagePreview(src)"
            >
              <img :src="src" alt="Listing image" loading="lazy" decoding="async" class="h-32 w-full object-cover" />
            </div>
          </div>
          <div v-else class="mt-4 relative">
            <div
              :class="[
                'overflow-hidden rounded-lg border',
                theme === 'dark'
                  ? 'border-slate-700 bg-slate-900'
                  : 'border-slate-200 bg-slate-50',
              ]"
            >
              <img :src="selectedDefaultImage" alt="Default image" class="h-32 w-full object-cover" />
            </div>
            <div v-if="loadingSelectedListing" class="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
              <span class="animate-spin text-2xl mb-2">⏳</span>
              <span class="text-xs" :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">Loading images...</span>
            </div>
          </div>

          <div
            class="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <!-- Show middleman info if listing has middleman and user is not the middleman -->
            <div
              v-if="selectedListing.status !== 'sold' && selectedListing.middleman && !shouldShowSellerContact(selectedListing)"
              class="flex flex-col gap-2"
            >
              <div class="flex items-center gap-2 text-sm"
                :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'">
                <span>💼</span>
                <span class="font-semibold">{{ selectedListing.middleman.name }}</span>
              </div>
              <!-- <div class="flex items-center gap-2 text-sm"
                :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
                <span>📧</span>
                <span>{{ selectedListing.middleman.email }}</span>
              </div> -->
              <a
                v-if="selectedListing.middleman.link"
                :href="selectedListing.middleman.link"
                target="_blank"
                rel="noopener noreferrer"
                class="text-emerald-500 hover:text-emerald-400 underline text-sm"
              >
                {{ selectedListing.middleman.link }}
              </a>
            </div>
            <!-- Show seller contact info only if no middleman or user is the assigned middleman -->
            <div
              v-else-if="selectedListing.status !== 'sold' && shouldShowSellerContact(selectedListing)"
              class="flex flex-col gap-2"
            >
              <div class="flex items-center gap-2 text-sm"
                :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'">
                <span>📞</span>
                <span>{{ selectedListing.contactNumber }}</span>
              </div>
              <div v-if="selectedListing.contactLink" class="flex items-center gap-2 text-sm"
                :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
                <span>🔗</span>
                <a :href="selectedListing.contactLink" target="_blank" rel="noopener noreferrer"
                  class="text-emerald-500 hover:text-emerald-400 underline">
                  {{ selectedListing.contactLink }}
                </a>
              </div>
            </div>
            <div
              v-else-if="selectedListing.status === 'sold'"
              class="flex items-center gap-2 text-sm"
              :class="theme === 'dark' ? 'text-red-400' : 'text-red-600'"
            >
              <span>❌</span>
              <span>This account has been sold</span>
            </div>
            <!-- Contact buttons -->
            <a
              v-if="selectedListing.status !== 'sold' && selectedListing.middleman && !shouldShowSellerContact(selectedListing)"
              :href="selectedListing.middleman.link || `mailto:${selectedListing.middleman.email}`"
              target="_blank"
              rel="noopener noreferrer"
              :class="[
                'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold',
                'bg-blue-600 text-white hover:bg-blue-500',
              ]"
            >
              <span>💼</span>
              <span>Contact Middleman</span>
            </a>
            <a
              v-else-if="selectedListing.status !== 'sold' && shouldShowSellerContact(selectedListing) && selectedListing.contactLink"
              :href="selectedListing.contactLink"
              target="_blank"
              rel="noopener noreferrer"
              :class="[
                'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold',
                'bg-emerald-600 text-white hover:bg-emerald-500',
              ]"
            >
              <span>💬</span>
              <span>Contact Seller</span>
            </a>
            <div
              v-else-if="selectedListing.status !== 'sold' && shouldShowSellerContact(selectedListing) && !selectedListing.contactLink && selectedListing.contactNumber"
              class="text-sm"
              :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'"
            >
              Use contact number above to reach seller
            </div>
            <div
              v-else-if="selectedListing.status === 'sold'"
              :class="[
                'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold',
                theme === 'dark'
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed',
              ]"
            >
              <span>❌</span>
              <span>Sold</span>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="previewImage"
        class="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 bg-black/80"
      >
        <div
          class="absolute inset-0"
          @click="closeImagePreview"
        ></div>
        <div class="relative z-10 max-w-4xl max-h-[90vh]">
          <img
            :src="previewImage"
            alt="Preview image"
            class="max-h-[90vh] w-auto max-w-full rounded-xl shadow-2xl"
          />
          <button
            type="button"
            @click="closeImagePreview"
            :class="[
              'absolute -top-3 -right-3 rounded-full p-2 text-sm font-semibold shadow-lg',
              theme === 'dark'
                ? 'bg-slate-800 text-slate-100 hover:bg-slate-700'
                : 'bg-white text-slate-800 hover:bg-slate-100',
            ]"
          >
            ✕
          </button>
        </div>
      </div>

      <section
        v-if="activeTab === 'feedback'"
        class="space-y-6 max-w-3xl mx-auto"
      >
        <div class="text-center mb-4">
          <h2 class="text-3xl font-bold mb-2"
            :class="theme === 'dark' ? 'text-slate-100' : 'text-slate-900'">
            Feedback & Vouching
          </h2>
          <p class="text-sm"
            :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
            Share your experience with our middlemen and help us improve the website.
          </p>
        </div>

        <div v-if="feedbackError"
          :class="[
            'rounded-lg border p-3 text-sm flex items-center gap-2',
            theme === 'dark'
              ? 'border-red-500/50 bg-red-500/10 text-red-300'
              : 'border-red-300 bg-red-50 text-red-700',
          ]">
          <span>⚠️</span>
          <span>{{ feedbackError }}</span>
        </div>

        <div v-if="feedbackSuccess"
          :class="[
            'rounded-lg border p-3 text-sm flex items-center gap-2',
            theme === 'dark'
              ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
              : 'border-emerald-300 bg-emerald-50 text-emerald-700',
          ]">
          <span>✅</span>
          <span>{{ feedbackSuccess }}</span>
        </div>

        <div
          v-if="!currentUser"
          :class="[
            'rounded-lg border p-8 text-center',
            theme === 'dark'
              ? 'border-slate-700 bg-slate-900'
              : 'border-slate-200 bg-white',
          ]"
        >
          <div class="max-w-md mx-auto">
            <div class="text-5xl mb-4">🔐</div>
            <h2 class="text-2xl font-bold mb-2"
              :class="theme === 'dark' ? 'text-slate-100' : 'text-slate-900'">
              Login Required
            </h2>
            <p class="text-sm mb-6"
              :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
              You need to be logged in to submit feedback.
            </p>
            <button
              type="button"
              @click="setTab('auth')"
              :class="[
                'inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-base font-semibold text-white transition-all duration-300 ease-in-out',
                'bg-emerald-600 hover:bg-emerald-500 hover:scale-[1.02]',
              ]"
            >
              Login or Register
            </button>
          </div>
        </div>

        <div
          v-else
          class="grid grid-cols-1 gap-6 lg:grid-cols-2"
        >
          <form
            :class="[
              'space-y-4 rounded-lg p-6 shadow-lg transition-all duration-300 ease-in-out',
              theme === 'dark'
                ? 'bg-slate-900 border border-slate-700'
                : 'bg-white border border-slate-200',
            ]"
            @submit.prevent="submitMiddlemanFeedback"
          >
            <h3 class="text-lg font-bold mb-2"
              :class="theme === 'dark' ? 'text-slate-100' : 'text-slate-900'">
              Vouch for a Middleman
            </h3>
            <p class="text-xs mb-4"
              :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
              Rate your experience with an official middleman so other users know who they can trust.
            </p>

            <div class="space-y-2">
              <label class="flex items-center gap-2 text-sm font-semibold"
                :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
                <span>Middleman</span>
              </label>
              <select
                v-model="middlemanFeedback.middlemanId"
                required
                :disabled="loadingMiddlemen || !!middlemenError"
                :class="[
                  'w-full rounded-lg border px-4 py-3 text-sm transition-all duration-300 ease-in-out',
                  theme === 'dark'
                    ? 'border-slate-600 bg-slate-800 text-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    : 'border-slate-300 bg-white text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                ]"
              >
                <option value="" disabled>Select a middleman</option>
                <option
                  v-for="m in middlemen"
                  :key="m.id"
                  :value="m.id"
                >
                  {{ m.name }} ({{ m.email }})
                </option>
              </select>
              <p v-if="loadingMiddlemen" class="text-xs"
                :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-500'">
                Loading middlemen...
              </p>
              <p v-if="middlemenError" class="text-xs text-red-500">
                {{ middlemenError }}
              </p>
              <p v-if="!loadingMiddlemen && !middlemenError && !middlemen.length" class="text-xs"
                :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-500'">
                No middlemen are currently available.
              </p>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="space-y-2">
                <label class="flex items-center gap-2 text-sm font-semibold"
                  :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
                  <span>Rating</span>
                </label>
                <select
                  v-model.number="middlemanFeedback.rating"
                  required
                  :class="[
                    'w-full rounded-lg border px-4 py-3 text-sm transition-all duration-300 ease-in-out',
                    theme === 'dark'
                      ? 'border-slate-600 bg-slate-800 text-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      : 'border-slate-300 bg-white text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                  ]"
                >
                  <option v-for="n in 5" :key="n" :value="n">{{ n }} / 5</option>
                </select>
              </div>
            </div>

            <div class="space-y-2">
              <label class="flex items-center gap-2 text-sm font-semibold"
                :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
                <span>Comment</span>
              </label>
              <textarea
                v-model="middlemanFeedback.comment"
                rows="4"
                required
                placeholder="Share what went well or what could be improved."
                :class="[
                  'w-full rounded-lg border px-4 py-3 text-sm transition-all duration-300 ease-in-out',
                  theme === 'dark'
                    ? 'border-slate-600 bg-slate-800 text-slate-100 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                ]"
              ></textarea>
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="submittingMiddlemanFeedback || !middlemen.length"
                :class="[
                  'inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 ease-in-out',
                  'bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed',
                ]"
              >
                <span v-if="!submittingMiddlemanFeedback">Submit Vouch</span>
                <span v-else class="flex items-center gap-2">
                  <span class="animate-spin">⏳</span>
                  <span>Submitting...</span>
                </span>
              </button>
            </div>
          </form>

          <form
            :class="[
              'space-y-4 rounded-lg p-6 shadow-lg transition-all duration-300 ease-in-out',
              theme === 'dark'
                ? 'bg-slate-900 border border-slate-700'
                : 'bg-white border border-slate-200',
            ]"
            @submit.prevent="submitAppFeedback"
          >
            <h3 class="text-lg font-bold mb-2"
              :class="theme === 'dark' ? 'text-slate-100' : 'text-slate-900'">
              Website Feedback
            </h3>
            <p class="text-xs mb-4"
              :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
              Tell us what you like and what we can improve in PH Legends Marketplace.
            </p>

            <div class="space-y-2">
              <label class="flex items-center gap-2 text-sm font-semibold"
                :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
                <span>Overall Experience (optional)</span>
              </label>
              <select
                v-model.number="appFeedback.rating"
                :class="[
                  'w-full rounded-lg border px-4 py-3 text-sm transition-all duration-300 ease-in-out',
                  theme === 'dark'
                    ? 'border-slate-600 bg-slate-800 text-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    : 'border-slate-300 bg-white text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                ]"
              >
                <option :value="0">No rating</option>
                <option v-for="n in 5" :key="n" :value="n">{{ n }} / 5</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="flex items-center gap-2 text-sm font-semibold"
                :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
                <span>Your Feedback</span>
              </label>
              <textarea
                v-model="appFeedback.comment"
                rows="5"
                required
                placeholder="Share ideas, bugs you found, or anything that would make the site better."
                :class="[
                  'w-full rounded-lg border px-4 py-3 text-sm transition-all duration-300 ease-in-out',
                  theme === 'dark'
                    ? 'border-slate-600 bg-slate-800 text-slate-100 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                ]"
              ></textarea>
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="submittingAppFeedback"
                :class="[
                  'inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 ease-in-out',
                  'bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed',
                ]"
              >
                <span v-if="!submittingAppFeedback">Submit Feedback</span>
                <span v-else class="flex items-center gap-2">
                  <span class="animate-spin">⏳</span>
                  <span>Submitting...</span>
                </span>
              </button>
            </div>
          </form>
        </div>
      </section>

      <section
        v-if="activeTab === 'auth'"
        class="space-y-6 max-w-lg mx-auto"
      >
        <div class="text-center mb-8">
          <h2 class="text-4xl font-bold mb-3"
            :class="theme === 'dark' ? 'text-slate-100' : 'text-slate-900'">
            <!-- <span class="inline-block mr-3">🔐</span> -->
            <span>{{ currentUser ? 'Your Account' : 'Account Access' }}</span>
          </h2>
          <p class="text-sm mt-2"
            :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
            {{ currentUser ? 'Manage your account settings' : 'Login or create a new account to get started' }}
          </p>
        </div>
        <div v-if="currentUser">
          <!-- <div
            :class="[
              'rounded-lg border p-8 text-center transition-all duration-300 ease-in-out',
              theme === 'dark'
                ? 'border-emerald-500/50 bg-emerald-500/10'
                : 'border-emerald-300 bg-emerald-50',
            ]">
            <div class="text-5xl mb-4">✅</div>
            <p class="text-lg font-semibold mb-2"
              :class="theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700'">
              You're logged in!
            </p>
            <p class="text-sm mb-1"
              :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-800'">
              {{ currentUser.fullName || currentUser.email }}
            </p>
            <p class="text-xs mb-6"
              :class="theme === 'dark' ? 'text-slate-500' : 'text-slate-500'">
              {{ currentUser.email }}
            </p>
            <button
              type="button"
              @click="logout()"
              :class="[
                'rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-300 ease-in-out hover:scale-[1.02]',
                theme === 'dark'
                  ? 'bg-red-600 text-white hover:bg-red-500'
                  : 'bg-red-500 text-white hover:bg-red-600',
              ]"
            >
              Logout
            </button> 
          </div> -->

          <form
            :class="[
              'space-y-4 rounded-lg p-6 shadow-lg transition-all duration-300 ease-in-out',
              theme === 'dark'
                ? 'bg-slate-900 border border-slate-700'
                : 'bg-white border border-slate-200',
            ]"
            @submit.prevent="onUpdateProfile"
          >
            <h3 class="text-lg font-bold mb-2"
              :class="theme === 'dark' ? 'text-slate-100' : 'text-slate-900'">
              Profile Settings
            </h3>

            <div class="space-y-2">
              <label class="flex items-center gap-2 text-sm font-semibold"
                :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
                <!-- <span>👤</span> -->
                <span>Full Name</span>
              </label>
              <input
                v-model="profileForm.fullName"
                type="text"
                placeholder="Your full name"
                :class="[
                  'w-full rounded-lg border px-4 py-3 text-sm transition-all duration-300 ease-in-out',
                  theme === 'dark'
                    ? 'border-slate-600 bg-slate-800 text-slate-100 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                ]"
              />
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="space-y-2">
                <label class="flex items-center gap-2 text-sm font-semibold"
                  :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
                  <!-- <span>🔒</span> -->
                  <span>Current Password</span>
                </label>
                <input
                  v-model="profileForm.currentPassword"
                  type="password"
                  placeholder="Leave blank to keep password"
                  :class="[
                    'w-full rounded-lg border px-4 py-3 text-sm transition-all duration-300 ease-in-out',
                    theme === 'dark'
                      ? 'border-slate-600 bg-slate-800 text-slate-100 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                  ]"
                />
              </div>
              <div class="space-y-2">
                <label class="flex items-center gap-2 text-sm font-semibold"
                  :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
                  <!-- <span>✨</span> -->
                  <span>New Password</span>
                </label>
                <input
                  v-model="profileForm.newPassword"
                  type="password"
                  minlength="6"
                  placeholder="At least 6 characters"
                  :class="[
                    'w-full rounded-lg border px-4 py-3 text-sm transition-all duration-300 ease-in-out',
                    theme === 'dark'
                      ? 'border-slate-600 bg-slate-800 text-slate-100 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                  ]"
                />
              </div>
            </div>

            <div v-if="profileError"
              :class="[
                'rounded-lg border p-3 text-sm flex items-center gap-2',
                theme === 'dark'
                  ? 'border-red-500/50 bg-red-500/10 text-red-300'
                  : 'border-red-300 bg-red-50 text-red-700',
              ]">
              <span>⚠️</span>
              <span>{{ profileError }}</span>
            </div>

            <div v-if="profileMessage"
              :class="[
                'rounded-lg border p-3 text-sm flex items-center gap-2',
                theme === 'dark'
                  ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                  : 'border-emerald-300 bg-emerald-50 text-emerald-700',
              ]">
              <span>✅</span>
              <span>{{ profileMessage }}</span>
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="profileSaving"
                :class="[
                  'inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 ease-in-out',
                  'bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed',
                ]"
              >
                <span v-if="!profileSaving">Save Changes</span>
                <span v-else class="flex items-center gap-2">
                  <span class="animate-spin">⏳</span>
                  <span>Saving...</span>
                </span>
              </button>
            </div>
          </form>

          <!-- User's Listings Section -->
          <div class="mt-8">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold"
                :class="theme === 'dark' ? 'text-slate-100' : 'text-slate-900'">
                My Listings
              </h3>
              <button
                type="button"
                @click="loadUserListings"
                :class="[
                  'text-xs font-medium px-3 py-1.5 rounded-lg transition-colors',
                  theme === 'dark'
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                ]"
              >
                🔄 Refresh
              </button>
            </div>

            <div v-if="loadingUserListings" class="text-center py-12">
              <div class="inline-block animate-spin text-4xl mb-4">⏳</div>
              <p class="text-sm"
                :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
                Loading your listings...
              </p>
            </div>

            <div v-else-if="userListingsError"
              :class="[
                'rounded-lg border p-4 text-center',
                theme === 'dark'
                  ? 'border-red-500/50 bg-red-500/10 text-red-300'
                  : 'border-red-300 bg-red-50 text-red-700',
              ]">
              <p class="text-sm font-medium">⚠️ {{ userListingsError }}</p>
            </div>

            <div v-else-if="!userListings.length"
              :class="[
                'rounded-lg border p-12 text-center',
                theme === 'dark'
                  ? 'border-slate-700 bg-slate-800/50'
                  : 'border-slate-300 bg-white',
              ]">
              <span class="text-5xl mb-4 block">📭</span>
              <p class="text-sm font-medium mb-4"
                :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
                You haven't posted any listings yet.
              </p>
              <button
                type="button"
                @click="setTab('post')"
                :class="[
                  'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all duration-300',
                  'bg-emerald-600 hover:bg-emerald-500',
                ]">
                <span>➕</span>
                <span>Post Your First Listing</span>
              </button>
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="item in userListings"
                :key="item.id"
                :class="[
                  'group relative rounded-xl border overflow-hidden transition-all duration-300 ease-in-out cursor-pointer hover:scale-[1.02] hover:shadow-xl',
                  theme === 'dark'
                    ? 'border-slate-700/50 bg-slate-800/60 hover:border-emerald-500/50'
                    : 'border-slate-200 bg-white hover:border-emerald-500/50',
                ]"
              >
                <!-- Status Badge -->
                <div class="absolute top-3 right-3 z-10">
                  <span 
                    class="text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
                    :class="{
                      'bg-amber-600 text-white': item.status === 'pending',
                      'bg-emerald-600 text-white': item.status === 'approved',
                      'bg-red-600 text-white': item.status === 'rejected' || item.status === 'sold',
                    }">
                    {{ item.status === 'pending' ? 'PENDING' : item.status === 'approved' ? 'APPROVED' : item.status === 'rejected' ? 'REJECTED' : 'SOLD' }}
                  </span>
                </div>

                <!-- Image -->
                <div
                  v-if="item.images.length"
                  class="relative h-40 overflow-hidden bg-gradient-to-br"
                  :class="theme === 'dark' 
                    ? 'from-slate-800 to-slate-900' 
                    : 'from-slate-100 to-slate-200'">
                  <img 
                    :src="item.images[0]" 
                    :alt="item.nickname"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                </div>
                <div
                  v-else
                  class="relative h-40 overflow-hidden bg-gradient-to-br"
                  :class="theme === 'dark' 
                    ? 'from-slate-800 to-slate-900' 
                    : 'from-slate-100 to-slate-200'">
                  <img 
                    :src="item.game === 'rok' ? rokDefaultImg : ymirDefaultImg" 
                    :alt="item.game === 'rok' ? 'Rise of Kingdoms' : 'Legends of Ymir'"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                </div>

                <!-- Card Content -->
                <div class="p-4" @click="openListingModal(item)">
                  <h4 class="text-lg font-bold mb-2 line-clamp-1"
                    :class="theme === 'dark' ? 'text-slate-100' : 'text-slate-900'">
                    {{ item.nickname }}
                  </h4>
                  <div class="flex items-center gap-2 text-xs mb-3"
                    :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
                    <span>🌐 {{ item.server }}</span>
                    <span>•</span>
                    <span>⚡ {{ item.growthPower }} GP</span>
                  </div>
                  <div class="flex items-baseline justify-between pt-3 border-t"
                    :class="theme === 'dark' ? 'border-slate-700' : 'border-slate-200'">
                    <span class="text-xs font-medium"
                      :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
                      Price
                    </span>
                    <span 
                      class="text-xl font-bold"
                      :class="theme === 'dark' 
                        ? 'bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent'">
                      ${{ item.askingPrice }}
                    </span>
                  </div>
                  <div class="mt-2 text-xs"
                    :class="theme === 'dark' ? 'text-slate-500' : 'text-slate-500'">
                    🕒 {{ new Date(item.createdAt).toLocaleDateString() }}
                  </div>
                </div>

                <!-- Owner actions -->
                <div class="px-4 pb-4 pt-2 border-t"
                  :class="theme === 'dark' ? 'border-slate-700/70 bg-slate-900/40' : 'border-slate-200 bg-slate-50'">
                  <div class="flex items-center justify-between gap-3">
                    <button
                      v-if="item.status !== 'sold'"
                      type="button"
                      @click.stop="markOwnedListingAsSold(String(item.id))"
                      :class="[
                        'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-white transition-all duration-300 ease-in-out',
                        'bg-blue-600 hover:bg-blue-500'
                      ]"
                    >
                      <span>💰</span>
                      <span>Mark as Sold</span>
                    </button>
                    <span
                      v-else
                      class="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold"
                      :class="theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'"
                    >
                      <span>✅</span>
                      <span>Marked as Sold</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="flex gap-3 justify-center mb-8">
          <button
            type="button"
            @click="authMode = 'login'"
            :class="[
              'rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-300 ease-in-out',
              authMode === 'login'
                ? 'bg-emerald-600 text-white shadow-md'
                : theme === 'dark'
                  ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300',
            ]"
          >
            Login
          </button>
          <button
            type="button"
            @click="authMode = 'register'"
            :class="[
              'rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-300 ease-in-out',
              authMode === 'register'
                ? 'bg-emerald-600 text-white shadow-md'
                : theme === 'dark'
                  ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300',
            ]"
          >
            Register
          </button>
        </div>

        <div v-if="authError"
          :class="[
              'rounded-lg border p-4 transition-all duration-300 ease-in-out',
            theme === 'dark'
              ? 'border-red-500/50 bg-red-500/10 text-red-300'
              : 'border-red-300 bg-red-50 text-red-700',
          ]">
          <p class="text-sm font-medium flex items-center gap-2">
            <span>⚠️</span>
            <span>{{ authError }}</span>
          </p>
        </div>

        <div v-if="authSuccess"
          :class="[
              'rounded-lg border p-4 transition-all duration-300 ease-in-out',
            theme === 'dark'
              ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
              : 'border-emerald-300 bg-emerald-50 text-emerald-700',
          ]">
          <p class="text-sm font-medium flex items-center gap-2">
            <span>✅</span>
            <span>{{ authSuccess }}</span>
          </p>
        </div>

        <form
          v-if="!currentUser && authMode === 'register'"
          :class="[
            'space-y-6 rounded-lg p-8 shadow-lg transition-all duration-300 ease-in-out',
            theme === 'dark'
              ? 'bg-slate-800 border border-slate-700'
              : 'bg-slate-100 border border-slate-300',
          ]"
          @submit.prevent="onRegister"
        >
          <h3 class="text-xl font-bold text-center mb-6"
            :class="theme === 'dark' ? 'text-slate-100' : 'text-slate-900'">
            Create New Account
          </h3>
          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm font-semibold"
              :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
              <span>👤</span>
              <span>Full Name</span>
            </label>
            <input
              v-model="registerForm.fullName"
              type="text"
              required
              placeholder="Your full name"
              :class="[
                'w-full rounded-lg border px-4 py-3 text-sm transition-all duration-300 ease-in-out',
                theme === 'dark'
                  ? 'border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
              ]"
            />
          </div>
          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm font-semibold"
              :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
              <span>📧</span>
              <span>Email Address</span>
            </label>
            <input
              v-model="registerForm.email"
              type="email"
              required
              placeholder="your.email@example.com"
              :class="[
                'w-full rounded-lg border px-4 py-3 text-sm transition-all duration-300 ease-in-out',
                theme === 'dark'
                  ? 'border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
              ]"
            />
          </div>
          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm font-semibold"
              :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
              <span>🔒</span>
              <span>Password</span>
            </label>
            <input
              v-model="registerForm.password"
              type="password"
              required
              minlength="6"
              placeholder="At least 6 characters"
              :class="[
                'w-full rounded-lg border px-4 py-3 text-sm transition-all duration-300 ease-in-out',
                theme === 'dark'
                  ? 'border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
              ]"
            />
          </div>
          <button
            type="submit"
            :class="[
              'w-full rounded-lg px-6 py-4 text-base font-bold text-white shadow-md transition-all duration-300 ease-in-out hover:scale-[1.02] active:scale-[0.98]',
              'bg-emerald-600 hover:bg-emerald-500',
            ]"
          >
            Create Account
          </button>
        </form>

        <form
          v-if="!currentUser && authMode === 'login'"
          :class="[
            'space-y-6 rounded-lg p-8 shadow-lg transition-all duration-300 ease-in-out',
            theme === 'dark'
              ? 'bg-slate-800 border border-slate-700'
              : 'bg-slate-100 border border-slate-300',
          ]"
          @submit.prevent="onLogin"
        >
          <h3 class="text-xl font-bold text-center mb-6"
            :class="theme === 'dark' ? 'text-slate-100' : 'text-slate-900'">
            Welcome Back!
          </h3>
          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm font-semibold"
              :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
              <span>📧</span>
              <span>Email Address</span>
            </label>
            <input
              v-model="loginForm.email"
              type="email"
              required
              placeholder="your.email@example.com"
              :class="[
                'w-full rounded-lg border px-4 py-3 text-sm transition-all duration-300 ease-in-out',
                theme === 'dark'
                  ? 'border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
              ]"
            />
          </div>
          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm font-semibold"
              :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
              <span>🔒</span>
              <span>Password</span>
            </label>
            <input
              v-model="loginForm.password"
              type="password"
              required
              minlength="6"
              placeholder="Enter your password"
              :class="[
                'w-full rounded-lg border px-4 py-3 text-sm transition-all duration-300 ease-in-out',
                theme === 'dark'
                  ? 'border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
              ]"
            />
          </div>
          <button
            type="submit"
            :class="[
              'w-full rounded-lg px-6 py-4 text-base font-bold text-white shadow-md transition-all duration-300 ease-in-out hover:scale-[1.02] active:scale-[0.98]',
              'bg-emerald-600 hover:bg-emerald-500',
            ]"
          >
            Login
          </button>
        </form>
      </section>

      <!-- Admin Panel -->
      <section
        v-if="activeTab === 'admin' && currentUser?.isAdmin"
        class="space-y-6"
      >
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h2 class="text-3xl font-bold mb-2"
              :class="theme === 'dark' ? 'text-slate-100' : 'text-slate-900'">
              Admin Panel
            </h2>
            <p class="text-sm"
              :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
              Review and approve pending listings, mark approved listings as sold
            </p>
          </div>
          <div class="flex items-center gap-2">
            <!-- <button
              type="button"
              @click="adminGame = 'ymir'"
              :class="[
                'rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-300 ease-in-out',
                adminGame === 'ymir'
                  ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                  : theme === 'dark'
                    ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200',
              ]"
            >
              Legend of Ymir
            </button> -->
            <button
              type="button"
              @click="adminGame = 'rok'"
              :class="[
                'rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-300 ease-in-out',
                adminGame === 'rok'
                  ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                  : theme === 'dark'
                    ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200',
              ]"
            >
              Rise of Kingdoms
            </button>
          </div>
        </div>

        <div
          v-if="!currentUser?.isAdmin"
          :class="[
            'rounded-lg border p-12 text-center transition-all duration-300 ease-in-out',
            theme === 'dark'
              ? 'border-red-500/50 bg-red-500/10 text-red-300'
              : 'border-red-300 bg-red-50 text-red-700',
          ]"
        >
          <div class="text-5xl mb-4">🔒</div>
          <p class="text-sm font-medium">
            Admin access required. You don't have permission to view this page.
          </p>
        </div>

        <div v-if="loadingPendingListings" class="text-center py-12">
          <div class="inline-block animate-spin text-4xl mb-4">⏳</div>
          <p class="text-sm"
            :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
            Loading pending listings...
          </p>
        </div>

        <div v-if="pendingListingsError"
          :class="[
            'rounded-lg border p-6 text-center transition-all duration-300 ease-in-out',
            theme === 'dark'
              ? 'border-red-500/50 bg-red-500/10 text-red-300'
              : 'border-red-300 bg-red-50 text-red-700',
          ]">
          <p class="text-sm font-medium">⚠️ {{ pendingListingsError }}</p>
        </div>

        <div
          v-if="currentUser?.isAdmin && !loadingPendingListings && !pendingListingsError && !pendingListings.length"
          :class="[
            'rounded-lg border p-12 text-center transition-all duration-300 ease-in-out',
            theme === 'dark'
              ? 'border-slate-700 bg-slate-800/50'
              : 'border-slate-300 bg-white',
          ]"
        >
          <span class="text-5xl mb-4 block">✅</span>
          <p class="text-sm font-medium"
            :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
            No pending listings. All caught up!
          </p>
        </div>

        <div v-if="adminGame === 'ymir'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="item in pendingListings"
            :key="item.id"
            :class="[
              'group rounded-lg border p-6 transition-all duration-300 ease-in-out',
              theme === 'dark'
                ? 'border-amber-700 bg-slate-800/70'
                : 'border-amber-300 bg-white',
            ]"
          >
            <div class="flex items-start justify-between gap-3 mb-4">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-xs font-semibold px-2 py-1 rounded"
                    :class="theme === 'dark' 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-amber-100 text-amber-700 border border-amber-200'">
                    PENDING
                  </span>
                </div>
                <h3 class="text-xl font-bold mb-1"
                  :class="theme === 'dark' ? 'text-slate-100' : 'text-slate-900'">
                  {{ item.nickname }}
                </h3>
                <div class="flex items-center gap-2 text-xs"
                  :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
                  <span>🌐 {{ item.server }}</span>
                  <span>•</span>
                  <span>⚡ GP: {{ item.growthPower }}</span>
                </div>
              </div>
              <div class="rounded-lg px-4 py-2 font-bold text-lg transition-all duration-300 ease-in-out"
                :class="theme === 'dark' 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-emerald-100 text-emerald-700 border border-emerald-200'">
                ${{ item.askingPrice }}
              </div>
            </div>

            <div v-if="item.classesList.length" class="flex flex-wrap gap-2 mb-4">
              <span
                v-for="className in item.classesList"
                :key="className"
                :class="[
                  'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold',
                  theme === 'dark'
                    ? 'bg-slate-700/50 text-slate-300 border border-slate-600'
                    : 'bg-slate-100 text-slate-700 border border-slate-300',
                ]"
              >
                <span>{{ getClassIcon(className) }}</span>
                <span>{{ className }}</span>
              </span>
            </div>

            <div
              v-if="item.images.length"
              class="mb-4 grid grid-cols-3 gap-2"
            >
              <div
                v-for="(src, index) in item.images.slice(0, 3)"
                :key="index"
                :class="[
                  'overflow-hidden rounded-lg border transition-all duration-300 ease-in-out',
                  theme === 'dark'
                    ? 'border-slate-700 bg-slate-900/50'
                    : 'border-slate-300 bg-slate-100',
                ]"
              >
                <img :src="src" alt="Listing image" class="h-20 w-full object-cover" />
              </div>
            </div>

            <div class="space-y-3 pt-4 border-t"
              :class="theme === 'dark' ? 'border-slate-700' : 'border-slate-200'">
              <div class="flex items-center gap-2 text-xs"
                :class="theme === 'dark' ? 'text-slate-500' : 'text-slate-500'">
                <span>🕒</span>
                <span>Posted {{ new Date(item.createdAt).toLocaleDateString() }}</span>
              </div>
              <div class="flex items-center gap-2 text-xs px-2"
                :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
                <span>📞</span>
                <span>{{ item.contactNumber }}</span>
              </div>
              <div class="flex gap-2">
                <button
                  type="button"
                  @click="approveListing(item.id)"
                  :class="[
                    'flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all duration-300 ease-in-out',
                    'bg-emerald-600 hover:bg-emerald-500',
                  ]"
                >
                  <span>✅</span>
                  <span>Approve</span>
                </button>
                <button
                  type="button"
                  @click="rejectListing(item.id)"
                  :class="[
                    'flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all duration-300 ease-in-out',
                    'bg-red-600 hover:bg-red-500',
                  ]"
                >
                  <span>❌</span>
                  <span>Reject</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="adminGame === 'rok'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="item in pendingRokListings"
            :key="item.id"
            :class="[
              'group rounded-lg border p-6 transition-all duration-300 ease-in-out cursor-pointer',
              theme === 'dark'
                ? 'border-amber-700 bg-slate-800/70'
                : 'border-amber-300 bg-white',
            ]"
            @click="openListingModal(convertRokToListing(item))"
          >
            <div class="flex items-start justify-between gap-3 mb-4">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-xs font-semibold px-2 py-1 rounded"
                    :class="theme === 'dark' 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-amber-100 text-amber-700 border border-amber-200'">
                    PENDING
                  </span>
                </div>
                <h3 class="text-xl font-bold mb-1"
                  :class="theme === 'dark' ? 'text-slate-100' : 'text-slate-900'">
                  Rise of Kingdoms Listing
                </h3>
                <div class="flex flex-wrap items-center gap-2 text-xs"
                  :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
                  <span>⚔ Focus: {{ item.focusType || 'N/A' }}</span>
                  <span>•</span>
                  <span>⭐ VIP: {{ item.vipLevel || 'N/A' }}</span>
                  <span>•</span>
                  <span>🏹 Power: {{ item.currentPower || 'N/A' }}</span>
                  <span>•</span>
                  <span>🪖 Troops: {{ item.troopCount || 'N/A' }}</span>
                </div>
              </div>
              <div class="rounded-lg px-4 py-2 font-bold text-lg transition-all duration-300 ease-in-out"
                :class="theme === 'dark' 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-emerald-100 text-emerald-700 border border-emerald-200'">
                ${{ item.askingPrice }}
              </div>
            </div>

            <div v-if="item.images.length" class="mb-4 grid grid-cols-3 gap-2">
              <div
                v-for="(src, index) in item.images.slice(0, 3)"
                :key="index"
                :class="[
                  'overflow-hidden rounded-lg border transition-all duration-300 ease-in-out',
                  theme === 'dark'
                    ? 'border-slate-700 bg-slate-900/50'
                    : 'border-slate-300 bg-slate-100',
                ]"
              >
                <img :src="src" alt="Listing image" class="h-20 w-full object-cover" />
              </div>
            </div>

            <div class="space-y-3 pt-4 border-t"
              :class="theme === 'dark' ? 'border-slate-700' : 'border-slate-200'">
              <div class="flex items-center gap-2 text-xs"
                :class="theme === 'dark' ? 'text-slate-500' : 'text-slate-500'">
                <span>🕒</span>
                <span>Posted {{ new Date(item.createdAt).toLocaleDateString() }}</span>
              </div>
              <div class="flex items-center gap-2 text-xs px-2"
                :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
                <span>📞</span>
                <span>{{ item.contactNumber }}</span>
              </div>
              <div class="flex gap-2">
                <button
                  type="button"
                  @click="approveRokListing(item.id)"
                  :class="[
                    'flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all duration-300 ease-in-out',
                    'bg-emerald-600 hover:bg-emerald-500',
                  ]"
                >
                  <span>✅</span>
                  <span>Approve</span>
                </button>
                <button
                  type="button"
                  @click="rejectRokListing(item.id)"
                  :class="[
                    'flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all duration-300 ease-in-out',
                    'bg-red-600 hover:bg-red-500',
                  ]"
                >
                  <span>❌</span>
                  <span>Reject</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Approved Listings Section -->
        <div v-if="currentUser?.isAdmin && adminGame === 'ymir'" class="mt-12">
          <h3 class="text-2xl font-bold mb-4"
            :class="theme === 'dark' ? 'text-slate-100' : 'text-slate-900'">
            Approved Listings
          </h3>
          
          <div v-if="loadingApprovedListings" class="text-center py-8">
            <div class="inline-block animate-spin text-3xl mb-2">⏳</div>
            <p class="text-xs"
              :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
              Loading approved listings...
            </p>
          </div>

          <div v-if="approvedListingsError"
            :class="[
              'rounded-lg border p-4 text-center transition-all duration-300 ease-in-out mb-6',
              theme === 'dark'
                ? 'border-red-500/50 bg-red-500/10 text-red-300'
                : 'border-red-300 bg-red-50 text-red-700',
            ]">
            <p class="text-xs font-medium">⚠️ {{ approvedListingsError }}</p>
          </div>

          <div
            v-if="!loadingApprovedListings && !approvedListingsError && !approvedListings.length"
            :class="[
              'rounded-lg border p-8 text-center transition-all duration-300 ease-in-out',
              theme === 'dark'
                ? 'border-slate-700 bg-slate-800/50'
                : 'border-slate-300 bg-white',
            ]"
          >
            <span class="text-4xl mb-3 block">📋</span>
            <p class="text-xs font-medium"
              :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
              No approved listings available.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="item in approvedListings"
              :key="item.id"
              :class="[
                'group rounded-lg border p-6 transition-all duration-300 ease-in-out',
                theme === 'dark'
                  ? 'border-emerald-700 bg-slate-800/70'
                  : 'border-emerald-300 bg-white',
              ]"
            >
              <div class="flex items-start justify-between gap-3 mb-4">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-xs font-semibold px-2 py-1 rounded"
                      :class="theme === 'dark' 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-emerald-100 text-emerald-700 border border-emerald-200'">
                      APPROVED
                    </span>
                  </div>
                  <h3 class="text-xl font-bold mb-1"
                    :class="theme === 'dark' ? 'text-slate-100' : 'text-slate-900'">
                    {{ item.nickname }}
                  </h3>
                  <div class="flex items-center gap-2 text-xs"
                    :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
                    <span>🌐 {{ item.server }}</span>
                    <span>•</span>
                    <span>⚡ GP: {{ item.growthPower }}</span>
                  </div>
                </div>
                <div class="rounded-lg px-4 py-2 font-bold text-lg transition-all duration-300 ease-in-out"
                  :class="theme === 'dark' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-emerald-100 text-emerald-700 border border-emerald-200'">
                  ${{ item.askingPrice }}
                </div>
              </div>

              <div v-if="item.classesList.length" class="flex flex-wrap gap-2 mb-4">
                <span
                  v-for="className in item.classesList"
                  :key="className"
                  :class="[
                    'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold',
                    theme === 'dark'
                      ? 'bg-slate-700/50 text-slate-300 border border-slate-600'
                      : 'bg-slate-100 text-slate-700 border border-slate-300',
                  ]"
                >
                  <span>{{ getClassIcon(className) }}</span>
                  <span>{{ className }}</span>
                </span>
              </div>

              <div
                v-if="item.images.length"
                class="mb-4 grid grid-cols-3 gap-2"
              >
                <div
                  v-for="(src, index) in item.images.slice(0, 3)"
                  :key="index"
                  :class="[
                    'overflow-hidden rounded-lg border transition-all duration-300 ease-in-out',
                    theme === 'dark'
                      ? 'border-slate-700 bg-slate-900/50'
                      : 'border-slate-300 bg-slate-100',
                  ]"
                >
                  <img :src="src" alt="Listing image" class="h-20 w-full object-cover" />
                </div>
              </div>

              <div class="space-y-3 pt-4 border-t"
                :class="theme === 'dark' ? 'border-slate-700' : 'border-slate-200'">
                <div class="flex items-center gap-2 text-xs"
                  :class="theme === 'dark' ? 'text-slate-500' : 'text-slate-500'">
                  <span>🕒</span>
                  <span>Posted {{ new Date(item.createdAt).toLocaleDateString() }}</span>
                </div>
                <div class="flex items-center gap-2 text-xs px-2"
                  :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
                  <span>📞</span>
                  <span>{{ item.contactNumber }}</span>
                </div>
                <button
                  type="button"
                  @click.stop="markAsSold(item.id)"
                  :class="[
                    'w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all duration-300 ease-in-out',
                    'bg-blue-600 hover:bg-blue-500',
                  ]"
                >
                  <span>💰</span>
                  <span>Mark as Sold</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="currentUser?.isAdmin && adminGame === 'rok'" class="mt-12">
          <h3 class="text-2xl font-bold mb-4"
            :class="theme === 'dark' ? 'text-slate-100' : 'text-slate-900'">
            Approved ROK Listings
          </h3>

          <div v-if="loadingApprovedRokListings" class="text-center py-8">
            <div class="inline-block animate-spin text-3xl mb-2">⏳</div>
            <p class="text-xs"
              :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
              Loading approved listings...
            </p>
          </div>

          <div v-if="approvedRokListingsError"
            :class="[
              'rounded-lg border p-4 text-center transition-all duration-300 ease-in-out mb-6',
              theme === 'dark'
                ? 'border-red-500/50 bg-red-500/10 text-red-300'
                : 'border-red-300 bg-red-50 text-red-700',
            ]">
            <p class="text-xs font-medium">⚠️ {{ approvedRokListingsError }}</p>
          </div>

          <div
            v-if="!loadingApprovedRokListings && !approvedRokListingsError && !approvedRokListings.length"
            :class="[
              'rounded-lg border p-8 text-center transition-all duration-300 ease-in-out',
              theme === 'dark'
                ? 'border-slate-700 bg-slate-800/50'
                : 'border-slate-300 bg-white',
            ]"
          >
            <span class="text-4xl mb-3 block">📋</span>
            <p class="text-xs font-medium"
              :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
              No approved listings available.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="item in approvedRokListings"
              :key="item.id"
              :class="[
                'group rounded-lg border p-6 transition-all duration-300 ease-in-out',
                theme === 'dark'
                  ? 'border-emerald-700 bg-slate-800/70'
                  : 'border-emerald-300 bg-white',
              ]"
            >
              <div class="flex items-start justify-between gap-3 mb-4">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-xs font-semibold px-2 py-1 rounded"
                      :class="theme === 'dark' 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-emerald-100 text-emerald-700 border border-emerald-200'">
                      APPROVED
                    </span>
                  </div>
                  <h3 class="text-xl font-bold mb-1"
                    :class="theme === 'dark' ? 'text-slate-100' : 'text-slate-900'">
                    Rise of Kingdoms Listing
                  </h3>
                  <div class="flex flex-wrap items-center gap-2 text-xs"
                    :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
                    <span>⚔ Focus: {{ item.focusType || 'N/A' }}</span>
                    <span>•</span>
                    <span>⭐ VIP: {{ item.vipLevel || 'N/A' }}</span>
                    <span>•</span>
                    <span>🏹 Power: {{ item.currentPower || 'N/A' }}</span>
                  </div>
                </div>
                <div class="rounded-lg px-4 py-2 font-bold text-lg transition-all duration-300 ease-in-out"
                  :class="theme === 'dark' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-emerald-100 text-emerald-700 border border-emerald-200'">
                  ${{ item.askingPrice }}
                </div>
              </div>

              <div v-if="item.images.length" class="mb-4 grid grid-cols-3 gap-2">
                <div
                  v-for="(src, index) in item.images.slice(0, 3)"
                  :key="index"
                  :class="[
                    'overflow-hidden rounded-lg border transition-all duration-300 ease-in-out',
                    theme === 'dark'
                      ? 'border-slate-700 bg-slate-900/50'
                      : 'border-slate-300 bg-slate-100',
                  ]"
                >
                  <img :src="src" alt="Listing image" class="h-20 w-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Middlemen Management Section -->
        <div class="mt-12">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div>
              <h3 class="text-2xl font-bold mb-2"
                :class="theme === 'dark' ? 'text-slate-100' : 'text-slate-900'">
                Middlemen Management
              </h3>
              <p class="text-sm"
                :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
                Add or remove middlemen that users can select when posting listings
              </p>
            </div>
          </div>

          <!-- Add Middleman Form -->
          <div
            :class="[
              'rounded-lg border p-6 mb-6 transition-all duration-300 ease-in-out',
              theme === 'dark'
                ? 'border-slate-700 bg-slate-800/50'
                : 'border-slate-300 bg-white',
            ]"
          >
            <h4 class="text-lg font-semibold mb-4"
              :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-800'">
              Add New Middleman
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium mb-2"
                  :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'">
                  Name *
                </label>
                <input
                  v-model="newMiddleman.name"
                  type="text"
                  placeholder="Middleman Name"
                  :class="[
                    'w-full rounded-lg border px-4 py-2 text-sm transition-all duration-300 ease-in-out',
                    theme === 'dark'
                      ? 'border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                  ]"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-2"
                  :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'">
                  Email *
                </label>
                <input
                  v-model="newMiddleman.email"
                  type="email"
                  placeholder="middleman@example.com"
                  :class="[
                    'w-full rounded-lg border px-4 py-2 text-sm transition-all duration-300 ease-in-out',
                    theme === 'dark'
                      ? 'border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                  ]"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-2"
                  :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'">
                  Link (Optional)
                </label>
                <input
                  v-model="newMiddleman.link"
                  type="url"
                  placeholder="https://..."
                  :class="[
                    'w-full rounded-lg border px-4 py-2 text-sm transition-all duration-300 ease-in-out',
                    theme === 'dark'
                      ? 'border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                  ]"
                />
              </div>
            </div>
            <div class="flex items-center gap-4">
              <button
                type="button"
                @click="addMiddleman"
                :disabled="addingMiddleman"
                :class="[
                  'rounded-lg px-6 py-2 text-sm font-semibold text-white transition-all duration-300 ease-in-out',
                  'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                ]"
              >
                {{ addingMiddleman ? 'Adding...' : 'Add Middleman' }}
              </button>
              <p v-if="middlemanError" class="text-sm text-red-500">
                {{ middlemanError }}
              </p>
            </div>
          </div>

          <!-- Middlemen List -->
          <div
            v-if="loadingMiddlemen"
            class="text-center py-8"
            :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'"
          >
            Loading middlemen...
          </div>

          <div
            v-else-if="middlemenError"
            :class="[
              'rounded-lg border p-6 text-center transition-all duration-300 ease-in-out',
              theme === 'dark'
                ? 'border-red-500/50 bg-red-500/10 text-red-300'
                : 'border-red-300 bg-red-50 text-red-700',
            ]"
          >
            <p class="text-sm font-medium">⚠️ {{ middlemenError }}</p>
          </div>

          <div
            v-else-if="middlemen.length === 0"
            :class="[
              'rounded-lg border p-12 text-center transition-all duration-300 ease-in-out',
              theme === 'dark'
                ? 'border-slate-700 bg-slate-800/50'
                : 'border-slate-300 bg-white',
            ]"
          >
            <span class="text-5xl mb-4 block">👤</span>
            <p class="text-sm font-medium"
              :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
              No middlemen added yet. Add one above to get started.
            </p>
          </div>

          <div
            v-else
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <div
              v-for="middleman in middlemen"
              :key="middleman.id"
              :class="[
                'rounded-lg border p-4 transition-all duration-300 ease-in-out',
                theme === 'dark'
                  ? 'border-slate-700 bg-slate-800/50'
                  : 'border-slate-300 bg-white',
              ]"
            >
              <div class="flex items-start justify-between gap-3 mb-3">
                <div class="flex-1">
                  <h5 class="font-semibold mb-1"
                    :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-900'">
                    {{ middleman.name }}
                  </h5>
                  <p class="text-sm mb-1"
                    :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
                    📧 {{ middleman.email }}
                  </p>
                  <p v-if="middleman.link" class="text-sm"
                    :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
                    🔗 <a :href="middleman.link" target="_blank" rel="noopener noreferrer"
                      class="text-emerald-500 hover:text-emerald-400 underline">
                      {{ middleman.link }}
                    </a>
                  </p>
                </div>
                <button
                  type="button"
                  @click="deleteMiddleman(middleman.id)"
                  :class="[
                    'rounded-lg px-3 py-1 text-sm font-semibold transition-all duration-300 ease-in-out',
                    'bg-red-600 hover:bg-red-500 text-white',
                  ]"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, watch, computed, onUnmounted } from "vue";
import AdminDashboard from './components/AdminDashboard.vue'
import ymirDefaultImg from "./assets/img/LegendofYmir.png";
import rokDefaultImg from "./assets/img/riseofkingdom.png";

type ListingResponse = {
  id: number | string;
  createdAt: string;
  nickname: string;
  server?: string;
  growthPower?: string;
  classesList?: string[];
  askingPrice: string;
  contactLink?: string;
  contactNumber: string;
  images: string[];
  status?: 'pending' | 'approved' | 'rejected' | 'sold';
  approvedBy?: string;
  approvedAt?: string;
  middlemanId?: string;
  middleman?: {
    id: string;
    name: string;
    email: string;
    link?: string;
  };
  game?: 'ymir' | 'rok';
  vipLevel?: string;
  currentPower?: string;
  troopCount?: string;
  currentGoldHeads?: string;
  focusType?: string;
  kvkSeason?: string;
  universalSpeedupsDays?: string;
  equipment?: string;
  topCommanders?: string;
  farmAccounts?: string;
  passportReady?: string;
  passportNeeded?: string;
  readyToMigrate?: string;
  firstPurchaseReceipt?: string;
  hasVipSupport?: string;
};

const phonePattern = /^[0-9+()\-\s]{7,20}$/;

const classOptions = ["Archer", "Skald", "Volva", "Warlord", "Berserker"];

const theme = ref<"dark" | "light">("dark");
const CURRENT_USER_STORAGE_KEY = "phl_current_user";

const form = reactive({
  nickname: "",
  server: "",
  growthPower: "",
  askingPrice: "",
  contactLink: "",
  contactNumber: "",
  middlemanId: "",
});

const postingGame = ref<'ymir' | 'rok'>('rok');
const rokForm = reactive({
  askingPrice: "",
  middlemanId: "",
  passportReady: "",
  passportNeeded: "",
  readyToMigrate: "",
  focusType: "",
  vipLevel: "",
  currentGoldHeads: "",
  troopCount: "",
  currentPower: "",
  firstPurchaseReceipt: "",
  hasVipSupport: "",
  kvkSeason: "",
  universalSpeedupsDays: "",
  equipment: "",
  topCommanders: "",
  contactLink: "",
  contactNumber: "",
  farmAccounts: "",
});

const imagePreviews = ref<string[]>([]);
const imageFiles = ref<File[]>([]);
const rokImagePreviews = ref<string[]>([]);
const rokImageFiles = ref<File[]>([]);
const submittingRok = ref(false);
const rokError = ref("");
const submitting = ref(false);
const error = ref("");

const selectedClass = ref<string>("");

const submittedListing = ref<ListingResponse | null>(null);

const activeTab = ref<"post" | "listings" | "feedback" | "auth" | "admin">("listings");

const showLandingPage = ref(true);

const currentUser = ref<
  { id: number | string; email: string; fullName?: string; isAdmin?: boolean } | null
>(null);

const route = useRoute();
const reqUrl = useRequestURL();
const initialPath = reqUrl?.pathname || '/';
const isAdminRoute = computed(() => {
  const path = String(route?.path || initialPath || '');
  return path.startsWith('/admin');
});

watch(() => route.path, (newPath) => {
  if (newPath === '/' && activeTab.value === 'admin') {
    activeTab.value = 'listings';
  }
});


const listings = ref<ListingResponse[]>([]);
const loadingListings = ref(false);
const listingsError = ref("");

const LISTINGS_CACHE_KEY = "phl_listings_cache_v1";
const LISTINGS_CACHE_TTL_MS = 300000;
const getCachedListings = (game: string): ListingResponse[] | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LISTINGS_CACHE_KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    const entry = obj?.[game];
    if (!entry) return null;
    if (Date.now() - entry.ts > LISTINGS_CACHE_TTL_MS) return null;
    return entry.data as ListingResponse[];
  } catch {
    return null;
  }
};
const setCachedListings = (game: string, data: ListingResponse[]) => {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(LISTINGS_CACHE_KEY);
    const obj = raw ? JSON.parse(raw) : {};
    obj[game] = { ts: Date.now(), data };
    window.localStorage.setItem(LISTINGS_CACHE_KEY, JSON.stringify(obj));
  } catch {}
};

const detailCache = new Map<string, { ts: number; data: ListingResponse }>();

let listingsRequestCounter = 0;

const filters = reactive({
  game: "rok",
  codeId: "",
  server: "",
  className: "",
  minPrice: "",
  maxPrice: "",
  minGrowthPower: "",
  maxGrowthPower: "",
  soldStatus: "unsold",
  rokVipMin: "",
  rokVipMax: "",
  rokPowerMin: "",
  rokPowerMax: "",
  rokTroopMin: "",
  rokTroopMax: "",
  rokFocus: "",
  rokKvkSeason: "",
  rokPassportReady: "",
  rokPassportNeeded: "",
  rokReadyToMigrate: "",
  rokHasVipSupport: "",
  rokGoldHeadsMin: "",
  rokSpeedupsDaysMin: "",
  rokFarmAccountsMin: "",
  rokTopCommanders: "",
  rokEquipment: "",
});

const filtersExpanded = ref(false);
const hasMoreThanSixFilters = computed(() => filters.game === 'rok');

const showListingModal = ref(false);
const selectedListing = ref<ListingResponse | null>(null);

const previewImage = ref<string | null>(null);
const selectedDefaultImage = computed(() => rokDefaultImg);
const submittedDefaultImage = computed(() => rokDefaultImg);

const copiedId = ref<string | null>(null);
const copyCodeId = async (id: number | string) => {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(String(id));
      copiedId.value = String(id);
      setTimeout(() => {
        if (copiedId.value === String(id)) copiedId.value = null;
      }, 1500);
    }
  } catch {}
};

const authMode = ref<"login" | "register">("login");
const authError = ref("");
const authSuccess = ref("");
const registerForm = reactive({
  fullName: "",
  email: "",
  password: "",
});
const loginForm = reactive({
  email: "",
  password: "",
});
const profileForm = reactive({
  fullName: "",
  currentPassword: "",
  newPassword: "",
});
const profileSaving = ref(false);
const profileError = ref("");
const profileMessage = ref("");

// User's listings state
const userListings = ref<ListingResponse[]>([]);
const loadingUserListings = ref(false);
const userListingsError = ref("");

// Admin panel state
const adminGame = ref<'ymir' | 'rok'>('ymir');
const pendingListings = ref<ListingResponse[]>([]);
const approvedListings = ref<ListingResponse[]>([]);
const loadingPendingListings = ref(false);
const loadingApprovedListings = ref(false);
const pendingListingsError = ref("");
const approvedListingsError = ref("");

type RokListingResponse = {
  id: string;
  userId?: string;
  middlemanId?: string;
  middleman?: {
    id: string;
    name: string;
    email: string;
    link?: string;
  };
  askingPrice: string;
  passportReady?: string;
  passportNeeded?: string;
  readyToMigrate?: string;
  focusType?: string;
  vipLevel?: string;
  currentGoldHeads?: string;
  troopCount?: string;
  currentPower?: string;
  firstPurchaseReceipt?: string;
  hasVipSupport?: string;
  kvkSeason?: string;
  universalSpeedupsDays?: string;
  equipment?: string;
  topCommanders?: string;
  contactLink?: string;
  contactNumber: string;
  farmAccounts?: string;
  images: string[];
  status: 'pending' | 'approved' | 'rejected' | 'sold';
  createdAt: string;
};

const pendingRokListings = ref<RokListingResponse[]>([]);
const approvedRokListings = ref<RokListingResponse[]>([]);
const loadingPendingRokListings = ref(false);
const loadingApprovedRokListings = ref(false);
const pendingRokListingsError = ref("");
const approvedRokListingsError = ref("");

// Notifications state
type NotificationResponse = {
  id: string;
  userId: string;
  listingId?: string;
  type: 'pending_review' | 'approved' | 'rejected' | 'sold';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

const notifications = ref<NotificationResponse[]>([]);
const loadingNotifications = ref(false);
const showNotifications = ref(false);
const unreadNotificationsCount = computed(() => 
  notifications.value.filter(n => !n.isRead).length
);

const feedbackError = ref("");
const feedbackSuccess = ref("");

const middlemanFeedback = reactive({
  middlemanId: "",
  rating: 5,
  comment: "",
});

const appFeedback = reactive({
  rating: 0,
  comment: "",
});

const submittingMiddlemanFeedback = ref(false);
const submittingAppFeedback = ref(false);

// Check if current user is a middleman (by email match)
const isCurrentUserMiddleman = computed(() => {
  if (!currentUser.value) return false;
  return middlemen.value.some(m => m.email.toLowerCase() === currentUser.value?.email.toLowerCase());
});

// Check if current user is the middleman for a specific listing
const isMiddlemanForListing = (listing: ListingResponse) => {
  if (!currentUser.value || !listing.middleman) return false;
  return listing.middleman.email.toLowerCase() === currentUser.value.email.toLowerCase();
};

const shouldShowSellerContact = (listing: ListingResponse) => {
  if (currentUser.value?.isAdmin) return true;
  return !listing.middlemanId;
};

// Middlemen state
type MiddlemanResponse = {
  id: string;
  name: string;
  email: string;
  link?: string;
  createdAt: string;
};

type FeedbackResponse = {
  id: string;
  userId: string;
  middlemanId?: string;
  type: 'app' | 'middleman';
  rating?: number;
  comment: string;
  createdAt: string;
};

const middlemen = ref<MiddlemanResponse[]>([]);
const loadingMiddlemen = ref(false);
const middlemenError = ref("");

const landingFeedbackLoading = ref(false);
const landingFeedbackError = ref("");
const landingFeedback = ref<{ middleman: MiddlemanResponse; feedback: FeedbackResponse }[]>([]);

// Admin middlemen management state
const newMiddleman = reactive({
  name: "",
  email: "",
  link: "",
});
const addingMiddleman = ref(false);
const middlemanError = ref("");

// Close notifications dropdown when clicking outside
const handleClickOutsideNotifications = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest(".notification-container")) {
    showNotifications.value = false;
  }
};

const loadMiddlemen = async () => {
  loadingMiddlemen.value = true;
  middlemenError.value = "";

  try {
    const data = await $fetch<MiddlemanResponse[]>("/api/middlemen");
    middlemen.value = data;
  } catch (err: any) {
    const message =
      err?.data?.message ||
      err?.statusMessage ||
      err?.message ||
      "Failed to load middlemen.";
    middlemenError.value = message;
  } finally {
    loadingMiddlemen.value = false;
  }
};

const loadLandingFeedback = async () => {
  landingFeedbackLoading.value = true;
  landingFeedbackError.value = "";
  try {
    const ms = middlemen.value.slice(0, 3);
    if (!ms.length) {
      landingFeedback.value = [];
      return;
    }
    const results = await Promise.all(
      ms.map((m) => $fetch<FeedbackResponse[]>("/api/middlemen/feedback", { query: { middlemanId: m.id } }))
    );
    const items: { middleman: MiddlemanResponse; feedback: FeedbackResponse }[] = [];
    for (let i = 0; i < ms.length; i++) {
      const arr = results[i] || [];
      if (arr.length) items.push({ middleman: ms[i], feedback: arr[0] });
    }
    landingFeedback.value = items;
  } catch (err: any) {
    const message = err?.data?.message || err?.statusMessage || err?.message || "Failed to load feedback.";
    landingFeedbackError.value = message;
  } finally {
    landingFeedbackLoading.value = false;
  }
};

const addMiddleman = async () => {
  middlemanError.value = "";
  
  if (!newMiddleman.name || !newMiddleman.email) {
    middlemanError.value = "Name and email are required.";
    return;
  }

  const user = currentUser.value;
  if (!user || !user.isAdmin) {
    middlemanError.value = "Only admins can add middlemen.";
    return;
  }

  addingMiddleman.value = true;

  try {
    await $fetch("/api/admin/middlemen", {
      method: "POST",
      body: {
        userId: user.id,
        name: newMiddleman.name,
        email: newMiddleman.email,
        link: newMiddleman.link || undefined,
      },
    });

    // Reset form
    newMiddleman.name = "";
    newMiddleman.email = "";
    newMiddleman.link = "";

    // Reload middlemen
    await loadMiddlemen();
  } catch (err: any) {
    const message =
      err?.data?.message ||
      err?.statusMessage ||
      err?.message ||
      "Failed to add middleman.";
    middlemanError.value = message;
  } finally {
    addingMiddleman.value = false;
  }
};

const deleteMiddleman = async (middlemanId: string) => {
  const user = currentUser.value;
  if (!user || !user.isAdmin) {
    return;
  }

  if (!confirm("Are you sure you want to delete this middleman?")) {
    return;
  }

  try {
    await $fetch("/api/admin/middlemen/delete", {
      method: "POST",
      body: {
        userId: user.id,
        middlemanId,
      },
    });

    // Reload middlemen
    await loadMiddlemen();
  } catch (err: any) {
    const message =
      err?.data?.message ||
      err?.statusMessage ||
      err?.message ||
      "Failed to delete middleman.";
    alert(message);
  }
};

const submitMiddlemanFeedback = async () => {
  feedbackError.value = "";
  feedbackSuccess.value = "";

  const user = currentUser.value;
  if (!user) {
    feedbackError.value = "You must be logged in to submit feedback.";
    return;
  }

  if (!middlemanFeedback.middlemanId) {
    feedbackError.value = "Please select a middleman to vouch for.";
    return;
  }

  if (!middlemanFeedback.rating || middlemanFeedback.rating < 1 || middlemanFeedback.rating > 5) {
    feedbackError.value = "Please provide a rating between 1 and 5.";
    return;
  }

  if (!middlemanFeedback.comment.trim()) {
    feedbackError.value = "Please share a short comment about your experience.";
    return;
  }

  if (submittingMiddlemanFeedback.value) {
    return;
  }

  submittingMiddlemanFeedback.value = true;

  try {
    await $fetch("/api/feedback", {
      method: "POST",
      body: {
        userId: user.id,
        type: "middleman",
        middlemanId: middlemanFeedback.middlemanId,
        rating: middlemanFeedback.rating,
        comment: middlemanFeedback.comment.trim(),
      },
    });

    feedbackSuccess.value = "Thank you for vouching for this middleman!";
    middlemanFeedback.middlemanId = "";
    middlemanFeedback.rating = 5;
    middlemanFeedback.comment = "";
  } catch (err: any) {
    const message =
      err?.data?.message ||
      err?.statusMessage ||
      err?.message ||
      "Failed to submit feedback.";
    feedbackError.value = message;
  } finally {
    submittingMiddlemanFeedback.value = false;
  }
};

const submitAppFeedback = async () => {
  feedbackError.value = "";
  feedbackSuccess.value = "";

  const user = currentUser.value;
  if (!user) {
    feedbackError.value = "You must be logged in to submit feedback.";
    return;
  }

  if (!appFeedback.comment.trim()) {
    feedbackError.value = "Please share your feedback about the website.";
    return;
  }

  if (submittingAppFeedback.value) {
    return;
  }

  submittingAppFeedback.value = true;

  try {
    const body: any = {
      userId: user.id,
      type: "app",
      comment: appFeedback.comment.trim(),
    };

    if (appFeedback.rating && appFeedback.rating >= 1 && appFeedback.rating <= 5) {
      body.rating = appFeedback.rating;
    }

    await $fetch("/api/feedback", {
      method: "POST",
      body,
    });

    feedbackSuccess.value = "Thank you for helping us improve the website!";
    appFeedback.rating = 0;
    appFeedback.comment = "";
  } catch (err: any) {
    const message =
      err?.data?.message ||
      err?.statusMessage ||
      err?.message ||
      "Failed to submit feedback.";
    feedbackError.value = message;
  } finally {
    submittingAppFeedback.value = false;
  }
};

onMounted(() => {
  if (typeof window !== "undefined") {
    try {
      const storedTheme = window.localStorage.getItem("theme");
      if (storedTheme === "dark" || storedTheme === "light") {
        theme.value = storedTheme;
      }
      const storedUser = window.localStorage.getItem(CURRENT_USER_STORAGE_KEY);
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (
            parsed &&
            typeof parsed.email === "string"
          ) {
            currentUser.value = {
              id: parsed.id,
              email: parsed.email,
              fullName: parsed.fullName,
              isAdmin: parsed.isAdmin || false,
            };
          }
        } catch {
          // ignore
        }
      }

      showLandingPage.value = !currentUser.value;

      // Load listings on mount (marketplace is default view)
      const isReload = (() => {
        try {
          // Navigation Timing Level 2
          // @ts-ignore
          const nav = performance.getEntriesByType && performance.getEntriesByType('navigation');
          if (nav && nav[0] && (nav[0] as any).type === 'reload') return true;
          // Legacy fallback
          // @ts-ignore
          return performance && performance.navigation && performance.navigation.type === (performance.navigation as any).TYPE_RELOAD;
        } catch { return false; }
      })();
      loadListings(isReload);
      
      // Load middlemen for form selector
      loadMiddlemen().then(() => loadLandingFeedback());
      
      // Load notifications if user is logged in
      if (currentUser.value) {
        loadNotifications();
      }
      
      // Close notifications dropdown when clicking outside
      window.addEventListener("click", handleClickOutsideNotifications);
    } catch {
      // ignore
    }
  }
});

watch(
  theme,
  (value) => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("theme", value);
      } catch {
        // ignore
      }
    }
  },
  { immediate: false }
);

watch(
  () => filters.game,
  () => {
    if (activeTab.value === 'listings') {
      loadListings();
    }
  },
  { immediate: false }
);

const setTab = (tab: "post" | "listings" | "feedback" | "auth" | "admin") => {
  activeTab.value = tab;
  if (tab === "listings") {
    loadListings();
  }
  if (tab === "admin") {
    navigateTo('/admin');
  }
  if (tab === "auth" && currentUser.value) {
    profileForm.fullName = currentUser.value.fullName || "";
    profileForm.currentPassword = "";
    profileForm.newPassword = "";
    profileError.value = "";
    profileMessage.value = "";
    loadUserListings();
  }
};

const refreshListings = async () => {
  try { if (typeof window !== 'undefined') window.localStorage.removeItem(LISTINGS_CACHE_KEY) } catch {}
  await loadListings(true);
};

const goToGame = (game: 'rok') => {
  showLandingPage.value = false;
  filters.game = game;
  setTab('listings');
};

const showUserMenu = ref(false);

const logout = () => {
  currentUser.value = null;
  authMode.value = "login";
  notifications.value = [];
  showNotifications.value = false;
  showLandingPage.value = true;
  activeTab.value = "listings";
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    } catch {
      // ignore
    }
  }
};

const toggleTheme = () => {
  theme.value = theme.value === "dark" ? "light" : "dark";
};

const convertRokToListing = (item: RokListingResponse): ListingResponse => ({
  id: item.id,
  createdAt: item.createdAt,
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
  middlemanId: item.middlemanId,
  middleman: item.middleman,
  game: 'rok',
  vipLevel: item.vipLevel,
  currentPower: item.currentPower,
  troopCount: item.troopCount,
  currentGoldHeads: item.currentGoldHeads,
  focusType: item.focusType,
  kvkSeason: item.kvkSeason,
  universalSpeedupsDays: item.universalSpeedupsDays,
  equipment: item.equipment,
  topCommanders: item.topCommanders,
  farmAccounts: item.farmAccounts,
  passportReady: item.passportReady,
  passportNeeded: item.passportNeeded,
  readyToMigrate: item.readyToMigrate,
  firstPurchaseReceipt: item.firstPurchaseReceipt,
  hasVipSupport: item.hasVipSupport,
});

const loadingSelectedListing = ref(false);

const openListingModal = async (item: ListingResponse) => {
  if (!currentUser.value) {
    activeTab.value = "auth";
    authMode.value = "login";
    authError.value = "You must be logged in to view listing details.";
    return;
  }

  selectedListing.value = item;
  showListingModal.value = true;

  try {
    loadingSelectedListing.value = true;
    const game = item.game || 'ymir';
    const key = `${game}:${String(item.id)}`;
    const entry = detailCache.get(key);
    if (entry && Date.now() - entry.ts < 60 * 60 * 1000) {
      selectedListing.value = entry.data;
      return;
    }
    const detail = await $fetch<ListingResponse>(`/api/listing?id=${encodeURIComponent(String(item.id))}&game=${game}`);
    selectedListing.value = detail;
    detailCache.set(key, { ts: Date.now(), data: detail });
  } catch (err: any) {
  } finally {
    loadingSelectedListing.value = false;
  }
};

const closeListingModal = () => {
  showListingModal.value = false;
  selectedListing.value = null;
  previewImage.value = null;
};

const openImagePreview = (src: string) => {
  previewImage.value = src;
};

const closeImagePreview = () => {
  previewImage.value = null;
};

const handleImagesChange = (event: Event) => {
  const target = event.target as HTMLInputElement | null;
  const files = target?.files;
  if (!files) return;

  // Limit to 5 images total
  const maxImages = 5;
  const currentCount = imagePreviews.value.length;
  const remainingSlots = maxImages - currentCount;

  if (remainingSlots <= 0) {
    alert(`Maximum ${maxImages} images allowed. Please remove some images first.`);
    if (target) {
      target.value = "";
    }
    return;
  }

  imagePreviews.value.forEach((url) => URL.revokeObjectURL(url));

  const urls: string[] = [];
  const selectedFiles: File[] = [];

  // Validate file size (5MB max per image)
  const maxSizeMB = 5;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  Array.from(files).slice(0, remainingSlots).forEach((file) => {
    // Check file size
    if (file.size > maxSizeBytes) {
      alert(`Image "${file.name}" exceeds ${maxSizeMB}MB limit. Please choose a smaller image.`);
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert(`File "${file.name}" is not an image. Please select image files only.`);
      return;
    }

    urls.push(URL.createObjectURL(file));
    selectedFiles.push(file);
  });

  // Combine with existing images (up to max)
  imagePreviews.value = [...imagePreviews.value, ...urls].slice(0, maxImages);
  imageFiles.value = [...imageFiles.value, ...selectedFiles].slice(0, maxImages);

  if (target) {
    target.value = "";
  }
};

const removeImage = (index: number) => {
  const url = imagePreviews.value[index];
  if (url) {
    URL.revokeObjectURL(url);
  }
  imagePreviews.value.splice(index, 1);
  imageFiles.value.splice(index, 1);
};

const handleRokImagesChange = (event: Event) => {
  const target = event.target as HTMLInputElement | null;
  const files = target?.files;
  if (!files) return;

  const maxImages = 20;
  const currentCount = rokImagePreviews.value.length;
  const remainingSlots = maxImages - currentCount;

  if (remainingSlots <= 0) {
    alert(`Maximum ${maxImages} images allowed. Please remove some images first.`);
    if (target) {
      target.value = "";
    }
    return;
  }

  rokImagePreviews.value.forEach((url) => URL.revokeObjectURL(url));

  const urls: string[] = [];
  const selectedFiles: File[] = [];

  const maxSizeMB = 5;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  Array.from(files).slice(0, remainingSlots).forEach((file) => {
    if (file.size > maxSizeBytes) {
      alert(`Image "${file.name}" exceeds ${maxSizeMB}MB limit. Please choose a smaller image.`);
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert(`File "${file.name}" is not an image. Please select image files only.`);
      return;
    }
    urls.push(URL.createObjectURL(file));
    selectedFiles.push(file);
  });

  rokImagePreviews.value = [...rokImagePreviews.value, ...urls].slice(0, maxImages);
  rokImageFiles.value = [...rokImageFiles.value, ...selectedFiles].slice(0, maxImages);

  if (target) {
    target.value = "";
  }
};

const removeRokImage = (index: number) => {
  const url = rokImagePreviews.value[index];
  if (url) {
    URL.revokeObjectURL(url);
  }
  rokImagePreviews.value.splice(index, 1);
  rokImageFiles.value.splice(index, 1);
};

const getClassIcon = (className: string): string => {
  const icons: Record<string, string> = {
    Archer: "🏹",
    Skald: "🎵",
    Volva: "🔮",
    Warlord: "⚔️",
    Berserker: "⚔️",
  };
  return icons[className] || "⚔️";
};

const toNumber = (val: string | undefined): number => {
  if (!val) return NaN;
  const s = String(val).trim().toLowerCase();
  const m = s.match(/([0-9]+(?:\.[0-9]+)?)([mbk])?/);
  if (!m) {
    const digits = s.replace(/[^0-9.]/g, "");
    return digits ? parseFloat(digits) : NaN;
  }
  const num = parseFloat(m[1]);
  const suf = m[2];
  if (suf === 'b') return num * 1_000_000_000;
  if (suf === 'm') return num * 1_000_000;
  if (suf === 'k') return num * 1_000;
  return num;
};

const toBool = (val: string | undefined): boolean | null => {
  if (!val) return null;
  const s = String(val).trim().toLowerCase();
  if (["yes","y","true","1"].includes(s)) return true;
  if (["no","n","false","0"].includes(s)) return false;
  return null;
};

const filteredListings = computed(() => {
  return listings.value.filter((item) => {
    const idMatch = !filters.codeId || String(item.id).toLowerCase().includes(String(filters.codeId).trim().toLowerCase());
    const gameMatch = !filters.game || item.game === filters.game;
    const serverMatch =
      filters.game === 'rok' ||
      !filters.server ||
      item.server.toLowerCase().includes(filters.server.toLowerCase());

    const classMatch =
      filters.game === 'rok' ||
      !filters.className || item.classesList.includes(filters.className);

    const price = parseFloat(item.askingPrice);
    const minPrice = filters.minPrice ? parseFloat(filters.minPrice) : null;
    const maxPrice = filters.maxPrice ? parseFloat(filters.maxPrice) : null;
    const priceMatch =
      (!minPrice || (!Number.isNaN(price) && price >= minPrice)) &&
      (!maxPrice || (!Number.isNaN(price) && price <= maxPrice));

    const growthPower = parseFloat(item.growthPower);
    const minGrowthPower = filters.minGrowthPower
      ? parseFloat(filters.minGrowthPower)
      : null;
    const maxGrowthPower = filters.maxGrowthPower
      ? parseFloat(filters.maxGrowthPower)
      : null;
    const growthPowerMatch =
      filters.game === 'rok' ||
      ((!minGrowthPower ||
        (!Number.isNaN(growthPower) && growthPower >= minGrowthPower)) &&
      (!maxGrowthPower ||
        (!Number.isNaN(growthPower) && growthPower <= maxGrowthPower)));

    let rokMatch = true;
    if (filters.game === 'rok') {
      const vip = parseInt(item.vipLevel || "");
      const vipMin = filters.rokVipMin ? parseInt(filters.rokVipMin) : null;
      const vipMax = filters.rokVipMax ? parseInt(filters.rokVipMax) : null;
      const vipOk =
        (!vipMin || (!Number.isNaN(vip) && vip >= vipMin)) &&
        (!vipMax || (!Number.isNaN(vip) && vip <= vipMax));

      const power = toNumber(item.currentPower);
      const powerMin = filters.rokPowerMin ? parseFloat(filters.rokPowerMin) : null;
      const powerMax = filters.rokPowerMax ? parseFloat(filters.rokPowerMax) : null;
      const powerOk =
        (!powerMin || (!Number.isNaN(power) && power >= powerMin)) &&
        (!powerMax || (!Number.isNaN(power) && power <= powerMax));

      const troops = toNumber(item.troopCount);
      const troopMin = filters.rokTroopMin ? parseFloat(filters.rokTroopMin) : null;
      const troopMax = filters.rokTroopMax ? parseFloat(filters.rokTroopMax) : null;
      const troopOk =
        (!troopMin || (!Number.isNaN(troops) && troops >= troopMin)) &&
        (!troopMax || (!Number.isNaN(troops) && troops <= troopMax));

      const focusOk = !filters.rokFocus || (item.focusType || '').toLowerCase().includes(filters.rokFocus.toLowerCase());
      const kvkOk = !filters.rokKvkSeason || (item.kvkSeason || '').toLowerCase().includes(filters.rokKvkSeason.toLowerCase());

      const readyOk =
        !filters.rokReadyToMigrate ||
        toBool(item.readyToMigrate) === toBool(filters.rokReadyToMigrate);
      const passReadyOk =
        !filters.rokPassportReady ||
        toBool(item.passportReady) === toBool(filters.rokPassportReady);
      const passNeededOk =
        !filters.rokPassportNeeded ||
        toBool(item.passportNeeded) === toBool(filters.rokPassportNeeded);
      const vipSupportOk =
        !filters.rokHasVipSupport ||
        toBool(item.hasVipSupport) === toBool(filters.rokHasVipSupport);

      const goldHeads = toNumber(item.currentGoldHeads);
      const goldHeadsMin = filters.rokGoldHeadsMin ? parseFloat(filters.rokGoldHeadsMin) : null;
      const goldHeadsOk = !goldHeadsMin || (!Number.isNaN(goldHeads) && goldHeads >= goldHeadsMin);

      const speedups = toNumber(item.universalSpeedupsDays);
      const speedupsMin = filters.rokSpeedupsDaysMin ? parseFloat(filters.rokSpeedupsDaysMin) : null;
      const speedupsOk = !speedupsMin || (!Number.isNaN(speedups) && speedups >= speedupsMin);

      const farmAcc = toNumber(item.farmAccounts);
      const farmMin = filters.rokFarmAccountsMin ? parseFloat(filters.rokFarmAccountsMin) : null;
      const farmOk = !farmMin || (!Number.isNaN(farmAcc) && farmAcc >= farmMin);

      const topsOk = !filters.rokTopCommanders || (item.topCommanders || '').toLowerCase().includes(filters.rokTopCommanders.toLowerCase());
      const equipOk = !filters.rokEquipment || (item.equipment || '').toLowerCase().includes(filters.rokEquipment.toLowerCase());

      rokMatch = vipOk && powerOk && troopOk && focusOk && kvkOk && readyOk && passReadyOk && passNeededOk && vipSupportOk && goldHeadsOk && speedupsOk && farmOk && topsOk && equipOk;
    }

    const soldStatusMatch =
      !filters.soldStatus ||
      (filters.soldStatus === "sold" && item.status === "sold") ||
      (filters.soldStatus === "unsold" && item.status !== "sold");

    return idMatch && gameMatch && serverMatch && classMatch && priceMatch && growthPowerMatch && soldStatusMatch && rokMatch;
  });
});

const resetFilters = () => {
  filters.game = "";
  filters.codeId = "";
  filters.server = "";
  filters.className = "";
  filters.minPrice = "";
  filters.maxPrice = "";
  filters.minGrowthPower = "";
  filters.maxGrowthPower = "";
  filters.soldStatus = "unsold";
  filters.rokVipMin = "";
  filters.rokVipMax = "";
  filters.rokPowerMin = "";
  filters.rokPowerMax = "";
  filters.rokTroopMin = "";
  filters.rokTroopMax = "";
  filters.rokFocus = "";
  filters.rokKvkSeason = "";
  filters.rokPassportReady = "";
  filters.rokPassportNeeded = "";
  filters.rokReadyToMigrate = "";
  filters.rokHasVipSupport = "";
  filters.rokGoldHeadsMin = "";
  filters.rokSpeedupsDaysMin = "";
  filters.rokFarmAccountsMin = "";
  filters.rokTopCommanders = "";
  filters.rokEquipment = "";
};

watch(
  () => filters.game,
  () => {
    filtersExpanded.value = false;
  }
);

const loadListings = async (force = false) => {
  const reqId = ++listingsRequestCounter;
  const game = filters.game || 'all';
  const cached = getCachedListings(game);
  loadingListings.value = !cached;
  listingsError.value = "";

  try {
    if (cached && cached.length) {
      listings.value = cached;
    }
    const qsParts: string[] = [];
    if (filters.game) qsParts.push(`game=${filters.game}`);
    if (force) qsParts.push(`force=1`);
    const qs = qsParts.length ? `?${qsParts.join('&')}` : "";
    const data = await $fetch<ListingResponse[]>(`/api/listings${qs}`);
    if (reqId === listingsRequestCounter) {
      listings.value = data;
      setCachedListings(game, data);
    }
  } catch (err: any) {
    const message =
      err?.data?.message ||
      err?.statusMessage ||
      err?.message ||
      "Failed to load listings.";
    listingsError.value = message;
  } finally {
    loadingListings.value = false;
  }
};

const onSubmit = async () => {
  error.value = "";

  if (
    !form.nickname ||
    !form.server ||
    !form.growthPower ||
    !form.askingPrice ||
    !form.contactNumber ||
    !form.middlemanId
  ) {
    error.value = "Please fill in all required fields, including selecting a middleman.";
    return;
  }

  if (!phonePattern.test(form.contactNumber.trim())) {
    error.value = "Please enter a valid phone number.";
    return;
  }

  if (!selectedClass.value) {
    error.value = "Please select a class.";
    return;
  }

  const user = currentUser.value;
  if (!user) {
    error.value = "You must be logged in to post a listing.";
    return;
  }

  if (submitting.value) {
    return;
  }

  submitting.value = true;

  try {
    const formData = new FormData();
    formData.append("userId", String(user.id));
    formData.append("nickname", form.nickname);
    formData.append("server", form.server);
    formData.append("growthPower", form.growthPower);
    if (form.middlemanId) {
      formData.append("middlemanId", form.middlemanId);
    }
    const classesString = selectedClass.value;
    formData.append("classes", classesString);
    formData.append("askingPrice", form.askingPrice);
    formData.append("contactLink", form.contactLink);
    formData.append("contactNumber", form.contactNumber);

    imageFiles.value.forEach((file) => {
      formData.append("images", file);
    });

    const created = await $fetch<ListingResponse>("/api/listings", {
      method: "POST",
      body: formData,
    });

    submittedListing.value = created;
    
    // Clear form
    form.nickname = "";
    form.server = "";
    form.growthPower = "";
    form.askingPrice = "";
    form.contactLink = "";
    form.contactNumber = "";
    form.middlemanId = "";
    selectedClass.value = "";
    imagePreviews.value = [];
    imageFiles.value = [];
    
    // Reload notifications to show the pending review notification
    loadNotifications();
    
    // Reload user's listings if on profile page
    if (activeTab.value === "auth") {
      loadUserListings();
    }
    
    // Redirect to marketplace after 2 seconds
    setTimeout(() => {
      activeTab.value = "listings";
      loadListings();
      submittedListing.value = null;
    }, 2000);
  } catch (err: any) {
    const message =
      err?.data?.message ||
      err?.statusMessage ||
      err?.message ||
      "Failed to submit listing.";
    error.value = message;
  } finally {
    submitting.value = false;
  }
};

const onSubmitRok = async () => {
  rokError.value = "";

  if (
    !rokForm.askingPrice ||
    !rokForm.middlemanId ||
    !rokForm.passportReady ||
    !rokForm.passportNeeded ||
    !rokForm.readyToMigrate ||
    !rokForm.focusType ||
    !rokForm.vipLevel ||
    !rokForm.currentGoldHeads ||
    !rokForm.troopCount ||
    !rokForm.currentPower ||
    !rokForm.firstPurchaseReceipt ||
    !rokForm.hasVipSupport ||
    !rokForm.kvkSeason ||
    !rokForm.universalSpeedupsDays ||
    !rokForm.equipment ||
    !rokForm.topCommanders ||
    !rokForm.contactNumber ||
    !rokForm.farmAccounts
  ) {
    rokError.value = "Please fill in all required fields.";
    return;
  }

  if (!phonePattern.test(rokForm.contactNumber.trim())) {
    rokError.value = "Please enter a valid phone number.";
    return;
  }

  const user = currentUser.value;
  if (!user) {
    rokError.value = "You must be logged in to post a listing.";
    return;
  }

  if (submittingRok.value) {
    return;
  }
  submittingRok.value = true;

  try {
    const formData = new FormData();
    formData.append("userId", String(user.id));
    formData.append("askingPrice", rokForm.askingPrice);
    formData.append("middlemanId", rokForm.middlemanId);
    formData.append("passportReady", rokForm.passportReady);
    formData.append("passportNeeded", rokForm.passportNeeded);
    formData.append("readyToMigrate", rokForm.readyToMigrate);
    formData.append("focusType", rokForm.focusType);
    formData.append("vipLevel", rokForm.vipLevel);
    formData.append("currentGoldHeads", rokForm.currentGoldHeads);
    formData.append("troopCount", rokForm.troopCount);
    formData.append("currentPower", rokForm.currentPower);
    formData.append("firstPurchaseReceipt", rokForm.firstPurchaseReceipt);
    formData.append("hasVipSupport", rokForm.hasVipSupport);
    formData.append("kvkSeason", rokForm.kvkSeason);
    formData.append("universalSpeedupsDays", rokForm.universalSpeedupsDays);
    formData.append("equipment", rokForm.equipment);
    formData.append("topCommanders", rokForm.topCommanders);
    formData.append("contactLink", rokForm.contactLink);
    formData.append("contactNumber", rokForm.contactNumber);
    formData.append("farmAccounts", rokForm.farmAccounts);

    rokImageFiles.value.forEach((file) => {
      formData.append("images", file);
    });

    await $fetch("/api/rok/listings", {
      method: "POST",
      body: formData,
    });

    rokForm.askingPrice = "";
    rokForm.middlemanId = "";
    rokForm.passportReady = "";
    rokForm.passportNeeded = "";
    rokForm.readyToMigrate = "";
    rokForm.focusType = "";
    rokForm.vipLevel = "";
    rokForm.currentGoldHeads = "";
    rokForm.troopCount = "";
    rokForm.currentPower = "";
    rokForm.firstPurchaseReceipt = "";
    rokForm.hasVipSupport = "";
    rokForm.kvkSeason = "";
    rokForm.universalSpeedupsDays = "";
    rokForm.equipment = "";
    rokForm.topCommanders = "";
    rokForm.contactLink = "";
    rokForm.contactNumber = "";
    rokForm.farmAccounts = "";
    rokImagePreviews.value = [];
    rokImageFiles.value = [];

    loadNotifications();
  } catch (err: any) {
    const message =
      err?.data?.message ||
      err?.statusMessage ||
      err?.message ||
      "Failed to submit listing.";
    rokError.value = message;
  } finally {
    submittingRok.value = false;
  }
};

const markOwnedListingAsSold = async (listingId: string) => {
  const user = currentUser.value;
  if (!user) {
    error.value = "You must be logged in to manage your listings.";
    return;
  }

  try {
    await $fetch("/api/listings/mark-sold", {
      method: "POST",
      body: {
        userId: user.id,
        listingId,
      },
    });

    // Refresh user listings and main listings
    await Promise.all([loadUserListings(), loadListings()]);
  } catch (err: any) {
    const message =
      err?.data?.message ||
      err?.statusMessage ||
      err?.message ||
      "Failed to mark listing as sold.";
    userListingsError.value = message;
  }
};

const onRegister = async () => {
  authError.value = "";
  authSuccess.value = "";

  if (!registerForm.fullName || !registerForm.email || !registerForm.password) {
    authError.value = "Full name, email and password are required.";
    return;
  }

  try {
    const response = await $fetch<{
      success: boolean;
      user: {
        id: number | string;
        email: string;
        fullName: string;
        isAdmin?: boolean;
        createdAt: string;
      };
    }>("/api/auth/register", {
      method: "POST",
      body: {
        fullName: registerForm.fullName,
        email: registerForm.email,
        password: registerForm.password,
      },
    });

    const newUser = response.user;

    currentUser.value = {
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      isAdmin: newUser.isAdmin || false,
    };
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(
          CURRENT_USER_STORAGE_KEY,
          JSON.stringify({
            id: newUser.id,
            email: newUser.email,
            fullName: newUser.fullName,
            isAdmin: newUser.isAdmin || false,
          })
        );
      } catch {
        // ignore
      }
    }
    authSuccess.value = "Account created successfully!";
    loginForm.email = registerForm.email;
    loginForm.password = registerForm.password;
    
    setTimeout(() => {
      showLandingPage.value = false;
      activeTab.value = "listings";
      loadListings();
      loadNotifications();
      navigateTo('/');
      authSuccess.value = "";
    }, 1500);
  } catch (err: any) {
    const message =
      err?.data?.message ||
      err?.statusMessage ||
      err?.message ||
      "Registration failed.";
    authError.value = message;
    console.error("Registration error:", err);
  }
};

const onLogin = async () => {
  authError.value = "";

  if (!loginForm.email || !loginForm.password) {
    authError.value = "Email and password are required.";
    return;
  }

  try {
    const user = await $fetch<{
      id: number | string;
      email: string;
      fullName: string;
      isAdmin?: boolean;
      createdAt: string;
    }>("/api/auth/login", {
      method: "POST",
      body: {
        email: loginForm.email,
        password: loginForm.password,
      },
    });

    currentUser.value = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      isAdmin: user.isAdmin || false,
    };
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(
          CURRENT_USER_STORAGE_KEY,
          JSON.stringify({
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            isAdmin: user.isAdmin || false,
          })
        );
      } catch {
        // ignore
      }
    }
    showLandingPage.value = false;
    activeTab.value = "listings";
    loadListings();
    loadNotifications();
    navigateTo('/');
  } catch (err: any) {
    const message =
      err?.data?.message ||
      err?.statusMessage ||
      err?.message ||
      "Login failed.";
    authError.value = message;
  }
};

const onUpdateProfile = async () => {
  profileError.value = "";
  profileMessage.value = "";

  if (!currentUser.value) {
    profileError.value = "You must be logged in to update your profile.";
    return;
  }

  if (!profileForm.fullName && !profileForm.newPassword) {
    profileError.value = "Please update your name and/or password.";
    return;
  }

  if (profileForm.newPassword && !profileForm.currentPassword) {
    profileError.value = "Current password is required to change password.";
    return;
  }

  profileSaving.value = true;

  try {
    const updated = await $fetch<{
      id: number | string;
      email: string;
      fullName: string;
      isAdmin?: boolean;
      createdAt: string;
    }>("/api/auth/profile", {
      method: "PUT",
      body: {
        userId: currentUser.value.id,
        fullName: profileForm.fullName || undefined,
        currentPassword: profileForm.currentPassword || undefined,
        newPassword: profileForm.newPassword || undefined,
      },
    });

    currentUser.value = {
      id: updated.id,
      email: updated.email,
      fullName: updated.fullName,
      isAdmin: updated.isAdmin || false,
    };

    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(
          CURRENT_USER_STORAGE_KEY,
          JSON.stringify({
            id: updated.id,
            email: updated.email,
            fullName: updated.fullName,
            isAdmin: updated.isAdmin || false,
          })
        );
      } catch {
        // ignore
      }
    }

    profileForm.currentPassword = "";
    profileForm.newPassword = "";
    profileMessage.value = "Profile updated successfully.";
  } catch (err: any) {
    const message =
      err?.data?.message ||
      err?.statusMessage ||
      err?.message ||
      "Failed to update profile.";
    profileError.value = message;
  } finally {
    profileSaving.value = false;
  }
};

// User's listings functions
const loadUserListings = async () => {
  if (!currentUser.value) {
    userListings.value = [];
    return;
  }

  loadingUserListings.value = true;
  userListingsError.value = "";

  try {
    const data = await $fetch<ListingResponse[]>("/api/listings/user", {
      query: {
        userId: currentUser.value.id,
      },
    });
    userListings.value = data;
  } catch (err: any) {
    const message =
      err?.data?.message ||
      err?.statusMessage ||
      err?.message ||
      "Failed to load your listings.";
    userListingsError.value = message;
  } finally {
    loadingUserListings.value = false;
  }
};

// Admin functions
const loadPendingListings = async () => {
  if (!currentUser.value?.isAdmin) {
    pendingListingsError.value = "Admin access required.";
    return;
  }

  loadingPendingListings.value = true;
  pendingListingsError.value = "";

  try {
    const data = await $fetch<ListingResponse[]>("/api/admin/pending-listings", {
      query: {
        userId: currentUser.value.id,
      },
    });
    pendingListings.value = data;
  } catch (err: any) {
    const message =
      err?.data?.message ||
      err?.statusMessage ||
      err?.message ||
      "Failed to load pending listings.";
    pendingListingsError.value = message;
  } finally {
    loadingPendingListings.value = false;
  }
};

const loadPendingRokListings = async () => {
  if (!currentUser.value?.isAdmin) {
    pendingRokListingsError.value = "Admin access required.";
    return;
  }

  loadingPendingRokListings.value = true;
  pendingRokListingsError.value = "";

  try {
    const data = await $fetch<RokListingResponse[]>("/api/admin/rok/pending-listings", {
      query: { userId: currentUser.value.id },
    });
    pendingRokListings.value = data;
  } catch (err: any) {
    const message = err?.data?.message || err?.statusMessage || err?.message || "Failed to load pending listings.";
    pendingRokListingsError.value = message;
  } finally {
    loadingPendingRokListings.value = false;
  }
};

const approveListing = async (listingId: string | number) => {
  if (!currentUser.value?.isAdmin) {
    return;
  }

  try {
    await $fetch("/api/admin/approve", {
      method: "POST",
      body: {
        listingId,
        userId: currentUser.value.id,
      },
    });
    
                // Remove from pending list and reload
    pendingListings.value = pendingListings.value.filter((l) => l.id !== listingId);
    
    loadApprovedListings();
    try { if (typeof window !== 'undefined') window.localStorage.removeItem(LISTINGS_CACHE_KEY) } catch {}
    loadListings(true);
    
    // Refresh notifications for the listing owner (notification was created on backend)
  } catch (err: any) {
    const message =
      err?.data?.message ||
      err?.statusMessage ||
      err?.message ||
      "Failed to approve listing.";
    alert(message);
  }
};

const rejectListing = async (listingId: string | number) => {
  if (!currentUser.value?.isAdmin) {
    return;
  }

  if (!confirm("Are you sure you want to reject this listing?")) {
    return;
  }

  try {
    await $fetch("/api/admin/reject", {
      method: "POST",
      body: {
        listingId,
        userId: currentUser.value.id,
      },
    });
    
    // Remove from pending list
    pendingListings.value = pendingListings.value.filter((l) => l.id !== listingId);
  } catch (err: any) {
    const message =
      err?.data?.message ||
      err?.statusMessage ||
      err?.message ||
      "Failed to reject listing.";
    alert(message);
  }
};

const loadApprovedListings = async () => {
  if (!currentUser.value?.isAdmin) {
    approvedListingsError.value = "Admin access required.";
    return;
  }

  loadingApprovedListings.value = true;
  approvedListingsError.value = "";

  try {
    const data = await $fetch<ListingResponse[]>("/api/admin/pending-listings", {
      query: {
        userId: currentUser.value.id,
        status: 'approved',
      },
    });
    approvedListings.value = data.filter((l) => l.status === 'approved');
  } catch (err: any) {
    const message =
      err?.data?.message ||
      err?.statusMessage ||
      err?.message ||
      "Failed to load approved listings.";
    approvedListingsError.value = message;
  } finally {
    loadingApprovedListings.value = false;
  }
};

const loadApprovedRokListings = async () => {
  if (!currentUser.value?.isAdmin) {
    approvedRokListingsError.value = "Admin access required.";
    return;
  }

  loadingApprovedRokListings.value = true;
  approvedRokListingsError.value = "";

  try {
    const data = await $fetch<RokListingResponse[]>("/api/admin/rok/pending-listings", {
      query: { userId: currentUser.value.id, status: 'approved' },
    });
    approvedRokListings.value = data.filter((l) => l.status === 'approved');
  } catch (err: any) {
    const message = err?.data?.message || err?.statusMessage || err?.message || "Failed to load approved listings.";
    approvedRokListingsError.value = message;
  } finally {
    loadingApprovedRokListings.value = false;
  }
};

const approveRokListing = async (listingId: string | number) => {
  if (!currentUser.value?.isAdmin) return;
  try {
    await $fetch("/api/admin/rok/approve", {
      method: "POST",
      body: { listingId, userId: currentUser.value.id },
    });
    pendingRokListings.value = pendingRokListings.value.filter((l) => l.id !== listingId);
    loadApprovedRokListings();
  } catch (err: any) {
    const message = err?.data?.message || err?.statusMessage || err?.message || "Failed to approve listing.";
    alert(message);
  }
};

const rejectRokListing = async (listingId: string | number) => {
  if (!currentUser.value?.isAdmin) return;
  if (!confirm("Are you sure you want to reject this listing?")) return;
  try {
    await $fetch("/api/admin/rok/reject", {
      method: "POST",
      body: { listingId, userId: currentUser.value.id },
    });
    pendingRokListings.value = pendingRokListings.value.filter((l) => l.id !== listingId);
  } catch (err: any) {
    const message = err?.data?.message || err?.statusMessage || err?.message || "Failed to reject listing.";
    alert(message);
  }
};

const markAsSold = async (listingId: string | number) => {
  if (!currentUser.value?.isAdmin) {
    return;
  }

  if (!confirm("Are you sure you want to mark this listing as sold?")) {
    return;
  }

  try {
    await $fetch("/api/admin/mark-sold", {
      method: "POST",
      body: {
        listingId,
        userId: currentUser.value.id,
      },
    });
    
    approvedListings.value = approvedListings.value.filter((l) => l.id !== listingId);
    try { if (typeof window !== 'undefined') window.localStorage.removeItem(LISTINGS_CACHE_KEY) } catch {}
    loadListings(true);
  } catch (err: any) {
    const message =
      err?.data?.message ||
      err?.statusMessage ||
      err?.message ||
      "Failed to mark listing as sold.";
    alert(message);
  }
};

// Notification functions
const loadNotifications = async () => {
  if (!currentUser.value) {
    return;
  }

  loadingNotifications.value = true;

  try {
    const data = await $fetch<NotificationResponse[]>("/api/notifications", {
      query: {
        userId: currentUser.value.id,
      },
    });
    notifications.value = data;
  } catch (err: any) {
    console.error("Failed to load notifications:", err);
  } finally {
    loadingNotifications.value = false;
  }
};

const markNotificationAsRead = async (notificationId: string) => {
  try {
    await $fetch("/api/notifications/mark-read", {
      method: "POST",
      body: {
        notificationId,
      },
    });
    
    // Update local state
    const notif = notifications.value.find(n => n.id === notificationId);
    if (notif) {
      notif.isRead = true;
    }
  } catch (err: any) {
    console.error("Failed to mark notification as read:", err);
  }
};

const markAllNotificationsAsRead = async () => {
  if (!currentUser.value) {
    return;
  }

  try {
    await $fetch("/api/notifications/mark-all-read", {
      method: "POST",
      body: {
        userId: currentUser.value.id,
      },
    });
    
    // Update local state
    notifications.value.forEach(n => {
      n.isRead = true;
    });
  } catch (err: any) {
    console.error("Failed to mark all notifications as read:", err);
  }
};

const formatNotificationTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
  if (showNotifications.value) {
    loadNotifications();
  }
};

onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("click", handleClickOutsideNotifications);
  }
});

</script>
onUnmounted(() => {
  if (typeof window !== "undefined") {
    try {
      window.removeEventListener("click", handleClickOutsideNotifications);
    } catch {}
  }
});
