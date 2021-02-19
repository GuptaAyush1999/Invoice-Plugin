import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { invoiceService } from '../invoice.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.css']
})

export class CreateInvoiceComponent implements OnInit {
  id
  invoiceNumber
  pressButton=false;
  subtotal =0;
  CGST = 0;
  SGST = 0;
  IGST = 0;
  discount = 0;
  total = 0;

  createInvoiceForm : FormGroup =new FormGroup({
      
    'customerName' : new FormControl(null,[Validators.required]),
    'email' : new FormControl(null,[Validators.required,Validators.email]),
   
    'region' : new FormControl('HARYANA',[Validators.required]),
    'creator' : new FormControl('SocialEngineAddOns',[Validators.required]),

    'invoiceDate' : new FormControl(null,[Validators.required]),
    'address' : new FormControl(null,[Validators.required]),
    'contactNo' : new FormControl(null,[Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
    'currency' : new FormControl('USD',[Validators.required]),
    'products' : new FormArray([])
})




  constructor(private route : ActivatedRoute,
              private invoiceService : invoiceService,
              private router : Router,
              private toastr: ToastrService
) {}

  ngOnInit(): void {

   this.invoiceService.getInvoiceNumber().subscribe(res => {
     let count =res;
     this.invoiceNumber=`000${count}/SE/20-21`
   })
    this.route.params.subscribe((Params:Params) => {
    this.id=Params['id']
   })

}

  onAddAmount(){
    let productArray = this.createInvoiceForm.value.products;
    this.subtotal= productArray.reduce((a,b)=> a + b.qty * b.price, 0)
    if(this.createInvoiceForm.value.currency === 'USD'){
      this.total=this.subtotal
    }
    else if(this.createInvoiceForm.value.currency === 'INR'){
      this.discount = Number((this.subtotal * 0.10).toFixed(2));
      if(this.createInvoiceForm.value.region === 'HARYANA'){
        this.CGST = Number((this.subtotal * 0.09).toFixed(2));
        this.SGST = Number((this.subtotal * 0.09).toFixed(2));
        this.total = Number((this.subtotal - this.discount + this.CGST + this.SGST).toFixed(2)) 
      }
       else if(this.createInvoiceForm.value.region === 'OUT OF HARYANA'){
         this.IGST = Number((this.subtotal * 0.18).toFixed(2));
         this.total = Number((this.subtotal - this.discount + this.IGST).toFixed(2))
        }
   }
    this.pressButton=true
   
  }

  get controls() { // a getter!
    return (<FormArray>this.createInvoiceForm.get('products')).controls;
  }

  addProduct() {
    (<FormArray>this.createInvoiceForm.get('products')).push(
      new FormGroup({
        'name': new FormControl(null,[Validators.required]),
        'qty': new FormControl(null,[Validators.required,Validators.pattern(/^[1-9]+[0-9]*$/)]),
        'price': new FormControl(null,[Validators.required,Validators.pattern(/^[1-9]+[0-9]*$/)])
      })
    );

  }

  onDelete(index : number){
    (<FormArray>this.createInvoiceForm.get('products')).removeAt(index);
  }

  onSubmit(){
    if(this.createInvoiceForm.value.currency === 'USD'){
      this.createInvoiceForm.value.region= null
    }
   
    let invoiceData={
       creator : this.createInvoiceForm.value.creator,
       customerName : this.createInvoiceForm.value.customerName,
       address : this.createInvoiceForm.value.address,
       contactNo : this.createInvoiceForm.value.contactNo,
       email : this.createInvoiceForm.value.email,
       invoiceNo : this.invoiceNumber,
       invoiceDate : this.createInvoiceForm.value.invoiceDate,
       currency : this.createInvoiceForm.value.currency,
       region : this.createInvoiceForm.value.region,
       totalPrice : this.total,
       products : this.createInvoiceForm.value.products,
}

    this.invoiceService.createInvoice(invoiceData,this.id).subscribe(res => {
      this.router.navigate(['/home'],{relativeTo:this.route})
      this.toastr.success('Invoice Created!!!');
    },error =>{
      this.toastr.error('Invalid Invoice Data!!!');
    })

    this.createInvoiceForm.reset();
   
    this.CGST=0;
    this.SGST=0;
    this.IGST=0;
    this.subtotal=0;
    
  }
}
