let currentpage = 1
let lastPage = 1
window.addEventListener("scroll",function() {
    const endOfPage = this.window.innerHeight + this.window.pageYOffset >= this.document.body.offsetHeight;
    if(endOfPage && currentpage < lastPage){
        currentpage = currentpage + 1
        getposts(false,currentpage)
    }
})
getposts()
function getposts(reload=true,page=1) {
    axios.get(`https://tarmeezacademy.com/api/v1/posts?limit=100&page=${page}`)
    .then(respons => {
        let posts = respons.data.data
        lastPage = respons.data.meta.last_page
        if(reload){
            document.getElementById("post").innerHTML =""
        }
        let content =""
        for(let i of posts){
             content+=`
            <div  class="card shadow">
        <div class="card-header" >
            <img src="${i.author.profile_image}" alt="" style="width: 40px;height: 40px;margin-right:5px;" class="rounded-circle border border-1">
            <p class="d-inline"><b>${i.author.username}</b></p>
            <button onclick="editpost(${encodeURIComponent(JSON.stringify(i))})" style="position:absolute;right:30px;top:11px" class="btn btn-secondary">Edit</button>
        </div>
        <div onclick="postdetalies(${i.id})" style="cursor: pointer;"  class="card-body" >
            <img src="${i.image}" alt="" style="width: 100%;">
            <h6 style="color:rgb(193, 193, 193) ;" class="mt-1">${i.created_at}</h6>
            <h5>${i.title == null ? "": i.title}</h5>
            <p>${i.body}</p> 
            <hr>
            <div >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                </svg>
                <span>(${i.comments_count}) Comment</span>
                <span id="post-tag-${i.id}">
                </span>
            </div>
        </div>
        </div>
            `
            document.getElementById("post").innerHTML += content
            let currenttags = `post-tag-${i.id}`
            document.getElementById(currenttags).innerHTML = ""
            let tagscontent=""
            for(tag of tags){
                 tagscontent +=`
                <button class="btn btn-sm rounded-5" style="background-color:gray;color:white">
                    ${tag.name}
                    </button>
                `
                document.getElementById(currenttags).innerHTML = tagscontent
            }
        }

    })
}
 setUi()
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
    })}
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
function Creatnewpost() {
    let title = document.getElementById("post-title-input").value
    let body = document.getElementById("post-body-input").value
    let img = document.getElementById("image-post-input").files[0]
    const token = localStorage.getItem("token")
    const header = {
        "authorization":`Bearer ${token}`
    }
    let formdata = new FormData()
    formdata.append("title",title)
    formdata.append("body",body)
    formdata.append("image",img)
     axios.post("https://tarmeezacademy.com/api/v1/posts",formdata,{
        headers: header
     })
    .then(response => {
        const modal = document.getElementById("post-modal")
        const modalinstance = bootstrap.Modal.getInstance(modal)
        modalinstance.hide()
         showsucc("Post creat has be successfuly")
         getposts()
    }).catch(error => {
        const msg = error.response.data.message
        showsucc(msg,'danger')
    })
}
function getcurrentuser(){
    let user = null
    const storguser = localStorage.getItem("user")
    if(storguser != null ){
        user = JSON.parse(storguser )
    }
    return user
}
function postdetalies(postid) {
    console.log(postid)
   window.location=`postdetali.html?postId=${postid}`
}
function editpost(postid){
    
    let post = JSON.parse(decodeURIComponent(postid))
    console.log(post)
    document.getElementById("post-edit-modal").innerHTML = "Edit Post"
    document.getElementById("post-title-input").innerHTML = post.title
    document.getElementById("post-body-input").innerHTML = post.body
    let postmodal = new bootstrap.Modal(document.getElementById("register"))
    postmodal.toggle()
}