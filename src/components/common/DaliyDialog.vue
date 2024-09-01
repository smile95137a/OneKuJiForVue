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
<script setup lang="ts">
import Dialog from './Dialog.vue';
import { computed, ref, onMounted, Ref } from 'vue';
import { useDialogStore } from '@/stores/dialogStore';
import flag from '@/assets/image/flag.png';
import center from '@/assets/image/center.png';
import s from '@/assets/image/s.png';
import { getAllSignIns, spinWheelAPI } from '@/services/frontend/signInService';
import { getRandomNumberInRange } from '@/utils/RandomUtils';

interface Prize {
  text: string;
  data: string;
}

const dialogStore = useDialogStore();

const isOpen = computed(() => dialogStore.isDaliyDialogOpen);
const customClass = computed(() => dialogStore.customClass);
const spinResult = ref<string>('');

const prizes: Ref<Prize[]> = ref([]);

const wheel = ref<HTMLElement | null>(null);
const spinner = ref<HTMLElement | null>(null);
const ticker = ref<HTMLElement | null>(null);
const isSpinning = ref<boolean>(false);

let rotation = 0;
let currentSlice = 0;
let tickerAnim: number | null = null;
let prizeNodes: any = [];

const handleClose = (result: boolean) => {
  dialogStore.closeDaliyDialog(result);
};

// 创建奖品节点并附加到转盘
const createPrizeNodes = () => {
  const prizeCount = prizes.value.length;
  const prizeSlice = 360 / prizeCount;
  const prizeOffset = prizeSlice / 2;

  prizes.value.forEach(({ text, data }, i) => {
    const rotation = prizeSlice * i * -1 - prizeOffset;
    const div = document.createElement('div');
    div.classList.add('wheel__prize');
    div.setAttribute('data-value', data);
    div.style.setProperty('--rotate', `${rotation}deg`);
    div.innerHTML = `<span class="wheel__text">${text}</span>`;
    spinner.value?.appendChild(div);
  });

  const lineWidth = 2;
  const rotationOffset = prizeSlice / 2 + lineWidth;
  spinner.value?.style.setProperty(
    'transform',
    `rotate(calc(var(--rotate, ${rotationOffset}) * 1deg))`
  );

  prizeNodes = spinner.value?.querySelectorAll('.wheel__prize') || [];
};

// 创建SVG转盘
const createSVGSpinner = () => {
  const prizeCount = prizes.value.length;
  const segmentAngle = 360 / prizeCount;
  const lineWidth = 2;
  const spinnerRadius = 150;
  const centerX = spinnerRadius;
  const centerY = spinnerRadius;

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('viewBox', '0 0 300 300');

  const circle = document.createElementNS(svgNS, 'circle');
  circle.setAttribute('cx', centerX.toString());
  circle.setAttribute('cy', centerY.toString());
  circle.setAttribute('r', spinnerRadius.toString());
  circle.setAttribute('fill', '#006400');
  svg.appendChild(circle);

  for (let i = 0; i < prizeCount; i++) {
    const angle = i * segmentAngle;
    const x2 =
      centerX + spinnerRadius * Math.cos((angle - 90) * (Math.PI / 180));
    const y2 =
      centerY + spinnerRadius * Math.sin((angle - 90) * (Math.PI / 180));

    const line = document.createElementNS(svgNS, 'line');
    line.setAttribute('x1', centerX.toString());
    line.setAttribute('y1', centerY.toString());
    line.setAttribute('x2', x2.toString());
    line.setAttribute('y2', y2.toString());
    line.setAttribute('stroke', '#e7bd62');
    line.setAttribute('stroke-width', lineWidth.toString());
    svg.appendChild(line);

    const textAngle = angle + segmentAngle / 2;
    const textX =
      centerX +
      (spinnerRadius - 30) * Math.cos((textAngle - 90) * (Math.PI / 180));
    const textY =
      centerY +
      (spinnerRadius - 30) * Math.sin((textAngle - 90) * (Math.PI / 180));

    const text = document.createElementNS(svgNS, 'text');
    text.setAttribute('x', textX.toString());
    text.setAttribute('y', textY.toString());
    text.setAttribute('fill', '#FFD700');
    text.setAttribute('font-size', '20');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    svg.appendChild(text);
  }

  spinner.value?.appendChild(svg);
};

