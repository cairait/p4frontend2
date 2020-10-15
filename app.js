const app = new Vue({
    el: "#app",
    data: {
        loggedin: false, 
        JWT: "",
        loginUN: "",
        loginPW: "",
        createUN: "",
        createPW: "",
        createEMAIL: "",
        devURL: "http://localhost:8000",
        prodURL: "https://ctb4backend.herokuapp.com",
        user: null,
        token: null,
        categories: [],
        tasks: [],
        newTask: "",
        categoryId: null,
        editID: 0,
        editTask: ""
    },

    methods: {
        handleLogin: function(){
            const URL = this.prodURL ? this.prodURL : this.devURL

            const user = {username: this.loginUN, password: this.loginPW}

            fetch(`${URL}/auth/users/login/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify(user)
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                console.log(user)
                if (data.error){
                    alert("error logging in")
                }
                else {
                    this.user = data.user
                    this.token = data.token
                    this.loggedin = true
                    this.getTasks()
                    this.getCategories()
                    this.loginUN = "" // this will reset with user logs out
                    this.loginPW = ""
                }
            })
        },
        handleLogout: function(){
            this.loggedin = false
            this.user = null
            this.token = null
        },

        handleSignup: function(event){
            const URL = this.prodURL ? this.prodURL : this.devURL
            const user = {username: this.createUN, email: this.createEMAIL, password: this.createPW}

            fetch(`${URL}/auth/users/register/`, {
             method: "POST",
             headers: {
                 "Content-Type": "application/json"
             },
             body: JSON.stringify(user)

             })
             .then(response => response.json())
             .then(data => {
                 console.log(data)

                 if(this.createEMAIL === "" && this.createUN === "" && this.createPW === ""|| data.error){
                 alert("SIGNUP UNSUCCESSFUL")
                 } else {
                    alert("SIGNUP SUCCESSFUL")
                 this.createEMAIL = ""
                 this.createUN = ""
                 this.createPW = ""
                 }
             })
        },



        getTasks: function(){
            const URL = this.prodURL ? this.prodURL : this.devURL
            fetch(`${URL}/tasks/`, {
                method: "get",
                headers:{
                    Authorization: `JWT ${this.token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                this.tasks = data
                console.log(data)
                console.log(this.tasks)
            });
        },

        getCategories: function(){
            const URL = this.prodURL ? this.prodURL : this.devURL
            fetch(`${URL}/categories/`, {
                method: "get",
                headers:{
                    Authorization: `JWT ${this.token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                this.categories = data
                console.log(data)
                console.log(this.categories)
            });
        },
        
        createTask: function(){
            const URL = this.prodURL ? this.prodURL : this.devURL;
            const task = {
                title: this.newTask,
                complete: false,
                category: this.categoryId
                }

               

            fetch(`${URL}/tasks/`, {
                method: "post",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `JWT ${this.token}`
                },
                body: JSON.stringify(task)
            })
            .then(response => {
                this.newTasks = ""
                this.getTasks()
            })
        },



        updateTask: function(event){
            const URL = this.prodURL ? this.prodURL : this.devURL;
            const id = event.target.id 
            const updated = {
                title: this.editTask,
                conplete: false,
                category: this.categoryId
            }
            console.log(this.categoryId)
            fetch(`${URL}/tasks/${id}/`, {
                method: "PUT",
                headers: {
                    Authorization: `JWT ${this.token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updated)
            })
            .then(response => {
                this.getTasks() 
            })
        },

        editSelect: function(event){
            this.editID = Number(event.target.id)
            console.log(this.editID, event.target.id)

            const theTask = this.tasks.find((tasks) => {
                return tasks.id === this.editID
            })
            this.editTask = theTask.title
        },


        deleteTask: function(event){
            const URL = this.prodURL ? this.prodURL : this.devURL
            const id = event.target.id 
            fetch(`${URL}/tasks/${id}/`,{
                method: "DELETE", 
                headers: {
                    Authorization: `JWT ${this.token}`
                },
            })
            .then(response =>{
            
                this.getTasks()
            })
        }
        

    }
});

