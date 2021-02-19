import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Product, Invoice} from './invoice.interface';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Subject } from 'rxjs';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
    providedIn:'root'
})

export class invoiceService{

  invoicesChanged = new Subject<Invoice>();

   constructor(private http : HttpClient){ 
      
    } 
    getInvoiceNumber(){
      return this.http.get(`http://localhost:5000/api/invoices/invoicenumber`)
    }

    createInvoice(invoiceData : object,id:number){
        invoiceData = invoiceData;
        return this.http.post(`http://localhost:5000/api/invoices/${id}`,invoiceData)

    }

    getAllInvoices(){
        return this.http.get(`http://localhost:5000/api/invoices`)
    }

    getInvoices(){
        return this.http.get<Invoice[]>(`http://localhost:5000/api/invoices/myinvoices`)
    }

    getInvoiceById(id : string){
        return this.http.get<Invoice[]>(`http://localhost:5000/api/invoices/getinvoice/${id}`)
    } 

    updateInvoice(updatedInvoiceData : object, id : string){
        return this.http.put(`http://localhost:5000/api/invoices/edit/${id}`,updatedInvoiceData)
    }

    deleteInvoice(id : string){
        return this.http.delete(`http://localhost:5000/api/invoices/delete/${id}`)
    }

    editStatus(id : string,updatedInvoice : Object){
      return this.http.put(`http://localhost:5000/api/invoices/editStatus/${id}`,updatedInvoice)
    }


    getBase64ImageFromURL(url) {
      return new Promise((resolve, reject) => {
        var img = new Image();
        img.setAttribute("crossOrigin", "anonymous");
        img.onload = () => {
          var canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          var dataURL = canvas.toDataURL("image/png");
          resolve(dataURL);
        };
        img.onerror = error => {
          reject(error);
        };
        img.src = url;
      });
    }

