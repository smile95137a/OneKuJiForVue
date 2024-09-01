<template>
  <Dialog
    :isOpen="isOpen"
    :customClass="`dialog--daliyDialog ${customClass}`"
    @close="handleClose"
  >
    <div class="daliyDialog">
      <div class="daliyDialog__header">
        <div class="daliyDialog__logo"></div>
      </div>

      <div class="daliyDialog__main">
        <div class="daliyDialog__main-content">
          <img :src="s" class="wheel__seat" />
          <div ref="wheel" class="wheel">
            <div ref="spinner" class="wheel__spinner"></div>
            <div ref="ticker" class="wheel__ticker">
              <img :src="flag" />
            </div>
            <div class="wheel__center">
              <img :src="center" />
            </div>
          </div>
        </div>
        <div class="daliyDialog__main-result">
          <p class="daliyDialog__text">
            恭喜您抽中
            <span class="daliyDialog__text daliyDialog__text--red">{{
              spinResult
            }}</span
            >枚銀幣
          </p>
        </div>
        <div class="daliyDialog__main-btns">
          <div
            class="daliyDialog__main-btn daliyDialog__main-btn--cancel"
            @click="spinWheel"
          >
            開始
          </div>
          <div
            class="daliyDialog__main-btn daliyDialog__main-btn--confirm"
            @click="stopWheel"
          >
            停止
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import Dialog from './Dialog.vue';
import { computed, ref, onMounted } from 'vue';
import { useDialogStore } from '@/stores/dialogStore';
import flag from '@/assets/image/flag.png';
import center from '@/assets/image/center.png';
import s from '@/assets/image/s.png';

const dialogStore = useDialogStore();

const isOpen = computed(() => dialogStore.isDaliyDialogOpen);
const customClass = computed(() => dialogStore.customClass);
const spinResult = ref('');

const prizes = [
  { text: '50', data: '50' },
  { text: '100', data: '100' },
  { text: '200', data: '200' },
  { text: '300', data: '300' },
  { text: '400', data: '400' },
  { text: '500', data: '500' },
  { text: '600', data: '600' },
  { text: '700', data: '700' },
];

const wheel = ref(null);
const spinner = ref(null);
const ticker = ref(null);
const isSpinning = ref(false);

let rotation = 0;
let currentSlice = 0;
let tickerAnim = null;
let prizeNodes = [];

const prizeSlice = 360 / prizes.length;
const prizeOffset = prizeSlice / 2;
const selectedPrizeIndex = ref(0);

const createPrizeNodes = () => {
  prizes.forEach(({ text, data }, i) => {
    const rotation = prizeSlice * i * -1 - prizeOffset;
    const div = document.createElement('div');
    div.classList.add('wheel__prize');
    div.setAttribute('data-data', data);
    div.style.setProperty('--rotate', `${rotation}deg`);
    div.innerHTML = `<span class="text">${text}</span>`;
    spinner.value.appendChild(div);
  });

  const prizeCount = prizes.length;
  const segmentAngle = 360 / prizeCount;
  const lineWidth = 2;
  const rotationOffset = segmentAngle / 2 + lineWidth;
  spinner.value.style.transform = `rotate(calc(var(--rotate, ${rotationOffset}) * 1deg))`;
  prizeNodes = spinner.value.querySelectorAll('.wheel__prize');
};

const createSVGSpinner = () => {
  const prizeCount = prizes.length;
  const segmentAngle = 360 / prizeCount;
  const lineWidth = 2;
  const rotationOffset = segmentAngle / 2 + lineWidth;
  const spinnerRadius = 150; // 圆盘半径
  const centerX = spinnerRadius; // 圆心的X坐标
  const centerY = spinnerRadius; // 圆心的Y坐标

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('viewBox', '0 0 300 300'); // 固定的 viewBox，以确保比例正确

  const circle = document.createElementNS(svgNS, 'circle');
  circle.setAttribute('cx', centerX);
  circle.setAttribute('cy', centerY);
  circle.setAttribute('r', spinnerRadius);
  circle.setAttribute('fill', '#006400');
  svg.appendChild(circle);

  for (let i = 0; i < prizeCount; i++) {
    const angle = i * segmentAngle;
    const x1 = centerX;
    const y1 = centerY;
    const x2 =
      centerX + spinnerRadius * Math.cos((angle - 90) * (Math.PI / 180));
    const y2 =
      centerY + spinnerRadius * Math.sin((angle - 90) * (Math.PI / 180));

    const line = document.createElementNS(svgNS, 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', '#e7bd62');
    line.setAttribute('stroke-width', lineWidth);
    svg.appendChild(line);

    const textAngle = angle + segmentAngle / 2;
    const textX =
      centerX +
      (spinnerRadius - 30) * Math.cos((textAngle - 90) * (Math.PI / 180));
    const textY =
      centerY +
      (spinnerRadius - 30) * Math.sin((textAngle - 90) * (Math.PI / 180));

    const text = document.createElementNS(svgNS, 'text');
    text.setAttribute('x', textX);
    text.setAttribute('y', textY);
    text.setAttribute('fill', '#FFD700');
    text.setAttribute('font-size', '20');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
  }

  spinner.value.innerHTML = ''; // 清空旧内容
  spinner.value.appendChild(svg);
};

const setupWheel = () => {
  createSVGSpinner();
  createPrizeNodes();
};

const spinertia = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const runTickerAnimation = () => {
  const values = window
    .getComputedStyle(spinner.value)
    .transform.split('(')[1]
    .split(')')[0]
    .split(',');
  const a = values[0];
  const b = values[1];
  let rad = Math.atan2(b, a);

  if (rad < 0) rad += 2 * Math.PI;

  const angle = Math.round(rad * (180 / Math.PI));
  const slice = Math.floor(angle / prizeSlice);

  if (currentSlice !== slice) {
    ticker.value.style.animation = 'none';
    setTimeout(() => (ticker.value.style.animation = null), 10);
    currentSlice = slice;
  }

  tickerAnim = requestAnimationFrame(runTickerAnimation);
};

const selectPrize = () => {
  const selected = Math.floor(rotation / prizeSlice);
  spinResult.value = prizeNodes[selected].getAttribute('data-data');
  prizeNodes[selected].classList.add('selected');
};

const spinWheel = () => {
  if (!isSpinning.value) {
    isSpinning.value = true;
    rotation = Math.floor(Math.random() * 360 + spinertia(2000, 5000));
    prizeNodes.forEach((prize) => prize.classList.remove('selected'));
    wheel.value.classList.add('wheel--spinning');
    spinner.value.style.setProperty('--rotate', rotation);
    ticker.value.style.animation = 'none';
    runTickerAnimation();
  }
};

const stopWheel = () => {
  if (isSpinning.value) {
    cancelAnimationFrame(tickerAnim);
    const currentRotation = rotation % 360;
    spinner.value.style.setProperty('--rotate', currentRotation);
    const selectedIndex = Math.floor(currentRotation / prizeSlice);
    spinResult.value = prizes[selectedIndex].text;
    isSpinning.value = false;
    wheel.value.classList.remove('wheel--spinning');
    prizeNodes[selectedIndex].classList.add('selected');
  }
};

onMounted(() => {
  if (spinner.value) {
    setupWheel();
    spinner.value.addEventListener('transitionend', () => {
      cancelAnimationFrame(tickerAnim);
      isSpinning.value = false;
      rotation %= 360;
      selectPrize();
      wheel.value.classList.remove('wheel--spinning');
      spinner.value.style.setProperty('--rotate', rotation);
    });
  } else {
    console.error('Spinner element is not found');
  }
});
</script>
