import { Component , OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginResponse } from 'src/app/entity/loginResponse';
import { SidebarService } from '../sidebar/sidebar.service';


@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit{

    loggedInUser : LoginResponse = {} as LoginResponse;
    isUserLoggedIn: boolean = false;

    constructor(public sidebarservice: SidebarService,private router: Router) { 
        this.isUserLoggedIn = Boolean(localStorage.getItem("isLoggedIn"));
        if(this.isUserLoggedIn) {
            this.loggedInUser.userName = localStorage.getItem("userName");
            this.loggedInUser.userType = localStorage.getItem("userType");
        }else {
            this.loggedInUser.userName = "Guest";
            this.loggedInUser.userType = "";
        }
    }

    login() {
        this.router.navigate(['auth/sign-in'])
    }

    logout(){
        localStorage.clear();
        this.router.navigate(['auth/sign-in'])
    }
        
    toggleSidebar() {
        this.sidebarservice.setSidebarState(!this.sidebarservice.getSidebarState());
    }
    
    getSideBarState() {
        return this.sidebarservice.getSidebarState();
    }

    hideSidebar() {
        this.sidebarservice.setSidebarState(true);
    }

    ngOnInit() {

        /* Search Bar */
        $(document).ready(function () {
            $(".search-toggle-icon").on("click", function() {
                $(".top-header .navbar form").addClass("full-searchbar")
            })
            $(".search-close-icon").on("click", function() {
                $(".top-header .navbar form").removeClass("full-searchbar")
            })
            
        });

    }
}
