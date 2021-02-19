import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { invoiceService } from '../../invoice.service';
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-edit-invoice',
  templateUrl: './edit-invoice.component.html',
  styleUrls: ['./edit-invoice.component.css']
})
export class EditInvoiceComponent implements OnInit {
  id : any
  editMode = false;
  invoiceData

  subtotal =0;
  CGST = 0;
  SGST = 0;
  IGST = 0;
  discount = 0;
  total = 0;
  
  pressButton=false;
  editInvoiceForm : FormGroup = new FormGroup({
    customerName : new FormControl(null,[Validators.required]),
    email : new FormControl(null,[Validators.required,Validators.email]),

    region : new FormControl(null || 'HARYANA',[Validators.required]),
    creator  : new FormControl(null,[Validators.required]),

    invoiceDate : new FormControl(null,[Validators.required]),
    address : new FormControl(null,[Validators.required]),
    contactNo : new FormControl(null,[Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
    currency : new FormControl(null,[Validators.required]),
    products : new FormArray([])
  });



  constructor(private invoiceService : invoiceService,
              private route : ActivatedRoute,
              private router : Router,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
    });
  

    
  }

  onAddAmount(){
    let productArray = this.editInvoiceForm.value.products;
   
    this.subtotal= productArray.reduce((a,b)=> a + b.qty * b.price, 0)
 
    if(this.editInvoiceForm.value.currency === 'USD'){
      this.total=this.subtotal
    }
    else if(this.editInvoiceForm.value.currency === 'INR'){
      this.discount = this.subtotal * 0.10;
      if(this.editInvoiceForm.value.region === 'HARYANA'){
        this.CGST = this.subtotal * 0.09;
        this.SGST = this.subtotal * 0.09;
        this.total = this.subtotal - this.discount + this.CGST + this.SGST 
      }
       else if(this.editInvoiceForm.value.region === 'OUT OF HARYANA'){
         this.IGST = this.subtotal * 0.18;
         this.total = this.subtotal - this.discount + this.IGST 
        }
  
     
    }
    this.pressButton=true
   
   
  }

  get controls() { // a getter!
    return (<FormArray>this.editInvoiceForm.get('products')).controls;
  }

  addProduct() {
    (<FormArray>this.editInvoiceForm.get('products')).push(
      new FormGroup({
        'name': new FormControl(null,[Validators.required]),
        'qty': new FormControl(null,[Validators.required]),
        'price': new FormControl(null,[Validators.required])
      })
    );

  }

  onDelete(index : number){
    (<FormArray>this.editInvoiceForm.get('products')).removeAt(index);
  }

  onSubmit(){
   
    if(this.editInvoiceForm.value.currency === 'USD'){
      this.editInvoiceForm.value.region= null
    }
  
   
    let updatedInvoiceData={
       creator : this.editInvoiceForm.value.creator,
       customerName : this.editInvoiceForm.value.customerName,
       address : this.editInvoiceForm.value.address,
       contactNo : this.editInvoiceForm.value.contactNo,
       email : this.editInvoiceForm.value.email,
       invoiceDate : this.editInvoiceForm.value.invoiceDate,
       currency : this.editInvoiceForm.value.currency,
       region : this.editInvoiceForm.value.region,
       totalPrice : this.total,
       products : this.editInvoiceForm.value.products,
}


    this.invoiceService.updateInvoice(updatedInvoiceData,this.id).subscribe(res => {
    
      this.toastr.success('Successfully Updated Invoice');
      this.router.navigate(['/home'],{relativeTo:this.route})

    },error => {
      this.toastr.error('Invoice Not Found!!!');
    })

    this.editInvoiceForm.reset();
  
    this.CGST=0;
    this.SGST=0;
    this.IGST=0;
    this.subtotal=0;
  }

  
  private initForm(){
    let customerName = '';
    let email = '';
    let region = '';
    let creator = '';
    let invoiceDate = '';
    let address = '';
    let contactNo;
    let currency = '';
    let productDetail = new FormArray([]);
    if(this.editMode){
     
    this.invoiceService.getInvoiceById(this.id).subscribe(res => {
     
        this.invoiceData= res;
      
      
        customerName = this.invoiceData.customerName;
        email = this.invoiceData.email;
        region = this.invoiceData.region;
        creator = this.invoiceData.creator;
        invoiceDate = this.invoiceData.invoiceDate.slice(0,10);
        address = this.invoiceData.address;
        contactNo = this.invoiceData.contactNo;
        currency = this.invoiceData.currency;
      

        if(this.invoiceData['products']){
          for(let product of this.invoiceData.products){
            productDetail.push(
              new FormGroup({
                name: new FormControl(product.name,[Validators.required]),
                qty: new FormControl(product.qty,[Validators.required]),
                price: new FormControl(product.price,[Validators.required])
              })
            );
          }
        }

        this.editInvoiceForm = new FormGroup({
          customerName : new FormControl(customerName,[Validators.required]),
          email : new FormControl(email,[Validators.required,Validators.email]),
   
          region : new FormControl(region || 'HARYANA',[Validators.required]),
          creator  : new FormControl(creator,[Validators.required]),

          invoiceDate : new FormControl(invoiceDate,[Validators.required]),
          address : new FormControl(address,[Validators.required]),
          contactNo : new FormControl(contactNo,[Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
          currency : new FormControl(currency,[Validators.required]),
          products : productDetail
        });

      

      });
      
     
     
    }
  }
}


