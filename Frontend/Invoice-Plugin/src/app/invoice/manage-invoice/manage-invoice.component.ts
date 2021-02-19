
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Invoice } from '../invoice.interface';
import { invoiceService } from '../invoice.service';
import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginator} from '@angular/material/paginator';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-invoice',
  templateUrl: './manage-invoice.component.html',
  styleUrls: ['./manage-invoice.component.css']
})
export class ManageInvoiceComponent implements OnInit {
  id : any
  lis:any=[];
  isSuperAdmin= false;
 
  displayedColumns = ["select","invoiceDate","invoiceNo","customerName","creator","status","totalPrice","actions"];
  data
  dataSource
  selection = new SelectionModel<any>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;

  editStatus : FormGroup = new FormGroup({
    status : new FormControl(null,Validators.required)
  })



  constructor(private router : Router,
    private route : ActivatedRoute,
    private invoiceService : invoiceService) { }


    ngOnInit(): void {
      this.route.params.subscribe((Params:Params) => {
        this.id=Params['id']
       })
     
       let userData= JSON.parse(localStorage.getItem('userData'))
       this.isSuperAdmin = userData.isSuperAdmin;


      this.onGetAllInvoices()

    }
  
    onGetAllInvoices(){

      if(this.isSuperAdmin){
        this.invoiceService.getAllInvoices().subscribe(res => {
          this.data=res
          this.dataSource = new MatTableDataSource<Invoice[]>(this.data);
          
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        })

      }
     else{
      this.invoiceService.getInvoices().subscribe(res => {
        this.data=res
        this.dataSource = new MatTableDataSource<Invoice[]>(this.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
     })
     }
    
     
   }

   onCreateInvoice(){
    this.router.navigate([`/${this.id}/invoice`],{relativeTo:this.route})
   }
  
   onEdit(row:string) {
     this.router.navigate([`editinvoice/${row}`])
  }

  onDownload(row : string){
    let invoiceData
    this.invoiceService.getInvoiceById(row).subscribe(res => {
      invoiceData=res;
      this.invoiceService.downloadAsPDF(invoiceData)
    })
}
  
  onDelete(row:string) {
   if(confirm('Are you sure???')){
   this.invoiceService.deleteInvoice(row).subscribe(res => {
    this.data = this.data.filter((value)=> value._id !== row);
    this.dataSource = new MatTableDataSource<Invoice[]>(this.data);
  })
  }
   
  }

   /** Whether the number of selected elements matches the total number of rows. */
   isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteData() {  
    // debugger;  
    const numSelected = this.selection.selected;  
      if(numSelected.length > 0){
        if(confirm('Are you sure???')){
     
          for(let invoiceData of numSelected){
            const id = invoiceData._id
            this.invoiceService.deleteInvoice(id).subscribe(res => {
            
              this.data = this.data.filter((value)=> value._id !== id);
              this.dataSource = new MatTableDataSource<Invoice[]>(this.data);
            })
          }
         
         }
      } else{
        alert("Please Select At Least One Invoice!!!")
      }

} 
downloadData= async() =>{
  const numSelected = this.selection.selected; 
  if(numSelected.length > 0){
    for(let invoiceData of numSelected){
      await this.invoiceService.downloadAsPDF(invoiceData)
     }
  } else{
    alert("Please Select At Least One Invoice!!!")
  }
 
}

onFilterButton(value : string){
  if(value === 'All'){
    this.onGetAllInvoices();
  }else{
    this.dataSource.filter=value
  }

  
}

statusChanged(){

  const updatedInvoice = {
     updatedStatus : this.editStatus.value.status
  }
  
  
  const numSelected = this.selection.selected;  

  if(numSelected.length > 0){
    if(confirm('Are you sure???')){
 
      for(let invoiceData of numSelected){
        const id = invoiceData._id
        this.invoiceService.editStatus(id,updatedInvoice).subscribe(res => {
        
          this.data = res;
          this.onGetAllInvoices();
        
        })
      }
     
     }
  } else{
    alert("Please Select At Least One Invoice!!!")
  }

}


}
