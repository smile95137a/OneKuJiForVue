<template>
    <div>
      <h1>兌換碼列表</h1>
  
      <!-- 按鈕：生成新兌換碼 -->
      <button @click="generateCode">生成新的兌換碼</button>
  
      <!-- 顯示新生成的兌換碼 -->
      <div v-if="newCode" class="alert alert-success">
        生成的兌換碼: <strong>{{ newCode }}</strong>
      </div>
  
      <!-- 顯示兌換碼列表 -->
      <ul v-if="redemptionCodes.length > 0">
        <li v-for="code in redemptionCodes" :key="code.id">
          兌換碼: {{ code.code }} - 已兌換: {{ code.isRedeemed ? '是' : '否' }} 
          - 兌換時間: {{ code.redeemedAt ? code.redeemedAt : '尚未兌換' }} 
          - 用戶ID: {{ code.userId ? code.userId : '未指定' }}
        </li>
      </ul>
  
      <div v-else>
        <p>目前沒有可顯示的兌換碼。</p>
      </div>
    </div>
  </template>
  
  <script>
  import { generateRedemptionCode, getAllRedemptionCodes } from '@/services/backend/redemptionCodeList'; // 引入 API 函数
  
  export default {
    data() {
      return {
        redemptionCodes: [], // 儲存兌換碼列表
        newCode: '',         // 新生成的兌換碼
      };
    },
    created() {
      // 當組件加載時，獲取所有兌換碼
      this.fetchRedemptionCodes();
    },
    methods: {
      async fetchRedemptionCodes() {
        try {
          // 从 API 获取兑换码列表
          const response = await getAllRedemptionCodes();
          console.log(response);
          
          console.log('获取的兌換碼資料:', response); // 打印响应数据
          this.redemptionCodes = response.data; // 确保将数据赋值给 redemptionCodes
        } catch (error) {
          console.error('獲取兌換碼失敗:', error);
        }
      },
      async generateCode() {
        try {
          // 從 API 獲取新生成的兌換碼
          this.newCode = await generateRedemptionCode();
          // 重新加載兌換碼列表
          this.fetchRedemptionCodes();
        } catch (error) {
          console.error('生成兌換碼失敗:', error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* 整体布局样式 */
  div {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
  }

  div:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  }

  /* 标题样式 */
  h1 {
    color: #444;
    text-align: center;
    margin-bottom: 30px;
    font-size: 2rem;
    font-weight: bold;
    letter-spacing: 1px;
  }

  /* 按钮样式 */
  button {
    background: linear-gradient(90deg, #007bff, #0056b3);
    color: white;
    border: none;
    border-radius: 25px;
    padding: 12px 20px;
    cursor: pointer;
    transition: background 0.3s, transform 0.2s;
    font-size: 16px;
    font-weight: 600;
    box-shadow: 0 2px 10px rgba(0, 123, 255, 0.3);
  }

  button:hover {
    background: linear-gradient(90deg, #0056b3, #007bff);
    transform: scale(1.05);
  }

  /* Alert 消息样式 */
  .alert {
    margin: 15px 0;
    padding: 15px;
    background-color: #d4edda;
    border: 1px solid #c3e6cb;
    border-radius: 8px;
    color: #155724;
    font-weight: bold;
    position: relative;
    transition: all 0.3s;
  }

  /* 列表样式 */
  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    background-color: #f8f9fa;
    padding: 15px;
    margin: 10px 0;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background-color 0.3s, transform 0.2s;
  }

  li:hover {
    background-color: #e9ecef;
    transform: translateY(-2px);
  }

  /* 特殊状态文本样式 */
  .status {
    font-style: italic;
    color: #6c757d;
  }

  /* 兌換碼與用戶ID的樣式 */
  .code {
    font-weight: bold;
    font-size: 1.1rem;
  }

  .userId {
    color: #007bff;
    font-weight: bold;
  }
</style>


  