<template>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" role="img"
        aria-label="Algoland logo" class="text-white">
        <title>algocoin</title>

        <defs>
            <radialGradient id="coinGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#f8c26a" />
                <stop offset="100%" stop-color="#f7931a" />
            </radialGradient>

            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="black" flood-opacity="0.3" />
            </filter>
        </defs>

        <circle cx="12" cy="12" r="10" fill="url(#coinGradient)" stroke="#b8610b" stroke-width="1"
            filter="url(#shadow)" />

        <line x1="11" y1="7" x2="8" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        <line x1="16" y1="7" x2="13" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        <line x1="6" y1="12" x2="18" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </svg>
</template>
