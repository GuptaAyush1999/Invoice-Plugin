export interface Product{
    name: string;
    price: number;
    qty: number;
    // amount?: number
}

 export interface Invoice{
   _id : string
   creator : string;
    customerName: string;
    address: string;
    contactNo: number;
    email: string;
    invoiceNo : string;
    invoiceDate : Date;
    currency : string;
    region?:string;
 
    totalPrice : number;
    products: Product[]
   
  
  }