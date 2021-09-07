import { Component, OnInit } from '@angular/core';
import { Roles } from '../../interfaces/roles';
import { UserTableConfig, User } from '../../interfaces/user';
import { TABLE_CONFIG, BTN_TEXT } from '../constants/user.constant';
import { RoleService } from '../services/role.service';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  public editIndex: number | undefined;
  public isLoading: boolean = false;
  public originalUserList: Array<User> = [];
  public tableConfig: Array<UserTableConfig> = TABLE_CONFIG;
  public userList: Array<any> = [];
  public roles: Array<Roles> = [];
  public btnTxt: string = BTN_TEXT.load;
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService
  ) { }

  ngOnInit(): void {
    this.roleService.findAll().subscribe(resp => {
      this.roles = resp;
    });
  }

  loadUserData(): void {
    this.isLoading = true;
    this.userService.findAll().subscribe((resp: User[]) => {
      if (resp) {
        this.userList = this.originalUserList = resp;
      }
      this.btnTxt = BTN_TEXT.refresh;
      this.isLoading = false;
    }, () => {
      this.isLoading = false;
    });
  }

  public enableEditing(index?: number): void {
    this.editIndex = index || index === 0 ? index : undefined;
  }

  public cancelEditing(index?: number): void {
    this.editIndex =  undefined;
    this.userList = this.originalUserList;
  }

  public editUser(): void {
    if (this.editIndex) {
      const userData = this.userList[this.editIndex]; 
      this.userService.update(userData.id, userData).subscribe(resp => {
        this.editIndex = undefined;
        this.loadUserData();
      }, () => {

      });
    }
  }

  public deleteUser(index: number): void {
    this.userService.delete(this.userList[index].id).subscribe(resp => {
      this.userList.splice(index, 1);
    }, () => {
      console.log('Error while deleting user');
    });
  }

}