  async downloadAsPDF(invoiceData : any){
        invoiceData = invoiceData
        console.log(invoiceData)
   
        let docDefinition = {
       header : {
        image :await this.getBase64ImageFromURL('https://media-exp1.licdn.com/dms/image/C510BAQEerg9Php-ljw/company-logo_200_200/0/1547621657300?e=2159024400&v=beta&t=uw4iG6hRSu-zRds7iG22wZ_sKoPOYvfY67jslKI4gF0'),
        // fit : [60,60],
        width : 100,
        height : 80,
        alignment: 'right',
        // margin : [0,0,0,40]
       },
        
          content: [
          
         
            {
              text: 'INVOICE',
              fontSize: 20,
              bold: true,
              alignment: 'center',
              decoration: 'underline',
              color: 'skyblue'
            },
            {
              text: 'Customer Details',
              style: 'sectionHeader'
            },
            {
              columns: [
                [
                  {
                    text: `Bill To: ${invoiceData.customerName} `,
                  
                    bold:true
                  },
                  { text: `address : ${invoiceData.address}` },
                  { text: `email : ${invoiceData.email}` },
                  { text: `Contact No : ${invoiceData.contactNo}` }
                ],
                [
                  {
                    text: `Date: ${new Date().toLocaleString()}`,
                    alignment: 'right'
                  },
                  { 
                    text: `Invoice No : ${invoiceData.invoiceNo}`,
                    alignment: 'right'
                  }
                ]
              ]
            },
            
            {
              text: 'Order Details',
              style: 'sectionHeader'
            },
            {
              table: {
                headerRows: 1,
                widths: ['*', 'auto', 'auto', 'auto'],
                body: [
                  ['Product', 'Price', 'Quantity', 'Amount'],
                  ...invoiceData.products.map(p => ([p.name, p.price, p.qty, (p.price*p.qty).toFixed(2)])),
                  [{text: 'Total Amount(Including All Taxes)', colSpan: 3, bold: true}, {}, {}, invoiceData.totalPrice]
                ]
              }
            },
            {
              text: 'Additional Details',
              style: 'sectionHeader'
            },
            {
                text: 'PAN NO. : HBHVXBVA62837',
             },
             {
                text: 'GST NO. : XBVA62837XXXXXXXXXXX',
             },
             {
                text: 'LUT NO. : HBHVXBVA62837/GJHHH/7976',
             },
             {
                text: 'Bank Details :',
                bold:true,
                margin : [0,15,0,15]
             },
             {
                 columns : [
                     {
                        text: 'Account Name : ',
                        width : 'auto'
                     },
                     {
                        text: 'Bigstep Technologies Pvt Ltd.',
                        bold: true ,
                        margin : [0,0,0,0],
                        width : '*'
                     }
                 ],
                 columnGap: 1
                
             },
             {
              columns : [
                {
                   text: 'Account NO : ',
                   width : 'auto'
                },
                {
                   text: 'xxxxxxxxxxxx',
                   bold: true ,
                   margin : [0,0,0,0],
                   width : '*'
                }
            ],
            columnGap: 1
               
             },
             {
              columns : [
                {
                   text: 'Bank : ',
                   width : 'auto'
                },
                {
                   text: 'HDFC Bank Ltd',
                   bold: true ,
                   margin : [0,0,0,0],
                   width : '*'
                }
            ],
            columnGap: 1
               
             },
             {
              columns : [
                {
                   text: 'Account Address : ',
                   width : 'auto'
                },
                {
                   text: 'HDFC Bank Ltd, Old Judicial Park,Gurgaon, Haryana,India',
                   bold: true ,
                   margin : [0,0,0,0],
                   width : '*'
                }
            ],
            columnGap: 1
               
             },
             {
              columns : [
                {
                   text: 'IFSC Code : ',
                   width : 'auto'
                },
                {
                   text: 'HDFC00000913',
                   bold: true ,
                   margin : [0,0,0,0],
                   width : '*'
                }
            ],
            columnGap: 1
               
             },
             {
              columns: [
                [{ qr: `${invoiceData.customerName}`, fit: '50',margin: [0,20,0,150]}],
                [{ text: 'Signature', alignment: 'right', italics: true, margin: [0,20,0,150]}],
              ]
            },
             {
              canvas: [
                  {
                      type: 'line',
                      x1: 0,
                      y1: 5,
                      x2: 535,
                      y2: 5,
                      lineWidth: 0.3,
                      opacity : 0.5,
                      // margin : [15,15,15,70]
                  }
              ]
          },
          {
            
            columns: [
              [
                {
                  text: `Bigstep Technologies Private Limited. `,
                
                  bold:true,
                  margin : [0,30,0,0],
                  fontSize : 10
                },
                { text: ` Judicial Complex, Sector 15`,fontSize : 10},
                { text: `Gurgaon-122001, Haryana,India`,fontSize : 10 },
                { text: `Email :- info@bigstep.com`,fontSize : 10 },
                { text: `CIN:UN76E82726892GVDHSVWVYBHVY` ,fontSize : 10}
              ],
              [
                {
                  text: `2nd Floor,SCO-63,Old`,
                  alignment: 'right',
                  margin : [0,30,0,0],
                  fontSize : 10
                },
                { 
                  text: `Phone No. :- 91-9414xxxx62`,
                  alignment: 'right',
                  margin : [0,10],
                  fontSize : 10
                },
                { 
                  text: `http://www.bigstep.com`,
                  alignment: 'right',
                  fontSize : 10
                }
              ],
            
              // { canvas: [{ type: 'line', x1: 10, y1: 10, x2: 595-10, y2: 10, lineWidth: 0.5 }] }

            ],
            
          }, 
          ],
          styles: {
            sectionHeader: {
              bold: true,
              decoration: 'underline',
              fontSize: 14,
              margin: [0, 15,0, 15]          
            }
          }
        };
        pdfMake.createPdf(docDefinition).download('invoice.pdf');
      }

}