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
    <header class="border-b transition-colors duration-300"
      :class="theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'">
      <div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-4xl font-bold transition-colors duration-300"
              :class="theme === 'dark' ? 'text-slate-100' : 'text-slate-900'">
             PH Legends Marketplace
            </h1>
            <p class="mt-1 text-sm font-medium transition-colors duration-300"
              :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
              Buy and sell game accounts safely
            </p>
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
      <!-- Navigation Component -->
      <AppNavigation 
        :active-tab="activeTab"
        :theme="theme"
        :current-user="currentUser"
        @tab-change="setTab"
      />

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

      <form
        v-if="activeTab === 'post' && currentUser"
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
              placeholder="Discord, Telegram, or social media link"
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
        </div>

        <div class="space-y-3">
          <label class="flex items-center gap-2 text-sm font-semibold"
            :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'">
            <span>Account Screenshots</span>
          </label>
          <p class="text-xs"
            :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-500'">
            Upload screenshots of your character, inventory, stats, and other important details
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
              PNG, JPG, GIF up to 10MB each
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
            Listing Posted Successfully!
          </h2>
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
      </section>

      <section
        v-if="activeTab === 'listings'"
        class="space-y-6"
      >
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h2 class="text-3xl font-bold mb-2"
              :class="theme === 'dark' ? 'text-slate-100' : 'text-slate-900'">
              Marketplace
            </h2>
            <p class="text-sm"
              :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
              Browse available Legends of Ymir accounts for sale
            </p>
          </div>
          <button
            v-if="currentUser"
            type="button"
            @click="setTab('post')"
            :class="[
              'inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-all duration-300 ease-in-out',
              'bg-emerald-600 hover:bg-emerald-500 hover:scale-[1.02]',
            ]"
          >
            Post New Listing
          </button>
          <button
            v-else
            type="button"
            @click="setTab('auth')"
            :class="[
              'inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-all duration-300 ease-in-out',
              'bg-emerald-600 hover:bg-emerald-500 hover:scale-[1.02]',
            ]"
          >
            Login to Sell
          </button>
        </div>

        <div
          v-if="!loadingListings && !listingsError && listings.length"
          :class="[
            'mb-6 rounded-lg border p-4 sm:p-5 transition-all duration-300 ease-in-out',
            theme === 'dark'
              ? 'border-slate-700 bg-slate-900/60'
              : 'border-slate-200 bg-white',
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
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="space-y-2">
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

            <div class="space-y-2">
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

            <div class="space-y-2">
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

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="item in filteredListings"
          :key="item.id"
          @click="openListingModal(item)"
          :class="[
              'group rounded-lg border p-6 transition-all duration-300 ease-in-out hover:scale-[1.01] hover:shadow-lg cursor-pointer',
            theme === 'dark'
                ? 'border-slate-700 bg-slate-800/70 hover:border-emerald-500/50 '
                : 'border-slate-200 bg-white hover:border-emerald-500/50 ',
            ]"
          >
            <!-- Header with price badge -->
            <div class="flex items-start justify-between gap-3 mb-4">
              <div class="flex-1">
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

            <!-- Class badges -->
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

            <!-- Images preview -->
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

            <!-- Contact info -->
            <div class="space-y-3 pt-4 border-t"
              :class="theme === 'dark' ? 'border-slate-700' : 'border-slate-200'">
              <div class="flex items-center gap-2 text-xs"
                :class="theme === 'dark' ? 'text-slate-500' : 'text-slate-500'">
                <span>🕒</span>
                <span>Posted {{ new Date(item.createdAt).toLocaleDateString() }}</span>
              </div>
              <div class="flex flex-col gap-2">
                <a
                  v-if="item.contactLink"
                  :href="item.contactLink"
                  target="_blank"
                  rel="noopener noreferrer"
                  @click.stop
                  :class="[
                    'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ease-in-out',
                    theme === 'dark'
                      ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                      : 'bg-emerald-600 text-white hover:bg-emerald-500',
                  ]"
                >
                  <span>💬</span>
                  <span>Contact Seller</span>
                </a>
                <div class="flex items-center gap-2 text-xs px-2"
                  :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'">
                  <span>📞</span>
                  <span>{{ item.contactNumber }}</span>
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
              <h3 class="text-2xl font-bold mb-1">
                {{ selectedListing.nickname }}
              </h3>
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
            <div class="space-y-1">
              <div class="font-semibold">Asking Price</div>
              <div class="text-emerald-400 font-bold text-lg">
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
              <img :src="src" alt="Listing image" class="h-32 w-full object-cover" />
            </div>
          </div>

          <div
            class="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div
              class="flex items-center gap-2 text-sm"
              :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'"
            >
              <span>📞</span>
              <span>{{ selectedListing.contactNumber }}</span>
            </div>
            <a
              v-if="selectedListing.contactLink"
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
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, watch, computed } from "vue";

