<template>
  <div
    class="skeleton-loader-container d-flex justify-center align-center pb-8"
  >
    <svg viewBox="0 0 100 100" class="cube-svg">
      <path
        d="M50 20 L80 35 L80 65 L50 80 L20 65 L20 35 Z M50 20 L50 50 M50 80 L50 50 M20 35 L50 50 M80 35 L50 50"
        class="cube-path"
      />
    </svg>

    <v-skeleton-loader type="image" style="width: 100%"></v-skeleton-loader>
  </div>
</template>

<style scoped>
.skeleton-loader-container {
  position: relative;
  width: 100%;
  max-width: 784px;
}

:deep(.v-skeleton-loader__image) {
  border-radius: 8px;
  height: 100% !important;
  aspect-ratio: 4/3;
}

.cube-svg {
  width: 130px;
  height: 130px;
  z-index: 2;
  position: absolute;
}

.cube-path {
  fill: none;
  stroke: rgba(255, 255, 255, 0.8);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;

  stroke-dasharray: 300;
  stroke-dashoffset: 300;

  animation: drawCube 3s ease-in-out infinite;
}

@keyframes drawCube {
  0% {
    stroke-dashoffset: 300;
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  50% {
    stroke-dashoffset: 0;
  }
  80% {
    opacity: 1;
  }
  100% {
    stroke-dashoffset: 0;
    opacity: 0;
  }
}
</style>
