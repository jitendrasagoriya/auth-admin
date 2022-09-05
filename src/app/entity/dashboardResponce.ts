export interface Application {
        id: string;
        appName: string;
        description: string;
        access: string;
        onBoardTime: any;
        isActive: boolean;
        salt: string;
        email?: any;
        password?: any;
        active: boolean;
    }

    export interface Authentication {
        userName: string;
        passward: string;
        userId: string;
        appId: string;
        token: string;
        expaireDay: number;
        creationDate: any;
        lastLogin?: any;
        isLogout: boolean;
        isActive: boolean;
        verificationCode: string;
        otp?: any;
        userType: string;
    }

    export interface Data {
        application: Application;
        authentication: Authentication[];
    }
    

    export interface DashboardResponse {
        applicationCount: number;
        userCount: number;
        newUser: number;
        loggedInCount: number;
        data: Data[];
        newUsers: Authentication[];
    }