type ListingResponse = {
  id: number;
  createdAt: string;
  nickname: string;
  server: string;
  growthPower: string;
  classesList: string[];
  askingPrice: string;
  contactLink: string;
  contactNumber: string;
  images: string[];
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
});

const imagePreviews = ref<string[]>([]);
const imageFiles = ref<File[]>([]);
const submitting = ref(false);
const error = ref("");

const selectedClass = ref<string>("");

const submittedListing = ref<ListingResponse | null>(null);

const activeTab = ref<"post" | "listings" | "auth">("listings");

const currentUser = ref<
  { id: number | string; email: string; fullName?: string } | null
>(null);

const listings = ref<ListingResponse[]>([]);
const loadingListings = ref(false);
const listingsError = ref("");

const filters = reactive({
  server: "",
  className: "",
  minPrice: "",
  maxPrice: "",
  minGrowthPower: "",
  maxGrowthPower: "",
});

const showListingModal = ref(false);
const selectedListing = ref<ListingResponse | null>(null);

const previewImage = ref<string | null>(null);

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
            };
          }
        } catch {
          // ignore
        }
      }

      // Load listings on mount (marketplace is default view)
      loadListings();
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

const setTab = (tab: "post" | "listings" | "auth") => {
  activeTab.value = tab;
  if (tab === "listings") {
    loadListings();
  }
  if (tab === "auth" && currentUser.value) {
    profileForm.fullName = currentUser.value.fullName || "";
    profileForm.currentPassword = "";
    profileForm.newPassword = "";
    profileError.value = "";
    profileMessage.value = "";
  }
};

const showUserMenu = ref(false);

const logout = () => {
  currentUser.value = null;
  authMode.value = "login";
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

const openListingModal = (item: ListingResponse) => {
  if (!currentUser.value) {
    activeTab.value = "auth";
    authMode.value = "login";
    authError.value = "You must be logged in to view listing details.";
    return;
  }

  selectedListing.value = item;
  showListingModal.value = true;
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

  imagePreviews.value.forEach((url) => URL.revokeObjectURL(url));

  const urls: string[] = [];
  const selectedFiles: File[] = [];

  Array.from(files).forEach((file) => {
    urls.push(URL.createObjectURL(file));
    selectedFiles.push(file);
  });

  imagePreviews.value = urls;
  imageFiles.value = selectedFiles;

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

const filteredListings = computed(() => {
  return listings.value.filter((item) => {
    const serverMatch =
      !filters.server ||
      item.server.toLowerCase().includes(filters.server.toLowerCase());

    const classMatch =
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
      (!minGrowthPower ||
        (!Number.isNaN(growthPower) && growthPower >= minGrowthPower)) &&
      (!maxGrowthPower ||
        (!Number.isNaN(growthPower) && growthPower <= maxGrowthPower));

    return serverMatch && classMatch && priceMatch && growthPowerMatch;
  });
});

const resetFilters = () => {
  filters.server = "";
  filters.className = "";
  filters.minPrice = "";
  filters.maxPrice = "";
  filters.minGrowthPower = "";
  filters.maxGrowthPower = "";
};

const loadListings = async () => {
  loadingListings.value = true;
  listingsError.value = "";

  try {
    const data = await $fetch<ListingResponse[]>("/api/listings");
    listings.value = data;
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
    !form.contactNumber
  ) {
    error.value = "Please fill in all required fields.";
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
    selectedClass.value = "";
    imagePreviews.value = [];
    imageFiles.value = [];
    
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
    };
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(
          CURRENT_USER_STORAGE_KEY,
          JSON.stringify({
            id: newUser.id,
            email: newUser.email,
            fullName: newUser.fullName,
          })
        );
      } catch {
        // ignore
      }
    }
    authSuccess.value = "Account created successfully!";
    loginForm.email = registerForm.email;
    loginForm.password = registerForm.password;
    
    // After registration, go to marketplace
    setTimeout(() => {
      activeTab.value = "listings";
      loadListings();
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
    };
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(
          CURRENT_USER_STORAGE_KEY,
          JSON.stringify({
            id: user.id,
            email: user.email,
            fullName: user.fullName,
          })
        );
      } catch {
        // ignore
      }
    }
    // After login, go to marketplace to see listings
    activeTab.value = "listings";
    loadListings();
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
    };

    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(
          CURRENT_USER_STORAGE_KEY,
          JSON.stringify({
            id: updated.id,
            email: updated.email,
            fullName: updated.fullName,
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

</script>
