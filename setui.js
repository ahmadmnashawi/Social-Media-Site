function setUi() {
    let logindiv = document.getElementById("login-div")
    let logoutdiv = document.getElementById("logout-div")
    let btnpost = document.getElementById("add-button")
    let commentside = document.getElementById("comment-bar")
   const token =  localStorage.getItem("token")
   if(token == null){
     logindiv.style.setProperty("display", "flex", "important")
     logoutdiv.style.setProperty("display", "none", "important")
     if (commentside !=null) {
    commentside.style.setProperty("display","none","important")
}
    if(btnpost != null){
    btnpost.style.setProperty("display", "none", "important")
    }
}
else {
    logoutdiv.style.setProperty("display", "flex", "important")
    logindiv.style.setProperty("display", "none", "important")
     if (commentside !=null) {
    commentside.style.setProperty("display","flex","important")
}
     if(btnpost != null){
        btnpost.style.setProperty("display", "block", "important")
    }
    const user = getcurrentuser()
    document.getElementById("nav-user").innerHTML = user.username
    document.getElementById("profail-image").src = user.profile_image
   }
}
 function loginbtnclick(){
    const username = document.getElementById("user-input").value
    const password = document.getElementById("password-input").value
    let params = {
        username:username,
        password:password
    }
    axios.post("https://tarmeezacademy.com/api/v1/login",params)
    .then(response => {
        localStorage.setItem("token",response.data.token)
        localStorage.setItem("user",JSON.stringify(response.data.user))
        const modal = document.getElementById("login-modal")
        const modalinstance = bootstrap.Modal.getInstance(modal)
        modalinstance.hide()
        showsucc("Login Successful")
       setUi() 
    }).catch(error => {
        alert(error)
    })
    }
function registerntnlogin(){
    const name = document.getElementById("register-name-input").value
    const username = document.getElementById("register-username-input").value
    const password = document.getElementById("register-password-input").value
    const image = document.getElementById("register-image-input").files[0]
    let formsdata = new FormData()
    formsdata.append("username",username)
    formsdata.append("name",name)
    formsdata.append("password",password)
    formsdata.append("image",image)
    
    axios.post("https://tarmeezacademy.com/api/v1/register",formsdata)
    .then(response => {
        localStorage.setItem("token",response.data.token)
        localStorage.setItem("user",JSON.stringify(response.data.user))
        const modal = document.getElementById("register-modal")
        const modalinstance = bootstrap.Modal.getInstance(modal)
        modalinstance.hide()
        showsucc("New User Register Successful")
       setUi() 
    }).catch(error => {
        const msg = error.response.data.message
        showsucc(msg,'danger')
    })

}
function logout(){
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    showsucc("logout succsessful")
    setUi()
}
function showsucc(messagea,type="success") {
    const alertPlaceholder = document.getElementById('success-alert')
    const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
    ].join('')

  alertPlaceholder.append(wrapper)
}
appendAlert(messagea,type)
setTimeout(()=>{
    const alert = bootstrap.Alert.getOrCreateInstance('#success-alert')
    // alert.close()
},2000)
}
function getcurrentuser(){
    let user = null
    const storguser = localStorage.getItem("user")
    if(storguser != null ){
        user = JSON.parse(storguser )
    }
    return user
}