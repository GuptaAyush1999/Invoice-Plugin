import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { User } from '../home.interface';
import { homeService } from '../home.service';
import { ToastrService } from 'ngx-toastr';
import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';


@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  selection = new SelectionModel<any>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  data
  id : any
  lis:any=[];
  displayedColumns = ["select","name","email","actions"];
  dataSource

  constructor(private homeService: homeService,
    private router : Router,
    private route : ActivatedRoute,
  
    private authService : AuthService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.onGetAllUsers()
  }

  onGetAllUsers(){
    this.homeService.getUsers().subscribe(res => {
      this.data=res
          this.dataSource = new MatTableDataSource<User[]>(this.data);
      
       console.log(this.dataSource)
       this.dataSource.paginator = this.paginator;
       this.dataSource.sort = this.sort;
    })
   
 }

 onEdit(row:string) {
   console.log('Row clicked: ', row);
   this.router.navigate([`/${row}/editProfile`],{relativeTo:this.route})
}

onDelete(row:string) {
 if(confirm('Are you sure???')){
 console.log('Row clicked: ', row);
 this.homeService.deleteUser(row).subscribe(res => {
   console.log(res)
   this.data = this.data.filter((value)=> value._id !== row);
   this.dataSource = new MatTableDataSource<User[]>(this.data);
   this.toastr.success('successfully Deleted!!!');
 },error => {
  this.toastr.error('Something Went Wrong . Please Try Again!!!!');
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
      console.log(numSelected)
      if(numSelected.length > 0){
        if(confirm('Are you sure???')){
     
          for(let userData of numSelected){
            const id = userData._id
            this.homeService.deleteUser(id).subscribe(res => {
              console.log(res)
              this.data = this.data.filter((value)=> value._id !== id);
              this.dataSource = new MatTableDataSource<User[]>(this.data);
            })
          }
         
         }
      } else{
        alert("Please Select At Least One User!!!")
      }

} 

}
