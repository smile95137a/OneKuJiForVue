<template>
  <div class="report-container">
    <!-- 控制面板 -->
    <div class="report-controls">
      <label for="reportType">選擇報表：</label>
      <select id="reportType" v-model="selectedReport" @change="resetDateAndFetchData">
        <option value="DRAW_AMOUNT">開獎金額報表</option>
        <option value="TOTAL_CONSUMPTION">消費總額報表</option>
        <option value="TOTAL_DEPOSIT">儲值總額報表</option>
        <option value="USER_UPDATE_LOG">發放銀幣紅利報表</option>
        <option value="DAILY_SIGN_IN">每日簽到報表</option>
        <option value="SLIVER_COIN_RECYCLE">銀幣回收報表</option>
        <option value="PRIZE_RECYCLE_REPORT">獎品回收報表</option>
        <option value="DRAW_RESULT_SUMMARY">開獎結果報表</option>
      </select>

      <label for="groupType">分組類型：</label>
      <select id="groupType" v-model="groupType" @change="resetDateAndFetchData">
        <option value="day">日</option>
        <option value="week">週</option>
        <option value="month">月</option>
        <option value="year">年</option>
      </select>

      <!-- 日期範圍選擇 -->
      <div v-if="requiresDateRange(selectedReport)">
        <label for="startDate">開始日期：</label>
        <input id="startDate" type="date" v-model="startDate" @change="fetchReportData" />
        <label for="endDate">結束日期：</label>
        <input id="endDate" type="date" v-model="endDate" @change="fetchReportData" />
      </div>

      <!-- 查詢和匯出按鈕 -->
      <div class="action-buttons">
        <button @click="fetchReportData">查詢報表</button>
        <button @click="exportToExcel" class="export-button">匯出 Excel</button>
      </div>
    </div>

    <!-- 報表結果 -->
    <div class="report-results">
      <table v-if="reportData.length">
        <thead>
          <tr>
            <th v-for="key in Object.keys(reportData[0])" :key="key">{{ key }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in reportData" :key="index">
            <td v-for="(value, key) in row" :key="key">
              <img v-if="isImage(value)" :src="getFormattedImageUrl(value)" alt="圖片" class="product-image" />
              <span v-else>{{ value }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else>暫無數據</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeServices } from '@/services/backend/storeservice';
import axios from 'axios';
import { ref } from 'vue';

const API_IMAGE_URL = import.meta.env.VITE_BASE_API_URL3;
const API_URL = import.meta.env.VITE_BASE_API_URL2;

const selectedReport = ref<string>('DRAW_AMOUNT');
const groupType = ref<string>('month');
const startDate = ref<string>('');
const endDate = ref<string>('');
const reportData = ref<Array<Record<string, any>>>([]);

const requiresDateRange = (reportName: string): boolean => {
  const reportsWithDateRange: string[] = [
    'DRAW_AMOUNT',
    'TOTAL_CONSUMPTION',
    'TOTAL_DEPOSIT',
    'USER_UPDATE_LOG',
    'DAILY_SIGN_IN',
    'SLIVER_COIN_RECYCLE',
    'PRIZE_RECYCLE_REPORT',
    'DRAW_RESULT_SUMMARY',
  ];
  return reportsWithDateRange.includes(reportName);
};

const isImage = (value: string | string[]): boolean => {
  if (Array.isArray(value)) value = value[0];
  if (typeof value !== 'string') return false;

  const trimmedValue = value.trim().replace(/^["']|["']$/g, '');
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
  return imageExtensions.some(extension => trimmedValue.toLowerCase().includes(extension));
};

const getFormattedImageUrl = (url: string): string => {
  if (isImage(url)) {
    const cleanURL = url.trim().replace(/^\["|"\]$/g, '');
    return `${API_IMAGE_URL}/img${cleanURL}`;
  }
  return url;
};

const resetDateAndFetchData = (): void => {
  if (!requiresDateRange(selectedReport.value)) {
    startDate.value = '';
    endDate.value = '';
  }
  fetchReportData();
};

const fetchReportData = async (): Promise<void> => {
  try {
    const params = {
      reportType: selectedReport.value,
      groupType: groupType.value,
      startDate: startDate.value || null,
      endDate: endDate.value || null,
    };

    const response = await storeServices.fetchReportData(
      params.reportType,
      params.startDate,
      params.endDate,
      params.groupType
    );

    reportData.value = response.map((item: any) => {
      switch (item.日期分組) {
        case 'day':
          item.日期分組 = '日報';
          break;
        case 'week':
          item.日期分組 = '週報';
          break;
        case 'month':
          item.日期分組 = '月報';
          break;
        case 'year':
          item.日期分組 = '年報';
          break;
      }
      return item;
    });

    reportData.value.sort((a, b) => {
      const order = ['日報', '週報', '月報', '年報'];
      return order.indexOf(a.日期分組) - order.indexOf(b.日期分組);
    });
  } catch (error) {
    console.error('查詢報表失敗:', error);
    reportData.value = [];
  }
};
const reportNameMap: { [key: string]: string } = {
  DRAW_AMOUNT: '開獎金額報表',
  TOTAL_CONSUMPTION: '消費總額報表',
  TOTAL_DEPOSIT: '儲值總額報表',
  USER_UPDATE_LOG: '發放銀幣紅利報表',
  DAILY_SIGN_IN: '每日簽到報表',
  SLIVER_COIN_RECYCLE: '銀幣回收報表',
  PRIZE_RECYCLE_REPORT: '獎品回收報表',
  DRAW_RESULT_SUMMARY: '開獎結果報表',
};

const exportToExcel = async (): Promise<void> => {
  try {
    const params = {
      reportType: selectedReport.value,
      groupType: groupType.value,
      startDate: startDate.value || '',
      endDate: endDate.value || '',
    };

    const response = await axios.get(`${API_URL}/reports/export`, {
      params,
      responseType: 'blob',
    });

    // 获取中文名称
    const reportName = reportNameMap[selectedReport.value] || selectedReport.value;

    // 创建下载链接并触发下载
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${reportName}.xlsx`); // 使用中文名称
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('匯出報表失敗:', error);
  }
};


// 初始化
fetchReportData();
</script>

<style scoped>
.report-container {
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.report-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
  margin-bottom: 20px;
}

.report-controls label {
  font-weight: bold;
  margin-right: 10px;
}

.report-controls select,
.report-controls input[type="date"] {
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.action-buttons button {
  background-color: #007bff;
  color: white;
  padding: 8px 15px;
  font-size: 14px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.action-buttons button:hover {
  background-color: #0056b3;
}

.export-button {
  background-color: #28a745;
}

.export-button:hover {
  background-color: #1e7e34;
}

.report-results table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: white;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.report-results th,
.report-results td {
  padding: 10px 15px;
  text-align: left;
  border: 1px solid #e0e0e0;
}

.report-results th {
  background-color: #007bff;
  color: white;
  font-weight: bold;
}

.report-results tr:nth-child(even) {
  background-color: #f2f2f2;
}

.report-results tr:hover {
  background-color: #e6f7ff;
}

.product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 5px;
  border: 1px solid #ccc;
}

p {
  text-align: center;
  font-size: 16px;
  color: #777;
}
</style>

