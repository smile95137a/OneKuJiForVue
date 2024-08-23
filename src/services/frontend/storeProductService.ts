import { api } from './FrontAPI';

const basePath = '/api/storeProduct';

export const getAllStoreProducts = async (): Promise<any[]> => {
  try {
    const response = await api.get(`${basePath}/all`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching all store products:', error);
    throw error;
  }
};

// 新增商品
export const addStoreProduct = async (
  productReq: any,
  images?: File[]
): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('productReq', JSON.stringify(productReq));

    if (images) {
      images.forEach((image) => {
        formData.append('images', image);
      });
    }

    const response = await api.post(`${basePath}/add`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error adding store product:', error);
    throw error;
  }
};

// 更新商品
export const updateStoreProduct = async (
  id: number,
  productReq: any,
  images?: File[]
): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('storeProductReq', JSON.stringify(productReq));

    if (images) {
      images.forEach((image) => {
        formData.append('images', image);
      });
    }

    const response = await api.put(`${basePath}/update/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error updating store product:', error);
    throw error;
  }
};

// 刪除商品
export const deleteStoreProduct = async (id: number): Promise<void> => {
  try {
    await api.delete(`${basePath}/delete/${id}`);
  } catch (error) {
    console.error('Error deleting store product:', error);
    throw error;
  }
};
