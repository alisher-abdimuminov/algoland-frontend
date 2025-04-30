<template>
    <div class="relative w-full h-screen overflow-hidden bg-light dark:bg-dark">
      <div class="absolute inset-0">
        <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="gridPattern" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" stroke-width="0.2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gridPattern)" class="text-gray-300 dark:text-gray-800"/>
        </svg>
      </div>
    </div>
  </template>
  
  <style scoped>
  .bg-light {
    background: radial-gradient(circle, rgba(240,240,240,1) 0%, rgba(220,220,220,1) 50%, rgba(200,200,200,1) 100%);
  }
  
  .bg-dark {
    background: radial-gradient(circle, rgba(30,30,30,1) 0%, rgba(20,20,20,1) 50%, rgba(10,10,10,1) 100%);
  }
  </style>
  