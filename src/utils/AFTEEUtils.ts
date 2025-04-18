import { sha256 } from 'js-sha256';

const AFTEEUtils = {
  generateAndAttachChecksum(payment: any, shopSecretKey: string): void {
    const {
      amount,
      user_no,
      sales_settled,
      description_trans,
      customer,
      dest_customers,
      items,
      validation_datetime,
    } = payment;

    const checksumPayload = {
      amount,
      user_no,
      sales_settled,
      description_trans,
      customer,
      dest_customers,
      items,
      validation_datetime,
    };

    const checksum = this.generateChecksum(checksumPayload, shopSecretKey);

    // 塞回原 payment 物件
    payment.checksum = checksum;
  },

  sortObject(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.sortObject(item)).sort((a, b) => a - b);
    } else if (typeof obj === 'object' && obj !== null) {
      const sortedKeys = Object.keys(obj).sort();
      const sortedObj: { [key: string]: any } = {};
      sortedKeys.forEach((key) => {
        sortedObj[key] = this.sortObject(obj[key]);
      });
      return sortedObj;
    } else {
      return obj;
    }
  },

  // Function to flatten the object values and concatenate them into a string
  flattenObjectValues(obj: any): string {
    let values: string[] = [];

    if (Array.isArray(obj)) {
      obj.forEach((item) => values.push(...this.flattenObjectValues(item)));
    } else if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach((key) => {
        values.push(...this.flattenObjectValues(obj[key]));
      });
    } else {
      values.push(obj);
    }

    return values.join('');
  },

  // Function to generate checksum
  generateChecksum(paymentData: any, shopSecretKey: string): string {
    // Sort the payment data
    const sortedPaymentData = this.sortObject(paymentData);
    // Flatten the sorted object values
    const valuesString = this.flattenObjectValues(sortedPaymentData);

    // Concatenate the shop secret key with the flattened string
    const finalString = shopSecretKey + ',' + valuesString;

    // Generate the SHA256 hash using js-sha256 (this returns a hex string)
    const hash = sha256(finalString);

    // Convert the hex hash to Base64 (for checksum)
    const base64Checksum = btoa(hash); // btoa() encodes the string as Base64

    return base64Checksum;
  },
};

export default AFTEEUtils;