// 初始化转盘
const setupWheel = () => {
  createSVGSpinner();
  createPrizeNodes();
};

// 运行转盘指针动画
const runTickerAnimation = () => {
  const prizeCount = prizes.value.length;
  const prizeSlice = 360 / prizeCount;
  const [a, b] = window
    .getComputedStyle(spinner.value!)
    .transform.match(/matrix\((.*)\)/)?.[1]
    .split(',')
    .map(Number) ?? [1, 0];

  let rad = Math.atan2(b, a);
  if (rad < 0) rad += 2 * Math.PI;

  const angle = Math.round(rad * (180 / Math.PI));
  const slice = Math.floor(angle / prizeSlice);

  if (currentSlice !== slice) {
    ticker.value?.style.setProperty('animation', 'none');
    setTimeout(() => ticker.value?.style.removeProperty('animation'), 10);
    currentSlice = slice;
  }

  tickerAnim = requestAnimationFrame(runTickerAnimation);
};

const selectPrize = () => {
  const prizeCount = prizes.value.length;
  const prizeSlice = 360 / prizeCount;
  const selected = Math.floor(rotation / prizeSlice);
  spinResult.value = prizeNodes[selected]?.getAttribute('data-value') || '';
  prizeNodes[selected]?.classList.add('selected');
};

const spinWheel = async () => {
  if (!isSpinning.value) {
    const { success, data, message } = await spinWheelAPI();
    if (success) {
      const choseIndex = prizes.value.findIndex(
        (x) => x.data === data.sliverPrice
      );
      const prizeCount = prizes.value.length;
      const prizeSlice = 360 / prizeCount;

      isSpinning.value = true;
      const r = getRandomNumberInRange(
        choseIndex * prizeSlice,
        (choseIndex + 1) * prizeSlice
      );
      rotation = getRandomNumberInRange(10, 20) * 360 + r;

      prizeNodes.forEach((prize: Element) =>
        prize.classList.remove('selected')
      );
      wheel.value?.classList.add('wheel--spinning');
      spinner.value?.style.setProperty('--rotate', rotation.toString());
      ticker.value?.style.setProperty('animation', 'none');

      runTickerAnimation();
    } else {
      handleClose(true);
      await dialogStore.openInfoDialog({
        title: '系統消息',
        message,
      });
    }
  }
};

const stopWheel = () => {
  if (isSpinning.value) {
    cancelAnimationFrame(tickerAnim!);
    const prizeCount = prizes.value.length;
    const prizeSlice = 360 / prizeCount;
    const currentRotation = rotation % 360;

    spinner.value?.style.setProperty('--rotate', currentRotation.toString());
    const selectedIndex = Math.floor(currentRotation / prizeSlice);
    spinResult.value = prizes.value[selectedIndex].text;

    isSpinning.value = false;
    wheel.value?.classList.remove('wheel--spinning');
    prizeNodes[selectedIndex]?.classList.add('selected');
  }
};

onMounted(async () => {
  if (spinner.value) {
    const { data } = await getAllSignIns();
    prizes.value = data.map((x) => ({
      text: x.sliverPrice,
      data: x.sliverPrice,
    }));
    setupWheel();

    spinner.value.addEventListener('transitionend', () => {
      cancelAnimationFrame(tickerAnim!);
      rotation %= 360;
      selectPrize();
      isSpinning.value = false;
      wheel.value?.classList.remove('wheel--spinning');
      spinner.value?.style.setProperty('--rotate', rotation.toString());
    });
  } else {
    console.error('Spinner element is not found');
  }
});
</script>
